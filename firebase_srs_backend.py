"""
Firebase & Firestore 기반 맞춤형 에듀테크 백엔드 파이프라인
- 중학교 1학년, 3학년 태블릿 일일 과제 업로드 및 검증
- O/X 채점 기반 자동 복습 주기(SRS: Spaced Repetition System) 알고리즘
"""

import os
import sys
import json
import logging
from typing import Dict, Any, List, Optional, Union
from datetime import datetime, timedelta

# Windows 터미널 한글 깨짐 방지
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Firebase Admin SDK
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    from google.cloud.firestore_v1.client import Client as FirestoreClient
except ImportError:
    firebase_admin = None
    credentials = None
    firestore = None
    FirestoreClient = Any

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("EdutechSRSBackend")

# 허용 가능한 교과목 목록 (중학교 교육과정 기준)
ALLOWED_SUBJECTS = {"국어", "영어", "수학", "사회", "역사", "과학"}
ALLOWED_GRADES = {1, 3}

# SRS 복습 주기 확장 테이블 (일 단위: 1 -> 3 -> 7 -> 14)
SRS_INTERVAL_STEPS = [1, 3, 7, 14]


# ==============================================================================
# Mock Firestore Client (실제 Firebase 인증키 부재 시 로컬 인메모리 에뮬레이션)
# ==============================================================================
class MockDocumentSnapshot:
    def __init__(self, data: Optional[Dict[str, Any]], exists: bool = True):
        self._data = dict(data) if data is not None else None
        self.exists = exists

    def to_dict(self) -> Optional[Dict[str, Any]]:
        return dict(self._data) if self._data is not None else None


class MockDocumentReference:
    def __init__(self, doc_path: str, store: dict):
        self.path = doc_path
        self._store = store

    def get(self) -> MockDocumentSnapshot:
        if self.path in self._store:
            return MockDocumentSnapshot(self._store[self.path], exists=True)
        return MockDocumentSnapshot(None, exists=False)

    def set(self, data: Dict[str, Any], merge: bool = False):
        if merge and self.path in self._store:
            merged = dict(self._store[self.path])
            merged.update(data)
            self._store[self.path] = merged
        else:
            self._store[self.path] = dict(data)

    def collection(self, subcol_name: str) -> "MockCollectionReference":
        return MockCollectionReference(f"{self.path}/{subcol_name}", self._store)


class MockCollectionReference:
    def __init__(self, col_path: str, store: dict):
        self.path = col_path
        self._store = store

    def document(self, doc_id: str) -> MockDocumentReference:
        return MockDocumentReference(f"{self.path}/{doc_id}", self._store)

    def where(self, field: str = "", op: str = "==", value: Any = None, filter: Any = None) -> "MockQuery":
        q = MockQuery(self.path, self._store)
        return q.where(field=field, op=op, value=value, filter=filter)

    def stream(self):
        q = MockQuery(self.path, self._store)
        return q.stream()


class MockQuery:
    """Mock Query supporting where filtering and stream iteration"""
    def __init__(self, col_path: str, store: dict, filters: Optional[List[tuple]] = None):
        self.col_path = col_path
        self._store = store
        self.filters = filters or []

    def where(self, field: str = "", op: str = "==", value: Any = None, filter: Any = None) -> "MockQuery":
        new_filters = list(self.filters)
        if filter is not None:
            # google-cloud-firestore FieldFilter 호환
            field_name = getattr(filter, "field_path", getattr(filter, "field", ""))
            op_str = getattr(filter, "op_string", getattr(filter, "op", "=="))
            val = getattr(filter, "value", None)
            new_filters.append((field_name, op_str, val))
        elif field:
            new_filters.append((field, op, value))
        return MockQuery(self.col_path, self._store, new_filters)

    def stream(self):
        prefix = f"{self.col_path}/"
        for path, data in self._store.items():
            if path.startswith(prefix) and path.count("/") == self.col_path.count("/") + 1:
                match = True
                for f_name, f_op, f_val in self.filters:
                    doc_val = data.get(f_name)
                    if f_op in ("==", "=") and doc_val != f_val:
                        match = False
                        break
                    elif f_op == "<=" and not (doc_val is not None and doc_val <= f_val):
                        match = False
                        break
                    elif f_op == ">=" and not (doc_val is not None and doc_val >= f_val):
                        match = False
                        break
                    elif f_op == "<" and not (doc_val is not None and doc_val < f_val):
                        match = False
                        break
                    elif f_op == ">" and not (doc_val is not None and doc_val > f_val):
                        match = False
                        break
                if match:
                    yield MockDocumentSnapshot(data, exists=True)


