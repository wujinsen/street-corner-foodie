/** Progressive reveal for region/country gallery grids (?pmore / ?zmore). */

import type { Lang } from "./i18n";
import { UI, t } from "./i18n";

export const GALLERY_REVEAL_INITIAL = 12;
export const GALLERY_REVEAL_STEP = 12;
/** Country page poster grid · theme-cn 4×2 */
export const COUNTRY_POSTER_GRID_INITIAL = 8;

export function moreFromSearch(search: string, param: string): number {
  const raw = new URLSearchParams(search).get(param) ?? "0";
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export function revealVisibleCount(
  total: number,
  moreSteps: number,
  initial = GALLERY_REVEAL_INITIAL,
  step = GALLERY_REVEAL_STEP,
): number {
  if (total <= 0) return 0;
  return Math.min(total, initial + moreSteps * step);
}

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

export function formatGalleryShowing(
  lang: Lang,
  start: number,
  end: number,
  total: number,
): string {
  return fill(t(UI.gallery.showing_of, lang), { start, end, total });
}

export function formatLoadMore(lang: Lang, n: number): string {
  return fill(t(UI.gallery.load_more_n, lang), { n });
}
