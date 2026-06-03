/** v0.6.7 · street explorer (design/alt-c) — scene / mood / frame + export */

import type { StreetExplorerPayload } from "../lib/street-explorer-payload";
import {
  parseStreetSceneIdFromPath,
  replaceStreetSceneInPath,
} from "../lib/street-explorer-path";
import { initStreetEatCarousel, refreshStreetEatCarousels, syncStreetEatTrack } from "./street-eat-carousel";
import {
  countUniqueStreetPhotoUrlsForScene,
  getStreetConfig,
  pickDefaultStreetViewForScene,
  streetViewImageUrl,
  type StreetFrameMode,
  type StreetMood,
  type StreetRegionConfig,
  type StreetViewSelection,
} from "../lib/streets";
import { UI, t, type Lang } from "../lib/i18n";
import type { CountryId } from "../lib/types";
import { scfSpreadUrls } from "../lib/scf-image";
import { galleryTabFromHash } from "./gallery-tab-hash";
import { initStreetLightbox, notifyStreetViewChange } from "./street-lightbox";

type ViewState = { sceneId: string; mood: StreetMood; frame: StreetFrameMode };

function readConfig(root: HTMLElement): StreetExplorerPayload | null {
  const el = root.querySelector<HTMLScriptElement>("[data-street-explorer-config]");
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent) as StreetExplorerPayload;
  } catch {
    return null;
  }
}

function routeSceneId(root: HTMLElement): string | null {
  if (root.dataset.embedded === "true") return null;
  const fromPath = parseStreetSceneIdFromPath(location.pathname);
  if (fromPath) {
    root.dataset.routeSceneId = fromPath;
    return fromPath;
  }
  return root.dataset.routeSceneId?.trim() || null;
}

function readStateFromUrl(
  root: HTMLElement,
  defaultSceneId: string,
  defaultView: StreetExplorerPayload["defaultView"],
  config: StreetRegionConfig,
): ViewState {
  const params = new URLSearchParams(location.search);
  const sceneId =
    params.get("scene") || routeSceneId(root) || defaultSceneId;
  const hasTime = params.has("time");
  const hasFrame = params.has("frame");
  const baseView =
    !hasTime && !hasFrame
      ? pickDefaultStreetViewForScene(config, sceneId)
      : defaultView;
  let mood: StreetMood = baseView.mood;
  const tParam = params.get("time");
  if (tParam === "night") mood = "night";
  else if (tParam === "sunset") mood = "sunset";
  else if (tParam === "dawn") mood = "dawn";
  else if (tParam === "day") mood = "day";
  let frame: StreetFrameMode = baseView.frame;
  const f = params.get("frame");
  if (f === "standard") frame = "standard";
  else if (f === "sunset_wide") frame = "sunset_wide";
  else if (f === "wide") frame = "wide";
  return { sceneId, mood, frame };
}

function buildUrl(
  root: HTMLElement,
  embedded: boolean,
  regionId: string,
  state: ViewState,
  defaultView: StreetViewSelection,
  config: StreetRegionConfig,
): string {
  const dedicated = !embedded && !!parseStreetSceneIdFromPath(location.pathname);
  const u = dedicated
    ? new URL(replaceStreetSceneInPath(location.pathname, state.sceneId), location.origin)
    : new URL(location.href);

  if (embedded) {
    u.searchParams.set("region", regionId);
    u.hash = "streets";
    u.searchParams.set("scene", state.sceneId);
  } else if (!dedicated) {
    u.searchParams.set("scene", state.sceneId);
  } else {
    u.searchParams.delete("scene");
  }

  const sceneDefault = pickDefaultStreetViewForScene(config, state.sceneId);
  const moodDefault = dedicated ? sceneDefault.mood : defaultView.mood;
  const frameDefault = dedicated ? sceneDefault.frame : defaultView.frame;

  if (state.mood === moodDefault) u.searchParams.delete("time");
  else u.searchParams.set("time", state.mood);
  if (state.frame === frameDefault) u.searchParams.delete("frame");
  else u.searchParams.set("frame", state.frame);

  return u.pathname + u.search + u.hash;
}