class MockFirestoreClient:
    """Cloud Firestore 인터페이스(collection, document, set, get, merge, query)를 인메모리로 에뮬레이션"""
    def __init__(self):
        self._store: Dict[str, Any] = {}

    def collection(self, col_name: str) -> MockCollectionReference:
        return MockCollectionReference(col_name, self._store)

    def get_all_documents(self) -> Dict[str, Any]:
        return self._store


# ==============================================================================
# 1. 초기화 및 환경 설정 (Initialization)
# ==============================================================================
def initialize_firestore(service_account_path: str = "serviceAccountKey.json", allow_mock: bool = True) -> Any:
    """
    로컬의 serviceAccountKey.json 인증키를 사용하여 Cloud Firestore 클라이언트를 초기화합니다.
    인증 키가 없을 경우 allow_mock=True이면 인메모리 MockFirestoreClient를 생성하여 안전하게 테스트할 수 있습니다.

    :param service_account_path: Firebase 서비스 계정 키 JSON 파일 경로
    :param allow_mock: 키 파일 부재 시 Mock 클라이언트 허용 여부
    :return: Firestore 클라이언트 인스턴스 (또는 Mock 클라이언트)
    """
    try:
        if not os.path.exists(service_account_path):
            if allow_mock:
                logger.warning(
                    f"'{service_account_path}' 파일이 없어 [인메모리 Mock Firestore 모드]로 초기화합니다. "
                    f"데이터 CRUD 및 SRS 로직이 정상 작동합니다."
                )
                return MockFirestoreClient()
            raise FileNotFoundError(f"인증 키 파일을 찾을 수 없습니다: '{service_account_path}'")

        if firebase_admin is None:
            logger.error("firebase-admin 패키지가 없습니다. 'pip install firebase-admin'을 실행하세요.")
            return MockFirestoreClient() if allow_mock else None

        # 이미 초기화된 앱이 없을 때만 신규 초기화
        if not firebase_admin._apps:
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK 초기화 완료.")
        else:
            logger.info("기존 Firebase 인스턴스를 재사용합니다.")

        db = firestore.client()
        logger.info("Cloud Firestore 실제 클라이언트 연결 성공.")
        return db

    except FileNotFoundError as fnf_err:
        logger.error(f"[초기화 실패] {fnf_err}")
        return MockFirestoreClient() if allow_mock else None
    except Exception as e:
        logger.error(f"[초기화 실패] Firebase 연결 중 오류 발생: {str(e)}", exc_info=True)
        return MockFirestoreClient() if allow_mock else None


# ==============================================================================
# 2. 일일 문제 데이터 검증 및 업로드 로직 (Data Parsing & Upload)
# ==============================================================================
def validate_question_data(question: Dict[str, Any]) -> bool:
    """
    문항 데이터의 유효성을 검사합니다.
    - subject: ["국어", "영어", "수학", "사회", "역사", "과학"] 포함 여부
    - grade: 1 또는 3
    - 필수 필드 누락 여부

    :param question: 개별 문항 딕셔너리
    :return: 유효 여부 (True / False)
    """
    # 1. 문항 ID 검증
    qid = str(question.get("question_id", "")).strip()
    if not qid:
        logger.error("[VALIDATION ERROR] 문항 ID('question_id')가 누락되었거나 비어 있어 업로드를 건너뜁니다.")
        return False

    # 2. 과목 검증
    subject = question.get("subject")
    if subject not in ALLOWED_SUBJECTS:
        logger.error(
            f"[VALIDATION ERROR] 문항 ID '{qid}': 유효하지 않은 과목 '{subject}'입니다. "
            f"허용 과목: {list(ALLOWED_SUBJECTS)} -> 해당 문항 업로드를 건너뜁니다."
        )
        return False

    # 3. 학년 검증 (중1, 중3)
    grade = question.get("grade")
    if grade not in ALLOWED_GRADES:
        logger.error(
            f"[VALIDATION ERROR] 문항 ID '{qid}': 유효하지 않은 학년 '{grade}'입니다. "
            f"(1 또는 3만 지원) -> 해당 문항 업로드를 건너뜁니다."
        )
        return False

    # 4. 필수 필드 검증 (본문, 보기, 정답)
    required_fields = ["question_text", "options", "correct_answer"]
    for field in required_fields:
        if field not in question or question[field] is None:
            logger.error(
                f"[VALIDATION ERROR] 문항 ID '{qid}': 필수 필드 '{field}'가 누락되었습니다. "
                f"-> 해당 문항 업로드를 건너뜁니다."
            )
            return False

    return True


