/**
 * 하루마스터 (HaruMaster) - 대시보드 메인 UI 컨트롤러
 * 실시간 KaTeX 렌더링, 태블릿 시뮬레이터 연동, 사전 비행 검증기, 스마트 파서 바인딩
 */

import { QuestionValidator, ALLOWED_SUBJECTS } from './validator.js';
import { SmartTextParser } from './parser.js';
import { dbService } from './firebase-service.js';

// 애플리케이션 상태 (State)
const state = {
  activeTab: "studio",
  activeStudent: "CHILD_G3", // CHILD_G1 (중1) or CHILD_G3 (중3)
  currentSubject: "수학",
  currentGrade: 3,
  tabletSelectedAnswer: null,
  tabletIsGraded: false,
  lastFocusedInput: null
};

// 템플릿 프리셋
const SUBJECT_TEMPLATES = {
  "수학": {
    question_text: "이차방정식 $2x^2 - 8x + 6 = 0$ 의 두 근의 합을 구하시오.",
    passage: "",
    options: ["$2$", "$4$", "$6$", "$8$", "$10$"],
    correct_answer: 2,
    explanation: "근과 계수의 관계에 의해 두 근의 합은 $-(-8)/2 = 4$ 입니다."
  },
  "국어": {
    question_text: "위 지문의 중심 내용으로 가장 알맞은 것은?",
    passage: "말은 마음의 거울이다. 우리가 일상에서 사용하는 단어와 어조는 상대방에 대한 배려와 존중의 깊이를 드러낸다. 바른 언어생활은 원활한 소통뿐만 아니라 스스로의 인격을 닦는 첫걸음이다.",
    options: ["언어 사용의 역사적 변천", "바른 언어생활과 배려의 중요성", "문학 작품에 나타난 대화 양상", "비언어적 소통의 한계점", "신조어의 생성 원리"],
    correct_answer: 2,
    explanation: "글의 핵심 논지는 바른 말 사용이 상대방에 대한 배려이자 인격을 형성한다는 점입니다."
  },
  "영어": {
    question_text: "What is the main topic of the passage?",
    passage: "Regular exercise not only strengthens your muscles but also boosts brain function. Studies show that students who stay active perform better in school tests.",
    options: ["How to build muscle quickly", "The benefits of exercise on brain and study", "The best time to take school tests", "Sports equipment for teenagers", "Healthy food recipes"],
    correct_answer: 2,
    explanation: "본문은 운동이 근육뿐만 아니라 뇌 기능과 학업 성적 향상에 미치는 긍정적 효과를 설명합니다."
  },
  "과학": {
    question_text: "식물이 빛에너지를 이용하여 이산화탄소와 물로부터 포도당과 산소를 만드는 작용은?",
    passage: "",
    options: ["호흡 작용", "광합성 작용", "증산 작용", "발효 작용", "소화 작용"],
    correct_answer: 2,
    explanation: "엽록체에서 빛에너지를 흡수해 유기물을 합성하는 과정은 광합성(Photosynthesis)입니다."
  },
  "사회": {
    question_text: "기후 변화로 인해 북극 빙하가 감소하면서 발생하는 지구 환경 문제로 알맞은 것은?",
    passage: "",
    options: ["해수면 상승", "오존층 회복", "사막화 중단", "지진 빈도 감소", "조석 간만의 차 소멸"],
    correct_answer: 1,
    explanation: "빙하가 녹으면 해수면이 상승하여 저지대 침수 등의 피해가 발생합니다."
  },
  "역사": {
    question_text: "조선 시대 세종 대에 훈민정음 창제와 함께 편찬된 농업 기술서는?",
    passage: "",
    options: ["농사직설", "임원경제지", "산림경제", "과농소초", "해동농서"],
    correct_answer: 1,
    explanation: "우리나라 풍토에 맞는 농법을 집대성하여 세종 때 편찬된 농서는 《농사직설》입니다."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initStudentSelector();
  initStudioForm();
  initTabletEmulator();
  initBatchTools();
  initSettingsModal();
  renderAllViews();
});

