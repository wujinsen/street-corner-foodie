import { UI, t, type Lang } from "./i18n";
import type { Poster, Region } from "./types";

/** Mini-zine §① 风味 — five axes (radar polygon). */
export const FLAVOR_AXIS_KEYS = [
  "aroma",
  "sweet",
  "aftertaste",
  "spice",
  "richness",
] as const;

export type FlavorAxisKey = (typeof FLAVOR_AXIS_KEYS)[number];

export function flavorAxisLabels(lang: Lang): string[] {
  return FLAVOR_AXIS_KEYS.map((key) => t(UI.flavor_axes[key], lang));
}

function slugSeed(slug: string): number {
  let sum = 0;
  for (const c of slug) sum += c.charCodeAt(0);
  return sum;
}

function clampScore(n: number): number {
  return Math.max(36, Math.min(96, Math.round(n)));
}

function starFromScore(score: number): number {
  return Math.max(1, Math.min(5, Math.round(score / 20)));
}

/** 1–5 stars for legend (matches mini-zine star rows). */
export function flavorScoresToStars(scores: number[]): number[] {
  return scores.map(starFromScore);
}

function tagBlob(tags: string[]): string {
  return tags.join(" ").toLowerCase();
}

function scoreAroma(blob: string, seed: number): number {
  let s = 58 + (seed % 11);
  if (/鲜|香|海鲜|旨|umami|seafood|コク|香り/i.test(blob)) s += 22;
  if (/清|淡|light|清爽/i.test(blob)) s += 8;
  if (/椰|coconut|热带/i.test(blob)) s += 10;
  return clampScore(s);
}

function scoreSweet(blob: string, seed: number): number {
  let s = 48 + ((seed >> 2) % 13);
  if (/甜|糖|蜜|椰|糕|dessert|sweet|甘|はちみつ/i.test(blob)) s += 28;
  if (/酸|sour|vinegar/i.test(blob)) s -= 6;
  return clampScore(s);
}

function scoreAftertaste(blob: string, seed: number): number {
  let s = 52 + ((seed >> 4) % 12);
  if (/回味|浓|醇|香|煲|炖|braised|rich|コク/i.test(blob)) s += 24;
  if (/鲜|清汤|steamed/i.test(blob)) s += 12;
  return clampScore(s);
}

function scoreSpice(blob: string, seed: number): number {
  let s = 32 + ((seed >> 6) % 10);
  if (/辣|麻|椒|川|麻辣|spicy|pepper|辛|ピリ/i.test(blob)) s += 38;
  if (/酸|酸辣|curry/i.test(blob)) s += 14;
  if (/甜|清淡|椰|清/i.test(blob)) s -= 8;
  return clampScore(s);
}

function scoreRichness(blob: string, seed: number): number {
  let s = 50 + ((seed >> 8) % 14);
  if (/浓|厚|油|腻|煲|炖|锅|fat|rich|cream|奶酪|芝士/i.test(blob)) s += 22;
  if (/清|淡|汤|粥|steamed|light/i.test(blob)) s -= 10;
  if (/海鲜|牛|羊|肉|饭/i.test(blob)) s += 10;
  return clampScore(s);
}

/** Deterministic flavor polygon from dish tags + slug (0–100 per axis). */
export function buildFlavorPolygon(input: {
  poster?: Poster | null;
  region: Region;
  slug: string;
  lang: Lang;
}): { labels: string[]; scores: number[]; stars: number[] } {
  const { poster, region, slug, lang } = input;
  const labels = flavorAxisLabels(lang);
  const tags = poster
    ? (poster.tags[lang] ?? poster.tags.zh)
    : (region.flavors[lang] ?? region.flavors.zh);
  const blob = tagBlob(tags);
  const seed = slugSeed(slug);

  const scores = [
    scoreAroma(blob, seed),
    scoreSweet(blob, seed + 1),
    scoreAftertaste(blob, seed + 2),
    scoreSpice(blob, seed + 3),
    scoreRichness(blob, seed + 4),
  ];

  return { labels, scores, stars: flavorScoresToStars(scores) };
}
