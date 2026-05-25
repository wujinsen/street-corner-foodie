import { findRegion } from "./countries";
import { formatLandingGeoCoords } from "./landing-coords";
import { regionHeroImageUrl } from "./region-hero";
import { COUNTRY_FALLBACK, REGION_GEO } from "./street-geo";
import type { Lang, Multilang, CountryId } from "./types";
import { buildWorldAtlasPayload } from "./world-atlas-payload";

export interface LandingRegionSpot {
  /** `${countryId}__${regionId}` */
  regionKey: string;
  countryId: CountryId;
  regionId: string;
  city: Multilang;
  citySub: Multilang;
  coords: string;
  heroUrl: string | null;
}

/** Legacy city-card labels for default spotlight regions. */
const REGION_CITY_OVERRIDE: Record<string, Multilang> = {
  "cn__hainan": { zh: "海口", en: "HAIKOU", ja: "海口" },
  "jp__tokyo": { zh: "东京", en: "TOKYO", ja: "東京" },
  "us__ny": { zh: "纽约", en: "NEW YORK", ja: "ニューヨーク" },
};

const REGION_COORDS_OVERRIDE: Record<string, string> = {
  "cn__hainan": "20.02° N · 110.35° E",
  "jp__tokyo": "35.68° N · 139.69° E",
  "us__ny": "40.71° N · 74.01° W",
};

const REGION_EMPTY_SUB = new Set(["cn__hainan", "jp__tokyo", "us__ny"]);

/** Landing city card — one row per world-atlas region (cn 各省 · us/jp 多城等). */
export function buildLandingRegionSpots(lang: Lang): LandingRegionSpot[] {
  const payload = buildWorldAtlasPayload(lang);
  if (!payload) return [];

  const seen = new Set<string>();
  const spots: LandingRegionSpot[] = [];

  for (const row of payload.regions) {
    const regionKey = `${row.countryId}__${row.regionId}`;
    if (seen.has(regionKey)) continue;
    seen.add(regionKey);

    const region = findRegion(row.countryId, row.regionId);
    const geo =
      REGION_GEO[`${row.countryId}:${row.regionId}`]?.center ??
      COUNTRY_FALLBACK[row.countryId].center;

    spots.push({
      regionKey,
      countryId: row.countryId,
      regionId: row.regionId,
      city:
        REGION_CITY_OVERRIDE[regionKey] ??
        region?.name ?? {
          zh: row.name,
          en: row.name,
          ja: row.name,
        },
      citySub: REGION_EMPTY_SUB.has(regionKey)
        ? { zh: "", en: "", ja: "" }
        : (region?.tagline ?? { zh: "", en: "", ja: "" }),
      coords: REGION_COORDS_OVERRIDE[regionKey] ?? formatLandingGeoCoords(geo),
      heroUrl: region ? regionHeroImageUrl(row.countryId, region, "landing") : null,
    });
  }

  return spots;
}
