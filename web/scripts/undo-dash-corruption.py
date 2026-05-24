"""Undo repair-utf8.py: em-dash was wrongly substituted for ? / ?? / ?:"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent / "src"

# Ternary broken to:  cond " "then" : else  (fix-ternary partial)
TERNARY_BROKEN = re.compile(
    r'(\))\s+"\s+("(?:[^"\\]|\\.)*")',
)


def undo(text: str) -> str:
    text = text.replace("\u2014\u2014", "??")  # —— → ??
    text = text.replace("\u2014:", "?:")  # optional props / ternary
    text = text.replace("\u2014", "?")  # remaining — → ?
    text = text.replace("/甜|sweet|?i.test", "/甜|sweet|甘/i.test")
    text = text.replace("/甜|sweet|\u2014i.test", "/甜|sweet|甘/i.test")
    text = TERNARY_BROKEN.sub(r"\1 ? \2", text)
    return text


for path in sorted(ROOT.rglob("*")):
    if path.suffix not in (".ts", ".astro"):
        continue
    raw = path.read_bytes()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("utf-8", errors="replace")
    fixed = undo(text)
    if fixed != text:
        path.write_text(fixed, encoding="utf-8")
        print("undid", path.relative_to(ROOT.parent))
