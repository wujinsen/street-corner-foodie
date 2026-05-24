import { REGIONS, findRegion, getPosters } from "./load-content";
import type { Country, CountryId } from "./types";

export { REGIONS, findRegion, getPosters };

export const COUNTRIES: Record<CountryId, Country> = {
  cn: { id: "cn", flag: "🇨🇳", name: { zh: "中国", en: "China", ja: "中国" }, vstrip: "中華風味" },
  jp: { id: "jp", flag: "🇯🇵", name: { zh: "日本", en: "Japan", ja: "日本" }, vstrip: "ニッポンの味" },
  us: { id: "us", flag: "🇺🇸", name: { zh: "美国", en: "USA", ja: "アメリカ" }, vstrip: "AMERICAN CLASSICS" },
};

export const COUNTRY_ORDER: CountryId[] = ["cn", "jp", "us"];
