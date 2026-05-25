/**
 * World Atlas · independent ECharts controller.
 *
 *   world view  → click pin → zoom into province.
 *   region view → multi-scene clusters collapse to one hub; click hub → thumbnail fan;
 *                 click a card → street gallery. Singleton pins → direct navigate.
 *   Click "World" / Esc → zoom out (Esc collapses spider first).
 */

import type { ECharts, EChartsOption } from "echarts";
import type {
  WorldAtlasPayload,
  WorldAtlasScene,
  AtlasCoord,
} from "../lib/world-atlas-payload";
import type { CountryId } from "../lib/types";
import {
  clusterCityLabel,
  clusterForScene,
  clusterHubMeta,
  clusterRegionScenes,
  parseClusterHubMeta,
  type SceneCluster,
} from "../lib/world-atlas-clusters";
import { mapPinStyle } from "../lib/map-pin-colors";
import { clearSpiderCards, syncSpiderCards } from "./world-atlas-spider-cards";

const MAP_BG = "#00050a";
const ECHARTS_SCRIPT = "/vendor/echarts.min.js";
const LAND_DOT = "#7ec8ff";
const GEO_BORDER = "#2a4d6e";
const GEO_FILL = "#020a14";
const GRATICULE = "rgba(42, 77, 110, 0.22)";

function atlasTooltipTitle(color: string, text: string): string {
  return `<div style="font-size:15px;font-weight:650;line-height:1.35;color:${color};letter-spacing:0.01em">${text}</div>`;
}

function atlasTooltipSub(text: string): string {
  return `<div style="margin-top:5px;font-size:13px;font-weight:500;line-height:1.45;color:#d8ebff">${text}</div>`;
}

function atlasTooltipAction(text: string): string {
  return `<div style="margin-top:7px;font-size:12px;font-weight:600;line-height:1.4;color:#9ec9ef">${text}</div>`;
}

type AtlasView = "world" | "country" | "region";

type GraticuleLine = { coords: [number, number][] };

let landParticlesCache: [number, number][] | null = null;
let graticuleCache: GraticuleLine[] | null = null;

type EchartsGlobal = typeof import("echarts");

let echartsLoad: Promise<EchartsGlobal> | null = null;

function loadEchartsLib(): Promise<EchartsGlobal> {
  if (echartsLoad) return echartsLoad;
  echartsLoad = new Promise((resolve, reject) => {
    const w = window as Window & { echarts?: EchartsGlobal };
    if (w.echarts) {
      resolve(w.echarts);
      return;
    }
    const id = "scf-echarts-script";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.src = ECHARTS_SCRIPT;
      script.async = true;
      document.head.appendChild(script);
    }
    const done = (): void => {
      if (w.echarts) resolve(w.echarts);
      else reject(new Error("echarts global missing after script load"));
    };
    script.addEventListener("load", done, { once: true });
    script.addEventListener("error", () => reject(new Error("echarts script failed")), {
      once: true,
    });
  });
  return echartsLoad;
}

function showMapError(host: HTMLElement, message: string): void {
  host.innerHTML = "";
  const p = document.createElement("p");
  p.className = "world-atlas-explorer__error";
  p.setAttribute("role", "alert");
  p.textContent = message;
  host.appendChild(p);
}

function loadMapAssets(): Promise<{ particles: [number, number][]; graticule: GraticuleLine[] }> {
  if (landParticlesCache && graticuleCache) {
    return Promise.resolve({ particles: landParticlesCache, graticule: graticuleCache });
  }
  return Promise.all([
    fetch("/geo/land-particles.json").then((r) => {
      if (!r.ok) throw new Error(`land-particles ${r.status}`);
      return r.json() as Promise<[number, number][]>;
    }),
    fetch("/geo/map-graticule.json").then((r) => {
      if (!r.ok) throw new Error(`map-graticule ${r.status}`);
      return r.json() as Promise<GraticuleLine[]>;
    }),
  ]).then(([particles, graticule]) => {
    landParticlesCache = particles;
    graticuleCache = graticule;
    return { particles, graticule };
  });
}

interface AtlasState {
  view: AtlasView;
  countryId: CountryId | null;
  /** `${countryId}__${regionId}` of the focused province, null in world/country view. */
  regionKey: string | null;
  /** Landing homepage · world view · selected scene id (no zoom). */
  landingSelection: string | null;
  /** Spider fan for a multi-scene cluster in region view. */
  spider: {
    clusterKey: string;
    sceneIds: string[];
    center: [number, number];
  } | null;
}

interface SceneDatum {
  /** ECharts item id (same as meta — survives click better than custom fields). */
  id: string;
  name: string;
  value: [number, number];
  meta: string;
  regionKey: string;
  itemStyle?: { opacity?: number; shadowBlur?: number; shadowColor?: string };
  label?: { show?: boolean };
  symbolSize?: number;
}

type ClickCell = { meta: string; regionKey: string };

