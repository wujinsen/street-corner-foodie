/**
 * Gallery filter · collapsible panel on narrow viewports (≤900px).
 */
import { refreshFilterPillTracks } from "./filter-pill-track";

const FILTER_COLLAPSE_MQ = "(max-width: 900px)";
const FILTER_DESKTOP_MQ = "(min-width: 901px)";

function isMobileFilter(): boolean {
  return window.matchMedia(FILTER_COLLAPSE_MQ).matches;
}

/** 桌面端强制展开 details（避免 UA 在 closed 时隐藏 body，导致省份/风味整行消失） */
function syncFilterCollapseOpen(details: HTMLDetailsElement): void {
  if (window.matchMedia(FILTER_DESKTOP_MQ).matches) {
    details.open = true;
    return;
  }
  if (!details.dataset.userToggled) {
    details.open = false;
  }
}

function bindFilterCollapseMq(details: HTMLDetailsElement): void {
  const mq = window.matchMedia(FILTER_COLLAPSE_MQ);
  const onChange = () => syncFilterCollapseOpen(details);
  mq.addEventListener("change", onChange);
  syncFilterCollapseOpen(details);

  details.addEventListener("toggle", () => {
    if (isMobileFilter()) details.dataset.userToggled = "1";
  });
}

function activeText(
  root: ParentNode,
  selector: string,
): string | null {
  const el = root.querySelector<HTMLElement>(selector);
  const text = el?.textContent?.trim();
  return text || null;
}

function updateFilterSummary(details: HTMLDetailsElement): void {
  const summaryEl = details.querySelector<HTMLElement>("[data-filter-summary]");
  if (!summaryEl) return;

  const bar = details.closest(".gallery-filter-bar");
  const gallery =
    details.closest<HTMLElement>("[data-gallery-region-overview]") ??
    details.closest(".alt-gallery") ??
    document;

  const parts: string[] = [];

  const country =
    activeText(bar ?? gallery, ".country-picker--filter .country-picker__label") ??
    activeText(bar ?? gallery, ".gallery-filter-row--country .country-picker__label");
  if (country) parts.push(country);

  const region = activeText(
    gallery,
    ".gallery-province-pills a.active",
  );
  if (region) parts.push(region);

  const flavor = activeText(
    gallery,
    ".gallery-flavor-pills:not(.is-region-hidden) a.active",
  );
  if (flavor) parts.push(flavor);

  if (parts.length === 0) return;

  summaryEl.replaceChildren();
  parts.forEach((part, i) => {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.className = "gallery-filter-collapse__sep";
      sep.setAttribute("aria-hidden", "true");
      sep.textContent = " · ";
      summaryEl.append(sep);
    }
    const span = document.createElement("span");
    span.dataset.filterSummaryPart = "";
    span.textContent = part;
    summaryEl.append(span);
  });
}

function closeIfMobile(details: HTMLDetailsElement): void {
  if (!isMobileFilter()) return;
  details.open = false;
}

function bindScrollAwayCollapse(details: HTMLDetailsElement): void {
  let openScrollY = 0;
  let watchScroll = false;

  details.addEventListener("toggle", () => {
    if (details.open && isMobileFilter()) {
      openScrollY = window.scrollY;
      watchScroll = true;
      refreshFilterPillTracks(details);
      return;
    }
    watchScroll = false;
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!watchScroll || !details.open || !isMobileFilter()) return;
      if (window.scrollY > openScrollY + 32) {
        details.open = false;
        watchScroll = false;
      }
    },
    { passive: true },
  );
}

export function initGalleryFilterCollapse(root: ParentNode = document): void {
  root.querySelectorAll<HTMLDetailsElement>("[data-gallery-filter-collapse]").forEach((details) => {
    const bar = details.closest(".gallery-filter-bar");
    if (!bar) return;

    updateFilterSummary(details);
    bindFilterCollapseMq(details);
    bindScrollAwayCollapse(details);

    bar.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a");
      if (!link || !bar.contains(link)) return;
      if (link.closest(".country-picker")) return;
      if (link.closest(".gallery-province-pills, .gallery-flavor-pills")) {
        queueMicrotask(() => {
          updateFilterSummary(details);
          closeIfMobile(details);
        });
      }
    });
  });

  const onRegionOrFlavor = (): void => {
    document.querySelectorAll<HTMLDetailsElement>("[data-gallery-filter-collapse]").forEach(updateFilterSummary);
  };

  document.addEventListener("scf-gallery-region", onRegionOrFlavor);
  document.addEventListener("scf-gallery-flavor", onRegionOrFlavor);
  window.addEventListener("popstate", onRegionOrFlavor);
}
