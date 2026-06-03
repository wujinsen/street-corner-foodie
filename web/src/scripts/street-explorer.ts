/** v0.6.7 · street explorer (design/alt-c) — scene / mood / frame + export */

import type { StreetExplorerPayload } from "../lib/street-explorer-payload";
import {
  parseStreetSceneIdFromPath,
  replaceStreetSceneInPath,
} from "../lib/street-explorer-path";
import { initStreetEatCarousel, refreshStreetEatCarousels, syncStreetEatTrack } from "./street-eat-carousel";
import {
  getStreetConfig,
  pickDefaultStreetViewForScene,
  streetViewImageUrl,
  type StreetFrameMode,
  type StreetMood,
  type StreetRegionConfig,
  type StreetViewSelection,
} from "../lib/streets";
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
  const t = params.get("time");
  if (t === "night") mood = "night";
  else if (t === "sunset") mood = "sunset";
  else if (t === "dawn") mood = "dawn";
  else if (t === "day") mood = "day";
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

function setMainImage(root: HTMLElement, url: string | null, alt: string, mood: StreetMood): void {
  const host = root.querySelector<HTMLElement>("[data-street-main]");
  if (!host) return;
  if (!url) {
    host.style.backgroundImage = "";
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
  host.style.backgroundImage = `url("${show}")`;
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

  root.querySelectorAll<HTMLElement>("[data-scene-id]").forEach((el) => {
    const id = el.dataset.sceneId;
    if (!id) return;
    const on = id === state.sceneId;
    if (el.classList.contains("street-geo-pin") || el.classList.contains("scene-item")) {
      el.classList.toggle("active", on);
      if (el.classList.contains("street-geo-pin")) {
        el.setAttribute("aria-current", on ? "true" : "false");
      } else if (on) {
        el.setAttribute("aria-current", "true");
      } else {
        el.removeAttribute("aria-current");
      }
    }
  });

  root.querySelectorAll<HTMLButtonElement>("[data-mood]").forEach((btn) => {
    if (btn.closest("[data-street-moods]")) {
      btn.classList.toggle("active", btn.dataset.mood === state.mood);
    }
  });

  root.querySelectorAll<HTMLButtonElement>("[data-frame]").forEach((btn) => {
    if (btn.closest("[data-street-frames]")) {
      btn.classList.toggle("active", btn.dataset.frame === state.frame);
    }
  });

  const exportRoot = root.querySelector<HTMLElement>("[data-street-export]");
  if (exportRoot) {
    const scene = payload.scenes.find((s) => s.id === state.sceneId);
    const config = getStreetConfig(payload.countryId, payload.regionId);
    const url =
      config && scene
        ? streetViewImageUrl(config, state.sceneId, { mood: state.mood, frame: state.frame })
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
    if (sceneBtn && sceneBtn.classList.contains("scene-item")) {
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
        const pageUrl = exportRoot.dataset.pageUrl ?? location.href;
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
