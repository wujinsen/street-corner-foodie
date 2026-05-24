import { getRelativeLocaleUrl } from "astro:i18n";
import { LANGS, type Lang } from "./i18n";

export const DEFAULT_LOCALE: Lang = "zh";
export const PREFIXED_LOCALES: Lang[] = ["en", "ja"];

/** Build a locale-aware path (`/` · `/cn/hainan` · `/en/cn/hainan`). */
export function localePath(lang: Lang, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return getRelativeLocaleUrl(lang, "/");
  }
  return getRelativeLocaleUrl(lang, normalized);
}

export function resolveLang(locale: string | undefined): Lang {
  if (locale && LANGS.includes(locale as Lang)) return locale as Lang;
  return DEFAULT_LOCALE;
}

/** Switch language while keeping country/region/query (drops legacy `lang` param). */
export function switchLocalePath(target: Lang, url: URL): string {
  const pathname = stripLocalePrefix(url.pathname);
  const search = new URLSearchParams(url.searchParams);
  search.delete("lang");
  const qs = search.toString();
  return localePath(target, pathname) + (qs ? `?${qs}` : "");
}

const LOCALE_SEGMENT = new RegExp(`^/(${PREFIXED_LOCALES.join("|")})(/|$)`);

/** Remove leading `/en` or `/ja` from pathname. */
export function stripLocalePrefix(pathname: string): string {
  const m = pathname.match(LOCALE_SEGMENT);
  if (!m) return pathname || "/";
  const rest = pathname.slice(m[1].length + 1);
  return rest ? (rest.startsWith("/") ? rest : `/${rest}`) : "/";
}

/** Legacy `?lang=en|ja` → path prefix (302 target). */
export function legacyLangRedirect(url: URL): string | null {
  const q = url.searchParams.get("lang");
  if (!q || !LANGS.includes(q as Lang) || q === DEFAULT_LOCALE) {
    if (q === DEFAULT_LOCALE) {
      const next = new URL(url);
      next.searchParams.delete("lang");
      const qs = next.searchParams.toString();
      if (qs !== url.searchParams.toString()) {
        return next.pathname + (qs ? `?${qs}` : "");
      }
    }
    return null;
  }
  const next = new URL(url);
  next.searchParams.delete("lang");
  const qs = next.searchParams.toString();
  const base = stripLocalePrefix(next.pathname);
  return localePath(q as Lang, base) + (qs ? `?${qs}` : "");
}

/** Update only search params on the current locale path. */
export function samePageWithQuery(url: URL, mutate: (p: URLSearchParams) => void): string {
  const params = new URLSearchParams(url.searchParams);
  params.delete("lang");
  mutate(params);
  const qs = params.toString();
  return url.pathname + (qs ? `?${qs}` : "");
}

/** Canonical street explorer: `/{country}/?region={id}&scene={scene}#streets`. */
export function streetGalleryHref(
  lang: Lang,
  country: string,
  regionId: string,
  sceneId?: string,
  source?: URL,
): string {
  const params = source ? new URLSearchParams(source.searchParams) : new URLSearchParams();
  params.delete("lang");
  if (sceneId) params.set("scene", sceneId);
  return regionGalleryHref(lang, country, regionId, { hash: "streets", search: params });
}

/** Canonical province gallery: `/{country}/?region={id}#zines`. */
export function regionGalleryHref(
  lang: Lang,
  country: string,
  regionId: string,
  options?: { hash?: string; search?: URLSearchParams },
): string {
  const params = new URLSearchParams(options?.search);
  params.set("region", regionId);
  const qs = params.toString();
  const hash = options?.hash
    ? options.hash.startsWith("#")
      ? options.hash
      : `#${options.hash}`
    : "";
  return localePath(lang, `/${country}/`) + (qs ? `?${qs}` : "") + hash;
}

/** 301 target when retiring `/{country}/{region}/` and `/{country}/g/{region}/`. */
export function buildRegionGalleryRedirect(
  lang: Lang,
  country: string,
  regionId: string,
  url: URL,
): string {
  const sceneFromPath = url.pathname.match(/\/street\/([^/]+)/)?.[1];
  if (sceneFromPath) {
    try {
      return streetGalleryHref(lang, country, regionId, decodeURIComponent(sceneFromPath), url);
    } catch {
      return streetGalleryHref(lang, country, regionId, sceneFromPath, url);
    }
  }
  const params = new URLSearchParams(url.searchParams);
  params.delete("lang");
  params.set("region", regionId);
  const qs = params.toString();
  const base = localePath(lang, `/${country}/`) + (qs ? `?${qs}` : "");
  let hash = url.hash;
  if (!hash && /\/street\//.test(url.pathname)) hash = "#streets";
  return base + hash;
}
