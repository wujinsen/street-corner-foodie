import { REGIONS, getPosters, getRecipePosters } from "./load-content";
import type { CountryId, Lang, Poster } from "./types";

/** Default spotlight region per country (landing map + country page province default). */
export const COUNTRY_SPOTLIGHT: Record<CountryId, string> = {
  cn: "hainan",
  jp: "tokyo",
  us: "ny",
};

/** Resolve `?region=`; invalid/missing → spotlight (e.g. cn → hainan). */
export function resolveCountryRegionId(
  countryId: CountryId,
  regionParam: string | null,
): string {
  const spotlight = COUNTRY_SPOTLIGHT[countryId];
  if (regionParam) {
    const ok = REGIONS[countryId]?.some((r) => r.id === regionParam);
    if (ok) return regionParam;
  }
  return spotlight;
}

/** All posters in a country (flat, region-registry order — not for country landing grid). */
export function getCountryPosters(countryId: CountryId): Poster[] {
  const out: Poster[] = [];
  for (const r of REGIONS[countryId] ?? []) {
    out.push(...getPosters(countryId, r.id));
  }
  return out;
}

/**
 * One poster per province (legacy / tests). Country overview uses `?region=` + `getPosters` instead.
 */
export function getOnePosterPerRegion(countryId: CountryId): Poster[] {
  const out: Poster[] = [];
  for (const regionId of regionOrderForCountryMix(countryId)) {
    const first = getRecipePosters(countryId, regionId)[0];
    if (first) out.push(first);
  }
  return out;
}

/** Spotlight province first, then registry order (cn → hainan leads the round-robin). */
export function regionOrderForCountryMix(countryId: CountryId): string[] {
  const spotlight = COUNTRY_SPOTLIGHT[countryId];
  const ids = (REGIONS[countryId] ?? []).map((r) => r.id);
  return [spotlight, ...ids.filter((id) => id !== spotlight)];
}

/** Round-robin across provinces · theme-cn national grid (`/cn/`). */
export function interleavePostersByRegion(
  posters: Poster[],
  countryId: CountryId,
): Poster[] {
  const regionOrder = regionOrderForCountryMix(countryId);
  const byRegion = new Map<string, Poster[]>();
  for (const p of posters) {
    const list = byRegion.get(p.regionId) ?? [];
    list.push(p);
    byRegion.set(p.regionId, list);
  }
  const queues = regionOrder
    .map((id) => byRegion.get(id) ?? [])
    .filter((q) => q.length > 0);
  const out: Poster[] = [];
  for (let round = 0; ; round++) {
    let added = false;
    for (const q of queues) {
      if (round < q.length) {
        out.push(q[round]!);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}

function promotePosterFirst(posters: Poster[], poster?: Poster): Poster[] {
  if (!poster) return posters;
  const i = posters.findIndex(
    (p) => p.slug === poster.slug && p.regionId === poster.regionId,
  );
  if (i <= 0) return posters;
  const out = [...posters];
  out.splice(i, 1);
  out.unshift(poster);
  return out;
}

/**
 * Country landing (`theme-cn`): interleave provinces when no `?region=` filter.
 * Keeps regional sort inside each province; promotes spotlight editor-pick to tile 0.
 */
export function orderCountryPostersForGallery(
  posters: Poster[],
  countryId: CountryId,
  regionFilter?: string | null,
  featured?: Poster,
): Poster[] {
  if (regionFilter || posters.length <= 1) return posters;
  const pick = featured ?? pickCountryFeatured(posters, countryId);
  return promotePosterFirst(interleavePostersByRegion(posters, countryId), pick);
}

/** Unique flavor chips across regions. */
export function getCountryFlavors(countryId: CountryId, lang: Lang): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const r of REGIONS[countryId] ?? []) {
    for (const f of r.flavors[lang] ?? r.flavors.zh) {
      if (!seen.has(f)) {
        seen.add(f);
        list.push(f);
      }
    }
  }
  return list;
}

export function filterPostersByRegion(
  posters: Poster[],
  regionId: string | null | undefined,
): Poster[] {
  if (!regionId) return posters;
  return posters.filter((p) => p.regionId === regionId);
}

/** Editor-pick poster for country rail / featured tile (spotlight region first). */
export function pickCountryFeatured(
  posters: Poster[],
  countryId: CountryId,
): Poster | undefined {
  const recipe = posters.filter((p) => !p.fromZine);
  const spotlightId = COUNTRY_SPOTLIGHT[countryId];
  const spotlight = REGIONS[countryId]?.find((r) => r.id === spotlightId);
  const spotlightSlug = spotlight?.editorPick?.[0];
  if (spotlightSlug) {
    const hit = recipe.find(
      (p) => p.slug === spotlightSlug && p.regionId === spotlightId,
    );
    if (hit) return hit;
  }
  for (const r of REGIONS[countryId] ?? []) {
    const slug = r.editorPick?.[0];
    if (!slug) continue;
    const hit = recipe.find((p) => p.slug === slug && p.regionId === r.id);
    if (hit) return hit;
  }
  return recipe[0];
}
