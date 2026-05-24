/** Scroll hints + optional wrap mode for gallery filter pill rows. */

function updateTrack(track: HTMLElement): void {
  const scroll = track.querySelector<HTMLElement>(".filter-pill-scroll");
  if (!scroll) return;

  const row = track.closest<HTMLElement>(".gallery-filter-row");
  const wrapOver = Number(row?.dataset.wrapOver ?? "8");
  const pills = scroll.querySelectorAll("a, button");
  const useWrap = pills.length > wrapOver;

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

export function initFilterPillTracks(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-filter-track]").forEach((track) => {
    const scroll = track.querySelector<HTMLElement>(".filter-pill-scroll");
    if (!scroll) return;

    const onScroll = () => updateTrack(track);
    scroll.addEventListener("scroll", onScroll, { passive: true });
    updateTrack(track);

    const ro = new ResizeObserver(() => updateTrack(track));
    ro.observe(scroll);
  });
}
