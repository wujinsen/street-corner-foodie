import { HAINAN_ISLAND_GEO } from "./street-geo";
import { publicAssetUrl } from "./public-asset-origin";
import type { CountryId } from "./types";

type RegionMedalKey = `${CountryId}/${string}`;

/** Relative path under `asserts/` for regional seal artwork (not food posters). */
const REGION_MEDAL_REL: Partial<Record<RegionMedalKey, string>> = {
  "cn/hainan": "brand/seals/cn_hainan_medal.png",
};

/** WGS84 anchor for landing-map medal placement (lng, lat). */
const REGION_MEDAL_GEO: Partial<Record<RegionMedalKey, [number, number]>> = {
  "cn/hainan": [HAINAN_ISLAND_GEO.center[0], HAINAN_ISLAND_GEO.center[1]],
};

export interface RegionMedalSpec {
  countryId: CountryId;
  regionId: string;
  regionKey: string;
  url: string;
  geo: [number, number];
}

/** Public `/asserts/…` URL for a region medal, or null when none is registered. */
export function regionMedalUrl(countryId: CountryId, regionId: string): string | null {
  const rel = REGION_MEDAL_REL[`${countryId}/${regionId}` as RegionMedalKey];
  return rel ? publicAssetUrl(`/asserts/${rel}`) : null;
}

/** Registered medals for landing-map overlays (geo-anchored). */
export function listLandingRegionMedals(): RegionMedalSpec[] {
  const specs: RegionMedalSpec[] = [];
  for (const key of Object.keys(REGION_MEDAL_REL) as RegionMedalKey[]) {
    const url = regionMedalUrl(...(key.split("/") as [CountryId, string]));
    const geo = REGION_MEDAL_GEO[key];
    if (!url || !geo) continue;
    const [countryId, regionId] = key.split("/") as [CountryId, string];
    specs.push({
      countryId,
      regionId,
      regionKey: `${countryId}__${regionId}`,
      url,
      geo,
    });
  }
  return specs;
}
