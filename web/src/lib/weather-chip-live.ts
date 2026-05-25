import type { Lang } from "./i18n";
import type { WeatherClimate } from "./weather-chip";

export interface WeatherLiveConfig {
  lat: number;
  lon: number;
  timezone: string;
  regionKey: string;
  lang: Lang;
  climatePreset: WeatherClimate;
  placeZh: string;
  placeEn: string;
  placeJa: string;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_PREFIX = "scf-weather-v2:";

interface WeatherCacheEntry {
  tempC: number;
  weatherCode: number;
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

export async function fetchLiveWeather(
  config: WeatherLiveConfig,
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

export function placeLabel(config: WeatherLiveConfig): string {
  if (config.lang === "en") return config.placeEn;
  if (config.lang === "ja") return config.placeJa;
  return config.placeZh;
}
