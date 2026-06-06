import { scfSourceExists } from "./scf-image";
import { publicAssetUrl } from "./public-asset-origin";
import {
  getStreetConfig,
  getStreetScenes,
  streetPreferredImageUrl,
} from "./streets";
import type { CountryId, Region } from "./types";

const A_STREET = "/asserts/Street View/";

export type RegionHeroTab = "posters" | "zines" | "streets" | "landing";

function heroAssetUrl(heroPath: string, fileName: string): string {
  const base = heroPath.endsWith("/") ? heroPath : `${heroPath}/`;
  return publicAssetUrl(`${A_STREET}${base}${encodeURIComponent(fileName)}`);
}

/** night → day fallbacks for a picked hero basename. */
function heroFileCandidates(heroFile: string): string[] {
  const out: string[] = [];
  const add = (name: string): void => {
    if (name && !out.includes(name)) out.push(name);
  };
  if (/_night_wide\.png$/i.test(heroFile)) {
    add(heroFile);
    add(heroFile.replace(/_night_wide\.png$/i, "_day_wide.png"));
  } else if (/_day_wide\.png$/i.test(heroFile)) {
    add(heroFile.replace(/_day_wide\.png$/i, "_night_wide.png"));
    add(heroFile);
  } else {
    add(heroFile);
  }
  return out;
}

function resolveHeroBasename(region: Region, tab: RegionHeroTab = "posters"): string | null {
  if (tab === "landing" && region.heroLanding) return region.heroLanding;
  if (tab === "posters" && region.heroPoster) return region.heroPoster;
  if (tab === "zines" && region.heroZine) return region.heroZine;
  return region.hero;
}

function resolveHeroUrlFromBasename(
  heroPath: string | null,
  basename: string | null,
): string | null {
  if (!basename || !heroPath) return null;
  for (const name of heroFileCandidates(basename)) {
    const url = heroAssetUrl(heroPath, name);
    if (scfSourceExists(url)) return url;
  }
  return null;
}

/** Region hero：landing 城市卡 · 画廊海报/小志 Tab（`web_gallery_hero_*` frontmatter）。 */
export function regionHeroImageUrl(
  countryId: CountryId,
  region: Region,
  tab: RegionHeroTab = "posters",
): string | null {
  const picked = resolveHeroUrlFromBasename(region.heroPath, resolveHeroBasename(region, tab));
  if (picked) return picked;

  const config = getStreetConfig(countryId, region.id);
  const scenes = getStreetScenes(countryId, region.id);
  const sceneId =
    tab === "landing"
      ? (scenes.find((s) => s.id === "wanlv")?.id ?? config?.defaultSceneId ?? scenes[0]?.id)
      : tab === "zines"
        ? (scenes.find((s) => s.id === "fucheng")?.id ?? config?.defaultSceneId ?? scenes[0]?.id)
        : tab === "posters"
          ? (scenes.find((s) => s.id === "jiari_haitan")?.id ??
            config?.defaultSceneId ??
            scenes[0]?.id)
          : (config?.defaultSceneId ?? scenes[0]?.id);
  if (!config || !sceneId) return null;
  return streetPreferredImageUrl(config, sceneId, "wide");
}

/** 首页地图 pin 默认街景（与 `regionHeroImageUrl(..., "landing")` 同源逻辑） */
export function regionLandingStreetSceneId(
  countryId: CountryId,
  region: Region,
): string | null {
  const config = getStreetConfig(countryId, region.id);
  const scenes = getStreetScenes(countryId, region.id);
  const sceneId =
    scenes.find((s) => s.id === "wanlv")?.id ??
    config?.defaultSceneId ??
    scenes[0]?.id ??
    null;
  return sceneId;
}
