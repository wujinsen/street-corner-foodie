import { COUNTRIES, REGIONS } from "./countries";

import { POSTERS } from "./load-content";

import { posterImageUrl } from "./posters";

import { getStreetConfig, getStreetScenes, streetImageUrl } from "./streets";

import type { CountryId, Multilang } from "./types";



export type SearchKind = "dish" | "region" | "scene";



export interface SearchIndexEntry {

  kind: SearchKind;

  country: CountryId;

  region: string;

  slug?: string;

  name: Multilang;

  meta: Multilang;

  thumb: string | null;

  /** Path without locale prefix, e.g. `/cn/hainan/poster/wenchang_jifan` */

  path: string;

  haystack: string;

}



function hay(...parts: (string | undefined)[]): string {

  return parts.filter(Boolean).join(" ").toLowerCase();

}



export function buildSearchIndex(): SearchIndexEntry[] {

  const idx: SearchIndexEntry[] = [];



  for (const countryId of Object.keys(POSTERS) as CountryId[]) {

    const country = COUNTRIES[countryId];

    for (const region of REGIONS[countryId]) {

      idx.push({

        kind: "region",

        country: countryId,

        region: region.id,

        name: region.name,

        meta: country.name,

        thumb: null,

        path: `/${countryId}/?region=${region.id}`,

        haystack: hay(region.name.zh, region.name.en, region.name.ja, country.name.zh, country.name.en),

      });



      const streetConfig = getStreetConfig(countryId, region.id);

      for (const scene of getStreetScenes(countryId, region.id)) {

        const thumb =

          streetConfig ? streetImageUrl(streetConfig, scene.id, "day", "wide") : null;

        idx.push({

          kind: "scene",

          country: countryId,

          region: region.id,

          slug: scene.id,

          name: scene.name,

          meta: {

            zh: `${country.name.zh} · ${region.name.zh}`,

            en: `${country.name.en} · ${region.name.en}`,

            ja: `${country.name.ja} · ${region.name.ja}`,

          },

          thumb,

          path: `/${countryId}/${region.id}/street/${scene.id}`,

          haystack: hay(scene.name.zh, scene.name.en, scene.name.ja, scene.tag.zh, scene.tag.en),

        });

      }



      for (const p of POSTERS[countryId][region.id] ?? []) {

        idx.push({

          kind: "dish",

          country: countryId,

          region: region.id,

          slug: p.slug,

          name: p.name,

          meta: { zh: p.pin, en: p.pin, ja: p.pin },

          thumb: posterImageUrl(p, false),

          path: `/${countryId}/${region.id}/poster/${p.slug}`,

          haystack: hay(

            p.name.zh,

            p.name.en,

            p.name.ja,

            p.pin,

            p.slug,

            ...p.tags.zh,

            ...p.tags.en,

            ...p.tags.ja,

          ),

        });

      }

    }

  }



  return idx;

}