def upload_daily_assignments(
    json_source: Union[str, Dict[str, Any]],
    db: Optional[FirestoreClient] = None
) -> Dict[str, int]:
    """
    JSON 형식의 학습지 데이터를 파싱하여 Cloud Firestore의 Questions 및 Assignments 컬렉션에 업로드합니다.
    수학 LaTeX 기호(예: $\\sqrt{x}$) 및 국어/영어 긴 본문(passage)을 안전하게 처리합니다.

    :param json_source: JSON 파일 경로(str) 또는 파싱된 딕셔너리(dict)
    :param db: Firestore 클라이언트 인스턴스
    :return: 업로드 통계 딕셔너리 (성공, 스킵, 실패 건수)
    """
    stats = {
        "questions_uploaded": 0,
        "questions_skipped": 0,
        "assignments_uploaded": 0,
        "errors": 0
    }

    # 1. JSON 데이터 로드
    raw_data: Dict[str, Any] = {}
    try:
        if isinstance(json_source, str):
            # utf-8 인코딩으로 열어 LaTeX 이스케이프 및 특수문자 보존
            with open(json_source, "r", encoding="utf-8") as f:
                raw_data = json.load(f)
        elif isinstance(json_source, dict):
            raw_data = json_source
        else:
            raise ValueError("json_source는 파일 경로(문자열) 또는 딕셔너리 형태여야 합니다.")
    except Exception as e:
        logger.error(f"[JSON 파싱 실패] 데이터를 읽어오는 중 오류가 발생했습니다: {str(e)}")
        stats["errors"] += 1
        return stats

    assignments_list = raw_data.get("assignments", [])
    if not assignments_list:
        logger.warning("[경고] 업로드할 'assignments' 데이터가 비어 있습니다.")
        return stats

    logger.info(f"총 {len(assignments_list)}건의 일일 과제 블록 처리를 시작합니다.")

    # 2. Firestore 배치 또는 건별 업로드 수행
    for item in assignments_list:
        try:
            assignment_date = str(item.get("assignment_date", "")).strip()
            target_grade = item.get("target_grade")
            questions = item.get("questions", [])

            if not assignment_date or target_grade not in ALLOWED_GRADES:
                logger.error(f"[과제 메타데이터 오류] 날짜('{assignment_date}') 또는 학년('{target_grade}')이 부적절하여 건너뜁니다.")
                stats["errors"] += 1
                continue

            valid_question_ids: List[str] = []

            # (1) 개별 Questions 파싱 및 업로드
            for q in questions:
                try:
                    # 유효성 검사 (과목 및 학년 등)
                    if not validate_question_data(q):
                        stats["questions_skipped"] += 1
                        continue

                    qid = str(q["question_id"]).strip()

                    # Firestore Questions 문서 스키마 구성
                    # passage 필드는 국어/영어 등 본문이 존재하는 경우에만 포함 (선택적 필드)
                    question_doc: Dict[str, Any] = {
                        "question_id": qid,
                        "grade": int(q["grade"]),
                        "subject": str(q["subject"]),
                        "question_text": str(q["question_text"]),  # LaTeX 유지 ($...$)
                        "options": list(q["options"]),
                        "correct_answer": q["correct_answer"],
                        "explanation": str(q.get("explanation", ""))
                    }

                    # 긴 본문(passage) 분리 처리
                    passage = q.get("passage")
                    if passage and str(passage).strip():
                        question_doc["passage"] = str(passage).strip()

                    # 도형 및 과학 실험 이미지/그림 (image_url 또는 Base64)
                    image_url = q.get("image_url")
                    if image_url and str(image_url).strip():
                        question_doc["image_url"] = str(image_url).strip()

                    # Firestore 저장 (Questions 컬렉션)
                    if db is not None:
                        q_ref = db.collection("Questions").document(qid)
                        q_ref.set(question_doc)

                    valid_question_ids.append(qid)
                    stats["questions_uploaded"] += 1
                    logger.info(f"  [문항 등록 완료] ID: {qid} | 과목: {q['subject']} | 학년: {q['grade']}학년")

                except Exception as q_err:
                    logger.error(f"  [문항 처리 오류] ID: {q.get('question_id')} 처리 중 오류 발생: {str(q_err)}")
                    stats["errors"] += 1

            # (2) Assignments 컬렉션 업로드
            if valid_question_ids:
                assignment_id = f"{assignment_date}_G{target_grade}"
                assignment_doc: Dict[str, Any] = {
                    "assignment_date": assignment_date,
                    "target_grade": int(target_grade),
                    "question_ids": valid_question_ids,
                    "total_questions": len(valid_question_ids),
                    "created_at": datetime.now().isoformat()
                }

                if db is not None:
                    assign_ref = db.collection("Assignments").document(assignment_id)
                    assign_ref.set(assignment_doc)

                stats["assignments_uploaded"] += 1
                logger.info(f"[과제 등록 완료] {assignment_date} 중{target_grade} ({len(valid_question_ids)}문항 연결 -> ID: {assignment_id})")
            else:
                logger.warning(f"[과제 스킵] {assignment_date} 중{target_grade}: 유효한 문항이 없어 과제를 생성하지 않았습니다.")

        except Exception as assign_err:
            logger.error(f"[과제 처리 오류] {assign_err}", exc_info=True)
            stats["errors"] += 1

    logger.info(
        f"=== 업로드 작업 요약 ===\n"
        f" - 문항 업로드 성공: {stats['questions_uploaded']}건\n"
        f" - 문항 검증 실패(스킵): {stats['questions_skipped']}건\n"
        f" - 과제 문서 생성: {stats['assignments_uploaded']}건\n"
        f" - 처리 중 에러: {stats['errors']}건"
    )
    return stats


