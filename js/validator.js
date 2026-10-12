/**
 * 하루마스터 (HaruMaster) - Zero-Error 문항 검증 엔진
 * 과목별 특성(수학 LaTeX 수식, 국어/영어 지문, 사회/역사/과학 보기 일치)에 따른 오류 사전 차단
 */

export const ALLOWED_SUBJECTS = ["수학", "국어", "영어", "과학", "사회", "역사"];
export const ALLOWED_GRADES = [1, 3];

export class QuestionValidator {
  /**
   * 단일 문항 객체에 대한 포괄적 유효성 검사 수행
   * @param {Object} q 문항 데이터 객체
   * @returns {Object} 검증 결과 (isValid, status, errors, warnings, passes)
   */
  static validate(q) {
    const errors = [];
    const warnings = [];
    const passes = [];

    // 1. 과목 검증
    if (!q.subject || !ALLOWED_SUBJECTS.includes(q.subject)) {
      errors.push({ field: "subject", message: `유효하지 않은 과목입니다. [${ALLOWED_SUBJECTS.join(", ")}] 중 하나여야 합니다.` });
    } else {
      passes.push({ field: "subject", message: `과목 지정 완료: ${q.subject}` });
    }

    // 2. 학년 검증
    const grade = Number(q.grade);
    if (!ALLOWED_GRADES.includes(grade)) {
      errors.push({ field: "grade", message: "학년은 중1(1) 또는 중3(3)만 지정 가능합니다." });
    } else {
      passes.push({ field: "grade", message: `학년 지정 완료: 중${grade}` });
    }

    // 3. 문제 본문 검증
    if (!q.question_text || q.question_text.trim().length < 3) {
      errors.push({ field: "question_text", message: "문제 본문이 너무 짧거나 비어 있습니다." });
    } else {
      passes.push({ field: "question_text", message: "문제 본문 입력 완료" });
    }

    // 4. 수학 LaTeX 수식 정밀 검사
    const latexCheck = this.checkLatexSyntax(q.question_text, q.options);
    if (!latexCheck.isValid) {
      errors.push({ field: "latex", message: latexCheck.message });
    } else if (latexCheck.hasLatex) {
      passes.push({ field: "latex", message: `수학 LaTeX 수식 문법 정상 (${latexCheck.count}개 수식 감지)` });
    }

    // 5. 보기(Options) 유효성 검사
    if (!Array.isArray(q.options) || q.options.length < 2) {
      errors.push({ field: "options", message: "보기가 최소 4개(권장 5개) 이상 등록되어야 합니다." });
    } else {
      if (q.options.length < 4) {
        warnings.push({ field: "options", message: `보기가 ${q.options.length}개입니다. 중학교 평가는 보통 4~5지선다입니다.` });
      }

      // 빈 보기 검사
      const emptyIdx = q.options.findIndex(opt => !opt || String(opt).trim().length === 0);
      if (emptyIdx !== -1) {
        errors.push({ field: "options", message: `보기 ${emptyIdx + 1}번 항목이 비어 있습니다.` });
      }

      // 중복 보기 검사
      const trimmedOpts = q.options.map(o => String(o).trim());
      const dupes = trimmedOpts.filter((item, idx) => item && trimmedOpts.indexOf(item) !== idx);
      if (dupes.length > 0) {
        warnings.push({ field: "options", message: `동일한 내용의 보기가 중복되어 있습니다: "${dupes[0]}"` });
      } else if (emptyIdx === -1) {
        passes.push({ field: "options", message: `보기 ${q.options.length}개 구성 정상` });
      }
    }

    // 6. 정답 번호(correct_answer) 범위 일치성 검증
    const ansNum = Number(q.correct_answer);
    if (!ansNum || isNaN(ansNum) || ansNum < 1) {
      errors.push({ field: "correct_answer", message: "정답 번호를 선택해야 합니다 (1번부터 시작)." });
    } else if (Array.isArray(q.options) && ansNum > q.options.length) {
      errors.push({ 
        field: "correct_answer", 
        message: `정답 번호(${ansNum}번)가 보기 개수(${q.options.length}개)를 초과했습니다!` 
      });
    } else {
      passes.push({ field: "correct_answer", message: `정답 번호 정상: ${ansNum}번` });
    }

    // 7. 해설(Explanation) 누락 검사
    if (!q.explanation || q.explanation.trim().length === 0) {
      warnings.push({ field: "explanation", message: "아이들의 오답 복습을 위해 친절한 해설을 적어주는 것을 권장합니다." });
    } else {
      passes.push({ field: "explanation", message: "정답 해설 포함됨" });
    }

    // 8. 국어/영어 긴 지문(Passage) 검사
    if ((q.subject === "국어" || q.subject === "영어") && (!q.passage || q.passage.trim().length === 0)) {
      warnings.push({ field: "passage", message: "국어/영어 과목은 지문(Passage)이 필요한 문항인지 확인해 주세요." });
    }

    // 9. 도형 및 과학 실험 다이어그램(image_url) 검사
    if (q.image_url && String(q.image_url).trim().length > 0) {
      passes.push({ field: "image_url", message: "도형/과학 실험 다이어그램 첨부 확인 완료 🖼️" });
    }

    const isValid = errors.length === 0;
    const status = errors.length > 0 ? "error" : (warnings.length > 0 ? "warn" : "pass");

    return {
      isValid,
      status,
      errors,
      warnings,
      passes
    };
  }

  /**
   * LaTeX 수식($...$) 문법 및 괄호 짝 검사
   */
  static checkLatexSyntax(questionText, options = []) {
    const combinedTexts = [questionText, ...options].filter(Boolean);
    let totalLatexBlocks = 0;

    for (const text of combinedTexts) {
      // 1. $ 기호 짝 검사
      const dollarMatches = text.match(/\$/g);
      if (dollarMatches) {
        if (dollarMatches.length % 2 !== 0) {
          return {
            isValid: false,
            hasLatex: true,
            message: "수학 수식 기호 '$'의 열림/닫힘 짝이 맞지 않습니다. (홀수 개 발견)"
          };
        }
        totalLatexBlocks += dollarMatches.length / 2;
      }

      // 2. 수식 내부 중괄호 { } 짝 검사
      const regex = /\$([^$]+)\$/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        const mathContent = match[1];
        let openBrackets = 0;
        for (const char of mathContent) {
          if (char === '{') openBrackets++;
          if (char === '}') openBrackets--;
          if (openBrackets < 0) {
            return {
              isValid: false,
              hasLatex: true,
              message: "LaTeX 수식 내부에 닫는 중괄호 '}'가 여는 괄호보다 먼저 나왔습니다."
            };
          }
        }
        if (openBrackets !== 0) {
          return {
            isValid: false,
            hasLatex: true,
            message: "LaTeX 수식 내부의 중괄호 '{ }'가 닫히지 않았습니다."
          };
        }
      }
    }

    return {
      isValid: true,
      hasLatex: totalLatexBlocks > 0,
      count: totalLatexBlocks
    };
  }
}
