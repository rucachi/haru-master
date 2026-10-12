/**
 * 하루마스터 (HaruMaster) - 스마트 텍스트 자동 파서
 * 문제집, 한글 문서, 웹사이트에서 복사한 원문 텍스트를 구조화된 문항 객체로 자동 변환
 */

export class SmartTextParser {
  /**
   * 원문 텍스트를 파싱하여 문항 객체 반환
   * @param {string} rawText 
   * @returns {Object} { subject, grade, passage, question_text, options, correct_answer, explanation }
   */
  static parse(rawText) {
    if (!rawText || !rawText.trim()) {
      return null;
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const result = {
      subject: "수학",
      grade: 3,
      passage: "",
      question_text: "",
      options: [],
      correct_answer: 1,
      explanation: ""
    };

    let currentSection = "question";
    const passageLines = [];
    const questionLines = [];
    const explanationLines = [];

    // 원형 기호 매핑: ① -> 1, ② -> 2, etc.
    const circleNumMap = { '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5 };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 1. 과목 메타데이터 감지
      if (line.match(/^\[?(과목|subject)\]?\s*[:：]?\s*(.+)/i)) {
        const sub = line.match(/^\[?(과목|subject)\]?\s*[:：]?\s*(.+)/i)[2].trim();
        if (["국어", "영어", "수학", "사회", "역사", "과학"].includes(sub)) {
          result.subject = sub;
        }
        continue;
      }

      // 2. 학년 메타데이터 감지
      if (line.match(/^\[?(학년|grade)\]?\s*[:：]?\s*(중?[13]|1학년|3학년)/i)) {
        const gMatch = line.match(/[13]/);
        if (gMatch) result.grade = Number(gMatch[0]);
        continue;
      }

      // 3. 지문 섹션 시작 감지
      if (line.match(/^\[?(지문|본문|passage|다음\s*글을\s*읽고)\]?\s*[:：]?/i)) {
        currentSection = "passage";
        const content = line.replace(/^\[?(지문|본문|passage|다음\s*글을\s*읽고)\]?\s*[:：]?/i, '').trim();
        if (content) passageLines.push(content);
        continue;
      }

      // 4. 정답 메타데이터 감지
      if (line.match(/^\[?(정답|답|answer)\]?\s*[:：]?\s*([1-5①-⑤])/i)) {
        const ansMatch = line.match(/^\[?(정답|답|answer)\]?\s*[:：]?\s*([1-5①-⑤])/i)[2];
        result.correct_answer = circleNumMap[ansMatch] || Number(ansMatch);
        continue;
      }

      // 5. 해설 메타데이터 감지
      if (line.match(/^\[?(해설|풀이|explanation)\]?\s*[:：]?/i)) {
        currentSection = "explanation";
        const content = line.replace(/^\[?(해설|풀이|explanation)\]?\s*[:：]?/i, '').trim();
        if (content) explanationLines.push(content);
        continue;
      }

      // 6. 문제 섹션 시작 명시적 태그
      if (line.match(/^\[?(문제|question)\]?\s*[:：]?/i)) {
        currentSection = "question";
        const content = line.replace(/^\[?(문제|question)\]?\s*[:：]?/i, '').trim();
        if (content) questionLines.push(content);
        continue;
      }

      // 7. 보기 라인(①~⑤ 또는 1.~5.) 분리 감지
      // 한 줄에 여러 보기가 나열된 경우: ① 사과 ② 배 ③ 감
      if (line.match(/[①-⑤]/)) {
        // 원형 기호로 나누기
        const parts = line.split(/([①-⑤])/).filter(Boolean);
        for (let p = 0; p < parts.length; p++) {
          if (circleNumMap[parts[p]]) {
            const optText = (parts[p + 1] || "").trim();
            if (optText) {
              result.options.push(optText);
              p++;
            }
          }
        }
        continue;
      }

      // 단일 줄 보기 형식 (1. 보기 / 1) 보기)
      const singleOptMatch = line.match(/^([1-5])[\.\)\s]\s*(.+)/);
      if (singleOptMatch) {
        result.options.push(singleOptMatch[2].trim());
        continue;
      }

      // 섹션별 텍스트 축적
      if (currentSection === "passage") {
        passageLines.push(line);
      } else if (currentSection === "explanation") {
        explanationLines.push(line);
      } else {
        questionLines.push(line);
      }
    }

    result.passage = passageLines.join('\n');
    result.question_text = questionLines.join('\n');
    result.explanation = explanationLines.join('\n');

    // 보기가 비어있는 경우 기본 5개 템플릿 확보
    if (result.options.length === 0) {
      result.options = ["보기 1", "보기 2", "보기 3", "보기 4", "보기 5"];
    }

    return result;
  }
}
