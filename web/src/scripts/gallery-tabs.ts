/** Region/country gallery: one visible panel per top-nav hash (#posters | #zines | #streets). */

import { galleryTabFromHash, redirectLegacyMapHash, type GalleryTab } from "./gallery-tab-hash";

export type { GalleryTab } from "./gallery-tab-hash";
export { galleryTabFromHash, redirectLegacyMapHash } from "./gallery-tab-hash";

/** 海报 / 小志各一层背景，切换 Tab 时只显示对应层（避免改 src 仍像同一张图）。 */
export function syncCountryHeroLayers(gallery: ParentNode, tab: GalleryTab): void {
  if (tab === "streets") return;
  const hero = gallery.querySelector<HTMLElement>("[data-gallery-country-hero]");
  if (!hero) return;
  hero.querySelectorAll<HTMLElement>("[data-hero-layer]").forEach((layer) => {
    const on = layer.dataset.heroLayer === tab;
    layer.hidden = !on;
    layer.classList.toggle("country-hero-scene__layer--off", !on);
  });
}

function isStandaloneTopbarTab(el: HTMLElement): boolean {
  return el.hasAttribute("data-world-atlas-link");
}

function syncTopbarTab(tab: GalleryTab): void {
  document.querySelectorAll<HTMLElement>(".topbar-center .tab").forEach((el) => {
    if (isStandaloneTopbarTab(el)) {
      el.classList.remove("active");
      return;
    }
    const href = (el as HTMLAnchorElement).getAttribute("href") ?? "";
    const hash = href.includes("#zines")
      ? "zines"
      : href.includes("#streets")
        ? "streets"
        : "posters";
    el.classList.toggle("active", hash === tab);
  });
}

function initStreetExplorers(gallery: HTMLElement): void {
  void import("./street-explorer").then((m) => {
    m.initEmbeddedStreetExplorers(gallery);
  });
}

export function applyGalleryTab(gallery: HTMLElement, tab: GalleryTab, prev?: string | null): void {
  gallery.setAttribute("data-active-tab", tab);
  syncCountryHeroLayers(gallery, tab);
  gallery.querySelectorAll<HTMLElement>(".gallery-tab-panel").forEach((panel) => {
    const on = panel.dataset.tab === tab;
    panel.hidden = !on;
  });
  gallery.querySelectorAll<HTMLElement>("[data-gallery-crumb]").forEach((el) => {
    const on = el.dataset.galleryCrumb === tab;
    el.hidden = !on;
    el.classList.toggle("active", on);
  });
  document.body.setAttribute("data-nav-tab", tab);
  document.querySelectorAll<HTMLElement>("[data-gallery-dock-tab]").forEach((el) => {
    const dockTab = el.dataset.galleryDockTab;
    if (dockTab === "explore" || dockTab === "profile") return;
    el.classList.toggle("active", dockTab === tab);
  });
  syncTopbarTab(tab);

  if (tab === "streets") {
    initStreetExplorers(gallery);
  }

  if (prev && prev !== tab) {
    const anchor = document.getElementById(tab);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}

export function initGalleryTabs(root: ParentNode = document): void {
  redirectLegacyMapHash();
  const gallery = root.querySelector<HTMLElement>(".alt-gallery[data-gallery-tabs]");
  if (!gallery) return;

  const apply = (): void => {
    redirectLegacyMapHash();
    const tab = galleryTabFromHash(location.hash || "");
    const prev = gallery.getAttribute("data-active-tab") as GalleryTab | null;
    applyGalleryTab(gallery, tab, prev);
  };

  apply();
  window.addEventListener("hashchange", apply);
}
