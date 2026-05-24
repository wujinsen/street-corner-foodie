/**
 * Landing bento weather chip · progressive enhancement.
 * SSR fallback from region-atmosphere; client: Open-Meteo temp + SunCalc sunset.
 */

import SunCalc from "suncalc";

export interface LandingWeatherConfig {
  lat: number;
  lon: number;
  timezone: string;
  regionKey: string;
  lang: "zh" | "en" | "ja";
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_PREFIX = "scf-weather-v1:";

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

interface WeatherCacheEntry {
  tempC: number;
  fetchedAt: number;
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

function writeCache(regionKey: string, tempC: number): void {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + regionKey,
      JSON.stringify({ tempC, fetchedAt: Date.now() } satisfies WeatherCacheEntry),
    );
  } catch {
    /* quota / private mode */
  }
}

async function fetchCurrentTempC(config: LandingWeatherConfig): Promise<number | null> {
  const cached = readCache(config.regionKey);
  if (cached) return cached.tempC;

  const params = new URLSearchParams({
    latitude: String(config.lat),
    longitude: String(config.lon),
    current: "temperature_2m",
    timezone: config.timezone,
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { current?: { temperature_2m?: number } };
  const raw = data.current?.temperature_2m;
  if (typeof raw !== "number" || Number.isNaN(raw)) return null;
  const tempC = Math.round(raw);
  writeCache(config.regionKey, tempC);
  return tempC;
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

function applySunset(el: HTMLElement, config: LandingWeatherConfig): void {
  const sunsetEl = el.querySelector<HTMLElement>("[data-bento-weather-sunset]");
  if (!sunsetEl) return;
  const time = sunsetToday(config);
  if (time) sunsetEl.textContent = time;
}

function applyTemp(el: HTMLElement, tempC: number): void {
  const tempEl = el.querySelector<HTMLElement>("[data-bento-weather-temp]");
  if (tempEl) tempEl.textContent = String(tempC);
}

async function enhanceWeatherChip(el: HTMLElement): Promise<void> {
  const config = parseConfig(el);
  if (!config) return;

  applySunset(el, config);

  try {
    const tempC = await fetchCurrentTempC(config);
    if (tempC !== null) applyTemp(el, tempC);
  } catch {
    /* keep SSR fallback */
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
