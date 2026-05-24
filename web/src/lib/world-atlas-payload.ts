/**
 * World Atlas · independent payload.
 *
 * Three-tier data for the World → Country → Region → Scene drill-down:
 *
 *   countries[]  → world view: 3 ⌬ rings centered on each country.
 *   regions[]    → country view: per-province rings on the active country.
 *   scenes[]     → region view: pin-drops for street-view scenes.
 */

import { COUNTRIES, findRegion } from "./countries";
import { t, UI, type Lang } from "./i18n";
import { streetGalleryHref } from "./locale-path";
import { COUNTRY_FALLBACK, fitGeoViewport, REGION_GEO } from "./street-geo";
import {
  sceneMapPin,
  streetPreferredImageUrl,
  STREET_REGIONS,
  type StreetScene,
} from "./streets";
import type { CountryId } from "./types";

/** WGS84 lng/lat */
export type AtlasCoord = [number, number];

export interface WorldAtlasCountry {
  id: CountryId;
  /** Localized country label */
  name: string;
  /** Geo center for ECharts (degrees) */
  center: AtlasCoord;
  /** ECharts geo zoom when this country is the active view */
  zoom: number;
  regionCount: number;
  sceneCount: number;
}

export interface WorldAtlasRegion {
  /** `${countryId}__${regionId}` */
  id: string;
  countryId: CountryId;
  regionId: string;
  /** Localized region label */
  name: string;
  center: AtlasCoord;
  /** ECharts geo zoom when this region is the active view */
  zoom: number;
  sceneCount: number;
}

export interface WorldAtlasScene {
  /** `${countryId}__${regionId}__${sceneId}` */
  id: string;
  countryId: CountryId;
  regionId: string;
  sceneId: string;
  /** Localized scene label (e.g. "府城 · 海南") */
  name: string;
  /** Localized tag (e.g. "中国 · 老街") */
  tag: string;
  geo: AtlasCoord;
  /** Preferred list thumb (`night_wide`). */
  thumbUrl: string | null;
  /** Click target — dedicated street page (static build; not `?region=` gallery). */
  streetsHref: string;
}

export interface WorldAtlasPayload {
  lang: Lang;
  /** Display title for the breadcrumb / aria-label. */
  title: string;
  worldJsonUrl: string;
  /** ECharts geo initial center for World view. */
  initialCenter: AtlasCoord;
  initialZoom: number;
  countries: WorldAtlasCountry[];
  regions: WorldAtlasRegion[];
  scenes: WorldAtlasScene[];
  i18n: {
    crumb_world: string;
    hint_world: string;
    hint_region: string;
    hint_spider: string;
    cluster_expand: string;
    tip_zoom: string;
    tip_navigate: string;
  };
}

export function worldAtlasHasPins(): boolean {
  for (const cid of Object.keys(STREET_REGIONS) as CountryId[]) {
    const regions = STREET_REGIONS[cid];
    if (!regions) continue;
    for (const rid of Object.keys(regions)) {
      const cfg = regions[rid];
      if (!cfg?.scenes?.length) continue;
      if (cfg.scenes.some((s) => streetPreferredImageUrl(cfg, s.id))) return true;
    }
  }
  return false;
}

interface SceneRow {
  countryId: CountryId;
  regionId: string;
  sceneId: string;
  name: string;
  tag: string;
  geo: AtlasCoord;
  thumbUrl: string | null;
}

function streetSceneRows(
  countryId: CountryId,
  regionId: string,
  lang: Lang,
  config: NonNullable<(typeof STREET_REGIONS)[CountryId]>[string],
): SceneRow[] {
  const region = findRegion(countryId, regionId);
  const regionLabel = region ? t(region.name, lang) : regionId;
  const countryLabel = t(COUNTRIES[countryId].name, lang);
  const fallback = REGION_GEO[`${countryId}:${regionId}`] ?? COUNTRY_FALLBACK[countryId];
  return config.scenes
    .filter((s: StreetScene) => streetPreferredImageUrl(config, s.id))
    .map((s, i, arr) => {
      const pin = sceneMapPin(s, i, arr.length);
      const geo: AtlasCoord = s.geo ?? [
        fallback.center[0] + (pin.x - 50) * fallback.lngPerPin,
        fallback.center[1] - (pin.y - 50) * fallback.latPerPin,
      ];
      return {
        countryId,
        regionId,
        sceneId: s.id,
        name: `${t(s.name, lang)} · ${regionLabel}`,
        tag: `${countryLabel} · ${t(s.tag, lang)}`,
        geo,
        thumbUrl: streetPreferredImageUrl(config, s.id),
      };
    });
}