// --- 토스트 알림 유틸 ---
export function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> <div>${message}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// --- 네비게이션 탭 전환 ---
function initNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.remove("active");
        if (pane.id === `tab-${targetId}`) {
          pane.classList.add("active");
        }
      });
      state.activeTab = targetId;

      if (targetId === "overview") renderOverviewTab();
      if (targetId === "reviews") renderReviewsTab();
    });
  });
}

// --- 학생 선택기 (중1 vs 중3) ---
function initStudentSelector() {
  const btns = document.querySelectorAll(".student-btn");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeStudent = btn.dataset.student;
      state.currentGrade = (state.activeStudent === "CHILD_G1") ? 1 : 3;

      // 출제 폼 학년 자동 반영
      const gradeSelect = document.getElementById("input-grade");
      if (gradeSelect) gradeSelect.value = state.currentGrade;

      showToast(`학습 대상이 '${btn.innerText.trim()}'으로 전환되었습니다.`, "info");
      renderAllViews();
    });
  });
}

// ==============================================================================
// 1. 문제 출제 스튜디오 & 실시간 검증기 (Zero-Error Studio)
// ==============================================================================
function initStudioForm() {
  // 과목 선택 필
  const subPills = document.querySelectorAll(".sub-pill");
  subPills.forEach(pill => {
    pill.addEventListener("click", () => {
      subPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.currentSubject = pill.dataset.sub;
      
      // 태블릿 뷰어 뱃지 즉시 변경
      updateSubjectTheme(state.currentSubject);
      triggerRealtimeValidation();
    });
  });

  // 과목 템플릿 로더 버튼
  document.getElementById("btn-load-template")?.addEventListener("click", () => {
    loadSubjectTemplate(state.currentSubject);
  });

  // LaTeX 수식 툴바 버튼 이벤트 바인딩
  document.querySelectorAll(".latex-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const latex = btn.dataset.latex;
      const raw = btn.dataset.raw;
      if (latex) {
        insertMathFormula(latex, false);
      } else if (raw) {
        insertMathFormula(raw, true);
      }
    });
  });

  // 수식 마법사 모달 바인딩
  document.getElementById("btn-open-math-wizard")?.addEventListener("click", () => {
    document.getElementById("modal-math-wizard")?.classList.add("open");
  });

  // 1) 분수 마법사
  document.getElementById("wiz-btn-insert-frac")?.addEventListener("click", () => {
    const num = document.getElementById("wiz-frac-num")?.value.trim() || "a";
    const den = document.getElementById("wiz-frac-den")?.value.trim() || "b";
    insertMathFormula(`\\frac{${num}}{${den}}`, false);
    document.getElementById("modal-math-wizard")?.classList.remove("open");
    showToast(`분수 \\frac{${num}}{${den}} 가 삽입되었습니다.`, "success");
  });

  // 2) 제곱근 마법사
  document.getElementById("wiz-btn-insert-sqrt")?.addEventListener("click", () => {
    const coef = document.getElementById("wiz-sqrt-coef")?.value.trim() || "";
    const val = document.getElementById("wiz-sqrt-val")?.value.trim() || "x";
    const expr = coef ? `${coef}\\sqrt{${val}}` : `\\sqrt{${val}}`;
    insertMathFormula(expr, false);
    document.getElementById("modal-math-wizard")?.classList.remove("open");
    showToast(`루트 수식이 삽입되었습니다.`, "success");
  });

  // 3) 거듭제곱 마법사
  document.getElementById("wiz-btn-insert-pow")?.addEventListener("click", () => {
    const base = document.getElementById("wiz-pow-base")?.value.trim() || "x";
    const exp = document.getElementById("wiz-pow-exp")?.value.trim() || "2";
    const expr = exp.length > 1 ? `${base}^{${exp}}` : `${base}^${exp}`;
    insertMathFormula(expr, false);
    document.getElementById("modal-math-wizard")?.classList.remove("open");
    showToast(`거듭제곱 수식이 삽입되었습니다.`, "success");
  });

  // 4) 쉬운 수식 자동 변환기 바인딩
  document.getElementById("btn-auto-math")?.addEventListener("click", autoConvertNaturalMath);

  // 보기 추가 버튼
  document.getElementById("btn-add-option")?.addEventListener("click", () => {
    addOptionInput();
    triggerRealtimeValidation();
  });

  // 포커스 추적: 아빠가 마지막으로 클릭한 입력창을 기억하여 수식을 정확한 위치에 넣음
  const focusInputs = [
    "input-question-text",
    "input-passage",
    "input-explanation"
  ];
  focusInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("focus", () => { state.lastFocusedInput = el; });
      el.addEventListener("click", () => { state.lastFocusedInput = el; });
    }
  });

  // 기본 활성 입력창 지정
  state.lastFocusedInput = document.getElementById("input-question-text");

  // 폼 입력 필드 실시간 변경 감지 (디바운스 처리)
  const formInputs = [
    "input-question-text",
    "input-passage",
    "input-explanation",
    "input-grade",
    "input-assign-date"
  ];
  formInputs.forEach(id => {
    document.getElementById(id)?.addEventListener("input", () => {
      triggerRealtimeValidation();
    });
  });

  // 오늘 날짜로 기본 과제 날짜 세팅
  const dateInput = document.getElementById("input-assign-date");
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    dateInput.value = today;
  }

  // 문제 저장 버튼
  document.getElementById("btn-save-question")?.addEventListener("click", handleSaveQuestion);

  // 스마트 텍스트 파서 모달 바인딩
  document.getElementById("btn-open-parser")?.addEventListener("click", () => {
    document.getElementById("modal-parser")?.classList.add("open");
  });
  document.getElementById("btn-apply-parser")?.addEventListener("click", handleApplyParser);

  // 초기 렌더링
  bindOptionsEvents();
  renderToolbarMathButtons();
  triggerRealtimeValidation();
}

