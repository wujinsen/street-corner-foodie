"""Fix ?? corrupted to ?" " or ?" # patterns."""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent / "src"

REPLACEMENTS = [
    (re.compile(r'\?\s+"\s+'), '?? "'),
    (re.compile(r'\?\s*""\s*\+'), '?"?"+'),
    (re.compile(r'/甜\|sweet\|\?i\.test'), '/甜|sweet|甘/i.test'),
    (re.compile(r'/甜\|sweet\|.\?i\.test'), '/甜|sweet|甘/i.test'),
]

for path in sorted(ROOT.rglob("*")):
    if path.suffix not in (".ts", ".astro"):
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    orig = text
    for pat, rep in REPLACEMENTS:
        text = pat.sub(rep, text)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print("fixed", path.relative_to(ROOT.parent))