# ==============================================================================
# 3. O/X 채점 기반 자동 복습(SRS) 알고리즘 (Spaced Repetition System)
# ==============================================================================
def calculate_next_srs_state(current_interval: int, current_wrong_count: int, is_correct: bool) -> tuple[int, int]:
    """
    SRS 간격 및 오답 횟수를 계산하는 순수 함수.

    주기 계산 규칙:
    - 초기 상태: interval = 0, wrongCount = 0
    - 정답 (is_correct == True): 1일 -> 3일 -> 7일 -> 14일로 점진적 확장 (14일 이상은 14일 유지)
    - 오답 (is_correct == False): interval 즉시 1일로 초기화, wrongCount + 1

    :param current_interval: 현재 복습 주기 (일)
    :param current_wrong_count: 누적 오답 횟수
    :param is_correct: O/X 정답 여부
    :return: (next_interval, next_wrong_count)
    """
    if is_correct:
        # 점진적 확장: 0 -> 1 -> 3 -> 7 -> 14
        if current_interval <= 0:
            next_interval = 1
        elif current_interval < 3:
            next_interval = 3
        elif current_interval < 7:
            next_interval = 7
        else:
            next_interval = 14
        next_wrong_count = current_wrong_count
    else:
        # 오답 시: interval을 즉시 1일로 리셋, wrongCount 1 증가
        next_interval = 1
        next_wrong_count = current_wrong_count + 1

    return next_interval, next_wrong_count


