import { FIREBASE_CONFIG } from './firebase-config.js';

let fbApp = null;
let firestoreDb = null;
let fbDoc, fbSetDoc, fbGetDoc, fbGetDocs, fbCollection, fbDeleteDoc, fbWriteBatch;

async function initCloudFirestore() {
  if (firestoreDb) return firestoreDb;
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    fbDoc = firestoreModule.doc;
    fbSetDoc = firestoreModule.setDoc;
    fbGetDoc = firestoreModule.getDoc;
    fbGetDocs = firestoreModule.getDocs;
    fbCollection = firestoreModule.collection;
    fbDeleteDoc = firestoreModule.deleteDoc;
    fbWriteBatch = firestoreModule.writeBatch;

    fbApp = initializeApp(FIREBASE_CONFIG);
    firestoreDb = firestoreModule.getFirestore(fbApp);
    return firestoreDb;
  } catch (err) {
    console.warn("Firebase CDN 로딩 실패 (로컬 모드로 실행):", err);
    return null;
  }
}

// 초기 시드 데이터 (중1/중3 교과 샘플 학습지)
const INITIAL_SEED_DATA = {
  questions: {
    "M1_KOR_001": {
      question_id: "M1_KOR_001",
      grade: 1,
      subject: "국어",
      passage: "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세. 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세. 가을 하늘 공활한데 높고 구름 없이 밝은 달은 우리 가슴 일편단심일세.",
      question_text: "위 글의 중심 정서로 가장 알맞은 것은?",
      options: ["나라를 사랑하는 마음", "자연의 무상함", "이별의 슬픔", "계절의 변화에 대한 아쉬움", "새로운 학업에 대한 기대"],
      correct_answer: 1,
      explanation: "조국에 대한 애정과 번영을 염원하는 애국심을 노래하고 있습니다."
    },
    "M1_MATH_001": {
      question_id: "M1_MATH_001",
      grade: 1,
      subject: "수학",
      question_text: "다음 일차방정식 $2x + 6 = 14$ 를 만족하는 $x$의 값을 구하시오.",
      options: ["$x = 2$", "$x = 3$", "$x = 4$", "$x = 5$", "$x = 6$"],
      correct_answer: 3,
      explanation: "$2x = 14 - 6 = 8$ 이므로 $x = 4$ 입니다."
    },
    "M1_ENG_001": {
      question_id: "M1_ENG_001",
      grade: 1,
      subject: "영어",
      passage: "Tom is a middle school student. He loves playing soccer with his friends after school. Yesterday, he scored two goals in the final match.",
      question_text: "What did Tom do yesterday?",
      options: [
        "He bought a new soccer ball.",
        "He scored two goals in the match.",
        "He watched a movie with his family.",
        "He studied English at the library.",
        "He stayed home because of the rain."
      ],
      correct_answer: 2,
      explanation: "본문의 'Yesterday, he scored two goals in the final match.'에서 정답을 찾을 수 있습니다."
    },
    "M3_MATH_001": {
      question_id: "M3_MATH_001",
      grade: 3,
      subject: "수학",
      question_text: "이차방정식 $x^2 - 5x + 6 = 0$ 의 두 근 $\\alpha, \\beta$에 대하여 $\\alpha + \\beta$의 값은?",
      options: ["$-6$", "$-5$", "$1$", "$5$", "$6$"],
      correct_answer: 4,
      explanation: "근과 계수의 관계에 의해 $\\alpha + \\beta = -(-5)/1 = 5$ 입니다."
    },
    "M3_SCI_001": {
      question_id: "M3_SCI_001",
      grade: 3,
      subject: "과학",
      question_text: "멘델의 유전 원리 중 잡종 1대에서 우성 형질만 나타나는 원리는?",
      options: ["우열의 원리", "분리의 법칙", "독립의 법칙", "연관의 법칙", "중간유전"],
      correct_answer: 1,
      explanation: "대립 형질을 가진 순종 개체끼리 교배했을 때 잡종 1대에서 우성만 발현되는 것은 우열의 원리입니다."
    },
    "M3_HIST_001": {
      question_id: "M3_HIST_001",
      grade: 3,
      subject: "역사",
      question_text: "1919년 일제의 무단통치에 맞서 일어난 거족적인 민족 독립운동은?",
      options: ["3·1 운동", "6·10 만세운동", "광주학생항일운동", "동학농민운동", "갑신정변"],
      correct_answer: 1,
      explanation: "1919년 3월 1일 일어난 3·1 운동은 일제 식민통치 방식을 문화통치로 바꾸는 계기가 되었습니다."
    },
    "M3_MATH_002": {
      question_id: "M3_MATH_002",
      grade: 3,
      subject: "수학",
      question_text: "직각삼각형에서 빗변의 길이가 $c$이고 나머지 두 변이 각각 $a, b$일 때 피타고라스 정리 성립 식은?",
      options: [
        "$a + b = c$",
        "$a^2 + b^2 = c^2$",
        "$\\sqrt{a} + \\sqrt{b} = \\sqrt{c}$",
        "$a^2 - b^2 = c^2$",
        "$a \\times b = c^2$"
      ],
      correct_answer: 2,
      explanation: "직각삼각형의 빗변 제곱은 다른 두 변의 제곱의 합과 같습니다 ($a^2 + b^2 = c^2$)."
    }
  },
  assignments: {
    "20261013_G1": {
      assignment_id: "20261013_G1",
      assignment_date: "20261013",
      target_grade: 1,
      question_ids: ["M1_KOR_001", "M1_MATH_001", "M1_ENG_001"],
      total_questions: 3
    },
    "20261013_G3": {
      assignment_id: "20261013_G3",
      assignment_date: "20261013",
      target_grade: 3,
      question_ids: ["M3_MATH_001", "M3_SCI_001"],
      total_questions: 2
    },
    "20261014_G3": {
      assignment_id: "20261014_G3",
      assignment_date: "20261014",
      target_grade: 3,
      question_ids: ["M3_HIST_001", "M3_MATH_002"],
      total_questions: 2
    }
  },
  reviews: {
    "chahye": {
      "M1_MATH_001": {
        question_id: "M1_MATH_001",
        interval: 3,
        wrongCount: 0,
        next_review_date: "20261016",
        last_is_correct: true,
        last_solved_at: "2026-10-13T10:00:00"
      }
    },
    "nakyung": {
      "M3_MATH_001": {
        question_id: "M3_MATH_001",
        interval: 1,
        wrongCount: 2,
        next_review_date: "20261013",
        last_is_correct: false,
        last_solved_at: "2026-10-12T15:30:00"
      },
      "M3_SCI_001": {
        question_id: "M3_SCI_001",
        interval: 7,
        wrongCount: 0,
        next_review_date: "20261020",
        last_is_correct: true,
        last_solved_at: "2026-10-13T16:00:00"
      }
    },
    "CHILD_G1": {
      "M1_MATH_001": {
        question_id: "M1_MATH_001",
        interval: 3,
        wrongCount: 0,
        next_review_date: "20261016",
        last_is_correct: true,
        last_solved_at: "2026-10-13T10:00:00"
      }
    },
    "CHILD_G3": {
      "M3_MATH_001": {
        question_id: "M3_MATH_001",
        interval: 1,
        wrongCount: 2,
        next_review_date: "20261013",
        last_is_correct: false,
        last_solved_at: "2026-10-12T15:30:00"
      },
      "M3_SCI_001": {
        question_id: "M3_SCI_001",
        interval: 7,
        wrongCount: 0,
        next_review_date: "20261020",
        last_is_correct: true,
        last_solved_at: "2026-10-13T16:00:00"
      }
    }
  }
};