function buildClickRegistry(series: EChartsOption["series"]): Map<string, ClickCell> {
  const map = new Map<string, ClickCell>();
  if (!Array.isArray(series)) return map;
  for (const raw of series) {
    if (!raw || typeof raw !== "object") continue;
    const s = raw as { type?: string; id?: string; name?: string; data?: unknown[] };
    if (s.type !== "effectScatter" || !Array.isArray(s.data)) continue;
    const sid = String(s.id ?? s.name ?? "");
    s.data.forEach((item, dataIndex) => {
      const d = item as SceneDatum | undefined;
      if (!d?.meta || !d.regionKey) return;
      map.set(`${sid}:${dataIndex}`, { meta: d.meta, regionKey: d.regionKey });
    });
  }
  return map;
}

function resolveSceneClick(
  params: {
    seriesId?: string;
    dataIndex?: number;
    data?: unknown;
  },
  registry: Map<string, ClickCell>,
): ClickCell | null {
  const sid = String(params.seriesId ?? "");
  const di = params.dataIndex;
  if (sid && di != null && di >= 0) {
    const fromReg = registry.get(`${sid}:${di}`);
    if (fromReg) return fromReg;
  }
  const data = params.data as SceneDatum | [number, number] | undefined;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const meta = data.meta ?? data.id;
    if (meta && data.regionKey) return { meta, regionKey: data.regionKey };
  }
  return null;
}

function sceneSeriesByCountry(
  payload: WorldAtlasPayload,
  scenes: WorldAtlasScene[],
  state: AtlasState,
  landing = false,
): Extract<NonNullable<EChartsOption["series"]>, object>[] {
  const activeClusters =
    state.view === "region" && state.regionKey
      ? clusterRegionScenes(scenes, state.regionKey)
      : [];
  const clusterByScene = new Map<string, SceneCluster>();
  for (const c of activeClusters) {
    for (const id of c.sceneIds) clusterByScene.set(id, c);
  }
  const expandedKey = state.spider?.clusterKey ?? null;
  const landingWorldPick =
    landing && state.view === "world" && state.landingSelection ? state.landingSelection : null;

  const groups = new Map<CountryId, WorldAtlasScene[]>();
  for (const s of scenes) {
    const list = groups.get(s.countryId) ?? [];
    list.push(s);
    groups.set(s.countryId, list);
  }

  const seriesList: Extract<NonNullable<EChartsOption["series"]>, object>[] = [];
  for (const [cid, list] of groups) {
    const pin = mapPinStyle(cid);
    const data: SceneDatum[] = [];
    const hubsDone = new Set<string>();

    for (const s of list) {
      const regionKey = `${s.countryId}__${s.regionId}`;
      let dim =
        (state.view === "country" && state.countryId != null && s.countryId !== state.countryId) ||
        (state.view === "region" && state.regionKey != null && state.regionKey !== regionKey);
      const landingSelected = landingWorldPick === s.id;
      if (landingWorldPick) {
        dim = !landingSelected;
      }
      const inActiveRegion = state.view === "region" && state.regionKey === regionKey;
      const cluster = inActiveRegion ? clusterByScene.get(s.id) : undefined;

      if (inActiveRegion && cluster && cluster.sceneIds.length > 1) {
        const isExpanded = expandedKey === cluster.key;
        if (!hubsDone.has(cluster.key)) {
          hubsDone.add(cluster.key);
          const hubMeta = clusterHubMeta(cluster.key);
          data.push({
            id: hubMeta,
            name: `×${cluster.sceneIds.length}`,
            value: cluster.center,
            meta: hubMeta,
            regionKey,
            symbolSize: isExpanded ? 42 : 38,
            label: { show: true },
          });
        }
        continue;
      }

      data.push({
        id: s.id,
        name: s.name,
        value: s.geo,
        meta: s.id,
        regionKey,
        symbolSize: landingWorldPick
          ? landingSelected
            ? 30
            : 16
          : undefined,
        itemStyle: landingWorldPick
          ? landingSelected
            ? { opacity: 1, shadowBlur: 34, shadowColor: pin.glow }
            : { opacity: 0.24 }
          : dim
            ? { opacity: 0.22 }
            : undefined,
        label: dim ? { show: false } : state.view === "region" ? { show: true } : undefined,
      });
    }

    seriesList.push({
      id: `scenes-${cid}`,
      name: `scenes-${cid}`,
      type: "effectScatter",
      coordinateSystem: "geo",
      data,
      symbol: "pin",
      symbolSize: (_val, params) => {
        const d = params.data as SceneDatum | undefined;
        return d?.symbolSize ?? (state.view === "region" ? 30 : 22);
      },
      showEffectOn: "render",
      rippleEffect: {
        brushType: "stroke",
        scale: landingWorldPick
          ? 5
          : state.view === "region"
            ? 7
            : 6.5,
        period: landingWorldPick ? 4.2 : 5.5,
        number: landingWorldPick ? 2 : 3,
        color: pin.ripple,
      },
      label: {
        show: state.view === "region",
        position: "right",
        distance: 6,
        formatter: (params) => {
          const d = params.data as SceneDatum | undefined;
          return d?.name?.split(" · ")[0] ?? d?.name ?? "";
        },
        color: "#eef6ff",
        fontSize: 12,
        fontWeight: 600,
        textBorderColor: "rgba(0,5,10,0.9)",
        textBorderWidth: 2.5,
      },
      itemStyle: {
        color: pin.core,
        shadowBlur: state.view === "region" ? 28 : 22,
        shadowColor: pin.glow,
      },
      emphasis: {
        itemStyle: { shadowBlur: 36, shadowColor: pin.glow },
      },
      cursor: "pointer",
      zlevel: 3,
    });
  }

  return seriesList;
}

