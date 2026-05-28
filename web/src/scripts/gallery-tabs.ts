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

/** 仅在 active tab 不在视口内时滚动；用 instant 避免动画阻塞主线程。 */
function scrollIntoViewIfNeeded(tab: GalleryTab): void {
  const anchor = document.getElementById(tab);
  if (!anchor) return;
  const rect = anchor.getBoundingClientRect();
  const inView = rect.top >= 0 && rect.top <= window.innerHeight * 0.5;
  if (inView) return;
  anchor.scrollIntoView({ behavior: "auto", block: "start" });
}

export function applyGalleryTab(gallery: HTMLElement, tab: GalleryTab, prev?: string | null): void {
  /* 1) 同步元数据 —— 仅写 attribute，几乎零成本，可同步执行 */
  gallery.setAttribute("data-active-tab", tab);
  document.body.setAttribute("data-nav-tab", tab);

  /* 2) 重活推迟到下一帧，让点击产生的 active 视觉反馈先 paint 出来 */
  requestAnimationFrame(() => {
    syncCountryHeroLayers(gallery, tab);

    const panels = gallery.querySelectorAll<HTMLElement>(".gallery-tab-panel");
    for (let i = 0; i < panels.length; i += 1) {
      const panel = panels[i];
      panel.hidden = panel.dataset.tab !== tab;
    }

    const crumbs = gallery.querySelectorAll<HTMLElement>("[data-gallery-crumb]");
    for (let i = 0; i < crumbs.length; i += 1) {
      const el = crumbs[i];
      const on = el.dataset.galleryCrumb === tab;
      el.hidden = !on;
      el.classList.toggle("active", on);
    }

    /* 2026-05-28 · P1：CountryPage 不再有 data-gallery-dock-tab="posters|zines|streets"
     * 的重复 tab；底部 dock 现在统一为 BottomDock（探索 · 地图 · 收藏 · 搜索 · 设置）
     * 由 BottomDock 自己根据 page-level prop 决定 active，不需要 hashchange 同步。 */

    /* topbar tab 已由 Topbar.astro 的 click/hashchange 同步，这里只兜底未同步场景 */
    if (!document.querySelector(`.topbar-center .tab.active[data-topbar-tab="${tab}"]`)) {
      syncTopbarTab(tab);
    }

    if (prev && prev !== tab) {
      scrollIntoViewIfNeeded(tab);
    }

    /* StreetExplorer 初始化最重，放在 idle/微延后，避免阻塞 tab 切换 */
    if (tab === "streets") {
      const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (typeof idle === "function") {
        idle(() => initStreetExplorers(gallery), { timeout: 250 });
      } else {
        setTimeout(() => initStreetExplorers(gallery), 0);
      }
    }
  });
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
