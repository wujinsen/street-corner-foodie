/**
 * v0.6 · Interactive world map on landing (pins + zones + city card preview).
 * Progressive enhancement: pins remain normal links without JS.
 */

import { applyLandingCoordsEl } from "../lib/landing-coords";
import { syncCountryChrome } from "./country-picker";


type Spot = {
  id: string;
  city: { zh: string; en: string; ja: string };
  citySub: { zh: string; en: string; ja: string };
  coords: string;
  heroUrl: string | null;
  streetHref: string;
  countryHref: string;
  regionHref: string;
  statsLine: string;
  pinCount: number;
};

function readSpots(root: HTMLElement): Spot[] {
  const raw = root.getAttribute("data-landing-map-json");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Spot[];
  } catch {
    return [];
  }
}

function spotLang(root: HTMLElement): "zh" | "en" | "ja" {
  const l = root.getAttribute("data-lang");
  if (l === "en" || l === "ja") return l;
  return "zh";
}

function tSpot(spot: Spot, lang: "zh" | "en" | "ja", key: "city" | "citySub"): string {
  return spot[key][lang] || spot[key].zh;
}

export function initLandingMap(root: HTMLElement | null): void {
  if (!root) return;
  const mapRoot = root;

  const spots = readSpots(mapRoot);
  if (!spots.length) return;

  const lang = spotLang(mapRoot);

  const cityDisplayEl = mapRoot.querySelector<HTMLElement>("[data-map-city-display]");
  const subEl = mapRoot.querySelector<HTMLElement>("[data-map-city-sub]");
  const coordsEl = mapRoot.querySelector<HTMLElement>("[data-map-city-coords]");
  const bg = mapRoot.querySelector<HTMLElement>("[data-map-city-bg]");

  const pins = [...mapRoot.querySelectorAll<HTMLAnchorElement>(".map-pin[data-country]")];
  const zones = [...mapRoot.querySelectorAll<HTMLElement>(".map-zone[data-country]")];
  const mapHero = mapRoot.querySelector<HTMLElement>("#map-hero");

  const zoomReadout = mapHero?.querySelector<HTMLElement>("[data-map-zoom-readout]");

  const defaultId = mapRoot.getAttribute("data-default-country") || spots[0]?.id || "cn";

  const dismissMapHint = (): void => {
    mapHero?.classList.add("is-map-hint-dismissed");
  };

  const syncZoomUi = (): void => {
    if (!mapHero) return;
    mapHero.setAttribute("data-map-zoom", String(Math.round(zoom * 100)));
    if (zoomReadout) zoomReadout.textContent = `${Math.round(zoom * 100)}%`;
  };

  function spotById(id: string): Spot | undefined {
     return spots.find((s) => s.id === id);
  }

  const DRAG_THRESHOLD = 6;
  let suppressMapClick = false;

  function setActive(id: string, focusPin = false): void {
    mapRoot.setAttribute("data-active-country", id);
    mapRoot.setAttribute("data-country", id);
    if (mapHero) {
      mapHero.setAttribute("data-active-country", id);
      mapHero.setAttribute("data-country", id);
    }

    const spot = spotById(id);
    if (!spot) return;

    if (cityDisplayEl) {
      cityDisplayEl.textContent =
        lang === "en" ? spot.city.en : lang === "ja" ? spot.city.ja : spot.city.zh;
    }
    if (subEl) {
      const sub = tSpot(spot, lang, "citySub").trim();
      subEl.textContent = sub;
      subEl.hidden = !sub;
    }
    if (coordsEl) applyLandingCoordsEl(coordsEl, spot.coords);
    if (bg) {
      if (spot.heroUrl) {
        bg.style.backgroundImage = `url('${spot.heroUrl}')`;
        bg.classList.add("is-visible");
      } else {
        bg.style.backgroundImage = "";
        bg.classList.remove("is-visible");
      }
    }

    for (const pin of pins) {
      const on = pin.dataset.country === id;
      pin.classList.toggle("is-active", on);
      pin.setAttribute("aria-current", on ? "true" : "false");
    }
    for (const zone of zones) {
      zone.classList.toggle("is-active", zone.dataset.country === id);
    }

    if (focusPin) {
      pins.find((p) => p.dataset.country === id)?.focus();
    }

    document.documentElement.setAttribute("data-country", id);
    syncCountryChrome(id);
    mapRoot.dispatchEvent(
      new CustomEvent("scf:landing-spot", { bubbles: true, detail: { countryId: id } }),
    );
  }

  function cyclePin(dir: 1 | -1): void {
    const order = spots.map((s) => s.id);
    const cur = mapRoot.getAttribute("data-active-country") || defaultId;
    const idx = order.indexOf(cur);
    const next = order[(idx + dir + order.length) % order.length];
    setActive(next, true);
  }

  for (const pin of pins) {
    const id = pin.dataset.country;
    if (!id) continue;

    pin.addEventListener("mouseenter", () => {
      dismissMapHint();
      setActive(id);
    });
    pin.addEventListener("focus", () => setActive(id));
    pin.addEventListener("click", (e) => {
      if (suppressMapClick) {
        e.preventDefault();
        suppressMapClick = false;
      }
    });
  }

  for (const zone of zones) {
    const id = zone.dataset.country;
    if (!id) continue;
    zone.addEventListener("mouseenter", () => {
      dismissMapHint();
      setActive(id);
    });
    zone.addEventListener("focus", () => setActive(id));
    zone.addEventListener("click", (e) => {
      if (suppressMapClick) {
        e.preventDefault();
        suppressMapClick = false;
        return;
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const spot = spotById(id);
      if (!spot) return;
      e.preventDefault();
      window.location.href = spot.countryHref;
    });
  }

  mapRoot.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      cyclePin(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      cyclePin(-1);
    } else if (e.key === "Enter" && document.activeElement?.classList.contains("map-zone")) {
      const id = (document.activeElement as HTMLElement).dataset.country;
      const spot = id ? spotById(id) : undefined;
      if (spot) window.location.href = spot.countryHref;
    }
  });

  const panTarget = mapHero ?? mapRoot;
  const zoomStage = mapHero?.querySelector<HTMLElement>("[data-map-zoom-stage]");
  const mapArtW = Number(mapHero?.dataset.mapArtW) || 807;
  const mapArtH = Number(mapHero?.dataset.mapArtH) || 318;
  const ZOOM_MAX = 3;
  let panX = 0;
  let panY = 0;
  let zoom = 1;

  const getZoomMin = (): number => {
    const w = panTarget.clientWidth;
    const h = panTarget.clientHeight;
    if (w < 1 || h < 1) return 0.55;
    const artAspect = mapArtW / mapArtH;
    const boxAspect = w / h;
    const fitMargin = boxAspect > artAspect ? 0.62 : 0.55;
    return Math.min(0.88, Math.max(0.55, fitMargin));
  };

  const pointers = new Map<number, { x: number; y: number }>();
  let pinchStartDist = 0;
  let pinchStartZoom = 1;
  let isDragging = false;
  let dragMoved = false;
  let dragPointerId: number | null = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let panAtDragStartX = 0;
  let panAtDragStartY = 0;

  const pointerDistance = (): number => {
    const pts = [...pointers.values()];
    if (pts.length < 2) return 0;
    const dx = pts[1].x - pts[0].x;
    const dy = pts[1].y - pts[0].y;
    return Math.hypot(dx, dy);
  };

  const clampPan = (): void => {
    const w = panTarget.clientWidth;
    const h = panTarget.clientHeight;
    if (w < 1 || h < 1) return;
    const maxX = Math.max(0, (w * zoom - w) / 2);
    const maxY = Math.max(0, (h * zoom - h) / 2);
    panX = Math.min(maxX, Math.max(-maxX, panX));
    panY = Math.min(maxY, Math.max(-maxY, panY));
  };

  const clampZoom = (z: number): number => Math.min(ZOOM_MAX, Math.max(getZoomMin(), z));

  const zoomAtPoint = (clientX: number, clientY: number, factor: number): void => {
    const stage = zoomStage ?? panTarget;
    const rect = stage.getBoundingClientRect();
    const mx = clientX - rect.left - rect.width / 2;
    const my = clientY - rect.top - rect.height / 2;
    const nextZoom = clampZoom(zoom * factor);
    const ratio = nextZoom / zoom;
    zoom = nextZoom;
    panX = mx - ratio * (mx - panX);
    panY = my - ratio * (my - panY);
    clampPan();
  };

  let rafPending = false;
  let lastTransform = "";

  const applyMapTransform = (): void => {
    const el = zoomStage ?? panTarget;
    if (!el) return;
    const next = `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`;
    if (next === lastTransform) return;
    lastTransform = next;
    el.style.transform = next;
    syncZoomUi();
  };

  const scheduleMapTransform = (): void => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      applyMapTransform();
    });
  };

  let interactTimer = 0;
  const markMapInteracting = (): void => {
    if (!mapHero) return;
    dismissMapHint();
    mapHero.classList.add("is-map-interacting");
    window.clearTimeout(interactTimer);
    interactTimer = window.setTimeout(() => {
      mapHero?.classList.remove("is-map-interacting");
    }, 180);
  };

  const resetMapView = (): void => {
    zoom = getZoomMin();
    panX = 0;
    panY = 0;
    pinchStartDist = 0;
    pointers.clear();
    isDragging = false;
    dragMoved = false;
    dragPointerId = null;
    mapHero?.classList.remove("is-map-dragging");
    mapHero?.classList.remove("is-map-interacting");
    lastTransform = "";
    applyMapTransform();
  };

  const finishPointer = (pointerId: number): void => {
    if (dragPointerId !== pointerId) return;
    if (dragMoved) suppressMapClick = true;
    isDragging = false;
    dragMoved = false;
    dragPointerId = null;
    mapHero?.classList.remove("is-map-dragging");
    try {
      panTarget.releasePointerCapture(pointerId);
    } catch {
      /* already released */
    }
  };

  if (zoomStage && mapHero) {
    const bootMapView = (): void => {
      if (panTarget.clientWidth < 1) return;
      zoom = getZoomMin();
      panX = 0;
      panY = 0;
      lastTransform = "";
      applyMapTransform();
    };

    bootMapView();
    requestAnimationFrame(bootMapView);

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        zoom = clampZoom(zoom);
        clampPan();
        lastTransform = "";
        applyMapTransform();
      });
      ro.observe(panTarget);
    }

    panTarget.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;

      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        isDragging = false;
        dragMoved = false;
        dragPointerId = null;
        mapHero.classList.remove("is-map-dragging");
        pinchStartDist = pointerDistance();
        pinchStartZoom = zoom;
        return;
      }

      isDragging = false;
      dragMoved = false;
      dragPointerId = e.pointerId;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      panAtDragStartX = panX;
      panAtDragStartY = panY;
      panTarget.setPointerCapture(e.pointerId);
    });

    panTarget.addEventListener("pointerup", (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStartDist = 0;
      finishPointer(e.pointerId);
    });

    panTarget.addEventListener("pointercancel", (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStartDist = 0;
      finishPointer(e.pointerId);
    });

    panTarget.addEventListener("pointermove", (e) => {
      if (pointers.has(e.pointerId)) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      if (pointers.size >= 2 && pinchStartDist > 0) {
        const d = pointerDistance();
        if (d > 0) {
          zoom = clampZoom(pinchStartZoom * (d / pinchStartDist));
          clampPan();
          markMapInteracting();
          scheduleMapTransform();
        }
        return;
      }

      if (dragPointerId === e.pointerId) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if (!isDragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
          isDragging = true;
          dragMoved = true;
          dismissMapHint();
          mapHero.classList.add("is-map-dragging");
        }
        if (isDragging) {
          panX = panAtDragStartX + dx;
          panY = panAtDragStartY + dy;
          clampPan();
          scheduleMapTransform();
          e.preventDefault();
        }
      }
    });

    panTarget.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        const factor = e.deltaY < 0 ? 1.14 : 1 / 1.14;
        zoomAtPoint(e.clientX, e.clientY, factor);
        markMapInteracting();
        scheduleMapTransform();
      },
      { passive: false },
    );

    panTarget.addEventListener("dblclick", (e) => {
      e.preventDefault();
      resetMapView();
    });
  }

  setActive(defaultId);
}

function syncMapDesignArt(): void {
  const theme = document.documentElement.getAttribute("data-theme") || "dark";
  for (const img of document.querySelectorAll<HTMLImageElement>(".map-hero--design .map-design-art")) {
    const dark = img.dataset.mapArtDark;
    const light = img.dataset.mapArtLight;
    if (!dark) continue;
    const next = theme === "light" && light ? light : dark;
    const want = new URL(next, window.location.origin).href;
    if (img.src !== want) img.src = next;
  }
}

if (typeof document !== "undefined") {
  document.querySelectorAll<HTMLElement>("[data-landing-map]").forEach((el) => initLandingMap(el));
  syncMapDesignArt();
  document.addEventListener("scf:theme-change", syncMapDesignArt);
}