/**
 * Real province / prefecture / state polygons (Natural Earth admin_1 10m,
 * trimmed by `web/scripts/build-atlas-regions.mjs`). Each Feature has a
 * `regionKey: "cn__hainan"` etc property so we can look it up by state.
 */
type AtlasRingCoord = [number, number];
type AtlasGeometry =
  | { type: "Polygon"; coordinates: AtlasRingCoord[][] }
  | { type: "MultiPolygon"; coordinates: AtlasRingCoord[][][] };
interface AtlasFeature {
  type: "Feature";
  properties: { regionKey: string; name: string };
  geometry: AtlasGeometry;
}
interface AtlasGeoJson {
  type: "FeatureCollection";
  features: AtlasFeature[];
}

const ATLAS_REGIONS_URL = "/geo/atlas-regions.json";
let atlasRegionsCache: AtlasGeoJson | null = null;
let atlasRegionsLoad: Promise<AtlasGeoJson> | null = null;

function loadAtlasRegions(): Promise<AtlasGeoJson> {
  if (atlasRegionsCache) return Promise.resolve(atlasRegionsCache);
  if (atlasRegionsLoad) return atlasRegionsLoad;
  atlasRegionsLoad = fetch(ATLAS_REGIONS_URL)
    .then((r) => {
      if (!r.ok) throw new Error(`atlas-regions ${r.status}`);
      return r.json() as Promise<AtlasGeoJson>;
    })
    .then((data) => {
      atlasRegionsCache = data;
      return data;
    });
  return atlasRegionsLoad;
}

/** Drop polygon rings whose centroid is farther than `maxDeg` from the region
 * center — keeps Tokyo Prefecture's main island while excluding the
 * Ogasawara / Izu islands that span ~1000 km offshore. */
function nearRings(
  geometry: AtlasGeometry,
  center: [number, number],
  maxDeg: number,
): AtlasRingCoord[][] {
  const out: AtlasRingCoord[][] = [];
  const collect = (poly: AtlasRingCoord[][]): void => {
    for (const ring of poly) {
      if (ring.length < 3) continue;
      let sx = 0;
      let sy = 0;
      for (const [x, y] of ring) {
        sx += x;
        sy += y;
      }
      const cx = sx / ring.length;
      const cy = sy / ring.length;
      const dx = cx - center[0];
      const dy = cy - center[1];
      if (Math.sqrt(dx * dx + dy * dy) <= maxDeg) out.push(ring);
    }
  };
  if (geometry.type === "Polygon") {
    collect(geometry.coordinates);
  } else {
    for (const poly of geometry.coordinates) collect(poly);
  }
  return out;
}

function regionBoundarySeries(
  state: AtlasState,
  payload: WorldAtlasPayload,
  geo: AtlasGeoJson | null,
): Extract<NonNullable<EChartsOption["series"]>, object>[] {
  if (state.view !== "region" || !state.regionKey || !geo) return [];
  const region = payload.regions.find((r) => r.id === state.regionKey);
  if (!region) return [];
  const feature = geo.features.find((f) => f.properties.regionKey === state.regionKey);
  if (!feature) return [];

  // 60/zoom = scale-aware radius (zoom 12 → 5°, zoom 8 → 7.5°). Lower bound
  // 6° guarantees we keep the main island for high-zoom regions, while the
  // far offshore islands (Tokyo's Ogasawara/Izu at 8°+) are still excluded.
  const maxDeg = Math.max(60 / region.zoom, 6);
  const rings = nearRings(feature.geometry, region.center, maxDeg);
  if (rings.length === 0) return [];

  const pin = mapPinStyle(region.countryId);
  // Stroke (visible outline) + soft fill via two layered series so the
  // active province glows distinctly without disturbing world.json area fills.
  const fill: Extract<NonNullable<EChartsOption["series"]>, object> = {
    id: "region-boundary-fill",
    name: "region-boundary-fill",
    type: "lines",
    coordinateSystem: "geo",
    polyline: true,
    data: rings.map((coords) => ({ coords })),
    lineStyle: {
      color: pin.glow,
      width: 18,
      opacity: 0.18,
      shadowBlur: 26,
      shadowColor: pin.glow,
    },
    silent: true,
    zlevel: 1.6,
  };
  const stroke: Extract<NonNullable<EChartsOption["series"]>, object> = {
    id: "region-boundary-stroke",
    name: "region-boundary-stroke",
    type: "lines",
    coordinateSystem: "geo",
    polyline: true,
    data: rings.map((coords) => ({ coords })),
    lineStyle: {
      color: pin.core,
      width: 2,
      opacity: 0.95,
      shadowBlur: 12,
      shadowColor: pin.glow,
    },
    silent: true,
    zlevel: 2.2,
  };
  return [fill, stroke];
}