def update_review_schedule(
    user_uid: str,
    question_id: str,
    is_correct: bool,
    db: Optional[FirestoreClient] = None,
    base_date: Optional[datetime] = None
) -> Dict[str, Any]:
    """
    학생이 문제를 푼 뒤 호출되어 복습 주기(SRS)를 계산하고 Firestore를 업데이트합니다.
    저장 경로: Users/{user_uid}/Reviews/{question_id}

    :param user_uid: 학생 고유 식별자 (Firebase Auth UID)
    :param question_id: 문제 식별자
    :param is_correct: 정답 여부 (True: O, False: X)
    :param db: Firestore 클라이언트
    :param base_date: 기준 날짜 (기본값: 현재 시각)
    :return: 갱신된 SRS 상태 정보 딕셔너리
    """
    if not user_uid or not question_id:
        raise ValueError("user_uid와 question_id는 필수 인자입니다.")

    if base_date is None:
        base_date = datetime.now()

    result_data = {
        "user_uid": user_uid,
        "question_id": question_id,
        "is_correct": is_correct,
        "status": "FAILED"
    }

    try:
        current_interval = 0
        current_wrong_count = 0

        doc_ref = None
        if db is not None:
            doc_ref = (
                db.collection("Users")
                .document(user_uid)
                .collection("Reviews")
                .document(question_id)
            )

            # 기존 문서 조회
            snapshot = doc_ref.get()
            if snapshot.exists:
                doc_dict = snapshot.to_dict() or {}
                current_interval = int(doc_dict.get("interval", 0))
                current_wrong_count = int(doc_dict.get("wrongCount", 0))
            else:
                logger.info(f"[SRS 최초 등록] 학생 '{user_uid}'의 문항 '{question_id}' 복습 기록을 신규 생성합니다.")

        # SRS 알고리즘에 따른 새 interval 및 wrongCount 산출
        next_interval, next_wrong_count = calculate_next_srs_state(
            current_interval=current_interval,
            current_wrong_count=current_wrong_count,
            is_correct=is_correct
        )

        # next_review_date (YYYYMMDD) 계산
        next_review_datetime = base_date + timedelta(days=next_interval)
        next_review_date_str = next_review_datetime.strftime("%Y%m%d")

        # Firestore 업데이트 페이로드 구성
        update_payload: Dict[str, Any] = {
            "question_id": question_id,
            "interval": next_interval,
            "wrongCount": next_wrong_count,
            "last_is_correct": is_correct,
            "last_solved_at": base_date.isoformat(),
            "next_review_date": next_review_date_str
        }

        # Firestore에 set(merge=True) 옵션으로 업데이트
        if doc_ref is not None:
            # Firestore SERVER_TIMESTAMP 추가
            if firestore is not None:
                update_payload["updated_at"] = firestore.SERVER_TIMESTAMP
            doc_ref.set(update_payload, merge=True)

        result_data.update(update_payload)
        result_data["status"] = "SUCCESS"
        result_data["previous_interval"] = current_interval

        log_symbol = "O (정답)" if is_correct else "X (오답)"
        logger.info(
            f"[SRS 갱신 완료] 학생: {user_uid} | 문항: {question_id} | 채점: {log_symbol} | "
            f"주기: {current_interval}일 -> {next_interval}일 | 오답수: {next_wrong_count} | "
            f"다음 복습일: {next_review_date_str}"
        )
        return result_data

    except Exception as e:
        logger.error(
            f"[SRS 갱신 실패] 학생: {user_uid}, 문항: {question_id} 처리 중 예외 발생: {str(e)}",
            exc_info=True
        )
        result_data["error"] = str(e)
        return result_data


# ==============================================================================
# 4. 학생 학습 및 복습 조회/제출 기능 (Student Assignment & Review APIs)
# ==============================================================================
def get_daily_assignment(
    assignment_date: str,
    target_grade: int,
    db: Optional[FirestoreClient] = None
) -> Optional[Dict[str, Any]]:
    """
    특정 날짜 및 학년의 일일 과제와 포함된 전체 문항 데이터를 조회합니다.
    (태블릿 앱에서 오늘의 학습지 시작 시 호출)

    :param assignment_date: YYYYMMDD 형식의 날짜 (예: '20261013')
    :param target_grade: 학년 (1 또는 3)
    :param db: Firestore 클라이언트
    :return: 과제 메타데이터 및 문항 리스트를 포함한 딕셔너리 (없으면 None)
    """
    if db is None:
        logger.warning("[get_daily_assignment] Firestore 클라이언트가 없습니다.")
        return None

    assignment_id = f"{assignment_date}_G{target_grade}"
    assign_ref = db.collection("Assignments").document(assignment_id)
    snapshot = assign_ref.get()

    if not snapshot.exists:
        logger.warning(f"[과제 조회] 과제 ID '{assignment_id}'가 존재하지 않습니다.")
        return None

    assignment_data = snapshot.to_dict() or {}
    question_ids = assignment_data.get("question_ids", [])
    resolved_questions: List[Dict[str, Any]] = []

    for qid in question_ids:
        q_ref = db.collection("Questions").document(qid)
        q_snap = q_ref.get()
        if q_snap.exists:
            resolved_questions.append(q_snap.to_dict() or {})
        else:
            logger.warning(f"[과제 문항 조회 누락] 문항 ID '{qid}' 문서를 찾을 수 없습니다.")

    assignment_data["questions"] = resolved_questions
    logger.info(f"[과제 조회 완료] {assignment_id}: 총 {len(resolved_questions)}문항 불러옴")
    return assignment_data


