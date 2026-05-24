/**
 * Landing · city card top locks to zine row; map band sits directly above card.
 * Map total height = 2× card top offset → half the map visible, half under the card.
 */

const STACK_MQ = "(max-width: 720px)";
const CARD_BOTTOM_INSET = 16;

function query() {
  const zine = document.querySelector<HTMLElement>(".bento-zine--proto");
  const spot = document.querySelector<HTMLElement>(".landing-spotlight");
  const map = document.querySelector<HTMLElement>(".landing-spotlight > .landing-world-atlas");
  const card = document.querySelector<HTMLElement>(".landing-spotlight > .landing-city-card");
  return { zine, spot, map, card };
}

function clearSpotLayout(spot: HTMLElement, card: HTMLElement, map: HTMLElement | null): void {
  spot.style.removeProperty("--landing-map-visible-h");
  spot.style.removeProperty("--landing-map-band-h");
  card.style.removeProperty("top");
  card.style.removeProperty("bottom");
  card.style.removeProperty("height");
  card.style.removeProperty("min-height");
  card.style.removeProperty("max-height");
  map?.style.removeProperty("height");
}

function syncCityCardToZine(): void {
  const { zine, spot, map, card } = query();
  if (!zine || !spot || !card) return;

  if (window.matchMedia(STACK_MQ).matches) {
    clearSpotLayout(spot, card, map);
    return;
  }

  const z = zine.getBoundingClientRect();
  const s = spot.getBoundingClientRect();
  const visibleH = Math.round(z.top - s.top);
  if (visibleH < 0) return;

  const bandH = visibleH * 2;

  spot.style.setProperty("--landing-map-visible-h", `${visibleH}px`);
  spot.style.setProperty("--landing-map-band-h", `${bandH}px`);

  if (map) {
    map.style.height = `${bandH}px`;
  }

  card.style.top = `${visibleH}px`;
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
  const { zine, spot, map, card } = query();
  if (!zine || !spot || !card) return;

  const mosaic = document.querySelector(".landing-bento-mosaic");
  const ro = new ResizeObserver(schedule);
  ro.observe(zine);
  if (mosaic) ro.observe(mosaic);
  ro.observe(spot);
  if (map) ro.observe(map);

  window.addEventListener("resize", schedule, { passive: true });
  window.matchMedia(STACK_MQ).addEventListener("change", schedule);
  window.addEventListener("load", schedule, { once: true });
  document.fonts?.ready?.then(schedule).catch(schedule);

  schedule();
}

init();
