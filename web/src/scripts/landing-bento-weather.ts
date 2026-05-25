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
  type WeatherPeriod,
  type WeatherSky,
} from "../lib/weather-chip";
import { syncWeatherRainCanvas } from "../lib/weather-rain-canvas";
import { bootWeatherStarsCanvas } from "../lib/weather-stars-canvas";
import { applyWeatherMascotState, inferWeatherMascotState } from "../lib/weather-mascot";
import { inferWeatherMoodCopy, type WeatherMoodInput } from "../lib/weather-mood-copy";
import { initWeatherTempPoke, syncWeatherTempPokeValue } from "../lib/weather-temp-poke";
import {
  inferWeatherAmbientScene,
  isWeatherAmbientPlaying,
  playWeatherAmbientFromGesture,
  primeWeatherAmbientGesture,
  stopWeatherAmbient,
} from "../lib/weather-ambient-audio";

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

interface LiveChipSnapshot {
  tempC: number;
  sky: WeatherSky;
}

const moodTickers = new WeakMap<HTMLElement, ReturnType<typeof setInterval>>();
const liveSnapshots = new WeakMap<HTMLElement, LiveChipSnapshot>();

const LONG_PRESS_MS = 560;

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
    signal: AbortSignal.timeout(8000),
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

function syncMascot(
  el: HTMLElement,
  config: LandingWeatherConfig,
  tempC: number | null,
  period?: WeatherPeriod,
): void {
  const p = period ?? inferWeatherPeriod(new Date(), config.timezone);
  applyWeatherMascotState(
    el,
    inferWeatherMascotState({
      tempC,
      period: p,
      climate: config.climatePreset,
    }),
  );
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
  syncMascot(el, config, tempC, period);
}

function syncAmbientState(el: HTMLElement, on: boolean): void {
  el.dataset.weatherAmbient = on ? "on" : "off";
  const dot = el.querySelector<HTMLElement>("[data-bento-weather-ambient-dot]");
  if (dot) dot.hidden = !on;
}

function ambientSceneInput(el: HTMLElement, config: LandingWeatherConfig) {
  const snap = liveSnapshots.get(el);
  if (!snap) return null;
  return {
    tempC: snap.tempC,
    period: inferWeatherPeriod(new Date(), config.timezone),
    sky: snap.sky,
    climate: config.climatePreset,
  };
}

async function startWeatherAmbient(el: HTMLElement, config: LandingWeatherConfig): Promise<boolean> {
  const input = ambientSceneInput(el, config);
  if (!input) return false;
  const scene = inferWeatherAmbientScene(input);
  if (!scene) return false;
  const ok = playWeatherAmbientFromGesture(scene);
  syncAmbientState(el, ok);
  return ok;
}

async function stopWeatherAmbientForChip(el: HTMLElement): Promise<void> {
  await stopWeatherAmbient();
  syncAmbientState(el, false);
}

async function toggleWeatherAmbient(el: HTMLElement, config: LandingWeatherConfig): Promise<void> {
  if (isWeatherAmbientPlaying()) {
    await stopWeatherAmbientForChip(el);
    return;
  }
  await startWeatherAmbient(el, config);
}

function isAmbientExcludedTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return !!target.closest("[data-bento-weather-temp-hit], [data-bento-weather-toggle]");
}

function initWeatherAmbient(el: HTMLElement, config: LandingWeatherConfig): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  let longPressFired = false;

  function clearPress(): void {
    if (pressTimer !== null) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  }

  el.addEventListener(
    "pointerdown",
    (ev) => {
      if (ev.button !== 0 || el.dataset.weatherSource !== "live") return;
      if (!isAmbientExcludedTarget(ev.target)) primeWeatherAmbientGesture();
      if (isAmbientExcludedTarget(ev.target)) return;
      longPressFired = false;
      clearPress();
      pressTimer = setTimeout(() => {
        pressTimer = null;
        longPressFired = true;
        void toggleWeatherAmbient(el, config);
      }, LONG_PRESS_MS);
    },
    { passive: true },
  );

  for (const type of ["pointerup", "pointerleave", "pointercancel"] as const) {
    el.addEventListener(type, clearPress, { passive: true });
  }

  el.addEventListener("contextmenu", (ev) => {
    if (longPressFired) ev.preventDefault();
    longPressFired = false;
  });
}

function setExpanded(el: HTMLElement, expanded: boolean, config?: LandingWeatherConfig): void {
  const toggle = el.querySelector<HTMLButtonElement>("[data-bento-weather-toggle]");
  const panel = el.querySelector<HTMLElement>("[data-bento-weather-forecast]");
  if (!toggle || !panel) return;

  el.dataset.weatherExpanded = expanded ? "true" : "false";
  toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  toggle.setAttribute(
    "aria-label",
    expanded
      ? toggle.getAttribute("data-label-collapse") ?? "Collapse"
      : toggle.getAttribute("data-label-expand") ?? "Expand",
  );
  panel.hidden = !expanded;

  if (config && el.dataset.weatherSource === "live") {
    if (expanded) void startWeatherAmbient(el, config);
    else void stopWeatherAmbientForChip(el);
  }
}

async function loadForecast(el: HTMLElement, config: LandingWeatherConfig): Promise<void> {
  const panel = el.querySelector<HTMLElement>("[data-bento-weather-forecast]");
  if (!panel || panel.dataset.forecastLoaded === "true" || panel.dataset.forecastLoaded === "loading") {
    return;
  }

  panel.dataset.forecastLoaded = "loading";
  panel.textContent = forecastLoadingLabel(config.lang);

  try {
    const days = await fetchDailyForecast(config);
    renderForecastStrip(panel, days, config.lang);
    panel.dataset.forecastLoaded = "true";
  } catch {
    panel.textContent = forecastErrorLabel(config.lang);
    delete panel.dataset.forecastLoaded;
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

function initExpand(el: HTMLElement, config: LandingWeatherConfig): void {
  const toggle = el.querySelector<HTMLButtonElement>("[data-bento-weather-toggle]");
  if (!toggle) return;

  toggle.addEventListener("pointerdown", () => {
    if (el.dataset.weatherSource === "live") primeWeatherAmbientGesture();
  }, { passive: true });

  toggle.addEventListener("click", () => {
    const next = el.dataset.weatherExpanded !== "true";
    setExpanded(el, next, config);
    if (next) void loadForecast(el, config);
  });

  el.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && el.dataset.weatherExpanded === "true") {
      setExpanded(el, false, config);
      toggle.focus();
    }
  });
}

async function enhanceWeatherChip(el: HTMLElement): Promise<void> {
  const config = parseConfig(el);
  if (!config) return;

  initHoverLight(el);
  initExpand(el, config);
  initWeatherTempPoke(el);
  initWeatherAmbient(el, config);
  applyLoadingState(el, config);
  syncMascot(el, config, null);

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
  root.querySelectorAll<HTMLElement>("[data-landing-weather]").forEach((el) => {
    void enhanceWeatherChip(el);
  });
}

if (typeof document !== "undefined") {
  initLandingBentoWeather();
}
