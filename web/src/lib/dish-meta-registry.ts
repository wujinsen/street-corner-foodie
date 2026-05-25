/**
 * Build-time dish name registry: posters.json + extras + doc tables.
 * Used when region md has no `web_posters` entry (e.g. china.md → jiangsu).
 */
import type { WebPosterMeta } from "./content-schema";
import type { CountryId, Multilang } from "./types";
import type { PosterMeta } from "./lookup-poster-meta";

function metaKey(countryId: CountryId, regionId: string, slug: string): string {
  return `${countryId}/${regionId}/${slug}`;
}

import dishMetaExtra from "../data/dish-meta-extra.json";
import postersJson from "../../scripts/posters.json";

const DOC_MODULES = import.meta.glob("../../../docs/{china,world}/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

type JsonPoster = {
  slug: string;
  name?: Multilang;
  tags?: PosterMeta["tags"];
  pin?: string;
  desc?: Multilang;
  romaji?: string;
};

type ExtraRoot = Record<string, Record<string, WebPosterMeta>>;

const PIN_DEFAULTS: Record<string, string> = {
  "cn/hainan": "海南",
  "cn/hebei": "河北·石家庄",
  "cn/zhejiang": "浙江·杭州",
  "cn/jiangsu": "江苏",
  "cn/guangdong": "广东",
  "cn/sichuan": "四川",
  "cn/beijing": "北京",
  "cn/xizang": "西藏·拉萨",
  "cn/hunan": "湖南",
  "cn/fujian": "福建",
  "cn/liaoning": "东北",
  "cn/xinjiang": "西北",
  "cn/anhui": "安徽",
  "jp/tokyo": "東京",
  "jp/fuji": "富士",
  "us/ny": "美国·纽约",
  "us/tx": "美国·德州",
  "us/la": "美国·洛杉矶",
  "us/nola": "美国·新奥尔良",
  "fr/paris": "法国·巴黎",
  "uk/london": "英国·伦敦",
  "de/cologne": "德国·科隆",
  "za/south_africa": "南非·西开普",
  "nz/nz": "新西兰",
};

function emptyTags(): PosterMeta["tags"] {
  return { zh: [], en: [], ja: [] };
}

function jsonToMeta(p: JsonPoster): PosterMeta | null {
  if (!p.name?.zh || !/[\u4e00-\u9fff\u3040-\u30ff]/.test(p.name.zh)) return null;
  return {
    name: p.name,
    tags: p.tags ?? emptyTags(),
    pin: p.pin ?? "",
    desc: p.desc ?? { zh: "", en: "", ja: "" },
    ...(p.romaji ? { romaji: p.romaji } : {}),
  };
}

function webMetaToPosterMeta(m: WebPosterMeta): PosterMeta {
  return {
    name: m.name,
    tags: m.tags ?? emptyTags(),
    pin: m.pin ?? "",
    desc: m.desc ?? { zh: "", en: "", ja: "" },
    ...(m.romaji ? { romaji: m.romaji } : {}),
  };
}

/** Strip workflow notes (dates, 重做/首版) from doc table dish labels — not UI copy. */
function sanitizeDocDishZh(zh: string): string {
  return zh
    .trim()
    .replace(/~~/g, "")
    .replace(/\s*·\s*\d{4}-\d{2}-\d{2}(?:\s+重做|\s+首版)?.*$/u, "")
    .replace(/\s*·\s*(?:重做|首版).*$/u, "")
    .trim();
}

function setDocSlugZh(out: Map<string, string>, slug: string, rawZh: string): void {
  const zh = sanitizeDocDishZh(rawZh);
  if (!/[\u4e00-\u9fff]/.test(zh)) return;
  const prev = out.get(slug);
  if (!prev) {
    out.set(slug, zh);
    return;
  }
  const prevNoisy = /\d{4}-\d{2}-\d{2}|重做|首版/.test(prev);
  const zhNoisy = /\d{4}-\d{2}-\d{2}|重做|首版/.test(zh);
  if (prevNoisy && !zhNoisy) out.set(slug, zh);
  else if (!prevNoisy && zhNoisy) return;
  else if (zh.length < prev.length) out.set(slug, zh);
}

/** slug → Chinese name from markdown tables (`**菜名**` … `slug`). */
function collectDocSlugZh(): Map<string, string> {
  const out = new Map<string, string>();
  const patterns = [
    /\|\s*\*\*([^*|\n]+)\*\*[^|\n]*\|[^|\n]*\|\s*`([a-z][a-z0-9_]*)`/g,
    /\|\s*\*\*([^*|\n]+)\*\*\s*\|[^|\n]*\|\s*`([a-z][a-z0-9_]*)_poster\.png`/g,
    /\|\s*([^|~\n][^|]*?)\s*\|\s*`([a-z][a-z0-9_]+)_poster(?:_no_char)?\.png`/g,
    /\|\s*(?:~~)?([^|~\n][^|]*?)(?:~~)?\s*\|\s*`(?:[^`]*\/)?([a-z][a-z0-9_]+)_(?:story|recipe)_/g,
  ];

  for (const raw of Object.values(DOC_MODULES)) {
    for (const re of patterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(raw))) {
        let slug = m[2];
        if (slug.endsWith("_poster")) slug = slug.slice(0, -"_poster".length);
        setDocSlugZh(out, slug, m[1]);
      }
    }
  }
  return out;
}

