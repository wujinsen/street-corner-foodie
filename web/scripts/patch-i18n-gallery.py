# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "src/lib/i18n.ts"
text = p.read_text(encoding="utf-8")

if "gallery:" in text and "featured_title" not in text:
    gallery = """
  gallery: {
    breadcrumb_posters: { zh: "海报", en: "POSTERS", ja: "ポスター" },
    dishes: { zh: "道菜", en: "DISHES", ja: "料理" },
    streets_count: { zh: "条街景", en: "STREETS", ja: "街角" },
    zines_count: { zh: "册", en: "BOOKS", ja: "冊" },
    filter_country: { zh: "国家", en: "Country", ja: "国" },
    filter_province: { zh: "省份", en: "Province", ja: "地域" },
    with_chef: { zh: "有人物", en: "With Chef", ja: "シェフあり" },
    no_char_short: { zh: "无人物", en: "No Char", ja: "人物なし" },
    linked_street: { zh: "关联街景", en: "Linked street", ja: "関連する街角" },
    save: { zh: "收藏", en: "Save", ja: "保存" },
    items: { zh: "项", en: "ITEMS", ja: "件" },
    regions_title: { zh: "省 / 都府 / 州", en: "Regions", ja: "地域" },
    tropical: { zh: "热带", en: "Tropical", ja: "熱帯" },
  },
"""
    text = text.replace("} as const;", gallery + "} as const;", 1)
    p.write_text(text, encoding="utf-8")
    print("patched gallery keys")
elif "gallery:" in text:
    print("gallery already exists")
else:
    print("unexpected i18n structure")
