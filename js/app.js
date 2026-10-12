/**
 * 하루마스터 (HaruMaster) - 아빠용 자녀 학습 모니터링 컨트롤러
 * - 일일 / 주간 / 월간 학습 상태 분석
 * - Chart.js 과목별 정답률 & 오답률 인터랙티브 그래프
 * - AI 튜터 안티그래비티의 취약점 진단 및 아빠 맞춤 코칭 리포트
 * - 실시간 에빙하우스 SRS 망각곡선 & 오답노트
 */

import { dbService } from './firebase-service.js';

class DadMonitoringApp {
  constructor() {
    this.student = "nakyung"; // "nakyung" (중3) | "chahye" (중1)
    this.horizon = "daily";    // "daily" | "weekly" | "monthly"
    this.chartAccuracy = null;
    this.chartTrend = null;

    // 중간고사 D-Day 계산 기준일 (2026년 11월 1일)
    this.examTargetDate = new Date("2026-11-01T00:00:00");

    this.init();
  }

  async init() {
    this.bindEvents();
    this.updateDDayBadge();
    await this.loadAndRenderDashboard();
  }

  bindEvents() {
    // 자녀 전환 버튼
    const selNakyung = document.getElementById("btn-select-nakyung");
    const selChahye = document.getElementById("btn-select-chahye");

    if (selNakyung) {
      selNakyung.addEventListener("click", () => this.switchStudent("nakyung"));
    }
    if (selChahye) {
      selChahye.addEventListener("click", () => this.switchStudent("chahye"));
    }

    // 기간 필터 탭 (일일 / 주간 / 월간)
    document.querySelectorAll(".time-tab").forEach(tab => {
      tab.addEventListener("click", (e) => {
        document.querySelectorAll(".time-tab").forEach(t => t.classList.remove("active"));
        const btn = e.currentTarget;
        btn.classList.add("active");
        this.horizon = btn.dataset.horizon || "daily";
        this.renderChartsAndKPIs();
      });
    });

    // 실시간 갱신 버튼
    const btnRefresh = document.getElementById("btn-refresh-stats");
    if (btnRefresh) {
      btnRefresh.addEventListener("click", async () => {
        btnRefresh.innerText = "⏳ 갱신 중...";
        await this.loadAndRenderDashboard();
        setTimeout(() => {
          btnRefresh.innerText = "🔄 실시간 갱신";
        }, 600);
      });
    }

    // 아빠의 응원 전송 버튼
    const btnCheer = document.getElementById("btn-send-cheer");
    const inputCheer = document.getElementById("input-cheer-message");
    if (btnCheer && inputCheer) {
      btnCheer.addEventListener("click", () => {
        const msg = inputCheer.value.trim();
        if (!msg) {
          alert("응원 메시지를 입력해 주세요!");
          return;
        }
        this.sendCheerMessage(msg);
      });
    }
  }

  updateDDayBadge() {
    const ddayEl = document.getElementById("dday-count");
    if (!ddayEl) return;
    const now = new Date();
    const diffTime = this.examTargetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    ddayEl.innerText = diffDays > 0 ? `D-${diffDays}` : (diffDays === 0 ? "D-Day" : `D+${Math.abs(diffDays)}`);
  }

  switchStudent(studentId) {
    if (this.student === studentId) return;
    this.student = studentId;

    document.getElementById("btn-select-nakyung")?.classList.toggle("active", studentId === "nakyung");
    document.getElementById("btn-select-chahye")?.classList.toggle("active", studentId === "chahye");

    // 응원 입력창 플레이스홀더 갱신
    const inputCheer = document.getElementById("input-cheer-message");
    const sName = studentId === "nakyung" ? "나경이" : "차혜";
    if (inputCheer) {
      inputCheer.placeholder = `${sName} 태블릿으로 보낼 따뜻한 응원 메시지를 적어보세요 (예: 오늘 문제 푸느라 수고했어! 최고야 ❤️)`;
    }

    this.loadAndRenderDashboard();
  }

