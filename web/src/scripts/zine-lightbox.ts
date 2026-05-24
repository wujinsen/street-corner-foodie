/** Full-screen zine view with wheel / button zoom — lightbox always upgrades to full PNG. */

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.15;

function spreadImg(spread: HTMLElement | null): HTMLImageElement | null {
  return spread?.querySelector("img") ?? null;
}

function spreadDisplaySrc(spread: HTMLElement | null): string {
  const img = spreadImg(spread);
  if (!img) return "";
  return (
    img.getAttribute("data-display-src") ||
    img.currentSrc ||
    img.getAttribute("src") ||
    img.src ||
    ""
  );
}

/** Original `/asserts/…` PNG. */
function spreadFullSrc(spread: HTMLElement | null): string {
  const img = spreadImg(spread);
  if (!img) return "";
  const full = img.getAttribute("data-full-src");
  if (full) return full;
  return spreadDisplaySrc(spread);
}

export function initZineLightbox(root: HTMLElement): void {
  const dialog = root.querySelector<HTMLDialogElement>("#zine-lightbox");
  const spread = root.querySelector<HTMLElement>("#zine-reader, #poster-reader");
  const scroll = dialog?.querySelector<HTMLElement>(".zine-lightbox-scroll");
  const stage = dialog?.querySelector<HTMLElement>("[data-zine-zoom-stage]");
  const lbImg = dialog?.querySelector<HTMLImageElement>(".zine-lightbox-img");
  const pctEl = dialog?.querySelector<HTMLElement>("[data-zine-zoom-pct]");
  const btnIn = dialog?.querySelector<HTMLButtonElement>("[data-zine-zoom-in]");
  const btnOut = dialog?.querySelector<HTMLButtonElement>("[data-zine-zoom-out]");
  const btnReset = dialog?.querySelector<HTMLButtonElement>("[data-zine-zoom-reset]");
  if (!dialog || !spread || !scroll || !stage || !lbImg) return;

  let scale = ZOOM_MIN;

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

  /** Lightbox / zoom: load original PNG immediately (not 720w WebP). */
  const applyFullRes = (fullSrc: string, displaySrc?: string): void => {
    if (!fullSrc) return;
    lbImg.setAttribute("data-full-src", fullSrc);
    if (displaySrc) lbImg.setAttribute("data-display-src", displaySrc);
    if (lbImg.src !== fullSrc) lbImg.src = fullSrc;
    lbImg.classList.add("is-full-res");
  };

  const setImage = (displaySrc: string, alt?: string, fullSrc?: string): void => {
    const full = fullSrc || displaySrc;
    lbImg.src = displaySrc;
    lbImg.setAttribute("data-full-src", full);
    lbImg.setAttribute("data-display-src", displaySrc);
    if (alt) lbImg.alt = alt;
    lbImg.classList.remove("is-full-res");
    resetZoom();
    if (full && full !== displaySrc) applyFullRes(full, displaySrc);
  };

  const open = (): void => {
    const display = spreadDisplaySrc(spread);
    const full = spreadFullSrc(spread);
    if (!display && !full) return;
    const alt = spreadImg(spread)?.alt ?? "";
    setImage(display || full, alt, full || display);
    if (typeof dialog.showModal === "function") dialog.showModal();
  };

  const close = (): void => {
    if (dialog.open) dialog.close();
    resetZoom();
    lbImg.classList.remove("is-full-res");
  };

  root.querySelector<HTMLButtonElement>("[data-zine-zoom-open]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    open();
  });

  spread.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("[data-zine-zoom-open]")) return;
    if ((e.target as HTMLElement).closest("img, picture")) open();
  });

  const zoomBy = (delta: number): void => {
    const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale + delta));
    if (next === scale) return;
    scale = next;
    applyScale();
    applyFullRes(spreadFullSrc(spread), spreadDisplaySrc(spread));
  };

  btnIn?.addEventListener("click", (e) => {
    e.stopPropagation();
    zoomBy(ZOOM_STEP);
  });
  btnOut?.addEventListener("click", (e) => {
    e.stopPropagation();
    zoomBy(-ZOOM_STEP);
  });
  btnReset?.addEventListener("click", (e) => {
    e.stopPropagation();
    resetZoom();
  });

  scroll.addEventListener(
    "wheel",
    (e) => {
      if (!dialog.open) return;
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
    },
    { passive: false },
  );

  dialog.querySelector("[data-zine-zoom-close]")?.addEventListener("click", close);
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });

  dialog.addEventListener("keydown", (e) => {
    if (!dialog.open) return;
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      zoomBy(ZOOM_STEP);
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      zoomBy(-ZOOM_STEP);
    } else if (e.key === "0") {
      e.preventDefault();
      resetZoom();
    }
  });

  root.addEventListener("zine-spread-change", ((e: CustomEvent<{ displayUrl: string; fullUrl?: string; alt?: string }>) => {
    if (!dialog.open) return;
    const full = e.detail.fullUrl ?? e.detail.displayUrl;
    setImage(e.detail.displayUrl, e.detail.alt, full);
  }) as EventListener);

  applyScale();
}

export function notifyZineSpreadChange(
  root: HTMLElement,
  displayUrl: string,
  alt?: string,
  fullUrl?: string,
): void {
  root.dispatchEvent(
    new CustomEvent("zine-spread-change", { detail: { displayUrl, fullUrl, alt } }),
  );
}
