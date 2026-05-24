import type { RegionFrontmatter, WebPosterMeta } from "./content-schema";
import { lookupBundledDishMeta } from "./dish-meta-registry";
import type { CountryId, Multilang, Poster } from "./types";

export type { WebPosterMeta } from "./content-schema";

export interface PosterMeta {
  name: Multilang;
  tags: { zh: string[]; en: string[]; ja: string[] };
  pin: string;
  desc: Multilang;
  romaji?: string;
}

export function metaKey(countryId: CountryId, regionId: string, slug: string): string {
  return `${countryId}/${regionId}/${slug}`;
}

function isSlugMap(
  wp: Record<string, WebPosterMeta | Record<string, WebPosterMeta>>,
): wp is Record<string, WebPosterMeta> {
  for (const v of Object.values(wp)) {
    if (v && typeof v === "object" && "name" in v) return true;
  }
  return false;
}

/** Resolve `web_posters` for a region (flat or usa-style nested). */
export function resolveWebPosters(
  fm: RegionFrontmatter | undefined,
  regionId: string,
): Record<string, WebPosterMeta> | undefined {
  const wp = fm?.web_posters;
  if (!wp || !Object.keys(wp).length) return undefined;
  if (isSlugMap(wp)) return wp;
  const nested = wp[regionId];
  if (nested && typeof nested === "object" && !("name" in nested)) {
    return nested as Record<string, WebPosterMeta>;
  }
  return undefined;
}

export function lookupPosterMeta(
  fm: RegionFrontmatter | undefined,
  _countryId: CountryId,
  regionId: string,
  slug: string,
  regionNameZh: string,
): PosterMeta {
  const map = resolveWebPosters(fm, regionId);
  if (map?.[slug]) return map[slug];

  const alt = slug.replace(/^cn_[a-z]+_/, "");
  if (alt !== slug && map?.[alt]) return map[alt]!;

  const bundled = lookupBundledDishMeta(_countryId, regionId, slug, regionNameZh);
  if (bundled) return bundled;

  const label = slug.replace(/_/g, " ");
  const en = label
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    name: { zh: label, en, ja: label },
    tags: { zh: [], en: [], ja: [] },
    pin: regionNameZh,
    desc: { zh: "", en: "", ja: "" },
  };
}

export function applyMeta(
  partial: Omit<Poster, "name" | "tags" | "pin" | "desc" | "romaji">,
  meta: PosterMeta,
): Poster {
  const { romaji, ...rest } = meta;
  return { ...partial, ...rest, ...(romaji ? { romaji } : {}) };
}
