/**
 * Landing · city card top locks to zine row; map fixed from viewport left to bento edge.
 * Map band height = visibleH / (2/3) → two-thirds visible above city card.
 */

import { getVisibleBentoScope } from "./landing-bento-scope";

/** 与 CSS：≤1024 单列堆叠、≥1025 桌面双栏 + fixed map 对齐 */
const STACK_MQ = "(max-width: 1024px)";
const DESKTOP_MAP_MQ = "(min-width: 1025px)";
const CARD_BOTTOM_INSET = 16;
/** Fraction of map band visible above the city card (aligned to zine row). */
const MAP_VISIBLE_RATIO = 2 / 3;
/** Gap before poster/bento column — close but must not overlap. */
const MAP_RIGHT_INSET = 8;
/** Tokyo pin target · px left of poster column inner edge (desktop only). */
const TOKYO_POSTER_GAP = 18;

function query() {
  const panel = getVisibleBentoScope();
  const scope = panel ?? document;
  const zine = scope.querySelector<HTMLElement>(".bento-zine--proto");
  const spot = document.querySelector<HTMLElement>(".landing-spotlight");
  const map = document.querySelector<HTMLElement>(".landing-spotlight > .landing-world-atlas");
  const card = document.querySelector<HTMLElement>(".landing-spotlight > .landing-city-card");
  const topbar = document.querySelector<HTMLElement>(".topbar");
  const poster = scope.querySelector<HTMLElement>(".bento-dish--proto");
  const feature = document.querySelector<HTMLElement>(".landing-feature--bento-only");
  const grid = document.querySelector<HTMLElement>(".landing-grid");
  const mosaic = scope.querySelector<HTMLElement>(".landing-bento-mosaic");
  return { zine, spot, map, card, topbar, poster, feature, grid, mosaic, panel };
}

function clearSpotLayout(
  spot: HTMLElement,
  card: HTMLElement,
  map: HTMLElement | null,
): void {
  for (const el of [spot, map, document.documentElement]) {
    el?.style.removeProperty("--landing-map-visible-h");
    el?.style.removeProperty("--landing-map-band-h");
    el?.style.removeProperty("--landing-map-fixed-top");
    el?.style.removeProperty("--landing-map-width");
    el?.style.removeProperty("--landing-map-inset-right");
    el?.style.removeProperty("--landing-tokyo-screen-x");
  }
  card.style.removeProperty("top");
  card.style.removeProperty("bottom");
  card.style.removeProperty("height");
  card.style.removeProperty("min-height");
  card.style.removeProperty("max-height");
  map?.style.removeProperty("height");
  map?.style.removeProperty("width");
  map?.style.removeProperty("max-width");
  map?.style.removeProperty("left");
  map?.style.removeProperty("top");
  map?.style.removeProperty("right");
  map?.style.removeProperty("bottom");
  map?.style.removeProperty("position");
}

function mapRightBoundary(
  spotRect: DOMRect,
  posterRect: DOMRect | null,
  featureRect: DOMRect | null,
): number {
  const candidates = [posterRect?.left, featureRect?.left].filter(
    (v): v is number => v != null && Number.isFinite(v),
  );

  if (candidates.length > 0) {
    const columnStart = Math.min(...candidates);
    if (columnStart > spotRect.left + 24) {
      return columnStart - MAP_RIGHT_INSET;
    }
  }

  return Math.min(window.innerWidth, spotRect.right);
}

function applyMapLayoutVars(
  targets: Array<HTMLElement | null | undefined>,
  vars: Record<string, string>,
): void {
  for (const el of targets) {
    if (!el) continue;
    for (const [key, value] of Object.entries(vars)) {
      el.style.setProperty(key, value);
    }
  }
}

function syncCityCardToZine(): void {
  const { zine, spot, map, card, topbar, poster, feature } = query();
  if (!zine || !spot || !card) return;

  if (window.matchMedia(STACK_MQ).matches) {
    clearSpotLayout(spot, card, map);
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("scf:landing-map-layout"));
    });
    return;
  }

  const z = zine.getBoundingClientRect();
  const s = spot.getBoundingClientRect();
  const topbarBottom = topbar?.getBoundingClientRect().bottom ?? s.top;

  let visibleH = Math.round(z.top - topbarBottom);
  if (visibleH < 48) {
    const fallback = Math.round(Math.min(window.innerHeight * 0.24, 320));
    if (fallback < 48) return;
    visibleH = fallback;
  }

  const bandH = Math.round(visibleH / MAP_VISIBLE_RATIO);
  const cardTopInSpot = Math.round(z.top - s.top);
  const mapRightX = mapRightBoundary(
    s,
    poster?.getBoundingClientRect() ?? null,
    feature?.getBoundingClientRect() ?? null,
  );
  const mapWidth = Math.max(240, Math.round(mapRightX));
  const insetRight = Math.max(0, Math.round(window.innerWidth - mapWidth));
  const posterLeft =
    poster?.getBoundingClientRect().left ??
    feature?.getBoundingClientRect().left ??
    mapRightX + MAP_RIGHT_INSET;
  const tokyoTargetX = Math.max(48, Math.round(posterLeft - TOKYO_POSTER_GAP));
  const tokyoScreenX = Math.min(97, Math.max(84, (tokyoTargetX / mapWidth) * 100));

  const layoutVars = {
    "--landing-map-visible-h": `${visibleH}px`,
    "--landing-map-band-h": `${bandH}px`,
    "--landing-map-fixed-top": `${Math.round(topbarBottom)}px`,
    "--landing-map-width": `${mapWidth}px`,
    "--landing-map-inset-right": `${insetRight}px`,
    "--landing-tokyo-screen-x": `${tokyoScreenX.toFixed(1)}`,
  };

  applyMapLayoutVars([spot, map, document.documentElement], layoutVars);
  window.dispatchEvent(new Event("scf:landing-map-layout"));

  card.style.top = `${cardTopInSpot}px`;
  card.style.bottom = `${CARD_BOTTOM_INSET}px`;
  card.style.removeProperty("height");
  card.style.removeProperty("min-height");
  card.style.removeProperty("max-height");
}

let raf = 0;

function schedule(): void {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(syncCityCardToZine);
}

function init(): void {
  const { zine, spot, map, card, topbar, poster, feature, grid, mosaic } = query();
  if (!zine || !spot || !card) return;

  const ro = new ResizeObserver(schedule);
  ro.observe(zine);
  if (mosaic) ro.observe(mosaic);
  ro.observe(spot);
  if (map) ro.observe(map);
  if (topbar) ro.observe(topbar);
  if (poster) ro.observe(poster);
  if (feature) ro.observe(feature);
  if (grid) ro.observe(grid);

  window.addEventListener("resize", schedule, { passive: true });
  window.matchMedia(STACK_MQ).addEventListener("change", schedule);
  window.matchMedia(DESKTOP_MAP_MQ).addEventListener("change", schedule);
  window.addEventListener("load", schedule, { once: true });
  window.addEventListener("scf:landing-bento-synced", schedule);
  window.addEventListener("scf:landing-spot", schedule);
  document.fonts?.ready?.then(schedule).catch(schedule);

  schedule();
}

init();
