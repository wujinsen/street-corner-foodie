import type { CountryId, Lang } from "./types";

/** Per page lang + country theme — avoids loading all 9 families on every route. */
export function googleFontsHref(lang: Lang, country: CountryId): string {
  const families = ["Inter:wght@400;500;600;700"];
  const needCn = lang === "zh" || country === "cn";
  const needJp = lang === "ja" || country === "jp";
  const needUs = lang === "en" || country === "us";

  if (needCn) {
    families.push("Noto+Sans+SC:wght@400;500;600", "Noto+Serif+SC:wght@400;600;700");
  }
  if (needJp) {
    families.push("Noto+Sans+JP:wght@400;500;600", "Noto+Serif+JP:wght@500;700");
  }
  if (needUs) {
    families.push(
      "Playfair+Display:wght@600;700",
      "Roboto+Slab:wght@500;700",
      "JetBrains+Mono:wght@500;600",
    );
  }

  return `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
}
