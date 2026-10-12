/**
 * 하루마스터 (HaruMaster) - 자녀 전용 태블릿 학습 컨트롤러
 * 첫째 나경이(중3) / 둘째 차혜(중1) 맞춤형 일일 과제 풀이 및 S-Pen 연습장 엔진
 */

import { dbService } from './firebase-service.js';

class StudentApp {
  constructor(config) {
    this.config = config || { id: 'nakyung', name: '나경이', grade: 3 };
    this.questions = [];
    this.currentIndex = 0;
    this.selectedAnswer = null;
    this.isGraded = false;
    this.solvedCount = 0;
    this.correctCount = 0;
    this.init();
  }

  async init() {
    this.applyTheme();
    this.initSPenScratchpad();
    this.initEventListeners();
    await this.loadQuestions();
  }

  applyTheme() {
    if (this.config.theme === 'chahye') {
      document.body.classList.add('theme-chahye');
    }
    const nameEl = document.getElementById('student-name-text');
    if (nameEl) nameEl.innerText = this.config.name;

    const gradeEl = document.getElementById('student-grade-badge');
    if (gradeEl) gradeEl.innerText = `중${this.config.grade}학년`;
  }

  async loadQuestions() {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const grade = this.config.grade;

    // 1. 오늘자 과제 가져오기
    const assignments = await dbService.getAllAssignments();
    const todayAssign = assignments.find(a => a.target_grade === grade);

    let qList = [];
    if (todayAssign) {
      const full = await dbService.getAssignmentWithQuestions(todayAssign.assignment_id);
      if (full && full.questions) {
        qList = [...full.questions];
      }
    }

    // 2. 만약 오늘자 과제가 없으면 해당 학년의 전체 문제 중 로드
    if (qList.length === 0) {
      const allQ = await dbService.getAllQuestions();
      qList = allQ.filter(q => q.grade === grade);
    }

    // 3. 에빙하우스 SRS 복습 문항 중 오늘 복습해야 할 오답 문항 추가
    const studentReviews = await dbService.getStudentReviews(this.config.id);
    const dueReviews = studentReviews.filter(r => (r.next_review_date <= today && (r.wrongCount > 0 || !r.last_is_correct)));
    
    // 중복 제거 후 합치기
    const seenIds = new Set(qList.map(q => q.question_id));
    dueReviews.forEach(r => {
      if (r.question && !seenIds.has(r.question_id)) {
        r.question._isSrsReview = true;
        qList.push(r.question);
        seenIds.add(r.question_id);
      }
    });

    this.questions = qList;
    this.currentIndex = 0;
    this.renderCurrentQuestion();
    this.updateProgress();
  }

  renderCurrentQuestion() {
    if (this.questions.length === 0) {
      this.renderEmptyState();
      return;
    }

    if (this.currentIndex >= this.questions.length) {
      this.renderCompletionScreen();
      return;
    }

    const q = this.questions[this.currentIndex];
    this.selectedAnswer = null;
    this.isGraded = false;

    // 카운터
    const counterEl = document.getElementById("q-counter-text");
    if (counterEl) {
      counterEl.innerText = `문항 ${this.currentIndex + 1} / ${this.questions.length}`;
    }

    // 과목 뱃지
    const subPill = document.getElementById("q-subject-pill");
    if (subPill) subPill.innerText = q.subject || "공통";

    // SRS 뱃지
    const srsBadge = document.getElementById("q-srs-badge");
    if (srsBadge) {
      srsBadge.style.display = q._isSrsReview ? "inline-block" : "none";
    }

    // 지문
    const passageBox = document.getElementById("q-passage-box");
    if (passageBox) {
      if (q.passage && q.passage.trim()) {
        passageBox.style.display = "block";
        passageBox.innerText = q.passage;
      } else {
        passageBox.style.display = "none";
      }
    }

    // 문제 본문 (KaTeX 렌더링)
    const textEl = document.getElementById("q-text-body");
    if (textEl) {
      textEl.innerHTML = this.renderMath(q.question_text || "");
    }

    // 다이어그램
    const diagBox = document.getElementById("q-diagram-box");
    const diagImg = document.getElementById("q-diagram-img");
    if (diagBox && diagImg) {
      if (q.image_url && q.image_url.trim()) {
        diagImg.src = q.image_url;
        diagBox.style.display = "block";
      } else {
        diagBox.style.display = "none";
        diagImg.src = "";
      }
    }

    // 선택지 보기
    const optContainer = document.getElementById("q-options-container");
    if (optContainer) {
      optContainer.innerHTML = "";
      (q.options || []).forEach((optText, idx) => {
        const num = idx + 1;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt-card-btn";
        btn.dataset.num = num;
        btn.innerHTML = `
          <div class="opt-num-circle">${num}</div>
          <div class="opt-text-wrap">${this.renderMath(optText)}</div>
        `;
        btn.onclick = () => this.selectOption(num);
        optContainer.appendChild(btn);
      });
    }

    // 해설 박스 숨김
    const explCard = document.getElementById("q-explanation-card");
    if (explCard) explCard.style.display = "none";

    // 버튼 상태
    const submitBtn = document.getElementById("btn-submit-answer");
    if (submitBtn) {
      submitBtn.style.display = "flex";
      submitBtn.disabled = true;
      submitBtn.innerText = "✓ 답안 제출 및 채점";
    }

    const nextBtn = document.getElementById("btn-next-question");
    if (nextBtn) nextBtn.style.display = "none";

    // 화면 상단으로 부드럽게 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  selectOption(num) {
    if (this.isGraded) return;
    this.selectedAnswer = num;

    // 햅틱 진동 피드백 (갤럭시 지원 시)
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    document.querySelectorAll(".opt-card-btn").forEach(btn => {
      btn.classList.toggle("selected", Number(btn.dataset.num) === num);
    });

    const submitBtn = document.getElementById("btn-submit-answer");
    if (submitBtn) submitBtn.disabled = false;
  }