function downloadUrl(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function setMainImage(root: HTMLElement, url: string | null, alt: string, mood: StreetMood): void {
  const host = root.querySelector<HTMLElement>("[data-street-main]");
  if (!host) return;
  if (!url) {
    host.style.backgroundImage = "";
    host.style.opacity = "1";
    delete host.dataset.fullSrc;
    delete host.dataset.displaySrc;
    host.removeAttribute("role");
    host.removeAttribute("aria-label");
    return;
  }
  const { full, display } = scfSpreadUrls(url);
  const show = display ?? full ?? url;
  host.dataset.fullSrc = full ?? url;
  host.dataset.displaySrc = show;
  if (!host.style.transition.includes("opacity")) {
    host.style.transition = "opacity 0.32s ease";
  }
  host.style.opacity = "0.55";
  host.style.backgroundImage = `url("${show}")`;
  requestAnimationFrame(() => {
    host.style.opacity = "1";
  });
  host.setAttribute("role", "img");
  host.setAttribute("aria-label", alt);
  notifyStreetViewChange(root, {
    displayUrl: show,
    fullUrl: full ?? url,
    alt,
    mood,
  });
}

function syncActiveClasses(
  root: HTMLElement,
  state: ViewState,
  payload: StreetExplorerPayload,
  config: StreetRegionConfig,
): void {
  const stage = root.querySelector<HTMLElement>(".alt-street-stage");
  if (stage) {
    stage.dataset.mood = state.mood;
    stage.dataset.frame = state.frame;
    stage.dataset.sceneId = state.sceneId;
  }

  root.querySelectorAll<HTMLElement>(".scene-item[data-scene-id]").forEach((el) => {
    const id = el.dataset.sceneId;
    if (!id) return;
    const on = id === state.sceneId;
    el.classList.toggle("active", on);
    if (on) el.setAttribute("aria-current", "true");
    else el.removeAttribute("aria-current");
  });

  const moodsEl = root.querySelector<HTMLElement>("[data-street-moods]");
  if (moodsEl) moodsEl.dataset.activeMood = state.mood;
  root.querySelectorAll<HTMLButtonElement>("[data-street-moods] .matrix-time-stop[data-mood]").forEach((btn) => {
    const on = btn.dataset.mood === state.mood;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });

  root.querySelectorAll<HTMLButtonElement>("[data-frame]").forEach((btn) => {
    if (btn.closest("[data-street-frames]")) {
      btn.classList.toggle("active", btn.dataset.frame === state.frame);
    }
  });

  const matrix = payload.matrixByScene[state.sceneId] ?? [];
  root.querySelectorAll<HTMLButtonElement>("[data-street-available-grid] [data-mood]").forEach((btn) => {
    const m = btn.dataset.mood as StreetMood;
    const f = btn.dataset.frame as StreetFrameMode;
    btn.classList.toggle("active", m === state.mood && f === state.frame);
  });

  const meta = root.querySelector<HTMLElement>("[data-street-available-meta]");
  if (meta && config) {
    const lang = (document.documentElement.lang === "ja"
      ? "ja"
      : document.documentElement.lang === "en"
        ? "en"
        : "zh") as Lang;
    const unique = countUniqueStreetPhotoUrlsForScene(config, state.sceneId);
    const photosMeta = t(UI.street.photos_meta, lang)
      .replace("{unique}", String(unique))
      .replace("{views}", String(matrix.length));
    meta.textContent = `${photosMeta} · ${payload.regionName}`;
  }

  const exportRoot = root.querySelector<HTMLElement>("[data-street-export]");
  if (exportRoot) {
    const scene = payload.scenes.find((s) => s.id === state.sceneId);
    const regionConfig = getStreetConfig(payload.countryId, payload.regionId);
    const url =
      regionConfig && scene
        ? streetViewImageUrl(regionConfig, state.sceneId, { mood: state.mood, frame: state.frame })
        : null;
    exportRoot.dataset.imageUrl = url ?? "";
    exportRoot.dataset.filename = `${payload.countryId}_${payload.regionId}_${state.sceneId}_${state.mood}_${state.frame}.png`;
    if (scene) {
      exportRoot.querySelectorAll<HTMLButtonElement>("[data-export=share]").forEach((b) => {
        b.dataset.shareTitle = scene.name;
      });
    }
  }

  const deep = root.querySelector<HTMLAnchorElement>("[data-street-deep-link]");
  if (deep) {
    const scene = payload.scenes.find((s) => s.id === state.sceneId);
    if (scene) deep.href = scene.deepLink;
  }
}

function rebuildAvailableGrid(
  root: HTMLElement,
  state: ViewState,
  payload: StreetExplorerPayload,
): void {
  const grid = root.querySelector<HTMLElement>("[data-street-available-grid]");
  if (!grid) return;
  const matrix = payload.matrixByScene[state.sceneId] ?? [];
  const gridCells = matrix.filter(
    (cell, idx, arr) =>
      cell.available && cell.url && arr.findIndex((c) => c.url === cell.url) === idx,
  );
  grid.innerHTML = gridCells
    .map((cell) => {
      const active = cell.mood === state.mood && cell.frame === state.frame;
      const thumb = cell.url ? `style="background-image:url('${cell.url}')"` : "";
      if (!cell.available) {
        return `<span class="matrix-available-cell is-missing" aria-label="${cell.label}" title="${cell.label}"><span class="thumb" ${thumb}></span></span>`;
      }
      return `<button type="button" class="matrix-available-cell${active ? " active" : ""}" data-mood="${cell.mood}" data-frame="${cell.frame}" aria-label="${cell.label}" title="${cell.label}"><span class="thumb" ${thumb}></span><span class="matrix-check" aria-hidden="true">✓</span></button>`;
    })
    .join("");
}

function applyState(
  root: HTMLElement,
  payload: StreetExplorerPayload,
  config: StreetRegionConfig,
  state: ViewState,
  pushUrl: boolean,
): void {
  const scene = payload.scenes.find((s) => s.id === state.sceneId) ?? payload.scenes[0];
  if (!scene) return;

  const url = streetViewImageUrl(config, state.sceneId, { mood: state.mood, frame: state.frame });
  setMainImage(root, url, scene.name, state.mood);
  rebuildAvailableGrid(root, state, payload);
  syncActiveClasses(root, state, payload, config);

  const eatCards = payload.eatHereByScene[state.sceneId] ?? [];
  syncStreetEatTrack(root, eatCards);

  const sceneName = scene.name;
  const crumbActive = root.querySelector<HTMLElement>(".alt-crumb .active");
  if (crumbActive) crumbActive.textContent = sceneName;

  const embedded = root.dataset.embedded === "true";
  if (pushUrl) {
    history.pushState(
      null,
      "",
      buildUrl(root, embedded, payload.regionId, state, payload.defaultView, config),
    );
  }
  if (!embedded && parseStreetSceneIdFromPath(location.pathname)) {
    root.dataset.routeSceneId = state.sceneId;
  }
}

export function initStreetExplorer(root: HTMLElement): void {
  const payload = readConfig(root);
  if (!payload) return;

  const config = getStreetConfig(payload.countryId as CountryId, payload.regionId);
  if (!config) return;

  const embedded = root.dataset.embedded === "true";
  let state = readStateFromUrl(root, payload.defaultSceneId, payload.defaultView, config);
  const syncFromUrl = (pushUrl: boolean): void => {
    state = readStateFromUrl(root, payload.defaultSceneId, payload.defaultView, config);
    applyState(root, payload, config, state, pushUrl);
  };

  syncFromUrl(false);
  initStreetLightbox(root);

  root.querySelectorAll<HTMLElement>("[data-street-eat-carousel]").forEach((el) => {
    initStreetEatCarousel(el);
  });

  root.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const sceneBtn = target.closest<HTMLElement>("[data-scene-id]");
    if (sceneBtn?.classList.contains("scene-item")) {
      const id = sceneBtn.dataset.sceneId;
      if (id && id !== state.sceneId) {
        e.preventDefault();
        state = { ...state, sceneId: id };
        applyState(root, payload, config, state, true);
      }
      return;
    }

    const moodBtn = target.closest<HTMLButtonElement>("[data-mood]");
    if (moodBtn?.closest("[data-street-moods]")) {
      e.preventDefault();
      state = { ...state, mood: moodBtn.dataset.mood as StreetMood };
      applyState(root, payload, config, state, true);
      return;
    }

    const frameBtn = target.closest<HTMLButtonElement>("[data-frame]");
    if (frameBtn?.closest("[data-street-frames]")) {
      e.preventDefault();
      state = { ...state, frame: frameBtn.dataset.frame as StreetFrameMode };
      applyState(root, payload, config, state, true);
      return;
    }

    const cellBtn = target.closest<HTMLButtonElement>(".matrix-available-cell[data-mood]");
    if (cellBtn) {
      e.preventDefault();
      state = {
        sceneId: state.sceneId,
        mood: cellBtn.dataset.mood as StreetMood,
        frame: cellBtn.dataset.frame as StreetFrameMode,
      };
      applyState(root, payload, config, state, true);
    }
  });

  window.addEventListener("popstate", () => syncFromUrl(false));

  if (embedded) {
    const gallery = root.closest<HTMLElement>("[data-gallery-region-overview]");
    gallery?.addEventListener("scf-gallery-region", () => {
      const hidden = root.closest<HTMLElement>("[data-street-explorer-region]")?.classList.contains(
        "is-gallery-region-hidden",
      );
      if (!hidden) syncFromUrl(false);
    });
  }

  const exportRoot = root.querySelector<HTMLElement>("[data-street-export]");
  if (exportRoot) {
    exportRoot.querySelectorAll<HTMLButtonElement>("[data-export]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kind = btn.dataset.export;
        const imgUrl = exportRoot.dataset.imageUrl;
        const pageUrl = exportRoot.dataset.pageUrl ?? location.href;
        const filename = exportRoot.dataset.filename ?? "street-corner-foodie-street.png";
        if (kind === "png" || kind === "wallpaper") {
          if (imgUrl) downloadUrl(imgUrl, filename);
          return;
        }
        if (kind === "share") {
          const title = btn.dataset.shareTitle ?? "Street Corner Foodie";
          if (navigator.share) {
            void navigator.share({ title, url: pageUrl }).catch(() => {});
          } else if (navigator.clipboard) {
            void navigator.clipboard.writeText(pageUrl);
          }
        }
      });
    });
  }
}

/** 地区/国家书柜嵌入街景 Tab：RegionPage 等须调用（embedded 无独立 script）。 */
export function initEmbeddedStreetExplorers(root: ParentNode = document): void {
  const mount = (): void => {
    if (galleryTabFromHash(location.hash || "") !== "streets") return;
    root.querySelectorAll<HTMLElement>("[data-street-explorer][data-embedded]").forEach((el) => {
      const regionHost = el.closest<HTMLElement>("[data-street-explorer-region]");
      if (regionHost?.classList.contains("is-gallery-region-hidden")) return;
      if (el.dataset.streetInit === "1") return;
      el.dataset.streetInit = "1";
      initStreetExplorer(el);
    });
  };
  mount();
  window.addEventListener("hashchange", () => {
    mount();
    requestAnimationFrame(() => refreshStreetEatCarousels(root));
  });
  root.querySelectorAll<HTMLElement>("[data-gallery-region-overview]").forEach((gallery) => {
    gallery.addEventListener("scf-gallery-region", () => {
      mount();
      requestAnimationFrame(() => refreshStreetEatCarousels(root));
    });
  });
}
