import { formatLandingGeoCoords } from "./landing-coords";
import { regionHeroImageUrl, regionLandingStreetSceneId } from "./region-hero";
import { findRegion, REGIONS } from "./load-content";
import { localePath, regionGalleryHref, streetGalleryHref } from "./locale-path";
import { DESIGN_MAP_PINS } from "./design-map-pins";
import { COUNTRY_FALLBACK, REGION_GEO } from "./street-geo";
import { buildWorldAtlasPayload } from "./world-atlas-payload";
import type { CountryId, Lang, Multilang } from "./types";

export type LandingMapSpotId = CountryId;

export interface LandingMapSpot {
  id: LandingMapSpotId;
  regionId: string;
  pin: { x: number; y: number };
  city: Multilang;
  citySub: Multilang;
  coords: string;
  heroUrl: string | null;
  /** 首页地图 pin 单击 → 默认街景详情 */
  streetHref: string;
  countryHref: string;
  regionHref: string;
  statsLine: string;
  /** Total posters in country (map pin badge, light/landing.png). */
  pinCount: number;
}

/** Default spotlight region per country on the landing map. */
const SPOT_REGION: Partial<Record<CountryId, string>> = {
  cn: "hainan",
  jp: "tokyo",
  us: "ny",
  fr: "paris",
  uk: "london",
  de: "cologne",
  za: "south_africa",
  nz: "nz",
  antarctica: "antarctica",
};

/** Legacy city-card labels (cn/jp/us design brief). */
const CITY_OVERRIDE: Partial<Record<CountryId, Multilang>> = {
  cn: { zh: "海口", en: "HAIKOU", ja: "海口" },
  jp: { zh: "东京", en: "TOKYO", ja: "東京" },
  us: { zh: "纽约", en: "NEW YORK", ja: "ニューヨーク" },
};

const COORDS_OVERRIDE: Partial<Record<CountryId, string>> = {
  cn: "20.02° N · 110.35° E",
  jp: "35.68° N · 139.69° E",
  us: "40.71° N · 74.01° W",
};

const LEGACY_EMPTY_SUB = new Set<CountryId>(["cn", "jp", "us"]);

export const LANDING_MAP_DEFAULT: LandingMapSpotId = "cn";

function resolveSpotRegion(countryId: CountryId, payload: NonNullable<ReturnType<typeof buildWorldAtlasPayload>>): string | null {
  const preferred = SPOT_REGION[countryId];
  if (preferred && payload.regions.some((r) => r.countryId === countryId && r.regionId === preferred)) {
    return preferred;
  }
  return payload.regions.find((r) => r.countryId === countryId)?.regionId ?? null;
}

export function buildLandingMapSpots(lang: Lang): LandingMapSpot[] {
  const payload = buildWorldAtlasPayload(lang);
  if (!payload) return [];

  return payload.countries.map((country) => {
    const id = country.id;
    const regionId = resolveSpotRegion(id, payload);
    if (!regionId) return null;

    const region = findRegion(id, regionId) ?? REGIONS[id]?.find((r) => r.id === regionId);
    const stats = region?.stats;
    const statsLine = stats ? `${stats.poster} · ${stats.street} · ${stats.zine}` : "";

    const pinCount = REGIONS[id]?.reduce((sum, r) => sum + r.stats.poster, 0) ?? country.sceneCount;
    const streetSceneId = region ? regionLandingStreetSceneId(id, region) : null;
    const streetHref = streetSceneId
      ? streetGalleryHref(lang, id, regionId, streetSceneId)
      : region
        ? regionGalleryHref(lang, id, regionId)
        : localePath(lang, `/${id}/`);

    const geo =
      REGION_GEO[`${id}:${regionId}`]?.center ?? COUNTRY_FALLBACK[id].center;
    const city =
      CITY_OVERRIDE[id] ??
      region?.name ?? {
        zh: country.name,
        en: country.name,
        ja: country.name,
      };
    const citySub = LEGACY_EMPTY_SUB.has(id)
      ? { zh: "", en: "", ja: "" }
      : (region?.tagline ?? { zh: "", en: "", ja: "" });
    const coords = COORDS_OVERRIDE[id] ?? formatLandingGeoCoords(geo);
    const heroUrl = region ? regionHeroImageUrl(id, region, "landing") : null;

    return {
      id,
      regionId,
      pin: DESIGN_MAP_PINS[id],
      city,
      citySub,
      coords,
      heroUrl,
      streetHref,
      countryHref: localePath(lang, `/${id}/`),
      regionHref: region ? regionGalleryHref(lang, id, regionId) : localePath(lang, `/${id}/`),
      statsLine,
      pinCount,
    };
  }).filter((spot): spot is LandingMapSpot => spot != null);
}