def get_due_reviews(
    user_uid: str,
    target_date: Optional[str] = None,
    db: Optional[FirestoreClient] = None
) -> List[Dict[str, Any]]:
    """
    학생이 특정 날짜(기본값: 오늘)까지 복습해야 하는 SRS 문항 목록을 조회합니다.
    (next_review_date <= target_date 조건으로 조회 후 문항 내용 결합)

    :param user_uid: 학생 식별자 UID
    :param target_date: YYYYMMDD 형식 날짜 (None일 경우 오늘 날짜)
    :param db: Firestore 클라이언트
    :return: 복습 대상 문항 목록 (문제 내용 + SRS 복습 상태 포함)
    """
    if db is None or not user_uid:
        return []

    if target_date is None:
        target_date = datetime.now().strftime("%Y%m%d")

    reviews_ref = (
        db.collection("Users")
        .document(user_uid)
        .collection("Reviews")
    )

    due_reviews: List[Dict[str, Any]] = []
    try:
        query = reviews_ref.where("next_review_date", "<=", target_date)
        docs = list(query.stream())

        for doc_snap in docs:
            review_info = doc_snap.to_dict() or {}
            qid = review_info.get("question_id")
            if not qid:
                continue

            q_ref = db.collection("Questions").document(qid)
            q_snap = q_ref.get()
            q_data = q_snap.to_dict() if q_snap.exists else {}

            combined_item = {
                "question_id": qid,
                "srs_status": {
                    "interval": review_info.get("interval", 1),
                    "wrongCount": review_info.get("wrongCount", 0),
                    "next_review_date": review_info.get("next_review_date"),
                    "last_solved_at": review_info.get("last_solved_at"),
                    "last_is_correct": review_info.get("last_is_correct", False)
                },
                "question": q_data
            }
            due_reviews.append(combined_item)

        logger.info(f"[복습 목록 조회] 학생: {user_uid} | 기준일: {target_date} | 대상: {len(due_reviews)}문항")
    except Exception as e:
        logger.error(f"[복습 목록 조회 실패] {e}", exc_info=True)

    return due_reviews


def submit_assignment_answer(
    user_uid: str,
    question_id: str,
    selected_answer: int,
    db: Optional[FirestoreClient] = None,
    base_date: Optional[datetime] = None
) -> Dict[str, Any]:
    """
    학생이 태블릿에서 답안을 제출했을 때 자동 채점(O/X)하고 SRS 복습 주기를 갱신합니다.

    :param user_uid: 학생 식별자 UID
    :param question_id: 문항 ID
    :param selected_answer: 학생이 선택한 정답 번호 (1-based 정수)
    :param db: Firestore 클라이언트
    :param base_date: 채점 기준 일시
    :return: 채점 결과 및 SRS 갱신 정보 딕셔너리
    """
    if db is None:
        raise ValueError("Firestore 클라이언트가 필요합니다.")

    # 1. 문항 정보 조회하여 정답 확인
    q_ref = db.collection("Questions").document(question_id)
    q_snap = q_ref.get()
    if not q_snap.exists:
        raise ValueError(f"문항 ID '{question_id}'를 찾을 수 없습니다.")

    q_data = q_snap.to_dict() or {}
    correct_answer = q_data.get("correct_answer")
    is_correct = (int(selected_answer) == int(correct_answer))

    # 2. SRS 복습 스케줄 업데이트
    srs_update = update_review_schedule(
        user_uid=user_uid,
        question_id=question_id,
        is_correct=is_correct,
        db=db,
        base_date=base_date
    )

    return {
        "user_uid": user_uid,
        "question_id": question_id,
        "selected_answer": selected_answer,
        "correct_answer": correct_answer,
        "is_correct": is_correct,
        "explanation": q_data.get("explanation", ""),
        "question_text": q_data.get("question_text", ""),
        "srs_update": srs_update
    }