/** Alaska · left-edge framing anchor (阿拉斯加州). */
const LANDING_ALASKA_GEO: AtlasCoord = [-152, 61];
const LANDING_TOKYO_GEO_FALLBACK: AtlasCoord = [139.76, 35.68];

function tokyoAnchorFromPayload(scenes: WorldAtlasScene[]): AtlasCoord {
  const pts = scenes.filter((s) => s.countryId === "jp" && s.regionId === "tokyo");
  if (!pts.length) return LANDING_TOKYO_GEO_FALLBACK;
  const lng = pts.reduce((sum, s) => sum + s.geo[0], 0) / pts.length;
  const lat = pts.reduce((sum, s) => sum + s.geo[1], 0) / pts.length;
  return [lng, lat];
}

/** Short-arc longitude midpoint · Alaska west, Tokyo east across the Pacific. */
function pacificLngMid(alaskaLng: number, tokyoLng: number): number {
  let diff = tokyoLng - alaskaLng;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  let mid = alaskaLng + diff / 2;
  if (mid > 180) mid -= 360;
  if (mid < -180) mid += 360;
  return mid;
}

function readLandingTokyoScreenX(host?: HTMLElement): number {
  const shell = host?.closest(".landing-world-atlas") as HTMLElement | null;
  const raw =
    shell?.style.getPropertyValue("--landing-tokyo-screen-x").trim() ||
    getComputedStyle(document.documentElement)
      .getPropertyValue("--landing-tokyo-screen-x")
      .trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return 92;
  return Math.min(97, Math.max(84, n));
}

/** Short-arc longitude span (degrees). */
function shortLngSpan(westLng: number, eastLng: number): number {
  let diff = eastLng - westLng;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return Math.abs(diff);
}

interface LandingWorldFrame {
  center: AtlasCoord;
  zoom: number;
  layoutCenter: [string, string];
  layoutSize: string;
  aspectScale: number;
}

/**
 * Landing world · Tokyo pin at poster-side edge; Alaska visible on the left.
 */
function landingWorldFrame(
  payload: WorldAtlasPayload,
  host?: HTMLElement,
): LandingWorldFrame {
  const w = host?.clientWidth ?? 720;
  const h = Math.max(host?.clientHeight ?? 260, 1);
  const aspect = w / h;
  const wide = aspect >= 1.55;
  const tokyo = tokyoAnchorFromPayload(payload.scenes);
  const alaska = LANDING_ALASKA_GEO;
  const tokyoScreenX = readLandingTokyoScreenX(host);
  const pacificSpan = shortLngSpan(alaska[0], tokyo[0]) + 8;

  const center: AtlasCoord = [
    tokyo[0],
    alaska[1] * 0.24 + tokyo[1] * 0.76 - 2,
  ];
  const zoom =
    payload.initialZoom *
    (wide
      ? 1.78 + Math.min(0.22, pacificSpan / 100) - Math.min(0.06, (aspect - 1.55) * 0.04)
      : 1.68);
  const sizePct = wide
    ? Math.round(106 + Math.min(14, (aspect - 1.55) * 10))
    : 102;

  return {
    center,
    zoom,
    layoutCenter: [`${tokyoScreenX}%`, "46%"],
    layoutSize: `${sizePct}%`,
    aspectScale: wide ? 0.73 : 0.77,
  };
}

function viewportFor(
  state: AtlasState,
  payload: WorldAtlasPayload,
  landing = false,
  host?: HTMLElement,
): { center: AtlasCoord; zoom: number; scaleLimit: { min: number; max: number } } {
  const limits = { min: 0.6, max: 32 };
  if (state.view === "region" && state.regionKey) {
    const r = payload.regions.find((x) => x.id === state.regionKey);
    if (r) return { center: r.center, zoom: r.zoom, scaleLimit: limits };
  }
  if (state.view === "country" && state.countryId) {
    const c = payload.countries.find((x) => x.id === state.countryId);
    if (c) return { center: c.center, zoom: c.zoom, scaleLimit: limits };
  }
  if (landing && state.view === "world") {
    const frame = landingWorldFrame(payload, host);
    return { center: frame.center, zoom: frame.zoom, scaleLimit: limits };
  }
  return {
    center: payload.initialCenter,
    zoom: payload.initialZoom,
    scaleLimit: limits,
  };
}

