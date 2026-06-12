/** Parse `mini_zine` frontmatter entries into per-dish file sets. */

import { joinAssertRelDir } from "./assert-path";

export interface ParsedZineFiles {
  slug: string;
  path: string;
  storyWith: string | null;
  storyNoChar: string | null;
  recipeWith: string | null;
  recipeNoChar: string | null;
  /** Ordered `{slug}_narrative_01` … `_04` spreads (story mode pages 2–5). */
  narrativePages: string[];
}

function basename(entry: string): string {
  const i = entry.lastIndexOf("/");
  return i >= 0 ? entry.slice(i + 1) : entry;
}

function dirname(entry: string): string {
  const i = entry.lastIndexOf("/");
  return i >= 0 ? entry.slice(0, i + 1) : "";
}

function normalizeZineDir(dir: string | undefined): string {
  if (!dir) return "";
  const stripped = dir
    .replace(/^asserts\/mini-zine\//i, "")
    .replace(/^asserts\/mini-zine/i, "");
  return joinAssertRelDir(stripped);
}

/** Resolve per-dish directory under `/asserts/mini-zine/`. */
function resolveZineEntryPath(entry: string, defaultPath: string): string {
  const entryDir = dirname(entry);
  if (!entryDir) return defaultPath;
  const dir = joinAssertRelDir(entryDir);
  // Full geo path from mini-zine root (e.g. cn/hainan/, jp/).
  if (/^(cn|jp|us|fr|uk|de|za|nz)\//.test(dir)) {
    return dir;
  }
  // Province-only prefix in country overview docs (e.g. sichuan/ under mini_zine_dir cn/).
  return joinAssertRelDir(defaultPath, dir);
}

function extractSlug(filename: string): string | null {
  const numbered = filename.match(/^(.+?)_mini_zine_p\d{2}_/);
  if (numbered) return numbered[1]!;
  const narrative = filename.match(/^(.+?)_narrative_\d{2}_/);
  if (narrative) return narrative[1]!;
  const m = filename.match(/^(.+?)_(?:story_eating|story|recipe)(?:_mini_zine)?/);
  return m ? m[1]! : null;
}

/** Legacy `_narrative_01` … `_04`; unified `_mini_zine_p02` … `_p05` map to narrative slots 1–4. */
function narrativeOrder(filename: string): number | null {
  const legacy = filename.match(/_narrative_(\d{2})_/);
  if (legacy) return Number(legacy[1]);
  const unified = filename.match(/_mini_zine_p(\d{2})_narr_/);
  if (unified) return Number(unified[1]) - 1;
  return null;
}

function miniZinePageSlot(filename: string): number | null {
  const m = filename.match(/_mini_zine_p(\d{2})_/);
  return m ? Number(m[1]) : null;
}

export function parseZineEntries(
  entries: string[],
  zineDir: string | undefined,
): ParsedZineFiles[] {
  const defaultPath = normalizeZineDir(zineDir);
  const bySlug = new Map<string, ParsedZineFiles>();

  for (const raw of entries) {
    const base = basename(raw);
    if (!base.endsWith(".png")) continue;

    const path = resolveZineEntryPath(raw, defaultPath);
    const slug = extractSlug(base);
    if (!slug) continue;

    let row = bySlug.get(slug);
    if (!row) {
      row = {
        slug,
        path,
        storyWith: null,
        storyNoChar: null,
        recipeWith: null,
        recipeNoChar: null,
        narrativePages: [],
      };
      bySlug.set(slug, row);
    }
    if (!row.path && path) row.path = path;

    const noChar = base.includes("_no_char");
    const pageSlot = miniZinePageSlot(base);
    const isUnified = pageSlot !== null;
    const isNarrative = base.includes("_narrative_") || (isUnified && pageSlot >= 2 && pageSlot <= 5);
    const isStoryEating = base.includes("story_eating") || (isUnified && pageSlot === 1);
    const isRecipe =
      (base.includes("recipe") && !base.includes("_narr_")) || (isUnified && pageSlot === 6);

    if (isUnified && !noChar) {
      if (pageSlot === 1) row.storyWith = base;
      else if (pageSlot === 6) row.recipeWith = base;
      else if (pageSlot >= 2 && pageSlot <= 5) {
        const order = pageSlot - 1;
        const existing = row.narrativePages.findIndex((f) => narrativeOrder(f) === order);
        if (existing >= 0) row.narrativePages[existing] = base;
        else row.narrativePages.push(base);
      }
      continue;
    }

    if (isNarrative && !noChar) {
      const order = narrativeOrder(base);
      if (order !== null) {
        const existing = row.narrativePages.findIndex((f) => narrativeOrder(f) === order);
        if (existing >= 0) row.narrativePages[existing] = base;
        else row.narrativePages.push(base);
      }
      continue;
    }

    if (isStoryEating && !noChar) row.storyWith = base;
    if (isStoryEating && noChar) row.storyNoChar = base;
    if (isRecipe && !noChar) row.recipeWith = base;
    if (isRecipe && noChar) row.recipeNoChar = base;
  }

  for (const row of bySlug.values()) {
    row.narrativePages.sort((a, b) => (narrativeOrder(a) ?? 0) - (narrativeOrder(b) ?? 0));
  }

  return [...bySlug.values()].filter(
    (z) =>
      z.storyWith ||
      z.storyNoChar ||
      z.recipeWith ||
      z.recipeNoChar ||
      z.narrativePages.length > 0,
  );
}
