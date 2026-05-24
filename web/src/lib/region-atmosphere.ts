import { t, type Lang } from "./i18n";
import type { CountryId, Multilang } from "./types";

/**
 * Curated “today on the ground” atmosphere per region — typical May evening,
 * not live weather. Update seasonally by hand; no fetch/API in v0.6.
 */
export interface RegionAtmosphere {
  mood: Multilang;
  /** Local civil sunset-ish time (HH:mm) for copy, not computed. */
  sunsetLocal: string;
  tempC: number;
  climate: Multilang;
}

const ATMOSPHERE: Record<string, RegionAtmosphere> = {
  "cn/hainan": {
    mood: { zh: "黄昏", en: "Sunset", ja: "夕暮れ" },
    sunsetLocal: "18:42",
    tempC: 28,
    climate: { zh: "热带", en: "Tropical", ja: "熱帯" },
  },
  "cn/hebei": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "19:28",
    tempC: 22,
    climate: { zh: "华北", en: "North China", ja: "華北" },
  },
  "cn/jiangsu": {
    mood: { zh: "多云", en: "Cloudy", ja: "くもり" },
    sunsetLocal: "18:55",
    tempC: 24,
    climate: { zh: "江南", en: "Jiangnan", ja: "江南" },
  },
  "cn/guangdong": {
    mood: { zh: "阵雨", en: "Showers", ja: "にわか雨" },
    sunsetLocal: "18:50",
    tempC: 29,
    climate: { zh: "南亚热", en: "Subtropical", ja: "亜熱帯" },
  },
  "cn/sichuan": {
    mood: { zh: "阴", en: "Overcast", ja: "曇り" },
    sunsetLocal: "19:38",
    tempC: 26,
    climate: { zh: "盆地", en: "Basin", ja: "盆地" },
  },
  "cn/beijing": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "19:12",
    tempC: 22,
    climate: { zh: "温带", en: "Temperate", ja: "温帯" },
  },
  "cn/zhejiang": {
    mood: { zh: "薄雾", en: "Mist", ja: "薄霧" },
    sunsetLocal: "18:48",
    tempC: 25,
    climate: { zh: "江南", en: "Jiangnan", ja: "江南" },
  },
  "jp/tokyo": {
    mood: { zh: "夕暮", en: "Dusk", ja: "夕暮れ" },
    sunsetLocal: "18:32",
    tempC: 22,
    climate: { zh: "海洋性", en: "Maritime", ja: "海洋性" },
  },
  "jp/fuji": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "17:45",
    tempC: 16,
    climate: { zh: "山地", en: "Alpine", ja: "山地" },
  },
  "us/ny": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "19:58",
    tempC: 21,
    climate: { zh: "温带", en: "Temperate", ja: "温帯" },
  },
  "us/tx": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "20:12",
    tempC: 29,
    climate: { zh: "干热", en: "Dry heat", ja: "乾燥暑" },
  },
  "us/la": {
    mood: { zh: "晴", en: "Sunny", ja: "晴れ" },
    sunsetLocal: "19:45",
    tempC: 24,
    climate: { zh: "地中海", en: "Med-adjacent", ja: "地中海性" },
  },
  "us/nola": {
    mood: { zh: "闷热", en: "Humid", ja: "むし暑" },
    sunsetLocal: "19:52",
    tempC: 27,
    climate: { zh: "亚热带湿", en: "Humid subtrop.", ja: "湿潤亜熱帯" },
  },
};

export function getRegionAtmosphere(
  countryId: CountryId,
  regionId: string,
): RegionAtmosphere | undefined {
  return ATMOSPHERE[`${countryId}/${regionId}`];
}

export function formatAtmosphereLine(atmosphere: RegionAtmosphere, lang: Lang): string {
  return `${t(atmosphere.mood, lang)} ${atmosphere.sunsetLocal} · ${atmosphere.tempC}°C · ${t(atmosphere.climate, lang)}`;
}

/** Landing bento weather chip (same source as region gallery hero). */
export function formatAtmosphereBento(
  atmosphere: RegionAtmosphere,
  lang: Lang,
): { headline: string; temp: string; sub: string } {
  return {
    headline: `${t(atmosphere.climate, lang)} · ${t(atmosphere.mood, lang)}`,
    temp: `${atmosphere.tempC}°C`,
    sub: `${t(atmosphere.mood, lang)} ${atmosphere.sunsetLocal}`,
  };
}
