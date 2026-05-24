/** Street view fullscreen lightbox — click main scene · wheel / ± zoom · optional browser fullscreen. */

import { scfSpreadUrls } from "../lib/scf-image";

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.15;

function mainHost(root: HTMLElement): HTMLElement | null {
  return root.querySelector<HTMLElement>("[data-street-main]");
}

function bgUrl(host: HTMLElement | null): string {
  if (!host) return "";
  const fromData = host.dataset.displaySrc || host.dataset.fullSrc;
  if (fromData) return fromData;
  const bg = host.style.backgroundImage;
  if (!bg || bg === "none") return "";
  const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
  return m?.[1]?.replace(/\\"/g, '"') ?? "";
}

function mainFullSrc(host: HTMLElement | null): string {
  if (!host) return "";
  const raw = host.dataset.fullSrc || host.dataset.displaySrc || bgUrl(host);
  if (!raw) return "";
  return scfSpreadUrls(raw).full ?? raw;
}

function stageMood(root: HTMLElement): string {
  return root.querySelector<HTMLElement>(".alt-street-stage")?.dataset.mood ?? "night";
}

export function initStreetLightbox(root: HTMLElement): void {
  const main = mainHost(root);
  const dialog = root.querySelector<HTMLDialogElement>("[data-street-lightbox]");
  const scroll = dialog?.querySelector<HTMLElement>(".zine-lightbox-scroll");
  const stage = dialog?.querySelector<HTMLElement>("[data-street-zoom-stage]");
  const moodWrap = dialog?.querySelector<HTMLElement>("[data-street-zoom-mood]");
  const lbImg = dialog?.querySelector<HTMLImageElement>("[data-street-lightbox-img]");
  const pctEl = dialog?.querySelector<HTMLElement>("[data-street-zoom-pct]");
  const btnIn = dialog?.querySelector<HTMLButtonElement>("[data-street-zoom-in]");
  const btnOut = dialog?.querySelector<HTMLButtonElement>("[data-street-zoom-out]");
  const btnReset = dialog?.querySelector<HTMLButtonElement>("[data-street-zoom-reset]");
  const btnFullscreen = dialog?.querySelector<HTMLButtonElement>("[data-street-zoom-fullscreen]");
  if (!main || !dialog || !scroll || !stage || !moodWrap || !lbImg) return;

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

  const applyFullRes = (fullSrc: string, displaySrc?: string): void => {
    if (!fullSrc) return;
    lbImg.setAttribute("data-full-src", fullSrc);
    if (displaySrc) lbImg.setAttribute("data-display-src", displaySrc);
    if (lbImg.src !== fullSrc) lbImg.src = fullSrc;
    lbImg.classList.add("is-full-res");
  };

  const setImage = (displaySrc: string, alt?: string, fullSrc?: string, mood?: string): void => {
    const full = fullSrc || displaySrc;
    lbImg.src = displaySrc;
    lbImg.setAttribute("data-full-src", full);
    lbImg.setAttribute("data-display-src", displaySrc);
    if (alt) lbImg.alt = alt;
    lbImg.classList.remove("is-full-res");
    moodWrap.dataset.mood = mood ?? stageMood(root);
    resetZoom();
    if (full && full !== displaySrc) applyFullRes(full, displaySrc);
  };

  const open = (): void => {
    const host = mainHost(root);
    const display = bgUrl(host);
    const full = mainFullSrc(host);
    if (!display && !full) return;
    const alt = host?.getAttribute("aria-label") ?? "";
    setImage(display || full, alt, full || display, stageMood(root));
    if (typeof dialog.showModal === "function") dialog.showModal();
  };

  const close = (): void => {
    if (document.fullscreenElement === scroll) {
      void document.exitFullscreen().catch(() => {});
    }
    if (dialog.open) dialog.close();
    resetZoom();
    lbImg.classList.remove("is-full-res");
  };

  root.querySelectorAll<HTMLButtonElement>("[data-street-zoom-open]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      open();
    });
  });

  main.addEventListener("click", (e) => {
    e.stopPropagation();
    open();
  });

  main.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    open();
  });

  const zoomBy = (delta: number): void => {
    const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale + delta));
    if (next === scale) return;
    scale = next;
    applyScale();
    applyFullRes(mainFullSrc(mainHost(root)), bgUrl(mainHost(root)));
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

  btnFullscreen?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (document.fullscreenElement === scroll) {
      void document.exitFullscreen().catch(() => {});
      return;
    }
    void scroll.requestFullscreen?.().catch(() => {});
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

  dialog.querySelector("[data-street-zoom-close]")?.addEventListener("click", close);

  /** Scroll fills the dialog — backdrop clicks hit scroll, not dialog. */
  const isLightboxContent = (target: HTMLElement): boolean =>
    !!target.closest(".zine-lightbox-bar, .street-lightbox-img, .zine-lightbox-img");

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
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      zoomBy(ZOOM_STEP);
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      zoomBy(-ZOOM_STEP);
    } else if (e.key === "0") {
      e.preventDefault();
      resetZoom();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      btnFullscreen?.click();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!btnFullscreen) return;
    const on = document.fullscreenElement === scroll;
    btnFullscreen.setAttribute("aria-pressed", on ? "true" : "false");
    btnFullscreen.dataset.fullscreen = on ? "true" : "false";
  });

  root.addEventListener("street-view-change", ((
    e: CustomEvent<{ displayUrl: string; fullUrl?: string; alt?: string; mood?: string }>,
  ) => {
    if (!dialog.open) return;
    const full = e.detail.fullUrl ?? e.detail.displayUrl;
    setImage(e.detail.displayUrl, e.detail.alt, full, e.detail.mood);
  }) as EventListener);

  applyScale();
}

export function notifyStreetViewChange(
  root: HTMLElement,
  detail: { displayUrl: string; fullUrl?: string; alt?: string; mood?: string },
): void {
  root.dispatchEvent(new CustomEvent("street-view-change", { detail }));
}
