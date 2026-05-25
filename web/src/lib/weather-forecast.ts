import { t, type Lang } from "./i18n";
import { wmoCodeToSky, skyShortLabel, type WeatherSky } from "./weather-chip";

export interface DailyForecastDay {
  date: string;
  weekday: string;
  tempMax: number;
  tempMin: number;
  sky: WeatherSky;
}

export interface ForecastConfig {
  lat: number;
  lon: number;
  timezone: string;
  regionKey: string;
  lang: Lang;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_PREFIX = "scf-forecast-v1:";

function localeForLang(lang: Lang): string {
  if (lang === "ja") return "ja-JP";
  if (lang === "en") return "en-GB";
  return "zh-CN";
}

function weekdayLabel(isoDate: string, timezone: string, lang: Lang): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat(localeForLang(lang), {
    weekday: "short",
    timeZone: timezone,
  }).format(date);
}

function readCache(regionKey: string): DailyForecastDay[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + regionKey);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { days: DailyForecastDay[]; fetchedAt: number };
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
    return entry.days;
  } catch {
    return null;
  }
}

function writeCache(regionKey: string, days: DailyForecastDay[]): void {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + regionKey,
      JSON.stringify({ days, fetchedAt: Date.now() }),
    );
  } catch {
    /* quota / private mode */
  }
}

export async function fetchDailyForecast(config: ForecastConfig): Promise<DailyForecastDay[]> {
  const cached = readCache(config.regionKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(config.lat),
    longitude: String(config.lon),
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: config.timezone,
    forecast_days: "5",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("forecast fetch failed");

  const data = (await res.json()) as {
    daily?: {
      time?: string[];
      weather_code?: number[];
      temperature_2m_max?: number[];
      temperature_2m_min?: number[];
    };
  };

  const times = data.daily?.time ?? [];
  const codes = data.daily?.weather_code ?? [];
  const maxes = data.daily?.temperature_2m_max ?? [];
  const mins = data.daily?.temperature_2m_min ?? [];

  const days: DailyForecastDay[] = times.slice(0, 5).map((date, i) => ({
    date,
    weekday: weekdayLabel(date, config.timezone, config.lang),
    tempMax: Math.round(maxes[i] ?? 0),
    tempMin: Math.round(mins[i] ?? 0),
    sky: wmoCodeToSky(codes[i] ?? 0),
  }));

  writeCache(config.regionKey, days);
  return days;
}

function skyGlyph(sky: WeatherSky): string {
  if (sky === "clear") return "○";
  if (sky === "cloudy") return "◐";
  if (sky === "fog") return "∿";
  if (sky === "rain") return "⋮";
  if (sky === "snow") return "✦";
  return "⚡";
}

export function renderForecastStrip(
  container: HTMLElement,
  days: DailyForecastDay[],
  lang: Lang,
): void {
  container.replaceChildren();
  const strip = document.createElement("div");
  strip.className = "bento-weather-forecast-strip";
  strip.setAttribute("role", "list");

  for (const day of days) {
    const cell = document.createElement("div");
    cell.className = "bento-weather-forecast-day";
    cell.setAttribute("role", "listitem");
    cell.dataset.weatherSky = day.sky;

    const wd = document.createElement("span");
    wd.className = "bento-weather-forecast-wd";
    wd.textContent = day.weekday;

    const glyph = document.createElement("span");
    glyph.className = "bento-weather-forecast-glyph";
    glyph.setAttribute("aria-hidden", "true");
    glyph.textContent = skyGlyph(day.sky);
    glyph.title = skyShortLabel(day.sky, lang);

    const hi = document.createElement("span");
    hi.className = "bento-weather-forecast-hi";
    hi.textContent = `${day.tempMax}°`;

    const lo = document.createElement("span");
    lo.className = "bento-weather-forecast-lo";
    lo.textContent = `${day.tempMin}°`;

    cell.append(wd, glyph, hi, lo);
    strip.appendChild(cell);
  }

  container.appendChild(strip);
}

export function forecastLoadingLabel(lang: Lang): string {
  return t(
    {
      zh: "加载预报…",
      en: "Loading forecast…",
      ja: "予報を読み込み中…",
    },
    lang,
  );
}

export function forecastErrorLabel(lang: Lang): string {
  return t(
    {
      zh: "预报暂不可用",
      en: "Forecast unavailable",
      ja: "予報を取得できません",
    },
    lang,
  );
}
