/**
 * 하루마스터 (HaruMaster) - 아빠용 자녀 학습 모니터링 컨트롤러
 * - 일일 / 주간 / 월간 학습 상태 분석
 * - Chart.js 과목별 정답률 & 오답률 인터랙티브 그래프
 * - AI 튜터 안티그래비티의 취약점 진단 및 아빠 맞춤 코칭 리포트
 * - 실시간 에빙하우스 SRS 망각곡선 & 오답노트
 */

import { dbService } from './firebase-service.js?v=c2f6a1b';

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
        this.loadAndRenderDashboard();
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

    this.dashboardData = await this.getLiveStudentData();
    this.renderChartsAndKPIs();
    this.renderAIInsightReport();
    this.renderSRSStagesAndWrongs();
  }

  async getLiveStudentData() {
    const isNakyung = this.student === "nakyung";
    const grade = isNakyung ? 3 : 1;
    const studentName = isNakyung ? "나경이" : "차혜";
    const subjects = isNakyung
      ? ["수학", "과학", "사회", "역사", "영어", "국어"]
      : ["수학", "과학", "사회", "영어", "국어"];
    const totalBank = isNakyung ? 480 : 380;
    const targetCount = isNakyung ? 25 : 22;
    const reviews = await dbService.getStudentReviews(this.student);
    const now = new Date();
    const cutoff = new Date(now);
    if (this.horizon === "daily") cutoff.setHours(0, 0, 0, 0);
    else if (this.horizon === "weekly") cutoff.setDate(now.getDate() - 6);
    else cutoff.setDate(now.getDate() - 29);

    const solved = reviews.filter(review => {
      const solvedAt = new Date(review.last_solved_at || 0);
      return solvedAt >= cutoff && solvedAt <= now;
    });
    const subjectsData = subjects.map(name => {
      const subjectReviews = solved.filter(review => review.question?.subject === name);
      const correct = subjectReviews.filter(review => review.last_is_correct).length;
      const wrong = subjectReviews.length - correct;
      return {
        name,
        correct,
        wrong,
        rate: subjectReviews.length ? Math.round((correct / subjectReviews.length) * 100) : 0
      };
    });

    const solvedCount = solved.length;
    const correctCount = solved.filter(review => review.last_is_correct).length;
    const days = [];
    const trend = [];
    const trendLength = this.horizon === "monthly" ? 6 : 7;
    for (let index = trendLength - 1; index >= 0; index--) {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(now.getDate() - index);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      trend.push(reviews.filter(review => {
        const solvedAt = new Date(review.last_solved_at || 0);
        return solvedAt >= day && solvedAt < nextDay;
      }).length);
      days.push(this.horizon === "monthly" ? `${trendLength - index}주차` : day.toLocaleDateString("ko-KR", { weekday: "short" }));
    }

    return {
      studentName,
      grade,
      solvedCount,
      targetCount: this.horizon === "daily" ? targetCount : (this.horizon === "weekly" ? targetCount * 7 : totalBank),
      correctCount,
      wrongCount: solvedCount - correctCount,
      streakDays: new Set(reviews.map(review => String(review.last_solved_at || "").slice(0, 10)).filter(Boolean)).size,
      masteredCount: reviews.filter(review => Number(review.interval) >= 14).length,
      subjects: subjectsData,
      weeklyTrend: trend,
      days,
      monthlyProgress: reviews.length,
      totalBank
    };
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
    const data = this.dashboardData || this.getStudentData();
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
    const sName = this.dashboardData?.studentName || (this.student === "nakyung" ? "나경이" : "차혜");
    const subjectStats = (this.dashboardData?.subjects || [])
      .filter(subject => subject.correct + subject.wrong > 0)
      .sort((a, b) => b.rate - a.rate);
    const strongest = subjectStats[0];
    const weakest = subjectStats[subjectStats.length - 1];

    document.getElementById("ai-student-name").innerText = sName;

    const strengthEl = document.getElementById("ai-strength-text");
    const weaknessEl = document.getElementById("ai-weakness-text");
    const coachingEl = document.getElementById("ai-coaching-text");

    if (!strongest || !weakest) {
      strengthEl.innerText = "• 아직 기간 내 풀이 데이터가 없습니다.";
      weaknessEl.innerText = "• 문제를 풀면 과목별 취약점이 자동으로 분석됩니다.";
      coachingEl.innerHTML = "💬 <strong>오늘의 칭찬 & 가이드:</strong><br>첫 문제를 풀고 나면 맞춤 코칭이 표시됩니다.";
      return;
    }

    strengthEl.innerHTML = `• <strong>${strongest.name}(${strongest.rate}%)</strong>: 현재 기간에 가장 안정적인 과목입니다.<br>• 풀이 ${strongest.correct + strongest.wrong}문항 중 ${strongest.correct}문항을 맞혔습니다.`;
    weaknessEl.innerHTML = `• <strong>${weakest.name}(${weakest.rate}%)</strong>: 현재 기간 정답률이 가장 낮은 과목입니다.<br>• 오답 ${weakest.wrong}문항을 풀이 과정과 함께 다시 확인해 보세요.`;
    coachingEl.innerHTML = `💬 <strong>오늘의 칭찬 & 가이드:</strong><br>"${sName}아, ${strongest.name}은(는) 잘하고 있어! ${weakest.name} 문제는 S펜으로 풀이 단계를 한 줄씩 적어 보자."`;
  }

  /**
   * 4. 에빙하우스 망각곡선 큐 & 최근 오답 노트 리스트
   */
  async renderSRSStagesAndWrongs() {
    const reviews = await dbService.getStudentReviews(this.student);
    const stageCounts = { 1: 0, 3: 0, 7: 0, 14: 0 };
    reviews.forEach(review => {
      const interval = Number(review.interval);
      if (interval >= 14) stageCounts[14]++;
      else if (interval >= 7) stageCounts[7]++;
      else if (interval >= 3) stageCounts[3]++;
      else if (interval >= 1) stageCounts[1]++;
    });
    document.getElementById("srs-cnt-1").innerText = `${stageCounts[1]}문항`;
    document.getElementById("srs-cnt-3").innerText = `${stageCounts[3]}문항`;
    document.getElementById("srs-cnt-7").innerText = `${stageCounts[7]}문항`;
    document.getElementById("srs-cnt-14").innerText = `${stageCounts[14]}문항`;

    const container = document.getElementById("wrong-list-container");
    if (!container) return;

    const wrongQuestions = reviews
      .filter(review => review.last_is_correct === false && review.question?.question_text)
      .sort((a, b) => new Date(b.last_solved_at || 0) - new Date(a.last_solved_at || 0))
      .slice(0, 10)
      .map(review => ({
        subject: review.question.subject || "공통",
        chapter: review.question.chapter || review.question.unit || "복습 문항",
        tagClass: `tag-${(review.question.subject || "common").toLowerCase()}`,
        time: review.last_solved_at ? new Date(review.last_solved_at).toLocaleString("ko-KR") : "기록 시간 없음",
        question_text: review.question.question_text,
        chosen: review.selected_answer ? `${review.selected_answer}번` : "선택 답안 기록 없음",
        correct: `${review.question.correct_answer}번`,
        explanation: review.question.explanation || "해설이 제공되지 않았습니다."
      }));

    document.getElementById("wrong-total-badge").innerText = `오답 ${wrongQuestions.length}개`;

    container.innerHTML = "";
    wrongQuestions.forEach(item => {
      const card = document.createElement("div");
      card.className = "wrong-item-card";
      card.innerHTML = `
        <div class="wrong-item-meta">
          <span class="wrong-subject-tag ${item.tagClass}">${item.subject} · ${item.chapter || "복습 문항"}</span>
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
    const escapeHtml = value => String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
    if (typeof katex === "undefined") return escapeHtml(rawText);

    const pattern = /\$([^$]+)\$/g;
    let output = "";
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(String(rawText))) !== null) {
      output += escapeHtml(String(rawText).slice(lastIndex, match.index));
      try {
        output += katex.renderToString(match[1], { throwOnError: false, displayMode: false });
      } catch (error) {
        output += escapeHtml(match[0]);
      }
      lastIndex = pattern.lastIndex;
    }
    return output + escapeHtml(String(rawText).slice(lastIndex));
  }
}

// 애플리케이션 인스턴스화
document.addEventListener("DOMContentLoaded", () => {
  window.dadMonitoringApp = new DadMonitoringApp();
});
