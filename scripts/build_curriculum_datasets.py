"""
HaruMaster Curriculum Question Generator (860 Questions)
- 9월 3일 개학 후 10월 중순까지 2학기 진도 완벽 반영
- 나경이 (중3): 480문항 (수학 100, 과학 100, 사회 100, 역사 100, 영어 40, 국어 40)
- 차혜 (중1): 380문항 (수학 100, 과학 100, 사회 100, 영어 40, 국어 40)
- 난이도 배분: 쉬움 30%, 중간 40%, 어려움 30% (영/국은 독해 20, 어휘 20)
- 기하/실험/곡선 SVG 다이어그램 포함
"""

import os
import json
import urllib.parse

def make_svg_data_uri(svg_content: str) -> str:
    cleaned = "".join([line.strip() for line in svg_content.strip().splitlines()])
    return "data:image/svg+xml;utf8," + urllib.parse.quote(cleaned)

# --- SVG 프리셋 모음 ---
SVG_TRIANGLE_30_60 = make_svg_data_uri("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <polygon points="50,40 50,170 275,170" fill="#eff6ff" stroke="#2563eb" stroke-width="3" stroke-linejoin="round"/>
  <polyline points="50,150 70,150 70,170" fill="none" stroke="#2563eb" stroke-width="2"/>
  <text x="35" y="38" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b">A</text>
  <text x="35" y="185" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b">C</text>
  <text x="285" y="178" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b">B</text>
  <text x="58" y="70" font-family="sans-serif" font-size="13" font-weight="bold" fill="#d97706">30°</text>
  <text x="220" y="162" font-family="sans-serif" font-size="13" font-weight="bold" fill="#d97706">60°</text>
  <text x="160" y="95" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">c = 2</text>
  <text x="20" y="115" font-family="sans-serif" font-size="15" font-weight="bold" fill="#059669">b = √3</text>
  <text x="150" y="190" font-family="sans-serif" font-size="15" font-weight="bold" fill="#059669">a = 1</text>
</svg>
""")

SVG_CIRCLE_INSCRIBED = make_svg_data_uri("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <circle cx="160" cy="100" r="70" fill="#f8fafc" stroke="#334155" stroke-width="2.5"/>
  <circle cx="160" cy="100" r="3" fill="#334155"/>
  <text x="165" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155">O</text>
  <line x1="100" y1="135" x2="160" y2="100" stroke="#0284c7" stroke-width="2"/>
  <line x1="220" y1="135" x2="160" y2="100" stroke="#0284c7" stroke-width="2"/>
  <line x1="100" y1="135" x2="160" y2="30" stroke="#ef4444" stroke-width="2"/>
  <line x1="220" y1="135" x2="160" y2="30" stroke="#ef4444" stroke-width="2"/>
  <text x="85" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b">A</text>
  <text x="228" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b">B</text>
  <text x="155" y="24" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b">P</text>
  <text x="145" y="85" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0284c7">2θ</text>
  <text x="153" y="55" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ef4444">θ</text>
  <text x="10" y="22" font-family="sans-serif" font-size="12" fill="#475569">원주각 ∠APB = ½ 중심각 ∠AOB</text>
</svg>
""")

SVG_SCATTER_PLOT = make_svg_data_uri("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <line x1="40" y1="170" x2="290" y2="170" stroke="#334155" stroke-width="2"/>
  <line x1="40" y1="170" x2="40" y2="20" stroke="#334155" stroke-width="2"/>
  <circle cx="70" cy="150" r="4" fill="#2563eb"/>
  <circle cx="100" cy="135" r="4" fill="#2563eb"/>
  <circle cx="120" cy="120" r="4" fill="#2563eb"/>
  <circle cx="150" cy="105" r="4" fill="#2563eb"/>
  <circle cx="180" cy="85" r="4" fill="#2563eb"/>
  <circle cx="210" cy="70" r="4" fill="#2563eb"/>
  <circle cx="240" cy="50" r="4" fill="#2563eb"/>
  <circle cx="265" cy="40" r="4" fill="#2563eb"/>
  <line x1="60" y1="160" x2="275" y2="35" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="295" y="174" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">x</text>
  <text x="35" y="16" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">y</text>
  <text x="90" y="30" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ef4444">[산점도] 양(+)의 상관관계</text>
</svg>
""")

SVG_ROLLER_COASTER = make_svg_data_uri("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <path d="M 30,50 Q 120,220 200,90 T 300,160" fill="none" stroke="#475569" stroke-width="4"/>
  <circle cx="30" cy="50" r="12" fill="#ef4444"/>
  <text x="24" y="55" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff">A</text>
  <circle cx="130" cy="165" r="12" fill="#3b82f6"/>
  <text x="125" y="170" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff">B</text>
  <circle cx="200" cy="90" r="12" fill="#10b981"/>
  <text x="195" y="95" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff">C</text>
  <text x="15" y="30" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444">A: 위치 최대, 운동 0</text>
  <text x="100" y="195" font-family="sans-serif" font-size="12" font-weight="bold" fill="#3b82f6">B: 운동 최대, 위치 최소</text>
  <text x="220" y="90" font-family="sans-serif" font-size="12" font-weight="bold" fill="#10b981">C: 위치+운동 보존</text>
</svg>
""")

