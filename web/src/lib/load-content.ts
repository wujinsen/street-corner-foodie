import matter from "gray-matter";

import type { RegionFrontmatter } from "./content-schema";

import type { Lang, CountryId, Poster, Region, ZineDish } from "./types";

import { parseZineEntries } from "./parse-zines";

import { REGION_BINDINGS, type RegionBinding } from "./region-registry";

import { parsePosterEntries, countZineDishes, countStreetScenes, pickHero } from "./parse-posters";

import { applyMeta, lookupPosterMeta } from "./poster-meta";

import { buildPlaceholder } from "./placeholders";

import { matchesFlavorChip } from "./flavor-match";

import { getRegionAtmosphere } from "./region-atmosphere";

/** `web/docs/` junction �?repo `docs/` (project-root-relative glob). */

const DOC_MODULES = import.meta.glob("../../../docs/{china,world}/*.md", {

  query: "?raw",

  import: "default",

  eager: true,

}) as Record<string, string>;

/** All mini-zine PNGs under asserts/ (build-time inventory for regions with sparse frontmatter). */
const ZINE_PNG_MODULES = import.meta.glob("../../../asserts/mini-zine/**/*.png", {
  eager: true,
  query: "?url",
}) as Record<string, string>;



function findDocRaw(suffix: string): string | undefined {

  const key = Object.keys(DOC_MODULES).find((k) => k.replace(/\\/g, "/").endsWith(suffix));

  return key ? DOC_MODULES[key] : undefined;

}



