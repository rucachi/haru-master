/**
 * 하루마스터 (HaruMaster) - 자녀 전용 태블릿 학습 컨트롤러
 * 첫째 나경이(중3) / 둘째 차혜(중1) 과목 선택, 1일 20문제 학습 및 "더 공부하기(오답 포함)" 엔진
 */

import { dbService } from './firebase-service.js?v=f9e05cf';

// 기본 1일 학습 문항 수
const DAILY_TARGET = 20;
const DATASET_VERSION = "20261012-1080";

// 중학교 학년별/과목별 교육과정 기반 풍부한 문제 생성 뱅크 (20문제 풀 세트 보장)
const CURRICULUM_BANKS = {
  // === 중3 (나경이) ===
  3: {
    "수학": [
      {
        question_text: "이차방정식 $x^2 - 6x + 8 = 0$ 의 두 근의 합을 구하시오.",
        options: ["$2$", "$4$", "$6$", "$8$", "$10$"],
        correct_answer: 3,
        explanation: "근과 계수의 관계에 의해 두 근의 합은 $-(-6)/1 = 6$ 입니다."
      },
      {
        question_text: "다음 직각삼각형에서 밑변의 길이가 $6$, 높이가 $8$일 때 빗변의 길이는?",
        options: ["$9$", "$10$", "$11$", "$12$", "$14$"],
        correct_answer: 2,
        explanation: "피타고라스 정리에 의해 $6^2 + 8^2 = 36 + 64 = 100 = 10^2$ 이므로 빗변은 $10$입니다."
      },
      {
        question_text: "이차함수 $y = 2(x - 3)^2 + 5$ 의 꼭짓점의 좌표는?",
        options: ["$(-3, 5)$", "$(3, 5)$", "$(3, -5)$", "$(-3, -5)$", "$(2, 5)$"],
        correct_answer: 2,
        explanation: "$y = a(x - p)^2 + q$ 의 꼭짓점은 $(p, q)$이므로 $(3, 5)$입니다."
      },
      {
        question_text: "$\\sqrt{75} - \\sqrt{27}$ 을 간단히 한 결과는?",
        options: ["$\\sqrt{3}$", "$2\\sqrt{3}$", "$3\\sqrt{3}$", "$4\\sqrt{3}$", "$8\\sqrt{3}$"],
        correct_answer: 2,
        explanation: "$\\sqrt{75} = 5\\sqrt{3}$, $\\sqrt{27} = 3\\sqrt{3}$ 이므로 $5\\sqrt{3} - 3\\sqrt{3} = 2\\sqrt{3}$ 입니다."
      },
      {
        question_text: "직각삼각형에서 $\\angle B = 90^\\circ$이고 $\\angle A = 30^\\circ$, 빗변 $AC = 12$일 때 밑변 $BC$의 길이는? (단, $\\sin 30^\\circ = \\frac{1}{2}$)",
        options: ["$3$", "$4$", "$6$", "$6\\sqrt{3}$", "$8$"],
        correct_answer: 3,
        explanation: "$\\sin 30^\\circ = \\frac{BC}{AC} = \\frac{BC}{12} = \\frac{1}{2}$ 이므로 $BC = 6$ 입니다."
      },
      {
        question_text: "다음 식 $(2x + 3)(3x - 1)$ 을 전개했을 때 $x$의 계수는?",
        options: ["$5$", "$7$", "$9$", "$11$", "$13$"],
        correct_answer: 2,
        explanation: "$(2x)(3x) + (2x)(-1) + (3)(3x) + (3)(-1) = 6x^2 + 7x - 3$ 이므로 $x$의 계수는 $7$입니다."
      },
      {
        question_text: "이차방정식 $x^2 - 4 = 0$ 의 두 근의 곱은?",
        options: ["$-4$", "$-2$", "$0$", "$2$", "$4$"],
        correct_answer: 1,
        explanation: "$x^2 = 4$ 이므로 $x = \\pm 2$ 입니다. 두 근의 곱은 $2 \\times (-2) = -4$ 입니다."
      }
    ],
    "과학": [
      {
        question_text: "멘델의 유전 원리 중 서로 다른 대립 유전자 쌍이 서로 영향을 주지 않고 독립적으로 유전되는 법칙은?",
        options: ["우열의 원리", "분리의 법칙", "독립의 법칙", "연관의 법칙", "상보성의 원리"],
        correct_answer: 3,
        explanation: "두 쌍 이상의 대립 형질이 유전될 때 각각 독립적으로 분리되어 유전되는 현상은 독립의 법칙입니다."
      },
      {
        question_text: "물체가 자유 낙하할 때 공기 저항을 무시하면 역학적 에너지는 어떻게 되는가?",
        options: ["감소한다", "일정하게 보존된다", "증가한다", "0이 된다", "주기적으로 진동한다"],
        correct_answer: 2,
        explanation: "외력이 작용하지 않을 때 위치 에너지와 운동 에너지의 합인 역학적 에너지는 일정하게 보존됩니다."
      },
      {
        question_text: "다음 중 화학 변화(화학 반응)에 해당하는 현상으로 가장 알맞은 것은?",
        options: ["얼음이 녹아 물이 된다", "철이 녹슬어 붉어진다", "설탕이 물에 녹는다", "유리창이 깨진다", "향수 냄새가 퍼진다"],
        correct_answer: 2,
        explanation: "철이 산소와 반응하여 산화철로 성질이 바뀌는 것은 새로운 물질이 생성되는 화학 변화입니다."
      },
      {
        question_text: "지표면 부근의 공기가 가열되어 상승할 때 부피 팽창과 기온 하강으로 구름이 생기는 과정은?",
        options: ["단열 압축", "단열 팽창", "등온 팽창", "복사 냉각", "승화 작용"],
        correct_answer: 2,
        explanation: "상승하는 공기 덩어리는 주변 기압이 낮아져 팽창하면서 내부 에너지를 소모해 온도가 떨어지는 단열 팽창을 겪습니다."
      },
      {
        question_text: "별의 표면 온도가 가장 높은 색깔은?",
        options: ["붉은색", "주황색", "노란색", "흰색", "파란색"],
        correct_answer: 5,
        explanation: "별의 표면 온도가 높을수록 파란색(청색)을 띠고, 낮을수록 붉은색을 띱니다."
      }
    ],
    "국어": [
      {
        question_text: "다음 중 비유적 표현 중 'A는 B이다' 형태로 원관념과 보조관념을 직접 연결하는 표현법은?",
        options: ["직유법", "은유법", "의인법", "대유법", "과장법"],
        correct_answer: 2,
        explanation: "'내 마음은 호수요'와 같이 암시적으로 빗대는 방법은 은유법(Metaphor)입니다."
      },
      {
        question_text: "다음 단어 중 자음동화 현상(비음화)이 일어나는 예시로 알맞은 것은?",
        options: ["국물 [궁물]", "굳이 [구지]", "좋고 [조코]", "놓다 [노타]", "맨입 [맨닙]"],
        correct_answer: 1,
        explanation: "'국물'에서 받침 'ㄱ'이 비음 'ㅁ'을 만나 비음 'ㅇ'으로 동화되는 것은 비음화(자음동화)입니다."
      },
      {
        question_text: "토론에서 찬성 측과 반대 측이 상대방의 논리적 허점을 지적하고 질문하는 단계는?",
        options: ["입론", "반론(교차조사)", "최종 발언", "숙의 시간", "기조연설"],
        correct_answer: 2,
        explanation: "상대방의 주장을 반박하고 증거를 검증하는 과정은 반론 및 교차조사입니다."
      }
    ],
    "영어": [
      {
        question_text: "다음 빈칸에 알맞은 관계대명사는? 'The student _____ won the science contest is my sister.'",
        options: ["which", "who", "whom", "whose", "where"],
        correct_answer: 2,
        explanation: "선행사가 사람(The student)이고 주어 역할을 하므로 주격 관계대명사 who가 알맞습니다."
      },
      {
        question_text: "다음 문장의 수동태 변환으로 올바른 것은? 'He wrote this novel.'",
        options: [
          "This novel writes him.",
          "This novel was written by him.",
          "This novel has written by him.",
          "This novel is writing him.",
          "This novel will be wrote by him."
        ],
        correct_answer: 2,
        explanation: "과거 시제 수동태는 'be동사 과거형(was) + 과거분사(written) + by 행위자' 입니다."
      },
      {
        question_text: "Choose the correct meaning of the idiom: 'piece of cake'",
        options: ["Very delicious food", "Something very easy", "A difficult challenge", "A special birthday gift", "A dangerous situation"],
        correct_answer: 2,
        explanation: "'piece of cake'는 '식은 죽 먹기, 매우 쉬운 일'을 뜻하는 관용구입니다."
      }
    ],
    "사회": [
      {
        question_text: "시장 경제에서 수요와 공급이 일치하여 가격이 결정되는 지점의 가격은?",
        options: ["최고 가격", "최저 가격", "균형 가격", "독점 가격", "공공 요금"],
        correct_answer: 3,
        explanation: "수요 곡선과 공급 곡선이 만나는 지점에서 결정되는 가격을 균형 가격(Equilibrium Price)이라고 합니다."
      },
      {
        question_text: "국가 권력의 남용을 막고 국민의 기본권을 보장하기 위해 국가 권력을 분립하는 원리는?",
        options: ["국민주권주의", "권력분립의 원리", "법치주의", "복지국가의 원리", "평화통일의 원리"],
        correct_answer: 2,
        explanation: "입법, 사법, 행정으로 국가 권력을 나누어 상호 견제와 균형을 이루는 원리는 권력분립입니다."
      }
    ],
    "역사": [
      {
        question_text: "1919년 3월 1일 만세 운동 이후 수립되어 독립운동을 통할한 민주공화제 정부는?",
        options: ["대한제국", "대한민국 임시정부", "조선건국준비위원회", "신민회", "의열단"],
        correct_answer: 2,
        explanation: "3·1 운동의 결실로 상하이에 수립된 대한민국 임시정부는 최초의 삼권분립 민주공화정부였습니다."
      },
      {
        question_text: "1894년 반봉건·반외세를 기치로 전봉준 등을 중심으로 일어난 민중 운동은?",
        options: ["동학농민운동", "임오군란", "갑신정변", "만민공동회", "국채보상운동"],
        correct_answer: 1,
        explanation: "1894년 고부 군수 조병갑의 탐학에 맞서 시작된 거족적 농민 봉기는 동학농민운동입니다."
      }
    ]
  },

  // === 중1 (차혜) ===
  1: {
    "수학": [
      {
        question_text: "자연수 $60$을 소인수분해한 결과로 알맞은 것은?",
        options: ["$2 \\times 3 \\times 10$", "$2^2 \\times 3 \\times 5$", "$2 \\times 3^2 \\times 5$", "$4 \\times 15$", "$2^3 \\times 3 \\times 5$"],
        correct_answer: 2,
        explanation: "$60 = 4 \\times 15 = 2^2 \\times 3 \\times 5$ 로 소수들만의 곱으로 나타냅니다."
      },
      {
        question_text: "다음 계산 결과가 가장 큰 것은?",
        options: ["$(-3) + (+5)$", "$(-4) - (-6)$", "$(-2) \\times (-3)$", "$(-10) \\div (+2)$", "$0 + (-5)$"],
        correct_answer: 3,
        explanation: "$(-2) \\times (-3) = +6$ 으로 가장 큽니다."
      },
      {
        question_text: "일차방정식 $3x - 5 = 10$ 의 해 $x$의 값을 구하시오.",
        options: ["$3$", "$4$", "$5$", "$6$", "$7$"],
        correct_answer: 3,
        explanation: "$3x = 10 + 5 = 15$ 이므로 $x = 5$ 입니다."
      },
      {
        question_text: "좌표평면 위에서 점 $P(-3, 4)$ 가 속한 사분면은?",
        options: ["제1사분면", "제2사분면", "제3사분면", "제4사분면", "x축 위"],
        correct_answer: 2,
        explanation: "$x$좌표가 음수(-)이고 $y$좌표가 양수(+)인 사분면은 제2사분면입니다."
      },
      {
        question_text: "정비례 관계 $y = 3x$ 에서 $x = -2$ 일 때 $y$의 값은?",
        options: ["$-6$", "$-3$", "$1$", "$3$", "$6$"],
        correct_answer: 1,
        explanation: "$y = 3 \\times (-2) = -6$ 입니다."
      },
      {
        question_text: "두 수 $12$와 $18$의 최대공약수는?",
        options: ["$2$", "$3$", "$6$", "$12$", "$36$"],
        correct_answer: 3,
        explanation: "$12 = 2^2 \\times 3$, $18 = 2 \\times 3^2$ 이므로 최대공약수는 $2 \\times 3 = 6$ 입니다."
      },
      {
        question_text: "절댓값이 $5$인 정수를 모두 구한 것은?",
        options: ["$5$", "$-5$", "$-5, 5$", "$0, 5$", "$-10, 10$"],
        correct_answer: 3,
        explanation: "원점에서의 거리가 5인 정수는 $-5$와 $+5$ 두 개입니다."
      }
    ],
    "과학": [
      {
        question_text: "액체 상태의 물이 수증기(기체)로 상태 변화할 때 일어나는 현상으로 알맞은 것은?",
        options: ["응고", "기화", "액화", "융해", "승화(기체→고체)"],
        correct_answer: 2,
        explanation: "액체가 열에너지를 흡수하여 기체로 변하는 상태 변화는 기화(Vaporization)입니다."
      },
      {
        question_text: "지구의 내부 구조 중 부피가 가장 크며 고체 상태의 암석으로 이루어진 층은?",
        options: ["지각", "맨틀", "외핵", "내핵", "대기권"],
        correct_answer: 2,
        explanation: "지구 전체 부피의 약 80%를 차지하며 규산염 암석으로 이루어진 층은 맨틀(Mantle)입니다."
      },
      {
        question_text: "빛이 공기 중에서 물로 비스듬히 입사할 때 경계면에서 진행 방향이 꺾이는 현상은?",
        options: ["빛의 반사", "빛의 굴절", "빛의 분산", "빛의 합성", "빛의 직진"],
        correct_answer: 2,
        explanation: "물질에 따른 빛의 속력 차이로 인해 진행 경로가 꺾이는 현상은 굴절(Refraction)입니다."
      },
      {
        question_text: "생물 분류 체계의 7단계 중 가장 기본이 되는 단위는?",
        options: ["계", "문", "강", "목", "종"],
        correct_answer: 5,
        explanation: "자연 상태에서 자유롭게 교배하여 번식 능력이 있는 자손을 낳을 수 있는 집단은 종(Species)입니다."
      },
      {
        question_text: "물체가 힘을 받아 변형되었다가 힘을 없애면 원래 모양으로 되돌아가는 성질은?",
        options: ["마찰력", "탄성력", "중력", "부력", "자기력"],
        correct_answer: 2,
        explanation: "변형된 물체가 원래 모양으로 복원되려는 힘은 탄성력입니다."
      }
    ],
    "국어": [
      {
        question_text: "시에서 같은 말이나 글자, 문장 구조가 반복되면서 생기는 음악적 느낌은?",
        options: ["심상(이미지)", "운율(리듬)", "어조", "복선", "주제"],
        correct_answer: 2,
        explanation: "시에서 소리의 반복을 통해 느껴지는 말의 가락이나 음악성을 운율이라고 합니다."
      },
      {
        question_text: "소설의 5단계 구성 단계 중 사건의 갈등이 최고조에 달하는 단계는?",
        options: ["발단", "전개", "위기", "절정", "결말"],
        correct_answer: 4,
        explanation: "인물 간의 갈등과 긴장감이 극대화되는 단계는 절정(Climax)입니다."
      },
      {
        question_text: "사람이 아닌 사물이나 관념을 사람처럼 표현하는 비유법은?",
        options: ["의인법", "활유법", "직유법", "대유법", "도치법"],
        correct_answer: 1,
        explanation: "'꽃이 활짝 웃는다', '바람이 노래한다'처럼 표현하는 방법은 의인법입니다."
      }
    ],
    "영어": [
      {
        question_text: "다음 빈칸에 알맞은 be동사는? 'They _____ playing soccer in the park.'",
        options: ["am", "is", "are", "be", "was"],
        correct_answer: 3,
        explanation: "주어가 3인칭 복수(They)이므로 현재형 be동사는 are가 알맞습니다."
      },
      {
        question_text: "다음 중 의문문 '_____ do you live?' 에 대한 알맞은 답은?",
        options: ["At 7 o'clock.", "In Seoul.", "Because I'm tired.", "By bus.", "Yes, I do."],
        correct_answer: 2,
        explanation: "'Where do you live?'(너는 어디 사니?)라는 장소 질문에는 'In Seoul.'(서울에 살아)이 알맞습니다."
      },
      {
        question_text: "다음 단어의 반의어(반대말)로 올바른 것은? 'clean'",
        options: ["bright", "dirty", "quiet", "quick", "heavy"],
        correct_answer: 2,
        explanation: "'clean'(깨끗한)의 반대말은 'dirty'(더러운)입니다."
      }
    ],
    "사회": [
      {
        question_text: "지구상에서 적도 부근에 위치하여 연중 기온이 높고 강수량이 많은 기후는?",
        options: ["열대 기후", "건조 기후", "온대 기후", "냉대 기후", "한대 기후"],
        correct_answer: 1,
        explanation: "가장 더운 열대 기후는 연중 강수량이 많아 밀림과 열대우림이 발달합니다."
      },
      {
        question_text: "지구의 본초 자오선(경도 0도)이 지나는 영국 런던의 그리니치 천문대를 기준으로 정한 표준시는?",
        options: ["세계 표준시(UTC)", "태양시", "지방시", "서머타임", "시차"],
        correct_answer: 1,
        explanation: "경도 0도 자오선을 기준으로 전 세계 시간의 기준이 되는 시간은 세계 표준시입니다."
      }
    ],
    "역사": [
      {
        question_text: "우리나라 역사상 최초의 고대 국가로 단군왕검이 건국한 나라는?",
        options: ["고구려", "백제", "신라", "고조선", "부여"],
        correct_answer: 4,
        explanation: "기원전 2333년 청동기 문화를 바탕으로 건국된 한반도 최초의 국가는 고조선입니다."
      },
      {
        question_text: "신라 제24대 왕으로 한강 유역을 차지하고 전성기를 이끈 왕은?",
        options: ["광개토대왕", "근초고왕", "진흥왕", "무열왕", "문무왕"],
        correct_answer: 3,
        explanation: "신라의 영토를 크게 넓히고 순수비를 세운 전성기 군주는 진흥왕입니다."
      }
    ]
  }
};

