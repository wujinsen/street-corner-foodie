/** Parsed YAML frontmatter from docs/china|world/*.md (subset used by web). */

import type { Multilang } from "./types";

/** v0.2.1 · per-slug UI copy (name / tags / pin / desc) in region md. */
export interface WebPosterMeta {
  name: Multilang;
  tags: { zh: string[]; en: string[]; ja: string[] };
  pin: string;
  desc: Multilang;
  romaji?: string;
}

export interface RegionFrontmatter {

  region?: string;

  region_en?: string;

  country?: string;

  type?: string;

  province?: string;

  cuisine_tags?: string[];

  gourmet_poster_dir?: string;

  mini_zine_dir?: string;

  street_view_dir?: string;

  street_view_fuji_dir?: string;

  gourmet_posters?: string[];

  gourmet_posters_era_samples?: string[];

  mini_zine?: string[];

  street_view_approved?: string[];

  street_view_fuji_approved?: string[];

  /** v0.2+ · slug list for gallery sort priority (see web/docs/ARCHITECTURE.md) */

  web_editor_pick?: string[];

  /** 首页地图城市卡背景（basename，与 `street_view_dir` 同目录） */
  web_gallery_hero_landing?: string;

  /** 国家画廊 #posters Tab · `country-hero-scene` 背景（basename，与 `street_view_dir` 同目录） */
  web_gallery_hero_posters?: string;

  /** 国家画廊 #zines Tab · `country-hero-scene` 背景（basename，与 `street_view_dir` 同目录） */
  web_gallery_hero_zines?: string;

  /**
   * v0.2.1 · poster UI overlay.
   * Single-region docs: `{ slug: WebPosterMeta }`.
   * Multi-region (usa.md): `{ ny: { slug: ... }, la: { ... } }`.
   */
  web_posters?: Record<string, WebPosterMeta | Record<string, WebPosterMeta>>;

}

