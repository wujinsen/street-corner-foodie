/** Static gallery page slices (?page= posters · ?zpage= zines). */

import { COUNTRY_POSTER_GRID_INITIAL } from "./gallery-reveal";

/** Mini-zine / country poster grid per page · gallery.png pill pagination */
export const GALLERY_ZINE_PAGE_SIZE = COUNTRY_POSTER_GRID_INITIAL;

export function pageFromSearch(search: string, pageParam: string, pageCount: number): number {
  const raw = new URLSearchParams(search).get(pageParam) ?? "0";
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.floor(n), Math.max(0, pageCount - 1));
}

export function pageCountFor(total: number, pageSize: number): number {
  if (total <= 0) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}

export function galleryPageHref(
  pathname: string,
  search: string,
  pageParam: string,
  pageIndex: number,
  hashAnchor?: string,
): string {
  const params = new URLSearchParams(search);
  params.delete("lang");
  if (pageIndex <= 0) params.delete(pageParam);
  else params.set(pageParam, String(pageIndex));
  const qs = params.toString();
  const base = pathname + (qs ? `?${qs}` : "");
  return hashAnchor ? `${base}#${hashAnchor}` : base;
}
