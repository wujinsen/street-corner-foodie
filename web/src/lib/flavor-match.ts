import type { Lang } from "./i18n";
import type { Poster } from "./types";

const REGION_RADAR_HIT = 88;
const REGION_RADAR_MISS = 28;
const REGION_RADAR_EMPTY = 40;

/** Match a dish tag string against a flavor chip label (zh/en/ja). */
export function tagMatchesFlavor(tag: string, flavor: string): boolean {
  if (tag === flavor || tag.includes(flavor) || flavor.includes(tag)) return true;

  if ((flavor === "椰香" || flavor === "Coconut") && /椰|coco/i.test(tag)) return true;

  if ((flavor === "清甜" || flavor === "Sweet") && /甜|sweet|甘/i.test(tag)) return true;

  if ((flavor === "酸辣" || flavor === "Sour-spicy") && /酸|辣|sour|spicy/i.test(tag)) return true;

  if ((flavor === "海鲜" || flavor === "Seafood") && /海|sea/i.test(tag)) return true;

  return false;
}

export function collectFlavorTags(
  tags: { zh: string[]; en: string[]; ja: string[] },
  lang: Lang,
): string[] {
  const merged = [...(tags[lang] ?? []), ...tags.zh, ...tags.en, ...tags.ja];
  return [...new Set(merged.filter(Boolean))];
}

export function matchesFlavorChip(
  tags: { zh: string[]; en: string[]; ja: string[] },
  lang: Lang,
  flavor: string | null,
): boolean {
  if (!flavor) return true;
  return collectFlavorTags(tags, lang).some((t) => tagMatchesFlavor(t, flavor));
}

/** Serialize for `data-filter-tags` on gallery cards. */
export function filterTagsAttr(
  tags: { zh: string[]; en: string[]; ja: string[] },
  lang: Lang,
): string {
  return collectFlavorTags(tags, lang).join("|");
}

/** Landing bento radar — aggregate region flavor axes across recipe posters (0–100). */
export function buildRegionFlavorRadarScores(
  posters: Poster[],
  flavorLabels: string[],
  lang: Lang,
): number[] {
  if (!flavorLabels.length) return [];

  const pool = posters.filter((p) => !p.fromZine);
  if (!pool.length) return flavorLabels.map(() => REGION_RADAR_EMPTY);

  return flavorLabels.map((label) => {
    let hits = 0;
    for (const poster of pool) {
      const tags = collectFlavorTags(poster.tags, lang);
      if (tags.some((tag) => tagMatchesFlavor(tag, label))) hits += 1;
    }
    if (hits === 0) return REGION_RADAR_MISS;
    if (hits === pool.length) return REGION_RADAR_HIT;
    const ratio = hits / pool.length;
    return Math.round(REGION_RADAR_MISS + ratio * (REGION_RADAR_HIT - REGION_RADAR_MISS));
  });
}
