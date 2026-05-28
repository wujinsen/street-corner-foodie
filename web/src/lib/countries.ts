import { REGIONS, findRegion, getPosters } from "./load-content";
import type { Country, CountryId } from "./types";

export { REGIONS, findRegion, getPosters };

export const COUNTRIES: Record<CountryId, Country> = {
  cn: { id: "cn", flag: "🇨🇳", name: { zh: "中国", en: "China", ja: "中国" }, vstrip: "中華風味" },
  jp: { id: "jp", flag: "🇯🇵", name: { zh: "日本", en: "Japan", ja: "日本" }, vstrip: "ニッポンの味" },
  us: { id: "us", flag: "🇺🇸", name: { zh: "美国", en: "USA", ja: "アメリカ" }, vstrip: "AMERICAN CLASSICS" },
  fr: { id: "fr", flag: "🇫🇷", name: { zh: "法国", en: "France", ja: "フランス" }, vstrip: "SAVEURS FRANÇAISES" },
  uk: { id: "uk", flag: "🇬🇧", name: { zh: "英国", en: "United Kingdom", ja: "イギリス" }, vstrip: "BRITISH FLAVOUR" },
  de: { id: "de", flag: "🇩🇪", name: { zh: "德国", en: "Germany", ja: "ドイツ" }, vstrip: "DEUTSCHE KÜCHE" },
  za: { id: "za", flag: "🇿🇦", name: { zh: "南非", en: "South Africa", ja: "南アフリカ" }, vstrip: "SOUTH AFRICAN FLAVOUR" },
  nz: { id: "nz", flag: "🇳🇿", name: { zh: "新西兰", en: "New Zealand", ja: "ニュージーランド" }, vstrip: "AOTEAROA FLAVOUR" },
  antarctica: { id: "antarctica", flag: "🇦🇶", name: { zh: "南极", en: "Antarctica", ja: "南極" }, vstrip: "POLAR EXPEDITION" },
  arctic: { id: "arctic", flag: "🧊", name: { zh: "北极", en: "Arctic", ja: "北極" }, vstrip: "ARCTIC EXPEDITION" },
};

export const COUNTRY_ORDER: CountryId[] = ["cn", "jp", "us", "fr", "uk", "de", "za", "nz", "antarctica", "arctic"];
