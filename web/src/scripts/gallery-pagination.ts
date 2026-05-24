/**
 * Client-side gallery pagination for static builds.
 * Posters: ?page= · Zines: ?zpage=
 * Pages slice **visible** cards (respects region + flavor filters).
 */

import { isGalleryCardVisible } from "./gallery-region-filter";

function pageFromSearch(search: string, pageParam: string, pageCount: number): number {
  const raw = new URLSearchParams(search).get(pageParam) ?? "0";
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.floor(n), Math.max(0, pageCount - 1));
}

function pageHrefFor(
  pathname: string,
  search: string,
  pageParam: string,
  pageIndex: number,
  hashAnchor?: string,
): string {
  const params = new URLSearchParams(search);
  params.delete("lang");
  if (pageIndex <= 0) params.delete(pageParam);
  else params.set(pageParam, String(pageIndex));
  const qs = params.toString();
  const base = pathname + (qs ? `?${qs}` : "");
  return hashAnchor ? `${base}#${hashAnchor}` : base;
}

function paginationScope(nav: HTMLElement): HTMLElement | null {
  /* Country overview: pagination lives in .gallery-bottom-stack, cards in .gallery-tab-panel */
  const tabKey =
    nav.closest<HTMLElement>("[data-tab-pagination]")?.dataset.tabPagination ??
    nav.dataset.scrollAnchor;
  if (tabKey) {
    const panel = nav
      .closest(".alt-gallery")
      ?.querySelector<HTMLElement>(`.gallery-tab-panel[data-tab="${tabKey}"]`);
    if (panel) return panel;
  }

  return (
    nav.closest(".gallery-tab-panel") ??
    nav.closest("section") ??
    nav.parentElement
  );
}

function visiblePageableCards(scope: HTMLElement): HTMLElement[] {
  return [...scope.querySelectorAll<HTMLElement>("[data-gallery-page]")].filter(
    (el) => !el.closest(".gallery-pagination") && isGalleryCardVisible(el),
  );
}

function effectivePageCount(cardCount: number, pageSize: number): number {
  if (cardCount <= 0) return 1;
  return Math.max(1, Math.ceil(cardCount / pageSize));
}

function applyGalleryPage(
  pageIndex: number,
  nav: HTMLElement,
  pageParam: string,
  pathname: string,
  search: string,
): number {
  const pageSize = Number(nav.dataset.pageSize) || 12;
  const scope = paginationScope(nav);
  if (!scope) return 0;

  const cards = visiblePageableCards(scope);
  const pageCount = effectivePageCount(cards.length, pageSize);
  const active = Math.min(Math.max(0, pageIndex), pageCount - 1);
  const hashAnchor = nav.dataset.scrollAnchor || "";

  scope.querySelectorAll<HTMLElement>("[data-gallery-page]").forEach((el) => {
    if (el.closest(".gallery-pagination")) return;
    if (!isGalleryCardVisible(el)) {
      el.classList.add("is-gallery-page-hidden");
      return;
    }
    el.classList.remove("is-gallery-page-hidden");
  });

  cards.forEach((el, i) => {
    const pg = Math.floor(i / pageSize);
    el.classList.toggle("is-gallery-page-hidden", pg !== active);
  });

  nav.querySelectorAll<HTMLAnchorElement>("a[data-gallery-page]").forEach((a) => {
    const idx = Number(a.dataset.galleryPage);
    const inRange = Number.isFinite(idx) && idx < pageCount;
    a.hidden = !inRange;
    a.classList.toggle("active", inRange && idx === active);
    if (inRange) {
      a.href = pageHrefFor(pathname, search, pageParam, idx, hashAnchor);
    }
  });

  const next = nav.querySelector<HTMLAnchorElement>("a[data-gallery-next]");
  if (next) {
    const hasNext = active < pageCount - 1;
    next.classList.toggle("is-gallery-page-hidden", !hasNext);
    next.hidden = !hasNext;
    if (hasNext) {
      next.href = pageHrefFor(pathname, search, pageParam, active + 1, hashAnchor);
    }
  }

  nav.hidden = pageCount <= 1;
  nav.dataset.livePageCount = String(pageCount);

  return active;
}

function navigateToPage(
  pageIndex: number,
  nav: HTMLElement,
  pageParam: string,
  scrollAnchorId: string,
): void {
  const url = new URL(location.href);
  const pageSize = Number(nav.dataset.pageSize) || 12;
  const scope = paginationScope(nav);
  const cards = scope ? visiblePageableCards(scope) : [];
  const pageCount = effectivePageCount(cards.length, pageSize);
  const clamped = Math.min(Math.max(0, pageIndex), pageCount - 1);
  const target = pageHrefFor(url.pathname, url.search, pageParam, clamped, scrollAnchorId);
  history.pushState(null, "", target);
  applyGalleryPage(clamped, nav, pageParam, url.pathname, url.search);

  const anchor = document.getElementById(scrollAnchorId);
  if (anchor) {
    anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initOnePagination(nav: HTMLElement): void {
  const pageParam = nav.dataset.pageParam || "page";
  const scrollAnchorId = nav.dataset.scrollAnchor || "posters";
  const pageSize = Number(nav.dataset.pageSize) || 12;

  const syncFromUrl = (): void => {
    const url = new URL(location.href);
    const scope = paginationScope(nav);
    const cards = scope ? visiblePageableCards(scope) : [];
    const pageCount = effectivePageCount(cards.length, pageSize);
    const p = pageFromSearch(url.search, pageParam, pageCount);
    applyGalleryPage(p, nav, pageParam, url.pathname, url.search);
  };

  nav.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      "a[data-gallery-page], a[data-gallery-next]",
    );
    if (!link || !nav.contains(link) || link.hidden) return;
    e.preventDefault();

    const url = new URL(location.href);
    const scope = paginationScope(nav);
    const cards = scope ? visiblePageableCards(scope) : [];
    const pageCount = effectivePageCount(cards.length, pageSize);
    const current = pageFromSearch(url.search, pageParam, pageCount);

    let targetPage: number;
    if (link.hasAttribute("data-gallery-next")) {
      targetPage = current + 1;
    } else {
      targetPage = Number(link.dataset.galleryPage);
    }

    if (!Number.isFinite(targetPage)) return;
    navigateToPage(targetPage, nav, pageParam, scrollAnchorId);
  });

  window.addEventListener("popstate", syncFromUrl);
  window.addEventListener("hashchange", syncFromUrl);

  const gallery = nav.closest(".alt-gallery");
  gallery?.addEventListener("scf-gallery-region", () => {
    syncFromUrl();
  });
  gallery?.addEventListener("scf-gallery-flavor", syncFromUrl);

  syncFromUrl();
}

export function initGalleryPagination(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(".gallery-pagination[data-gallery-paginate]").forEach((nav) => {
    initOnePagination(nav);
  });
}
