import { assertPublicUrl } from "./assert-path";
import { getPosters, getRecipePosters, filterPostersByFlavor, POSTERS } from "./load-content";
export {
  getCountryPosters,
  getCountryFlavors,
  filterPostersByRegion,
  pickCountryFeatured,
  COUNTRY_SPOTLIGHT,
} from "./country-posters";

import type { CountryId, Poster } from "./types";

export { getPosters, getRecipePosters, filterPostersByFlavor, POSTERS };

const A_POSTER = "/asserts/Gourmet recipe2/";
const A_ZINE = "/asserts/mini-zine/";



export function findPoster(

  countryId: Parameters<typeof getPosters>[0],

  regionId: string,

  slug: string,

): Poster | undefined {

  return getPosters(countryId, regionId).find((p) => p.slug === slug);

}

/** Sidebar window in gallery list order; starts at current slug when set. */
export function getSidebarPosters(
  allPosters: Poster[],
  limit = 5,
  currentSlug?: string,
): Poster[] {
  if (!allPosters.length) return [];
  const idx = currentSlug ? allPosters.findIndex((p) => p.slug === currentSlug) : 0;
  const start = idx >= 0 ? idx : 0;
  return allPosters.slice(start, start + limit);
}



export function posterDetailPath(countryId: CountryId, regionId: string, slug: string): string {

  return `/${countryId}/${regionId}/poster/${slug}`;

}



export function posterImageUrl(p: Poster, useNoChar: boolean): string | null {

  if (p.placeholder) return null;

  const file = useNoChar && p.fileNoChar ? p.fileNoChar : p.file;

  if (!file) return null;

  const base = p.fromZine ? A_ZINE : A_POSTER;
  return assertPublicUrl(base, p.path, file);

}

