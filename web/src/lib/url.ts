import type { Lang } from "./i18n";

import { legacyLangRedirect } from "./locale-path";



const ALLOWED: Lang[] = ["zh", "en", "ja"];



/**

 * @deprecated v0.3 �?use `resolveLang(Astro.currentLocale)` and path prefixes.

 * Kept for middleware / legacy redirect helpers.

 */

export function readLang(url: URL): Lang {

  const q = url.searchParams.get("lang");

  if (q && ALLOWED.includes(q as Lang)) return q as Lang;

  return "zh";

}



export { legacyLangRedirect };

