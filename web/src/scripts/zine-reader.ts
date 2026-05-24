/** v0.6 · keyboard + variant / narrative spread switching (static-safe ?mode= / ?page=). */

import { notifyZineSpreadChange } from "./zine-lightbox";

export interface ZineVariantEntry {
  mode: "story" | "recipe";
  /** Original PNG — download only. */
  url: string;
  /** Optimized WebP/AVIF for on-screen. */
  displayUrl: string;
}

export interface ZineSpreadEntry {
  mode: "story" | "recipe";
  page: number;
  url: string;
  displayUrl: string;
}

type ZineLang = "zh" | "en" | "ja";

interface ZineReaderConfig {
  lang?: ZineLang;
  page: number;
  pageTotal: number;
  mode: "story" | "recipe";
  hasNarrativeSpreads?: boolean;
  storyPageTotal?: number;
  recipePageTotal?: number;
  spreads?: ZineSpreadEntry[];
  variants?: ZineVariantEntry[];
  hrefs: { prev: string; next: string };
}

function readStateFromUrl(): { mode: "story" | "recipe"; page: number } {
  const params = new URLSearchParams(location.search);
  return {
    mode: params.get("mode") === "recipe" ? "recipe" : "story",
    page: Math.max(0, Number(params.get("page") ?? "0") || 0),
  };
}

function pageTotalForMode(config: ZineReaderConfig, mode: "story" | "recipe"): number {
  if (config.hasNarrativeSpreads) {
    return mode === "recipe"
      ? (config.recipePageTotal ?? 1)
      : (config.storyPageTotal ?? config.pageTotal);
  }
  return config.pageTotal;
}

function spreadEntry(
  config: ZineReaderConfig,
  mode: "story" | "recipe",
  page: number,
): ZineSpreadEntry | ZineVariantEntry | undefined {
  const fromSpread = config.spreads?.find((s) => s.mode === mode && s.page === page);
  if (fromSpread) return fromSpread;
  return config.variants?.find((v) => v.mode === mode);
}

function variantIndex(config: ZineReaderConfig, mode: "story" | "recipe"): number {
  return (config.variants ?? []).findIndex((v) => v.mode === mode);
}

function setSpreadImage(
  reader: HTMLElement,
  fullUrl: string,
  alt?: string,
  displayUrl?: string,
): void {
  const show = displayUrl ?? fullUrl;
  const picture = reader.querySelector("picture");
  if (picture) {
    const img = picture.querySelector("img");
    if (img) {
      img.src = show;
      img.setAttribute("data-full-src", fullUrl);
      img.setAttribute("data-display-src", show);
      if (alt) img.alt = alt;
    }
    return;
  }
  const img = reader.querySelector("img");
  if (img) {
    img.src = show;
    img.setAttribute("data-full-src", fullUrl);
    img.setAttribute("data-display-src", show);
    if (alt) img.alt = alt;
  }
}

function linkModePage(href: string): { mode: "story" | "recipe"; page: number } {
  const u = new URL(href, location.href);
  return {
    mode: u.searchParams.get("mode") === "recipe" ? "recipe" : "story",
    page: Math.max(0, Number(u.searchParams.get("page") ?? "0") || 0),
  };
}

function syncToolbar(root: HTMLElement, mode: "story" | "recipe"): void {
  root.querySelectorAll<HTMLAnchorElement>(".alt-zine-toolbar .switch-glass a[href]").forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    const u = new URL(href, location.href);
    const t = a.textContent ?? "";
    if (u.searchParams.has("mode")) {
      a.classList.toggle("active", u.searchParams.get("mode") === "recipe" ? mode === "recipe" : mode === "story");
    } else if (/做法|recipe/i.test(t)) {
      a.classList.toggle("active", mode === "recipe");
    } else if (/故事|story/i.test(t)) {
      a.classList.toggle("active", mode === "story");
    }
  });
}

function syncThumbs(
  root: HTMLElement,
  mode: "story" | "recipe",
  page: number,
  showAllSpreads = false,
): void {
  root.querySelectorAll<HTMLElement>(".alt-zine-thumb-item").forEach((item) => {
    const a = item.querySelector<HTMLAnchorElement>("a[href]");
    if (!a) return;
    const { mode: lm, page: lp } = linkModePage(a.getAttribute("href") ?? "");
    const show = showAllSpreads || lm === mode;
    item.hidden = !show;
    a.classList.toggle("active", lm === mode && lp === page);
  });
}

function updateDownloadButton(root: HTMLElement, url: string): void {
  const btn = root.querySelector<HTMLButtonElement>("[data-zine-download]");
  if (!btn) return;
  btn.dataset.downloadUrl = url;
  btn.disabled = !url;
}

function buildSpreadUrl(mode: "story" | "recipe", page: number): string {
  const u = new URL(location.href);
  u.searchParams.delete("lang");
  u.searchParams.delete("char");
  if (mode === "recipe") u.searchParams.set("mode", "recipe");
  else u.searchParams.delete("mode");
  if (page > 0) u.searchParams.set("page", String(page));
  else u.searchParams.delete("page");
  return u.pathname + u.search + u.hash;
}