class StudentApp {
  constructor(config) {
    this.config = config || { id: 'nakyung', name: '나경이', grade: 3 };
    this.selectedSubject = "ALL"; // "ALL" or 특정 과목
    this.questions = [];
    this.currentIndex = 0;
    this.selectedAnswer = null;
    this.isGraded = false;
    this.solvedCount = 0;
    this.correctCount = 0;
    this.sessionWrongQuestions = []; // 이번 세션에서 틀린 문제 저장
    this.loadRequestId = 0;
    this.init();
  }

  async init() {
    this.applyTheme();
    this.checkDadCheer();
    this.initSubjectSelector();
    this.initSPenScratchpad();
    this.initEventListeners();
    await this.loadQuestions(false);
  }

  checkDadCheer() {
    const raw = localStorage.getItem(`harumaster_cheer_${this.config.id}`);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data && data.message) {
        const existing = document.querySelector(".dad-cheer-banner");
        if (existing) existing.remove();

        const cheerBanner = document.createElement("div");
        cheerBanner.className = "dad-cheer-banner";
        const message = document.createElement("span");
        message.append("💌 ");
        const label = document.createElement("strong");
        label.textContent = "아빠의 응원: ";
        message.append(label, `"${data.message}"`);
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "btn-close-cheer";
        closeButton.title = "응원 메시지 닫기";
        closeButton.textContent = "✕";
        closeButton.addEventListener("click", () => cheerBanner.remove());
        cheerBanner.append(message, closeButton);
        document.querySelector(".student-header")?.insertAdjacentElement("afterend", cheerBanner);
      }
    } catch (e) {}
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

  initSubjectSelector() {
    const bar = document.getElementById("student-subject-bar");
    if (!bar) return;

    bar.querySelectorAll(".sub-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        bar.querySelectorAll(".sub-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedSubject = btn.dataset.sub;
        this.loadQuestions(false);
      });
    });
  }

  /**
   * 1일 20문제 스마트 생성 및 로드
   * @param {boolean} isMoreStudy '더 공부하기' 버튼 여부 (오답 문항 1순위 강제 포함)
   */
  async loadQuestions(isMoreStudy = false) {
    const requestId = ++this.loadRequestId;
    const compEl = document.getElementById("completion-screen");
    const gridEl = document.getElementById("study-workspace-grid");
    if (compEl) compEl.style.display = "none";
    if (gridEl) gridEl.style.display = "grid";

    const grade = this.config.grade;
    const subFilter = this.selectedSubject;

    // 1. 과거 에빙하우스 오답 문항 및 이번 세션 오답 문항 수집 (1순위 포함 대상)
    const wrongPool = [];
    const seenQids = new Set();

    // (1) 이번 세션에서 틀렸던 문제
    this.sessionWrongQuestions.forEach(q => {
      if (!seenQids.has(q.question_id)) {
        if (subFilter === "ALL" || q.subject === subFilter) {
          wrongPool.push({ ...q, _isWrongReview: true });
          seenQids.add(q.question_id);
        }
      }
    });

    // (2) Firebase SRS 복습 문항 중 오답 이력이 있는 문항
    const studentReviews = await dbService.getStudentReviews(this.config.id);
    if (requestId !== this.loadRequestId) return;
    const dueOrWrongs = studentReviews.filter(r => (r.wrongCount > 0 || !r.last_is_correct));
    dueOrWrongs.forEach(r => {
      if (r.question && !seenQids.has(r.question_id)) {
        if (subFilter === "ALL" || r.question.subject === subFilter) {
          wrongPool.push({ ...r.question, _isWrongReview: true });
          seenQids.add(r.question_id);
        }
      }
    });

    // 2. DB에 등록된 정규 문항 수집
    let allDbQuestions = await dbService.getAllQuestions();
    let gradeDbCount = allDbQuestions.filter(q => q.grade === grade).length;

    const datasetVersionKey = `harumaster_dataset_version_${grade}`;
    const needsDatasetRefresh = localStorage.getItem(datasetVersionKey) !== DATASET_VERSION;

    // 데이터셋 버전이 바뀌었거나 로컬 DB가 비어 있으면 최신 학생별 JSON을 다시 반영한다.
    if (needsDatasetRefresh || gradeDbCount < 40) {
      try {
        const file = (grade === 3) 
          ? "study_data/nakyeong/nakyung_questions_480.json" 
          : "study_data/chahye/chahye_questions_380.json";
        const res = await fetch(file);
        if (res.ok) {
          const list = await res.json();
          if (requestId !== this.loadRequestId) return;
          await dbService.importJSON(JSON.stringify(list));
          localStorage.setItem(datasetVersionKey, DATASET_VERSION);
          allDbQuestions = await dbService.getAllQuestions();
        }
      } catch (err) {
        console.warn("로컬 커리큘럼 데이터 프리로드 건너뜀:", err);
      }
    }

    const candidateDbPool = allDbQuestions.filter(q => {
      if (q.grade !== grade) return false;
      if (subFilter !== "ALL" && q.subject !== subFilter) return false;
      return true;
    });

    // 3. 커리큘럼 뱅크 문항 수집 (내장 고품질 풀)
    const gradeCurriculum = CURRICULUM_BANKS[grade] || {};
    const bankPool = [];
    if (subFilter === "ALL") {
      Object.entries(gradeCurriculum).forEach(([sub, list]) => {
        list.forEach((item, idx) => {
          bankPool.push({
            ...item,
            question_id: `BANK_G${grade}_${sub}_${idx + 1}`,
            grade,
            subject: sub
          });
        });
      });
    } else if (gradeCurriculum[subFilter]) {
      gradeCurriculum[subFilter].forEach((item, idx) => {
        bankPool.push({
          ...item,
          question_id: `BANK_G${grade}_${subFilter}_${idx + 1}`,
          grade,
          subject: subFilter
        });
      });
    }

    // 4. 과목별 맞춤 배정 및 최신 문제 우선 일일 랜덤 추출 엔진
    // 사용자 지정: 수학 8, 국어 독해 4, 영어 독해 4, 나머지 과목 3문항씩 (나경이 25문항 / 차혜 22문항)
    const SUBJECT_QUOTAS = {
      3: { "수학": 8, "국어": 4, "영어": 4, "과학": 3, "사회": 3, "역사": 3 },
      1: { "수학": 8, "국어": 4, "영어": 4, "과학": 3, "사회": 3 }
    };

    const quotaMap = SUBJECT_QUOTAS[grade] || { "수학": 8, "국어": 4, "영어": 4, "과학": 3, "사회": 3 };
    const targetSubjects = (subFilter === "ALL") ? Object.keys(quotaMap) : [subFilter];

    // 날짜 기반 시드 생성 (오늘 하루 동안은 새로고침해도 동일 세트 유지, 내일이 되면 자동으로 새로운 문제로 갱신)
    const todayStr = this.getDateKey();
    const baseSeed = isMoreStudy ? Date.now() : this.hashSeed(`${todayStr}_${this.config.id}`);

    let finalQuestions = [];

    targetSubjects.forEach((sub, sIdx) => {
      const quota = (subFilter === "ALL") ? (quotaMap[sub] || 3) : (quotaMap[sub] ? Math.max(quotaMap[sub], 10) : 10);

      // (1) 해당 과목의 오답 문항 수집 (최대 1~2개 우선 배정)
      const subWrongs = wrongPool.filter(q => q.subject === sub);
      const subChosen = [];

      if (subWrongs.length > 0) {
        this.shuffleArrayWithSeed(subWrongs, baseSeed + sIdx * 7);
        const wrongTake = Math.min(subWrongs.length, Math.max(1, Math.floor(quota * 0.3)));
        for (let i = 0; i < wrongTake; i++) {
          subChosen.push(subWrongs[i]);
          seenQids.add(subWrongs[i].question_id);
        }
      }

      // (2) 해당 과목의 DB 및 커리큘럼 문항 수집
      let subCandidates = [
        ...candidateDbPool.filter(q => q.subject === sub && !seenQids.has(q.question_id)),
        ...bankPool.filter(q => q.subject === sub && !seenQids.has(q.question_id))
      ];

      // ★ [필수 요구사항] 국어와 영어는 최소 1문항 이상의 긴 문단 독해 문제(Passage >= 80자)를 100% 반드시 포함!
      if (sub === "국어" || sub === "영어") {
        const longPassagePool = subCandidates.filter(q => q.passage && q.passage.trim().length >= 80 && !seenQids.has(q.question_id));
        if (longPassagePool.length > 0) {
          // 일일 시드로 독해 풀 셔플 후 최우선 확정 선발
          this.shuffleArrayWithSeed(longPassagePool, baseSeed + sIdx * 89);
          const mandatoryPassageQ = longPassagePool[0];
          subChosen.push(mandatoryPassageQ);
          seenQids.add(mandatoryPassageQ.question_id);
          subCandidates = subCandidates.filter(q => q.question_id !== mandatoryPassageQ.question_id);
        } else {
          // 풀에 긴 지문이 없는 예외 상황 발생 시에도 동적 긴 지문 독해 생성기로 1문제 무조건 확보
          const dynamicPassageQ = this.generateDynamicQuestion(grade, sub, 1);
          subChosen.push(dynamicPassageQ);
          seenQids.add(dynamicPassageQ.question_id);
        }
      }

      // (3) 최신 업데이트 문제 중심 배치:
      // 문제 풀의 후반부(최신 단원/최신 생성 문항)에 65% 가중치 부여
      const remainingQuota = quota - subChosen.length;
      if (remainingQuota > 0 && subCandidates.length > 0) {
        // 후보군을 최신순(인덱스 역순)으로 정렬
        const sortedCandidates = [...subCandidates].reverse();
        
        // 최신 풀(상위 60%)과 기본 풀(하위 40%) 분할
        const splitIdx = Math.max(1, Math.floor(sortedCandidates.length * 0.6));
        const recentPool = sortedCandidates.slice(0, splitIdx);
        const olderPool = sortedCandidates.slice(splitIdx);

        // 최신 풀에서 65% 추출
        const recentTakeCount = Math.min(recentPool.length, Math.ceil(remainingQuota * 0.65));
        this.shuffleArrayWithSeed(recentPool, baseSeed + sIdx * 31);
        for (let i = 0; i < recentTakeCount; i++) {
          if (recentPool[i]) {
            subChosen.push(recentPool[i]);
            seenQids.add(recentPool[i].question_id);
          }
        }

        // 나머지 분량을 이전 풀 + 남은 최신 풀에서 보충
        const remainingToPick = quota - subChosen.length;
        const fallbackPool = [...olderPool, ...recentPool.slice(recentTakeCount)].filter(q => !seenQids.has(q.question_id));
        this.shuffleArrayWithSeed(fallbackPool, baseSeed + sIdx * 53);

        for (let i = 0; i < remainingToPick && i < fallbackPool.length; i++) {
          subChosen.push(fallbackPool[i]);
          seenQids.add(fallbackPool[i].question_id);
        }
      }

      // 부족한 경우 동적 생성기로 채우기
      let dynCounter = 1;
      while (subChosen.length < quota) {
        const dynQ = this.generateDynamicQuestion(grade, sub, dynCounter++);
        subChosen.push(dynQ);
      }

      finalQuestions.push(...subChosen);
    });

    // 각 과목 문제가 자연스럽게 번갈아가며 나오도록 날짜 시드로 전체 셔플
    this.shuffleArrayWithSeed(finalQuestions, baseSeed + 999);

    this.questions = finalQuestions;
    this.isGraded = false;

    if (requestId !== this.loadRequestId) return;

    // 오늘 학습 진행 상태(몇 번째 문제까지 풀었는지) 안전 복원
    const progressKey = `harumaster_prog_${this.config.id}_${todayStr}_${subFilter}`;
    let restored = false;

    if (!isMoreStudy) {
      try {
        const saved = JSON.parse(localStorage.getItem(progressKey));
        if (saved && typeof saved.currentIndex === 'number' && saved.currentIndex < this.questions.length) {
          this.currentIndex = saved.currentIndex;
          this.solvedCount = saved.solvedCount || 0;
          this.correctCount = saved.correctCount || 0;
          restored = (this.currentIndex > 0);
        } else {
          this.currentIndex = 0;
          this.solvedCount = 0;
          this.correctCount = 0;
        }
      } catch (e) {
        this.currentIndex = 0;
        this.solvedCount = 0;
        this.correctCount = 0;
      }
    } else {
      localStorage.removeItem(progressKey);
      this.currentIndex = 0;
      this.solvedCount = 0;
      this.correctCount = 0;
    }

    this.renderCurrentQuestion();
    this.updateProgress();

    if (restored) {
      this.showToast(`✨ ${this.currentIndex + 1}번 문제부터 이어서 풀이를 시작합니다!`, "info");
    } else if (isMoreStudy) {
      this.showToast(`🔥 ${this.questions.length}문제가 새롭게 생성되었습니다! (틀린 문제 복습 포함 ✨)`, "success");
    }
  }

  /**
   * 날짜 및 고유 문자열 기반 시드 해시 함수
   */
  hashSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  getDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * 시드 기반 난수 셔플 (Fisher-Yates with PRNG)
   */
  shuffleArrayWithSeed(array, seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;

    const pseudoRandom = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(pseudoRandom() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * 수학/과학 등 부족한 문제를 20개까지 무한 동적 생성하는 생성기
   */
  generateDynamicQuestion(grade, subject, seedNum) {
    const sub = (subject === "ALL") ? ["수학", "과학", "국어", "영어"][seedNum % 4] : subject;
    
    if (sub === "수학") {
      if (grade === 3) {
        const a = (seedNum % 5) + 2;
        const b = (seedNum % 4) + 1;
        const sum = a + b;
        const prod = a * b;
        return {
          question_id: `DYN_M3_MATH_${Date.now()}_${seedNum}`,
          grade: 3,
          subject: "수학",
          question_text: `이차방정식 $x^2 - ${sum}x + ${prod} = 0$ 의 두 근의 합을 구하시오.`,
          options: [`$${sum - 2}$`, `$${sum - 1}$`, `$${sum}$`, `$${sum + 1}$`, `$${sum + 2}$`],
          correct_answer: 3,
          explanation: `근과 계수의 관계에 의해 두 근의 합은 $-(-${sum})/1 = ${sum}$ 입니다.`
        };
      } else {
        const x = (seedNum % 6) + 2;
        const coef = (seedNum % 3) + 2;
        const constant = (seedNum % 4) + 1;
        const rhs = coef * x + constant;
        return {
          question_id: `DYN_M1_MATH_${Date.now()}_${seedNum}`,
          grade: 1,
          subject: "수학",
          question_text: `일차방정식 $${coef}x + ${constant} = ${rhs}$ 의 해를 구하시오.`,
          options: [`$x = ${x - 2}$`, `$x = ${x - 1}$`, `$x = ${x}$`, `$x = ${x + 1}$`, `$x = ${x + 2}$`],
          correct_answer: 3,
          explanation: `$${coef}x = ${rhs} - ${constant} = ${coef * x}$ 이므로 $x = ${x}$ 입니다.`
        };
      }
    }

    if (sub === "국어") {
      const korPassages = [
        {
          passage: "인공지능(AI) 기술이 비약적으로 발전하면서 의료, 금융, 예술 등 다양한 분야에서 혁신이 이루어지고 있다. 그러나 기술의 발전 이면에는 알고리즘 편향성, 개인정보 침해, 창작물의 저작권 귀속 문제 등 해결해야 할 윤리적 과제가 산적해 있다. 기술은 인간의 삶을 풍요롭게 만드는 도구여야 하며, 이를 올바르게 통제하고 공정성을 담보할 수 있는 사회적 합의와 규범 마련이 시급하다.",
          q: "윗글의 중심 내용(주제)으로 가장 적절한 것은?",
          opts: [
            "인공지능의 산업적 이점과 경제적 가치",
            "인공지능 기술 발전에 따른 윤리적 과제와 사회적 합의의 필요성",
            "의료 분야에서 인공지능 알고리즘의 한계",
            "예술 창작에서 저작권 침해 사례와 처벌 기준",
            "개인정보 보호를 위한 최신 암호화 기술"
          ],
          ans: 2,
          exp: "지문은 인공지능 기술의 발전과 함께 대두되는 윤리적 과제들을 지적하고, 이를 해결하기 위한 사회적 합의의 필요성을 강조하고 있습니다."
        },
        {
          passage: "독서는 단순히 문자를 읽고 정보를 습득하는 수동적 행위가 아니다. 독자는 자신이 지닌 배경지식과 경험을 바탕으로 글쓴이가 숨겨둔 맥락을 추론하고, 제시된 주장의 타당성을 비판적으로 검토하며 새로운 의미를 능동적으로 재구성한다. 따라서 깊이 있는 독서를 위해서는 글의 표면적 의미에 머무르지 않고, 행간에 담긴 의도를 탐색하는 주체적 태도가 요구된다.",
          q: "윗글을 바탕으로 추론할 수 있는 바람직한 독서 태도는?",
          opts: [
            "글쓴이의 주장을 의심 없이 그대로 수용한다.",
            "배경지식의 개입을 배제하고 글자 자체에만 집중한다.",
            "자신의 지식과 경험을 활용하여 비판적·능동적으로 의미를 재구성한다.",
            "빠른 속도로 많은 양의 책을 다독하는 데 초점을 맞춘다.",
            "작가의 의도보다는 문장의 문법적 오류를 찾는 데 집중한다."
          ],
          ans: 3,
          exp: "지문은 독서를 수동적 수용이 아닌, 배경지식과 경험을 바탕으로 능동적·비판적으로 의미를 재구성하는 과정이라고 설명하고 있습니다."
        }
      ];
      const pData = korPassages[seedNum % korPassages.length];
      return {
        question_id: `DYN_G${grade}_KOR_READING_${Date.now()}_${seedNum}`,
        grade,
        subject: "국어",
        passage: pData.passage,
        question_text: pData.q,
        options: pData.opts,
        correct_answer: pData.ans,
        explanation: pData.exp
      };
    }

    if (sub === "영어") {
      const engPassages = [
        {
          passage: "Many scientists believe that sleep plays a crucial role in memory consolidation. When we sleep, our brain actively processes and organizes the information learned throughout the day. Without sufficient rest, neural connections become weakened, making it significantly harder to recall facts and concentrate on complex tasks. Therefore, maintaining consistent sleep habits is just as vital for academic success as studying diligently.",
          q: "What is the main topic of the passage above?",
          opts: [
            "The chemical composition of human brain cells",
            "The essential role of sleep in memory and learning",
            "Different types of dreams during deep sleep",
            "Effective methods to study for final exams",
            "How to reduce stress through physical exercise"
          ],
          ans: 2,
          exp: "지문은 수면이 기억 정리와 학습에 미치는 결정적 중요성을 다루고 있습니다. (The essential role of sleep in memory and learning)"
        },
        {
          passage: "Climate change is one of the most pressing challenges of our era. Rising global temperatures have led to extreme weather events, shrinking polar ice caps, and unprecedented biodiversity loss. To tackle this crisis, international cooperation is essential, along with transition toward renewable energy sources like solar and wind power. Every small eco-friendly choice made by individuals also contributes to a sustainable future.",
          q: "According to the passage, which action is NOT suggested to address climate change?",
          opts: [
            "Global international cooperation",
            "Transitioning to solar and wind energy",
            "Individual eco-friendly lifestyle choices",
            "Increasing reliance on fossil fuels",
            "Protecting global biodiversity"
          ],
          ans: 4,
          exp: "기후 위기 해결책으로 재생 에너지 전환, 국제 협력, 개인의 친환경 실천이 제시되었으며, 화석 연료 의존도 증가는 해결책과 정반대입니다."
        }
      ];
      const pData = engPassages[seedNum % engPassages.length];
      return {
        question_id: `DYN_G${grade}_ENG_READING_${Date.now()}_${seedNum}`,
        grade,
        subject: "영어",
        passage: pData.passage,
        question_text: pData.q,
        options: pData.opts,
        correct_answer: pData.ans,
        explanation: pData.exp
      };
    }

    // 기본 대체 문항
    return {
      question_id: `DYN_GEN_${Date.now()}_${seedNum}`,
      grade,
      subject: sub,
      question_text: `[${sub}] 다음 핵심 개념 중 올바른 설명으로 가장 알맞은 것은? (세트 ${seedNum}번)`,
      options: [
        "기본 개념 원리를 바르게 이해하고 적용한다.",
        "항상 반대되는 성질만을 암기한다.",
        "공식과 풀이 과정을 점검하지 않는다.",
        "오답 복습 없이 문제만 많이 푼다.",
        "지문과 보기를 대조하지 않는다."
      ],
      correct_answer: 1,
      explanation: "기본 개념의 핵심 원리를 명확하게 이해하고 풀이 과정을 꼼꼼히 점검하는 것이 올바른 학습법입니다."
    };
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

    // 카운터: 1 / 20 문항
    const counterEl = document.getElementById("q-counter-text");
    if (counterEl) {
      counterEl.innerText = `오늘의 과제 ${this.currentIndex + 1} / ${this.questions.length} 문항`;
    }

    // 과목 뱃지
    const subPill = document.getElementById("q-subject-pill");
    if (subPill) subPill.innerText = q.subject || "공통";

    // 문제 새로고침 버튼 텍스트 업데이트
    const refreshText = document.getElementById("refresh-btn-text");
    if (refreshText) {
      if (this.selectedSubject === "ALL") {
        const totalTarget = (this.config.grade === 3) ? 25 : 22;
        refreshText.innerText = `전체 새 문제 (${totalTarget})`;
      } else {
        refreshText.innerText = `${this.selectedSubject} 새 문제 (10)`;
      }
    }

    // 오답 다시 풀기 뱃지
    const srsBadge = document.getElementById("q-srs-badge");
    if (srsBadge) {
      srsBadge.style.display = q._isWrongReview ? "inline-block" : "none";
      if (q._isWrongReview) {
        srsBadge.innerText = "🔥 틀린 문제 집중 복습";
      }
    }

    // 지문 (국어, 영어, 탐구 자료 등 - 내부 스크롤 없이 시원하게 표시)
    const passageBox = document.getElementById("q-passage-box");
    if (passageBox) {
      if (q.passage && q.passage.trim()) {
        passageBox.style.display = "block";
        passageBox.innerHTML = `
          <div class="q-passage-header">
            <span>📖</span> [ 다음 글을 읽고 물음에 답하시오 ]
          </div>
          <div class="q-passage-content">${this.renderMath(q.passage)}</div>
        `;
      } else {
        passageBox.style.display = "none";
        passageBox.innerHTML = "";
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

    // 좌측 문제 패널 및 전체 창 스크롤 맨 위로 초기화 (이전 문제 스크롤 잔여로 인한 잘림 방지)
    const qPane = document.getElementById("question-pane");
    if (qPane) {
      qPane.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  selectOption(num) {
    if (this.isGraded) return;
    this.selectedAnswer = num;

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
    if (isCorrect) {
      this.correctCount++;
    } else {
      // 오답 목록에 보관 (더 공부하기 누를 때 즉시 포함)
      this.sessionWrongQuestions.push(q);
    }

    // 보기 하이라이트
    document.querySelectorAll(".opt-card-btn").forEach(btn => {
      btn.disabled = true;
      const num = Number(btn.dataset.num);
      if (num === q.correct_answer) {
        btn.classList.add("correct-reveal");
      } else if (num === this.selectedAnswer) {
        btn.classList.add("wrong-reveal");
      }
    });

    // 해설 및 피드백 표시
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
            🌱 ${this.config.name}아, 걱정 마! '더 공부하기' 누르면 다시 도전할 수 있어!
          </div>
        ` : ''}
      `;
    }

    if (isCorrect) {
      this.triggerConfetti();
    }

    const submitBtn = document.getElementById("btn-submit-answer");
    if (submitBtn) submitBtn.style.display = "none";

    const nextBtn = document.getElementById("btn-next-question");
    if (nextBtn) {
      nextBtn.style.display = "block";
      nextBtn.innerText = (this.currentIndex + 1 === this.questions.length) ? `🏆 ${this.questions.length}문제 결과 보기` : "다음 문제 풀기 ➔";
    }

    this.updateProgress();

    // 채점 화면은 저장 서버 상태와 분리해 즉시 표시한다.
    try {
      // 내장/동적 문항도 SRS 기록 대상이 되도록 먼저 로컬 DB에 등록한다.
      const storedQuestion = await dbService.getQuestion(q.question_id);
      if (!storedQuestion) {
        await dbService.saveQuestion(q);
      }
      await dbService.submitAnswer(this.config.id, q.question_id, this.selectedAnswer);
    } catch (error) {
      console.warn("답안 저장 실패 (화면 채점은 완료됨):", error);
      this.showToast("채점은 완료됐지만 학습 기록 저장에 실패했습니다. 잠시 후 다시 동기화해 주세요.", "error");
    }
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.clearCanvas) {
      this.clearCanvas(); // 새 문제로 넘어갈 때 S펜 연습장 자동 정리
    }
    this.saveProgressLocally();
    this.renderCurrentQuestion();
    this.updateProgress();
  }

  saveProgressLocally() {
    const todayStr = this.getDateKey();
    const progressKey = `harumaster_prog_${this.config.id}_${todayStr}_${this.selectedSubject}`;
    localStorage.setItem(progressKey, JSON.stringify({
      currentIndex: this.currentIndex,
      solvedCount: this.solvedCount,
      correctCount: this.correctCount
    }));
  }

  updateProgress() {
    const total = this.questions.length;
    const current = Math.min(this.currentIndex, total);
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;

    const fillEl = document.getElementById("progress-bar-fill");
    if (fillEl) fillEl.style.width = `${pct}%`;

    const pctText = document.getElementById("progress-pct-text");
    if (pctText) pctText.innerText = `${current} / ${total} 문항 (${pct}%)`;
  }

  renderCompletionScreen() {
    const compEl = document.getElementById("completion-screen");
    const gridEl = document.getElementById("study-workspace-grid");

    this.triggerConfetti();

    const rate = this.solvedCount > 0 ? Math.round((this.correctCount / this.solvedCount) * 100) : 100;
    const wrongCnt = this.solvedCount - this.correctCount;
    const totalQ = this.questions.length;

    const compHtml = `
      <div class="completion-celebration-card">
        <div class="celebration-trophy">🏆</div>
        <h2 style="font-size: 1.85rem; font-weight: 800; margin-bottom: 8px;">
          오늘의 ${totalQ}문제 목표 달성!
        </h2>
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1.75rem;">
          ${this.config.name}아, 집중해서 ${totalQ}문제를 끝까지 완주했어! 정말 대단해 ✨
        </p>

        <div style="display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
          <div style="background: rgba(255, 255, 255, 0.06); padding: 16px 28px; border-radius: 18px; border: 1px solid var(--border-glass);">
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 4px;">푼 문제</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #fff;">${this.solvedCount}문제</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.06); padding: 16px 28px; border-radius: 18px; border: 1px solid var(--border-glass);">
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 4px;">정답률</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-emerald);">${rate}%</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.06); padding: 16px 28px; border-radius: 18px; border: 1px solid var(--border-glass);">
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 4px;">복습할 오답</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: ${wrongCnt > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)'};">
              ${wrongCnt}개
            </div>
          </div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; padding: 14px 20px; max-width: 520px; margin: 0 auto 2.5rem auto; font-size: 0.95rem; color: #a7f3d0;">
          📡 아빠의 관제 대시보드(Firebase)에 ${totalQ}문제 학습 결과가 실시간으로 전송되었습니다!
        </div>

        <!-- 핵심: 더 공부하기 액션 버튼 -->
        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
          <button type="button" class="btn-more-study" id="btn-study-more">
            <span>🔥</span> ${totalQ}문제 더 공부하기 (새로운 문제 + 오답 복습)
          </button>
          <button type="button" class="btn-student-next" style="background: rgba(255, 255, 255, 0.1); border: 1px solid var(--border-glass);" id="btn-restart-fresh">
            🔄 처음부터 다시 풀기
          </button>
        </div>
      </div>
    `;

    // 완수 시 진행률 키 정리
    const todayStr = this.getDateKey();
    localStorage.removeItem(`harumaster_prog_${this.config.id}_${todayStr}_${this.selectedSubject}`);

    if (compEl && gridEl) {
      gridEl.style.display = "none";
      compEl.style.display = "block";
      compEl.innerHTML = compHtml;
    } else {
      const main = document.getElementById("student-main-content");
      if (main) main.innerHTML = compHtml;
    }

    // 처음부터 다시 풀기 버튼 바인딩
    document.getElementById("btn-restart-fresh")?.addEventListener("click", () => {
      localStorage.removeItem(`harumaster_prog_${this.config.id}_${todayStr}_${this.selectedSubject}`);
      window.location.reload();
    });

    // 더 공부하기 버튼 이벤트 바인딩
    document.getElementById("btn-study-more")?.addEventListener("click", () => {
      if (compEl && gridEl) {
        compEl.style.display = "none";
        gridEl.style.display = "grid";
        if (this.clearCanvas) this.clearCanvas();
      }
      this.loadQuestions(true);
    });
  }

  renderEmptyState() {
    const compEl = document.getElementById("completion-screen");
    const gridEl = document.getElementById("study-workspace-grid");
    const emptyHtml = `
      <div class="completion-celebration-card" style="border-color: var(--border-glass);">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🌴</div>
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">
          선택한 과목의 문제를 준비 중입니다
        </h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
          '전체 과목' 또는 다른 과목을 선택해 보세요.
        </p>
        <button type="button" class="btn-student-next" onclick="window.studentApp.loadQuestions(false)">
          🔄 20문제 새로 생성하기
        </button>
      </div>
    `;
    if (compEl && gridEl) {
      gridEl.style.display = "none";
      compEl.style.display = "block";
      compEl.innerHTML = emptyHtml;
    } else {
      const main = document.getElementById("student-main-content");
      if (main) main.innerHTML = emptyHtml;
    }
  }

  renderMath(text) {
    if (!text) return "";
    const source = String(text);
    const escapeHtml = (value) => value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

    if (typeof window.katex === "undefined") {
      return escapeHtml(source);
    }

    const mathPattern = /\$([^$]+)\$/g;
    let output = "";
    let lastIndex = 0;
    let match;
    while ((match = mathPattern.exec(source)) !== null) {
      output += escapeHtml(source.slice(lastIndex, match.index));
      try {
        output += window.katex.renderToString(match[1], { throwOnError: false });
      } catch (e) {
        output += escapeHtml(match[0]);
      }
      lastIndex = mathPattern.lastIndex;
    }
    return output + escapeHtml(source.slice(lastIndex));
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  showToast(msg, type = "info") {
    const t = document.createElement("div");
    t.style.position = "fixed";
    t.style.bottom = "24px";
    t.style.left = "50%";
    t.style.transform = "translateX(-50%)";
    t.style.background = type === "success" ? "#10b981" : "#8b5cf6";
    t.style.color = "#fff";
    t.style.padding = "10px 22px";
    t.style.borderRadius = "999px";
    t.style.fontWeight = "700";
    t.style.fontSize = "0.95rem";
    t.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
    t.style.zIndex = "9999";
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transition = "opacity 0.3s";
      setTimeout(() => t.remove(), 300);
    }, 2800);
  }

  // --- [핵심] 좌우 2단 배치 S-Pen & 터치 풀이 연습장 엔진 ---
  initSPenScratchpad() {
    const canvas = document.getElementById("spen-canvas");
    const canvasWrap = document.getElementById("scratchpad-canvas-wrap");
    const gridEl = document.getElementById("study-workspace-grid");
    const toggleBtn = document.getElementById("btn-toggle-spen");
    const collapseBtn = document.getElementById("spen-collapse-btn");
    const clearBtn = document.getElementById("spen-clear-btn");
    const eraserBtn = document.getElementById("spen-eraser-btn");
    const gridBtn = document.getElementById("spen-grid-btn");
    const widthSelect = document.getElementById("spen-width-select");

    if (!canvas || !canvasWrap) return;

    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    let activePointerId = null;
    let currentColor = "#ffffff";
    let currentWidth = 4;
    let isEraserMode = false;

    // 캔버스 크기 자동 리사이징 및 버퍼 비율 맞춤
    const resizeCanvas = () => {
      const rect = canvasWrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      // 이전 그림 보존
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(canvas, 0, 0);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 그림 복원
      ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
    };

    setTimeout(resizeCanvas, 150);
    window.addEventListener("resize", resizeCanvas);

    // 전체 지우기 함수 등록
    this.clearCanvas = () => {
      const rect = canvasWrap.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width * (window.devicePixelRatio || 1), rect.height * (window.devicePixelRatio || 1));
    };

    clearBtn?.addEventListener("click", () => {
      this.clearCanvas();
      this.showToast("연습장을 깨끗이 지웠습니다 🧹", "info");
    });

    // 펜 색상 선택
    document.querySelectorAll(".color-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
        currentColor = dot.dataset.color || "#ffffff";
        isEraserMode = false;
        eraserBtn?.classList.remove("active");
        ctx.globalCompositeOperation = "source-over";
      });
    });

    // 지우개 모드 토글
    eraserBtn?.addEventListener("click", () => {
      isEraserMode = !isEraserMode;
      eraserBtn.classList.toggle("active", isEraserMode);
      if (isEraserMode) {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }
    });

    // 선 굵기 조절
    widthSelect?.addEventListener("change", (e) => {
      currentWidth = Number(e.target.value) || 4;
    });

    // 모눈격자 토글
    gridBtn?.addEventListener("click", () => {
      canvasWrap.classList.toggle("grid-active");
      gridBtn.classList.toggle("active");
    });

    // 화면 분할 접기/펼치기 토글 (우측 연습장 숨기기 / 펼치기)
    const toggleSplitView = () => {
      if (!gridEl) return;
      const isFull = gridEl.classList.toggle("full-question");
      if (toggleBtn) {
        toggleBtn.classList.toggle("active", !isFull);
        toggleBtn.innerHTML = isFull ? `<span>✏️</span> S펜 연습장 열기` : `<span>✏️</span> S펜 연습장`;
      }
      if (collapseBtn) {
        collapseBtn.innerText = isFull ? `◀▶ 연습장 열기` : `◀▶ 접기`;
      }
      setTimeout(resizeCanvas, 320);
    };

    toggleBtn?.addEventListener("click", toggleSplitView);
    collapseBtn?.addEventListener("click", toggleSplitView);

    // 포인터 위치 계산
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // S-Pen 및 터치 드로잉 이벤트 리스너
    canvas.addEventListener("pointerdown", (e) => {
      if (isDrawing || e.pointerType !== "pen") return;
      e.preventDefault();
      isDrawing = true;
      activePointerId = e.pointerId;
      canvas.setPointerCapture(e.pointerId);
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);

      // 필압 감지 지원 (S-Pen pressure)
      const pressureMultiplier = (e.pressure && e.pressure > 0) ? (e.pressure * 1.5) : 1;
      ctx.lineWidth = isEraserMode ? currentWidth * 4 : currentWidth * pressureMultiplier;
      ctx.strokeStyle = currentColor;
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!isDrawing || e.pointerId !== activePointerId) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    });

    const stopDrawing = (e) => {
      if (!isDrawing || (e && e.pointerId !== activePointerId)) return;
      ctx.closePath();
      if (e && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
      activePointerId = null;
      isDrawing = false;
    };

    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);
  }

  triggerConfetti() {
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

    // 문제 새로고침 버튼 (과목별 무한 추가 학습)
    const btnRefreshQ = document.getElementById("btn-refresh-questions");
    if (btnRefreshQ) {
      btnRefreshQ.addEventListener("click", () => {
        const subName = (this.selectedSubject === "ALL") ? "전체 과목" : this.selectedSubject;
        const icon = btnRefreshQ.querySelector(".refresh-icon");
        if (icon) {
          icon.style.transform = "rotate(360deg)";
        }

        // 오늘 진행 상태 초기화
        const todayStr = this.getDateKey();
        localStorage.removeItem(`harumaster_prog_${this.config.id}_${todayStr}_${this.selectedSubject}`);

        // isMoreStudy = true 로 신규 랜덤 문제 세트 로드
        this.loadQuestions(true);

        const countText = (this.selectedSubject === "ALL") ? (this.config.grade === 3 ? 25 : 22) : 10;
        this.showToast(`🔥 [${subName}] 새로운 ${countText}문제가 장전되었습니다! 화이팅 ✨`, "success");

        setTimeout(() => {
          if (icon) icon.style.transform = "";
        }, 500);
      });
    }
  }
}

// 부트스트랩
document.addEventListener("DOMContentLoaded", () => {
  window.studentApp = new StudentApp(window.STUDENT_CONFIG);
});
