import { COUNTRIES, getPosters, REGIONS } from "./countries";
import { pickCountryFeatured } from "./country-posters";
import {
  buildLandingFocusStreetSlides,
  buildLandingPosterSlides,
  buildLandingZineSlides,
  type LandingBentoSlide,
} from "./landing-bento-slides";
import { formatAtmosphereBento, getRegionAtmosphere, type RegionAtmosphere } from "./region-atmosphere";
import { getStreetConfig, streetPreferredImageUrl } from "./streets";
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
};

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

export function buildLandingSpotPayload(
  countryId: CountryId,
  lang: Lang,
): LandingSpotPayload {
  const tiles = LANDING_SPOT_TILES[countryId];
  const region =
    REGIONS[countryId]?.find((r) => r.id === tiles.regionId) ??
    REGIONS[countryId]?.[0];
  const regionId = region?.id ?? tiles.regionId;
  const posters = getPosters(countryId, regionId);
  const editorPick =
    pickCountryFeatured(posters, countryId) ??
    posters.find((p) => !p.fromZine) ??
    posters[0];
  const zinePick = resolveZinePick(countryId, regionId, tiles.zineSlug, editorPick);
  const flavorLabels = region?.flavors[lang] ?? region?.flavors.zh ?? [];
  const atmosphere = getRegionAtmosphere(countryId, regionId);
  const atmoBento = atmosphere ? formatAtmosphereBento(atmosphere, lang) : null;
  const streetConfig = getStreetConfig(countryId, regionId);
  const cityHeroUrl = streetConfig
    ? streetPreferredImageUrl(streetConfig, tiles.cityHeroSceneId, "wide")
    : null;

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
    streetHubSceneId: tiles.streetHubId,
    sceneSpotSceneId: tiles.sceneSpotId,
  };
}

export function buildAllLandingSpotPayloads(
  lang: Lang,
): Record<CountryId, LandingSpotPayload> {
  return {
    cn: buildLandingSpotPayload("cn", lang),
    jp: buildLandingSpotPayload("jp", lang),
    us: buildLandingSpotPayload("us", lang),
  };
}

/** City-card hero thumbnail for map spot (street scene, not gallery hero). */
export function landingSpotCityHeroUrl(countryId: CountryId): string | null {
  const tiles = LANDING_SPOT_TILES[countryId];
  const config = getStreetConfig(countryId, tiles.regionId);
  if (!config) return null;
  return streetPreferredImageUrl(config, tiles.cityHeroSceneId, "wide");
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
