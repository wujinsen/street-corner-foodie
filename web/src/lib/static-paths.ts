import { COUNTRY_ORDER, REGIONS } from "./countries";

import { POSTERS } from "./posters";

import { ZINES } from "./load-content";

import { getStreetScenes } from "./streets";

import type { CountryId } from "./types";



export function countryStaticPaths() {

  return COUNTRY_ORDER.map((country) => ({ params: { country } }));

}



/** Country theme gallery per province (`/cn/g/hainan/`, theme-cn). */

export function countryRegionGalleryStaticPaths() {

  const paths: { params: { country: string; region: string } }[] = [];

  for (const cid of COUNTRY_ORDER) {

    for (const r of REGIONS[cid as CountryId]) {

      paths.push({ params: { country: cid, region: r.id } });

    }

  }

  return paths;

}



export function regionStaticPaths() {

  const paths: { params: { country: string; region: string } }[] = [];

  for (const cid of COUNTRY_ORDER) {

    for (const r of REGIONS[cid as CountryId]) {

      paths.push({ params: { country: cid, region: r.id } });

    }

  }

  return paths;

}



export function posterStaticPaths() {

  const paths: { params: { country: string; region: string; slug: string } }[] = [];

  for (const cid of COUNTRY_ORDER) {

    const country = cid as CountryId;

    for (const region of REGIONS[country]) {

      for (const p of POSTERS[country][region.id] ?? []) {

        paths.push({ params: { country: cid, region: region.id, slug: p.slug } });

      }

    }

  }

  return paths;

}



export function streetStaticPaths() {

  const paths: { params: { country: string; region: string; scene: string } }[] = [];

  for (const cid of COUNTRY_ORDER) {

    const country = cid as CountryId;

    for (const region of REGIONS[country]) {

      for (const scene of getStreetScenes(country, region.id)) {

        paths.push({ params: { country: cid, region: region.id, scene: scene.id } });

      }

    }

  }

  return paths;

}



export function zineStaticPaths() {

  const paths: { params: { country: string; region: string; slug: string } }[] = [];

  for (const cid of COUNTRY_ORDER) {

    const country = cid as CountryId;

    for (const region of REGIONS[country]) {

      for (const z of ZINES[country][region.id] ?? []) {

        paths.push({ params: { country: cid, region: region.id, slug: z.slug } });

      }

    }

  }

  return paths;

}