def get_student_learning_stats(
    user_uid: str,
    db: Optional[FirestoreClient] = None
) -> Dict[str, Any]:
    """
    학생의 누적 학습 통계(학습한 문제 수, 총 오답 수, 숙련 문항 수 등)를 집계합니다.
    """
    if db is None or not user_uid:
        return {}

    reviews_ref = db.collection("Users").document(user_uid).collection("Reviews")
    docs = list(reviews_ref.stream())

    total_questions = len(docs)
    total_wrong_answers = 0
    mastered_count = 0  # interval >= 7일 이상을 숙련(장기기억)으로 간주

    for d in docs:
        data = d.to_dict() or {}
        wrong_cnt = data.get("wrongCount", 0)
        interval = data.get("interval", 0)
        total_wrong_answers += wrong_cnt
        if interval >= 7:
            mastered_count += 1

    return {
        "user_uid": user_uid,
        "total_tracked_questions": total_questions,
        "total_wrong_counts": total_wrong_answers,
        "mastered_questions": mastered_count,
        "mastery_rate_percent": round((mastered_count / total_questions * 100), 1) if total_questions > 0 else 0.0
    }


# ==============================================================================
# 5. 시뮬레이션 및 단위 동작 테스트 (Standalone Test & Demonstration)
# ==============================================================================
def run_srs_simulation_demo():
    """
    실제 Firebase 연결 없이도 SRS 알고리즘 로직의 1 -> 3 -> 7 -> 14 확장 및
    오답 시 1일 리셋 및 wrongCount 누적 동작을 검증하는 시뮬레이션입니다.
    """
    print("\n" + "=" * 60)
    print(" [SRS 알고리즘 단계별 시뮬레이션 데모] ")
    print("=" * 60)

    user_uid = "STUDENT_2026_TEST_01"
    question_id = "M3_MATH_001"
    start_date = datetime(2026, 10, 13)

    # 모의 풀이 시나리오:
    # 1회차: 정답 (0 -> 1일)
    # 2회차: 정답 (1 -> 3일)
    # 3회차: 정답 (3 -> 7일)
    # 4회차: 오답 (7 -> 1일 리셋, wrongCount=1)
    # 5회차: 정답 (1 -> 3일)
    # 6회차: 정답 (3 -> 7일)
    # 7회차: 정답 (7 -> 14일)
    scenario = [
        (True, "1회차 풀이 - 정답 맞힘"),
        (True, "2회차 풀이 - 정답 맞힘"),
        (True, "3회차 풀이 - 정답 맞힘"),
        (False, "4회차 풀이 - 오답 틀림 (리셋 테스트)"),
        (True, "5회차 풀이 - 정답 맞힘"),
        (True, "6회차 풀이 - 정답 맞힘"),
        (True, "7회차 풀이 - 정답 맞힘 (최대 14일 도달)")
    ]

    current_interval = 0
    wrong_count = 0
    sim_date = start_date

    for idx, (is_corr, desc) in enumerate(scenario, 1):
        prev_interval = current_interval
        next_interval, wrong_count = calculate_next_srs_state(current_interval, wrong_count, is_corr)
        next_rev_date = sim_date + timedelta(days=next_interval)

        mark = "O (정답)" if is_corr else "X (오답)"
        print(f"Step {idx}: {desc}")
        print(f"  - 결과: {mark}")
        print(f"  - Interval: {prev_interval}일 -> {next_interval}일")
        print(f"  - 누적 오답 수: {wrong_count}")
        print(f"  - 다음 복습 예정일: {next_rev_date.strftime('%Y%m%d')} (+{next_interval}일)")
        print("-" * 40)

        current_interval = next_interval
        sim_date = next_rev_date