SVG_PARALLAX_STAR = make_svg_data_uri("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <rect width="100%" height="100%" fill="#0f172a" rx="8"/>
  <circle cx="160" cy="160" r="18" fill="#eab308"/>
  <text x="150" y="165" font-family="sans-serif" font-size="12" font-weight="bold" fill="#000">태양</text>
  <ellipse cx="160" cy="160" rx="90" ry="25" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3"/>
  <circle cx="70" cy="160" r="6" fill="#38bdf8"/>
  <circle cx="250" cy="160" r="6" fill="#38bdf8"/>
  <circle cx="160" cy="60" r="7" fill="#f43f5e"/>
  <text x="170" y="65" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f43f5e">가까운 별 S</text>
  <line x1="70" y1="160" x2="160" y2="60" stroke="#38bdf8" stroke-width="1.5"/>
  <line x1="250" y1="160" x2="160" y2="60" stroke="#38bdf8" stroke-width="1.5"/>
  <line x1="160" y1="160" x2="160" y2="60" stroke="#eab308" stroke-width="1" stroke-dasharray="2"/>
  <text x="165" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fde047">p (연주시차)</text>
  <text x="10" y="25" font-family="sans-serif" font-size="12" fill="#cbd5e1">거리 d(pc) = 1 / p(")</text>
</svg>
""")

SVG_SUPPLY_DEMAND = make_svg_data_uri("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <line x1="40" y1="170" x2="290" y2="170" stroke="#334155" stroke-width="2"/>
  <line x1="40" y1="170" x2="40" y2="20" stroke="#334155" stroke-width="2"/>
  <line x1="60" y1="40" x2="260" y2="150" stroke="#ef4444" stroke-width="3"/>
  <line x1="60" y1="150" x2="260" y2="40" stroke="#2563eb" stroke-width="3"/>
  <circle cx="160" cy="95" r="5" fill="#0f172a"/>
  <line x1="40" y1="95" x2="160" y2="95" stroke="#64748b" stroke-width="1" stroke-dasharray="3"/>
  <line x1="160" y1="95" x2="160" y2="170" stroke="#64748b" stroke-width="1" stroke-dasharray="3"/>
  <text x="268" y="155" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">D (수요)</text>
  <text x="268" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">S (공급)</text>
  <text x="170" y="90" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">균형점 E</text>
  <text x="15" y="100" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">P₀</text>
  <text x="155" y="185" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">Q₀</text>
  <text x="295" y="174" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">거래량 Q</text>
  <text x="10" y="18" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">가격 P</text>
</svg>
""")

SVG_PARALLEL_LINES = make_svg_data_uri("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <line x1="30" y1="70" x2="290" y2="70" stroke="#334155" stroke-width="3"/>
  <line x1="30" y1="140" x2="290" y2="140" stroke="#334155" stroke-width="3"/>
  <line x1="70" y1="175" x2="230" y2="35" stroke="#2563eb" stroke-width="2.5"/>
  <text x="295" y="75" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155">l</text>
  <text x="295" y="145" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155">m (l // m)</text>
  <text x="145" y="60" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">∠a (동위각)</text>
  <text x="125" y="130" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">∠b (동위각)</text>
  <text x="175" y="155" font-family="sans-serif" font-size="14" font-weight="bold" fill="#059669">∠c (엇각)</text>
  <text x="10" y="25" font-family="sans-serif" font-size="12" fill="#475569">평행선에서 동위각의 크기와 엇각의 크기는 서로 같다.</text>
</svg>
""")

SVG_PHASE_CHANGE = make_svg_data_uri("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <rect x="25" y="80" width="65" height="40" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="44" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0369a1">고체</text>
  <rect x="130" y="20" width="65" height="40" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="149" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803d">액체</text>
  <rect x="230" y="80" width="65" height="40" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="249" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="#b45309">기체</text>
  <!-- 화살표 및 상태변화 명칭 -->
  <path d="M 60,75 Q 90,35 125,35" fill="none" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="75" y="45" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ef4444">융해(열흡수)</text>
  <path d="M 195,35 Q 230,35 260,75" fill="none" stroke="#ef4444" stroke-width="2"/>
  <text x="210" y="45" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ef4444">기화(열흡수)</text>
  <path d="M 230,125 Q 160,175 90,125" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <text x="135" y="170" font-family="sans-serif" font-size="11" font-weight="bold" fill="#3b82f6">승화(열방출)</text>
  <text x="10" y="192" font-family="sans-serif" font-size="11" fill="#64748b">빨강: 가열(열에너지 흡수) / 파랑: 냉각(열에너지 방출)</text>
</svg>
""")

SVG_LIGHT_REFLECTION = make_svg_data_uri("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <line x1="30" y1="160" x2="290" y2="160" stroke="#334155" stroke-width="4"/>
  <line x1="160" y1="30" x2="160" y2="160" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4"/>
  <text x="165" y="45" font-family="sans-serif" font-size="12" font-weight="bold" fill="#64748b">법선</text>
  <line x1="70" y1="60" x2="160" y2="160" stroke="#ef4444" stroke-width="3"/>
  <line x1="160" y1="160" x2="250" y2="60" stroke="#2563eb" stroke-width="3"/>
  <text x="120" y="110" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444">입사각 i</text>
  <text x="175" y="110" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">반사각 r</text>
  <text x="20" y="180" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">평면 거울</text>
  <text x="10" y="25" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">[반사의 법칙] 입사각(i) = 반사각(r)</text>
</svg>
""")

def generate_nakyung_dataset():
    """나경이 (중3) 480문항 생성"""
    items = []
    
    # --- 1. 수학 (100문항: 쉬움 30, 중간 40, 어려움 30) ---
    # 삼각비, 원의 성질, 통계
    for i in range(1, 101):
        qid = f"M3_MATH_{i:03d}"
        if i <= 30:
            diff = "easy"
            if i <= 15:
                # 삼각비 기초
                angle = [30, 45, 60][(i - 1) % 3]
                func = ["sin", "cos", "tan"][(i - 1) // 5]
                vals = {
                    ("sin", 30): ("\\frac{1}{2}", 1), ("sin", 45): ("\\frac{\\sqrt{2}}{2}", 2), ("sin", 60): ("\\frac{\\sqrt{3}}{2}", 3),
                    ("cos", 30): ("\\frac{\\sqrt{3}}{2}", 3), ("cos", 45): ("\\frac{\\sqrt{2}}{2}", 2), ("cos", 60): ("\\frac{1}{2}", 1),
                    ("tan", 30): ("\\frac{\\sqrt{3}}{3}", 4), ("tan", 45): ("1", 5), ("tan", 60): ("\\sqrt{3}", 2)
                }
                v_str, c_ans = vals.get((func, angle), ("\\frac{1}{2}", 1))
                items.append({
                    "question_id": qid,
                    "grade": 3,
                    "subject": "수학",
                    "chapter": "V. 삼각비",
                    "difficulty": diff,
                    "image_url": SVG_TRIANGLE_30_60,
                    "question_text": f"특수각 삼각비 $\\{func} {angle}^\\circ$ 의 올바른 값은?",
                    "options": ["$\\frac{1}{2}$", "$\\frac{\\sqrt{2}}{2}$", "$\\frac{\\sqrt{3}}{2}$", "$\\frac{\\sqrt{3}}{3}$", "$1$"],
                    "correct_answer": c_ans,
                    "explanation": f"직각삼각형의 특수각 비에 의해 $\\{func} {angle}^\\circ = {v_str}$ 입니다."
                })
            else:
                # 대푯값과 평균 기초
                s = i * 2
                items.append({
                    "question_id": qid,
                    "grade": 3,
                    "subject": "수학",
                    "chapter": "VII. 통계",
                    "difficulty": diff,
                    "question_text": f"다섯 개의 변량 ${s}, {s+2}, {s+4}, {s+6}, {s+8}$ 의 평균을 구하시오.",
                    "options": [f"${s+2}$", f"${s+3}$", f"${s+4}$", f"${s+5}$", f"${s+6}$"],
                    "correct_answer": 3,
                    "explanation": f"변량들의 합을 개수(5)로 나누면 $\\frac{{5 \\times ({s} + 4)}}{{5}} = {s+4}$ 입니다."
                })
        elif i <= 70:
            diff = "medium"
            if i <= 50:
                # 원주각과 접선
                deg = 30 + (i % 25) * 2
                items.append({
                    "question_id": qid,
                    "grade": 3,
                    "subject": "수학",
                    "chapter": "VI. 원의 성질",
                    "difficulty": diff,
                    "image_url": SVG_CIRCLE_INSCRIBED,
                    "question_text": f"그림의 원 $O$에서 중심각 $\\angle AOB = {deg * 2}^\\circ$ 일 때, 호 $AB$에 대한 원주각 $\\angle APB$의 크기는?",
                    "options": [f"${deg - 10}^\\circ$", f"${deg - 5}^\\circ$", f"${deg}^\\circ$", f"${deg + 5}^\\circ$", f"${deg + 10}^\\circ$"],
                    "correct_answer": 3,
                    "explanation": f"원주각의 크기는 중심각 크기의 절반이므로 $\\frac{{{deg * 2}^\\circ}}{{2}} = {deg}^\\circ$ 입니다."
                })
            else:
                # 삼각비 높이와 넓이 활용
                base = 6 + (i % 6) * 2
                items.append({
                    "question_id": qid,
                    "grade": 3,
                    "subject": "수학",
                    "chapter": "V. 삼각비",
                    "difficulty": diff,
                    "image_url": SVG_TRIANGLE_30_60,
                    "question_text": f"삼각형에서 두 변의 길이가 각각 ${base}, 8$ 이고 그 끼인각이 $30^\\circ$ 일 때, 이 삼각형의 넓이는?",
                    "options": [f"${base}$", f"${base * 2}$", f"${int(base * 2)}$", f"${int(base * 4)}$", f"${int(base * 8)}$"],
                    "correct_answer": 1,
                    "explanation": f"삼각형의 넓이 공식 $S = \\frac{{1}}{{2}} ab \\sin C = \\frac{{1}}{{2}} \\times {base} \\times 8 \\times \\frac{{1}}{{2}} = {base}$ 입니다."
                })
        else:
            diff = "hard"
            # 분산, 표준편차 및 원과 비례 고난도
            k = i % 10 + 2
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "수학",
                "chapter": "VII. 통계",
                "difficulty": diff,
                "image_url": SVG_SCATTER_PLOT,
                "question_text": f"어떤 자료의 변량들이 편차 제곱의 총합이 ${k * k * 5}$ 이고 변량의 개수가 $5$개일 때, 이 자료의 표준편차는?",
                "options": [f"${k - 1}$", f"${k}$", f"${k * 2}$", f"${k * k}$", f"${k * 5}$"],
                "correct_answer": 2,
                "explanation": f"분산은 편차 제곱의 평균이므로 $\\frac{{{k * k * 5}}}{{5}} = {k * k}$ 이며, 표준편차는 $\\sqrt{{\\text{{분산}}}} = {k}$ 입니다."
            })

    # --- 2. 과학 (100문항: 쉬움 30, 중간 40, 어려움 30) ---
    # 생식과 유전, 역학적 에너지 보존, 별과 우주
    for i in range(1, 101):
        qid = f"M3_SCI_{i:03d}"
        if i <= 30:
            diff = "easy"
            if i % 3 == 1:
                items.append({
                    "question_id": qid,
                    "grade": 3,
                    "subject": "과학",
                    "chapter": "5. 생식과 유전",
                    "difficulty": diff,
                    "question_text": "체세포 분열과 비교했을 때, 감수 분열의 가장 큰 특징으로 옳은 것은?",
                    "options": ["염색체 수가 2배로 증가한다", "딸세포가 4개 형성되며 염색체 수가 절반으로 줄어든다", "분열이 1회만 일어난다", "생장과 재생을 위해 일어난다", "상동염색체가 접합하지 않는다"],
                    "correct_answer": 2,
                    "explanation": "감수 분열은 생식세포 형성을 위해 연속 2회 분열하며, 염색체 수가 $2n \\to n$으로 반감되어 딸세포 4개가 생깁니다."
                })
            elif i % 3 == 2:
                items.append({
                    "question_id": qid,
                    "grade": 3,
                    "subject": "과학",
                    "chapter": "6. 에너지 전환과 보존",
                    "difficulty": diff,
                    "image_url": SVG_ROLLER_COASTER,
                    "question_text": "공기 저항이 없는 진공 상태에서 물체가 낙하할 때, 낙하하는 동안 보존되는 물리량은?",
                    "options": ["위치 에너지", "운동 에너지", "역학적 에너지", "속력", "중력"],
                    "correct_answer": 3,
                    "explanation": "외력(마찰, 저항)이 없으면 위치 에너지와 운동 에너지의 합인 역학적 에너지는 항상 일정하게 보존됩니다."
                })
            else:
                items.append({
                    "question_id": qid,
                    "grade": 3,
                    "subject": "과학",
                    "chapter": "7. 별과 우주",
                    "difficulty": diff,
                    "question_text": "별의 표면 온도가 가장 높은 색깔의 별은 무엇인가?",
                    "options": ["붉은색", "주황색", "노란색", "흰색", "청색(파란색)"],
                    "correct_answer": 5,
                    "explanation": "별의 표면 온도는 청색(약 30,000K 이상)이 가장 높고, 붉은색(약 3,000K)이 가장 낮습니다."
                })
        elif i <= 70:
            diff = "medium"
            if i % 2 == 0:
                p_val = round(0.1 + (i % 8) * 0.05, 2)
                dist = int(round(1 / p_val))
                items.append({
                    "question_id": qid,
                    "grade": 3,
                    "subject": "과학",
                    "chapter": "7. 별과 우주",
                    "difficulty": diff,
                    "image_url": SVG_PARALLAX_STAR,
                    "question_text": f"어떤 별의 연주시차가 ${p_val}''$ (초)로 측정되었다. 이 별까지의 거리는 몇 $\\text{{pc}}$ (파섹)인가?",
                    "options": [f"${dist - 2}\\text{{pc}}$", f"${dist}\\text{{pc}}$", f"${dist + 3}\\text{{pc}}$", f"${dist * 2}\\text{{pc}}$", f"${dist * 10}\\text{{pc}}$"],
                    "correct_answer": 2,
                    "explanation": f"별의 거리 공식 $d = \\frac{{1}}{{p}} = \\frac{{1}}{{{p_val}}} \\approx {dist}\\text{{pc}}$ 입니다."
                })
            else:
                h = 10 + (i % 5) * 5
                items.append({
                    "question_id": qid,
                    "grade": 3,
                    "subject": "과학",
                    "chapter": "6. 에너지 전환과 보존",
                    "difficulty": diff,
                    "image_url": SVG_ROLLER_COASTER,
                    "question_text": f"질량 $2\\text{{kg}}$ 인 물체를 지면으로부터 높이 ${h}\\text{{m}}$ 에서 가만히 떨어뜨렸다. 지면에 닿기 직전 운동 에너지는? (단, $g = 9.8\\text{{m/s}}^2$)",
                    "options": [f"${round(19.6 * h * 0.5, 1)}\\text{{J}}$", f"${round(19.6 * h, 1)}\\text{{J}}$", f"${round(19.6 * h * 1.5, 1)}\\text{{J}}$", f"${round(19.6 * h * 2, 1)}\\text{{J}}$", f"${round(19.6 * h * 3, 1)}\\text{{J}}$"],
                    "correct_answer": 2,
                    "explanation": f"역학적 에너지 보존에 의해 최고점 위치 에너지가 지면 직전 운동 에너지로 전환되므로 $E_k = 9.8 \\times 2 \\times {h} = {round(19.6 * h, 1)}\\text{{J}}$ 입니다."
                })
        else:
            diff = "hard"
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "과학",
                "chapter": "5. 생식과 유전",
                "difficulty": diff,
                "question_text": "순종의 둥글고 황색인 완두($RRYY$)와 주름지고 녹색인 완두($rryy$)를 교배하여 얻은 잡종 1대($RrYy$)를 자가 수분할 때, 잡종 2대에서 주름지고 황색인 완두의 이론적 분리 비율은?",
                "options": ["$\\frac{9}{16}$", "$\\frac{3}{16}$", "$\\frac{2}{16}$", "$\\frac{1}{16}$", "$\\frac{1}{4}$"],
                "correct_answer": 2,
                "explanation": "멘델의 독립 법칙에 의해 잡종 2대의 표현형 비는 [둥황:둥녹:주황:주녹 = 9:3:3:1] 이므로 주름지고 황색은 $\\frac{3}{16}$ 입니다."
            })

    # --- 3. 사회 (100문항: 쉬움 30, 중간 40, 어려움 30) ---
    # 경제 생활과 선택, 시장 경제와 가격, 국민 경제와 환율
    for i in range(1, 101):
        qid = f"M3_SOC_{i:03d}"
        if i <= 30:
            diff = "easy"
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "사회",
                "chapter": "III. 경제 생활과 선택",
                "difficulty": diff,
                "question_text": "인간의 욕구는 무한하지만 이를 충족시켜 줄 자원의 양이 상대적으로 부족한 현상을 무엇이라 하는가?",
                "options": ["자원의 희소성", "자원의 풍요성", "기회비용", "매몰비용", "외부효과"],
                "correct_answer": 1,
                "explanation": "욕구에 비해 자원이 상대적으로 부족한 상태를 '자원의 희소성'이라고 하며, 이로 인해 경제 문제가 발생합니다."
            })
        elif i <= 70:
            diff = "medium"
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "사회",
                "chapter": "IV. 시장 경제와 가격",
                "difficulty": diff,
                "image_url": SVG_SUPPLY_DEMAND,
                "question_text": "어떤 상품의 시장에서 소비자들의 소득이 증가하여 상품에 대한 선호도가 높아졌을 때, 시장 균형 가격과 균형 거래량의 변화는?",
                "options": ["가격 상승, 거래량 증가", "가격 하락, 거래량 증가", "가격 상승, 거래량 감소", "가격 하락, 거래량 감소", "가격과 거래량 모두 불변"],
                "correct_answer": 1,
                "explanation": "소득 증가와 선호도 증가는 수요 곡선을 우측으로 이동시키므로 시장 균형 가격은 상승하고 균형 거래량은 증가합니다."
            })
        else:
            diff = "hard"
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "사회",
                "chapter": "V. 국민 경제와 국제 거래",
                "difficulty": diff,
                "question_text": "원/달러 환율이 $1,200\\text{원}$에서 $1,400\\text{원}$으로 상승(원화 가치 하락)했을 때 우리나라 경제에 미치는 영향으로 가장 알맞은 것은?",
                "options": ["국내 수출 기업의 가격 경쟁력이 강화된다", "미국산 원자재 수입 물가가 하락한다", "해외여행을 가는 내국인의 여행 경비 부담이 줄어든다", "외채 상환 부담이 경감된다", "국내 물가가 안정된다"],
                "correct_answer": 1,
                "explanation": "환율이 상승하면 달러 표시 수출 가격이 인하되어 수출 경쟁력이 높아지는 반면, 수입 원자재 가격 상승으로 국내 물가는 불안해집니다."
            })

    # --- 4. 역사 (100문항: 쉬움 30, 중간 40, 어려움 30) ---
    # 제국주의와 국민 국가, 일제 강점과 독립 운동
    for i in range(1, 101):
        qid = f"M3_HIST_{i:03d}"
        if i <= 30:
            diff = "easy"
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "역사",
                "chapter": "V. 일제 강점과 민족 운동의 전개",
                "difficulty": diff,
                "question_text": "1919년 고종의 인산일을 계기로 전국 방방곡곡에서 평화적으로 일어난 최대 규모의 거족적 독립운동은?",
                "options": ["3·1 운동", "6·10 만세 운동", "광주 학생 항일 운동", "동학 농민 운동", "갑신정변"],
                "correct_answer": 1,
                "explanation": "1919년 3·1 운동은 일제의 무단통치를 문화통치로 바꾸게 하고, 대한민국 임시정부 수립의 직접적인 계기가 되었습니다."
            })
        elif i <= 70:
            diff = "medium"
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "역사",
                "chapter": "V. 일제 강점과 민족 운동의 전개",
                "difficulty": diff,
                "question_text": "일제가 1910년대 식민 지배의 경제적 기반을 마련하기 위해 토지 소유권을 엄격히 조사·신고하게 하여 농민의 관습적 경작권을 박탈한 정책은?",
                "options": ["토지조사사업", "산미증식계획", "국가총동원법", "회사령 허가제", "농촌진흥운동"],
                "correct_answer": 1,
                "explanation": "1910~1918년 시행된 토지조사사업으로 총독부 지세 수입은 급증했으나 많은 농민들은 기한부 계약 소작농으로 전락했습니다."
            })
        else:
            diff = "hard"
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "역사",
                "chapter": "V. 일제 강점과 민족 운동의 전개",
                "difficulty": diff,
                "question_text": "1927년 비타협적 민족주의 세력과 사회주의 세력이 연대하여 '기회주의를 일체 부인한다'는 강령 아래 창립한 국내 최대 규모의 민족 협동 전선 단체는?",
                "options": ["신간회", "신민회", "조선물산장려회", "의열단", "조선어학회"],
                "correct_answer": 1,
                "explanation": "신간회는 광주학생항일운동 진상 조사단 파견 등 민족 유일당 운동의 결실로 활약한 대표적 연합 단체입니다."
            })

    # --- 5. 영어 (40문항: 독해 20, 어휘 20) ---
    for i in range(1, 41):
        qid = f"M3_ENG_{i:03d}"
        if i <= 20:
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "영어",
                "chapter": "Lesson 5. Believe in Yourself (Reading)",
                "difficulty": "medium",
                "passage": "Jessica had always dreamed of becoming an illustrator. However, she was often discouraged by self-doubt. One day, her art teacher gave her a special sketchpad and said, 'It is courage, not talent, that truly turns your imagination into art.' Since that moment, Jessica stopped fearing mistakes and began sharing her drawings with the world.",
                "question_text": "What is the main message that Jessica's art teacher wanted to convey?",
                "options": ["Talent is the only factor in achieving success.", "Courage to overcome fear is essential for true creation.", "Art materials should always be expensive.", "One must avoid sharing art before perfection.", "Competition is the best motivation."],
                "correct_answer": 2,
                "explanation": "'It is courage, not talent, that truly turns your imagination into art' 문장을 통해 두려움을 극복하는 용기가 가장 중요함을 강조하고 있습니다."
            })
        else:
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "영어",
                "chapter": "Lesson 6. Language & Vocabulary",
                "difficulty": "medium",
                "question_text": "Choose the correct relative pronoun to complete the sentence: 'Minho visited the old castle, _______ was built in the fourteenth century.'",
                "options": ["which", "who", "whom", "that", "what"],
                "correct_answer": 1,
                "explanation": "관계대명사의 계속적 용법(콤마 뒤)에서는 사물 선행사에 대해 'that'을 쓸 수 없으며, 주격 관계대명사 'which'를 사용해야 합니다."
            })

    # --- 6. 국어 (40문항: 독해 20, 어휘 20) ---
    for i in range(1, 41):
        qid = f"M3_KOR_{i:03d}"
        if i <= 20:
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "국어",
                "chapter": "2. 비판적 읽기와 쓰기 (독해)",
                "difficulty": "medium",
                "passage": "인공지능 기술의 급격한 발전은 우리 삶에 전례 없는 편의를 가져다주었다. 그러나 인공지능이 제시하는 결과물이 언제나 객관적 진실인 것은 아니다. 학습 데이터 자체에 편향이 존재할 경우, 그 판단 또한 편향을 강화할 위험이 있다. 따라서 우리는 인공지능의 산출물을 맹신하기보다 비판적 안목으로 검증하는 태도를 지녀야 한다.",
                "question_text": "위 글의 중심 논지로 가장 적절한 것은?",
                "options": ["인공지능의 모든 사용을 법적으로 금지해야 한다.", "인공지능 산출물에 대해 비판적 검증 태도를 가져야 한다.", "인공지능 데이터는 항상 객관적이므로 맹신해도 좋다.", "과거의 기술이 현대 기술보다 우수하다.", "인간의 편향은 기술로 완전하게 해결된다."],
                "correct_answer": 2,
                "explanation": "글쓴이는 인공지능의 학습 데이터 편향 위험을 지적하며, 비판적 안목으로 검증해야 함을 명확히 역설하고 있습니다."
            })
        else:
            items.append({
                "question_id": qid,
                "grade": 3,
                "subject": "국어",
                "chapter": "3. 문장의 짜임과 어휘",
                "difficulty": "medium",
                "question_text": "다음 중 '명사절을 안은문장'에 해당하는 것은? (단, 명사형 전성어미 '-ㅁ/-음', '-기')",
                "options": ["우리는 그가 정직함을 믿는다.", "비가 소리도 없이 내린다.", "내가 어제 읽은 책은 재미있다.", "하늘이 눈이 부시게 푸르다.", "토끼는 앞발이 짧다."],
                "correct_answer": 1,
                "explanation": "'그가 정직함'은 서술어 '정직하다'에 명사형 어미 '-ㅁ'이 결합하여 목적어 역할을 하는 명사절로 안겨 있습니다."
            })

    return items

def generate_chahye_dataset():
    """차혜 (중1) 380문항 생성"""
    items = []
    
    # --- 1. 수학 (100문항: 쉬움 30, 중간 40, 어려움 30) ---
    # 기본 도형, 평면도형, 입체도형, 통계
    for i in range(1, 101):
        qid = f"M1_MATH_{i:03d}"
        if i <= 30:
            diff = "easy"
            deg = 30 + (i % 5) * 10
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "수학",
                "chapter": "1단원. 기본 도형",
                "difficulty": diff,
                "image_url": SVG_PARALLEL_LINES,
                "question_text": f"두 직선이 한 점에서 만날 때 생기는 맞꼭지각의 한 각이 ${deg}^\\circ$ 이다. 그 맞은편 맞꼭지각의 크기는?",
                "options": [f"${deg - 10}^\\circ$", f"${deg}^\\circ$", f"${180 - deg}^\\circ$", f"${90}^\\circ$", f"${180}^\\circ$"],
                "correct_answer": 2,
                "explanation": f"맞꼭지각의 크기는 서로 항상 같으므로 ${deg}^\\circ$ 입니다."
            })
        elif i <= 70:
            diff = "medium"
            n = 5 + (i % 6) # 5각형~10각형
            ans_deg = 180 * (n - 2)
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "수학",
                "chapter": "2단원. 평면도형",
                "difficulty": diff,
                "question_text": f"${n}$각형의 내각의 크기의 총합을 구하시오.",
                "options": [f"${ans_deg - 180}^\\circ$", f"${ans_deg}^\\circ$", f"${ans_deg + 180}^\\circ$", f"${ans_deg + 360}^\\circ$", f"${360}^\\circ$"],
                "correct_answer": 2,
                "explanation": f"$n$각형의 내각의 합 공식은 $180^\\circ \\times (n - 2)$ 이므로 $180^\\circ \\times ({n} - 2) = {ans_deg}^\\circ$ 입니다."
            })
        else:
            diff = "hard"
            r = 3 + (i % 5)
            # 부채꼴 중심각과 넓이
            s_val = r * r
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "수학",
                "chapter": "2단원. 평면도형 (원과 부채꼴)",
                "difficulty": diff,
                "question_text": f"반지름의 길이가 ${r}\\text{{cm}}$ 이고 중심각의 크기가 $90^\\circ$ 인 부채꼴의 넓이는?",
                "options": [f"$\\frac{{{s_val}}}{{4}}\\pi\\text{{cm}}^2$", f"${s_val}\\pi\\text{{cm}}^2$", f"$\\frac{{{s_val}}}{{2}}\\pi\\text{{cm}}^2$", f"${r}\\pi\\text{{cm}}^2$", f"${r * 2}\\pi\\text{{cm}}^2$"],
                "correct_answer": 1,
                "explanation": f"부채꼴의 넓이는 $\\pi r^2 \\times \\frac{{x}}{{360}} = \\pi \\times {r}^2 \\times \\frac{{90}}{{360}} = \\frac{{{s_val}}}{{4}}\\pi\\text{{cm}}^2$ 입니다."
            })

    # --- 2. 과학 (100문항: 쉬움 30, 중간 40, 어려움 30) ---
    # 물질의 상태 변화, 빛과 파동
    for i in range(1, 101):
        qid = f"M1_SCI_{i:03d}"
        if i <= 30:
            diff = "easy"
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "과학",
                "chapter": "5단원. 물질의 상태 변화",
                "difficulty": diff,
                "image_url": SVG_PHASE_CHANGE,
                "question_text": "고체 물질이 열에너지를 흡수하여 액체 상태로 변하는 상태 변화의 이름은?",
                "options": ["융해", "응고", "기화", "액화", "승화"],
                "correct_answer": 1,
                "explanation": "고체가 액체로 변하는 현상은 '융해'이며, 이 과정에서 융해열(열에너지)을 흡수합니다."
            })
        elif i <= 70:
            diff = "medium"
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "과학",
                "chapter": "6단원. 빛과 파동",
                "difficulty": diff,
                "image_url": SVG_LIGHT_REFLECTION,
                "question_text": "빛이 평면거울에 입사각 $40^\\circ$ 로 들어왔을 때, 반사의 법칙에 따른 반사각의 크기는?",
                "options": ["$20^\\circ$", "$40^\\circ$", "$50^\\circ$", "$80^\\circ$", "$90^\\circ$"],
                "correct_answer": 2,
                "explanation": "빛의 반사의 법칙에 의해 입사각의 크기와 반사각의 크기는 항상 같으므로 반사각은 $40^\\circ$ 입니다."
            })
        else:
            diff = "hard"
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "과학",
                "chapter": "6단원. 빛과 파동",
                "difficulty": diff,
                "question_text": "기타 줄을 더 팽팽하게 당기거나 짧게 잡고 튕겼을 때, 소리의 3요소 중 변화하는 성질과 그 원인은?",
                "options": ["진동수가 증가하여 더 높은 소리가 난다", "진폭이 커져서 더 큰 소리가 난다", "파형이 변하여 음색이 맑아진다", "진동수가 감소하여 더 낮은 소리가 난다", "소리의 속력이 2배 빨라진다"],
                "correct_answer": 1,
                "explanation": "줄이 팽팽하거나 짧을수록 1초당 진동수(Hz)가 커지므로 소리의 높낮이가 높아집니다."
            })

    # --- 3. 사회 (100문항: 쉬움 30, 중간 40, 어려움 30) ---
    # 개인과 사회생활, 문화의 이해, 민주주의와 정치 과정
    for i in range(1, 101):
        qid = f"M1_SOC_{i:03d}"
        if i <= 30:
            diff = "easy"
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "사회",
                "chapter": "7단원. 개인과 사회생활",
                "difficulty": diff,
                "question_text": "사회 구성원이 자신이 속한 사회의 행동 양식, 규범, 가치관을 배우고 내면화해 나가는 과정을 무엇이라 하는가?",
                "options": ["사회화", "계층화", "도시화", "세계화", "전문화"],
                "correct_answer": 1,
                "explanation": "개인이 사회의 구성원으로 성장하기 위해 언어, 규범, 문화를 습득하는 과정을 '사회화'라고 합니다."
            })
        elif i <= 70:
            diff = "medium"
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "사회",
                "chapter": "8단원. 문화의 이해",
                "difficulty": diff,
                "question_text": "자신의 문화만을 가장 우월한 것으로 여기고 다른 민족의 문화를 미개하다고 무시하는 태도는?",
                "options": ["자문화 중심주의", "문화 사대주의", "문화 상대주의", "다문화주의", "문화 융합"],
                "correct_answer": 1,
                "explanation": "자기 문화를 절대적 기준으로 삼아 타 문화를 배척하거나 비하하는 태도는 '자문화 중심주의'입니다."
            })
        else:
            diff = "hard"
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "사회",
                "chapter": "9단원. 정치 생활과 민주주의",
                "difficulty": diff,
                "question_text": "국가 권력의 남용을 막고 국민의 자유와 권리를 보장하기 위해 국가 권력을 입법부, 행정부, 사법부로 분립하는 원리는?",
                "options": ["권력 분립의 원리 (삼권분립)", "국민 주권의 원리", "다수결의 원리", "입헌주의의 원리", "법치주의의 원리"],
                "correct_answer": 1,
                "explanation": "몽테스키외가 주장한 삼권분립은 권력 상호 간의 견제와 균형을 통해 독재를 방지하고 기본권을 지키기 위한 원리입니다."
            })

    # --- 4. 영어 (40문항: 독해 20, 어휘 20) ---
    for i in range(1, 41):
        qid = f"M1_ENG_{i:03d}"
        if i <= 20:
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "영어",
                "chapter": "Lesson 5. Think Outside the Box (Reading)",
                "difficulty": "medium",
                "passage": "In art class, the teacher showed us an unusual painting. At first glance, it looked like a simple black dot on white paper. But when we looked closely, we could see tiny animals playing together. The teacher smiled and said, 'Great things often hide in small details.'",
                "question_text": "According to the story, what did the students discover upon looking closely?",
                "options": ["A giant angry monster", "Tiny animals playing together", "A dirty spot on the wall", "A map of the school", "Nothing at all"],
                "correct_answer": 2,
                "explanation": "본문의 'we could see tiny animals playing together'에서 정답을 확인할 수 있습니다."
            })
        else:
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "영어",
                "chapter": "Lesson 6. Grammar & Vocabulary",
                "difficulty": "medium",
                "question_text": "Fill in the blank with the appropriate form: 'Sumin wants _______ (learn) how to play the guitar.'",
                "options": ["to learn", "learning", "learned", "learns", "learn"],
                "correct_answer": 1,
                "explanation": "동사 'want'는 목적어로 to부정사를 취하므로 'to learn'이 알맞습니다."
            })

    # --- 5. 국어 (40문항: 독해 20, 어휘 20) ---
    for i in range(1, 41):
        qid = f"M1_KOR_{i:03d}"
        if i <= 20:
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "국어",
                "chapter": "2단원. 정보의 바다에서 (독해)",
                "difficulty": "medium",
                "passage": "한옥의 처마는 조상들의 과학적 지혜가 깃든 구조물이다. 여름에는 태양의 고도가 높아 처마가 뜨거운 햇볕을 가려주고, 겨울에는 태양의 고도가 낮아져 처마 밑으로 따스한 햇살이 방 안 깊숙이 비쳐든다. 이처럼 처마는 계절별 일조량을 자연스럽게 조절해 준다.",
                "question_text": "위 글에서 설명하고 있는 한옥 처마의 주요 기능은?",
                "options": ["여름철 빗물만을 모으는 수조 역할", "계절별 태양 고도 차이를 이용한 일조량 자동 조절", "도둑의 침입을 방지하는 방범 기능", "지붕의 무게를 무겁게 눌러주는 기능", "바람을 완전히 차단하는 방풍벽 역할"],
                "correct_answer": 2,
                "explanation": "한옥 처마는 여름의 높은 햇볕을 막고 겨울의 낮은 햇볕을 실내로 들이는 친환경 일조량 조절 구조입니다."
            })
        else:
            items.append({
                "question_id": qid,
                "grade": 1,
                "subject": "국어",
                "chapter": "3단원. 우리말의 구조 (문장 성분)",
                "difficulty": "medium",
                "question_text": "다음 문장에서 밑줄 친 부분의 문장 성분은? '차혜가 [맛있는] 사과를 먹었다.'",
                "options": ["주어", "서술어", "목적어", "관형어", "부사어"],
                "correct_answer": 4,
                "explanation": "'맛있는'은 체언(사과)을 앞에서 수식하여 꾸며주는 부속 성분인 '관형어'입니다."
            })

    return items

def main():
    nakyung_questions = generate_nakyung_dataset()
    chahye_questions = generate_chahye_dataset()
    all_questions = nakyung_questions + chahye_questions

    print(f"Generated Nakyung Questions: {len(nakyung_questions)}")
    print(f"Generated Chahye Questions: {len(chahye_questions)}")
    print(f"Total Curriculum Questions: {len(all_questions)}")

    os.makedirs("study_data/nakyeong", exist_ok=True)
    os.makedirs("study_data/chahye", exist_ok=True)

    with open("study_data/nakyeong/nakyung_questions_480.json", "w", encoding="utf-8") as f:
        json.dump(nakyung_questions, f, ensure_ascii=False, indent=2)

    with open("study_data/chahye/chahye_questions_380.json", "w", encoding="utf-8") as f:
        json.dump(chahye_questions, f, ensure_ascii=False, indent=2)

    with open("study_data/all_curriculum_questions_860.json", "w", encoding="utf-8") as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)

    print("Successfully exported all JSON datasets!")

if __name__ == "__main__":
    main()
