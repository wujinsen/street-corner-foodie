/**
 * Landing bento weather chip · progressive enhancement.
 * Phase B: period + Open-Meteo + SunCalc.
 * Phase C: hover light-leak, expand 5-day forecast, live mood dot.
 */

import SunCalc from "suncalc";
import {
  fetchDailyForecast,
  forecastErrorLabel,
  forecastLoadingLabel,
  renderForecastStrip,
} from "../lib/weather-forecast";
import { UI, t } from "../lib/i18n";
import {
  applyWeatherChipState,
  inferWeatherPeriod,
  skyShortLabel,
  wmoCodeToSky,
  type WeatherClimate,
  type WeatherSky,
} from "../lib/weather-chip";
import { syncWeatherRainCanvas } from "../lib/weather-rain-canvas";
import { bootWeatherStarsCanvas } from "../lib/weather-stars-canvas";
import { inferWeatherMoodCopy, type WeatherMoodInput } from "../lib/weather-mood-copy";
import { initWeatherTempPoke, syncWeatherTempPokeValue } from "../lib/weather-temp-poke";
import { fetchTimeoutSignal } from "../lib/fetch-timeout";

export interface LandingWeatherConfig {
  lat: number;
  lon: number;
  timezone: string;
  regionKey: string;
  lang: "zh" | "en" | "ja";
  climatePreset: WeatherClimate;
  placeZh: string;
  placeEn: string;
  placeJa: string;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_PREFIX = "scf-weather-v2:";
const MOOD_TICK_MS = 60_000;
const WEATHER_EXPAND_MS = 340;
/** Min forecast strip height so tile grows before async forecast paint. */
const WEATHER_FORECAST_MIN_H = 96;

const collapseFinishTimers = new WeakMap<HTMLElement, number>();

interface LiveChipSnapshot {
  tempC: number;
  sky: WeatherSky;
}

const moodTickers = new WeakMap<HTMLElement, ReturnType<typeof setInterval>>();
const liveSnapshots = new WeakMap<HTMLElement, LiveChipSnapshot>();

interface WeatherCacheEntry {
  tempC: number;
  weatherCode: number;
  fetchedAt: number;
}

function localeForLang(lang: LandingWeatherConfig["lang"]): string {
  if (lang === "ja") return "ja-JP";
  if (lang === "en") return "en-GB";
  return "zh-CN";
}

export function formatLocalTime(date: Date, timezone: string, lang: LandingWeatherConfig["lang"]): string {
  return new Intl.DateTimeFormat(localeForLang(lang), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(date);
}

export function sunsetToday(config: Pick<LandingWeatherConfig, "lat" | "lon" | "timezone" | "lang">): string {
  const { sunset } = SunCalc.getTimes(new Date(), config.lat, config.lon);
  if (!sunset || Number.isNaN(sunset.getTime())) return "";
  return formatLocalTime(sunset, config.timezone, config.lang);
}

function readCache(regionKey: string): WeatherCacheEntry | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + regionKey);
    if (!raw) return null;
    const entry = JSON.parse(raw) as WeatherCacheEntry;
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
    return entry;
  } catch {
    return null;
  }
}

function writeCache(regionKey: string, tempC: number, weatherCode: number): void {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + regionKey,
      JSON.stringify({ tempC, weatherCode, fetchedAt: Date.now() } satisfies WeatherCacheEntry),
    );
  } catch {
    /* quota / private mode */
  }
}

