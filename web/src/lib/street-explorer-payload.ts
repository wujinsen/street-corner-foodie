import { findPoster, getPosters, posterImageUrl } from "./posters";
import { localePath, streetGalleryHref } from "./locale-path";
import { UI, t, type Lang } from "./i18n";
import {
  countUniqueStreetPhotoUrls,
  getStreetConfig,
  getStreetDefaultView,
  getStreetScenes,
  parseStreetViewQuery,
  pickDefaultStreetViewForScene,
  type StreetRegionConfig,
  sceneMapPin,
  streetMatrixCells,
  streetPreferredImageUrl,
  STREET_VIEW_DEFAULT_VIEW,
  type StreetFrameMode,
  type StreetMood,
  type StreetScene,
  type StreetViewSelection,
} from "./streets";
import { buildStreetExplorerGeoMap, type StreetExplorerGeoMap } from "./street-geo";
import {
  parseStreetSceneIdFromPath,
  replaceStreetSceneInPath,
} from "./street-explorer-path";
import type { CountryId } from "./types";

export { parseStreetSceneIdFromPath, replaceStreetSceneInPath } from "./street-explorer-path";

export interface StreetExplorerEatCard {
  slug: string;
  name: string;
  nameEn: string;
  href: string;
  thumbUrl: string | null;
}

export interface StreetExplorerScenePayload {
  id: string;
  name: string;
  tag: string;
  thumbUrl: string | null;
  deepLink: string;
  mapPin: { x: number; y: number };
  geo?: [number, number];
}

export interface StreetExplorerMatrixCell {
  mood: StreetMood;
  frame: StreetFrameMode;
  url: string | null;
  available: boolean;
  label: string;
}

export interface StreetExplorerPayload {
  countryId: CountryId;
  regionId: string;
  regionName: string;
  defaultSceneId: string;
  defaultView: StreetViewSelection;
  sceneCount: number;
  photoCount: number;
  scenes: StreetExplorerScenePayload[];
  matrixByScene: Record<string, StreetExplorerMatrixCell[]>;
  eatHereByScene: Record<string, StreetExplorerEatCard[]>;
  moods: StreetMood[];
  frames: StreetFrameMode[];
  moodLabels: Record<StreetMood, string>;
  frameLabels: Record<StreetFrameMode, string>;
  geoMap: StreetExplorerGeoMap;
}

function pickEatHere(
  countryId: CountryId,
  regionId: string,
  scene: StreetScene,
  lang: Lang,
): StreetExplorerEatCard[] {
  const allPosters = getPosters(countryId, regionId);
  const slugs = scene.posterSlugs ?? [];
  const picked = [];
  for (const s of slugs) {
    const p = findPoster(countryId, regionId, s);
    if (p) {
      picked.push({
        slug: p.slug,
        name: p.name.zh,
        nameEn: p.romaji ?? p.name.en,
        href: localePath(lang, `/${countryId}/${regionId}/poster/${p.slug}`),
        thumbUrl: posterImageUrl(p, false),
      });
    }
  }
  if (picked.length >= 3) return picked.slice(0, 6);
  for (const p of allPosters) {
    if (picked.length >= 6) break;
    if (!picked.some((x) => x.slug === p.slug)) {
      picked.push({
        slug: p.slug,
        name: p.name.zh,
        nameEn: p.romaji ?? p.name.en,
        href: localePath(lang, `/${countryId}/${regionId}/poster/${p.slug}`),
        thumbUrl: posterImageUrl(p, false),
      });
    }
  }
  return picked.slice(0, 6);
}

export function buildStreetExplorerPayload(
  countryId: CountryId,
  regionId: string,
  lang: Lang,
  regionName: { zh: string; en: string; ja: string },
): StreetExplorerPayload | null {
  const config = getStreetConfig(countryId, regionId);
  if (!config) return null;

  const scenes = getStreetScenes(countryId, regionId);
  if (!scenes.length) return null;

  const moods: StreetMood[] = ["dawn", "day", "sunset", "night"];
  const frames: StreetFrameMode[] = ["wide", "standard", "sunset_wide"];

  const moodLabelMap: Record<StreetMood, string> = {
    dawn: t(UI.street.dawn, lang),
    day: t(UI.street.day, lang),
    sunset: t(UI.street.sunset, lang),
    night: t(UI.street.night, lang),
  };

  const frameLabelMap: Record<StreetFrameMode, string> = {
    wide: t(UI.street.wide, lang),
    standard: t(UI.street.standard, lang),
    sunset_wide: t(UI.street.sunset_wide, lang),
  };

  const matrixByScene: Record<string, StreetExplorerMatrixCell[]> = {};
  const eatHereByScene: Record<string, StreetExplorerEatCard[]> = {};

  const scenePayloads: StreetExplorerScenePayload[] = scenes.map((s, i) => {
    const thumb = streetPreferredImageUrl(config, s.id, "wide");
    matrixByScene[s.id] = streetMatrixCells(config, s.id).map((cell) => ({
      mood: cell.mood,
      frame: cell.frame,
      url: cell.url,
      available: cell.available,
      label: `${moodLabelMap[cell.mood]} · ${frameLabelMap[cell.frame]}`,
    }));
    eatHereByScene[s.id] = pickEatHere(countryId, regionId, s, lang);
    return {
      id: s.id,
      name: t(s.name, lang),
      tag: t(s.tag, lang),
      thumbUrl: thumb,
      deepLink: streetGalleryHref(lang, countryId, regionId, s.id),
      mapPin: sceneMapPin(s, i, scenes.length),
      geo: s.geo,
    };
  });

  const geoMap = buildStreetExplorerGeoMap(
    countryId,
    regionId,
    scenePayloads.map((s) => ({
      id: s.id,
      name: s.name,
      mapPin: s.mapPin,
      geo: s.geo,
    })),
  );

  return {
    countryId,
    regionId,
    regionName: t(regionName, lang),
    defaultSceneId: config.defaultSceneId ?? scenes[0]!.id,
    defaultView: getStreetDefaultView(config),
    sceneCount: scenes.length,
    photoCount: countUniqueStreetPhotoUrls(config, scenes),
    scenes: scenePayloads,
    matrixByScene,
    eatHereByScene,
    moods,
    frames,
    moodLabels: moodLabelMap,
    frameLabels: frameLabelMap,
    geoMap,
  };
}

export function initialStreetViewFromUrl(
  url: URL,
  defaultSceneId: string,
  defaultView: StreetViewSelection = STREET_VIEW_DEFAULT_VIEW,
  config?: StreetRegionConfig | null,
  sceneIdOverride?: string | null,
): { sceneId: string; view: StreetViewSelection } {
  const sceneId =
    sceneIdOverride?.trim() ||
    url.searchParams.get("scene") ||
    parseStreetSceneIdFromPath(url.pathname) ||
    defaultSceneId;
  const hasTime = url.searchParams.has("time");
  const hasFrame = url.searchParams.has("frame");
  const view =
    config && !hasTime && !hasFrame
      ? pickDefaultStreetViewForScene(config, sceneId)
      : parseStreetViewQuery(url, defaultView);
  return { sceneId, view };
}
