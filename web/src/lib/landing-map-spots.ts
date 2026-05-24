import { landingSpotCityHeroUrl } from "./landing-spot-payload";
import { regionLandingStreetSceneId } from "./region-hero";
import { findRegion, REGIONS } from "./load-content";
import { localePath, regionGalleryHref, streetGalleryHref } from "./locale-path";
import { DESIGN_MAP_PINS } from "./design-map-pins";
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
const SPOT_REGION: Record<LandingMapSpotId, string> = {
  cn: "hainan",
  jp: "tokyo",
  us: "ny",
};

const CITY: Record<LandingMapSpotId, Multilang> = {
  cn: { zh: "海口", en: "HAIKOU", ja: "海口" },
  jp: { zh: "东京", en: "TOKYO", ja: "東京" },
  us: { zh: "纽约", en: "NEW YORK", ja: "ニューヨーク" },
};

const COORDS: Record<LandingMapSpotId, string> = {
  cn: "20.02° N · 110.35° E",
  jp: "35.68° N · 139.69° E",
  us: "40.71° N · 74.01° W",
};

export const LANDING_MAP_DEFAULT: LandingMapSpotId = "cn";

export function buildLandingMapSpots(lang: Lang): LandingMapSpot[] {
  const order: LandingMapSpotId[] = ["cn", "jp", "us"];

  return order.map((id) => {
    const regionId = SPOT_REGION[id];
    const region = findRegion(id, regionId) ?? REGIONS[id]?.[0];
    const stats = region?.stats;
    const statsLine = stats
      ? `${stats.poster} · ${stats.street} · ${stats.zine}`
      : "";

    const pinCount = REGIONS[id].reduce((sum, r) => sum + r.stats.poster, 0);
    const rid = region?.id ?? regionId;
    const streetSceneId = region ? regionLandingStreetSceneId(id, region) : null;
    const streetHref = streetSceneId
      ? streetGalleryHref(lang, id, rid, streetSceneId)
      : region
        ? regionGalleryHref(lang, id, rid)
        : localePath(lang, `/${id}/`);

    return {
      id,
      regionId: rid,
      pin: DESIGN_MAP_PINS[id],
      city: CITY[id],
      citySub: { zh: "", en: "", ja: "" },
      coords: COORDS[id],
      heroUrl: landingSpotCityHeroUrl(id),
      streetHref,
      countryHref: localePath(lang, `/${id}/`),
      regionHref: region ? regionGalleryHref(lang, id, rid) : localePath(lang, `/${id}/`),
      statsLine,
      pinCount,
    };
  });
}
