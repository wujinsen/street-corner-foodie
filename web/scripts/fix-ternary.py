import re
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent / "src"
pat = re.compile(r'("(?:[^"\\]|\\.)*")\s+"\s+("(?:[^"\\]|\\.)*")')

for p in root.rglob("*"):
    if p.suffix not in (".ts", ".astro"):
        continue
    t = p.read_text(encoding="utf-8", errors="replace")
    t2 = pat.sub(r"\1 ? \2", t)
    if t2 != t:
        p.write_text(t2, encoding="utf-8")
        print("fixed", p)