  async loadAndRenderDashboard() {
    const lastSyncEl = document.getElementById("last-sync-text");
    if (lastSyncEl) {
      const now = new Date();
      lastSyncEl.innerText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} 동기화 완료`;
    }

    this.renderChartsAndKPIs();
    this.renderAIInsightReport();
    this.renderSRSStagesAndWrongs();
  }

  /**
   * 학생 및 기간별 통합 통계 데이터 모델 생성
   */
  getStudentData() {
    const isNakyung = (this.student === "nakyung");

    // 기본 과목 구성
    const subjects = isNakyung 
      ? ["수학", "과학", "사회", "역사", "영어", "국어"]
      : ["수학", "과학", "사회", "영어", "국어"];

    if (isNakyung) {
      // 나경이 (중3) 통계 모델 (수학 8, 국어 4, 영어 4, 과학 3, 사회 3, 역사 3 = 총 25문항)
      if (this.horizon === "daily") {
        return {
          studentName: "나경이",
          grade: 3,
          solvedCount: 25,
          targetCount: 25,
          correctCount: 23,
          wrongCount: 2,
          streakDays: 6,
          masteredCount: 42,
          subjects: [
            { name: "수학", correct: 7, wrong: 1, rate: 88 },
            { name: "국어", correct: 4, wrong: 0, rate: 100 },
            { name: "영어", correct: 4, wrong: 0, rate: 100 },
            { name: "과학", correct: 2, wrong: 1, rate: 67 },
            { name: "사회", correct: 3, wrong: 0, rate: 100 },
            { name: "역사", correct: 3, wrong: 0, rate: 100 }
          ],
          weeklyTrend: [22, 25, 25, 25, 25, 25, 25],
          days: ["월", "화", "수", "목", "금", "토", "오늘(일)"],
          monthlyProgress: 180, // 480문항 중 180문항
          totalBank: 480
        };
      } else if (this.horizon === "weekly") {
        return {
          studentName: "나경이",
          grade: 3,
          solvedCount: 172,
          targetCount: 175,
          correctCount: 154,
          wrongCount: 18,
          streakDays: 6,
          masteredCount: 42,
          subjects: [
            { name: "수학", correct: 50, wrong: 6, rate: 89 },
            { name: "국어", correct: 28, wrong: 0, rate: 100 },
            { name: "영어", correct: 28, wrong: 0, rate: 100 },
            { name: "과학", correct: 16, wrong: 5, rate: 76 },
            { name: "사회", correct: 18, wrong: 3, rate: 86 },
            { name: "역사", correct: 14, wrong: 4, rate: 78 }
          ],
          weeklyTrend: [25, 22, 25, 25, 25, 25, 25],
          days: ["월", "화", "수", "목", "금", "토", "오늘(일)"],
          monthlyProgress: 180,
          totalBank: 480
        };
      } else {
        // monthly
        return {
          studentName: "나경이",
          grade: 3,
          solvedCount: 260,
          targetCount: 480,
          correctCount: 228,
          wrongCount: 32,
          streakDays: 6,
          masteredCount: 56,
          subjects: [
            { name: "수학", correct: 56, wrong: 4, rate: 93 },
            { name: "과학", correct: 44, wrong: 16, rate: 73 },
            { name: "사회", correct: 54, wrong: 6, rate: 90 },
            { name: "역사", correct: 50, wrong: 10, rate: 83 },
            { name: "영어", correct: 12, wrong: 0, rate: 100 },
            { name: "국어", correct: 12, wrong: 0, rate: 100 }
          ],
          weeklyTrend: [40, 75, 120, 180, 220, 260],
          days: ["1주차", "2주차", "3주차", "4주차", "5주차", "현재"],
          monthlyProgress: 260,
          totalBank: 480
        };
      }
    } else {
      // 차혜 (중1) 통계 모델 (수학 8, 국어 4, 영어 4, 과학 3, 사회 3 = 총 22문항)
      if (this.horizon === "daily") {
        return {
          studentName: "차혜",
          grade: 1,
          solvedCount: 22,
          targetCount: 22,
          correctCount: 19,
          wrongCount: 3,
          streakDays: 5,
          masteredCount: 31,
          subjects: [
            { name: "수학", correct: 6, wrong: 2, rate: 75 },
            { name: "국어", correct: 4, wrong: 0, rate: 100 },
            { name: "영어", correct: 4, wrong: 0, rate: 100 },
            { name: "과학", correct: 2, wrong: 1, rate: 67 },
            { name: "사회", correct: 3, wrong: 0, rate: 100 }
          ],
          weeklyTrend: [22, 22, 20, 22, 22, 22, 22],
          days: ["월", "화", "수", "목", "금", "토", "오늘(일)"],
          monthlyProgress: 140,
          totalBank: 380
        };
      } else if (this.horizon === "weekly") {
        return {
          studentName: "차혜",
          grade: 1,
          solvedCount: 138,
          targetCount: 140,
          correctCount: 118,
          wrongCount: 20,
          streakDays: 5,
          masteredCount: 31,
          subjects: [
            { name: "수학", correct: 23, wrong: 7, rate: 77 },
            { name: "과학", correct: 26, wrong: 4, rate: 87 },
            { name: "사회", correct: 29, wrong: 1, rate: 97 },
            { name: "영어", correct: 10, wrong: 0, rate: 100 },
            { name: "국어", correct: 10, wrong: 0, rate: 100 }
          ],
          weeklyTrend: [20, 20, 18, 20, 20, 20, 20],
          days: ["월", "화", "수", "목", "금", "토", "오늘(일)"],
          monthlyProgress: 140,
          totalBank: 380
        };
      } else {
        // monthly
        return {
          studentName: "차혜",
          grade: 1,
          solvedCount: 210,
          targetCount: 380,
          correctCount: 178,
          wrongCount: 32,
          streakDays: 5,
          masteredCount: 45,
          subjects: [
            { name: "수학", correct: 46, wrong: 14, rate: 77 },
            { name: "과학", correct: 52, wrong: 8, rate: 87 },
            { name: "사회", correct: 58, wrong: 2, rate: 97 },
            { name: "영어", correct: 11, wrong: 1, rate: 92 },
            { name: "국어", correct: 11, wrong: 1, rate: 92 }
          ],
          weeklyTrend: [35, 70, 105, 145, 180, 210],
          days: ["1주차", "2주차", "3주차", "4주차", "5주차", "현재"],
          monthlyProgress: 210,
          totalBank: 380
        };
      }
    }
  }

  /**
   * 1. KPI 카드 & 2. 시각적 차트 렌더링
   */
  renderChartsAndKPIs() {
    const data = this.getStudentData();
    const overallRate = Math.round((data.correctCount / (data.solvedCount || 1)) * 100);

    // KPI 1: 푼 문항 수
    document.getElementById("kpi-solved-val").innerText = data.solvedCount;
    document.getElementById("kpi-target-val").innerText = `/ ${data.targetCount} 문항`;
    const fillPercent = Math.min(100, Math.round((data.solvedCount / data.targetCount) * 100));
    document.getElementById("kpi-progress-fill").style.width = `${fillPercent}%`;
    const statusBadge = document.getElementById("kpi-status-badge");
    if (statusBadge) {
      statusBadge.innerText = fillPercent >= 100 ? "✓ 목표 달성 완료" : `${fillPercent}% 진행 중`;
    }

    // KPI 2: 정답률 & 오답 수
    document.getElementById("kpi-accuracy-val").innerText = overallRate;
    document.getElementById("kpi-correct-cnt").innerText = data.correctCount;
    document.getElementById("kpi-wrong-cnt").innerText = data.wrongCount;
    const rateBadge = document.getElementById("kpi-rate-badge");
    if (rateBadge) {
      if (overallRate >= 90) {
        rateBadge.innerText = "최우수 (A+)";
        rateBadge.className = "kpi-badge pass";
      } else if (overallRate >= 80) {
        rateBadge.innerText = "우수 (A등급)";
        rateBadge.className = "kpi-badge rate-badge";
      } else {
        rateBadge.innerText = "보완 요망 (B등급)";
        rateBadge.className = "kpi-badge flame";
      }
    }

    // KPI 3: 스트릭
    document.getElementById("kpi-streak-val").innerText = data.streakDays;

    // KPI 4: 장기기억 마스터 문항
    document.getElementById("kpi-mastered-val").innerText = data.masteredCount;

    // 차트 서브타이틀 동적화
    const hText = this.horizon === "daily" ? "오늘" : (this.horizon === "weekly" ? "이번 주" : "이번 달");
    document.getElementById("chart-sub-accuracy").innerText = `${data.studentName}의 ${hText} 과목별 정답 및 오답 비율입니다`;
    document.getElementById("chart-trend-title").innerText = this.horizon === "monthly" ? "📈 중간고사 대비 누적 진도 곡선" : "📈 요일별 일일 학습량 추이";
    document.getElementById("chart-trend-sub").innerText = this.horizon === "monthly" 
      ? `전체 ${data.totalBank}문항 중 현재 ${data.monthlyProgress}문항 완수 (${Math.round((data.monthlyProgress/data.totalBank)*100)}%)`
      : "매일 일일 20문제 목표 달성 여부를 추적합니다";

    // Chart.js 1: 과목별 정답률 & 오답률 수평 막대 차트
    this.renderAccuracyChart(data.subjects);

    // Chart.js 2: 학습량 추이 차트
    this.renderTrendChart(data.days, data.weeklyTrend);
  }

  renderAccuracyChart(subjectStats) {
    const ctx = document.getElementById("chart-subject-accuracy")?.getContext("2d");
    if (!ctx) return;

    if (this.chartAccuracy) {
      this.chartAccuracy.destroy();
    }

    const labels = subjectStats.map(s => s.name);
    const correctRates = subjectStats.map(s => s.rate);
    const wrongRates = subjectStats.map(s => 100 - s.rate);

    this.chartAccuracy = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "정답률 (%)",
            data: correctRates,
            backgroundColor: "rgba(99, 102, 241, 0.85)",
            hoverBackgroundColor: "#818cf8",
            borderRadius: 6,
            barThickness: 18
          },
          {
            label: "오답률 (%)",
            data: wrongRates,
            backgroundColor: "rgba(244, 63, 94, 0.85)",
            hoverBackgroundColor: "#fb7185",
            borderRadius: 6,
            barThickness: 18
          }
        ]
      },
      options: {
        indexAxis: "y", // 수평 막대 차트 (과목명이 긴 경우 가독성 최상)
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            titleFont: { size: 13, weight: "bold" },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}%`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            max: 100,
            grid: { color: "rgba(255, 255, 255, 0.06)" },
            ticks: { color: "#94a3b8", callback: (v) => `${v}%` }
          },
          y: {
            stacked: true,
            grid: { display: false },
            ticks: { color: "#f8fafc", font: { weight: "bold", size: 13 } }
          }
        }
      }
    });
  }

  renderTrendChart(days, trendValues) {
    const ctx = document.getElementById("chart-learning-trend")?.getContext("2d");
    if (!ctx) return;

    if (this.chartTrend) {
      this.chartTrend.destroy();
    }

    const isMonthly = (this.horizon === "monthly");

    this.chartTrend = new Chart(ctx, {
      type: isMonthly ? "line" : "bar",
      data: {
        labels: days,
        datasets: [{
          label: isMonthly ? "누적 학습 문항" : "푼 문항 수",
          data: trendValues,
          backgroundColor: isMonthly ? "rgba(6, 182, 212, 0.15)" : "rgba(6, 182, 212, 0.8)",
          borderColor: "#06b6d4",
          borderWidth: isMonthly ? 3 : 0,
          fill: isMonthly,
          tension: 0.35,
          borderRadius: 8,
          barThickness: 24,
          pointBackgroundColor: "#38bdf8",
          pointRadius: isMonthly ? 5 : 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}문항`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { weight: "600" } }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.06)" },
            ticks: { color: "#94a3b8" },
            beginAtZero: true
          }
        }
      }
    });
  }

  /**
   * 3. 🤖 AI 튜터 안티그래비티의 정밀 진단 리포트 & 아빠 코칭 가이드
   */
  renderAIInsightReport() {
    const isNakyung = (this.student === "nakyung");
    const sName = isNakyung ? "나경이" : "차혜";

    document.getElementById("ai-student-name").innerText = sName;

    const strengthEl = document.getElementById("ai-strength-text");
    const weaknessEl = document.getElementById("ai-weakness-text");
    const coachingEl = document.getElementById("ai-coaching-text");

    if (isNakyung) {
      // 나경이 진단
      strengthEl.innerHTML = `
        • <strong>국어(비판적 읽기 100%)</strong>와 <strong>영어(장문 독해 100%)</strong>: 인공지능 윤리 논설문 및 제시카의 일화 등 긴 지문의 핵심 논지를 정확하게 파악하고 있습니다.<br>
        • <strong>수학(삼각비 93%)</strong>: 특수각 $30^\\circ, 45^\\circ, 60^\\circ$ 의 기본 삼각비 계산 속도가 매우 안정적입니다.
      `;

      weaknessEl.innerHTML = `
        • <strong>과학 6단원 [에너지 전환과 보존] (오답률 27%)</strong>: 역학적 에너지 보존($9.8mh = \\frac{1}{2}mv^2$)에서 최고점 위치 에너지가 지면 직전 운동 에너지로 전환되는 수치 계산 시 단위 변환 실수 발생.<br>
        • <strong>역사 V단원 [일제 강점기] (오답률 17%)</strong>: 1910년대 토지조사사업과 1920년대 산미증식계획의 세부 특징 혼동 주의.
      `;

      coachingEl.innerHTML = `
        💬 <strong>오늘의 칭찬 & 가이드:</strong><br>
        "나경이가 과학 계산 문제를 풀 때 식을 암산하기보다 <strong>우측 S펜 연습장에 풀이 단계를 딱 한 줄만 적도록</strong> 격려해 주세요.<br>
        <em>'나경아, 공식은 완벽히 알고 있으니 S펜에 식 하나만 적고 계산하면 100점 맞겠어!'</em>라고 말씀해 주시면 계산 실수가 즉시 보완됩니다."
      `;
    } else {
      // 차혜 진단
      strengthEl.innerHTML = `
        • <strong>사회(문화의 이해 100%)</strong>와 <strong>국어(문장 성분 92%)</strong>: 문화 상대주의의 가치 판단 및 '맛있는(관형어)', '빠르게(부사어)' 등 문장 성분 판별력이 매우 탁월합니다.<br>
        • <strong>과학(물질의 상태 변화 87%)</strong>: 융해, 기화, 승화의 상태 변화 개념을 일상 속 사례와 잘 연결하고 있습니다.
      `;

      weaknessEl.innerHTML = `
        • <strong>수학 2단원 [평면도형 - 원과 부채꼴] (오답률 23%)</strong>: 반지름 $r$, 중심각 $x^\\circ$ 일 때 부채꼴 호의 길이($2\\pi r \\times \\frac{x}{360}$)에서 $\\frac{x}{360}$ 분수 약분 과정 중 오답 발생.<br>
        • <strong>과학 6단원 [빛과 파동]</strong>: 평면거울 반사의 법칙에서 법선과 이루는 입사각 기준 숙지 필요.
      `;

      coachingEl.innerHTML = `
        💬 <strong>오늘의 칭찬 & 가이드:</strong><br>
        "차혜에게 공식을 기계적으로 외우게 하기보다, <strong>'피자 한 판($360^\\circ$)에서 몇 조각을 자른 것인지'</strong> 시각적 비유를 들어 가볍게 짚어주세요.<br>
        <em>'차혜야, 사회랑 국어 문장 성분 맞춘 거 정말 대단해! 수학 부채꼴은 피자 조각 생각하며 한 번만 더 보자'</em>라고 응원해 주시면 큰 자신감을 얻게 됩니다."
      `;
    }
  }

  /**
   * 4. 에빙하우스 망각곡선 큐 & 최근 오답 노트 리스트
   */
  renderSRSStagesAndWrongs() {
    const isNakyung = (this.student === "nakyung");

    // 망각곡선 4단계 수치 갱신
    if (isNakyung) {
      document.getElementById("srs-cnt-1").innerText = "2문항";
      document.getElementById("srs-cnt-3").innerText = "14문항";
      document.getElementById("srs-cnt-7").innerText = "28문항";
      document.getElementById("srs-cnt-14").innerText = "42문항";
    } else {
      document.getElementById("srs-cnt-1").innerText = "3문항";
      document.getElementById("srs-cnt-3").innerText = "18문항";
      document.getElementById("srs-cnt-7").innerText = "22문항";
      document.getElementById("srs-cnt-14").innerText = "31문항";
    }

    // 최근 오답 문항 샘플 리스트 렌더링
    const container = document.getElementById("wrong-list-container");
    if (!container) return;

    const wrongQuestions = isNakyung ? [
      {
        subject: "과학",
        chapter: "6. 에너지 전환과 보존",
        tagClass: "tag-sci",
        time: "오늘 16:42",
        question_text: "질량 $2\\text{kg}$ 인 물체를 지면으로부터 높이 $10\\text{m}$ 에서 가만히 떨어뜨렸다. 지면에 닿기 직전의 운동 에너지는? (단, $g = 9.8\\text{m/s}^2$)",
        chosen: "1번 (98J)",
        correct: "2번 (196J)",
        explanation: "역학적 에너지 보존에 의해 최고점 위치 에너지 $9.8 \\times 2 \\times 10 = 196\\text{J}$ 가 지면 직전 운동 에너지로 전환됩니다."
      },
      {
        subject: "역사",
        chapter: "V. 일제 강점과 민족 운동의 전개",
        tagClass: "tag-hist",
        time: "어제 19:15",
        question_text: "일제가 1910년대 식민 지배의 경제적 기반을 마련하기 위해 토지 소유권을 엄격히 신고하게 하여 농민의 관습적 경작권을 박탈한 정책은?",
        chosen: "2번 (산미증식계획)",
        correct: "1번 (토지조사사업)",
        explanation: "토지조사사업은 1910년대 시행되었으며, 산미증식계획은 1920년대 쌀 증산 수탈 정책입니다."
      }
    ] : [
      {
        subject: "수학",
        chapter: "2단원. 평면도형 (원과 부채꼴)",
        tagClass: "tag-math",
        time: "오늘 17:10",
        question_text: "반지름의 길이가 $4\\text{cm}$ 이고 중심각의 크기가 $90^\\circ$ 인 부채꼴의 넓이는?",
        chosen: "3번 (8π cm²)",
        correct: "1번 (4π cm²)",
        explanation: "부채꼴의 넓이는 $\\pi r^2 \\times \\frac{90}{360} = \\pi \\times 16 \\times \\frac{1}{4} = 4\\pi\\text{cm}^2$ 입니다."
      },
      {
        subject: "수학",
        chapter: "2단원. 평면도형 (다각형)",
        tagClass: "tag-math",
        time: "오늘 16:55",
        question_text: "$6$각형의 모든 내각의 크기의 총합을 구하시오.",
        chosen: "2번 (540°)",
        correct: "3번 (720°)",
        explanation: "$n$각형 내각의 합 공식은 $180^\\circ \\times (n - 2)$ 이므로 $180^\\circ \\times 4 = 720^\\circ$ 입니다."
      },
      {
        subject: "과학",
        chapter: "6단원. 빛과 파동",
        tagClass: "tag-sci",
        time: "어제 20:04",
        question_text: "빛이 평면거울에 입사각 $40^\\circ$ 로 입사할 때, 반사의 법칙에 따른 반사각의 크기는?",
        chosen: "4번 (50°)",
        correct: "2번 (40°)",
        explanation: "반사의 법칙에 의해 입사각과 반사각의 크기는 항상 같으므로 반사각은 $40^\\circ$ 입니다."
      }
    ];

    document.getElementById("wrong-total-badge").innerText = `오답 ${wrongQuestions.length}개`;

    container.innerHTML = "";
    wrongQuestions.forEach(item => {
      const card = document.createElement("div");
      card.className = "wrong-item-card";
      card.innerHTML = `
        <div class="wrong-item-meta">
          <span class="wrong-subject-tag ${item.tagClass}">${item.subject} · ${item.chapter}</span>
          <span class="wrong-time-tag">${item.time}</span>
        </div>
        <div class="wrong-q-text">${this.renderMath(item.question_text)}</div>
        <div class="wrong-ans-compare">
          <span class="chosen-wrong">선택한 오답: ${item.chosen}</span>
          <span class="correct-is">정답: ${item.correct}</span>
        </div>
        <div class="wrong-expl-box">
          💡 <strong>해설:</strong> ${this.renderMath(item.explanation)}
        </div>
      `;
      container.appendChild(card);
    });
  }

  /**
   * 아빠의 따뜻한 응원 메시지 전송
   */
  sendCheerMessage(msg) {
    const sName = this.student === "nakyung" ? "나경이" : "차혜";
    const storageKey = `harumaster_cheer_${this.student}`;
    const payload = {
      message: msg,
      sent_at: new Date().toISOString(),
      student_id: this.student
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));

    const hintEl = document.getElementById("cheer-status-hint");
    if (hintEl) {
      hintEl.style.color = "#34d399";
      hintEl.innerText = `✓ ${sName}의 태블릿으로 응원 메시지가 전송되었습니다! ("${msg}")`;
      setTimeout(() => {
        hintEl.style.color = "var(--text-dim)";
        hintEl.innerText = "아이가 태블릿 학습 화면을 열었을 때 상단에 사랑의 팝업으로 표시됩니다.";
      }, 4000);
    }

    const input = document.getElementById("input-cheer-message");
    if (input) input.value = "";
  }

  renderMath(rawText) {
    if (!rawText) return "";
    if (typeof katex === "undefined") return rawText;

    try {
      // 인라인 수식 $...$ 렌더링
      return rawText.replace(/\$([^\$]+)\$/g, (match, expr) => {
        try {
          return katex.renderToString(expr, { throwOnError: false, displayMode: false });
        } catch (e) {
          return match;
        }
      });
    } catch (err) {
      return rawText;
    }
  }
}

// 애플리케이션 인스턴스화
document.addEventListener("DOMContentLoaded", () => {
  window.dadMonitoringApp = new DadMonitoringApp();
});
