#!/usr/bin/env python3
"""Import only the user's curated Road to Quant Obsidian folder.

This is a local, standard-library-only build step. It never writes to Obsidian,
does not call a paid translation/API service, and keeps the Markdown and YAML
source text as the English source of truth.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

APP = Path(__file__).resolve().parents[1]
DATA = APP / "data"
DEFAULT_VAULT_FOLDER = Path(r"D:\notes\vault_1\Road to Quant")
MAP_PATH = DATA / "translation-map.json"
CURRICULUM_PATH = DATA / "curriculum-vi.json"
RESOURCE_PATH = DATA / "resources.json"
OUTPUT_PATH = DATA / "notes.json"

WIKILINK_RE = re.compile(r"\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]")
MARKDOWN_LINK_RE = re.compile(r"(?<!!)\[([^\]]+)\]\(([^)]+)\)")
TASK_RE = re.compile(r"^(\s*(?:[-*+]\s+|\d+\.\s+)\[)([ xX])\](.*)$", re.MULTILINE)
DATE_H1_RE = re.compile(r"^(#{1,6}\s+\d{4}-\d{2}-\d{2}\s+—\s+)(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)(.*)$")
WEEK_H1_RE = re.compile(r"^(#{1,6}\s+)Week\s+(\d+):\s*(.+)$", re.I)
MONTH_H1_RE = re.compile(r"^(#{1,6}\s+)Month\s+(\d+):\s*(.+)$", re.I)
SECRET_PATTERNS = [
    re.compile(r"\bgh[pousr]_[A-Za-z0-9]{25,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{24,}\b"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"(?i)\b(?:api[_ -]?key|access[_ -]?token|client[_ -]?secret)\s*[:=]\s*['\"]?[A-Za-z0-9_./+=-]{20,}"),
]


def parse_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end < 0:
        return {}, text
    raw = text[4:end]
    meta: dict[str, Any] = {}
    for line in raw.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key, value = key.strip(), value.strip()
        if not key:
            continue
        parsed: Any = value
        if value:
            try:
                parsed = json.loads(value)
            except json.JSONDecodeError:
                if value.lower() in ("true", "false"):
                    parsed = value.lower() == "true"
                elif re.fullmatch(r"-?\d+", value):
                    parsed = int(value)
        meta[key] = parsed
    return meta, text[end + 5 :]


def note_kind(note_id: str) -> str:
    first = note_id.split("/", 1)[0]
    return {
        "Daily": "daily",
        "Projects": "project",
        "Resources": "resource",
        "Weeks": "week",
        "Months": "month",
    }.get(first, "note")


def read_translation_data() -> tuple[dict[str, Any], dict[str, Any]]:
    with MAP_PATH.open(encoding="utf-8") as f:
        source_map = json.load(f)
    if CURRICULUM_PATH.exists():
        with CURRICULUM_PATH.open(encoding="utf-8") as f:
            curriculum = json.load(f)
    else:
        curriculum = {"modules": []}
    return source_map, curriculum


def heading_title(body: str, fallback: str) -> str:
    for line in body.splitlines():
        match = re.match(r"^#\s+(.+?)\s*#*\s*$", line)
        if match:
            return match.group(1)
    return fallback


def translation_values(source_map: dict[str, Any], curriculum: dict[str, Any]) -> dict[str, str]:
    values = {str(k): str(v) for k, v in source_map.get("strings", {}).items()}
    for module in curriculum.get("modules", []):
        title = module.get("title", "")
        if title and module.get("titleVi"):
            values[str(title)] = str(module["titleVi"])
            values[str(title).lower()] = str(module["titleVi"]).lower()
    for i, translation in enumerate(source_map.get("months", []), 1):
        # The goal text itself is looked up from the original heading below.
        values[f"__MONTH_{i}__"] = translation
    return values


def map_citation_links(text: str, source_map: dict[str, Any]) -> str:
    aliases = source_map.get("aliases", {})
    def replace_wiki(match: re.Match[str]) -> str:
        target, anchor, alias = match.group(1), match.group(2), match.group(3)
        if alias is None:
            # The file name remains an identity; add a Vietnamese alias only where
            # the source gives a visible label and the note has a translated name.
            return match.group(0)
        shown = aliases.get(alias, alias)
        shown = re.sub(r"\bWeek\s+(\d+)\b", r"Tuần \1", shown)
        shown = re.sub(r"\bMonth\s+(\d+)\b", r"Tháng \1", shown)
        shown = re.sub(r"\b(\d{4}-\d{2}-\d{2}):\s*(rest|4-hour block)\b", lambda m: m.group(1) + ": " + aliases.get(m.group(2), m.group(2)), shown)
        suffix = ("#" + anchor) if anchor else ""
        return f"[[{target}{suffix}|{shown}]]"
    text = WIKILINK_RE.sub(replace_wiki, text)
    def replace_md(match: re.Match[str]) -> str:
        label, url = match.group(1), match.group(2)
        return f"[{aliases.get(label, label)}]({url})"
    return MARKDOWN_LINK_RE.sub(replace_md, text)


def translate_line(line: str, note_id: str, meta: dict[str, Any], source_map: dict[str, Any], curriculum: dict[str, Any], values: dict[str, str]) -> str:
    # Keep source-control-sensitive syntax intact while translating prose.
    task = TASK_RE.match(line)
    if task:
        task_text = task.group(3).strip()
        duration = re.match(r"(\*\*\d+\s+min\*\*\s+—\s+)(.*)", task_text)
        duration_prefix = duration.group(1) if duration else ""
        task_key = duration.group(2) if duration else task_text
        translated_task = source_map.get("tasks", {}).get(task_key)
        if translated_task:
            return task.group(1) + task.group(2) + "] " + duration_prefix + translated_task

    m = DATE_H1_RE.match(line)
    if m:
        weekday = source_map.get("aliases", {}).get(m.group(2), m.group(2))
        return m.group(1) + weekday + m.group(3)

    m = WEEK_H1_RE.match(line)
    if m:
        week = int(m.group(2))
        module = next((item for item in curriculum.get("modules", []) if int(item.get("week", 0)) == week), None)
        focus = module.get("titleVi") if module else values.get(m.group(3), m.group(3))
        return f"{m.group(1)}Tuần {week}: {focus or m.group(3)}"

    m = MONTH_H1_RE.match(line)
    if m:
        month = int(m.group(2))
        goals = source_map.get("months", [])
        goal = goals[month - 1] if 1 <= month <= len(goals) else values.get(m.group(3), m.group(3))
        return f"{m.group(1)}Tháng {month}: {goal}"

    week = int(meta.get("week", 0) or 0)
    module = next((item for item in curriculum.get("modules", []) if int(item.get("week", 0)) == week), None)
    if module:
        # The imported Markdown supplies the English clause; the versioned map
        # supplies its human translation. Replace only the matching objective
        # portion so all surrounding task details and Markdown stay intact.
        field_patterns = [
            ("study", "Read and work through this topic: ", ". Use "),
            ("derive", "Attempt independently: ", ". Show every mathematical step"),
            ("build", "Design this week's implementation: ", ". Specify inputs"),
            ("derive", "Finish and verify the derivation: ", ". Use one new example"),
            ("build", "Implement the first working version: ", ". Keep the numerical core"),
            ("build", "Complete and test: ", ". Add input validation"),
            ("experiment", "Prepare the experiment: ", ". Write expected outcomes"),
            ("experiment", "Run the planned experiment: ", ". Save all attempted"),
            ("evidence", "Produce one labeled table and one figure for ", "; include assumptions"),
            ("evidence", "Finish the weekly evidence: ", ". Explain the question"),
            ("study", "**Study:** ", "."),
            ("derive", "**Derive / solve:** ", "."),
            ("build", "**Build:** ", "."),
            ("experiment", "**Experiment:** ", "."),
            ("evidence", "**Evidence:** ", "."),
            ("evidence", "**Weekly deliverable:** ", "."),
        ]
        for key, prefix, suffix in field_patterns:
            translated = module.get(key + "Vi")
            if not translated or prefix not in line:
                continue
            before, tail = line.split(prefix, 1)
            if suffix == ".":
                # Do not stop at the dot in an artifact name such as `report.md`.
                end_match = re.search(r"\.(?=\s|$)", tail)
                end = end_match.start() if end_match else -1
            else:
                end = tail.find(suffix)
            if end >= 0:
                line = before + prefix + translated + tail[end:]
        # The title is repeated in daily review prompts and calendar objective links.
        title_en, title_vi = module.get("title", ""), module.get("titleVi", "")
        if title_en and title_vi:
            line = line.replace(title_en, title_vi)
            line = line.replace(title_en.lower(), title_vi.lower())
    focus = str(meta.get("focus", ""))
    if focus and module and module.get("titleVi"):
        line = line.replace(focus, str(module["titleVi"]))

    stripped = line.strip()
    if stripped in values:
        return line.replace(stripped, values[stripped], 1)

    # Translate resource-introduction verbs only before Obsidian links; broader
    # word replacements can damage technical phrases such as "work through".
    line = re.sub(r"\bUse (?=\[\[)", "Dùng ", line)

    # Titles from the 105-week source are also used in focus metadata and table cells.
    if curriculum.get("modules"):
        for module in sorted(curriculum["modules"], key=lambda item: len(item.get("title", "")), reverse=True):
            en = module.get("title", "")
            vi = module.get("titleVi", "")
            if en and vi and en in line:
                line = line.replace(en, vi)

    # Replace longer, explicitly translated course phrases first. These values
    # include all five unique weekly learning objectives when the map is complete.
    for en, vi in sorted(values.items(), key=lambda item: len(item[0]), reverse=True):
        if en.startswith("__") or not en or en == vi:
            continue
        line = line.replace(en, vi)

    # Fixed template language around the variable curriculum text.
    phrase_pairs = [
        ("Read and work through this topic:", "Đọc và học theo chủ đề này:"),
        ("Design this week's implementation:", "Thiết kế phần triển khai của tuần này:"),
        ("next week's", "của tuần tới"),
        ("next week", "tuần tới"),
        ("this week's", "của tuần này"),
        ("this week", "tuần này"),
        ("; write definitions and assumptions in your own words.", "; viết các định nghĩa và giả định bằng lời của bạn."),
        ("Attempt independently:", "Tự giải trước:"),
        ("Show every mathematical step before consulting a solution.", "Trình bày từng bước toán học trước khi xem lời giải."),
        ("Specify inputs, outputs, numerical units, and three edge cases.", "Nêu đầu vào, đầu ra, đơn vị số học và ba trường hợp biên."),
        ("Record three retrieval questions, one uncertainty, and the exact output file for", "Ghi ba câu hỏi tự nhớ lại, một điểm chưa chắc chắn và tên tệp đầu ra cụ thể cho"),
        ("Finish and verify the derivation:", "Hoàn tất và kiểm tra phép suy luận:"),
        ("Use one new example rather than copying the source.", "Dùng một ví dụ mới thay vì chép lại nguồn."),
        ("Implement the first working version:", "Triển khai phiên bản chạy được đầu tiên:"),
        ("Keep the numerical core independently understandable.", "Đảm bảo phần tính toán số cốt lõi có thể hiểu độc lập."),
        ("Add two meaningful checks against an analytical result, trusted library, or known synthetic ground truth. Record failures.", "Thêm hai phép kiểm tra có ý nghĩa bằng kết quả giải tích, thư viện đáng tin cậy hoặc đáp án tổng hợp đã biết. Ghi lại lỗi."),
        ("Commit or save a local checkpoint and write what remains unresolved; keep data and secrets outside version control.", "Tạo commit hoặc lưu mốc cục bộ và ghi điều còn chưa giải quyết; không đưa dữ liệu hay bí mật vào hệ thống quản lý phiên bản."),
        ("Practice ", "Luyện "),
        (" in C++: attempt one unfamiliar appropriately rated Codeforces problem, then upsolve one error. Cap the session at 60 minutes.", " bằng C++: thử một bài Codeforces mới có độ khó phù hợp, sau đó tự sửa một lỗi. Giới hạn buổi học trong 60 phút."),
        ("Complete and test:", "Hoàn thành và kiểm thử:"),
        ("Add input validation and a minimal documented command.", "Thêm kiểm tra đầu vào và một lệnh tối thiểu có hướng dẫn."),
        ("Prepare the experiment:", "Chuẩn bị thí nghiệm:"),
        ("Write expected outcomes, baselines, metrics, seeds, and permitted data before running it.", "Ghi kết quả dự kiến, phương pháp đối chứng, chỉ số, seed và dữ liệu được phép trước khi chạy."),
        ("Log the code version, configuration, and next Monday's experiment in the run registry.", "Ghi phiên bản mã nguồn, cấu hình và thí nghiệm thứ Hai tới vào sổ theo dõi lần chạy."),
        ("Run the planned experiment:", "Chạy thí nghiệm đã lên kế hoạch:"),
        ("Save all attempted configurations, including failures.", "Lưu mọi cấu hình đã thử, kể cả lần chạy thất bại."),
        ("Analyze baseline differences, uncertainty, and the strongest failure case; check timestamps and units before interpreting results.", "Phân tích chênh lệch giữa các phương pháp đối chứng, độ bất định và trường hợp thất bại rõ nhất; kiểm tra thời điểm và đơn vị trước khi diễn giải."),
        ("Produce one labeled table and one figure for", "Tạo một bảng có nhãn và một hình cho"),
        ("; include assumptions and reproducible commands.", "; nêu các giả định và lệnh có thể chạy lại."),
        ("Write the strongest defensible conclusion and one finding that challenges it.", "Viết kết luận vững chắc nhất có thể bảo vệ và một phát hiện thách thức kết luận đó."),
        ("Finish the weekly evidence:", "Hoàn tất minh chứng tuần:"),
        ("Explain the question, method, baseline, uncertainty, and limits.", "Giải thích câu hỏi, phương pháp, đối chứng, độ bất định và giới hạn."),
        ("Reproduce one central result and explain", "Tái tạo một kết quả cốt lõi và giải thích"),
        (" aloud without notes. Correct errors in the log.", " thành lời mà không xem ghi chú. Sửa lỗi trong nhật ký."),
        ("Complete the weekly review: record actual hours, unresolved foundations, reviewer feedback, and one scope adjustment. Set this note status to done only after its tasks are completed.", "Hoàn tất tổng kết tuần: ghi số giờ thực tế, kiến thức nền còn vướng, góp ý của người rà soát và một điều chỉnh phạm vi. Chỉ đặt trạng thái ghi chú này là done sau khi hoàn tất các việc."),
        ("Rest day: keep the four-hour study block free. Do not accumulate weekend make-up tasks.", "Ngày nghỉ: để trống khối học bốn giờ. Không dồn việc cần bù vào cuối tuần."),
    ]
    for en, vi in phrase_pairs:
        line = line.replace(en, vi)
    line = re.sub(
        r"\bweek (\d+)\b",
        lambda m: ("Tuần" if m.group(0)[0].isupper() else "tuần") + " " + m.group(1),
        line,
        flags=re.I,
    )
    line = re.sub(r"(\d{4}-\d{2}-\d{2}) through (\d{4}-\d{2}-\d{2})", r"\1 đến \2", line)
    line = line.replace("] through [[", "] đến [[")

    # Career blocks use a curated, versioned translation list selected by week.
    if "#career" in line and "CAREER_SLOT_" not in line:
        week = int(meta.get("week", 1) or 1)
        career_vi = source_map.get("careers", [])
        career_en = [
            "List five faculty/labs in probability, statistical ML, control, optimization, or time series; record research topics and official links.",
            "Read one recent paper from a shortlisted lab; write a 150-word account of a small contribution you could make.",
            "Prepare a factual one-page CV and a short project summary; request feedback from a lecturer or career adviser.",
            "Check official internship and competition pages; record current graduation-year, age, region, and team eligibility.",
            "Draft a specific faculty outreach message about a replication or experiment; send it yourself only when ready.",
            "Arrange feedback on your project from a lecturer, PhD student, mentor, or qualified peer; record the questions received.",
            "Practice a 30-minute probability or coding interview and review missed reasoning; use official employer guidance.",
            "Update your opportunity tracker with eligible RA, ML, research-engineering, and quant roles; avoid assuming postings remain open.",
            "Prepare a short competition strategy/postmortem or research presentation; record your own technical contribution.",
            "Explain your strongest project in five minutes, then answer questions about timing, uncertainty, baselines, and failure.",
            "Audit public project READMEs and profile links; replace vague skill claims with verified contributions and results.",
            "Discuss the next term with a mentor or qualified peer: choose one research question and remove one low-value activity.",
        ]
        n = (week - 1) % len(career_en)
        if n < len(career_vi):
            line = line.replace(career_en[n], career_vi[n])
    return map_citation_links(line, source_map)


def translate_body(note_id: str, body: str, meta: dict[str, Any], source_map: dict[str, Any], curriculum: dict[str, Any]) -> str:
    values = translation_values(source_map, curriculum)
    # Inject dated module metadata into daily notes so the web calendar can use it
    # directly for its Vietnamese title/tooltip, while leaving the English metadata.
    vi_body = "\n".join(translate_line(line, note_id, meta, source_map, curriculum, values) for line in body.split("\n"))
    if body.endswith("\n") and not vi_body.endswith("\n"):
        vi_body += "\n"
    return vi_body


def find_title_vi(note_id: str, title_en: str, body_vi: str, meta: dict[str, Any], source_map: dict[str, Any], curriculum: dict[str, Any]) -> str:
    if note_id.startswith("Daily/"):
        date = note_id.rsplit("/", 1)[-1]
        weekday = next((line.split(" — ", 1)[1] for line in body_vi.splitlines() if line.startswith("# " + date + " — ")), "")
        return f"{date} — {weekday}" if weekday else title_en
    return heading_title(body_vi, title_en)


def check_secret_text(note_id: str, text: str) -> None:
    for pattern in SECRET_PATTERNS:
        if pattern.search(text):
            raise ValueError(f"Potential credential detected in curated note {note_id}; remove it before publishing.")


def import_notes(vault_folder: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    if not vault_folder.is_dir():
        raise FileNotFoundError(f"Obsidian plan folder not found: {vault_folder}")
    source_map, curriculum = read_translation_data()
    notes: list[dict[str, Any]] = []
    seen: set[str] = set()
    md_files = sorted(vault_folder.rglob("*.md"), key=lambda p: p.relative_to(vault_folder).as_posix().casefold())
    for path in md_files:
        note_id = path.relative_to(vault_folder).with_suffix("").as_posix()
        if note_id in seen:
            raise ValueError(f"Duplicate note ID: {note_id}")
        seen.add(note_id)
        source = path.read_text(encoding="utf-8")
        check_secret_text(note_id, source)
        meta, body = parse_frontmatter(source)
        body = body.strip("\n")
        title = heading_title(body, path.stem)
        body_vi = translate_body(note_id, body, meta, source_map, curriculum)
        title_vi = find_title_vi(note_id, title, body_vi, meta, source_map, curriculum)
        if note_id.startswith("Daily/"):
            week = int(meta.get("week", 0) or 0)
            module = next((item for item in curriculum.get("modules", []) if int(item.get("week", 0)) == week), None)
            if module and module.get("titleVi"):
                meta["focusVi"] = module["titleVi"]
            else:
                meta["focusVi"] = title_vi
        notes.append({
            "id": note_id,
            "title": title,
            "titleVi": title_vi,
            "body": body,
            "bodyVi": body_vi,
            "kind": note_kind(note_id),
            "meta": meta,
        })

    validate_notes(notes)
    summary = {
        "source": str(vault_folder),
        "noteCount": len(notes),
        "kindCounts": {kind: sum(n["kind"] == kind for n in notes) for kind in ("daily", "project", "resource", "week", "month", "note")},
        "dailyTaskCount": sum(sum(1 for _ in TASK_RE.finditer(n["body"])) for n in notes if n["kind"] == "daily"),
        "dailyTaskMarkersPreserved": True,
        "wikiTargetsAndAnchorsPreserved": True,
        "externalMarkdownUrlsPreserved": True,
        "translationMapVersion": source_map.get("version"),
        "focusViCount": sum("focusVi" in n["meta"] for n in notes if n["kind"] == "daily"),
        "translatedVietnameseDailyTaskLines": sum(
            1 for n in notes if n["kind"] == "daily"
            for en, vi in zip(TASK_RE.findall(n["body"]), TASK_RE.findall(n["bodyVi"])) if en != vi
        ),
    }
    return notes, summary


def validate_notes(notes: list[dict[str, Any]]) -> None:
    ids = [note["id"] for note in notes]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate note IDs were generated.")
    for note in notes:
        en, vi = note["body"], note["bodyVi"]
        en_tasks, vi_tasks = TASK_RE.findall(en), TASK_RE.findall(vi)
        if [m[1] for m in en_tasks] != [m[1] for m in vi_tasks]:
            raise ValueError(f"Checkbox state/order changed while translating {note['id']}")
        en_wiki = [(m[1], m[2]) for m in WIKILINK_RE.finditer(en)]
        vi_wiki = [(m[1], m[2]) for m in WIKILINK_RE.finditer(vi)]
        if en_wiki != vi_wiki:
            raise ValueError(f"Wiki-link targets or heading anchors changed in {note['id']}")
        en_urls = [m[2] for m in MARKDOWN_LINK_RE.finditer(en)]
        vi_urls = [m[2] for m in MARKDOWN_LINK_RE.finditer(vi)]
        if en_urls != vi_urls:
            raise ValueError(f"Markdown URL changed while translating {note['id']}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vault-folder", type=Path, default=DEFAULT_VAULT_FOLDER)
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH)
    parser.add_argument("--summary", type=Path, default=DATA / "import-summary.json")
    parser.add_argument("--validate-only", action="store_true", help="Read and validate without writing JSON files.")
    args = parser.parse_args()

    notes, summary = import_notes(args.vault_folder)
    resources = json.loads(RESOURCE_PATH.read_text(encoding="utf-8"))
    if not isinstance(resources, list) or len({item["id"] for item in resources}) != len(resources):
        raise ValueError("Resource list must be an array with unique IDs.")
    if not args.validate_only:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(notes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        args.summary.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"content import failed: {exc}", file=sys.stderr)
        raise
