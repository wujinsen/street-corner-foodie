import type { CountryId } from "./types";

const FAVICON_BY_COUNTRY: Record<CountryId, string> = {
  cn: "/favicon-cn.svg",
  jp: "/favicon-jp.svg",
  us: "/favicon-us.svg",
  fr: "/favicon.svg",
  uk: "/favicon.svg",
  de: "/favicon.svg",
  za: "/favicon.svg",
  nz: "/favicon.svg",
  antarctica: "/favicon.svg",
};

export function countryFavicon(country: CountryId): string {
  return FAVICON_BY_COUNTRY[country];
}
