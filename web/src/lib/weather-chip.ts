import type { Lang } from "./i18n";
import { t } from "./i18n";
import type { Multilang } from "./types";

export type WeatherPeriod = "dawn" | "morning" | "noon" | "golden" | "dusk" | "night";
export type WeatherSky = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";
export type WeatherClimate = "tropical" | "subtropical" | "temperate" | "arid" | "maritime" | "continental";

/** Local hour in IANA timezone → period bucket (see WEATHER-CHIP-TOKENS.md). */
export function inferWeatherPeriod(date: Date, timezone: string): WeatherPeriod {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: timezone,
    }).format(date),
  );
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 11) return "morning";
  if (hour >= 11 && hour < 15) return "noon";
  if (hour >= 15 && hour < 18) return "golden";
  if (hour >= 18 && hour < 21) return "dusk";
  return "night";
}

/** Open-Meteo WMO weather_code → sky preset. */
export function wmoCodeToSky(code: number): WeatherSky {
  if (code === 0) return "clear";
  if (code >= 1 && code <= 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
  if (code >= 95 && code <= 99) return "storm";
  return "cloudy";
}

/** Curated mood copy → sky hint for SSR before fetch. */
export function moodToSky(mood: Multilang, lang: Lang): WeatherSky {
  const text = t(mood, lang).toLowerCase();
  const zh = mood.zh;
  if (/雨|阵雨|showers|rain|にわか雨/.test(text) || /雨/.test(zh)) return "rain";
  if (/雪|snow/.test(text)) return "snow";
  if (/雾|mist|fog|薄雾|霧/.test(text) || /雾|霧/.test(zh)) return "fog";
  if (/雷|storm|thunder/.test(text)) return "storm";
  if (/云|阴|曇|cloud|overcast|くもり/.test(text) || /云|阴|曇/.test(zh)) return "cloudy";
  return "clear";
}

export function applyWeatherChipState(
  el: HTMLElement,
  state: { period: WeatherPeriod; sky: WeatherSky; climate: WeatherClimate },
): void {
  el.dataset.weatherPeriod = state.period;
  el.dataset.weatherSky = state.sky;
  el.dataset.weatherClimate = state.climate;
}

const SKY_LABELS: Record<WeatherSky, Multilang> = {
  clear: { zh: "晴", en: "Clear", ja: "晴れ" },
  cloudy: { zh: "多云", en: "Cloudy", ja: "くもり" },
  fog: { zh: "雾", en: "Fog", ja: "霧" },
  rain: { zh: "雨", en: "Rain", ja: "雨" },
  snow: { zh: "雪", en: "Snow", ja: "雪" },
  storm: { zh: "雷暴", en: "Storm", ja: "雷雨" },
};

/** Live sky → compact mood line for the chip subtitle. */
export function skyShortLabel(sky: WeatherSky, lang: Lang): string {
  return t(SKY_LABELS[sky], lang);
}
