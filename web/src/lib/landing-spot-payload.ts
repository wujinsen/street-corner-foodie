import { COUNTRIES, getPosters, REGIONS } from "./countries";
import { pickCountryFeatured } from "./country-posters";
import {
  buildLandingFocusStreetSlides,
  buildLandingPosterSlides,
  buildLandingZineSlides,
  type LandingBentoSlide,
} from "./landing-bento-slides";
import { buildRegionFlavorRadarScores } from "./flavor-match";
import { findRegion } from "./load-content";
import { formatAtmosphereBento, getRegionAtmosphere, type RegionAtmosphere } from "./region-atmosphere";
import { regionHeroImageUrl } from "./region-hero";
import { getStreetConfig, STREET_REGIONS, streetPreferredImageUrl } from "./streets";
import { t, type Lang } from "./i18n";
import type { CountryId, Poster } from "./types";

/** Per-pin scene + editor defaults (v0.6.9 landing bento contract). */
export const LANDING_SPOT_TILES: Record<
  CountryId,
  {
    regionId: string;
    streetHubId: string;
    sceneSpotId: string;
    cityHeroSceneId: string;
    /** Landing poster bento default (overrides region web_editor_pick). */
    posterSlug?: string;
    zineSlug?: string;
    streetHubMood: "day" | "night";
    sceneSpotMood: "day" | "night";
  }
