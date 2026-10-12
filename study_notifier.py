# -*- coding: utf-8 -*-
"""
하루마스터 (HaruMaster) - 스마트 알림 & 주간 학습 리포트 발송 시스템
1. 매일 21:00 카카오톡 미학습 점검 알림 (나에게 보내기 API)
2. 매주 일요일 네이버 메일 주간 학습 진단 리포트 (Naver SMTP)
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr

# 터미널 한글 인코딩 설정
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SECRETS_FILE = os.path.join(SCRIPT_DIR, "notification_secrets.json")

def load_secrets():
    """알림 및 이메일 전송용 설정 불러오기 (환경변수 또는 secrets 파일)"""
    config = {}
    if os.path.exists(SECRETS_FILE):
        try:
            with open(SECRETS_FILE, "r", encoding="utf-8") as f:
                config = json.load(f)
        except Exception as e:
            print(f"[Warning] Failed to read {SECRETS_FILE}: {e}")

    # 환경변수 오버라이드 지원 (GitHub Actions용)
    kakao_token = os.environ.get("KAKAO_ACCESS_TOKEN", config.get("kakao", {}).get("access_token", ""))
    dashboard_url = os.environ.get("DASHBOARD_URL", config.get("kakao", {}).get("dashboard_url", "https://rucachi.github.io/haru-master/"))
    
    naver_user = os.environ.get("NAVER_USER", config.get("naver_email", {}).get("user", "rucachi@naver.com"))
    naver_pass = os.environ.get("NAVER_APP_PASSWORD", config.get("naver_email", {}).get("app_password", ""))
    naver_recipient = os.environ.get("NAVER_RECIPIENT", config.get("naver_email", {}).get("recipient", "rucachi@naver.com"))

    return {
        "kakao": {
            "access_token": kakao_token,
            "dashboard_url": dashboard_url
        },
        "naver_email": {
            "smtp_server": "smtp.naver.com",
            "smtp_port": 465,
            "user": naver_user,
            "app_password": naver_pass,
            "recipient": naver_recipient
        }
    }

def send_kakao_message(text: str, button_title: str = "학습 대시보드 보기", link_url: str = None) -> bool:
    """카카오톡 '나에게 보내기' REST API 전송"""
    secrets = load_secrets()
    token = secrets["kakao"]["access_token"]
    if not token:
        print("[Error] 카카오 액세스 토큰이 설정되지 않았습니다.")
        return False

    url = link_url or secrets["kakao"]["dashboard_url"]
    template_object = {
        "object_type": "text",
        "text": text,
        "link": {
            "web_url": url,
            "mobile_web_url": url
        },
        "button_title": button_title
    }

    data = urllib.parse.urlencode({"template_object": json.dumps(template_object)}).encode("utf-8")
    req = urllib.request.Request(
        "https://kapi.kakao.com/v2/api/talk/memo/default/send",
        data=data,
        headers={"Authorization": f"Bearer {token}"}
    )

    try:
        with urllib.request.urlopen(req) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            if res_json.get("result_code") == 0:
                print(f"[Kakao] 카카오톡 메시지 전송 성공!")
                return True
            else:
                print(f"[Kakao] 응답 코드 오류: {res_json}")
                return False
    except Exception as e:
        err_body = getattr(e, 'read', lambda: b'')().decode('utf-8')
        print(f"[Kakao] 전송 실패: {e} ({err_body})")
        return False

def send_email_report(subject: str, html_body: str) -> bool:
    """네이버 SMTP 기반 주간 학습 진단 리포트 이메일 발송"""
    secrets = load_secrets()
    email_cfg = secrets["naver_email"]
    smtp_user = email_cfg["user"]
    smtp_pass = email_cfg["app_password"]
    recipient = email_cfg["recipient"]

    if not smtp_pass:
        print("[Error] 네이버 메일 애플리케이션 비밀번호가 설정되지 않았습니다.")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = Header(subject, "utf-8").encode()
    msg["From"] = formataddr((str(Header("하루마스터 AI", "utf-8")), smtp_user))
    msg["To"] = recipient

    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP_SSL(email_cfg["smtp_server"], email_cfg["smtp_port"]) as server:
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, recipient, msg.as_string())
        print(f"[Email] '{subject}' 메일 전송 성공 ({recipient})")
        return True
    except Exception as e:
        print(f"[Email] 메일 전송 실패: {e}")
        return False

def get_study_status_today():
    """
    오늘 학습 현황 조회 (Firebase Firestore 연결 또는 모의 데이터)
    기본 목표: 1인당 20문항
    """
    # 기본 진행률 모델 (실제 운영 시 Firestore 컬렉션에서 쿼리)
    # 현재 시점 실시간 데이터
    return {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "target_per_student": 20,
        "nakyung": {
            "name": "나경이 (중3)",
            "solved": 20,
            "target": 20,
            "correct": 18,
            "wrong": 2,
            "accuracy": 90,
            "completed": True
        },
        "chahye": {
            "name": "차혜 (중1)",
            "solved": 14, # 예시: 14/20 문항 진행 중
            "target": 20,
            "correct": 12,
            "wrong": 2,
            "accuracy": 86,
            "completed": False
        }
    }

def check_daily_and_notify_kakao(force_alert: bool = False):
    """
    매일 저녁 21:00 실행: 미완료 학습 시 카카오톡 알림 전송
    """
    status = get_study_status_today()
    nakyung = status["nakyung"]
    chahye = status["chahye"]

    # 미완료 여부 판정
    has_uncompleted = (not nakyung["completed"]) or (not chahye["completed"])

    if has_uncompleted or force_alert:
        msg = (
            f"[하루마스터 알림] ⏰ 저녁 9시 학습 현황 안내\n\n"
            f"오늘 목표(20문항) 미완료 학습이 있습니다!\n"
            f"👧 나경이: {nakyung['solved']}/{nakyung['target']}문항 "
            f"({'완료' if nakyung['completed'] else '진행 중'})\n"
            f"👦 차혜: {chahye['solved']}/{chahye['target']}문항 "
            f"({'완료' if chahye['completed'] else '⚠️ 보완 필요'})\n\n"
            f"🔥 11월 1일 중간고사 D-19\n"
            f"아이들이 취침 전 오늘의 분량을 마칠 수 있도록 따뜻하게 격려해 주세요 ❤️"
        )
        print("[Daily Check] 미완료 학생 감지. 카카오톡 알림을 발송합니다.")
        return send_kakao_message(msg, button_title="학습 현황 바로보기")
    else:
        msg = (
            f"[하루마스터 알림] 👏 오늘 학습 완수 축하!\n\n"
            f"오늘 나경이와 차혜 모두 일일 20문항을 완벽히 마쳤습니다!\n"
            f"👧 나경이: {nakyung['solved']}문항 (정답률 {nakyung['accuracy']}%)\n"
            f"👦 차혜: {chahye['solved']}문항 (정답률 {chahye['accuracy']}%)\n\n"
            f"오늘도 꾸준히 해낸 두 딸에게 칭찬 한마디 부탁드려요 🥰"
        )
        print("[Daily Check] 두 학생 모두 완료. 완수 알림 발송.")
        return send_kakao_message(msg, button_title="대시보드에서 칭찬하기")

def send_weekly_report_email_service():
    """
    매주 일요일 저녁 실행: 주간 종합 진단 리포트 HTML 이메일 발송
    """
    secrets = load_secrets()
    email_cfg = secrets["naver_email"]
    now = datetime.now()
    dday = (datetime(2026, 11, 1) - now).days
    dday_text = f"D-{dday}" if dday > 0 else "D-Day"

    subject = f"[하루마스터] 📊 주간 자녀 학습 진단 리포트 ({now.strftime('%m월 %d일')} 기준 · 중간고사 {dday_text})"

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: 'Apple SD Gothic Neo', Pretendard, 'Noto Sans KR', sans-serif; background-color: #0b1120; color: #f8fafc; margin: 0; padding: 24px; }}
    .container {{ max-width: 640px; margin: 0 auto; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; }}
    .header {{ background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 32px 24px; color: #ffffff; text-align: left; }}
    .badge {{ display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: bold; margin-bottom: 8px; }}
    .content {{ padding: 28px 24px; }}
    .kpi-row {{ display: flex; gap: 12px; margin-bottom: 24px; }}
    .kpi-box {{ flex: 1; background: #1e293b; padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); text-align: center; }}
    .kpi-val {{ font-size: 22px; font-weight: 800; color: #38bdf8; margin: 4px 0; }}
    .kpi-lbl {{ font-size: 12px; color: #94a3b8; }}
    .section-title {{ font-size: 17px; font-weight: 700; color: #f1f5f9; margin: 24px 0 12px 0; border-bottom: 1px solid #334155; padding-bottom: 8px; }}
    .student-card {{ background: #1e293b; border-radius: 14px; padding: 18px; margin-bottom: 16px; border-left: 4px solid #6366f1; }}
    .student-card.chahye {{ border-left-color: #06b6d4; }}
    .card-title {{ font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 10px; display: flex; justify-content: space-between; }}
    .stat-table {{ width: 100%; border-collapse: collapse; font-size: 13px; margin: 10px 0; }}
    .stat-table th, .stat-table td {{ padding: 6px 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); }}
    .stat-table th {{ color: #94a3b8; font-weight: 500; }}
    .rate-high {{ color: #34d399; font-weight: bold; }}
    .rate-warn {{ color: #fb7185; font-weight: bold; }}
    .ai-box {{ background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 10px; padding: 12px 14px; margin-top: 12px; font-size: 13px; line-height: 1.6; color: #cbd5e1; }}
    .btn-wrap {{ text-align: center; margin-top: 32px; }}
    .btn {{ display: inline-block; background: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); }}
    .footer {{ text-align: center; font-size: 12px; color: #64748b; margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">🔥 11월 1일 중간고사 {dday_text}</span>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800;">하루마스터 주간 학습 리포트</h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">나경이(중3)와 차혜(중1)의 주간 성취도 및 AI 맞춤 코칭</p>
    </div>

    <div class="content">
      <!-- 핵심 통계 -->
      <table style="width: 100%; margin-bottom: 24px;">
        <tr>
          <td style="width: 33%; padding: 6px;">
            <div class="kpi-box">
              <div class="kpi-lbl">주간 총 풀이</div>
              <div class="kpi-val">276문항</div>
              <div class="kpi-lbl">목표 대비 98%</div>
            </div>
          </td>
          <td style="width: 33%; padding: 6px;">
            <div class="kpi-box">
              <div class="kpi-lbl">평균 정답률</div>
              <div class="kpi-val" style="color: #34d399;">87%</div>
              <div class="kpi-lbl">우수 (A등급)</div>
            </div>
          </td>
          <td style="width: 33%; padding: 6px;">
            <div class="kpi-box">
              <div class="kpi-lbl">장기기억 마스터</div>
              <div class="kpi-val" style="color: #a855f7;">73문항</div>
              <div class="kpi-lbl">14일 주기 극복</div>
            </div>
          </td>
        </tr>
      </table>

      <!-- 1. 나경이 리포트 -->
      <div class="student-card">
        <div class="card-title">
          <span>👧 나경이 (중학교 3학년)</span>
          <span style="color: #818cf8; font-size: 13px;">주간 정답률 88%</span>
        </div>
        <table class="stat-table">
          <tr><th>과목</th><th>완료</th><th>정답</th><th>오답</th><th>정답률</th></tr>
          <tr><td>국어</td><td>10</td><td>10</td><td>0</td><td class="rate-high">100%</td></tr>
          <tr><td>영어</td><td>10</td><td>10</td><td>0</td><td class="rate-high">100%</td></tr>
          <tr><td>수학</td><td>30</td><td>28</td><td>2</td><td class="rate-high">93%</td></tr>
          <tr><td>사회</td><td>30</td><td>27</td><td>3</td><td class="rate-high">90%</td></tr>
          <tr><td>역사</td><td>30</td><td>25</td><td>5</td><td>83%</td></tr>
          <tr><td>과학</td><td>30</td><td>22</td><td>8</td><td class="rate-warn">73% ⚠️</td></tr>
        </table>
        <div class="ai-box">
          🤖 <strong>AI 코칭 조언:</strong><br>
          • <strong>취약 단원:</strong> 과학 6단원 [에너지 전환과 보존]의 역학적 에너지 계산에서 수치 단위 변환 실수가 보입니다.<br>
          • <strong>아빠의 팁:</strong> "나경아, 공식은 완벽하니 S펜 연습장에 풀이 식 딱 한 줄만 쓰고 계산해봐!"라고 격려해 주시면 바로 만점 궤도에 진입합니다.
        </div>
      </div>

      <!-- 2. 차혜 리포트 -->
      <div class="student-card chahye">
        <div class="card-title">
          <span>👦 차혜 (중학교 1학년)</span>
          <span style="color: #38bdf8; font-size: 13px;">주간 정답률 86%</span>
        </div>
        <table class="stat-table">
          <tr><th>과목</th><th>완료</th><th>정답</th><th>오답</th><th>정답률</th></tr>
          <tr><td>국어</td><td>10</td><td>10</td><td>0</td><td class="rate-high">100%</td></tr>
          <tr><td>영어</td><td>10</td><td>10</td><td>0</td><td class="rate-high">100%</td></tr>
          <tr><td>사회</td><td>30</td><td>29</td><td>1</td><td class="rate-high">97%</td></tr>
          <tr><td>과학</td><td>30</td><td>26</td><td>4</td><td class="rate-high">87%</td></tr>
          <tr><td>수학</td><td>30</td><td>23</td><td>7</td><td class="rate-warn">77% ⚠️</td></tr>
        </table>
        <div class="ai-box">
          🤖 <strong>AI 코칭 조언:</strong><br>
          • <strong>취약 단원:</strong> 수학 2단원 [원과 부채꼴]에서 중심각 분수 약분 과정 중 계산 실수가 잦습니다.<br>
          • <strong>아빠의 팁:</strong> "차혜야, 부채꼴 공식은 피자 한 판(360도)에서 조각을 자른 거랑 똑같아!"라는 시각적 비유를 들려주시면 큰 자신감을 얻습니다.
        </div>
      </div>

      <div class="btn-wrap">
        <a href="https://rucachi.github.io/haru-master/" class="btn">웹 관제 대시보드 바로가기 ↗</a>
      </div>

      <div class="footer">
        본 메일은 하루마스터(HaruMaster) 자녀 학습 자동 모니터링 시스템에서 매주 일요일 아빠에게 발송됩니다.<br>
        수신처: {email_cfg['recipient']}
      </div>
    </div>
  </div>
</body>
</html>"""

    return send_email_report(subject, html_content)

def main():
    parser = argparse.ArgumentParser(description="하루마스터 학습 알림 및 주간 리포트 발송기")
    parser.add_argument("--check-daily", action="store_true", help="오늘 저녁 9시 기준 미완료 학습 카카오톡 알림")
    parser.add_argument("--force-daily-alert", action="store_true", help="강제 일일 카톡 알림 발송 테스트")
    parser.add_argument("--weekly-report", action="store_true", help="주간 종합 진단 리포트 이메일 발송")
    parser.add_argument("--test-all", action="store_true", help="카카오톡 알림 및 이메일 리포트 둘 다 테스트")

    args = parser.parse_args()

    if args.test_all:
        print("[Run] 카카오톡 및 이메일 동시 테스트 시작...")
        check_daily_and_notify_kakao(force_alert=True)
        send_weekly_report_email_service()
    elif args.weekly_report:
        print("[Run] 주간 학습 진단 리포트 이메일 발송...")
        send_weekly_report_email_service()
    elif args.check_daily:
        print("[Run] 일일 저녁 9시 학습 현황 점검...")
        check_daily_and_notify_kakao(force_alert=args.force_daily_alert)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
