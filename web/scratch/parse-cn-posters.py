import re
from collections import Counter

html = open("dist/cn/g/hainan/index.html", encoding="utf-8").read()
pat = r'<a[^>]*href="(/cn/[^"]+/poster/[^"]+)"[^>]*>'
vis = []
for m in re.finditer(pat, html):
    tag = m.group(0)
    if "glass-poster" not in tag or "is-gallery-page-hidden" in tag:
        continue
    vis.append(m.group(1))
print("visible", len(vis), dict(Counter(h.split("/")[2] for h in vis)))
print("flat8", "country-poster-layout--flat-8" in html)
print("rail", "gallery-featured" in html)
idx = html.find("gallery-province-pills")
print("province chunk has 全部", "全部" in html[idx : idx + 800] if idx >= 0 else "n/a")
