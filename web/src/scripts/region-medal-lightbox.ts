/** Region seal lightbox — hero medal button · wheel / ± zoom · Esc close. */

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.15;

export function initRegionMedalLightbox(root: ParentNode = document): void {
  const dialog = root.querySelector<HTMLDialogElement>("[data-region-medal-lightbox]");
  const scroll = dialog?.querySelector<HTMLElement>(".zine-lightbox-scroll");
  const stage = dialog?.querySelector<HTMLElement>("[data-region-medal-zoom-stage]");
  const lbImg = dialog?.querySelector<HTMLImageElement>("[data-region-medal-lightbox-img]");
  const pctEl = dialog?.querySelector<HTMLElement>("[data-region-medal-zoom-pct]");
  const btnIn = dialog?.querySelector<HTMLButtonElement>("[data-region-medal-zoom-in]");
  const btnOut = dialog?.querySelector<HTMLButtonElement>("[data-region-medal-zoom-out]");
  const btnReset = dialog?.querySelector<HTMLButtonElement>("[data-region-medal-zoom-reset]");
  const btnClose = dialog?.querySelector<HTMLButtonElement>("[data-region-medal-zoom-close]");
  if (!dialog || !scroll || !stage || !lbImg) return;

  let scale = ZOOM_MIN;
  let lastFocus: HTMLElement | null = null;

  const syncPct = (): void => {
    if (pctEl) pctEl.textContent = `${Math.round(scale * 100)}%`;
    if (btnOut) btnOut.disabled = scale <= ZOOM_MIN + 0.001;
    if (btnIn) btnIn.disabled = scale >= ZOOM_MAX - 0.001;
  };

  const applyScale = (): void => {
    stage.style.transform = `scale(${scale})`;
    syncPct();
  };

  const resetZoom = (): void => {
    scale = ZOOM_MIN;
    applyScale();
    scroll.scrollTop = 0;
    scroll.scrollLeft = 0;
  };

  const open = (src: string, alt: string): void => {
    lbImg.src = src;
    lbImg.alt = alt;
    resetZoom();
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (typeof dialog.showModal === "function") dialog.showModal();
  };

  const close = (): void => {
    if (dialog.open) dialog.close();
    resetZoom();
    lastFocus?.focus();
    lastFocus = null;
  };

  const zoomBy = (delta: number): void => {
    scale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale + delta));
    applyScale();
  };

  root.querySelectorAll<HTMLButtonElement>("[data-region-medal-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.medalSrc;
      if (!src) return;
      const alt = btn.getAttribute("aria-label") ?? "";
      open(src, alt);
    });
  });

  btnIn?.addEventListener("click", () => zoomBy(ZOOM_STEP));
  btnOut?.addEventListener("click", () => zoomBy(-ZOOM_STEP));
  btnReset?.addEventListener("click", resetZoom);
  btnClose?.addEventListener("click", close);

  scroll.addEventListener(
    "wheel",
    (e) => {
      if (!dialog.open) return;
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
    },
    { passive: false },
  );

  dialog.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-region-medal-zoom-close], .zine-lightbox-bar, .region-medal-lightbox-img")) {
      return;
    }
    if (target === dialog || target === scroll) close();
  });

  dialog.addEventListener("close", resetZoom);

  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
}
