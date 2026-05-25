/**
 * v0.6.9 · Toggle pre-rendered bento panels when landing map pin changes.
 * cn · region sub-panels sync when city lights are clicked (country stays cn).
 */

import { initLandingBentoCarousels } from "./landing-bento-carousel";
import { initLandingBentoWeather } from "./landing-bento-weather";
import { getVisibleBentoScope } from "./landing-bento-scope";

export { getVisibleBentoScope } from "./landing-bento-scope";

const CN_DEFAULT_REGION = "hainan";

function syncCnRegionPanels(cnPanel: HTMLElement, regionId: string): void {
  const active = regionId || CN_DEFAULT_REGION;
  for (const panel of cnPanel.querySelectorAll<HTMLElement>("[data-landing-bento-region-panel]")) {
    panel.hidden = panel.dataset.region !== active;
  }
}

function resetInteractive(scope: HTMLElement): void {
  scope.querySelectorAll<HTMLElement>("[data-landing-bento-carousel]").forEach((el) => {
    el.dataset.bentoCarouselInit = "false";
  });
  scope.querySelectorAll<HTMLElement>("[data-landing-weather]").forEach((el) => {
    el.dataset.weatherInit = "false";
  });
}

function bootScope(scope: HTMLElement): void {
  resetInteractive(scope);
  initLandingBentoCarousels(scope);
  initLandingBentoWeather(scope);
}

export function syncLandingBento(countryId: string, regionId?: string): void {
  const root = document.querySelector<HTMLElement>("[data-landing-bento-root]");
  if (!root) return;

  for (const panel of root.querySelectorAll<HTMLElement>("[data-landing-bento-panel]")) {
    panel.hidden = panel.dataset.country !== countryId;
  }

  document.documentElement.setAttribute("data-country", countryId);

  const countryPanel = root.querySelector<HTMLElement>(
    `[data-landing-bento-panel][data-country="${countryId}"]:not([hidden])`,
  );

  let activeRegion: string | undefined;
  if (countryId === "cn" && countryPanel) {
    activeRegion = regionId || CN_DEFAULT_REGION;
    syncCnRegionPanels(countryPanel, activeRegion);
  }

  const scope = getVisibleBentoScope(root);
  if (scope) bootScope(scope);

  window.dispatchEvent(
    new CustomEvent("scf:landing-bento-synced", {
      detail: { countryId, regionId: activeRegion },
    }),
  );
}

function initLandingBentoPanels(): void {
  const mapRoot = document.querySelector<HTMLElement>("[data-landing-map-root]");
  const country = mapRoot?.getAttribute("data-default-country") ?? "cn";
  const region = mapRoot?.getAttribute("data-default-region") ?? undefined;
  syncLandingBento(country, region);
}

if (typeof document !== "undefined") {
  document.addEventListener("scf:landing-spot", (e) => {
    const detail = (e as CustomEvent<{ countryId: string; regionId?: string }>).detail;
    if (detail?.countryId) syncLandingBento(detail.countryId, detail.regionId);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLandingBentoPanels, { once: true });
  } else {
    initLandingBentoPanels();
  }
}
