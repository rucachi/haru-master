"""Audit the generated question bank without modifying source data."""

from __future__ import annotations

import argparse
import collections
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATASET = ROOT / "study_data" / "all_curriculum_questions_860.json"
DIFFICULTY_TARGETS = {"easy": 0.30, "medium": 0.40, "hard": 0.30}


def normalize_text(value: str) -> str:
    return re.sub(r"\W+", "", value.lower(), flags=re.UNICODE)


def load_questions(path: Path) -> list[dict]:
    with path.open(encoding="utf-8") as file:
        data = json.load(file)
    if not isinstance(data, list):
        raise ValueError("Dataset root must be a JSON array")
    return data


def audit(questions: list[dict]) -> tuple[dict, list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    ids = [question.get("question_id") for question in questions]
    id_counts = collections.Counter(ids)
    duplicate_ids = sorted(question_id for question_id, count in id_counts.items() if count > 1)
    if duplicate_ids:
        errors.append(f"duplicate question_id: {duplicate_ids[:10]}")

    text_groups: dict[str, list[str]] = collections.defaultdict(list)
    for question in questions:
        text = question.get("question_text", "")
        text_groups[normalize_text(text)].append(question.get("question_id", "<missing>"))
    duplicate_texts = [group for group in text_groups.values() if len(group) > 1]
    if duplicate_texts:
        warnings.append(f"duplicate normalized question_text groups: {len(duplicate_texts)}")

    difficulty_counts = collections.Counter(question.get("difficulty", "MISSING") for question in questions)
    for question in questions:
        question_id = question.get("question_id", "<missing>")
        options = question.get("options")
        if not question_id:
            errors.append("missing question_id")
        if not isinstance(options, list) or len(options) != 5:
            errors.append(f"{question_id}: options must contain exactly 5 items")
        elif len({str(option).strip() for option in options}) != 5:
            errors.append(f"{question_id}: duplicate options")
        answer = question.get("correct_answer")
        if not isinstance(answer, int) or not 1 <= answer <= len(options or []):
            errors.append(f"{question_id}: invalid correct_answer")
        for field in ("question_text", "explanation", "chapter", "difficulty"):
            if not str(question.get(field, "")).strip():
                errors.append(f"{question_id}: missing {field}")
        if question.get("subject") in {"국어", "영어"} and question.get("passage"):
            if len(question["passage"].strip()) < 80:
                warnings.append(f"{question_id}: passage is shorter than 80 characters")
        for text_field in ("question_text", "explanation", *["options"]):
            values = question.get(text_field, []) if text_field == "options" else [question.get(text_field, "")]
            for value in values:
                if str(value).count("$") % 2:
                    errors.append(f"{question_id}: unbalanced LaTeX dollar markers")
                    break
        image_url = str(question.get("image_url", ""))
        if image_url and not image_url.startswith("data:image/svg+xml"):
            warnings.append(f"{question_id}: image_url is not an SVG data URI")

    passage_groups = collections.Counter(
        (question.get("grade"), question.get("subject"), question.get("passage"))
        for question in questions
        if question.get("passage")
    )
    out_of_range_sets = [size for size in passage_groups.values() if size < 2 or size > 3]
    if out_of_range_sets:
        warnings.append(f"passage groups outside 2-3 items: {len(out_of_range_sets)}")

    missing_provenance = sum("origin" not in question or "review_status" not in question for question in questions)
    if missing_provenance:
        warnings.append(f"questions missing origin/review_status: {missing_provenance}")

    for difficulty, target in DIFFICULTY_TARGETS.items():
        actual = difficulty_counts[difficulty] / len(questions) if questions else 0
        if abs(actual - target) > 0.02:
            warnings.append(f"difficulty {difficulty}: {actual:.1%}, target {target:.1%}")

    report = {
        "total": len(questions),
        "difficulty": dict(difficulty_counts),
        "duplicate_id_groups": len(duplicate_ids),
        "duplicate_question_text_groups": len(duplicate_texts),
        "passage_groups": len(passage_groups),
        "passage_groups_outside_2_3": len(out_of_range_sets),
        "missing_provenance": missing_provenance,
        "structural_error_count": len(errors),
        "warning_count": len(warnings),
    }
    return report, errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit a HaruMaster question bank")
    parser.add_argument("dataset", nargs="?", type=Path, default=DEFAULT_DATASET)
    parser.add_argument("--strict", action="store_true", help="fail when structural errors exist")
    args = parser.parse_args()

    try:
        questions = load_questions(args.dataset)
        report, errors, warnings = audit(questions)
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2

    print(json.dumps(report, ensure_ascii=False, indent=2))
    for message in errors:
        print(f"ERROR: {message}")
    for message in warnings:
        print(f"WARNING: {message}")
    return 1 if args.strict and errors else 0


if __name__ == "__main__":
    raise SystemExit(main())