/**
 * 수식 도구 버튼들에 실제 KaTeX 수학 그래픽 수식 렌더링
 */
function renderToolbarMathButtons() {
  if (typeof window.katex === "undefined") {
    setTimeout(renderToolbarMathButtons, 300);
    return;
  }
  document.querySelectorAll(".math-render-btn").forEach(btn => {
    const latex = btn.dataset.latex;
    if (latex) {
      try {
        btn.innerHTML = window.katex.renderToString(latex, { throwOnError: false });
      } catch (e) {}
    }
  });
}

/**
 * 스마트 수식 삽입기:
 * - 마지막으로 포커스된 입력창(문제 본문, 보기 1~5번, 해설 등)에 정확히 삽입
 * - 이미 $...$ 안에 커서가 있으면 중복 $ 를 붙이지 않고 수식만 삽입
 * - 수식 밖이면 $...$ 로 자동 래핑하여 문법 파괴 방지
 */
function insertMathFormula(formulaText, isRawSymbol = false) {
  const input = state.lastFocusedInput || document.getElementById("input-question-text");
  if (!input) return;

  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;
  const val = input.value || "";

  // 현재 커서 앞의 $ 개수 확인 (홀수 개이면 이미 $...$ 수식 내부임)
  const textBefore = val.substring(0, start);
  const dollarCountBefore = (textBefore.match(/\$/g) || []).length;
  const isInsideDollars = (dollarCountBefore % 2 !== 0);

  let toInsert = formulaText;
  if (!isInsideDollars) {
    toInsert = `$${formulaText}$`;
  } else if (!isRawSymbol && toInsert.startsWith("$") && toInsert.endsWith("$")) {
    toInsert = toInsert.slice(1, -1);
  }

  input.value = val.substring(0, start) + toInsert + val.substring(end);
  const newPos = start + toInsert.length;
  input.selectionStart = input.selectionEnd = newPos;
  input.focus();
  triggerRealtimeValidation();
}

/**
 * 한글 및 일반 기호(루트, 분수, ^)를 표준 LaTeX 수식으로 자동 변환
 */
