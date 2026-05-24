import { t, type Lang } from "./i18n";
import { localePath } from "./locale-path";
import { posterImageUrl } from "./posters";
import {
  getStreetConfig,
  streetImageUrl,
  streetPreferredImageUrl,
  type StreetRegionConfig,
} from "./streets";
import { getZines, zineImageUrl } from "./zines";
import type { CountryId, Poster } from "./types";

export interface LandingBentoSlide {
  src: string;
  alt: string;
  title: string;
  sub?: string;
  href: string;
}

const MAX_SLIDES = 5;

function cap<T>(items: T[]): T[] {
  return items.slice(0, MAX_SLIDES);
}

function rotateToSlug<T extends { slug: string }>(items: T[], startSlug?: string): T[] {
  if (!startSlug || items.length < 2) return items;
  const idx = items.findIndex((p) => p.slug === startSlug);
  if (idx <= 0) return items;
  return [...items.slice(idx), ...items.slice(0, idx)];
}

/** 海报 bento：区域内有图海报轮播 */
export function buildLandingPosterSlides(
  posters: Poster[],
  lang: Lang,
  countryId: CountryId,
  regionId: string,
  startSlug?: string,
): LandingBentoSlide[] {
  const withImg = posters.filter((p) => posterImageUrl(p, false));
  const ordered = rotateToSlug(withImg, startSlug);
  return cap(
    ordered.map((p) => {
      const src = posterImageUrl(p, false)!;
      return {
        src,
        alt: t(p.name, lang),
        title: t(p.name, lang),
        href: localePath(lang, `/${countryId}/${regionId}/poster/${p.slug}`),
      };
    }),
  );
}

/** 小志 bento：有 story 图的小志轮播 */
export function buildLandingZineSlides(
  lang: Lang,
  countryId: CountryId,
  regionId: string,
  startSlug?: string,
): LandingBentoSlide[] {
  const zines = getZines(countryId, regionId);
  const withImg = zines.filter((z) => zineImageUrl(z, "story", false, 0));
  const ordered = rotateToSlug(withImg, startSlug);
  return cap(
    ordered.map((z) => {
      const src = zineImageUrl(z, "story", false, 0)!;
      return {
        src,
        alt: t(z.name, lang),
        title: t(z.name, lang),
        href: localePath(lang, `/${countryId}/${regionId}/zine/${z.slug}`),
      };
    }),
  );
}

function streetSlide(
  config: StreetRegionConfig,
  sceneId: string,
  lang: Lang,
  countryId: CountryId,
  regionId: string,
): LandingBentoSlide | null {
  const scene = config.scenes.find((s) => s.id === sceneId);
  const src = streetPreferredImageUrl(config, sceneId, "wide");
  if (!scene || !src) return null;
  return {
    src,
    alt: t(scene.name, lang),
    title: t(scene.name, lang),
    sub: t(scene.tag, lang),
    href: localePath(lang, `/${countryId}/${regionId}/street/${sceneId}`),
  };
}

/** 骑楼等街景 bento：多场景 wide 图轮播 */
export function buildLandingStreetSlides(
  lang: Lang,
  countryId: CountryId,
  regionId: string,
  preferSceneId?: string,
): LandingBentoSlide[] {
  const config = getStreetConfig(countryId, regionId);
  if (!config) return [];
  const ids = config.scenes.map((s) => s.id);
  const ordered = preferSceneId
    ? [preferSceneId, ...ids.filter((id) => id !== preferSceneId)]
    : ids;
  const slides: LandingBentoSlide[] = [];
  for (const id of ordered) {
    const slide = streetSlide(config, id, lang, countryId, regionId);
    if (slide) slides.push(slide);
    if (slides.length >= MAX_SLIDES) break;
  }
  return slides;
}

/** 单场景街景 bento（默认夜景 wide 为首帧） */
export function buildLandingFocusStreetSlides(
  lang: Lang,
  countryId: CountryId,
  regionId: string,
  focusSceneId: string,
  leadMood: "day" | "night" = "night",
): LandingBentoSlide[] {
  const config = getStreetConfig(countryId, regionId);
  if (!config) return [];
  const scene = config.scenes.find((s) => s.id === focusSceneId);
  if (!scene) return buildLandingStreetSlides(lang, countryId, regionId, focusSceneId);

  const otherMood: "day" | "night" = leadMood === "night" ? "day" : "night";
  const variants: Array<{ sceneId: string; time: "day" | "night"; frame: "wide" | "standard" }> = [
    { sceneId: focusSceneId, time: leadMood, frame: "wide" },
    { sceneId: focusSceneId, time: otherMood, frame: "wide" },
    { sceneId: focusSceneId, time: leadMood, frame: "standard" },
    { sceneId: focusSceneId, time: otherMood, frame: "standard" },
  ];

  const slides: LandingBentoSlide[] = [];
  const seen = new Set<string>();
  for (const v of variants) {
    const src = streetImageUrl(config, v.sceneId, v.time, v.frame);
    if (!src || seen.has(src)) continue;
    seen.add(src);
    slides.push({
      src,
      alt: t(scene.name, lang),
      title: t(scene.name, lang),
      sub: t(scene.tag, lang),
      href: localePath(lang, `/${countryId}/${regionId}/street/${focusSceneId}`),
    });
    if (slides.length >= MAX_SLIDES) break;
  }
  return slides;
}

/** 老爸茶 bento：仅同场景昼夜/画幅，不混入其它街景（与骑楼 tile 分工） */
export function buildLandingTeaSlides(
  lang: Lang,
  countryId: CountryId,
  regionId: string,
  focusSceneId = "laobacha",
): LandingBentoSlide[] {
  return buildLandingFocusStreetSlides(lang, countryId, regionId, focusSceneId, "day");
}