  async submitAnswer() {
    if (!this.selectedAnswer || this.isGraded) return;
    this.isGraded = true;

    const q = this.questions[this.currentIndex];
    const isCorrect = (Number(this.selectedAnswer) === Number(q.correct_answer));

    this.solvedCount++;
    if (isCorrect) this.correctCount++;

    // 1. Firebase Cloud Firestore 실시간 채점 기록
    await dbService.submitAnswer(this.config.id, q.question_id, this.selectedAnswer);

    // 2. 보기 하이라이트
    document.querySelectorAll(".opt-card-btn").forEach(btn => {
      btn.disabled = true;
      const num = Number(btn.dataset.num);
      if (num === q.correct_answer) {
        btn.classList.add("correct-reveal");
      } else if (num === this.selectedAnswer) {
        btn.classList.add("wrong-reveal");
      }
    });

    // 3. 해설 및 피드백 표시
    const explCard = document.getElementById("q-explanation-card");
    if (explCard) {
      explCard.style.display = "block";
      explCard.className = `q-explanation-card ${isCorrect ? 'success' : 'fail'}`;
      explCard.innerHTML = `
        <div style="font-weight: 800; font-size: 1.15rem; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          <span>${isCorrect ? '🎉 대단해요, 정답입니다!' : '❌ 아쉽지만 틀렸어요!'}</span>
          <span style="font-size: 0.85rem; font-weight: normal;">(정답: ${q.correct_answer}번)</span>
        </div>
        <div style="font-size: 0.95rem; margin-top: 4px;">
          <strong>💡 친절한 해설:</strong> ${this.renderMath(q.explanation || '해설이 제공되지 않았습니다.')}
        </div>
        ${!isCorrect ? `
          <div style="margin-top: 8px; font-size: 0.85rem; color: #fda4af;">
            🌱 ${this.config.name}아, 걱정 마! 3일 뒤 에빙하우스 복습에서 다시 맞혀보자!
          </div>
        ` : ''}
      `;
    }

    // 4. 맞췄을 때 팡파르 축하 효과!
    if (isCorrect) {
      this.triggerConfetti();
    }

    // 버튼 토글
    const submitBtn = document.getElementById("btn-submit-answer");
    if (submitBtn) submitBtn.style.display = "none";

    const nextBtn = document.getElementById("btn-next-question");
    if (nextBtn) {
      nextBtn.style.display = "block";
      nextBtn.innerText = (this.currentIndex + 1 === this.questions.length) ? "🏆 최종 결과 보기" : "다음 문제 풀기 ➔";
    }

    this.updateProgress();
  }

  nextQuestion() {
    this.currentIndex++;
    this.renderCurrentQuestion();
    this.updateProgress();
  }

  updateProgress() {
    const total = this.questions.length;
    const current = Math.min(this.currentIndex, total);
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;

    const fillEl = document.getElementById("progress-bar-fill");
    if (fillEl) fillEl.style.width = `${pct}%`;

    const pctText = document.getElementById("progress-pct-text");
    if (pctText) pctText.innerText = `${pct}% 완료`;
  }

