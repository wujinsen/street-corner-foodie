import type { Lang } from "./i18n";
import { buildLandingMapSpots, LANDING_MAP_DEFAULT, type LandingMapSpot } from "./landing-map-spots";
import { buildWorldAtlasPayload } from "./world-atlas-payload";

export { LANDING_MAP_DEFAULT };
export type { LandingMapSpot };

/** Landing map pins + city card — counts & street links from world atlas payload. */
export function buildLandingAtlasSpots(lang: Lang): LandingMapSpot[] {
  const spots = buildLandingMapSpots(lang);
  const payload = buildWorldAtlasPayload(lang);
  if (!payload) return spots;

  return spots.map((spot) => {
    const countryScenes = payload.scenes.filter((s) => s.countryId === spot.id);
    const regionScene =
      countryScenes.find((s) => s.regionId === spot.regionId) ?? countryScenes[0];
    return {
      ...spot,
      pinCount: countryScenes.length || spot.pinCount,
      streetHref: regionScene?.streetsHref ?? spot.streetHref,
    };
  });
}
