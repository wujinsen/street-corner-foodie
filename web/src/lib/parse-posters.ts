/** Parse `gourmet_posters` frontmatter entries into slug + file pairs. */

import { scfSourceExists } from "./scf-image";



export interface ParsedPosterFile {

  slug: string;

  file: string;

  fileNoChar: string | null;

  /** Relative to Gourmet recipe2/, e.g. `cn/hainan/` */

  path: string;

}



const SKIP_PARTS = ["_redraw", "_era_", "dynasty_sample"];



function basename(entry: string): string {

  const i = entry.lastIndexOf("/");

  return i >= 0 ? entry.slice(i + 1) : entry;

}



function dirname(entry: string): string {

  const i = entry.lastIndexOf("/");

  return i >= 0 ? entry.slice(0, i + 1) : "";

}



function extractSlug(filename: string): string | null {

  if (!filename.endsWith(".png")) return null;

  if (filename.includes("_no_char")) return null;

  if (SKIP_PARTS.some((p) => filename.includes(p))) return null;



  const m = filename.match(/^(.+)_poster\.png$/);

  if (!m) return null;

  return m[1]!;

}



function normalizePosterDir(dir: string | undefined): string {

  if (!dir) return "";

  return dir

    .replace(/^asserts\/Gourmet recipe2\//i, "")

    .replace(/^asserts\/gourmet recipe2\//i, "");

}



export function parsePosterEntries(

  entries: string[],

  posterDir: string | undefined,

  filter?: (entry: string) => boolean,

): ParsedPosterFile[] {

  const defaultPath = normalizePosterDir(posterDir);

  const bySlug = new Map<string, ParsedPosterFile>();



  for (const raw of entries) {

    if (filter && !filter(raw)) continue;



    const base = basename(raw);

    const path = dirname(raw) ? `${dirname(raw)}/` : defaultPath;



    if (base.includes("_poster_no_char")) {

      const slug = extractSlug(base.replace("_no_char", ""));

      if (!slug) continue;

      const existing = bySlug.get(slug);

      if (existing) existing.fileNoChar = base;

      else bySlug.set(slug, { slug, file: "", fileNoChar: base, path });

      continue;

    }



    const slug = extractSlug(base);

    if (!slug) continue;



    const existing = bySlug.get(slug);

    if (existing) {

      existing.file = base;

      if (!existing.path && path) existing.path = path;

    } else {

      bySlug.set(slug, { slug, file: base, fileNoChar: null, path });

    }

  }



  return [...bySlug.values()].filter((p) => p.file);

}



export function countZineDishes(entries: string[], filter?: (e: string) => boolean): number {

  const slugs = new Set<string>();

  for (const raw of entries) {

    if (filter && !filter(raw)) continue;

    const base = basename(raw);

    const m = base.match(/(?:^|\/)([a-z0-9_]+)_(?:story_eating|recipe)(?:_mini_zine)?/);

    if (m) slugs.add(m[1]!);

    else {

      const m2 = base.match(/([a-z0-9_]+)_(?:story|recipe)/);

      if (m2) slugs.add(m2[1]!);

    }

  }

  return slugs.size;

}



export function countStreetScenes(entries: string[], filter?: (e: string) => boolean): number {

  return entries.filter((e) => {

    if (filter && !filter(e)) return false;

    return basename(e).endsWith("_day_wide.png");

  }).length;

}



function heroAssetPath(heroPath: string, fileName: string): string {

  const base = heroPath.endsWith("/") ? heroPath : `${heroPath}/`;

  return `/asserts/Street View/${base}${encodeURIComponent(fileName)}`;

}



export function pickHero(

  entries: string[],

  filter?: (e: string) => boolean,

  /** e.g. `cn/hainan/haikou/` — when set, only pick files present in `.scf-image-manifest.json` */

  heroPath?: string | null,

): string | null {

  const pick = (suffix: string): string | null => {

    for (const e of entries) {

      if (filter && !filter(e)) continue;

      if (!basename(e).endsWith(suffix)) continue;

      const name = basename(e);

      if (!heroPath) return name;

      if (scfSourceExists(heroAssetPath(heroPath, name))) return name;

    }

    return null;

  };



  return pick("_night_wide.png") ?? pick("_day_wide.png");

}

