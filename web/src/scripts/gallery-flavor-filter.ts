/**
 * Client-side flavor filter for static SSG (?flavor= is not applied at build time).
 */

import { tagMatchesFlavor } from "../lib/flavor-match";
import { isGalleryCardVisible } from "./gallery-region-filter";

function flavorFromSearch(search: string): string | null {
  const f = new URLSearchParams(search).get("flavor");
  return f && f.length > 0 ? f : null;
}

function parseCardTags(el: HTMLElement): string[] {
  const raw = el.dataset.filterTags ?? "";
  if (!raw) return [];
  return raw.split("|").filter(Boolean);
}

function cardMatchesFlavor(el: HTMLElement, flavor: string | null): boolean {
  if (!flavor) return true;
  return parseCardTags(el).some((t) => tagMatchesFlavor(t, flavor));
}

function normalizeFlavor(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function syncFlavorChips(gallery: HTMLElement, flavor: string | null): void {
  const active = normalizeFlavor(flavor);
  gallery.querySelectorAll<HTMLAnchorElement>(".gallery-flavor-pills a").forEach((a) => {
    try {
      const chipFlavor = normalizeFlavor(new URL(a.href, location.href).searchParams.get("flavor"));
      const isAll = chipFlavor === null;
      a.classList.toggle("active", active ? chipFlavor === active : isAll);
    } catch {
      /* ignore bad href */
    }
  });
}

function updateCountEl(el: HTMLElement | null, visible: number, flavor: string | null): void {
  if (!el) return;
  const unit = el.dataset.countUnit ?? "";
  const totalAll = el.dataset.totalAll ?? "";
  const regionLabel = el.dataset.regionLabel ?? "";
  const parts: string[] = [];
  if (totalAll) {
    parts.push(`${visible} ${unit} / ${totalAll}`);
  } else {
    parts.push(`${visible} ${unit}`);
  }
  if (regionLabel) parts.push(` · ${regionLabel}`);
  if (flavor) parts.push(` · ${flavor}`);
  el.textContent = parts.join("").trim();
}

function applyFlavorFilter(gallery: HTMLElement): number {
  const flavor = normalizeFlavor(flavorFromSearch(location.search));

  syncFlavorChips(gallery, flavor);

  let posterVisible = 0;
  let zineVisible = 0;

  gallery.querySelectorAll<HTMLElement>("[data-filter-tags]").forEach((el) => {
    const panel = el.closest(".gallery-tab-panel") as HTMLElement | null;
    const tab = panel?.dataset.tab;
    const flavorOk = cardMatchesFlavor(el, flavor);
    el.classList.toggle("is-gallery-flavor-hidden", !flavorOk);
    const show = flavorOk && isGalleryCardVisible(el);
    if (show) {
      if (tab === "zines") zineVisible += 1;
      else posterVisible += 1;
    }
  });

  const zineCount = gallery.querySelector<HTMLElement>(".gallery-items-count[data-count-scope='zines']");
  updateCountEl(zineCount, zineVisible, flavor);

  gallery.dispatchEvent(
    new CustomEvent("scf-gallery-flavor", { detail: { flavor, posterVisible, zineVisible } }),
  );

  return posterVisible + zineVisible;
}

export function initGalleryFlavorFilter(root: ParentNode = document): void {
  const seen = new Set<HTMLElement>();
  root
    .querySelectorAll<HTMLElement>(".alt-gallery[data-gallery-tabs], .alt-gallery[data-gallery-lang]")
    .forEach((gallery) => {
      if (seen.has(gallery)) return;
      seen.add(gallery);
      const run = () => applyFlavorFilter(gallery);
      run();
      window.addEventListener("popstate", run);
      gallery.addEventListener("scf-gallery-region", run);
    });
}

/** Re-apply reveal slices after flavor changes (only non-flavor-hidden cards). */