export class HaruMasterDB {
  constructor() {
    this.storageKey = "harumaster_db_v1";
    this.configKey = "harumaster_firebase_config";
    this.isLiveFirebase = false;
    this.db = null;
    this.loadLocalData();
    this.initFirebase();
  }

  async initFirebase() {
    this.db = await initCloudFirestore();
    if (this.db) {
      this.isLiveFirebase = true;
      this.updateStatusPill(true);
      await this.syncWithRemoteFirestore();
    } else {
      this.isLiveFirebase = false;
      this.updateStatusPill(false);
    }
  }

  updateStatusPill(isLive) {
    const pill = document.getElementById("db-status-pill");
    const text = document.getElementById("db-status-text");
    if (!pill || !text) return;
    if (isLive) {
      pill.classList.remove("mock");
      pill.title = "Firebase Cloud Firestore에 실시간 연결됨 (haru-master)";
      text.innerText = "🔥 Cloud Firestore 연결됨";
    } else {
      pill.classList.add("mock");
      pill.title = "로컬 Mock Firestore 모드";
      text.innerText = "인메모리 Mock DB";
    }
  }

  async syncWithRemoteFirestore() {
    if (!this.db || !fbGetDocs || !fbCollection) return;
    try {
      // 1. 원격에서 기존 문항 읽어오기
      const qSnap = await fbGetDocs(fbCollection(this.db, "Questions"));
      let remoteQCount = 0;
      qSnap.forEach(docSnap => {
        this.data.questions[docSnap.id] = docSnap.data();
        remoteQCount++;
      });

      // 2. 원격에서 기존 과제 읽어오기
      const aSnap = await fbGetDocs(fbCollection(this.db, "Assignments"));
      aSnap.forEach(docSnap => {
        this.data.assignments[docSnap.id] = docSnap.data();
      });

      if (remoteQCount === 0) {
        // 원격 DB가 방금 생성되어 비어있으면 로컬 초기 시드 데이터를 원격 DB로 업로드(시딩)!
        await this.seedRemoteFirestore();
      } else {
        this.saveLocalData();
      }
    } catch (e) {
      console.warn("원격 Firestore 동기화 오류 (로컬 데이터 유지):", e);
    }
  }