  renderCompletionScreen() {
    const main = document.getElementById("student-main-content");
    if (!main) return;

    this.triggerConfetti();

    const rate = this.solvedCount > 0 ? Math.round((this.correctCount / this.solvedCount) * 100) : 100;

    main.innerHTML = `
      <div class="completion-celebration-card">
        <div class="celebration-trophy">🏆</div>
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">
          오늘의 과제 100% 완료!
        </h2>
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          ${this.config.name}아, 오늘 목표를 멋지게 달성했어! 정말 자랑스러워 ✨
        </p>

        <div style="display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: rgba(255, 255, 255, 0.06); padding: 16px 24px; border-radius: 16px; border: 1px solid var(--border-glass);">
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 4px;">풀이 문항</div>
            <div style="font-size: 1.7rem; font-weight: 800; color: #fff;">${this.solvedCount}문제</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.06); padding: 16px 24px; border-radius: 16px; border: 1px solid var(--border-glass);">
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 4px;">맞힌 정답률</div>
            <div style="font-size: 1.7rem; font-weight: 800; color: var(--accent-emerald);">${rate}%</div>
          </div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; padding: 14px; max-width: 480px; margin: 0 auto 2rem auto; font-size: 0.95rem; color: #a7f3d0;">
          📡 아빠의 관제 대시보드(Firebase)에 학습 완료 리포트가 실시간 전송되었습니다!
        </div>

        <button type="button" class="btn-student-next" style="margin: 0 auto; display: inline-block;" onclick="window.location.reload()">
          🔄 다시 확인하기
        </button>
      </div>
    `;
  }

  renderEmptyState() {
    const main = document.getElementById("student-main-content");
    if (!main) return;
    main.innerHTML = `
      <div class="completion-celebration-card" style="border-color: var(--border-glass);">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🌴</div>
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">
          오늘 등록된 과제가 없습니다
        </h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
          아빠가 새로운 과제를 등록해 주시면 여기에 나타납니다.
        </p>
        <button type="button" class="btn-student-next" onclick="window.location.reload()">
          🔄 새로고침
        </button>
      </div>
    `;
  }

  renderMath(text) {
    if (!text) return "";
    if (typeof window.katex === "undefined") {
      return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    return text.replace(/\$([^$]+)\$/g, (match, formula) => {
      try {
        return window.katex.renderToString(formula, { throwOnError: false });
      } catch (e) {
        return formula;
      }
    });
  }

  // --- S-Pen & 터치 풀이 연습장 엔진 ---
  initSPenScratchpad() {
    const toggleBtn = document.getElementById("btn-toggle-spen");
    const drawer = document.getElementById("spen-drawer");
    const canvas = document.getElementById("spen-canvas");
    const clearBtn = document.getElementById("spen-clear-btn");
    const closeBtn = document.getElementById("spen-close-btn");

    if (!canvas || !drawer) return;

    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    let currentColor = "#ffffff";
    let currentWidth = 3;

    // 캔버스 크기 리사이징
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    window.addEventListener("resize", resizeCanvas);

    toggleBtn?.addEventListener("click", () => {
      drawer.classList.toggle("open");
      toggleBtn.classList.toggle("active");
      if (drawer.classList.contains("open")) {
        setTimeout(resizeCanvas, 320);
      }
    });

    closeBtn?.addEventListener("click", () => {
      drawer.classList.remove("open");
      toggleBtn?.classList.remove("active");
    });

    clearBtn?.addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // 컬러 선택
    document.querySelectorAll(".color-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
        currentColor = dot.dataset.color || "#ffffff";
        currentWidth = Number(dot.dataset.width || 3);
      });
    });

    // 드로잉 포인터 이벤트 (S-Pen 및 터치 지원)
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener("pointerdown", (e) => {
      isDrawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentWidth;
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    });

    const stopDrawing = () => {
      if (isDrawing) {
        ctx.closePath();
        isDrawing = false;
      }
    };

    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);
    canvas.addEventListener("pointerleave", stopDrawing);
  }

  triggerConfetti() {
    // 경량 CSS/JS 파티클 폭죽 효과
    const count = 40;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.style.position = "fixed";
      p.style.width = `${Math.random() * 8 + 6}px`;
      p.style.height = `${Math.random() * 8 + 6}px`;
      p.style.backgroundColor = ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"][Math.floor(Math.random() * 5)];
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = "-20px";
      p.style.borderRadius = "50%";
      p.style.zIndex = "9999";
      p.style.pointerEvents = "none";
      p.style.transition = `all ${Math.random() * 1.5 + 1}s cubic-bezier(0.25, 1, 0.5, 1)`;
      document.body.appendChild(p);

      setTimeout(() => {
        p.style.top = `${Math.random() * 80 + 30}vh`;
        p.style.left = `${parseFloat(p.style.left) + (Math.random() * 40 - 20)}vw`;
        p.style.opacity = "0";
      }, 20);

      setTimeout(() => p.remove(), 2600);
    }
  }

  initEventListeners() {
    document.getElementById("btn-submit-answer")?.addEventListener("click", () => this.submitAnswer());
    document.getElementById("btn-next-question")?.addEventListener("click", () => this.nextQuestion());
  }
}

// 부트스트랩
document.addEventListener("DOMContentLoaded", () => {
  window.studentApp = new StudentApp(window.STUDENT_CONFIG);
});
