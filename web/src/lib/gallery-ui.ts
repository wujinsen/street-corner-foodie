/** v0.6.1 · gallery strings (canonical source: UI.gallery in i18n.ts). */
import { UI, t, type Lang } from "./i18n";
import type { Multilang } from "./types";

export const GALLERY_UI = UI.gallery;

export function gt(m: Multilang, lang: Lang): string {
  return t(m, lang);
}
