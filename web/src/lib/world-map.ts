import mapData from "../data/world-map.generated.json";
import { DESIGN_MAP_PINS } from "./design-map-pins";
import type { CountryId } from "./types";

export interface WorldMapLandPath {
  id: string;
  d: string;
}

export interface WorldMapData {
  width: number;
  height: number;
  /** Merged landmass outline (world silhouette) */
  landSilhouette: string;
  landPaths: WorldMapLandPath[];
  graticulePaths: string[];
  zones: Record<CountryId, string>;
  topoLines: string[];
  pins: Record<CountryId, { x: number; y: number }>;
}

export const WORLD_MAP = mapData as WorldMapData;

export function worldMapPin(country: CountryId): { x: number; y: number } {
  return WORLD_MAP.pins[country] ?? DESIGN_MAP_PINS[country] ?? WORLD_MAP.pins.cn;
}
