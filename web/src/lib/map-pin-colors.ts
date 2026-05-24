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
};

export function mapPinStyle(countryId: CountryId): MapPinStyle {
  return MAP_PIN_BY_COUNTRY[countryId] ?? MAP_PIN_BY_COUNTRY.cn;
}
