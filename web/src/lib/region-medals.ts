import { publicAssetUrl } from "./public-asset-origin";
import type { CountryId } from "./types";

type RegionMedalKey = `${CountryId}/${string}`;

/** Relative path under `asserts/` for regional seal artwork (not food posters). */
const REGION_MEDAL_REL: Partial<Record<RegionMedalKey, string>> = {
  "cn/hainan": "brand/seals/cn_hainan_medal.png",
};

/** Public `/asserts/…` URL for a region medal, or null when none is registered. */
export function regionMedalUrl(countryId: CountryId, regionId: string): string | null {
  const rel = REGION_MEDAL_REL[`${countryId}/${regionId}` as RegionMedalKey];
  return rel ? publicAssetUrl(`/asserts/${rel}`) : null;
}