function buildRegionalIndex(): Map<string, PosterMeta> {
  const map = new Map<string, PosterMeta>();

  const data = postersJson as Record<string, Record<string, JsonPoster[]>>;
  for (const [country, regions] of Object.entries(data)) {
    for (const [region, list] of Object.entries(regions)) {
      for (const p of list) {
        const meta = jsonToMeta(p);
        if (!meta) continue;
        map.set(metaKey(country as CountryId, region, p.slug), meta);
      }
    }
  }

  const extra = dishMetaExtra as ExtraRoot;
  for (const [geo, slugs] of Object.entries(extra)) {
    const [country, region] = geo.split("/") as [CountryId, string];
    for (const [slug, wm] of Object.entries(slugs)) {
      map.set(metaKey(country, region, slug), webMetaToPosterMeta(wm));
    }
  }

  return map;
}

function buildSlugZhIndex(regional: Map<string, PosterMeta>): Map<string, string> {
  const slugZh = collectDocSlugZh();
  for (const [key, meta] of regional) {
    const slug = key.split("/").pop();
    if (slug && meta.name.zh && /[\u4e00-\u9fff\u3040-\u30ff]/.test(meta.name.zh)) {
      slugZh.set(slug, meta.name.zh);
    }
  }
  return slugZh;
}

const REGIONAL_INDEX = buildRegionalIndex();
const SLUG_ZH_INDEX = buildSlugZhIndex(REGIONAL_INDEX);

function titleCaseFromSlug(slug: string): string {
  return slug
    .replace(/^cn_[a-z]+_/, "")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Lookup bundled meta (posters.json + extras + doc tables). */
export function lookupBundledDishMeta(
  countryId: CountryId,
  regionId: string,
  slug: string,
  regionNameZh: string,
): PosterMeta | null {
  const key = metaKey(countryId, regionId, slug);
  const hit = REGIONAL_INDEX.get(key);
  if (hit) return hit;

  const alt = slug.replace(/^cn_[a-z]+_/, "");
  if (alt !== slug) {
    const altHit = REGIONAL_INDEX.get(metaKey(countryId, regionId, alt));
    if (altHit) return altHit;
  }

  const zh = SLUG_ZH_INDEX.get(slug) ?? SLUG_ZH_INDEX.get(alt);
  if (zh) {
    const en = titleCaseFromSlug(slug);
    const pin = PIN_DEFAULTS[`${countryId}/${regionId}`] ?? regionNameZh;
    return {
      name: { zh, en, ja: zh },
      tags: emptyTags(),
      pin,
      desc: { zh: "", en: "", ja: "" },
    };
  }

  return null;
}
