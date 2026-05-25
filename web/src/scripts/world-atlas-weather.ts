/**
 * World Atlas · FX trigger chip (no live weather fetch).
 */

import type { Lang } from "../lib/i18n";
import { fxIdToDataAttr, type TempFxId } from "../lib/weather-temp-fx-profile";
import {
  clearFxClasses,
  playCoolGel,
  playCosmicBang,
  playHeatExplosion,
  playHumiditySqueeze,
  playSandstorm,
  playSunBeam,
  stopCanvasFx,
  type FxDomRefs,
  type FxRuntime,
} from "../lib/weather-temp-fx-engine";
import {
  vibeCoolGel,
  vibeHeatTap,
  vibeSandTap,
} from "../lib/weather-temp-fx-haptics";

const FX_CYCLE: TempFxId[] = [
  "FX_Heat_Explosion",
  "FX_Humidity_Squeeze",
  "FX_Dry_Sandstorm",
  "FX_Cool_Gel",
  "FX_Cosmic_Bang",
  "FX_Sun_Beam",
];

interface AtlasFxState {
  refs: FxDomRefs;
  rt: FxRuntime;
  cycleIndex: number;
}

const atlasFxStates = new WeakMap<HTMLElement, AtlasFxState>();

function readLang(live: HTMLElement): Lang {
  try {
    const raw = live.dataset.weatherConfig;
    if (!raw) return "zh";
    const cfg = JSON.parse(raw) as { lang?: Lang };
    if (cfg.lang === "en" || cfg.lang === "ja" || cfg.lang === "zh") return cfg.lang;
  } catch {
    /* ignore */
  }
  return "zh";
}

function buildRefs(live: HTMLElement): FxDomRefs | null {
  const fxHost = live.querySelector<HTMLElement>(".bento-weather-bg");
  const hit = live.querySelector<HTMLElement>("[data-bento-weather-temp-hit]");
  const tempLine = live.querySelector<HTMLElement>(".bento-weather-temp-line");
  const tempEl = live.querySelector<HTMLElement>("[data-bento-weather-temp]");
  if (!fxHost || !hit || !tempLine || !tempEl) return null;

  return {
    chip: live,
    live,
    fxHost,
    hit,
    tempLine,
    tempEl,
    fxCanvas: live.querySelector<HTMLCanvasElement>("[data-weather-temp-fx-canvas]"),
    fxStage: live.querySelector<HTMLElement>("[data-weather-temp-fx-stage]"),
    fxWash: live.querySelector<HTMLElement>("[data-weather-temp-fx-wash]"),
    fxHands: live.querySelector<HTMLElement>("[data-weather-temp-fx-hands]"),
    bubbles: live.querySelector<HTMLElement>("[data-weather-temp-fx-bubbles]"),
    scrim: live.querySelector<HTMLElement>("[data-weather-temp-fx-scrim]"),
    gelBadge: live.querySelector<HTMLElement>("[data-weather-temp-fx-gel-badge]"),
    lang: readLang(live),
  };
}

function prepareNextFx(state: AtlasFxState): void {
  const { refs, rt } = state;
  stopCanvasFx(rt);
  if (rt.cleanupTimer) {
    clearTimeout(rt.cleanupTimer);
    rt.cleanupTimer = null;
  }
  rt.squeezeStarted = false;
  clearFxClasses(refs, rt);
}

function pokeScaleFeedback(state: AtlasFxState): void {
  const icon = state.refs.hit.querySelector<HTMLElement>(".atlas-fx-chip__icon");
  if (!icon) return;
  icon.classList.remove("combo-burst--tap-pulse");
  void icon.offsetWidth;
  icon.classList.add("combo-burst--tap-pulse");
}

const HIT_FX_CLASSES = [
  "bento-weather-temp-hit--bursting",
  "bento-weather-temp-hit--burst-digit",
  "bento-weather-temp-hit--fx-heat",
  "bento-weather-temp-hit--fx-sand",
  "bento-weather-temp-hit--fx-squeeze",
  "bento-weather-temp-hit--fx-watermelon",
  "bento-weather-temp-hit--fx-gel",
  "bento-weather-temp-hit--fx-ice",
  "bento-weather-temp-hit--fx-cosmic",
  "bento-weather-temp-hit--fx-sun",
  "bento-weather-temp-hit--heat-punch",
  "combo-burst--tap-pulse",
] as const;

/** Keep chip label/icon static while fullscreen FX plays. */
function stabilizeAtlasButton(refs: FxDomRefs): void {
  refs.hit.classList.remove(...HIT_FX_CLASSES);
  refs.live.classList.remove("combo-burst--tap-pulse", "bento-weather-live--fx-fullscreen");
  if (refs.gelBadge) {
    refs.gelBadge.hidden = true;
    refs.gelBadge.textContent = "";
  }
}

function playSceneTap(state: AtlasFxState, fxId: TempFxId): void {
  const { refs, rt } = state;
  prepareNextFx(state);

  switch (fxId) {
    case "FX_Cool_Gel":
      vibeCoolGel();
      playCoolGel(refs, rt);
      break;
    case "FX_Dry_Sandstorm":
      vibeSandTap();
      playSandstorm(refs, rt, { restack: true });
      break;
    case "FX_Heat_Explosion":
      vibeHeatTap();
      playHeatExplosion(refs, rt, { restack: true });
      break;
    case "FX_Humidity_Squeeze":
      playHumiditySqueeze(refs, rt);
      break;
    case "FX_Cosmic_Bang":
      playCosmicBang(refs, rt, { restack: true });
      break;
    case "FX_Sun_Beam":
      playSunBeam(refs, rt, { restack: true });
      break;
    default:
      playHeatExplosion(refs, rt, { restack: true });
      break;
  }

  state.refs.chip.dataset.weatherTempFxLast = fxIdToDataAttr(fxId);
  state.refs.chip.dataset.weatherTempFxMode = "atlas-cycle";
  stabilizeAtlasButton(state.refs);
}

function triggerAtlasFx(state: AtlasFxState): void {
  const fxId = FX_CYCLE[state.cycleIndex % FX_CYCLE.length]!;
  state.cycleIndex = (state.cycleIndex + 1) % FX_CYCLE.length;
  pokeScaleFeedback(state);
  playSceneTap(state, fxId);
}

function bindAtlasFx(live: HTMLElement): void {
  if (atlasFxStates.has(live)) return;

  const refs = buildRefs(live);
  if (!refs) return;

  const state: AtlasFxState = {
    refs,
    rt: { canvasFx: null, cleanupTimer: null, squeezeStarted: false, portalMounts: [], portalMounted: false },
    cycleIndex: 0,
  };
  atlasFxStates.set(live, state);
  live.dataset.atlasFxBound = "1";

  const onActivate = (ev: Event): void => {
    ev.preventDefault();
    triggerAtlasFx(state);
  };

  refs.hit.addEventListener("click", onActivate);
  refs.hit.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    onActivate(ev);
  });
}

export function initWorldAtlasWeather(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-world-atlas-explorer]").forEach((explorer) => {
    if (explorer.classList.contains("world-atlas-explorer--landing")) return;

    const live = explorer.querySelector<HTMLElement>("[data-atlas-fx-live]");
    if (live) bindAtlasFx(live);
  });
}
