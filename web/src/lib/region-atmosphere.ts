import { t, type Lang } from "./i18n";
import type { CountryId, Multilang } from "./types";
import type { WeatherClimate } from "./weather-chip";

/**
 * Curated regional climate copy for gallery hero — **not** shown as live temp/sky on landing chip.
 * Landing weather chip uses Open-Meteo at `region-atmosphere-geo` city coordinates.
 */
export interface RegionAtmosphere {
  mood: Multilang;
  /** Local civil sunset-ish time (HH:mm) for copy, not computed. */
  sunsetLocal: string;
  tempC: number;
  climate: Multilang;
  /** Token preset for landing weather chip particles / glow. */
  climatePreset: WeatherClimate;
}

const ATMOSPHERE: Record<string, RegionAtmosphere> = {
  "cn/hainan": {
    mood: { zh: "黄昏", en: "Sunset", ja: "夕暮れ" },
    sunsetLocal: "18:42",
    tempC: 28,
    climate: { zh: "热带", en: "Tropical", ja: "熱帯" },
    climatePreset: "tropical",
  },
  "cn/hebei": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "19:28",
    tempC: 22,
    climate: { zh: "华北", en: "North China", ja: "華北" },
    climatePreset: "temperate",
  },
  "cn/jiangsu": {
    mood: { zh: "多云", en: "Cloudy", ja: "くもり" },
    sunsetLocal: "18:55",
    tempC: 24,
    climate: { zh: "江南", en: "Jiangnan", ja: "江南" },
    climatePreset: "temperate",
  },
  "cn/guangdong": {
    mood: { zh: "阵雨", en: "Showers", ja: "にわか雨" },
    sunsetLocal: "18:50",
    tempC: 29,
    climate: { zh: "南亚热", en: "Subtropical", ja: "亜熱帯" },
    climatePreset: "subtropical",
  },
  "cn/sichuan": {
    mood: { zh: "阴", en: "Overcast", ja: "曇り" },
    sunsetLocal: "19:38",
    tempC: 26,
    climate: { zh: "盆地", en: "Basin", ja: "盆地" },
    climatePreset: "continental",
  },
  "cn/beijing": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "19:12",
    tempC: 22,
    climate: { zh: "温带", en: "Temperate", ja: "温帯" },
    climatePreset: "temperate",
  },
  "cn/zhejiang": {
    mood: { zh: "薄雾", en: "Mist", ja: "薄霧" },
    sunsetLocal: "18:48",
    tempC: 25,
    climate: { zh: "江南", en: "Jiangnan", ja: "江南" },
    climatePreset: "temperate",
  },
  "jp/tokyo": {
    mood: { zh: "夕暮", en: "Dusk", ja: "夕暮れ" },
    sunsetLocal: "18:32",
    tempC: 22,
    climate: { zh: "海洋性", en: "Maritime", ja: "海洋性" },
    climatePreset: "maritime",
  },
  "jp/fuji": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "17:45",
    tempC: 16,
    climate: { zh: "山地", en: "Alpine", ja: "山地" },
    climatePreset: "continental",
  },
  "us/ny": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "19:58",
    tempC: 21,
    climate: { zh: "温带", en: "Temperate", ja: "温帯" },
    climatePreset: "temperate",
  },
  "us/tx": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "20:12",
    tempC: 29,
    climate: { zh: "干热", en: "Dry heat", ja: "乾燥暑" },
    climatePreset: "arid",
  },
  "us/la": {
    mood: { zh: "晴", en: "Sunny", ja: "晴れ" },
    sunsetLocal: "19:45",
    tempC: 24,
    climate: { zh: "地中海", en: "Med-adjacent", ja: "地中海性" },
    climatePreset: "arid",
  },
  "us/nola": {
    mood: { zh: "闷热", en: "Humid", ja: "むし暑" },
    sunsetLocal: "19:52",
    tempC: 27,
    climate: { zh: "亚热带湿", en: "Humid subtrop.", ja: "湿潤亜熱帯" },
    climatePreset: "subtropical",
  },
  "fr/paris": {
    mood: { zh: "薄暮", en: "Dusk", ja: "薄暮" },
    sunsetLocal: "21:15",
    tempC: 18,
    climate: { zh: "温带", en: "Temperate", ja: "温帯" },
    climatePreset: "temperate",
  },
  "uk/london": {
    mood: { zh: "多云", en: "Cloudy", ja: "くもり" },
    sunsetLocal: "20:45",
    tempC: 16,
    climate: { zh: "海洋性", en: "Maritime", ja: "海洋性" },
    climatePreset: "maritime",
  },
  "de/cologne": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "21:30",
    tempC: 17,
    climate: { zh: "莱茵", en: "Rhine", ja: "ライン" },
    climatePreset: "temperate",
  },
  "za/south_africa": {
    mood: { zh: "星夜", en: "Starry", ja: "星夜" },
    sunsetLocal: "18:05",
    tempC: 19,
    climate: { zh: "大西洋岸", en: "Atlantic coast", ja: "大西洋岸" },
    climatePreset: "maritime",
  },
  "nz/nz": {
    mood: { zh: "晴", en: "Clear", ja: "晴れ" },
    sunsetLocal: "17:35",
    tempC: 15,
    climate: { zh: "海洋性", en: "Maritime", ja: "海洋性" },
    climatePreset: "maritime",
  },
  "antarctica/antarctica": {
    mood: { zh: "极昼暮光", en: "Polar dusk", ja: "極地の夕暮れ" },
    sunsetLocal: "22:30",
    tempC: -2,
    climate: { zh: "极地", en: "Polar", ja: "極地" },
    climatePreset: "continental",
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
