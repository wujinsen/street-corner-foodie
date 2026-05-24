# -*- coding: utf-8 -*-
import json
from pathlib import Path

STREETS = json.loads((Path(__file__).parent / "streets.json").read_text(encoding="utf-8"))
OUT = Path(__file__).parent.parent / "src" / "lib" / "streets.ts"

POSTER_SLUGS: dict[str, dict[str, dict[str, list[str]]]] = {
    "cn": {
        "hainan": {
            "qilou": ["qingbuliang", "yezi_ji", "laobacha"],
            "fucheng": ["wenchang_jifan", "lingshui_suanfen"],
            "laobacha": ["laobacha", "qingbuliang"],
            "bay": ["yezi_ji", "qingbuliang"],
            "jiari_haitan": ["yezi_ji", "qingbuliang"],
            "wanlv": ["qingbuliang"],
        },
        "hebei": {
            "zhengding": ["cn_hebei_bannianmian"],
            "bannianmian": ["cn_hebei_bannianmian"],
        },
    },
    "jp": {
        "tokyo": {
            "shinjuku": ["ramen"],
            "shibuya": ["sushi"],
            "asakusa": ["tempura"],
            "tsukiji": ["sushi"],
        },
    },
}

POSTER_STREET_SCENE = {
    "cn": {
        "hainan": {
            "wenchang_jifan": "fucheng",
            "qingbuliang": "qilou",
            "yezi_ji": "qilou",
            "laobacha": "laobacha",
            "lingshui_suanfen": "fucheng",
        },
    },
    "jp": {
        "tokyo": {
            "ramen": "shinjuku",
            "sushi": "tsukiji",
            "tempura": "asakusa",
            "takoyaki": "shibuya",
        },
    },
}


def j(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def fmt_ml(d: dict) -> str:
    return f'{{ zh: {j(d["zh"])}, en: {j(d["en"])}, ja: {j(d["ja"])} }}'


regions_lines = []
for country, regs in STREETS.items():
    reg_parts = []
    for region, cfg in regs.items():
        scene_parts = []
        for sc in cfg["scenes"]:
            slugs = POSTER_SLUGS.get(country, {}).get(region, {}).get(sc["id"])
            slug_line = f', posterSlugs: {json.dumps(slugs, ensure_ascii=False)}' if slugs else ""
            scene_parts.append(
                f'        {{ id: {j(sc["id"])}, name: {fmt_ml(sc["name"])}, tag: {fmt_ml(sc["tag"])}{slug_line} }},'
            )
        if region == "hainan":
            fp_src = '(id) => `haikou_${id}_{TIME}_{FRAME}.png`'
        elif region == "hebei":
            fp_src = '(id) => `cn_hebei_shijiazhuang_${id}_{TIME}_{FRAME}.png`'
        elif region == "tokyo":
            fp_src = '(id) => `tokyo_${id}_{TIME}_{FRAME}.png`'
        elif region == "fuji":
            fp_src = '(id) => `jp_fuji_${id}_{TIME}_{FRAME}.png`'
        elif region in ("zhejiang", "ny", "tx", "la"):
            fp_src = "() => ''"
        reg_parts.append(
            f"    {region}: {{\n"
            f'      path: {j(cfg["path"])},\n'
            f"      scenes: [\n"
            + "\n".join(scene_parts)
            + f"\n      ],\n"
            f"      filePattern: {fp_src},\n"
            f"    }},"
        )
    regions_lines.append(f"  {country}: {{\n" + "\n".join(reg_parts) + "\n  },")

pss_lines = []
for country, regs in POSTER_STREET_SCENE.items():
    inner = []
    for region, mapping in regs.items():
        pairs = ", ".join(f'{k}: {j(v)}' for k, v in mapping.items())
        inner.append(f"    {region}: {{ {pairs} }},")
    pss_lines.append(f"  {country}: {{\n" + "\n".join(inner) + "\n  },")

OUT.write_text(
    """import type { CountryId, Multilang } from "./types";

export type StreetTime = "day" | "night";
export type StreetFrame = "wide" | "standard";

export interface StreetScene {
  id: string;
  name: Multilang;
  tag: Multilang;
  posterSlugs?: string[];
}

export interface StreetRegionConfig {
  path: string;
  scenes: StreetScene[];
  filePattern: (sceneId: string) => string;
}

const A_STREET = "/asserts/Street View/";

export const STREET_REGIONS: Partial<Record<CountryId, Record<string, StreetRegionConfig>>> = {
"""
    + "\n".join(regions_lines)
    + """
};

export const POSTER_STREET_SCENE: Partial<Record<CountryId, Record<string, Record<string, string>>>> = {
"""
    + "\n".join(pss_lines)
    + """
};

export function getStreetConfig(countryId: CountryId, regionId: string): StreetRegionConfig | undefined {
  return STREET_REGIONS[countryId]?.[regionId];
}

export function getStreetScenes(countryId: CountryId, regionId: string): StreetScene[] {
  return getStreetConfig(countryId, regionId)?.scenes ?? [];
}

export function findStreetScene(
  countryId: CountryId,
  regionId: string,
  sceneId: string,
): StreetScene | undefined {
  return getStreetScenes(countryId, regionId).find((s) => s.id === sceneId);
}

export function streetImageUrl(
  config: StreetRegionConfig,
  sceneId: string,
  time: StreetTime,
  frame: StreetFrame,
): string | null {
  if (!config.path) return null;
  const pattern = config
    .filePattern(sceneId)
    .replace("{TIME}", time)
    .replace("{FRAME}", frame);
  if (!pattern) return null;
  return A_STREET + encodeURI(config.path + pattern);
}

export function posterLinkedScene(
  countryId: CountryId,
  regionId: string,
  posterSlug: string,
): StreetScene | undefined {
  const map = POSTER_STREET_SCENE[countryId]?.[regionId];
  const sceneId = map?.[posterSlug];
  if (sceneId) return findStreetScene(countryId, regionId, sceneId);
  return getStreetScenes(countryId, regionId)[0];
}

export function parseStreetQuery(url: URL): { time: StreetTime; frame: StreetFrame } {
  const time = url.searchParams.get("time") === "night" ? "night" : "day";
  const frame = url.searchParams.get("frame") === "standard" ? "standard" : "wide";
  return { time, frame };
}

export function streetQueryHref(
  basePath: string,
  url: URL,
  patch: Partial<{ time: StreetTime; frame: StreetFrame }>,
): string {
  const current = parseStreetQuery(url);
  const time = patch.time ?? current.time;
  const frame = patch.frame ?? current.frame;
  const params = new URLSearchParams(url.searchParams);
  params.delete("lang");
  if (time === "day") params.delete("time");
  else params.set("time", time);
  if (frame === "wide") params.delete("frame");
  else params.set("frame", frame);
  const qs = params.toString();
  return basePath + (qs ? `?${qs}` : "");
}
""",
    encoding="utf-8",
    newline="\n",
)
print("wrote streets.ts")