function autoConvertNaturalMath() {
  const input = state.lastFocusedInput || document.getElementById("input-question-text");
  if (!input || !input.value.trim()) {
    showToast("변환할 내용이 입력창에 없습니다.", "info");
    return;
  }

  let text = input.value;

  // 1. 한국어 분수 변환: "3분의 1", "3분의1" -> \frac{1}{3}
  text = text.replace(/([0-9a-zA-Z]+)\s*분의\s*([0-9a-zA-Z]+)/g, "\\frac{$2}{$1}");

  // 2. 슬래시 분수 변환: "1/2" -> \frac{1}{2}
  text = text.replace(/([0-9a-zA-Z]+)\s*\/\s*([0-9a-zA-Z]+)/g, "\\frac{$1}{$2}");

  // 3. 한국어 루트 변환: "루트 18", "루트(18)", "루트18" -> \sqrt{18}
  text = text.replace(/루트\s*\(?([0-9a-zA-Z]+)\)?/g, "\\sqrt{$1}");

  // 4. 거듭제곱 변환: x^2, x^10
  text = text.replace(/([a-zA-Z0-9])\^([0-9]{2,})/g, "$1^{$2}");

  // 5. 곱셈/나눗셈 기호 변환: * -> \times
  text = text.replace(/\s*\*\s*/g, " \\times ");

  // 6. 전체 문장이 하나의 방정식/수식 형태인데 $...$가 없으면 $...$ 자동 감싸기
  if (!text.includes("$") && (text.includes("\\frac") || text.includes("\\sqrt") || text.includes("^") || text.includes("="))) {
    text = `$${text}$`;
  }

  input.value = text;
  triggerRealtimeValidation();
  showToast("수학 공식이 표준 LaTeX 문법으로 자동 변환되었습니다! ✨", "success");
}

function addOptionInput(value = "", isCorrect = false) {
  const container = document.getElementById("options-container");
  if (!container) return;
  const count = container.children.length + 1;
  if (count > 5) {
    showToast("보기는 최대 5개까지 지원됩니다.", "info");
    return;
  }

  const item = document.createElement("div");
  item.className = `option-item ${isCorrect ? 'correct' : ''}`;
  item.dataset.index = count;
  item.innerHTML = `
    <input type="radio" name="opt_correct_radio" class="option-radio" ${isCorrect ? 'checked' : ''} title="정답으로 지정">
    <span class="option-index">${count}</span>
    <input type="text" class="option-input" placeholder="보기 ${count} 내용 입력..." value="${value}">
    <button type="button" class="btn-remove-opt" title="보기 삭제">✕</button>
  `;
  container.appendChild(item);
  bindOptionsEvents();
}

function bindOptionsEvents() {
  const container = document.getElementById("options-container");
  if (!container) return;

  // 보기 인덱스 재계산 및 삭제/체크 바인딩
  Array.from(container.children).forEach((item, idx) => {
    const num = idx + 1;
    item.dataset.index = num;
    item.querySelector(".option-index").innerText = num;

    const radio = item.querySelector(".option-radio");
    radio.onchange = () => {
      container.querySelectorAll(".option-item").forEach(el => el.classList.remove("correct"));
      item.classList.add("correct");
      triggerRealtimeValidation();
    };

    const removeBtn = item.querySelector(".btn-remove-opt");
    removeBtn.onclick = () => {
      if (container.children.length <= 2) {
        showToast("보기는 최소 2개 이상이어야 합니다.", "error");
        return;
      }
      item.remove();
      bindOptionsEvents();
      triggerRealtimeValidation();
    };

    const textInput = item.querySelector(".option-input");
    textInput.onfocus = () => { state.lastFocusedInput = textInput; };
    textInput.onclick = () => { state.lastFocusedInput = textInput; };
    textInput.oninput = () => triggerRealtimeValidation();
  });
}

function getFormData() {
  const subject = state.currentSubject;
  const grade = Number(document.getElementById("input-grade")?.value || 3);
  const question_text = document.getElementById("input-question-text")?.value || "";
  const passage = document.getElementById("input-passage")?.value || "";
  const explanation = document.getElementById("input-explanation")?.value || "";
  const assignDate = document.getElementById("input-assign-date")?.value || "";

  const options = [];
  let correct_answer = 1;

  const container = document.getElementById("options-container");
  if (container) {
    Array.from(container.children).forEach((item, idx) => {
      const val = item.querySelector(".option-input")?.value || "";
      options.push(val);
      if (item.querySelector(".option-radio")?.checked) {
        correct_answer = idx + 1;
      }
    });
  }

  return {
    subject,
    grade,
    question_text,
    passage,
    options,
    correct_answer,
    explanation,
    assignDate
  };
}

