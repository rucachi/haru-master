# -*- coding: utf-8 -*-
"""
하루마스터 국어/영어 독해 50문항 세트 (총 200문항) 누적 병합기
- 1지문당 2~3문항 연결 복합 독해 지문 구조 (Passage-linked multi-item sets)
- 나경이 (중3): 국어 50문항 (20지문) + 영어 50문항 (20지문) = 100문항 (480 -> 580)
- 차혜 (중1): 국어 50문항 (20지문) + 영어 50문항 (20지문) = 100문항 (380 -> 480)
- 전체 누적 데이터셋 병합 (860 -> 1060문항)
"""

import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(ROOT_DIR, "study_data")

NAKYUNG_FILE = os.path.join(DATA_DIR, "nakyeong", "nakyung_questions_480.json")
CHAHYE_FILE = os.path.join(DATA_DIR, "chahye", "chahye_questions_380.json")
ALL_FILE = os.path.join(DATA_DIR, "all_curriculum_questions_860.json")

# 모듈 로드
from data_nakyung_kor import get_nakyung_kor_questions
from data_nakyung_eng import get_nakyung_eng_questions
from data_chahye_kor import get_chahye_kor_questions
from data_chahye_eng import get_chahye_eng_questions

def audit_question(q, label=""):
    assert "question_id" in q and q["question_id"], f"[{label}] Missing question_id"
    assert q.get("grade") in (1, 3), f"[{label}] Invalid grade: {q.get('grade')}"
    assert q.get("subject") in ("국어", "영어"), f"[{label}] Invalid subject: {q.get('subject')}"
    assert "passage" in q and len(q["passage"].strip()) >= 80, f"[{label}] Passage too short (<80): {len(q.get('passage',''))}"
    assert "question_text" in q and len(q["question_text"].strip()) >= 5, f"[{label}] Question text too short"
    assert "options" in q and len(q["options"]) == 5, f"[{label}] Must have exactly 5 options, got {len(q.get('options', []))}"
    assert len(set(q["options"])) == 5, f"[{label}] Duplicate options found: {q['options']}"
    assert 1 <= q.get("correct_answer", 0) <= 5, f"[{label}] correct_answer out of 1~5 range"
    assert "explanation" in q and len(q["explanation"].strip()) >= 10, f"[{label}] Explanation too short"

def main():
    print("=" * 70)
    print("📘 하루마스터 국어/영어 독해 50문항 세트 (총 200문항) 검증 및 빌드 시작")
    print("=" * 70)

    # 1. 문항 생성
    n_kor = get_nakyung_kor_questions()
    n_eng = get_nakyung_eng_questions()
    c_kor = get_chahye_kor_questions()
    c_eng = get_chahye_eng_questions()

    print(f"1. 생성 수량 확인:")
    print(f"   - 나경이 국어 독해: {len(n_kor)}문항 (목표 50)")
    print(f"   - 나경이 영어 독해: {len(n_eng)}문항 (목표 50)")
    print(f"   - 차혜 국어 독해:   {len(c_kor)}문항 (목표 50)")
    print(f"   - 차혜 영어 독해:   {len(c_eng)}문항 (목표 50)")

    assert len(n_kor) == 50, "Nakyung Kor != 50"
    assert len(n_eng) == 50, "Nakyung Eng != 50"
    assert len(c_kor) == 50, "Chahye Kor != 50"
    assert len(c_eng) == 50, "Chahye Eng != 50"

    all_new = n_kor + n_eng + c_kor + c_eng
    assert len(all_new) == 200, "Total new questions != 200"

    # 2. 전수 무결성 감사 (Audit)
    print("\n2. 200문항 전수 무결성(5지선다, 중복선지 없음, 정답 유효성, 지문길이) 감사:")
    for idx, q in enumerate(all_new):
        audit_question(q, f"Q#{idx+1}-{q['question_id']}")
    print("   [PASS] 200문항 전수 무결성 감사 통과 (오류 0건)!")

    # 3. 기존 파일 로드
    print("\n3. 기존 데이터 파일 로드:")
    with open(NAKYUNG_FILE, "r", encoding="utf-8") as f:
        nakyung_existing = json.load(f)
    print(f"   - 나경이 기존 문항 수: {len(nakyung_existing)}문항")

    with open(CHAHYE_FILE, "r", encoding="utf-8") as f:
        chahye_existing = json.load(f)
    print(f"   - 차혜 기존 문항 수:   {len(chahye_existing)}문항")

    with open(ALL_FILE, "r", encoding="utf-8") as f:
        all_existing = json.load(f)
    print(f"   - 전체 기존 문항 수:   {len(all_existing)}문항")

    # 4. ID 충돌 여부 검사
    existing_nak_ids = {q["question_id"] for q in nakyung_existing}
    existing_cha_ids = {q["question_id"] for q in chahye_existing}

    # 중복 제거 병합 로직 (이미 추가되어 있다면 교체, 없으면 추가)
    def merge_datasets(existing_list, new_items):
        item_map = {q["question_id"]: q for q in existing_list}
        for item in new_items:
            item_map[item["question_id"]] = item
        # 기존 순서 유지 후 신규 문항 추가
        merged = []
        seen = set()
        for q in existing_list:
            qid = q["question_id"]
            if qid in item_map:
                merged.append(item_map[qid])
                seen.add(qid)
        for item in new_items:
            qid = item["question_id"]
            if qid not in seen:
                merged.append(item)
                seen.add(qid)
        return merged

    nakyung_updated = merge_datasets(nakyung_existing, n_kor + n_eng)
    chahye_updated = merge_datasets(chahye_existing, c_kor + c_eng)
    all_updated = merge_datasets(all_existing, all_new)

    print("\n4. 병합 후 문항 수:")
    print(f"   - 나경이 데이터셋: {len(nakyung_existing)} -> {len(nakyung_updated)}문항 (+{len(nakyung_updated)-len(nakyung_existing)})")
    print(f"   - 차혜 데이터셋:   {len(chahye_existing)} -> {len(chahye_updated)}문항 (+{len(chahye_updated)-len(chahye_existing)})")
    print(f"   - 전체 데이터셋:   {len(all_existing)} -> {len(all_updated)}문항 (+{len(all_updated)-len(all_existing)})")

    # 5. 파일 저장
    print("\n5. 파일 저장 중...")
    with open(NAKYUNG_FILE, "w", encoding="utf-8") as f:
        json.dump(nakyung_updated, f, ensure_ascii=False, indent=2)
    print(f"   [Saved] {NAKYUNG_FILE}")

    with open(CHAHYE_FILE, "w", encoding="utf-8") as f:
        json.dump(chahye_updated, f, ensure_ascii=False, indent=2)
    print(f"   [Saved] {CHAHYE_FILE}")

    with open(ALL_FILE, "w", encoding="utf-8") as f:
        json.dump(all_updated, f, ensure_ascii=False, indent=2)
    print(f"   [Saved] {ALL_FILE}")

    print("\n" + "=" * 70)
    print("🎉 국어/영어 독해 200문항 생성 및 데이터셋 누적 병합 성공!")
    print("=" * 70)

if __name__ == "__main__":
    main()
