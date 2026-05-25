/**
 * Weather chip · 点击温度 → 整卡特效
 *
 * 正式：`inferTempFxId()`（见 docs/weather-temp-fx-rules.md）
 * 调试：`data-weather-temp-fx-debug="cycle"` → 每次点击轮播六款主特效
 */

import type { Lang } from "./i18n";
import type { WeatherClimate, WeatherSky } from "./weather-chip";
import { vibeCoolGel, vibeCancel, vibeCosmicBurst, vibeHeatTap, vibeHumidSplash, vibeSandTap, vibeSunBeam, vibeTapLight } from "./weather-temp-fx-haptics";
import { describeTempFx, fxIdToDataAttr, inferTempFxId, type TempFxId } from "./weather-temp-fx-profile";
import {
  clearFxClasses,
  playCoolGel,
  playCosmicBang,
  playHeatExplosion,
  playHeatPunch,
  playHumiditySqueeze,
  playSandstorm,
  playSunBeam,
  stopCanvasFx,
  teardownFxRuntime,
  type FxDomRefs,
  type FxRuntime,
} from "./weather-temp-fx-engine";

/** 调试轮播顺序（见 docs/weather-temp-fx-rules.md §6） */
const DEBUG_FX_CYCLE: TempFxId[] = [
  "FX_Heat_Explosion",
  "FX_Humidity_Squeeze",
  "FX_Dry_Sandstorm",
  "FX_Cool_Gel",
  "FX_Cosmic_Bang",
  "FX_Sun_Beam",
];

interface BindState {
  refs: FxDomRefs;
  rt: FxRuntime;
  debugCycleIndex: number;
}

const bindStates = new WeakMap<HTMLElement, BindState>();

function readTempC(chip: HTMLElement): number | null {
  const snap = chip.dataset.weatherTempPoke;
  if (snap) {
    const n = Number(snap);
    if (Number.isFinite(n)) return n;
  }
  const tempEl = chip.querySelector<HTMLElement>("[data-bento-weather-temp]");
  if (!tempEl) return null;
  const n = Number(tempEl.textContent);
  return Number.isFinite(n) ? n : null;
}

function readClimate(chip: HTMLElement): WeatherClimate {
  const raw = chip.dataset.weatherClimate;
  if (
    raw === "tropical" ||
    raw === "subtropical" ||
    raw === "temperate" ||
    raw === "arid" ||
    raw === "maritime" ||
    raw === "continental"
  ) {
    return raw;
  }
  return "temperate";
}

function readSky(chip: HTMLElement): WeatherSky {
  const raw = chip.dataset.weatherSky;
  if (
    raw === "clear" ||
    raw === "cloudy" ||
    raw === "fog" ||
    raw === "rain" ||
    raw === "snow" ||
    raw === "storm"
  ) {
    return raw;
  }
  return "cloudy";
}

function readLang(chip: HTMLElement): Lang {
  try {
    const raw = chip.dataset.weatherConfig;
    if (!raw) return "zh";
    const cfg = JSON.parse(raw) as { lang?: Lang };
    if (cfg.lang === "en" || cfg.lang === "ja" || cfg.lang === "zh") return cfg.lang;
  } catch {
    /* ignore */
  }
  return "zh";
}

function isDebugCycle(chip: HTMLElement): boolean {
  return chip.dataset.weatherTempFxDebug === "cycle";
}

function resolveSceneFx(chip: HTMLElement, state: BindState): TempFxId | null {
  if (isDebugCycle(chip)) {
    const fxId = DEBUG_FX_CYCLE[state.debugCycleIndex % DEBUG_FX_CYCLE.length]!;
    state.debugCycleIndex = (state.debugCycleIndex + 1) % DEBUG_FX_CYCLE.length;
    return fxId;
  }

  const tempC = readTempC(chip);
  if (tempC === null) return null;
  return inferTempFxId(tempC, readClimate(chip), readSky(chip));
}

function markLastFx(chip: HTMLElement, fxId: TempFxId, debug: boolean): void {
  chip.dataset.weatherTempFxLast = fxIdToDataAttr(fxId);
  chip.dataset.weatherTempFxMode = debug ? "debug-cycle" : "climate-temp";
  if (!debug) {
    const tempC = readTempC(chip);
    if (tempC !== null) {
      chip.dataset.weatherTempFxReason = describeTempFx(tempC, readClimate(chip), readSky(chip)).reason;
    }
  } else {
    delete chip.dataset.weatherTempFxReason;
  }
}