function applySpread(
  root: HTMLElement,
  reader: HTMLElement,
  config: ZineReaderConfig,
  mode: "story" | "recipe",
  page: number,
  pushUrl: boolean,
): void {
  const total = pageTotalForMode(config, mode);
  const clamped = Math.min(Math.max(0, page), Math.max(0, total - 1));
  const entry = spreadEntry(config, mode, clamped);

  if (entry) {
    const alt = reader.querySelector("img")?.alt;
    setSpreadImage(reader, entry.url, alt, entry.displayUrl);
    notifyZineSpreadChange(root, entry.displayUrl, alt, entry.url);
  }

  syncToolbar(root, mode);
  syncThumbs(root, mode, clamped);
  updateDownloadButton(root, entry?.url ?? "");

  if (pushUrl) history.pushState(null, "", buildSpreadUrl(mode, clamped));
}

function applyVariant(
  root: HTMLElement,
  reader: HTMLElement,
  config: ZineReaderConfig,
  mode: "story" | "recipe",
  page: number,
  pushUrl: boolean,
): void {
  if (config.hasNarrativeSpreads && (config.spreads?.length ?? 0) > 0) {
    applySpread(root, reader, config, mode, page, pushUrl);
    return;
  }

  const variants = config.variants ?? [];
  const entry = variants.find((v) => v.mode === mode);
  if (entry) {
    const alt = reader.querySelector("img")?.alt;
    setSpreadImage(reader, entry.url, alt, entry.displayUrl);
    notifyZineSpreadChange(root, entry.displayUrl, alt, entry.url);
  }

  syncToolbar(root, mode);
  syncThumbs(root, mode, page, false);
  updateDownloadButton(root, entry?.url ?? "");

  if (pushUrl) history.pushState(null, "", buildSpreadUrl(mode, page));
}

/** Left rail: bounded scroll + wheel capture (page scroll steals wheel otherwise). */
export function initZineSidebarScroll(root: HTMLElement): void {
  const rail = root.querySelector<HTMLElement>(".alt-zine-side-left .alt-zine-side-scroll");
  if (!rail) return;

  rail.querySelector<HTMLElement>(".alt-zine-side-card.is-current")?.scrollIntoView({ block: "nearest" });

  rail.addEventListener(
    "wheel",
    (e) => {
      const max = rail.scrollHeight - rail.clientHeight;
      if (max <= 0) return;
      const dy = e.deltaY;
      const atTop = rail.scrollTop <= 0;
      const atBottom = rail.scrollTop >= max - 1;
      if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) {
        e.preventDefault();
        rail.scrollTop += dy;
      }
    },
    { passive: false },
  );
}

export function initZineReader(root: HTMLElement): void {
  const readerEl = root.querySelector("#zine-reader");
  if (!(readerEl instanceof HTMLElement)) return;
  const reader = readerEl;

  let config: ZineReaderConfig;
  try {
    config = JSON.parse(reader.dataset.config ?? "{}") as ZineReaderConfig;
  } catch {
    return;
  }

  const hasSpreadNav = !!config.hasNarrativeSpreads && (config.spreads?.length ?? 0) > 0;
  const hasVariants = !hasSpreadNav && (config.variants?.length ?? 0) > 1;

  const applyFromUrl = (pushUrl: boolean): void => {
    const { mode, page } = readStateFromUrl();
    const total = pageTotalForMode(config, mode);
    const clamped = Math.min(Math.max(0, page), Math.max(0, total - 1));
    applyVariant(root, reader, config, mode, clamped, pushUrl);
  };

  applyFromUrl(false);

  function navigateFromHref(href: string, pushUrl: boolean): boolean {
    try {
      const { mode, page } = linkModePage(href);
      applyVariant(root, reader, config, mode, page, pushUrl);
      return true;
    } catch {
      return false;
    }
  }

  root.querySelectorAll<HTMLAnchorElement>(
    ".alt-zine-toolbar .switch-glass a[href], .alt-zine-thumbs a[href]",
  ).forEach((a) => {
    a.addEventListener("click", (e) => {
      if (!hasVariants && !hasSpreadNav) return;
      e.preventDefault();
      navigateFromHref(a.getAttribute("href") ?? "", true);
    });
  });

  window.addEventListener("popstate", () => applyFromUrl(false));

  if (!config.hrefs?.prev || !config.hrefs?.next) return;

  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    const { mode, page } = readStateFromUrl();
    const total = pageTotalForMode(config, mode);
    const delta = e.key === "ArrowLeft" ? -1 : 1;

    if (hasSpreadNav && (config.spreads?.length ?? 0) > 0) {
      const spreads = config.spreads!;
      const idx = spreads.findIndex((s) => s.mode === mode && s.page === page);
      const nextIdx = idx + delta;
      if (nextIdx >= 0 && nextIdx < spreads.length) {
        e.preventDefault();
        const s = spreads[nextIdx]!;
        applySpread(root, reader, config, s.mode, s.page, true);
        return;
      }
    } else if (hasSpreadNav) {
      const nextPage = page + delta;
      if (nextPage >= 0 && nextPage < total) {
        e.preventDefault();
        applySpread(root, reader, config, mode, nextPage, true);
        return;
      }
    }

    if (hasVariants) {
      const list = config.variants!;
      const idx = variantIndex(config, mode);
      const nextIdx = idx + delta;
      if (nextIdx >= 0 && nextIdx < list.length) {
        e.preventDefault();
        const v = list[nextIdx]!;
        applyVariant(root, reader, config, v.mode, page, true);
        return;
      }
    }

    e.preventDefault();
    location.assign(e.key === "ArrowLeft" ? config.hrefs.prev : config.hrefs.next);
  });
}