async function fetchCurrentWeather(
  config: LandingWeatherConfig,
): Promise<{ tempC: number; weatherCode: number } | null> {
  const cached = readCache(config.regionKey);
  if (cached) return { tempC: cached.tempC, weatherCode: cached.weatherCode };

  const params = new URLSearchParams({
    latitude: String(config.lat),
    longitude: String(config.lon),
    current: "temperature_2m,weather_code",
    timezone: config.timezone,
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal: fetchTimeoutSignal(8000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    current?: { temperature_2m?: number; weather_code?: number };
  };
  const raw = data.current?.temperature_2m;
  const code = data.current?.weather_code;
  if (typeof raw !== "number" || Number.isNaN(raw) || typeof code !== "number") return null;
  const tempC = Math.round(raw);
  writeCache(config.regionKey, tempC, code);
  return { tempC, weatherCode: code };
}

function parseConfig(el: HTMLElement): LandingWeatherConfig | null {
  const raw = el.getAttribute("data-weather-config");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LandingWeatherConfig;
  } catch {
    return null;
  }
}

function langFromChip(el: HTMLElement): LandingWeatherConfig["lang"] {
  const cfg = parseConfig(el);
  if (cfg) return cfg.lang;
  const docLang = document.documentElement.lang.toLowerCase();
  if (docLang.startsWith("ja")) return "ja";
  if (docLang.startsWith("en")) return "en";
  return "zh";
}

function placeLabel(config: LandingWeatherConfig): string {
  if (config.lang === "en") return config.placeEn;
  if (config.lang === "ja") return config.placeJa;
  return config.placeZh;
}

function buildSublineLive(config: LandingWeatherConfig, sky: WeatherSky, sunset: string): string {
  const local = formatLocalTime(new Date(), config.timezone, config.lang);
  const localLabel = t(UI.gallery.weather_local, config.lang);
  const sunsetLabel = t(UI.gallery.weather_sunset, config.lang);
  const place = placeLabel(config);
  const skyLabel = skyShortLabel(sky, config.lang);
  if (config.lang === "en") {
    return `${skyLabel} · ${place} ${localLabel} ${local} · ${sunsetLabel} ${sunset}`;
  }
  if (config.lang === "ja") {
    return `${skyLabel} · ${place} ${localLabel}${local} · ${sunsetLabel} ${sunset}`;
  }
  return `${skyLabel} · ${place}${localLabel} ${local} · ${sunsetLabel} ${sunset}`;
}

function applySubline(el: HTMLElement, text: string): void {
  const subEl = el.querySelector<HTMLElement>("[data-bento-weather-sub]");
  if (!subEl) return;
  const dot = subEl.querySelector<HTMLElement>("[data-bento-weather-live-dot]");
  subEl.textContent = "";
  if (dot) subEl.appendChild(dot);
  subEl.append(document.createTextNode(text));
}

function applyMoodLine(el: HTMLElement, text: string | null): void {
  const moodEl = el.querySelector<HTMLElement>("[data-bento-weather-mood]");
  if (!moodEl) return;
  if (!text) {
    moodEl.hidden = true;
    moodEl.textContent = "";
    return;
  }
  moodEl.hidden = false;
  if (moodEl.textContent !== text) moodEl.textContent = text;
}

function moodInputFromChip(el: HTMLElement, config: LandingWeatherConfig): WeatherMoodInput | null {
  const snap = liveSnapshots.get(el);
  if (!snap) return null;
  return {
    lang: config.lang,
    lat: config.lat,
    lon: config.lon,
    tempC: snap.tempC,
    period: inferWeatherPeriod(new Date(), config.timezone),
    sky: snap.sky,
    climate: config.climatePreset,
  };
}

function syncMoodLine(el: HTMLElement, config: LandingWeatherConfig): void {
  const input = moodInputFromChip(el, config);
  applyMoodLine(el, input ? inferWeatherMoodCopy(input) : null);
}

function stopMoodTicker(el: HTMLElement): void {
  const id = moodTickers.get(el);
  if (id !== undefined) {
    clearInterval(id);
    moodTickers.delete(el);
  }
}

function startMoodTicker(el: HTMLElement, config: LandingWeatherConfig): void {
  stopMoodTicker(el);
  const id = setInterval(() => syncMoodLine(el, config), MOOD_TICK_MS);
  moodTickers.set(el, id);
}

function applyLoadingState(el: HTMLElement, config: LandingWeatherConfig): void {
  el.dataset.weatherSource = "loading";
  /* Sync period + starfield immediately (static build may bake stale SSR period). */
  applyChipState(el, config, (el.dataset.weatherSky as WeatherSky | undefined) ?? "cloudy");
  applySubline(el, `${t(UI.gallery.weather_loading, config.lang)} · ${placeLabel(config)}`);
  applyMoodLine(el, null);
  stopMoodTicker(el);
  liveSnapshots.delete(el);
  syncWeatherTempPokeValue(el, null);
  const tempEl = el.querySelector<HTMLElement>("[data-bento-weather-temp]");
  if (tempEl) {
    tempEl.textContent = "—";
    tempEl.setAttribute("aria-busy", "true");
  }
  setLiveDot(el, false);
}

function applyUnavailableState(el: HTMLElement, config: LandingWeatherConfig): void {
  el.dataset.weatherSource = "unavailable";
  applySubline(el, `${t(UI.gallery.weather_unavailable, config.lang)} · ${placeLabel(config)}`);
  applyMoodLine(el, null);
  stopMoodTicker(el);
  liveSnapshots.delete(el);
  syncWeatherTempPokeValue(el, null);
  setLiveDot(el, false);
}

function setLiveDot(el: HTMLElement, on: boolean): void {
  const dot = el.querySelector<HTMLElement>("[data-bento-weather-live-dot]");
  if (!dot) return;
  dot.hidden = !on;
}

function animateTemp(el: HTMLElement, target: number, fromOverride?: number): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = String(target);
    return;
  }
  const start = performance.now();
  const parsed = Number(el.textContent);
  const from = Number.isFinite(fromOverride) ? fromOverride! : Number.isFinite(parsed) ? parsed : 0;
  const duration = 680;

  function frame(now: number): void {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = String(Math.round(from + (target - from) * eased));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function applyTemp(el: HTMLElement, tempC: number): void {
  const tempEl = el.querySelector<HTMLElement>("[data-bento-weather-temp]");
  if (!tempEl) return;
  tempEl.removeAttribute("aria-busy");
  syncWeatherTempPokeValue(el, tempC);
  const current = Number(tempEl.textContent);
  if (Number.isFinite(current) && current === tempC) return;
  animateTemp(tempEl, tempC);
}

function syncStarfieldClass(el: HTMLElement): void {
  el.classList.add("bento-weather-live--starfield");
}

function applyChipState(
  el: HTMLElement,
  config: LandingWeatherConfig,
  sky: WeatherSky,
  tempC: number | null = null,
): void {
  const period = inferWeatherPeriod(new Date(), config.timezone);
  applyWeatherChipState(el, {
    period,
    sky,
    climate: config.climatePreset,
  });
  syncStarfieldClass(el);
  syncWeatherRainCanvas(el);
  bootWeatherStarsCanvas(el);
}

const lastForecastPanelHeight = new WeakMap<HTMLElement, number>();
let landingMapLayoutRaf = 0;

/** Coalesce weather height nudges — map host ResizeObserver handles full re-render. */
function notifyLandingMapLayout(): void {
  if (landingMapLayoutRaf) return;
  landingMapLayoutRaf = requestAnimationFrame(() => {
    landingMapLayoutRaf = 0;
    window.dispatchEvent(new Event("scf:landing-map-layout"));
  });
}

function applyForecastPanelHeight(
  el: HTMLElement,
  panel: HTMLElement,
  tile: HTMLElement | null,
  heightPx: number,
): void {
  const h = Math.max(WEATHER_FORECAST_MIN_H, Math.ceil(heightPx));
  if (lastForecastPanelHeight.get(el) === h) return;
  lastForecastPanelHeight.set(el, h);
  const px = `${h}px`;
  el.style.setProperty("--weather-forecast-panel-h", px);
  tile?.style.setProperty("--weather-forecast-panel-h", px);
  notifyLandingMapLayout();
}

function clearCollapseTimer(el: HTMLElement): void {
  const id = collapseFinishTimers.get(el);
  if (id !== undefined) {
    window.clearTimeout(id);
    collapseFinishTimers.delete(el);
  }
}

function syncForecastPanelHeight(el: HTMLElement): void {
  const panel = el.querySelector<HTMLElement>("[data-bento-weather-forecast]");
  if (!panel) return;

  const tile = el.closest<HTMLElement>(".bento-weather--proto.tile");

  const clearHeight = (): void => {
    el.style.removeProperty("--weather-forecast-panel-h");
    tile?.style.removeProperty("--weather-forecast-panel-h");
  };

  if (el.dataset.weatherExpanded !== "true") {
    clearHeight();
    return;
  }

  const measure = (): void => {
    const strip = panel.querySelector<HTMLElement>(".bento-weather-forecast-strip");
    const heightPx = strip ? strip.offsetHeight + 18 : panel.scrollHeight;
    applyForecastPanelHeight(el, panel, tile, heightPx);
  };

  requestAnimationFrame(measure);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function finishWeatherCollapse(
  el: HTMLElement,
  panel: HTMLElement,
  tile: HTMLElement | null,
): void {
  panel.setAttribute("aria-hidden", "true");
  el.style.removeProperty("--weather-forecast-panel-h");
  tile?.style.removeProperty("--weather-forecast-panel-h");
  lastForecastPanelHeight.delete(el);
  notifyLandingMapLayout();
}

function setExpanded(el: HTMLElement, expanded: boolean, config?: LandingWeatherConfig): void {
  const cfg = config ?? parseConfig(el) ?? undefined;
  const toggle = el.querySelector<HTMLButtonElement>("[data-bento-weather-toggle]");
  const panel = el.querySelector<HTMLElement>("[data-bento-weather-forecast]");
  const tile = el.closest<HTMLElement>(".bento-weather--proto.tile");
  if (!toggle || !panel) return;

  const reduced = prefersReducedMotion();

  toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  toggle.setAttribute(
    "aria-label",
    expanded
      ? toggle.getAttribute("data-label-collapse") ?? "Collapse"
      : toggle.getAttribute("data-label-expand") ?? "Expand",
  );

  if (expanded) {
    clearCollapseTimer(el);
    el.dataset.weatherExpanded = "true";
    panel.setAttribute("aria-hidden", "false");
    panel.removeAttribute("hidden");

    if (panel.dataset.forecastLoaded === "loading") {
      delete panel.dataset.forecastLoaded;
    }

    if (cfg && panel.dataset.forecastLoaded !== "true") {
      panel.textContent = forecastLoadingLabel(cfg.lang);
    }

    applyForecastPanelHeight(el, panel, tile, WEATHER_FORECAST_MIN_H);
    requestAnimationFrame(() => {
      syncForecastPanelHeight(el);
      notifyLandingMapLayout();
    });

    if (cfg) void loadForecast(el, cfg);
    else panel.textContent = forecastErrorLabel(langFromChip(el));
    return;
  }

  clearCollapseTimer(el);
  panel.setAttribute("aria-hidden", "true");
  el.dataset.weatherExpanded = "false";

  if (panel.dataset.forecastLoaded === "loading") {
    delete panel.dataset.forecastLoaded;
  }

  if (reduced) {
    finishWeatherCollapse(el, panel, tile);
    return;
  }

  el.style.setProperty("--weather-forecast-panel-h", "0px");
  tile?.style.setProperty("--weather-forecast-panel-h", "0px");

  let done = false;
  const finish = (): void => {
    if (done) return;
    if (el.dataset.weatherExpanded === "true") return;
    done = true;
    collapseFinishTimers.delete(el);
    finishWeatherCollapse(el, panel, tile);
  };

  const target = tile ?? el;
  const onTransitionEnd = (ev: TransitionEvent): void => {
    if (ev.target !== target) return;
    if (ev.propertyName !== "height" && ev.propertyName !== "min-height") return;
    finish();
  };

  target.addEventListener("transitionend", onTransitionEnd, { once: true });
  collapseFinishTimers.set(
    el,
    window.setTimeout(finish, WEATHER_EXPAND_MS + 80),
  );
}

async function loadForecast(el: HTMLElement, config: LandingWeatherConfig): Promise<void> {
  const panel = el.querySelector<HTMLElement>("[data-bento-weather-forecast]");
  if (!panel || el.dataset.weatherExpanded !== "true") return;

  if (panel.dataset.forecastLoaded === "true") {
    if (!panel.querySelector(".bento-weather-forecast-strip")) {
      delete panel.dataset.forecastLoaded;
    } else {
      syncForecastPanelHeight(el);
      return;
    }
  }

  panel.dataset.forecastLoaded = "loading";
  panel.textContent = forecastLoadingLabel(config.lang);
  syncForecastPanelHeight(el);

  try {
    const days = await fetchDailyForecast(config);
    if (el.dataset.weatherExpanded !== "true") {
      delete panel.dataset.forecastLoaded;
      return;
    }
    renderForecastStrip(panel, days, config.lang);
    panel.dataset.forecastLoaded = "true";
    syncForecastPanelHeight(el);
  } catch {
    if (el.dataset.weatherExpanded !== "true") {
      delete panel.dataset.forecastLoaded;
      return;
    }
    panel.textContent = forecastErrorLabel(config.lang);
    delete panel.dataset.forecastLoaded;
    syncForecastPanelHeight(el);
  }
}

function initHoverLight(el: HTMLElement): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const reducedPointer = window.matchMedia("(pointer: coarse)").matches;
  let raf = 0;
  let px = 50;
  let py = 50;

  function paint(): void {
    raf = 0;
    el.style.setProperty("--weather-hover-x", `${px}%`);
    el.style.setProperty("--weather-hover-y", `${py}%`);
    el.style.setProperty("--weather-hover-light", "1");
  }

  function onMove(ev: PointerEvent): void {
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    px = ((ev.clientX - rect.left) / rect.width) * 100;
    py = ((ev.clientY - rect.top) / rect.height) * 100;
    if (!raf) raf = requestAnimationFrame(paint);
  }

  function onLeave(): void {
    el.style.setProperty("--weather-hover-light", "0");
  }

  if (!reducedPointer) {
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
  } else {
    el.addEventListener("pointerdown", onMove, { passive: true });
  }
}

let weatherToggleDelegationBound = false;

/** 罗盘按钮 · 文档级委托（地区切换 re-init 后仍有效） */
function ensureWeatherToggleDelegation(): void {
  if (weatherToggleDelegationBound || typeof document === "undefined") return;
  weatherToggleDelegationBound = true;

  document.addEventListener("click", (ev) => {
    const target = ev.target;
    if (!(target instanceof Element)) return;
    const toggle = target.closest<HTMLButtonElement>("[data-bento-weather-toggle]");
    if (!toggle) return;
    const chip = toggle.closest<HTMLElement>("[data-landing-weather]");
    if (!chip || !chip.isConnected) return;

    const panel = chip.closest<HTMLElement>("[data-landing-bento-panel]");
    if (panel?.hasAttribute("hidden")) return;

    ev.preventDefault();
    ev.stopPropagation();

    const config = parseConfig(chip);
    const next = chip.dataset.weatherExpanded !== "true";
    setExpanded(chip, next, config ?? undefined);
  });
}

function initExpand(el: HTMLElement, config: LandingWeatherConfig): void {
  const toggle = el.querySelector<HTMLButtonElement>("[data-bento-weather-toggle]");
  if (!toggle) return;

  if (el.dataset.weatherExpanded === "true") {
    void loadForecast(el, config);
  }

  if (el.dataset.weatherExpandKeyBound === "true") return;
  el.dataset.weatherExpandKeyBound = "true";

  el.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && el.dataset.weatherExpanded === "true") {
      setExpanded(el, false, config);
      toggle.focus();
    }
  });
}

