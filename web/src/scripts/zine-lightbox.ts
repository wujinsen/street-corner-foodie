/** Full-screen zine / poster view — click spread or zoom btn · wheel / ± zoom · backdrop / Esc close. */

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.15;

function spreadImg(spread: HTMLElement | null): HTMLImageElement | null {
  return spread?.querySelector("img") ?? null;
}

function imgDisplaySrc(img: HTMLImageElement | null): string {
  if (!img) return "";
  return (
    img.getAttribute("data-display-src") ||
    img.currentSrc ||
    img.getAttribute("src") ||
    img.src ||
    ""
  );
}

function imgFullSrc(img: HTMLImageElement | null): string {
  if (!img) return "";
  const full = img.getAttribute("data-full-src");
  if (full) return full;
  return imgDisplaySrc(img);
}

function spreadDisplaySrc(spread: HTMLElement | null): string {
  return imgDisplaySrc(spreadImg(spread));
}

/** Original `/asserts/…` PNG. */
function spreadFullSrc(spread: HTMLElement | null): string {
  return imgFullSrc(spreadImg(spread));
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
  const btnClose = dialog?.querySelector<HTMLButtonElement>("[data-zine-zoom-close]");
  if (!dialog || !spread || !scroll || !stage || !lbImg) return;

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

  const openWithSrc = (displaySrc: string, fullSrc: string, alt?: string): void => {
    if (!displaySrc && !fullSrc) return;
    const display = displaySrc || fullSrc;
    const full = fullSrc || display;
    const label = alt ?? spreadImg(spread)?.alt ?? "";
    setImage(display, label, full);
    if (typeof dialog.showModal === "function") dialog.showModal();
    btnClose?.focus();
  };

  const open = (): void => {
    const display = spreadDisplaySrc(spread);
    const full = spreadFullSrc(spread);
    openWithSrc(display, full, spreadImg(spread)?.alt);
  };

  const close = (): void => {
    if (dialog.open) dialog.close();
    resetZoom();
    lbImg.classList.remove("is-full-res");
    lastFocus?.focus();
    lastFocus = null;
  };

  const isLightboxContent = (target: HTMLElement): boolean =>
    !!target.closest(".zine-lightbox-bar, .zine-lightbox-stage, .zine-lightbox-img");

  root.querySelector<HTMLButtonElement>("[data-zine-zoom-open]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    lastFocus = e.currentTarget instanceof HTMLElement ? e.currentTarget : null;
    open();
  });

  spread.setAttribute("tabindex", "0");
  spread.setAttribute("role", "button");
  const spreadLabel = spreadImg(spread)?.alt;
  if (spreadLabel && !spread.getAttribute("aria-label")) {
    spread.setAttribute("aria-label", spreadLabel);
  }

  spread.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("[data-zine-zoom-open]")) return;
    lastFocus = spread;
    open();
  });

  spread.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    lastFocus = spread;
    open();
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

  btnClose?.addEventListener("click", close);

  /** Scroll fills the dialog — backdrop clicks hit scroll, not dialog. */
  dialog.addEventListener("click", (e) => {
    if (!dialog.open) return;
    const target = e.target as HTMLElement;
    if (isLightboxContent(target)) return;
    close();
  });
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });

  dialog.addEventListener("keydown", (e) => {
    if (!dialog.open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
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
