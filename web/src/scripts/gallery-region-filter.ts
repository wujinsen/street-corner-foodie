/**
 * Country overview (`/cn/`): flavor rows + province pills + card visibility.
 * Static build ships one HTML; province/filter state is applied client-side (no reload).
 */

type RegionGalleryMeta = Record<
  string,
  {
    kicker: string;
    track: string;
    native: string | null;
    sub: string;
    stats: { poster: number; street: number; zine: number };
    medalUrl: string | null;
    medalAlt: string;
  }
>;

function regionFromSearch(search: string, fallback: string, validIds: Set<string>): string {
  const raw = new URLSearchParams(search).get("region");
  if (raw && validIds.has(raw)) return raw;
  return fallback;
}

function validRegionIds(gallery: HTMLElement): Set<string> {
  const ids = new Set<string>();
  gallery.querySelectorAll<HTMLElement>(".gallery-province-pills a[data-region-id]").forEach((a) => {
    if (a.dataset.regionId) ids.add(a.dataset.regionId);
  });
  return ids;
}

function readRegionMeta(gallery: HTMLElement): RegionGalleryMeta | null {
  const raw = gallery.querySelector<HTMLScriptElement>("[data-gallery-region-meta]")?.textContent;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RegionGalleryMeta;
  } catch {
    return null;
  }
}

function mutateRegionInUrl(pathname: string, search: string, regionId: string): string {
  const params = new URLSearchParams(search);
  params.delete("lang");
  params.set("region", regionId);
  params.delete("flavor");
  params.delete("zmore");
  params.delete("page");
  params.delete("zpage");
  const qs = params.toString();
  return pathname + (qs ? `?${qs}` : "");
}

function syncProvincePills(gallery: HTMLElement, regionId: string): void {
  gallery.querySelectorAll<HTMLAnchorElement>(".gallery-province-pills a[data-region-id]").forEach((a) => {
    a.classList.toggle("active", a.dataset.regionId === regionId);
  });
}

function syncFlavorRows(gallery: HTMLElement, regionId: string): void {
  gallery.querySelectorAll<HTMLElement>(".gallery-flavor-group[data-flavor-region]").forEach((row) => {
    row.classList.toggle("is-region-hidden", row.dataset.flavorRegion !== regionId);
  });
}

function syncRegionScopedLinks(gallery: HTMLElement, regionId: string): void {
  gallery.querySelectorAll<HTMLAnchorElement>(".gallery-flavor-pills:not(.is-region-hidden) a").forEach((a) => {
    try {
      const u = new URL(a.href, location.href);
      u.searchParams.set("region", regionId);
      a.href = u.pathname + u.search;
    } catch {
      /* ignore */
    }
  });
}

function syncGalleryCards(gallery: HTMLElement, regionId: string): void {
  gallery
    .querySelectorAll<HTMLElement>("[data-poster-region], [data-zine-region]")
    .forEach((el) => {
      const cardRegion = el.dataset.posterRegion ?? el.dataset.zineRegion;
      el.classList.toggle("is-gallery-region-hidden", cardRegion !== regionId);
    });
}

function syncRegionEmptyMessages(gallery: HTMLElement, regionId: string): void {
  gallery.querySelectorAll<HTMLElement>("[data-gallery-empty-region]").forEach((el) => {
    el.hidden = el.dataset.galleryEmptyRegion !== regionId;
  });
}

function syncStreetExplorerRegions(gallery: HTMLElement, regionId: string): void {
  gallery
    .querySelectorAll<HTMLElement>("[data-street-explorer-region]")
    .forEach((host) => {
      host.classList.toggle("is-gallery-region-hidden", host.dataset.regionId !== regionId);
    });
}

function syncHero(gallery: HTMLElement, regionId: string, meta: RegionGalleryMeta | null): void {
  const hero = gallery.querySelector<HTMLElement>("[data-gallery-country-hero]");
  if (!hero) return;
  hero.dataset.regionId = regionId;
  const m = meta?.[regionId];
  if (!m) return;

  const kicker = hero.querySelector<HTMLElement>("[data-hero-kicker]");
  const track = hero.querySelector<HTMLElement>("[data-hero-track]");
  const native = hero.querySelector<HTMLElement>("[data-hero-native]");
  const sub = hero.querySelector<HTMLElement>("[data-hero-sub]");
  const statPoster = hero.querySelector<HTMLElement>("[data-hero-stat-poster]");
  const statStreet = hero.querySelector<HTMLElement>("[data-hero-stat-street]");
  const statZine = hero.querySelector<HTMLElement>("[data-hero-stat-zine]");

  if (kicker) kicker.textContent = m.kicker;
  if (track) track.textContent = m.track;
  if (native) {
    if (m.native) {
      native.textContent = m.native;
      native.hidden = false;
    } else {
      native.hidden = true;
    }
  }
  if (sub) sub.textContent = m.sub;
  if (statPoster) statPoster.textContent = String(m.stats.poster);
  if (statStreet) statStreet.textContent = String(m.stats.street);
  if (statZine) statZine.textContent = String(m.stats.zine);

  const medalWrap = hero.querySelector<HTMLElement>("[data-hero-medal-wrap]");
  const medalBtn = hero.querySelector<HTMLButtonElement>("[data-region-medal-open]");
  const medalImg = medalBtn?.querySelector<HTMLImageElement>("img");
  if (medalWrap) {
    if (m.medalUrl) {
      medalWrap.hidden = false;
      if (medalBtn) {
        medalBtn.dataset.medalSrc = m.medalUrl;
        medalBtn.setAttribute("aria-label", m.medalAlt);
      }
      if (medalImg) medalImg.src = m.medalUrl;
    } else {
      medalWrap.hidden = true;
    }
  }
}

export function initGalleryRegionFilter(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-gallery-region-overview]").forEach((gallery) => {
    const fallback = gallery.dataset.defaultRegion || "hainan";
    const validIds = validRegionIds(gallery);
    const regionMeta = readRegionMeta(gallery);

    const apply = (): void => {
      const regionId = regionFromSearch(location.search, fallback, validIds);
      syncProvincePills(gallery, regionId);
      syncFlavorRows(gallery, regionId);
      syncGalleryCards(gallery, regionId);
      syncRegionEmptyMessages(gallery, regionId);
      syncRegionScopedLinks(gallery, regionId);
      syncStreetExplorerRegions(gallery, regionId);
      syncHero(gallery, regionId, regionMeta);
      gallery.dispatchEvent(
        new CustomEvent("scf-gallery-region", { detail: { regionId } }),
      );
    };

    gallery.querySelectorAll<HTMLAnchorElement>(".gallery-province-pills a[data-region-id]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.dataset.regionId;
        if (!id) return;
        const target = mutateRegionInUrl(location.pathname, location.search, id) + location.hash;
        if (location.pathname + location.search + location.hash === target) return;
        e.preventDefault();
        history.pushState(null, "", target);
        apply();
      });
    });

    apply();
    window.addEventListener("popstate", apply);
  });
}

/** Cards visible for flavor + region filters. */
export function isGalleryCardVisible(el: HTMLElement): boolean {
  return (
    !el.classList.contains("is-gallery-region-hidden") &&
    !el.classList.contains("is-gallery-flavor-hidden")
  );
}
