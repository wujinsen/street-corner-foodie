import type { CountryId } from "./types";

/** ECharts effectScatter · aligned with tokens.css `--accent-c` / BRAND.md §3.3 */
export interface MapPinStyle {
  core: string;
  glow: string;
  /** Ripple stroke in rgba */
  ripple: string;
}

export const MAP_PIN_BY_COUNTRY: Record<CountryId, MapPinStyle> = {
  /** 中国 · 朱红 */
  cn: {
    core: "#E60012",
    glow: "rgba(230, 0, 18, 0.88)",
    ripple: "rgba(255, 59, 59, 0.55)",
  },
  /** 日本 · 樱霓虹 */
  jp: {
    core: "#FF3B7A",
    glow: "rgba(255, 59, 122, 0.9)",
    ripple: "rgba(255, 45, 154, 0.5)",
  },
  /** 美国 · 青霓虹 */
  us: {
    core: "#00D9E0",
    glow: "rgba(0, 217, 224, 0.9)",
    ripple: "rgba(0, 242, 255, 0.45)",
  },
  fr: {
    core: "#0055A4",
    glow: "rgba(0, 85, 164, 0.88)",
    ripple: "rgba(0, 85, 164, 0.45)",
  },
  uk: {
    core: "#C8102E",
    glow: "rgba(200, 16, 46, 0.88)",
    ripple: "rgba(200, 16, 46, 0.45)",
  },
  de: {
    core: "#FFCC00",
    glow: "rgba(255, 204, 0, 0.88)",
    ripple: "rgba(255, 204, 0, 0.45)",
  },
  za: {
    core: "#007A4D",
    glow: "rgba(0, 122, 77, 0.88)",
    ripple: "rgba(0, 122, 77, 0.45)",
  },
  nz: {
    core: "#1A1A1A",
    glow: "rgba(26, 26, 26, 0.88)",
    ripple: "rgba(26, 26, 26, 0.45)",
  },
  antarctica: {
    core: "#7EB8E8",
    glow: "rgba(126, 184, 232, 0.88)",
    ripple: "rgba(126, 184, 232, 0.45)",
  },
};

export function mapPinStyle(countryId: CountryId): MapPinStyle {
  return MAP_PIN_BY_COUNTRY[countryId] ?? MAP_PIN_BY_COUNTRY.cn;
}

/** Browser chrome / meta theme-color · matches `--accent-c` core. */
export function countryThemeColor(countryId: CountryId): string {
  return MAP_PIN_BY_COUNTRY[countryId]?.core ?? MAP_PIN_BY_COUNTRY.cn.core;
}
