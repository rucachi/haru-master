# -*- coding: utf-8 -*-
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

nak = json.load(open('study_data/nakyeong/nakyung_questions_480.json', encoding='utf-8'))
cha = json.load(open('study_data/chahye/chahye_questions_380.json', encoding='utf-8'))
all_q = json.load(open('study_data/all_curriculum_questions_860.json', encoding='utf-8'))

nak_kor = [q for q in nak if q.get("subject") == "국어"]
nak_eng = [q for q in nak if q.get("subject") == "영어"]
cha_kor = [q for q in cha if q.get("subject") == "국어"]
cha_eng = [q for q in cha if q.get("subject") == "영어"]

print(f"Nakyung total: {len(nak)} (국어: {len(nak_kor)}, 영어: {len(nak_eng)})")
print(f"Chahye total:   {len(cha)} (국어: {len(cha_kor)}, 영어: {len(cha_eng)})")
print(f"All questions: {len(all_q)}")

assert len(nak) == 580, f"Nakyung expected 580, got {len(nak)}"
assert len(cha) == 480, f"Chahye expected 480, got {len(cha)}"
assert len(all_q) == 1060, f"All questions expected 1060, got {len(all_q)}"

assert len(nak_kor) == 90, f"Nakyung Kor expected 90, got {len(nak_kor)}"
assert len(nak_eng) == 90, f"Nakyung Eng expected 90, got {len(nak_eng)}"
assert len(cha_kor) == 90, f"Chahye Kor expected 90, got {len(cha_kor)}"
assert len(cha_eng) == 90, f"Chahye Eng expected 90, got {len(cha_eng)}"

# Validate every single question in the entire database
for idx, q in enumerate(all_q):
    assert len(q["options"]) == 5, f"Options != 5 in {q['question_id']}"
    assert len(set(q["options"])) == 5, f"Duplicate options in {q['question_id']}"
    assert 1 <= q["correct_answer"] <= 5, f"Invalid correct_answer in {q['question_id']}"
    assert "explanation" in q and len(q["explanation"].strip()) > 0, f"Empty explanation in {q['question_id']}"

print(">>> ALL 1,060 QUESTIONS STRICTLY VALIDATED WITH 0 DEFECTS! <<<")