export function buildWorldAtlasPayload(lang: Lang): WorldAtlasPayload | null {
  const allRows: SceneRow[] = [];
  const countriesAcc = new Map<
    CountryId,
    { regions: Set<string>; sceneCount: number }
  >();
  const regionsAcc = new Map<
    string,
    { countryId: CountryId; regionId: string; sceneCount: number }
  >();

  for (const countryId of Object.keys(STREET_REGIONS) as CountryId[]) {
    const streetRegions = STREET_REGIONS[countryId];
    if (!streetRegions) continue;
    for (const regionId of Object.keys(streetRegions)) {
      const config = streetRegions[regionId];
      if (!config?.scenes?.length) continue;
      const rows = streetSceneRows(countryId, regionId, lang, config);
      if (rows.length === 0) continue;
      allRows.push(...rows);

      const countryAcc =
        countriesAcc.get(countryId) ?? { regions: new Set<string>(), sceneCount: 0 };
      countryAcc.regions.add(regionId);
      countryAcc.sceneCount += rows.length;
      countriesAcc.set(countryId, countryAcc);

      regionsAcc.set(`${countryId}__${regionId}`, {
        countryId,
        regionId,
        sceneCount: rows.length,
      });
    }
  }

  if (allRows.length === 0) return null;

  const countries: WorldAtlasCountry[] = [];
  for (const [cid, acc] of countriesAcc) {
    const fb = COUNTRY_FALLBACK[cid];
    countries.push({
      id: cid,
      name: t(COUNTRIES[cid].name, lang),
      center: [...fb.center] as AtlasCoord,
      zoom: fb.zoom,
      regionCount: acc.regions.size,
      sceneCount: acc.sceneCount,
    });
  }
  countries.sort((a, b) => a.id.localeCompare(b.id));

  const regions: WorldAtlasRegion[] = [];
  for (const [key, acc] of regionsAcc) {
    const cfg = REGION_GEO[`${acc.countryId}:${acc.regionId}`] ?? COUNTRY_FALLBACK[acc.countryId];
    const region = findRegion(acc.countryId, acc.regionId);
    const name = region ? t(region.name, lang) : acc.regionId;
    const sceneCoords = allRows
      .filter((r) => r.countryId === acc.countryId && r.regionId === acc.regionId)
      .map((r) => r.geo);
    const viewport =
      sceneCoords.length >= 2
        ? fitGeoViewport(sceneCoords)
        : { center: cfg.center as AtlasCoord, zoom: cfg.zoom };
    regions.push({
      id: key,
      countryId: acc.countryId,
      regionId: acc.regionId,
      name,
      center: [...viewport.center] as AtlasCoord,
      zoom: viewport.zoom,
      sceneCount: acc.sceneCount,
    });
  }
  regions.sort((a, b) =>
    a.countryId === b.countryId
      ? a.regionId.localeCompare(b.regionId)
      : a.countryId.localeCompare(b.countryId),
  );

  const scenes: WorldAtlasScene[] = allRows.map((r) => ({
    id: `${r.countryId}__${r.regionId}__${r.sceneId}`,
    countryId: r.countryId,
    regionId: r.regionId,
    sceneId: r.sceneId,
    name: r.name,
    tag: r.tag,
    geo: r.geo,
    thumbUrl: r.thumbUrl,
    streetsHref: streetGalleryHref(lang, r.countryId, r.regionId, r.sceneId),
  }));

  return {
    lang,
    title: t(UI.nav.world_atlas, lang),
    worldJsonUrl: "/geo/world.json",
    initialCenter: [12, 28],
    initialZoom: 1.08,
    countries,
    regions,
    scenes,
    i18n: {
      crumb_world: t({ zh: "世界", en: "World", ja: "世界" }, lang),
      hint_world: t(
        {
          zh: "点光点放大到该省 · 滚轮缩放 / 拖动",
          en: "Click any pin to zoom into that region · scroll to zoom / drag to pan",
          ja: "ピンをクリックで地域を拡大 · ホイールで拡縮 / ドラッグで移動",
        },
        lang,
      ),
      hint_region: t(
        {
          zh: "光点簇点击展开缩略图 · 单点直达街景 · 点世界返回",
          en: "Cluster → thumbnail fan · lone pin → street view · World to zoom out",
          ja: "簇はクリックでサムネ展開 · 単独ピンで街角へ · 「世界」で戻る",
        },
        lang,
      ),
      hint_spider: t(
        {
          zh: "点选上方缩略图卡片进入街景 · Esc 收起",
          en: "Pick a thumbnail card to open street view · Esc to collapse",
          ja: "サムネカードを選んで街角へ · Esc で閉じる",
        },
        lang,
      ),
      cluster_expand: t(
        {
          zh: "→ 点击展开缩略图",
          en: "→ click for thumbnail fan",
          ja: "→ クリックでサムネ展開",
        },
        lang,
      ),
      tip_zoom: t(
        {
          zh: "→ 点击放大到该省",
          en: "→ click to zoom into province",
          ja: "→ クリックで地域を拡大",
        },
        lang,
      ),
      tip_navigate: t(
        {
          zh: "→ 点击进入街景",
          en: "→ click to open street view",
          ja: "→ クリックで街角を開く",
        },
        lang,
      ),
    },
  };
}