// 실시간 검증 & 태블릿 뷰어 동기화
let validationTimer = null;
function triggerRealtimeValidation() {
  if (validationTimer) clearTimeout(validationTimer);
  validationTimer = setTimeout(() => {
    const data = getFormData();
    const result = QuestionValidator.validate(data);

    // 1. 사전 검증 인스펙터 UI 갱신
    renderValidationInspector(result);

    // 2. 태블릿 뷰어 및 즉시 수식 미리보기 실시간 렌더링
    renderLiveTabletPreview(data);
  }, 100);
}

function renderValidationInspector(result) {
  const badge = document.getElementById("validation-status-badge");
  const list = document.getElementById("validation-items-list");
  if (!badge || !list) return;

  badge.className = `validation-badge ${result.status}`;
  if (result.status === "pass") {
    badge.innerHTML = `✓ 검증 통과 (오류 없음)`;
  } else if (result.status === "warn") {
    badge.innerHTML = `⚠️ 주의 (${result.warnings.length}건)`;
  } else {
    badge.innerHTML = `✕ 오류 (${result.errors.length}건)`;
  }

  list.innerHTML = "";
  result.errors.forEach(err => {
    list.innerHTML += `<div class="validation-item err"><span>✕</span> ${err.message}</div>`;
  });
  result.warnings.forEach(warn => {
    list.innerHTML += `<div class="validation-item warn"><span>⚠️</span> ${warn.message}</div>`;
  });
  result.passes.slice(0, 3).forEach(ok => {
    list.innerHTML += `<div class="validation-item ok"><span>✓</span> ${ok.message}</div>`;
  });
}

