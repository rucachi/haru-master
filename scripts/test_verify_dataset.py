import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

for name, path in [('나경이 (중3)', 'study_data/nakyeong/nakyung_questions_480.json'), ('차혜 (중1)', 'study_data/chahye/chahye_questions_380.json')]:
    data = json.load(open(path, encoding='utf-8'))
    print(f"=== {name}: 총 {len(data)}문항 샘플 검증 ===")
    for q in data[::30]:
        qid = q['question_id']
        sub = q['subject']
        txt = q['question_text']
        ans = q['correct_answer']
        ans_text = q['options'][ans - 1]
        print(f"[{qid}] ({sub}) {txt} -> 정답 {ans}번: {ans_text}")
    print()