  async seedRemoteFirestore() {
    if (!this.db || !fbSetDoc || !fbDoc) return;
    try {
      for (const [qid, q] of Object.entries(this.data.questions)) {
        await fbSetDoc(fbDoc(this.db, "Questions", qid), q, { merge: true });
      }
      for (const [aid, a] of Object.entries(this.data.assignments)) {
        await fbSetDoc(fbDoc(this.db, "Assignments", aid), a, { merge: true });
      }
      console.log("🔥 [Cloud Firestore] 초기 교과 문제 및 일일 과제 클라우드 시딩 완료!");
    } catch (e) {
      console.warn("원격 시딩 오류:", e);
    }
  }

  loadLocalData() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        this.data = JSON.parse(raw);
      } catch (e) {
        this.data = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
      }
    } else {
      this.data = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
      this.saveLocalData();
    }
  }

  saveLocalData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    this.saveLocalData();
  }

  // --- 문항 CRUD ---
  async getQuestion(id) {
    return this.data.questions[id] || null;
  }

  async getAllQuestions() {
    return Object.values(this.data.questions);
  }

  async saveQuestion(q) {
    if (!q.question_id) {
      q.question_id = `Q_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
    const cleanQ = { ...q, updated_at: new Date().toISOString() };
    this.data.questions[q.question_id] = cleanQ;
    this.saveLocalData();

    // Cloud Firestore 실시간 저장
    if (this.db && fbSetDoc && fbDoc) {
      try {
        await fbSetDoc(fbDoc(this.db, "Questions", q.question_id), cleanQ, { merge: true });
        console.log(`[Firestore] 문항 클라우드 저장 완료: ${q.question_id}`);
      } catch (err) {
        console.warn("[Firestore] 원격 저장 실패 (로컬 보존됨):", err);
      }
    }

    return cleanQ;
  }

  async deleteQuestion(id) {
    delete this.data.questions[id];
    // 과제 목록에서도 제거
    Object.values(this.data.assignments).forEach(a => {
      a.question_ids = a.question_ids.filter(qid => qid !== id);
      a.total_questions = a.question_ids.length;
    });
    this.saveLocalData();

    if (this.db && fbDeleteDoc && fbDoc) {
      try {
        await fbDeleteDoc(fbDoc(this.db, "Questions", id));
      } catch (e) {}
    }
  }

  // --- 과제 CRUD ---
  async getAllAssignments() {
    return Object.values(this.data.assignments);
  }

  async getAssignmentWithQuestions(assignmentId) {
    const assign = this.data.assignments[assignmentId];
    if (!assign) return null;
    const questions = assign.question_ids.map(qid => this.data.questions[qid]).filter(Boolean);
    return { ...assign, questions };
  }

  async saveAssignment(date, grade, questionIds) {
    const id = `${date}_G${grade}`;
    const assignDoc = {
      assignment_id: id,
      assignment_date: date,
      target_grade: Number(grade),
      question_ids: questionIds,
      total_questions: questionIds.length,
      created_at: new Date().toISOString()
    };
    this.data.assignments[id] = assignDoc;
    this.saveLocalData();

    // Cloud Firestore 실시간 저장
    if (this.db && fbSetDoc && fbDoc) {
      try {
        await fbSetDoc(fbDoc(this.db, "Assignments", id), assignDoc, { merge: true });
        console.log(`[Firestore] 과제 클라우드 저장 완료: ${id}`);
      } catch (err) {
        console.warn("[Firestore] 원격 저장 실패 (로컬 보존됨):", err);
      }
    }

    return assignDoc;
  }

  // --- SRS 복습 & 학생 통계 ---
  async getStudentReviews(studentId) {
    if (this.db && fbGetDocs && fbCollection) {
      try {
        const reviewSnap = await fbGetDocs(fbCollection(this.db, "Users", studentId, "Reviews"));
        if (!this.data.reviews[studentId]) this.data.reviews[studentId] = {};
        reviewSnap.forEach(docSnap => {
          this.data.reviews[studentId][docSnap.id] = docSnap.data();
        });
        this.saveLocalData();
      } catch (error) {
        console.warn("원격 SRS 복습 데이터 조회 실패 (로컬 데이터 사용):", error);
      }
    }

    const studentReviews = this.data.reviews[studentId] || {};
    const result = [];
    for (const [qid, srsInfo] of Object.entries(studentReviews)) {
      const qData = this.data.questions[qid] || { question_text: "(삭제된 문항)" };
      result.push({
        ...srsInfo,
        question: qData
      });
    }
    return result;
  }

  /**
   * 답안 제출 및 SRS 에빙하우스 주기 갱신
   * 0 -> 1 -> 3 -> 7 -> 14 (정답 시)
   * 오답 시: 1일 리셋, wrongCount + 1
   */
  async submitAnswer(studentId, questionId, selectedAnswer, baseDate = new Date()) {
    const q = this.data.questions[questionId];
    if (!q) throw new Error("문항을 찾을 수 없습니다.");

    const isCorrect = (Number(selectedAnswer) === Number(q.correct_answer));
    if (!this.data.reviews[studentId]) {
      this.data.reviews[studentId] = {};
    }

    const currentSrs = this.data.reviews[studentId][questionId] || { interval: 0, wrongCount: 0 };
    let nextInterval = 1;
    let nextWrongCount = currentSrs.wrongCount;

    if (isCorrect) {
      if (currentSrs.interval <= 0) nextInterval = 1;
      else if (currentSrs.interval < 3) nextInterval = 3;
      else if (currentSrs.interval < 7) nextInterval = 7;
      else nextInterval = 14;
    } else {
      nextInterval = 1;
      nextWrongCount += 1;
    }

    const nextDateObj = new Date(baseDate);
    nextDateObj.setDate(nextDateObj.getDate() + nextInterval);
    const nextDateStr = nextDateObj.toISOString().slice(0, 10).replace(/-/g, "");

    const updatePayload = {
      question_id: questionId,
      interval: nextInterval,
      wrongCount: nextWrongCount,
      last_is_correct: isCorrect,
      last_solved_at: baseDate.toISOString(),
      next_review_date: nextDateStr
    };

    this.data.reviews[studentId][questionId] = updatePayload;
    this.saveLocalData();

    // Cloud Firestore 실시간 저장
    if (this.db && fbSetDoc && fbDoc) {
      try {
        await fbSetDoc(fbDoc(this.db, "Users", studentId, "Reviews", questionId), updatePayload, { merge: true });
        console.log(`[Firestore] SRS 복습 기록 클라우드 저장 완료: ${questionId}`);
      } catch (err) {
        console.warn("[Firestore] 원격 SRS 저장 실패:", err);
      }
    }

    return {
      isCorrect,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      srs: updatePayload
    };
  }

  async getStudentStats(studentId) {
    const reviews = Object.values(this.data.reviews[studentId] || {});
    const total = reviews.length;
    let wrongCountSum = 0;
    let masteredCount = 0;
    let stage1 = 0, stage3 = 0, stage7 = 0, stage14 = 0;

    reviews.forEach(r => {
      wrongCountSum += (r.wrongCount || 0);
      if (r.interval === 1) stage1++;
      else if (r.interval === 3) stage3++;
      else if (r.interval === 7) stage7++;
      else if (r.interval >= 14) { stage14++; masteredCount++; }
    });

    return {
      totalQuestions: total,
      totalWrongs: wrongCountSum,
      masteredCount,
      masteryRate: total > 0 ? Math.round((masteredCount / total) * 100) : 0,
      stages: { stage1, stage3, stage7, stage14 }
    };
  }

  // --- JSON 가져오기/내보내기 ---
  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  async importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      let count = 0;

      if (Array.isArray(parsed)) {
        // [ { question_id, grade, subject, ... }, ... ] 형태
        parsed.forEach(q => {
          if (q.question_id) {
            this.data.questions[q.question_id] = q;
            count++;
          }
        });
      } else if (parsed.assignments && Array.isArray(parsed.assignments)) {
        // sample_assignments.json 원본 스키마 호환 파싱
        parsed.assignments.forEach(assignItem => {
          const date = assignItem.assignment_date;
          const grade = assignItem.target_grade;
          const qids = [];
          if (assignItem.questions && Array.isArray(assignItem.questions)) {
            assignItem.questions.forEach(q => {
              this.data.questions[q.question_id] = q;
              qids.push(q.question_id);
              count++;
            });
          }
          const assignId = `${date}_G${grade}`;
          this.data.assignments[assignId] = {
            assignment_id: assignId,
            assignment_date: date,
            target_grade: grade,
            question_ids: qids,
            total_questions: qids.length
          };
        });
      } else if (parsed.questions) {
        if (Array.isArray(parsed.questions)) {
          parsed.questions.forEach(q => {
            if (q.question_id) {
              this.data.questions[q.question_id] = q;
              count++;
            }
          });
        } else {
          Object.entries(parsed.questions).forEach(([qid, q]) => {
            this.data.questions[qid] = q;
            count++;
          });
        }
        if (parsed.assignments) this.data.assignments = parsed.assignments;
      }

      this.saveLocalData();

      // Cloud Firestore에 즉시 일괄 비동기 반영
      if (this.db && fbSetDoc && fbDoc) {
        this.syncQuestionsToRemoteFirestore();
      }

      return count;
    } catch (e) {
      console.error("JSON 가져오기 오류:", e);
      return false;
    }
  }

  async syncQuestionsToRemoteFirestore(onProgress = null) {
    if (!this.db || !fbDoc) return;
    try {
      const qEntries = Object.entries(this.data.questions);
      const total = qEntries.length;
      console.log(`🔥 [Cloud Firestore] ${total}개 문항 고속 배치 동기화 시작...`);

      const BATCH_SIZE = 300; // Firestore 500개 한도 대비 안전한 300단위 분할
      let completed = 0;

      for (let i = 0; i < total; i += BATCH_SIZE) {
        const chunk = qEntries.slice(i, i + BATCH_SIZE);
        if (fbWriteBatch) {
          const batch = fbWriteBatch(this.db);
          for (const [qid, q] of chunk) {
            batch.set(fbDoc(this.db, "Questions", qid), q, { merge: true });
          }
          await batch.commit();
        } else if (fbSetDoc) {
          await Promise.all(chunk.map(([qid, q]) => fbSetDoc(fbDoc(this.db, "Questions", qid), q, { merge: true })));
        }
        completed += chunk.length;
        if (onProgress) onProgress(completed, total);
        console.log(`[Firestore 동기화 진행] ${completed} / ${total}`);
      }
      console.log(`✅ [Cloud Firestore] ${total}개 문항 초고속 클라우드 동기화 완료!`);
    } catch (err) {
      console.warn("원격 Firestore 동기화 중 오류 (로컬 보존됨):", err);
    }
  }

  /**
   * 9월 3일 개학 진도 반영 860문항 (나경 480 / 차혜 380) 원클릭 로드 및 고속 동기화
   */
  async loadCurriculum860(onProgress = null) {
    try {
      const res = await fetch("study_data/all_curriculum_questions_860.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = await res.json();
      const count = await this.importJSON(JSON.stringify(list));
      if (count && this.db) {
        await this.syncQuestionsToRemoteFirestore(onProgress);
      }
      return count;
    } catch (err) {
      console.error("860문항 로드 실패:", err);
      return false;
    }
  }
}

export const dbService = new HaruMasterDB();