// 태블릿 뷰어 KaTeX 렌더링
function renderLiveTabletPreview(data) {
  const qTextEl = document.getElementById("tablet-q-text");
  const passageBox = document.getElementById("tablet-passage-box");
  const optionsGroup = document.getElementById("tablet-options-group");
  const gradeBadge = document.getElementById("tablet-grade-badge");
  const explanationBox = document.getElementById("tablet-explanation-box");
  const instantPreviewEl = document.getElementById("q-text-math-render");

  // 문제 입력창 바로 아래 실시간 수식 뷰 업데이트
  if (instantPreviewEl) {
    if (data.question_text && data.question_text.trim()) {
      instantPreviewEl.innerHTML = renderMathText(data.question_text);
    } else {
      instantPreviewEl.innerHTML = '<span style="color: var(--text-dim);">(문제를 입력하면 수식이 여기에 즉시 렌더링됩니다)</span>';
    }
  }

  if (!qTextEl || !optionsGroup) return;

  if (gradeBadge) gradeBadge.innerText = `중${data.grade}학년`;

  // 지문 렌더링
  if (passageBox) {
    if (data.passage && data.passage.trim()) {
      passageBox.style.display = "block";
      passageBox.innerText = data.passage;
    } else {
      passageBox.style.display = "none";
    }
  }

  // 본문 렌더링
  qTextEl.innerHTML = renderMathText(data.question_text || "(문제를 입력하세요)");

  // 보기 렌더링
  optionsGroup.innerHTML = "";
  data.options.forEach((optText, idx) => {
    const num = idx + 1;
    const isSelected = (state.tabletSelectedAnswer === num);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tablet-opt-btn ${isSelected ? 'selected' : ''}`;
    btn.dataset.num = num;
    btn.innerHTML = `
      <span class="tablet-opt-num">${num}</span>
      <span class="tablet-opt-text">${renderMathText(optText || `보기 ${num}`)}</span>
    `;
    btn.onclick = () => {
      state.tabletSelectedAnswer = num;
      state.tabletIsGraded = false;
      renderLiveTabletPreview(data);
    };
    optionsGroup.appendChild(btn);
  });

  // 해설 박스 초기화 (채점 전 숨김)
  if (explanationBox) {
    if (state.tabletIsGraded) {
      explanationBox.style.display = "block";
      const isCorrect = (state.tabletSelectedAnswer === data.correct_answer);
      explanationBox.innerHTML = `
        <div style="font-weight: 700; color: ${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom: 4px;">
          ${isCorrect ? '🎉 정답입니다!' : `❌ 틀렸습니다. (정답: ${data.correct_answer}번)`}
        </div>
        <div><strong>해설:</strong> ${renderMathText(data.explanation || '등록된 해설이 없습니다.')}</div>
      `;
    } else {
      explanationBox.style.display = "none";
    }
  }
}

// KaTeX 수식 파싱 헬퍼 함수
function renderMathText(text) {
  if (!text) return "";
  if (typeof window.katex === "undefined") {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // $...$ 인라인 수식 치환
  return text.replace(/\$([^$]+)\$/g, (match, formula) => {
    try {
      return window.katex.renderToString(formula, { throwOnError: false });
    } catch (e) {
      return `<span style="color:red">[수식오류: ${formula}]</span>`;
    }
  });
}

function initTabletEmulator() {
  document.getElementById("btn-test-grade")?.addEventListener("click", () => {
    if (!state.tabletSelectedAnswer) {
      showToast("태블릿 뷰어에서 먼저 보기 번호를 선택해 주세요.", "info");
      return;
    }
    state.tabletIsGraded = true;
    const data = getFormData();
    renderLiveTabletPreview(data);

    // 하이라이트 반영
    const optionsGroup = document.getElementById("tablet-options-group");
    if (optionsGroup) {
      Array.from(optionsGroup.children).forEach(btn => {
        const num = Number(btn.dataset.num);
        btn.classList.remove("correct-highlight", "wrong-highlight");
        if (num === data.correct_answer) {
          btn.classList.add("correct-highlight");
        } else if (num === state.tabletSelectedAnswer) {
          btn.classList.add("wrong-highlight");
        }
      });
    }
  });

  document.getElementById("btn-reset-tablet")?.addEventListener("click", () => {
    state.tabletSelectedAnswer = null;
    state.tabletIsGraded = false;
    renderLiveTabletPreview(getFormData());
  });
}

// 문제 등록 핸들러
async function handleSaveQuestion() {
  const data = getFormData();
  const validation = QuestionValidator.validate(data);

  if (!validation.isValid) {
    showToast(`검증 오류 ${validation.errors.length}건이 있습니다. 오류를 수정한 후 저장하세요.`, "error");
    return;
  }

  const savedQ = await dbService.saveQuestion({
    subject: data.subject,
    grade: data.grade,
    question_text: data.question_text,
    passage: data.passage,
    options: data.options,
    correct_answer: data.correct_answer,
    explanation: data.explanation
  });

  // 과제에 자동 등록
  if (data.assignDate) {
    const assignId = `${data.assignDate}_G${data.grade}`;
    const existing = await dbService.getAssignmentWithQuestions(assignId);
    const qids = existing ? [...existing.question_ids, savedQ.question_id] : [savedQ.question_id];
    await dbService.saveAssignment(data.assignDate, data.grade, qids);
  }

  showToast(`[${savedQ.question_id}] 문항이 성공적으로 저장되었습니다!`, "success");
  renderAllViews();
}

// 스마트 텍스트 파서 적용 핸들러
function handleApplyParser() {
  const raw = document.getElementById("parser-input-text")?.value;
  if (!raw || !raw.trim()) {
    showToast("파싱할 원문 텍스트를 입력해 주세요.", "error");
    return;
  }

  const parsed = SmartTextParser.parse(raw);
  if (!parsed) return;

  // 폼 채우기
  state.currentSubject = parsed.subject;
  document.querySelectorAll(".sub-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.sub === parsed.subject);
  });
  updateSubjectTheme(parsed.subject);

  document.getElementById("input-grade").value = parsed.grade;
  document.getElementById("input-question-text").value = parsed.question_text;
  document.getElementById("input-passage").value = parsed.passage;
  document.getElementById("input-explanation").value = parsed.explanation;

  const container = document.getElementById("options-container");
  if (container) {
    container.innerHTML = "";
    parsed.options.forEach((optText, idx) => {
      addOptionInput(optText, idx + 1 === parsed.correct_answer);
    });
  }

  document.getElementById("modal-parser")?.classList.remove("open");
  showToast("원문 텍스트가 성공적으로 구조화되었습니다!", "success");
  triggerRealtimeValidation();
}

// ==============================================================================
// 2. 자녀 학습 현황 탭 (Overview Tab)
// ==============================================================================
async function renderOverviewTab() {
  const student = state.activeStudent;
  const grade = (student === "CHILD_G1") ? 1 : 3;

  // 통계 집계
  const stats = await dbService.getStudentStats(student);
  document.getElementById("stat-total-q").innerText = stats.totalQuestions;
  document.getElementById("stat-wrongs").innerText = stats.totalWrongs;
  document.getElementById("stat-mastered").innerText = stats.masteredCount;
  document.getElementById("stat-rate").innerText = `${stats.masteryRate}%`;

  // 과제 목록 렌더링
  const assignments = await dbService.getAllAssignments();
  const filtered = assignments.filter(a => a.target_grade === grade);

  const container = document.getElementById("overview-assignments-grid");
  if (!container) return;

  container.innerHTML = "";
  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 3rem;">등록된 일일 과제가 없습니다.</div>`;
    return;
  }

  for (const assign of filtered) {
    const fullAssign = await dbService.getAssignmentWithQuestions(assign.assignment_id);
    const card = document.createElement("div");
    card.className = "assign-card";
    card.innerHTML = `
      <div class="assign-header">
        <div class="assign-date">📅 ${formatDate(assign.assignment_date)} (중${assign.target_grade})</div>
        <div class="assign-q-count">${assign.total_questions}문항</div>
      </div>
      <div class="assign-questions-preview">
        ${(fullAssign?.questions || []).map(q => `
          <div class="assign-q-item">
            <span>[${q.subject}] ${q.question_text.slice(0, 24)}...</span>
            <span style="color: var(--accent-cyan);">정답: ${q.correct_answer}번</span>
          </div>
        `).join("")}
      </div>
      <div style="margin-top: auto; display: flex; justify-content: flex-end;">
        <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px;" onclick="window.simulateStudentTest('${assign.assignment_id}')">
          📝 학생 풀이 모의 테스트
        </button>
      </div>
    `;
    container.appendChild(card);
  }
}

function formatDate(dateStr) {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`;
}

// ==============================================================================
// 3. SRS 망각곡선 & 오답 노트 탭 (Reviews Tab)
// ==============================================================================
async function renderReviewsTab() {
  const student = state.activeStudent;
  const stats = await dbService.getStudentStats(student);
  const reviews = await dbService.getStudentReviews(student);

  // 단계별 카운트
  document.getElementById("srs-cnt-1").innerText = stats.stages.stage1;
  document.getElementById("srs-cnt-3").innerText = stats.stages.stage3;
  document.getElementById("srs-cnt-7").innerText = stats.stages.stage7;
  document.getElementById("srs-cnt-14").innerText = stats.stages.stage14;

  const container = document.getElementById("wrong-questions-container");
  if (!container) return;

  const wrongs = reviews.filter(r => (r.wrongCount || 0) > 0 || !r.last_is_correct);
  container.innerHTML = "";

  if (wrongs.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--accent-emerald); padding: 3rem;">🎉 현재 복습이 필요한 오답 문항이 없습니다!</div>`;
    return;
  }

  wrongs.forEach(item => {
    const q = item.question;
    const card = document.createElement("div");
    card.className = "wrong-question-card";
    card.innerHTML = `
      <div class="wrong-q-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="sub-pill active" data-sub="${q.subject}" style="padding: 2px 8px; font-size: 0.75rem;">${q.subject}</span>
          <span style="font-weight: 700;">${q.question_id || 'ID 미상'}</span>
        </div>
        <div style="display: flex; gap: 6px;">
          <span class="wrong-badge">누적 오답 ${item.wrongCount}회</span>
          <span style="font-size: 0.75rem; color: var(--text-dim); align-self: center;">다음 복습: ${formatDate(item.next_review_date)}</span>
        </div>
      </div>
      <div style="font-size: 0.95rem; font-weight: 600; margin: 0.6rem 0; color: #f1f5f9;">
        ${renderMathText(q.question_text || '')}
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted); background: var(--bg-input); padding: 8px 12px; border-radius: 6px;">
        💡 <strong>정답: ${q.correct_answer}번</strong> | ${renderMathText(q.explanation || '해설 없음')}
      </div>
      <div style="margin-top: 10px; display: flex; justify-content: flex-end; gap: 8px;">
        <button class="btn btn-secondary" style="font-size: 0.78rem; padding: 4px 10px;" onclick="window.reSolveWrong('${student}', '${item.question_id}')">
          🔄 다시 풀기 큐 즉시 추가
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ==============================================================================
// 4. 일괄 업로드 및 데이터 설정 모달 (Batch & Settings)
// ==============================================================================
function initBatchTools() {
  const dropzone = document.getElementById("json-dropzone");
  const fileInput = document.getElementById("json-file-input");

  if (!dropzone || !fileInput) return;

  dropzone.onclick = () => fileInput.click();

  dropzone.ondragover = (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  };
  dropzone.ondragleave = () => dropzone.classList.remove("dragover");
  dropzone.ondrop = (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
      handleBatchFile(e.dataTransfer.files[0]);
    }
  };

  fileInput.onchange = (e) => {
    if (e.target.files.length > 0) {
      handleBatchFile(e.target.files[0]);
    }
  };
}

function handleBatchFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const ok = dbService.importJSON(text);
    if (ok) {
      showToast(`'${file.name}' 데이터가 성공적으로 일괄 반영되었습니다!`, "success");
      renderAllViews();
    } else {
      showToast("JSON 파일 형식이 맞지 않습니다. sample_assignments.json 양식을 확인하세요.", "error");
    }
  };
  reader.readAsText(file, "utf-8");
}

function initSettingsModal() {
  document.getElementById("btn-open-settings")?.addEventListener("click", () => {
    document.getElementById("modal-settings")?.classList.add("open");
  });

  document.querySelectorAll(".modal-close-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
    };
  });

  document.getElementById("btn-reset-data")?.addEventListener("click", () => {
    if (confirm("모든 데이터를 초기 샘플 학습지 상태로 되돌리시겠습니까?")) {
      dbService.resetToDefault();
      showToast("데이터가 초기 샘플 상태로 복원되었습니다.", "success");
      renderAllViews();
    }
  });

  document.getElementById("btn-export-data")?.addEventListener("click", () => {
    const jsonStr = dbService.exportJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `harumaster_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast("백업 JSON 파일이 다운로드되었습니다.", "info");
  });
}

