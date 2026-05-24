/**
 * v0.6.9 · Toggle pre-rendered bento panels when landing map pin changes.
 */

import { initLandingBentoCarousels } from "./landing-bento-carousel";

export function syncLandingBento(countryId: string): void {
  const root = document.querySelector<HTMLElement>("[data-landing-bento-root]");
  if (!root) return;

  for (const panel of root.querySelectorAll<HTMLElement>("[data-landing-bento-panel]")) {
    const on = panel.dataset.country === countryId;
    panel.hidden = !on;
  }

  document.documentElement.setAttribute("data-country", countryId);

  const visible = root.querySelector<HTMLElement>(
    `[data-landing-bento-panel][data-country="${countryId}"]:not([hidden])`,
  );
  visible?.querySelectorAll<HTMLElement>("[data-landing-bento-carousel]").forEach((el) => {
    el.dataset.bentoCarouselInit = "false";
  });
  initLandingBentoCarousels(visible ?? root);
}

if (typeof document !== "undefined") {
  document.addEventListener("scf:landing-spot", (e) => {
    const id = (e as CustomEvent<{ countryId: string }>).detail?.countryId;
    if (id) syncLandingBento(id);
  });
}
