/** Scroll hints + optional wrap mode for gallery filter pill rows. */

const FILTER_SCROLL_MQ = "(max-width: 900px)";

function prefersFilterScroll(): boolean {
  return window.matchMedia(FILTER_SCROLL_MQ).matches;
}

function updateTrack(track: HTMLElement): void {
  const scroll = track.querySelector<HTMLElement>(".filter-pill-scroll");
  if (!scroll) return;

  const row = track.closest<HTMLElement>(".gallery-filter-row");
  const wrapOver = Number(row?.dataset.wrapOver ?? "8");
  const pills = scroll.querySelectorAll("a, button");
  /* 手机端一律横滑，避免 is-wrap 限高裁切省份/风味 */
  const useWrap = pills.length > wrapOver && !prefersFilterScroll();

  track.classList.toggle("is-wrap", useWrap);
  if (useWrap) {
    track.classList.remove("can-scroll-left", "can-scroll-right");
    return;
  }

  const max = scroll.scrollWidth - scroll.clientWidth;
  const sl = scroll.scrollLeft;
  track.classList.toggle("can-scroll-left", sl > 4);
  track.classList.toggle("can-scroll-right", max > 4 && sl < max - 4);

  const active = scroll.querySelector<HTMLElement>("a.active, button.active");
  if (active && !useWrap) {
    const left = active.offsetLeft - scroll.clientWidth / 2 + active.offsetWidth / 2;
    scroll.scrollLeft = Math.max(0, Math.min(left, max));
  }
}

let filterScrollMqBound = false;

function bindFilterScrollMq(): void {
  if (filterScrollMqBound) return;
  filterScrollMqBound = true;
  window.matchMedia(FILTER_SCROLL_MQ).addEventListener("change", () => {
    document.querySelectorAll<HTMLElement>("[data-filter-track]").forEach(updateTrack);
  });
}

function bindTouchPanScroll(track: HTMLElement, scroll: HTMLElement): void {
  let startX = 0;
  let startLeft = 0;
  let panning = false;

  const onPointerDown = (e: PointerEvent): void => {
    if (!prefersFilterScroll()) return;
    if (scroll.scrollWidth <= scroll.clientWidth + 2) return;
    if (e.button !== 0) return;
    panning = true;
    startX = e.clientX;
    startLeft = scroll.scrollLeft;
    scroll.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (!panning) return;
    scroll.scrollLeft = startLeft - (e.clientX - startX);
  };

  const endPan = (e: PointerEvent): void => {
    if (!panning) return;
    panning = false;
    try {
      scroll.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    updateTrack(track);
  };

  scroll.addEventListener("pointerdown", onPointerDown, { capture: true });
  scroll.addEventListener("pointermove", onPointerMove);
  scroll.addEventListener("pointerup", endPan);
  scroll.addEventListener("pointercancel", endPan);
}

export function refreshFilterPillTracks(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-filter-track]").forEach(updateTrack);
}

export function initFilterPillTracks(root: ParentNode = document): void {
  bindFilterScrollMq();
  root.querySelectorAll<HTMLElement>("[data-filter-track]").forEach((track) => {
    const scroll = track.querySelector<HTMLElement>(".filter-pill-scroll");
    if (!scroll) return;

    const onScroll = () => updateTrack(track);
    scroll.addEventListener("scroll", onScroll, { passive: true });
    updateTrack(track);
    bindTouchPanScroll(track, scroll);

    const ro = new ResizeObserver(() => updateTrack(track));
    ro.observe(scroll);
    ro.observe(track);
  });
}