function buildOption(
  payload: WorldAtlasPayload,
  state: AtlasState,
  landParticles: [number, number][],
  graticule: GraticuleLine[],
  landing = false,
  host?: HTMLElement,
): EChartsOption {
  const vp = viewportFor(state, payload, landing, host);
  const landingFrame =
    landing && state.view === "world" ? landingWorldFrame(payload, host) : null;
  const landingGeo = landingFrame
    ? {
        layoutCenter: landingFrame.layoutCenter,
        layoutSize: landingFrame.layoutSize,
        aspectScale: landingFrame.aspectScale,
      }
    : null;

  const tooltip: NonNullable<EChartsOption["tooltip"]> = {
    trigger: "item",
    backgroundColor: "rgba(4, 12, 22, 0.96)",
    borderColor: GEO_BORDER,
    borderWidth: 1,
    padding: [12, 16],
    textStyle: {
      color: "#e8f4ff",
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 22,
    },
    extraCssText:
      'font-family:"Noto Sans SC",system-ui,sans-serif;box-shadow:0 10px 28px rgba(0,0,0,0.48);border-radius:10px;max-width:240px;',
    formatter: (params) => {
      if (!params || typeof params !== "object" || !("seriesType" in params)) return "";
      if (params.seriesType !== "effectScatter") return "";
      const data = params.data as { meta?: string } | undefined;
      if (!data?.meta) return "";
      const hubKey =
        state.regionKey && data.meta ? parseClusterHubMeta(data.meta) : null;
      if (hubKey && state.regionKey) {
        const cluster = clusterRegionScenes(payload.scenes, state.regionKey).find(
          (c) => c.key === hubKey,
        );
        const pin = mapPinStyle(
          cluster?.scenes[0]?.countryId ?? payload.scenes[0]?.countryId ?? "cn",
        );
        const tip = langTip(payload, "cluster_expand") ?? "→ 点击展开缩略图";
        const collapseTip = "→ 点击收起";
        const isExpanded = state.spider?.clusterKey === hubKey;
        const title = cluster?.scenes[0]?.name.split(" · ")[0] ?? "街景";
        return `${atlasTooltipTitle(pin.core, title)}${atlasTooltipAction(isExpanded ? collapseTip : tip)}`;
      }
      const scene = payload.scenes.find((x) => x.id === data.meta);
      if (!scene) return "";
      const pin = mapPinStyle(scene.countryId);
      const inRegion = state.view === "region" && state.regionKey === `${scene.countryId}__${scene.regionId}`;
      const cluster = inRegion && state.regionKey
        ? clusterForScene(clusterRegionScenes(payload.scenes, state.regionKey), data.meta)
        : undefined;
      const isExpanded = state.spider?.clusterKey === cluster?.key;
      let action = payload.i18n.tip_zoom;
      if (landing && state.view === "world") {
        action = "→ 单击选中 · 不放大";
      } else if (inRegion) {
        if (cluster && cluster.sceneIds.length > 1 && !isExpanded) {
          action = langTip(payload, "cluster_expand") ?? "→ 点击展开缩略图";
        } else {
          action = payload.i18n.tip_navigate;
        }
      }
      return `${atlasTooltipTitle(pin.core, scene.name)}${atlasTooltipSub(scene.tag)}${atlasTooltipAction(action)}`;
    },
  };

  return {
    backgroundColor: landing ? "transparent" : MAP_BG,
    animation: true,
    animationDurationUpdate: 720,
    animationEasingUpdate: "cubicInOut",
    tooltip,
    geo: {
      map: "world",
      roam: true,
      zoom: vp.zoom,
      center: vp.center,
      scaleLimit: vp.scaleLimit,
      ...(landingGeo ?? {}),
      silent: true,
      itemStyle: {
        areaColor: landing ? "#0c1a2a" : GEO_FILL,
        borderColor: landing ? "rgba(126, 200, 255, 0.42)" : GEO_BORDER,
        borderWidth: landing ? 0.55 : 0.45,
        shadowColor: landing ? "rgba(0, 180, 255, 0.14)" : "rgba(0, 180, 255, 0.08)",
        shadowBlur: landing ? 10 : 8,
      },
      emphasis: { disabled: true },
      label: { show: false },
    },
    series: [
      {
        id: "graticule",
        name: "graticule",
        type: "lines",
        coordinateSystem: "geo",
        polyline: true,
        data: graticule,
        lineStyle: { color: GRATICULE, width: 0.6, opacity: 0.55 },
        silent: true,
        zlevel: 0,
      },
      {
        id: "land-dots",
        name: "land-dots",
        type: "scatter",
        coordinateSystem: "geo",
        data: landParticles,
        symbol: "circle",
        symbolSize: 1.2,
        large: true,
        largeThreshold: 2000,
        itemStyle: {
          color: LAND_DOT,
          opacity: 0.42,
          shadowBlur: 2,
          shadowColor: "rgba(126, 200, 255, 0.35)",
        },
        silent: true,
        zlevel: 1,
      },
      ...regionBoundarySeries(state, payload, atlasRegionsCache),
      ...sceneSeriesByCountry(payload, payload.scenes, state, landing),
    ] as EChartsOption["series"],
  };
}

function langTip(payload: WorldAtlasPayload, key: keyof WorldAtlasPayload["i18n"]): string | undefined {
  return payload.i18n[key];
}

export interface WorldAtlasChartController {
  resize(): void;
  dispose(): void;
  setView(state: Partial<AtlasState>): void;
}