/** 切换 bento 地区时收起预报，避免隐藏面板上残留展开态 */
export function resetLandingWeatherExpand(scope: ParentNode): void {
  scope.querySelectorAll<HTMLElement>("[data-landing-weather]").forEach((el) => {
    if (el.dataset.weatherExpanded === "true") {
      setExpanded(el, false, parseConfig(el) ?? undefined);
    }
  });
}

async function enhanceWeatherChip(el: HTMLElement): Promise<void> {
  const config = parseConfig(el);
  if (!config) return;

  initHoverLight(el);
  initExpand(el, config);
  initWeatherTempPoke(el);
  applyLoadingState(el, config);

  try {
    const live = await fetchCurrentWeather(config);
    if (live) {
      const sky = wmoCodeToSky(live.weatherCode);
      const sunset = sunsetToday(config);
      applyTemp(el, live.tempC);
      applyChipState(el, config, sky, live.tempC);
      applySubline(el, buildSublineLive(config, sky, sunset));
      liveSnapshots.set(el, { tempC: live.tempC, sky });
      syncMoodLine(el, config);
      startMoodTicker(el, config);
      el.dataset.weatherSource = "live";
      setLiveDot(el, true);
    } else {
      applyChipState(el, config, "cloudy");
      applyUnavailableState(el, config);
    }
  } catch {
    applyChipState(el, config, "cloudy");
    applyUnavailableState(el, config);
  }
}

export function initLandingBentoWeather(root: ParentNode = document): void {
  ensureWeatherToggleDelegation();

  if (typeof location !== "undefined" && location.protocol === "file:") {
    console.warn(
      "[Street Corner Foodie] 气温卡片需要 HTTP 服务才能加载脚本与 Open-Meteo。请用：cd web && npm run preview",
    );
  }
  root.querySelectorAll<HTMLElement>("[data-landing-weather]").forEach((el) => {
    if (el.dataset.weatherInit === "true") return;
    el.dataset.weatherInit = "true";
    void enhanceWeatherChip(el);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureWeatherToggleDelegation, { once: true });
  } else {
    ensureWeatherToggleDelegation();
  }
}

/* 初始化由 landing-bento-sync.ts 在面板可见性就绪后统一调用，避免 DOMContentLoaded 竞态。 */
