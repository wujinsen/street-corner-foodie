import pathlib

WRONG_END = "</" + "mo" + "tion" + ">"
RIGHT_END = "</" + "di" + "v" + ">"
WRONG_START = "<" + "mo" + "tion" + " "
RIGHT_START = "<" + "di" + "v" + " "

root = pathlib.Path(__file__).resolve().parent.parent
for p in root.rglob("*"):
    if p.suffix not in (".ts", ".astro"):
        continue
    try:
        t = p.read_text(encoding="utf-8")
    except Exception:
        continue
    if WRONG_END not in t and WRONG_START not in t:
        continue
    t2 = t.replace(WRONG_END, RIGHT_END).replace(WRONG_START, RIGHT_START)
    p.write_text(t2, encoding="utf-8")
    print("fixed", p.relative_to(root))
