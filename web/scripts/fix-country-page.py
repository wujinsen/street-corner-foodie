# -*- coding: utf-8 -*-
import re
from pathlib import Path

p = Path(__file__).resolve().parent.parent / "src/views/CountryPage.astro"
t = p.read_text(encoding="utf-8")

t = re.sub(
    r'\{country === "cn" && \(lang === "zh" \? "[^"]* : lang === "en"',
    '{country === "cn" && (lang === "zh" ? "从骑楼到夜市，从江南到塞北的味道。" : lang === "en"',
    t,
    count=1,
)
t = re.sub(
    r': "騎楼から夜市まで、江南から塞北の味[^"]*\)\}',
    ': "騎楼から夜市まで、江南から塞北の味わい。")}',
    t,
    count=1,
)
t = re.sub(
    r'\{country === "jp" && \(lang === "zh" \? "[^"]* : lang === "en"',
    '{country === "jp" && (lang === "zh" ? "霓虹与暖簾交织的城市味觉。" : lang === "en"',
    t,
    count=1,
)
t = re.sub(
    r': "ネオンと暖簾の街角[^"]*\)\}',
    ': "ネオンと暖簾の街角の味。")}',
    t,
    count=1,
)
t = re.sub(
    r'\{country === "us" && \(lang === "zh" \? "[^"]* : lang === "en"',
    '{country === "us" && (lang === "zh" ? "Diner、BBQ、Cajun，公路与街角。" : lang === "en"',
    t,
    count=1,
)
t = re.sub(
    r': "ダイナー、BBQ、ケイジャン[^"]*\)\}',
    ': "ダイナー、BBQ、ケイジャンのハイウェイと街角。")}',
    t,
    count=1,
)
t = re.sub(
    r'\{lang === "zh" \? "[^"]* : lang === "en" \? "Regions"',
    '{lang === "zh" ? "省 / 都府 / 州" : lang === "en" ? "Regions"',
    t,
    count=1,
)

p.write_text(t, encoding="utf-8")
print("fixed CountryPage.astro")