function renderAllViews() {
  triggerRealtimeValidation();
  if (state.activeTab === "overview") renderOverviewTab();
  if (state.activeTab === "reviews") renderReviewsTab();
}

// 전역 모의 풀이 테스트 헬퍼 (윈도우 객체 노출)
window.simulateStudentTest = async function(assignmentId) {
  const assign = await dbService.getAssignmentWithQuestions(assignmentId);
  if (!assign || !assign.questions.length) return;

  const student = state.activeStudent;
  const q = assign.questions[0];
  const isRight = confirm(`[학생 모의 풀이]\n문항: ${q.question_text.slice(0, 30)}...\n\n학생이 정답을 맞힌 것으로 시뮬레이션할까요?\n- '확인': 정답(O)\n- '취소': 오답(X)`);

  const chosen = isRight ? q.correct_answer : (q.correct_answer === 1 ? 2 : 1);
  const res = await dbService.submitAnswer(student, q.question_id, chosen);

  showToast(`모의 제출 완료: ${res.isCorrect ? '정답(O)' : '오답(X)'} -> 다음 복습일: ${res.srs.next_review_date}`, res.isCorrect ? "success" : "error");
  renderAllViews();
};

window.reSolveWrong = async function(student, qid) {
  await dbService.submitAnswer(student, qid, 999); // 오답 등록하여 주기 1일 리셋
  showToast("해당 문항이 오늘자 다시 풀기 큐에 등록되었습니다.", "info");
  renderAllViews();
};
