import type { CountryId } from "./types";

/** WGS84 lng/lat for ECharts geo + effectScatter */
export type StreetGeoCoord = [number, number];

export interface StreetGeoPoint {
  id: string;
  name: string;
  value: StreetGeoCoord;
}

export interface StreetExplorerGeoMap {
  worldJsonUrl: string;
  center: StreetGeoCoord;
  zoom: number;
  points: StreetGeoPoint[];
}

export interface RegionGeoConfig {
  center: StreetGeoCoord;
  /** Degrees longitude per 1% minimap x offset from center (50%) */
  lngPerPin: number;
  /** Degrees latitude per 1% minimap y offset from center (50%; +y = south) */
  latPerPin: number;
  zoom: number;
}

/** Hainan island — Haikou metro (asserts/.../haikou/) + Sanya coast (.../sanya/). */
export const HAINAN_ISLAND_GEO: RegionGeoConfig = {
  center: [109.95, 19.15],
  lngPerPin: 0.015,
  latPerPin: 0.022,
  zoom: 7,
};

export const REGION_GEO: Record<string, RegionGeoConfig> = {
  "cn:hainan": HAINAN_ISLAND_GEO,
  "cn:hebei": { center: [114.48, 38.04], lngPerPin: 0.008, latPerPin: 0.006, zoom: 10 },
  "cn:beijing": { center: [116.407, 39.916], lngPerPin: 0.003, latPerPin: 0.0025, zoom: 12 },
  "cn:zhejiang": { center: [120.15, 30.25], lngPerPin: 0.004, latPerPin: 0.003, zoom: 11 },
  "cn:jiangsu": { center: [119.2, 32.2], lngPerPin: 0.012, latPerPin: 0.009, zoom: 9 },
  "cn:guangdong": { center: [113.5, 23.2], lngPerPin: 0.015, latPerPin: 0.011, zoom: 9 },
  "cn:sichuan": { center: [104.5, 30.4], lngPerPin: 0.018, latPerPin: 0.013, zoom: 8 },
  "cn:shaanxi": { center: [108.94, 34.26], lngPerPin: 0.006, latPerPin: 0.004, zoom: 11 },
  "jp:tokyo": { center: [139.76, 35.68], lngPerPin: 0.004, latPerPin: 0.003, zoom: 11 },
  "jp:fuji": { center: [138.76, 35.5], lngPerPin: 0.02, latPerPin: 0.015, zoom: 9 },
  "us:ny": { center: [-73.98, 40.75], lngPerPin: 0.004, latPerPin: 0.003, zoom: 11 },
  "us:la": { center: [-118.25, 34.05], lngPerPin: 0.006, latPerPin: 0.004, zoom: 10 },
  "us:tx": { center: [-97.74, 30.27], lngPerPin: 0.02, latPerPin: 0.015, zoom: 8 },
  "us:nola": { center: [-90.07, 29.95], lngPerPin: 0.006, latPerPin: 0.004, zoom: 11 },
};

export const COUNTRY_FALLBACK: Record<CountryId, RegionGeoConfig> = {
  cn: { center: [104.2, 35.5], lngPerPin: 0.02, latPerPin: 0.015, zoom: 4 },
  jp: { center: [139.0, 36.2], lngPerPin: 0.02, latPerPin: 0.015, zoom: 5 },
  us: { center: [-98.5, 39.5], lngPerPin: 0.02, latPerPin: 0.015, zoom: 4 },
};

export function mapPinToGeo(
  mapPin: { x: number; y: number },
  cfg: RegionGeoConfig,
): StreetGeoCoord {
  return [
    cfg.center[0] + (mapPin.x - 50) * cfg.lngPerPin,
    cfg.center[1] - (mapPin.y - 50) * cfg.latPerPin,
  ];
}

function clampPct(n: number): number {
  return Math.min(92, Math.max(8, n));
}

/** Inverse of mapPinToGeo — for minimap % from WGS84. */
export function geoToMapPin(
  geo: StreetGeoCoord,
  cfg: RegionGeoConfig,
): { x: number; y: number } {
  return {
    x: clampPct(50 + (geo[0] - cfg.center[0]) / cfg.lngPerPin),
    y: clampPct(50 - (geo[1] - cfg.center[1]) / cfg.latPerPin),
  };
}

function regionGeoConfig(countryId: CountryId, regionId: string): RegionGeoConfig {
  return REGION_GEO[`${countryId}:${regionId}`] ?? COUNTRY_FALLBACK[countryId];
}

/** Fit ECharts geo center/zoom so every scene pin stays visible (not stacked). */
export function fitGeoViewport(coords: StreetGeoCoord[]): {
  center: StreetGeoCoord;
  zoom: number;
} {
  if (coords.length === 0) {
    return { center: [0, 0], zoom: 4 };
  }
  if (coords.length === 1) {
    return { center: coords[0]!, zoom: 12 };
  }
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const padLng = Math.max((maxLng - minLng) * 0.4, 0.05);
  const padLat = Math.max((maxLat - minLat) * 0.4, 0.04);
  const center: StreetGeoCoord = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
  const span = Math.max(maxLng - minLng + padLng, (maxLat - minLat + padLat) * 0.9);
  let zoom = 11;
  if (span > 3) zoom = 4;
  else if (span > 1.2) zoom = 6;
  else if (span > 0.55) zoom = 7;
  else if (span > 0.28) zoom = 8;
  else if (span > 0.14) zoom = 9;
  else if (span > 0.09) zoom = 10;
  else zoom = 11;
  return { center, zoom };
}

function geoPointsFromScenes(
  countryId: CountryId,
  regionId: string,
  scenes: { id: string; name: string; mapPin: { x: number; y: number }; geo?: StreetGeoCoord }[],
): StreetGeoPoint[] {
  const cfg = regionGeoConfig(countryId, regionId);
  return scenes.map((s) => ({
    id: s.id,
    name: s.name,
    value: s.geo ?? mapPinToGeo(s.mapPin, cfg),
  }));
}

export function buildStreetExplorerGeoMap(
  countryId: CountryId,
  regionId: string,
  scenes: { id: string; name: string; mapPin: { x: number; y: number }; geo?: StreetGeoCoord }[],
): StreetExplorerGeoMap {
  const points = geoPointsFromScenes(countryId, regionId, scenes);
  const coords = points.map((p) => p.value);
  const cfg = regionGeoConfig(countryId, regionId);
  const viewport =
    points.length >= 2 ? fitGeoViewport(coords) : { center: cfg.center, zoom: cfg.zoom };
  return {
    worldJsonUrl: "/geo/world.json",
    center: viewport.center,
    zoom: viewport.zoom,
    points,
  };
}
