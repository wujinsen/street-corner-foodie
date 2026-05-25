import type { CountryId } from "./types";

/**
 * Pin + hover hotspots calibrated to
 * `public/design/alt-c/world-map-dark.png` (807×318).
 * Re-tune after re-exporting landing.png or changing crop in crop-landing-map-art.mjs.
 *
 * Hotspots must not overlap: old CN box (x 46%, w 38%) swallowed Europe → Hainan.
 * App countries: US = Americas + Europe; CN = China; JP = Japan.
 */
export const DESIGN_MAP_PINS: Record<CountryId, { x: number; y: number }> = {
  us: { x: 21, y: 41 },
  cn: { x: 66.5, y: 51 },
  jp: { x: 84, y: 31 },
  fr: { x: 48, y: 38 },
  uk: { x: 46, y: 32 },
  de: { x: 52, y: 34 },
  za: { x: 54, y: 78 },
  nz: { x: 92, y: 82 },
  antarctica: { x: 22, y: 92 },
};

export const DESIGN_MAP_HOTSPOTS: Record<
  CountryId,
  { x: number; y: number; w: number; h: number }
> = {
  /** Americas + Europe + Atlantic / Africa west (pin NYC ~21%,41%) */
  us: { x: 2, y: 12, w: 50, h: 56 },
  /** China mainland only — east of ~52% longitude on art */
  cn: { x: 54, y: 22, w: 20, h: 46 },
  /** Japan — right of China (pin ~84%,31%) */
  jp: { x: 74, y: 10, w: 22, h: 34 },
  fr: { x: 42, y: 28, w: 14, h: 18 },
  uk: { x: 40, y: 24, w: 14, h: 16 },
  de: { x: 48, y: 26, w: 12, h: 16 },
  za: { x: 48, y: 62, w: 14, h: 22 },
  nz: { x: 84, y: 72, w: 16, h: 18 },
  antarctica: { x: 14, y: 82, w: 18, h: 14 },
};
