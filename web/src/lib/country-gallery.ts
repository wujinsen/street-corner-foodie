import { regionOrderForCountryMix } from "./country-posters";
import { REGIONS, getPosters } from "./load-content";
import { getStreetConfig, getStreetScenes, streetPreferredImageUrl } from "./streets";
import { getZines } from "./zines";
import type { CountryId, Region } from "./types";
import type { StreetRegionConfig, StreetScene } from "./streets";
import type { ZineDish } from "./types";

export interface CountryZineCard {
  region: Region;
  zine: ZineDish;
}

export interface CountryStreetSpot {
  region: Region;
  scene: StreetScene;
  config: StreetRegionConfig;
  thumbUrl: string | null;
}

export function getCountryZineCards(countryId: CountryId): CountryZineCard[] {
  const out: CountryZineCard[] = [];
  for (const region of REGIONS[countryId] ?? []) {
    for (const zine of getZines(countryId, region.id)) {
      out.push({ region, zine });
    }
  }
  return out;
}

/** Same round-robin as country posters — mixed provinces on country zine tab. */
export function orderCountryZineCards(
  cards: CountryZineCard[],
  countryId: CountryId,
  regionFilter?: string | null,
): CountryZineCard[] {
  if (regionFilter || cards.length <= 1) return cards;
  const regionOrder = regionOrderForCountryMix(countryId);
  const byRegion = new Map<string, CountryZineCard[]>();
  for (const c of cards) {
    const id = c.region.id;
    const list = byRegion.get(id) ?? [];
    list.push(c);
    byRegion.set(id, list);
  }
  const queues = regionOrder
    .map((id) => byRegion.get(id) ?? [])
    .filter((q) => q.length > 0);
  const out: CountryZineCard[] = [];
  for (let round = 0; ; round++) {
    let added = false;
    for (const q of queues) {
      if (round < q.length) {
        out.push(q[round]!);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}

export function getCountryStreetSpots(countryId: CountryId): CountryStreetSpot[] {
  const out: CountryStreetSpot[] = [];
  for (const region of REGIONS[countryId] ?? []) {
    const config = getStreetConfig(countryId, region.id);
    const scenes = getStreetScenes(countryId, region.id);
    if (!config || scenes.length === 0) continue;
    const scene = scenes[0]!;
    out.push({
      region,
      scene,
      config,
      thumbUrl: streetPreferredImageUrl(config, scene.id, "wide"),
    });
  }
  return out;
}

export function getCountryPosterCount(countryId: CountryId): number {
  return (REGIONS[countryId] ?? []).reduce(
    (n, r) => n + getPosters(countryId, r.id).length,
    0,
  );
}
