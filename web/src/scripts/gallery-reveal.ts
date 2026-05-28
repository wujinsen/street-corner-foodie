/**
 * Progressive gallery reveal (load more / show all) for static builds.
 * Works with gallery-flavor-filter.ts (counts only flavor-visible cards).
 */

import {
  formatGalleryShowing,
  formatLoadMore,
  GALLERY_REVEAL_INITIAL,
  GALLERY_REVEAL_STEP,
  moreFromSearch,
  revealVisibleCount,
} from "../lib/gallery-reveal";
import type { Lang } from "../lib/i18n";

function moreHref(pathname: string, search: string, param: string, steps: number): string {
  const params = new URLSearchParams(search);
  params.delete("lang");
  if (steps <= 0) params.delete(param);
  else params.set(param, String(steps));
  const qs = params.toString();
  return pathname + (qs ? `?${qs}` : "");
}

function visibleCardsInScope(footer: HTMLElement): HTMLElement[] {
  const scope =
    footer.closest(".gallery-tab-panel") ??
    footer.closest("section") ??
    footer.parentElement;
  if (!scope) return [];
  return [...scope.querySelectorAll<HTMLElement>("[data-gallery-item]")].filter(
    (el) => !el.classList.contains("is-gallery-flavor-hidden"),
  );
}

function applyReveal(footer: HTMLElement, visible: number): void {
  const cards = visibleCardsInScope(footer);
  const total = cards.length;
  const initial = Number(footer.dataset.initial) || GALLERY_REVEAL_INITIAL;
  const step = Number(footer.dataset.step) || GALLERY_REVEAL_STEP;
  const lang = (footer.dataset.lang || "zh") as Lang;

  cards.forEach((el, i) => {
    el.classList.toggle("is-gallery-page-hidden", i >= visible);
  });

  const start = total === 0 ? 0 : 1;
  const end = Math.min(visible, total);
  const rangeEl = footer.querySelector("[data-gallery-range]");
  if (rangeEl) {
    rangeEl.textContent = formatGalleryShowing(lang, start, end, total);
  }

  const moreBtn = footer.querySelector<HTMLButtonElement>("[data-gallery-load-more]");
  if (moreBtn) {
    const remaining = total - visible;
    const chunk = Math.min(step, remaining);
    moreBtn.hidden = remaining <= 0;
    if (remaining > 0) {
      moreBtn.textContent = formatLoadMore(lang, chunk);
    }
  }

  const allBtn = footer.querySelector<HTMLButtonElement>("[data-gallery-show-all]");
  if (allBtn) {
    allBtn.hidden = visible >= total;
  }

  footer.dataset.total = String(total);
  footer.dataset.visible = String(end);
  footer.hidden = total <= initial;

  const steps = visible <= initial ? 0 : Math.ceil((visible - initial) / step);
  footer.dataset.moreSteps = String(steps);
}

function navigateReveal(footer: HTMLElement, targetVisible: number): void {
  const url = new URL(location.href);
  const total = visibleCardsInScope(footer).length;
  const initial = Number(footer.dataset.initial) || GALLERY_REVEAL_INITIAL;
  const step = Number(footer.dataset.step) || GALLERY_REVEAL_STEP;
  const moreParam = footer.dataset.moreParam || "zmore";
  const visible = Math.min(total, targetVisible);
  const steps = visible <= initial ? 0 : Math.ceil((visible - initial) / step);
  const target = moreHref(url.pathname, url.search, moreParam, steps) + url.hash;
  history.pushState(null, "", target);
  applyReveal(footer, visible);

  const anchorId = footer.dataset.scrollAnchor;
  if (anchorId) {
    const anchor = document.getElementById(anchorId);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

function initOneReveal(footer: HTMLElement): void {
  const initial = Number(footer.dataset.initial) || GALLERY_REVEAL_INITIAL;
  const step = Number(footer.dataset.step) || GALLERY_REVEAL_STEP;
  const moreParam = footer.dataset.moreParam || "zmore";

  const syncFromUrl = (): void => {
    const url = new URL(location.href);
    const total = visibleCardsInScope(footer).length;
    if (total <= initial) {
      footer.hidden = true;
      visibleCardsInScope(footer).forEach((el) => el.classList.remove("is-gallery-page-hidden"));
      return;
    }
    footer.hidden = false;
    const more = moreFromSearch(url.search, moreParam);
    const visible = revealVisibleCount(total, more, initial, step);
    applyReveal(footer, visible);
  };

  footer.addEventListener("click", (e) => {
    const moreBtn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-gallery-load-more]");
    const allBtn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-gallery-show-all]");
    const searchBtn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-open-search]");

    if (searchBtn) {
      e.preventDefault();
      openSearchAnywhere();
      return;
    }

    if (!moreBtn && !allBtn) return;
    e.preventDefault();

    const current = Number(footer.dataset.visible) || initial;
    const total = visibleCardsInScope(footer).length;
    if (allBtn) {
      navigateReveal(footer, total);
      return;
    }
    navigateReveal(footer, current + step);
  });

  window.addEventListener("popstate", syncFromUrl);

  const gallery = footer.closest(".alt-gallery");
  gallery?.addEventListener("scf-gallery-flavor", syncFromUrl);

  syncFromUrl();
}

export function initGalleryReveal(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-gallery-reveal]").forEach((footer) => {
    initOneReveal(footer);
  });

  root.querySelectorAll<HTMLButtonElement>("[data-open-search]").forEach((btn) => {
    if (btn.closest("[data-gallery-reveal]")) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openSearchAnywhere();
    });
  });
}

/** 2026-05-28 · P1：search 入口可能在 topbar / bottom dock / data-action 任一处。 */
function openSearchAnywhere(): void {
  const target =
    document.getElementById("search-btn") ??
    document.getElementById("dock-search-btn") ??
    document.querySelector<HTMLElement>('[data-action="open-search"]');
  target?.click();
}
