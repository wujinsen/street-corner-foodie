import type { Lang } from "./i18n";

/** Match a dish tag string against a flavor chip label (zh/en/ja). */
export function tagMatchesFlavor(tag: string, flavor: string): boolean {
  if (tag === flavor || tag.includes(flavor) || flavor.includes(tag)) return true;

  if ((flavor === "椰香" || flavor === "Coconut") && /椰|coco/i.test(tag)) return true;

  if ((flavor === "清甜" || flavor === "Sweet") && /甜|sweet|甘/i.test(tag)) return true;

  if ((flavor === "酸辣" || flavor === "Sour-spicy") && /酸|辣|sour|spicy/i.test(tag)) return true;

  if ((flavor === "海鲜" || flavor === "Seafood") && /海|sea/i.test(tag)) return true;

  return false;
}

export function collectFlavorTags(
  tags: { zh: string[]; en: string[]; ja: string[] },
  lang: Lang,
): string[] {
  const merged = [...(tags[lang] ?? []), ...tags.zh, ...tags.en, ...tags.ja];
  return [...new Set(merged.filter(Boolean))];
}

export function matchesFlavorChip(
  tags: { zh: string[]; en: string[]; ja: string[] },
  lang: Lang,
  flavor: string | null,
): boolean {
  if (!flavor) return true;
  return collectFlavorTags(tags, lang).some((t) => tagMatchesFlavor(t, flavor));
}

/** Serialize for `data-filter-tags` on gallery cards. */
export function filterTagsAttr(
  tags: { zh: string[]; en: string[]; ja: string[] },
  lang: Lang,
): string {
  return collectFlavorTags(tags, lang).join("|");
}
