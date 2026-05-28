import { findRegion } from "./countries";
import { localePath, regionGalleryHref, resolveLang, streetGalleryHref } from "./locale-path";
import { findStreetScene, getStreetConfig } from "./streets";
import type { CountryId, Lang } from "./types";

/** Canonical gallery street URL for search / links (no locale prefix; hash included). */
export function streetSearchIndexPath(country: CountryId, regionId: string, sceneId: string): string {
  const params = new URLSearchParams({ region: regionId, scene: sceneId });
  return `/${country}/?${params.toString()}#streets`;
}

/** Legacy `/cn/hainan/street/{scene}/` → gallery `#streets` (page frontmatter only). */
export function streetLegacyRedirectUrl(
  lang: Lang,
  country: CountryId,
  regionId: string,
  sceneId: string,
  requestUrl: URL,
): string {
  const region = findRegion(country, regionId);
  const config = getStreetConfig(country, regionId);
  const scene = findStreetScene(country, regionId, sceneId);

  if (!region || !config || !scene) {
    return region
      ? regionGalleryHref(lang, country, regionId, { hash: "streets" })
      : localePath(lang, "/");
  }

  return streetGalleryHref(lang, country, regionId, sceneId, requestUrl);
}

/** Resolve redirect target from Astro page context. */
export function streetLegacyRedirectFromAstro(astro: {
  currentLocale: string | undefined;
  params: { country?: string; region?: string; scene?: string };
  url: URL;
}): string {
  const lang = resolveLang(astro.currentLocale);
  const country = astro.params.country as CountryId;
  const regionId = astro.params.region!;
  const sceneId = astro.params.scene!;
  return streetLegacyRedirectUrl(lang, country, regionId, sceneId, astro.url);
}
