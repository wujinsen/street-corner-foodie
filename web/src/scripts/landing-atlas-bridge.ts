/**
 * Landing · sync city card + topbar country theme when world-atlas pin focuses.
 * Multi-region countries (cn · us · jp …) resolve by regionId; others fall back to country spot.
 * cn · same-country region changes also dispatch scf:landing-spot for bento sub-panels.
 */

import { applyLandingCoordsEl } from "../lib/landing-coords";
import { syncCountryChrome } from "./country-picker";

type CardSpot = {
  city: { zh: string; en: string; ja: string };
  citySub: { zh: string; en: string; ja: string };
  coords: string;
  heroUrl: string | null;
};

type CountrySpot = CardSpot & { id: string };
type RegionSpot = CardSpot & { regionKey: string; countryId: string };

function readCountrySpots(root: HTMLElement): CountrySpot[] {
  const raw = root.getAttribute("data-landing-map-json");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CountrySpot[];
  } catch {
    return [];
  }
}

function readRegionSpots(root: HTMLElement): RegionSpot[] {
  const script = document.getElementById("landing-regions-data");
  if (!script?.textContent?.trim()) return [];
  try {
    return JSON.parse(script.textContent) as RegionSpot[];
  } catch {
    return [];
  }
}

function spotLang(root: HTMLElement): "zh" | "en" | "ja" {
  const l = root.getAttribute("data-lang");
  if (l === "en" || l === "ja") return l;
  return "zh";
}

function pickText(
  ml: { zh: string; en: string; ja: string },
  lang: "zh" | "en" | "ja",
): string {
  return (lang === "en" ? ml.en : lang === "ja" ? ml.ja : ml.zh) || ml.zh;
}

function resolveCardSpot(
  root: HTMLElement,
  countryId: string,
  regionId?: string,
): CardSpot | null {
  if (regionId) {
    const regionKey = `${countryId}__${regionId}`;
    const regionSpot = readRegionSpots(root).find((s) => s.regionKey === regionKey);
    if (regionSpot) return regionSpot;
  }
  return readCountrySpots(root).find((s) => s.id === countryId) ?? null;
}

function dispatchLandingSpot(root: HTMLElement, countryId: string, regionId?: string): void {
  root.dispatchEvent(
    new CustomEvent("scf:landing-spot", {
      bubbles: true,
      detail: { countryId, regionId: countryId === "cn" ? regionId : undefined },
    }),
  );
}

function applyCardSpot(
  root: HTMLElement,
  countryId: string,
  spot: CardSpot,
  regionId?: string,
): void {
  const lang = spotLang(root);
  const prevCountry = root.getAttribute("data-active-country");
  const prevRegion = root.getAttribute("data-active-region") ?? "";

  root.setAttribute("data-active-country", countryId);
  root.setAttribute("data-active-region", regionId ?? "");
  root.setAttribute("data-country", countryId);

  const cityDisplayEl = root.querySelector<HTMLElement>("[data-map-city-display]");
  const subEl = root.querySelector<HTMLElement>("[data-map-city-sub]");
  const coordsEl = root.querySelector<HTMLElement>("[data-map-city-coords]");
  const bg = root.querySelector<HTMLElement>("[data-map-city-bg]");

  if (cityDisplayEl) {
    cityDisplayEl.textContent = pickText(spot.city, lang);
  }
  if (subEl) {
    const sub = pickText(spot.citySub, lang).trim();
    subEl.textContent = sub;
    subEl.hidden = !sub;
  }
  if (coordsEl) applyLandingCoordsEl(coordsEl, spot.coords);
  if (bg) {
    if (spot.heroUrl) {
      bg.style.backgroundImage = `url('${spot.heroUrl}')`;
      bg.classList.add("is-visible");
    } else {
      bg.style.backgroundImage = "";
      bg.classList.remove("is-visible");
    }
  }

  document.documentElement.setAttribute("data-country", countryId);
  syncCountryChrome(countryId);

  const nextRegion = regionId ?? "";
  if (prevCountry !== countryId) {
    dispatchLandingSpot(root, countryId, regionId);
  } else if (countryId === "cn" && prevRegion !== nextRegion) {
    dispatchLandingSpot(root, countryId, regionId);
  }
}

function applyLandingFocus(root: HTMLElement, countryId: string, regionId?: string): void {
  const spot = resolveCardSpot(root, countryId, regionId);
  if (!spot) return;
  applyCardSpot(root, countryId, spot, regionId);
}

function initLandingAtlasBridge(): void {
  const root = document.querySelector<HTMLElement>("[data-landing-map-root]");
  if (!root) return;

  const defaultCountry = root.getAttribute("data-default-country") || "cn";
  const defaultRegion = root.getAttribute("data-default-region") || undefined;
  applyLandingFocus(root, defaultCountry, defaultRegion);

  document.addEventListener("scf:atlas-focus", (ev) => {
    const detail = (ev as CustomEvent<{ countryId?: string; regionId?: string; cleared?: boolean }>)
      .detail;
    if (detail?.cleared) {
      applyLandingFocus(root, defaultCountry, defaultRegion);
      return;
    }
    const { countryId, regionId } = detail ?? {};
    if (countryId) applyLandingFocus(root, countryId, regionId);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLandingAtlasBridge, { once: true });
  } else {
    initLandingAtlasBridge();
  }
}