function streetPathFromDir(dir: string | undefined): string | null {

  if (!dir) return null;

  return dir.replace(/^asserts\/Street View\//i, "").replace(/\/$/, "") + "/";

}



function buildRegion(binding: RegionBinding, fm: RegionFrontmatter): Region {

  const streetList = binding.useFujiStreets

    ? fm.street_view_fuji_approved ?? []

    : fm.street_view_approved ?? [];



  const streetFiltered = binding.streetFilter

    ? streetList.filter(binding.streetFilter)

    : streetList;



  const posterEntries = fm.gourmet_posters ?? [];

  const posterFiltered = binding.posterFilter

    ? posterEntries.filter(binding.posterFilter)

    : posterEntries;



  const zineList = fm.mini_zine ?? [];

  const zinePick = binding.zineFilter ?? binding.posterFilter;

  const zineFiltered = zinePick ? zineList.filter((e) => zinePick(e)) : zineList;



  const heroPath =

    binding.streetPathOverride ??

    streetPathFromDir(

      binding.useFujiStreets ? fm.street_view_fuji_dir : fm.street_view_dir,

    );



  const heroFile =

    pickHero(streetFiltered, undefined, heroPath) ??

    pickHero(streetList, binding.streetFilter, heroPath) ??

    null;



  const flavors =

    binding.flavors ??

    (fm.cuisine_tags

      ? {

          zh: fm.cuisine_tags,

          en: fm.cuisine_tags,

          ja: fm.cuisine_tags,

        }

      : { zh: [], en: [], ja: [] });



  return {

    id: binding.regionId,

    countryId: binding.countryId,

    name: binding.name,

    tagline: binding.tagline,

    flavors,

    stats: {

      poster: parsePosterEntries(posterFiltered, fm.gourmet_poster_dir).length,

      zine: countZineDishes(zineFiltered),

      street: countStreetScenes(streetFiltered),

    },

    hero: heroFile,

    heroPath,

    heroLanding: fm.web_gallery_hero_landing ?? null,

    heroPoster: fm.web_gallery_hero_posters ?? null,

    heroZine: fm.web_gallery_hero_zines ?? null,

    editorPick: fm.web_editor_pick,

    atmosphere: getRegionAtmosphere(binding.countryId, binding.regionId),

  };

}



function buildPosters(binding: RegionBinding, fm: RegionFrontmatter): Poster[] {

  const posterEntries = fm.gourmet_posters ?? [];

  const filtered = binding.posterFilter

    ? posterEntries.filter(binding.posterFilter)

    : posterEntries;



  const parsed = parsePosterEntries(filtered, fm.gourmet_poster_dir).map((p) => ({
    ...p,
    path: binding.posterPathPrefix ?? p.path,
  }));

  const posters: Poster[] = parsed.map((p) => {

    const meta = lookupPosterMeta(

      fm,

      binding.countryId,

      binding.regionId,

      p.slug,

      binding.name.zh,

    );

    return applyMeta(

      {

        slug: p.slug,

        countryId: binding.countryId,

        regionId: binding.regionId,

        path: p.path,

        file: p.file,

        fileNoChar: p.fileNoChar,

      },

      meta,

    );

  });



  const slugs = new Set(posters.map((p) => p.slug));

  for (const slug of binding.placeholderSlugs ?? []) {

    if (slugs.has(slug)) continue;

    const ph = buildPlaceholder(binding.countryId, binding.regionId, slug);

    if (ph) posters.push(ph);

  }

  for (const z of buildZines(binding, fm)) {
    if (slugs.has(z.slug) || !z.storyWith) continue;
    const meta = lookupPosterMeta(
      fm,
      binding.countryId,
      binding.regionId,
      z.slug,
      binding.name.zh,
    );
    posters.push(
      applyMeta(
        {
          slug: z.slug,
          countryId: binding.countryId,
          regionId: binding.regionId,
          path: z.path,
          file: z.storyWith,
          fileNoChar: z.storyNoChar,
          fromZine: true,
        },
        meta,
      ),
    );
    slugs.add(z.slug);
  }

  return sortByEditorPick(posters, fm.web_editor_pick);

}



function sortByEditorPick(posters: Poster[], picks: string[] | undefined): Poster[] {

  if (!picks?.length) return posters;

  const order = new Map(picks.map((s, i) => [s, i]));

  return [...posters].sort((a, b) => {

    const ai = order.get(a.slug) ?? 999;

    const bi = order.get(b.slug) ?? 999;

    if (ai !== bi) return ai - bi;

    return a.slug.localeCompare(b.slug);

  });

}



function zineGlobEntriesForDir(miniZineDir: string | undefined): string[] {
  if (!miniZineDir) return [];
  const norm = miniZineDir
    .replace(/^asserts\/mini-zine\//i, "")
    .replace(/\/$/, "")
    .toLowerCase();
  const prefix = `mini-zine/${norm}/`;
  const out: string[] = [];
  for (const key of Object.keys(ZINE_PNG_MODULES)) {
    const k = key.replace(/\\/g, "/").toLowerCase();
    const idx = k.indexOf(prefix);
    if (idx === -1) continue;
    const rel = k.slice(idx + "mini-zine/".length);
    if (rel && !rel.includes("..")) out.push(rel);
  }
  return out;
}

function buildZines(binding: RegionBinding, fm: RegionFrontmatter): ZineDish[] {

  const zineList = fm.mini_zine ?? [];

  const zinePick = binding.zineFilter ?? binding.posterFilter;

  const zineFiltered = zinePick ? zineList.filter((e) => zinePick(e)) : zineList;

  const fromGlob = zineGlobEntriesForDir(fm.mini_zine_dir).filter((e) =>
    zinePick ? zinePick(e) : true,
  );
  const mergedEntries = [...new Set([...zineFiltered, ...fromGlob])];

  const parsed = parseZineEntries(mergedEntries, fm.mini_zine_dir);

  const zines: ZineDish[] = parsed.map((p) => {

    const meta = lookupPosterMeta(

      fm,

      binding.countryId,

      binding.regionId,

      p.slug,

      binding.name.zh,

    );

    return {

      ...p,

      countryId: binding.countryId,

      regionId: binding.regionId,

      placeholder: false,

      name: meta?.name ?? { zh: p.slug, en: p.slug, ja: p.slug },

    };

  });



  const slugs = new Set(zines.map((z) => z.slug));

  for (const slug of binding.placeholderSlugs ?? []) {

    if (slugs.has(slug)) continue;

    const ph = buildPlaceholder(binding.countryId, binding.regionId, slug);

    if (!ph) continue;

    zines.push({

      slug,

      countryId: binding.countryId,

      regionId: binding.regionId,

      path: "_svg/",

      storyWith: null,

      storyNoChar: null,

      recipeWith: null,

      recipeNoChar: null,

      narrativePages: [],

      placeholder: true,

      name: ph.name,

    });

  }



  return zines;

}



function loadAll(): {

  regions: Record<CountryId, Region[]>;

  posters: Record<CountryId, Record<string, Poster[]>>;

  zines: Record<CountryId, Record<string, ZineDish[]>>;

} {

  if (import.meta.env.DEV && Object.keys(DOC_MODULES).length === 0) {

    console.warn(

      "[scf-web] No docs/*.md loaded. Expected glob ../../../docs/{china,world}/*.md from src/lib/load-content.ts",

    );

  }



  const regions: Record<CountryId, Region[]> = {
    cn: [],
    jp: [],
    us: [],
    fr: [],
    uk: [],
    de: [],
    za: [],
    nz: [],
    antarctica: [],
  };

  const posters: Record<CountryId, Record<string, Poster[]>> = {
    cn: {},
    jp: {},
    us: {},
    fr: {},
    uk: {},
    de: {},
    za: {},
    nz: {},
    antarctica: {},
  };

  const zines: Record<CountryId, Record<string, ZineDish[]>> = {
    cn: {},
    jp: {},
    us: {},
    fr: {},
    uk: {},
    de: {},
    za: {},
    nz: {},
    antarctica: {},
  };



  for (const binding of REGION_BINDINGS) {

    const raw = findDocRaw(binding.docSuffix);

    if (!raw) continue;



    const { data } = matter(raw);

    const fm = data as RegionFrontmatter;



    const region = buildRegion(binding, fm);

    const list = posters[binding.countryId][binding.regionId] ?? [];

    posters[binding.countryId][binding.regionId] = [...list, ...buildPosters(binding, fm)];



    const zList = zines[binding.countryId][binding.regionId] ?? [];

    const builtZines = buildZines(binding, fm);

    zines[binding.countryId][binding.regionId] = [...zList, ...builtZines];



    region.stats.zine = builtZines.length;

    const existing = regions[binding.countryId].find((r) => r.id === binding.regionId);

    if (existing) {
      existing.stats.zine = builtZines.length;
    } else {
      regions[binding.countryId].push(region);
    }

  }



  return { regions, posters, zines };

}



const LOADED = loadAll();



export const REGIONS = LOADED.regions;

export const POSTERS = LOADED.posters;

export const ZINES = LOADED.zines;



export function findRegion(countryId: CountryId, regionId: string): Region | undefined {

  return REGIONS[countryId]?.find((r) => r.id === regionId);

}



export function getPosters(countryId: CountryId, regionId: string): Poster[] {

  return POSTERS[countryId]?.[regionId] ?? [];

}

/** Gallery bookcase: Gourmet recipe2 posters only (excludes mini-zine story thumbnails). */
export function getRecipePosters(countryId: CountryId, regionId: string): Poster[] {
  return getPosters(countryId, regionId).filter((p) => !p.fromZine);
}



/** Match poster tags against active flavor chip (zh/en/ja). */

export function filterPostersByFlavor(posters: Poster[], lang: Lang, flavor: string | null): Poster[] {

  if (!flavor) return posters;

  return posters.filter((p) => matchesFlavorChip(p.tags, lang, flavor));

}



/** Zines share poster slugs; filter by matching poster flavor tags. */

export function filterZinesByFlavor(

  zines: ZineDish[],

  posters: Poster[],

  lang: Lang,

  flavor: string | null,

): ZineDish[] {

  if (!flavor) return zines;

  const slugs = new Set(filterPostersByFlavor(posters, lang, flavor).map((p) => p.slug));

  return zines.filter((z) => slugs.has(z.slug));

}