> = {
  cn: {
    regionId: "hainan",
    streetHubId: "qilou",
    sceneSpotId: "laobacha",
    cityHeroSceneId: "qilou",
    posterSlug: "laobacha",
    zineSlug: "qingbuliang",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  jp: {
    regionId: "tokyo",
    streetHubId: "shinjuku",
    sceneSpotId: "tsukiji",
    cityHeroSceneId: "shinjuku",
    zineSlug: "ramen",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  us: {
    regionId: "ny",
    streetHubId: "times_square",
    sceneSpotId: "lower_manhattan",
    cityHeroSceneId: "times_square",
    zineSlug: "ny_pizza",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  fr: {
    regionId: "paris",
    streetHubId: "eiffel_tower",
    sceneSpotId: "arc_de_triomphe",
    cityHeroSceneId: "eiffel_tower",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  uk: {
    regionId: "london",
    streetHubId: "thames_river",
    sceneSpotId: "thames_river",
    cityHeroSceneId: "thames_river",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  de: {
    regionId: "cologne",
    streetHubId: "rhine_river",
    sceneSpotId: "rhine_river",
    cityHeroSceneId: "rhine_river",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  za: {
    regionId: "south_africa",
    streetHubId: "cape_of_good_hope",
    sceneSpotId: "cape_agulhas",
    cityHeroSceneId: "cape_of_good_hope",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  nz: {
    regionId: "nz",
    streetHubId: "nz",
    sceneSpotId: "nz",
    cityHeroSceneId: "nz",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  antarctica: {
    regionId: "antarctica",
    streetHubId: "paradise_harbor",
    sceneSpotId: "paradise_harbor",
    cityHeroSceneId: "paradise_harbor",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
};

export type LandingSpotTiles = (typeof LANDING_SPOT_TILES)[CountryId];

/** Landing bento · cn region sub-panels (map city lights → province bento). */
export const LANDING_CN_BENTO_REGIONS: string[] = (() => {
  const keys = Object.keys(STREET_REGIONS.cn ?? {});
  return ["hainan", ...keys.filter((k) => k !== "hainan").sort()];
})();

const CN_REGION_TILE_OVERRIDES: Record<string, LandingSpotTiles> = {
  hainan: LANDING_SPOT_TILES.cn,
  hebei: {
    regionId: "hebei",
    streetHubId: "zhengding",
    sceneSpotId: "bannianmian",
    cityHeroSceneId: "zhengding",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  beijing: {
    regionId: "beijing",
    streetHubId: "nanluoguxiang",
    sceneSpotId: "nanluoguxiang",
    cityHeroSceneId: "nanluoguxiang",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  zhejiang: {
    regionId: "zhejiang",
    streetHubId: "xihu",
    sceneSpotId: "hefang",
    cityHeroSceneId: "xihu",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  shaanxi: {
    regionId: "shaanxi",
    streetHubId: "changan",
    sceneSpotId: "tang_changan",
    cityHeroSceneId: "changan",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
  xizang: {
    regionId: "xizang",
    streetHubId: "potala",
    sceneSpotId: "potala",
    cityHeroSceneId: "potala",
    streetHubMood: "night",
    sceneSpotMood: "day",
  },
};

function resolveCnRegionTiles(regionId: string): LandingSpotTiles {
  const override = CN_REGION_TILE_OVERRIDES[regionId];
  if (override) return override;

  const config = getStreetConfig("cn", regionId);
  const hub = config?.defaultSceneId ?? config?.scenes[0]?.id ?? "qilou";
  const spot = config?.scenes.find((s) => s.id !== hub)?.id ?? hub;
  return {
    regionId,
    streetHubId: hub,
    sceneSpotId: spot,
    cityHeroSceneId: hub,
    streetHubMood: "night",
    sceneSpotMood: "day",
  };
}

/** Landing bento · pre-rendered country panels (phase 1). */
export const LANDING_BENTO_COUNTRIES: CountryId[] = [
  "cn",
  "jp",
  "us",
  "fr",
  "uk",
  "de",
  "za",
  "nz",
  "antarctica",
];

export interface LandingSpotPayload {
  countryId: CountryId;
  regionId: string;
  flag: string;
  editorPick: Poster | undefined;
  zinePick: Poster | undefined;
  flavorLabels: string[];
  atmosphere: RegionAtmosphere | undefined;
  atmoBento: ReturnType<typeof formatAtmosphereBento> | null;
  streetSpotCount: number;
  cityHeroUrl: string | null;
  dishSlides: LandingBentoSlide[];
  zineSlides: LandingBentoSlide[];
  streetHubSlides: LandingBentoSlide[];
  sceneSpotSlides: LandingBentoSlide[];
  radarHeadline: string;
  /** Region-aggregated polygon scores (one per flavorLabels axis). */
  radarScores: number[];
  streetHubSceneId: string;
  sceneSpotSceneId: string;
}

function resolveZinePick(
  countryId: CountryId,
  regionId: string,
  zineSlug: string | undefined,
  editorPick: Poster | undefined,
): Poster | undefined {
  const posters = getPosters(countryId, regionId);
  if (zineSlug) {
    const hit = posters.find((p) => p.slug === zineSlug);
    if (hit) return hit;
  }
  const second = editorPick
    ? posters.find((p) => p.slug !== editorPick.slug && p.fromZine)
    : undefined;
  return second ?? posters.find((p) => p.fromZine) ?? posters[1];
}

/** Landing city card — region landing hero (night wide when available). */
function resolveLandingCityHeroUrl(
  countryId: CountryId,
  regionId: string,
  cityHeroSceneId?: string,
): string | null {
  const region = findRegion(countryId, regionId);
  if (region) {
    const hero = regionHeroImageUrl(countryId, region, "landing");
    if (hero) return hero;
  }
  const config = getStreetConfig(countryId, regionId);
  if (!config) return null;
  const sceneId = cityHeroSceneId ?? config.defaultSceneId ?? config.scenes[0]?.id ?? "";
  return streetPreferredImageUrl(config, sceneId, "wide");
}

function resolveEditorPick(
  countryId: CountryId,
  regionId: string,
  posters: Poster[],
  posterSlug?: string,
): Poster | undefined {
  if (posterSlug) {
    const hit = posters.find((p) => p.slug === posterSlug && !p.fromZine);
    if (hit) return hit;
  }
  return (
    pickCountryFeatured(posters, countryId) ??
    posters.find((p) => !p.fromZine) ??
    posters[0]
  );
}

export function buildLandingSpotPayload(
  countryId: CountryId,
  lang: Lang,
  regionIdOverride?: string,
): LandingSpotPayload {
  const tiles =
    countryId === "cn" && regionIdOverride
      ? resolveCnRegionTiles(regionIdOverride)
      : LANDING_SPOT_TILES[countryId];
  const region =
    REGIONS[countryId]?.find((r) => r.id === tiles.regionId) ??
    REGIONS[countryId]?.[0];
  const regionId = region?.id ?? tiles.regionId;
  const posters = getPosters(countryId, regionId);
  const editorPick = resolveEditorPick(countryId, regionId, posters, tiles.posterSlug);
  const zinePick = resolveZinePick(countryId, regionId, tiles.zineSlug, editorPick);
  const flavorLabels = region?.flavors[lang] ?? region?.flavors.zh ?? [];
  const radarScores = buildRegionFlavorRadarScores(posters, flavorLabels, lang);
  const atmosphere = getRegionAtmosphere(countryId, regionId);
  const atmoBento = atmosphere ? formatAtmosphereBento(atmosphere, lang) : null;
  const streetConfig = getStreetConfig(countryId, regionId);
  const cityHeroUrl = resolveLandingCityHeroUrl(countryId, regionId, tiles.cityHeroSceneId);

  const dishSlides = editorPick
    ? buildLandingPosterSlides(posters, lang, countryId, regionId, editorPick.slug)
    : [];
  const zineSlides = zinePick
    ? buildLandingZineSlides(lang, countryId, regionId, zinePick.slug)
    : [];
  const streetHubSlides = buildLandingFocusStreetSlides(
    lang,
    countryId,
    regionId,
    tiles.streetHubId,
    tiles.streetHubMood,
  );
  const sceneSpotSlides = buildLandingFocusStreetSlides(
    lang,
    countryId,
    regionId,
    tiles.sceneSpotId,
    tiles.sceneSpotMood,
  );

  return {
    countryId,
    regionId,
    flag: COUNTRIES[countryId].flag,
    editorPick,
    zinePick,
    flavorLabels,
    atmosphere,
    atmoBento,
    streetSpotCount: streetConfig?.scenes.length ?? 0,
    cityHeroUrl,
    dishSlides,
    zineSlides,
    streetHubSlides,
    sceneSpotSlides,
    radarHeadline: flavorLabels.slice(0, 3).join(" · "),
    radarScores,
    streetHubSceneId: tiles.streetHubId,
    sceneSpotSceneId: tiles.sceneSpotId,
  };
}

export function buildAllLandingSpotPayloads(lang: Lang): Record<CountryId, LandingSpotPayload> {
  const out = {} as Record<CountryId, LandingSpotPayload>;
  for (const countryId of LANDING_BENTO_COUNTRIES) {
    out[countryId] = buildLandingSpotPayload(countryId, lang);
  }
  return out;
}

export function buildAllCnRegionPayloads(lang: Lang): Record<string, LandingSpotPayload> {
  const out: Record<string, LandingSpotPayload> = {};
  for (const regionId of LANDING_CN_BENTO_REGIONS) {
    out[regionId] = buildLandingSpotPayload("cn", lang, regionId);
  }
  return out;
}

/** City-card hero thumbnail for map spot (region landing hero · night wide when available). */
export function landingSpotCityHeroUrl(countryId: CountryId): string | null {
  const tiles = LANDING_SPOT_TILES[countryId];
  return resolveLandingCityHeroUrl(countryId, tiles.regionId);
}

export function streetSceneLabel(
  countryId: CountryId,
  regionId: string,
  sceneId: string,
  lang: Lang,
): { name: string; tag: string } | null {
  const config = getStreetConfig(countryId, regionId);
  const scene = config?.scenes.find((s) => s.id === sceneId);
  if (!scene) return null;
  return { name: t(scene.name, lang), tag: t(scene.tag, lang) };
}
