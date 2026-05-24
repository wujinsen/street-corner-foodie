import { ZINES, filterZinesByFlavor } from "./load-content";
import { findRegion } from "./countries";
import { lookupBundledDishMeta } from "./dish-meta-registry";
import { assertPublicUrl } from "./assert-path";
import { placeholderZinePageUrl } from "./zine-svg";

import type { CountryId, ZineDish } from "./types";



export { ZINES, filterZinesByFlavor };

export type { ZineDish };



export type ZineMode = "story" | "recipe";



const A_ZINE = "/asserts/mini-zine/";



export function getZines(countryId: CountryId, regionId: string): ZineDish[] {

  return ZINES[countryId]?.[regionId] ?? [];

}



export function findZine(

  countryId: CountryId,

  regionId: string,

  slug: string,

): ZineDish | undefined {

  return getZines(countryId, regionId).find((z) => z.slug === slug);

}

/** 与海报卡同源：posters.json / dish-meta 的 `pin`（例 海南·文昌） */
export function zinePinLabel(zine: ZineDish): string {
  const region = findRegion(zine.countryId, zine.regionId);
  const regionNameZh = region?.name.zh ?? zine.regionId;
  const meta = lookupBundledDishMeta(zine.countryId, zine.regionId, zine.slug, regionNameZh);
  if (meta?.pin) return meta.pin;
  return regionNameZh;
}



export function hasZine(countryId: CountryId, regionId: string, slug: string): boolean {

  return !!findZine(countryId, regionId, slug);

}



export function zineReaderPath(countryId: CountryId, regionId: string, slug: string): string {

  return `/${countryId}/${regionId}/zine/${slug}`;

}



export function zineHasNarrativeSpreads(zine: ZineDish): boolean {
  return (zine.narrativePages?.length ?? 0) > 0;
}

export function zinePageCount(zine: ZineDish, mode: ZineMode = "story"): number {
  if (zine.placeholder) return 4;
  if (mode === "recipe") return zine.recipeWith || zine.recipeNoChar ? 1 : 0;
  const narratives = zine.narrativePages?.length ?? 0;
  const hasStory = !!(zine.storyWith || zine.storyNoChar);
  return (hasStory ? 1 : 0) + narratives;
}

export interface ZineVariant {
  mode: ZineMode;
  noChar: boolean;
}

/** Story/recipe × with/no-char assets (one spread each). */
export function zineAvailableVariants(zine: ZineDish): ZineVariant[] {
  const out: ZineVariant[] = [];
  for (const mode of ["story", "recipe"] as const) {
    for (const noChar of [false, true]) {
      if (zineImageUrl(zine, mode, noChar, 0)) out.push({ mode, noChar });
    }
  }
  return out;
}

/**
 * Sidebar window in the same order as the region gallery grid (`getZines` / mini_zine list).
 * Starts at currentSlug when set; otherwise from the first item.
 */
export function getSidebarZines(
  allZines: ZineDish[],
  limit = 5,
  currentSlug?: string,
): ZineDish[] {
  if (!allZines.length) return [];
  const idx = currentSlug ? allZines.findIndex((z) => z.slug === currentSlug) : 0;
  const start = idx >= 0 ? idx : 0;
  return allZines.slice(start, start + limit);
}

/** @deprecated Use getSidebarZines — editorPick no longer drives sidebar order */
export function getRelatedZinesForSidebar(
  allZines: ZineDish[],
  currentSlug: string,
  _editorPick?: string[],
  limit = 5,
): ZineDish[] {
  return getSidebarZines(allZines, limit, currentSlug);
}



export function zineImageUrl(

  zine: ZineDish,

  mode: ZineMode,

  noChar: boolean,

  page: number,

): string | null {

  if (zine.placeholder) {

    return placeholderZinePageUrl(zine.slug, mode, page, zine.name.ja || zine.name.zh);

  }



  let file: string | null = null;

  if (mode === "recipe") {
    file = noChar
      ? zine.recipeNoChar ?? zine.recipeWith
      : zine.recipeWith ?? zine.recipeNoChar;
  } else if (page <= 0) {
    file = noChar
      ? zine.storyNoChar ?? zine.storyWith
      : zine.storyWith ?? zine.storyNoChar;
  } else {
    const narratives = zine.narrativePages ?? [];
    file = narratives[page - 1] ?? null;
  }



  if (!file) return null;

  return assertPublicUrl(A_ZINE, zine.path, file);

}