function prepareNextFx(state: BindState): void {
  const { refs, rt } = state;
  stopCanvasFx(rt);
  if (rt.cleanupTimer) {
    clearTimeout(rt.cleanupTimer);
    rt.cleanupTimer = null;
  }
  rt.squeezeStarted = false;
  clearFxClasses(refs, rt);
}

function pokeScaleFeedback(state: BindState): void {
  const { hit, tempEl, live } = state.refs;
  for (const el of [hit, tempEl, live]) {
    el.classList.remove("combo-burst--tap-pulse");
    void el.offsetWidth;
    el.classList.add("combo-burst--tap-pulse");
  }
}

function playSceneTap(state: BindState, fxId: TempFxId): void {
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
      vibeHumidSplash();
      playHumiditySqueeze(refs, rt);
      break;
    case "FX_Cosmic_Bang":
      playCosmicBang(refs, rt, { restack: true });
      break;
    case "FX_Sun_Beam":
      playSunBeam(refs, rt, { restack: true });
      break;
    default:
      vibeTapLight();
      playHeatPunch(refs);
      break;
  }
}

function onPointerDown(state: BindState): void {
  const { refs } = state;
  if (refs.chip.dataset.weatherSource !== "live") return;

  const debug = isDebugCycle(refs.chip);
  const fxId = resolveSceneFx(refs.chip, state);
  if (!fxId) return;

  pokeScaleFeedback(state);
  playSceneTap(state, fxId);
  markLastFx(refs.chip, fxId, debug);
}

export function syncWeatherTempPokeValue(chip: HTMLElement, tempC: number | null): void {
  if (tempC === null) delete chip.dataset.weatherTempPoke;
  else chip.dataset.weatherTempPoke = String(tempC);
}

export function initWeatherTempPoke(chip: HTMLElement): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const live = chip.querySelector<HTMLElement>(".bento-weather-live") ?? chip;
  const fxHost = chip.querySelector<HTMLElement>(".bento-weather-bg");
  const hit = chip.querySelector<HTMLElement>("[data-bento-weather-temp-hit]");
  const tempLine = chip.querySelector<HTMLElement>(".bento-weather-temp-line");
  const tempEl = chip.querySelector<HTMLElement>("[data-bento-weather-temp]");
  const fxStage = chip.querySelector<HTMLElement>("[data-weather-temp-fx-stage]");
  if (!fxHost || !hit || !tempLine || !tempEl) return;

  const refs: FxDomRefs = {
    chip,
    live,
    fxHost,
    hit,
    tempLine,
    tempEl,
    fxCanvas: chip.querySelector<HTMLCanvasElement>("[data-weather-temp-fx-canvas]"),
    fxStage,
    fxWash: chip.querySelector<HTMLElement>("[data-weather-temp-fx-wash]"),
    fxHands: chip.querySelector<HTMLElement>("[data-weather-temp-fx-hands]"),
    bubbles: chip.querySelector<HTMLElement>("[data-weather-temp-fx-bubbles]"),
    scrim: chip.querySelector<HTMLElement>("[data-weather-temp-fx-scrim]"),
    gelBadge: chip.querySelector<HTMLElement>("[data-weather-temp-fx-gel-badge]"),
    lang: readLang(chip),
  };

  bindStates.set(chip, {
    refs,
    rt: { canvasFx: null, cleanupTimer: null, squeezeStarted: false, portalMounts: [], portalMounted: false },
    debugCycleIndex: 0,
  });

  let pokeFromPointer = false;
  const poke = (): void => {
    const state = bindStates.get(chip);
    if (!state) return;
    onPointerDown(state);
  };

  hit.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0) return;
    pokeFromPointer = true;
    poke();
    window.setTimeout(() => {
      pokeFromPointer = false;
    }, 0);
  });
  hit.addEventListener("click", (ev) => {
    if (ev.button !== 0 || pokeFromPointer) return;
    poke();
  });
  hit.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    poke();
  });
}

export function teardownWeatherTempPoke(chip: HTMLElement): void {
  const state = bindStates.get(chip);
  if (!state) return;
  vibeCancel();
  teardownFxRuntime(state.rt, state.refs);
  bindStates.delete(chip);
}
