# -*- coding: utf-8 -*-
"""Regenerate region-registry.ts from regions.json + binding metadata."""
import json
from pathlib import Path

REGIONS = json.loads((Path(__file__).parent / "regions.json").read_text(encoding="utf-8"))
OUT = Path(__file__).parent.parent / "src/lib/region-registry.ts"

BINDINGS = [
    ("china/hainan.md", "cn", "hainan", {}),
    ("china/shijiazhuang.md", "cn", "hebei", {}),
    ("china/zhejiang.md", "cn", "zhejiang", {}),
    (
        "world/japan.md",
        "jp",
        "tokyo",
        {
            "streetPathOverride": "jp/tokyo/",
            "placeholderSlugs": ["sushi", "tempura", "tonkatsu", "takoyaki", "gyudon", "curry", "monja"],
        },
    ),
    (
        "world/japan.md",
        "jp",
        "fuji",
        {
            "useFujiStreets": True,
            "streetPathOverride": "jp/fuji/",
            "posterFilter": "() => false",
        },
    ),
    (
        "world/usa.md",
        "us",
        "ny",
        {
            "posterFilter": """(e) =>
      e.includes("ny_") ||
      e.includes("cheeseburger") ||
      e.includes("hot_dog") ||
      e.includes("pretzel") ||
      (!e.includes("us/tx") && !e.includes("us_tx") && !e.includes("three_sisters"))""",
            "streetFilter": '(e) => e.includes("us_nyc_")',
            "streetPathOverride": "us/nyc/",
        },
    ),
    (
        "world/usa.md",
        "us",
        "tx",
        {
            "posterFilter": '(e) => e.includes("tx") || e.includes("bbq") || e.includes("brisket")',
            "streetFilter": '(e) => e.includes("us_tx_")',
            "streetPathOverride": "us/tx/",
        },
    ),
    (
        "world/usa.md",
        "us",
        "la",
        {
            "posterFilter": '(e) => e.includes("us/la") || e.includes("us_la")',
            "streetFilter": '(e) => e.includes("us_la_")',
            "streetPathOverride": "us/la/",
        },
    ),
]


def j(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def find_region(country: str, region_id: str) -> dict:
    for r in REGIONS[country]:
        if r["id"] == region_id:
            return r
    raise KeyError(f"{country}/{region_id}")


def fmt_ml(d: dict) -> str:
    return f'{{ zh: {j(d["zh"])}, en: {j(d["en"])}, ja: {j(d["ja"])} }}'


def fmt_flavors(d: dict) -> str:
    return (
        "{\n"
        f'      zh: {json.dumps(d["zh"], ensure_ascii=False)},\n'
        f'      en: {json.dumps(d["en"], ensure_ascii=False)},\n'
        f'      ja: {json.dumps(d["ja"], ensure_ascii=False)},\n'
        "    }"
    )


blocks = []
for doc_suffix, country, region_id, extra in BINDINGS:
    r = find_region(country, region_id)
    lines = [
        "  {",
        f'    docSuffix: {j(doc_suffix)},',
        f'    countryId: {j(country)},',
        f'    regionId: {j(region_id)},',
        f"    name: {fmt_ml(r['name'])},",
        "    tagline: {",
        f"      zh: {j(r['tagline']['zh'])},",
        f"      en: {j(r['tagline']['en'])},",
        f"      ja: {j(r['tagline']['ja'])},",
        "    },",
        f"    flavors: {fmt_flavors(r['flavors'])},",
    ]
    if "streetPathOverride" in extra:
        lines.append(f'    streetPathOverride: {j(extra["streetPathOverride"])},')
    if "placeholderSlugs" in extra:
        sl = json.dumps(extra["placeholderSlugs"], ensure_ascii=False)
        lines.append(f"    placeholderSlugs: {sl},")
    if extra.get("useFujiStreets"):
        lines.append("    useFujiStreets: true,")
    if "posterFilter" in extra:
        lines.append(f"    posterFilter: {extra['posterFilter']},")
    if "streetFilter" in extra:
        lines.append(f"    streetFilter: {extra['streetFilter']},")
    lines.append("  },")
    blocks.append("\n".join(lines))

OUT.write_text(
    """import type { CountryId, Multilang } from "./types";

export interface RegionBinding {
  docSuffix: string;
  countryId: CountryId;
  regionId: string;
  name: Multilang;
  tagline: Multilang;
  flavors?: { zh: string[]; en: string[]; ja: string[] };
  posterFilter?: (entry: string) => boolean;
  streetFilter?: (entry: string) => boolean;
  useFujiStreets?: boolean;
  streetPathOverride?: string;
  placeholderSlugs?: string[];
}

export const REGION_BINDINGS: RegionBinding[] = [
"""
    + "\n".join(blocks)
    + """
];
""",
    encoding="utf-8",
    newline="\n",
)
print("wrote region-registry.ts")
