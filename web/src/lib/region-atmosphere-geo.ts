import type { CountryId } from "./types";

/** WGS84 + IANA timezone for live weather / SunCalc (landing bento chip). */
export interface RegionAtmosphereGeo {
  lat: number;
  lon: number;
  timezone: string;
}

const GEO: Record<string, RegionAtmosphereGeo> = {
  "cn/hainan": { lat: 20.02, lon: 110.35, timezone: "Asia/Shanghai" },
  "cn/hebei": { lat: 38.04, lon: 114.48, timezone: "Asia/Shanghai" },
  "cn/jiangsu": { lat: 32.06, lon: 118.78, timezone: "Asia/Shanghai" },
  "cn/guangdong": { lat: 23.13, lon: 113.26, timezone: "Asia/Shanghai" },
  "cn/sichuan": { lat: 30.57, lon: 104.07, timezone: "Asia/Shanghai" },
  "cn/beijing": { lat: 39.9, lon: 116.4, timezone: "Asia/Shanghai" },
  "cn/zhejiang": { lat: 30.25, lon: 120.17, timezone: "Asia/Shanghai" },
  "jp/tokyo": { lat: 35.68, lon: 139.69, timezone: "Asia/Tokyo" },
  "jp/fuji": { lat: 35.36, lon: 138.73, timezone: "Asia/Tokyo" },
  "us/ny": { lat: 40.71, lon: -74.01, timezone: "America/New_York" },
  "us/tx": { lat: 29.76, lon: -95.37, timezone: "America/Chicago" },
  "us/la": { lat: 34.05, lon: -118.24, timezone: "America/Los_Angeles" },
  "us/nola": { lat: 29.95, lon: -90.07, timezone: "America/Chicago" },
};

export function getRegionAtmosphereGeo(
  countryId: CountryId,
  regionId: string,
): RegionAtmosphereGeo | undefined {
  return GEO[`${countryId}/${regionId}`];
}