if __name__ == "__main__":
    print("=" * 60)
    print(" 에듀테크 백엔드 파이프라인 스크립트 실행")
    print("=" * 60)

    # 1. Firestore 초기화 (serviceAccountKey.json 연결 또는 Mock 모드)
    service_key_file = "serviceAccountKey.json"
    db_client = initialize_firestore(service_key_file, allow_mock=True)

    # 2. 샘플 학습지 JSON 데이터 검증 및 업로드 테스트
    sample_json_path = "sample_assignments.json"
    if os.path.exists(sample_json_path):
        print("\n--- 2. 일일 과제 업로드 및 데이터 검증 테스트 ---")
        upload_daily_assignments(sample_json_path, db=db_client)

    # 3. SRS 복습 알고리즘 시뮬레이션 출력
    run_srs_simulation_demo()

    # 4. 학생 태블릿 시나리오: 일일 과제 조회 -> 답안 제출(채점 및 SRS 갱신) -> 복습 조회
    print("\n--- 4. 학생 학습 및 자동 채점/복습 연동 엔드투엔드 테스트 ---")
    test_student = "STUDENT_TABLET_USER_01"
    
    # (1) 오늘 과제 가져오기 (20261013, 중3)
    today_assign = get_daily_assignment("20261013", target_grade=3, db=db_client)
    if today_assign:
        print(f"[과제 불러오기 성공] 과제 일자: {today_assign['assignment_date']}, 포함 문항 수: {len(today_assign['questions'])}")
        
        # 첫 번째 문제 풀기 (수학 근과 계수의 관계 - 정답 4번)
        q1 = today_assign["questions"][0]
        print(f"\n[문항 풀이] {q1['question_id']}: {q1['question_text']}")
        # 학생이 정답 4번 제출
        sub_res1 = submit_assignment_answer(
            user_uid=test_student,
            question_id=q1["question_id"],
            selected_answer=4,
            db=db_client,
            base_date=datetime(2026, 10, 13)
        )
        print(f"  -> 학생 정답 제출 결과: {'정답(O)' if sub_res1['is_correct'] else '오답(X)'} | 다음 복습일: {sub_res1['srs_update']['next_review_date']}")

        # 두 번째 문제 풀기 (과학 멘델의 법칙 - 정답 1번인데 3번으로 오답 제출 시나리오)
        q2 = today_assign["questions"][1]
        print(f"\n[문항 풀이] {q2['question_id']}: {q2['question_text']}")
        sub_res2 = submit_assignment_answer(
            user_uid=test_student,
            question_id=q2["question_id"],
            selected_answer=3, # 오답 제출
            db=db_client,
            base_date=datetime(2026, 10, 13)
        )
        print(f"  -> 학생 오답 제출 결과: {'정답(O)' if sub_res2['is_correct'] else '오답(X)'} | 해설: {sub_res2['explanation']} | 다음 복습일: {sub_res2['srs_update']['next_review_date']}")

    # (2) 복습 도래일(20261014)에 학생 복습 대기 목록 조회
    print("\n--- 5. 복습일(2026-10-14) 도래 문항 쿼리 테스트 ---")
    due_list = get_due_reviews(user_uid=test_student, target_date="20261014", db=db_client)
    print(f"[복습 대기 문항 수] 총 {len(due_list)}개 문항이 복습 대상으로 조회되었습니다.")
    for item in due_list:
        print(f"  - 문항 ID: {item['question_id']} | 현재 주기: {item['srs_status']['interval']}일 | 오답 횟수: {item['srs_status']['wrongCount']}회 | 문제: {item['question'].get('question_text', '')[:30]}...")

    # (3) 학생 누적 학습 대시보드 통계 조회
    print("\n--- 6. 학생 학습 통계 대시보드 ---")
    stats = get_student_learning_stats(test_student, db=db_client)
    print(f"학습 통계: {stats}")

    # 7. DB 저장 상태 검증 요약
    if isinstance(db_client, MockFirestoreClient):
        docs = db_client.get_all_documents()
        q_count = sum(1 for p in docs if p.startswith("Questions/"))
        a_count = sum(1 for p in docs if p.startswith("Assignments/"))
        r_count = sum(1 for p in docs if "/Reviews/" in p)
        print("\n" + "=" * 60)
        print(" [Firestore 저장소 상태 검증 요약] ")
        print(f" - Questions 컬렉션 문서 수: {q_count}개")
        print(f" - Assignments 컬렉션 문서 수: {a_count}개")
        print(f" - Reviews 하위 컬렉션 문서 수: {r_count}개")
        print("=" * 60)
