import { t, type Lang } from "./i18n";
import type { CountryId, Multilang } from "./types";

/** WGS84 + IANA timezone + label for Open-Meteo queries (city representative point). */
export interface RegionAtmosphereGeo {
  lat: number;
  lon: number;
  timezone: string;
  /** Shown on chip so users know which coordinates are queried. */
  place: Multilang;
}

const GEO: Record<string, RegionAtmosphereGeo> = {
  "cn/hainan": {
    lat: 20.044,
    lon: 110.2,
    timezone: "Asia/Shanghai",
    place: { zh: "海口", en: "Haikou", ja: "海口" },
  },
  "cn/hebei": {
    lat: 38.042,
    lon: 114.515,
    timezone: "Asia/Shanghai",
    place: { zh: "石家庄", en: "Shijiazhuang", ja: "石家荘" },
  },
  "cn/jiangsu": {
    lat: 32.06,
    lon: 118.78,
    timezone: "Asia/Shanghai",
    place: { zh: "南京", en: "Nanjing", ja: "南京" },
  },
  "cn/guangdong": {
    lat: 23.129,
    lon: 113.264,
    timezone: "Asia/Shanghai",
    place: { zh: "广州", en: "Guangzhou", ja: "広州" },
  },
  "cn/sichuan": {
    lat: 30.57,
    lon: 104.07,
    timezone: "Asia/Shanghai",
    place: { zh: "成都", en: "Chengdu", ja: "成都" },
  },
  "cn/beijing": {
    lat: 39.904,
    lon: 116.407,
    timezone: "Asia/Shanghai",
    place: { zh: "北京", en: "Beijing", ja: "北京" },
  },
  "cn/zhejiang": {
    lat: 30.25,
    lon: 120.17,
    timezone: "Asia/Shanghai",
    place: { zh: "杭州", en: "Hangzhou", ja: "杭州" },
  },
  "cn/xizang": {
    lat: 29.657,
    lon: 91.117,
    timezone: "Asia/Shanghai",
    place: { zh: "拉萨", en: "Lhasa", ja: "ラサ" },
  },
  "jp/tokyo": {
    lat: 35.681,
    lon: 139.767,
    timezone: "Asia/Tokyo",
    place: { zh: "东京", en: "Tokyo", ja: "東京" },
  },
  "jp/fuji": {
    lat: 35.36,
    lon: 138.727,
    timezone: "Asia/Tokyo",
    place: { zh: "河口湖", en: "Kawaguchiko", ja: "河口湖" },
  },
  "us/ny": {
    lat: 40.713,
    lon: -74.006,
    timezone: "America/New_York",
    place: { zh: "纽约", en: "New York", ja: "ニューヨーク" },
  },
  "us/tx": {
    lat: 29.76,
    lon: -95.37,
    timezone: "America/Chicago",
    place: { zh: "休斯顿", en: "Houston", ja: "ヒューストン" },
  },
  "us/la": {
    lat: 34.052,
    lon: -118.244,
    timezone: "America/Los_Angeles",
    place: { zh: "洛杉矶", en: "Los Angeles", ja: "ロサンゼルス" },
  },
  "us/nola": {
    lat: 29.951,
    lon: -90.071,
    timezone: "America/Chicago",
    place: { zh: "新奥尔良", en: "New Orleans", ja: "ニューオーリンズ" },
  },
  "fr/paris": {
    lat: 48.857,
    lon: 2.352,
    timezone: "Europe/Paris",
    place: { zh: "巴黎", en: "Paris", ja: "パリ" },
  },
  "uk/london": {
    lat: 51.509,
    lon: -0.118,
    timezone: "Europe/London",
    place: { zh: "伦敦", en: "London", ja: "ロンドン" },
  },
  "de/cologne": {
    lat: 50.941,
    lon: 6.96,
    timezone: "Europe/Berlin",
    place: { zh: "科隆", en: "Cologne", ja: "ケルン" },
  },
  "za/south_africa": {
    lat: -34.357,
    lon: 18.489,
    timezone: "Africa/Johannesburg",
    place: { zh: "好望角", en: "Cape Point", ja: "ケープポイント" },
  },
  "nz/nz": {
    lat: -36.848,
    lon: 174.763,
    timezone: "Pacific/Auckland",
    place: { zh: "奥克兰", en: "Auckland", ja: "オークランド" },
  },
  "antarctica/antarctica": {
    lat: -64.75,
    lon: -62.55,
    timezone: "Antarctica/Palmer",
    place: { zh: "天堂湾", en: "Paradise Harbor", ja: "パラダイス湾" },
  },
};

export function getRegionAtmosphereGeo(
  countryId: CountryId,
  regionId: string,
): RegionAtmosphereGeo | undefined {
  return GEO[`${countryId}/${regionId}`];
}

export function geoPlaceLabel(geo: RegionAtmosphereGeo, lang: Lang): string {
  return t(geo.place, lang);
}