function waitForHostSize(host: HTMLElement, maxFrames = 60): Promise<void> {
  return new Promise((resolve) => {
    let n = 0;
    const tick = (): void => {
      if (host.clientWidth > 40 && host.clientHeight > 40) {
        resolve();
        return;
      }
      n += 1;
      if (n >= maxFrames) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function setCrumbWrap(crumbs: HTMLElement, key: string, show: boolean): void {
  const wrap = crumbs.querySelector<HTMLElement>(`[data-crumb-wrap="${key}"]`);
  if (wrap) wrap.hidden = !show;
}

function markCrumbCurrent(
  crumbs: HTMLElement,
  level: "world" | "country" | "region" | "city" | null,
): void {
  crumbs.querySelectorAll<HTMLElement>("[data-atlas-level], [data-crumb='city']").forEach((el) => {
    const isCity = el.dataset.crumb === "city";
    const elLevel = isCity ? "city" : el.dataset.atlasLevel;
    const current = elLevel === level;
    el.classList.toggle("world-atlas-explorer__crumb--current", current);
    if (current) el.setAttribute("aria-current", "location");
    else el.removeAttribute("aria-current");
  });
}

function syncBreadcrumb(
  root: HTMLElement,
  state: AtlasState,
  payload: WorldAtlasPayload,
): void {
  root.dataset.atlasView = state.view;
  root.dataset.atlasCountry = state.countryId ?? "";
  root.dataset.atlasRegion = state.regionKey ?? "";
  root.dataset.atlasSpider = state.spider ? "expanded" : "";

  const crumbs = root.querySelector<HTMLElement>("[data-world-atlas-crumbs]");
  if (!crumbs) return;

  const countryId =
    state.countryId ??
    (state.regionKey ? (state.regionKey.split("__")[0] as CountryId) : null);
  const country = countryId ? payload.countries.find((c) => c.id === countryId) ?? null : null;
  const region = state.regionKey
    ? payload.regions.find((r) => r.id === state.regionKey) ?? null
    : null;

  let cityLabel: string | null = null;
  if (state.spider && state.regionKey) {
    const cluster = clusterRegionScenes(payload.scenes, state.regionKey).find(
      (c) => c.key === state.spider!.clusterKey,
    );
    if (cluster) cityLabel = clusterCityLabel(cluster, payload.lang);
  }

  root.dataset.atlasCity = cityLabel ?? "";

  const countryEl = crumbs.querySelector<HTMLElement>('[data-crumb="country"]');
  const regionEl = crumbs.querySelector<HTMLElement>('[data-crumb="region"]');
  const cityEl = crumbs.querySelector<HTMLElement>('[data-crumb="city"]');
  const hintEl = crumbs.querySelector<HTMLElement>("[data-world-atlas-hint]");

  const showCountry = Boolean(country && state.view !== "world");
  const showRegion = Boolean(region && (state.view === "region" || cityLabel));
  const showCity = Boolean(cityLabel);

  if (countryEl && country) {
    countryEl.textContent = country.name;
    countryEl.dataset.countryId = country.id;
  } else if (countryEl) {
    countryEl.textContent = "";
    delete countryEl.dataset.countryId;
  }
  if (regionEl && region) {
    regionEl.textContent = region.name;
    regionEl.dataset.regionKey = region.id;
  } else if (regionEl) {
    regionEl.textContent = "";
    delete regionEl.dataset.regionKey;
  }
  if (cityEl) {
    cityEl.textContent = cityLabel ?? "";
  }

  setCrumbWrap(crumbs, "country", showCountry);
  setCrumbWrap(crumbs, "region", showRegion);
  setCrumbWrap(crumbs, "city", showCity);

  let currentLevel: "world" | "country" | "region" | "city" | null = "world";
  if (cityLabel) currentLevel = "city";
  else if (state.view === "region" && region) currentLevel = "region";
  else if (state.view === "country" && country) currentLevel = "country";
  markCrumbCurrent(crumbs, currentLevel);

  if (hintEl) {
    if (state.spider) {
      hintEl.textContent =
        langTip(payload, "hint_spider") ?? "点选上方缩略图卡片进入街景 · Esc 收起";
    } else {
      hintEl.textContent =
        state.view === "world" ? payload.i18n.hint_world : payload.i18n.hint_region;
    }
  }
}

export function createWorldAtlasChart(
  root: HTMLElement,
  host: HTMLElement,
  payload: WorldAtlasPayload,
  onSceneNavigate: (href: string) => void,
): WorldAtlasChartController {
  let chart: ECharts | null = null;
  let mapReady: Promise<void> | null = null;
  let disposed = false;
  const state: AtlasState = {
    view: "world",
    countryId: null,
    regionKey: null,
    landingSelection: null,
    spider: null,
  };
  const landing = root.classList.contains("world-atlas-explorer--landing");
  let suppressZrClear = false;

  const expandSpider = (cluster: SceneCluster): void => {
    state.spider = {
      clusterKey: cluster.key,
      sceneIds: cluster.sceneIds,
      center: cluster.center,
    };
  };

  const ensureMap = (ec: EchartsGlobal): Promise<void> => {
    if (mapReady) return mapReady;
    mapReady = Promise.all([
      fetch(payload.worldJsonUrl).then((r) => {
        if (!r.ok) throw new Error(`world.json ${r.status}`);
        return r.json();
      }),
      loadMapAssets(),
      // Real province / state polygons (Natural Earth admin_1 trimmed,
      // ~315 KB). Failure is non-fatal — boundary rendering just skips.
      loadAtlasRegions().catch((err) => {
        console.warn("[world-atlas] atlas-regions load failed", err);
        return null;
      }),
    ]).then(([geoJson, assets]) => {
      if (disposed) return;
      ec.registerMap("world", geoJson);
      (host as HTMLElement & { _mapAssets?: typeof assets })._mapAssets = assets;
    });
    return mapReady;
  };

  let clickRegistry = new Map<string, ClickCell>();

  const syncCards = (): void => {
    syncSpiderCards({
      host,
      chart,
      payload,
      regionKey: state.regionKey,
      spider: state.spider,
      onNavigate: onSceneNavigate,
    });
  };

  let lastHostW = 0;
  let lastHostH = 0;
  /** User panned/zoomed landing world view — keep geo, only resize canvas. */
  let landingViewCustomized = false;

  const render = (): void => {
    if (!chart || disposed) return;
    const assets = (host as HTMLElement & { _mapAssets?: Awaited<ReturnType<typeof loadMapAssets>> })
      ._mapAssets;
    if (!assets) return;
    const option = buildOption(payload, state, assets.particles, assets.graticule, landing, host);
    clickRegistry = buildClickRegistry(option.series);
    chart.setOption(option, {
      notMerge: true,
    });
    syncBreadcrumb(root, state, payload);
    syncCards();
  };

  /** Landing world · update pin highlight only (keep geo viewport). */
  const renderLandingPinState = (): void => {
    if (!chart || disposed || !landing || state.view !== "world") return;
    const sceneSeries = sceneSeriesByCountry(payload, payload.scenes, state, landing);
    chart.setOption({ series: sceneSeries });
  };

  const clearSpider = (): void => {
    state.spider = null;
    clearSpiderCards(host);
  };

  const setView = (next: Partial<AtlasState>): void => {
    if (next.view === "world") {
      clearSpider();
      state.countryId = null;
      state.regionKey = null;
      state.landingSelection = null;
      state.view = "world";
      landingViewCustomized = false;
      render();
      return;
    }
    if (next.view === "country") {
      clearSpider();
      state.view = "country";
      state.regionKey = null;
      if (next.countryId) state.countryId = next.countryId;
      render();
      return;
    }
    if (next.regionKey != null && next.regionKey !== state.regionKey) {
      clearSpider();
    }
    Object.assign(state, next);
    if (state.regionKey) {
      state.view = "region";
      state.countryId = state.regionKey.split("__")[0] as CountryId;
    }
    render();
  };

  const handleSceneClick = (meta: string, regionKey: string): void => {
    suppressZrClear = true;
    const hubKey = parseClusterHubMeta(meta);
    if (hubKey) {
      const rk = state.regionKey ?? regionKey;
      const cluster = clusterRegionScenes(payload.scenes, rk).find((c) => c.key === hubKey);
      if (cluster) {
        if (state.view !== "region" || state.regionKey !== rk) {
          setView({ view: "region", regionKey: rk });
        }
        if (state.spider?.clusterKey === hubKey) {
          clearSpider();
          render();
          return;
        }
        expandSpider(cluster);
        render();
      }
      return;
    }

    const scene = payload.scenes.find((s) => s.id === meta);
    if (!scene) return;

    /** Landing homepage · world view: select only, never zoom into region. */
    if (landing && state.view === "world") {
      const deselect = state.landingSelection === meta;
      state.landingSelection = deselect ? null : meta;
      root.dispatchEvent(
        new CustomEvent("scf:atlas-focus", {
          bubbles: true,
          detail: deselect
            ? { cleared: true }
            : { countryId: scene.countryId, regionId: scene.regionId },
        }),
      );
      renderLandingPinState();
      return;
    }

    root.dispatchEvent(
      new CustomEvent("scf:atlas-focus", {
        bubbles: true,
        detail: { countryId: scene.countryId, regionId: scene.regionId },
      }),
    );

    if (state.view === "world" || state.view === "country" || state.regionKey !== regionKey) {
      clearSpider();
      setView({ view: "region", regionKey, countryId: scene.countryId });
      return;
    }

    const cluster = clusterForScene(clusterRegionScenes(payload.scenes, state.regionKey), meta);
    if (cluster && cluster.sceneIds.length > 1) {
      expandSpider(cluster);
      render();
      return;
    }

    onSceneNavigate(scene.streetsHref);
  };

  host.style.position = "relative";
  host.style.backgroundColor = landing ? "transparent" : MAP_BG;

  const onCrumbClick = (ev: Event): void => {
    const target = ev.target as HTMLElement;
    const btn = target.closest<HTMLElement>("[data-atlas-level]");
    if (!btn) return;
    ev.preventDefault();
    const level = btn.dataset.atlasLevel;
    if (level === "world") {
      setView({ view: "world" });
      return;
    }
    if (level === "country") {
      const cid = (btn.dataset.countryId ?? state.countryId) as CountryId | undefined;
      if (cid) setView({ view: "country", countryId: cid });
      return;
    }
    if (level === "region") {
      const rk = btn.dataset.regionKey ?? state.regionKey;
      if (rk) setView({ view: "region", regionKey: rk });
    }
  };
  const crumbs = root.querySelector<HTMLElement>("[data-world-atlas-crumbs]");
  if (crumbs) crumbs.addEventListener("click", onCrumbClick);

  const start = async (): Promise<void> => {
    if (disposed || chart) return;
    try {
      const ec = await loadEchartsLib();
      if (disposed) return;
      await waitForHostSize(host);
      if (disposed) return;
      chart = ec.init(host, undefined, { renderer: "canvas" });
      chart.on("click", (params) => {
        if (params.seriesType !== "effectScatter") return;
        const hit = resolveSceneClick(
          {
            seriesId: params.seriesId != null ? String(params.seriesId) : undefined,
            dataIndex: params.dataIndex,
            data: params.data,
          },
          clickRegistry,
        );
        if (!hit) return;
        handleSceneClick(hit.meta, hit.regionKey);
      });
      chart.getZr().on("click", () => {
        requestAnimationFrame(() => {
          if (suppressZrClear) {
            suppressZrClear = false;
            return;
          }
          if (landing && state.view === "world" && state.landingSelection) {
            state.landingSelection = null;
            renderLandingPinState();
            root.dispatchEvent(
              new CustomEvent("scf:atlas-focus", {
                bubbles: true,
                detail: { cleared: true },
              }),
            );
            return;
          }
          if (!state.spider) return;
          clearSpider();
          render();
        });
      });
      chart.on("georoam", () => {
        if (landing && state.view === "world") {
          landingViewCustomized = true;
        }
        syncCards();
      });
      await ensureMap(ec);
      if (!chart || disposed) return;
      render();
      chart.resize();
    } catch (err) {
      console.error("[world-atlas] init failed", err);
      showMapError(
        host,
        "地图加载失败，请硬刷新 (Ctrl+Shift+R) 或重新运行 npm run dev",
      );
      if (root) delete root.dataset.worldAtlasInit;
    }
  };

  void start();

  const landingShell = landing
    ? (root.closest(".landing-world-atlas") as HTMLElement | null)
    : null;
  const resizeObs = new ResizeObserver(() => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    const sizeChanged =
      landing &&
      (Math.abs(w - lastHostW) > 3 || Math.abs(h - lastHostH) > 3);
    if (sizeChanged) {
      lastHostW = w;
      lastHostH = h;
      if (!(landing && state.view === "world" && landingViewCustomized)) {
        render();
      }
    }
    chart?.resize();
    syncCards();
  });
  resizeObs.observe(host);
  if (landingShell && landingShell !== host) resizeObs.observe(landingShell);

  const onLandingLayout = (): void => {
    if (!landing || state.view !== "world" || !chart) return;
    requestAnimationFrame(() => {
      if (!landingViewCustomized) {
        render();
      }
      chart?.resize();
      syncCards();
    });
  };
  window.addEventListener("scf:landing-map-layout", onLandingLayout);

  const onKey = (ev: KeyboardEvent): void => {
    if (ev.key !== "Escape") return;
    if (state.spider) {
      clearSpider();
      render();
      return;
    }
    if (state.view === "region") {
      if (state.countryId) setView({ view: "country", countryId: state.countryId });
      else setView({ view: "world" });
      return;
    }
    if (state.view === "country") {
      setView({ view: "world" });
    }
  };
  root.addEventListener("keydown", onKey);
  if (!root.hasAttribute("tabindex")) root.setAttribute("tabindex", "-1");

  return {
    resize() {
      chart?.resize();
      syncCards();
    },
    dispose() {
      disposed = true;
      resizeObs.disconnect();
      window.removeEventListener("scf:landing-map-layout", onLandingLayout);
      crumbs?.removeEventListener("click", onCrumbClick);
      root.removeEventListener("keydown", onKey);
      clearSpiderCards(host);
      chart?.dispose();
      chart = null;
    },
    setView,
  };
}

const controllers = new WeakMap<HTMLElement, WorldAtlasChartController>();

export function initWorldAtlasExplorer(root: HTMLElement): void {
  const host = root.querySelector<HTMLElement>("[data-world-atlas-host]");
  if (!host) return;

  if (root.dataset.worldAtlasInit === "1") {
    controllers.get(root)?.resize();
    return;
  }
  if (root.dataset.worldAtlasInit === "pending") return;

  const script = root.querySelector<HTMLScriptElement>("[data-world-atlas-config]");
  if (!script?.textContent) return;
  let payload: WorldAtlasPayload;
  try {
    payload = JSON.parse(script.textContent) as WorldAtlasPayload;
  } catch {
    return;
  }

  root.dataset.worldAtlasInit = "pending";
  const ctrl = createWorldAtlasChart(root, host, payload, (href) => {
    location.assign(href);
  });
  controllers.set(root, ctrl);
  root.dataset.worldAtlasInit = "1";
}

function mountWorldAtlas(): void {
  document
    .querySelectorAll<HTMLElement>("[data-world-atlas-explorer]")
    .forEach((root) => {
      initWorldAtlasExplorer(root);
    });
}

function scheduleMapMount(): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(mountWorldAtlas);
  });
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleMapMount, { once: true });
  } else {
    scheduleMapMount();
  }
}

export function disposeWorldAtlasExplorer(root: HTMLElement): void {
  controllers.get(root)?.dispose();
  controllers.delete(root);
  delete root.dataset.worldAtlasInit;
}
