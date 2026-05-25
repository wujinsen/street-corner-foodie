/**
 * Weather chip · romantic countdown / mood micro-copy (live data only).
 */

import SunCalc from "suncalc";
import type { Lang } from "./i18n";
import { UI, t } from "./i18n";
import type { WeatherClimate, WeatherPeriod, WeatherSky } from "./weather-chip";

export interface WeatherMoodInput {
  lang: Lang;
  lat: number;
  lon: number;
  tempC: number;
  period: WeatherPeriod;
  sky: WeatherSky;
  climate: WeatherClimate;
  now?: Date;
}

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

function minutesUntil(from: Date, target: Date): number {
  const delta = target.getTime() - from.getTime();
  if (delta <= 0) return 0;
  return Math.max(1, Math.round(delta / 60_000));
}

/** Civil twilight end · when warm afterglow mostly fades (SunCalc `dusk`). */
export function twilightEndToday(lat: number, lon: number, on: Date = new Date()): Date | null {
  const { dusk } = SunCalc.getTimes(on, lat, lon);
  if (!dusk || Number.isNaN(dusk.getTime())) return null;
  return dusk;
}

function twilightFadeCopy(input: WeatherMoodInput, now: Date): string | null {
  const end = twilightEndToday(input.lat, input.lon, now);
  if (!end) return null;

  const mins = minutesUntil(now, end);
  if (mins <= 0 || mins > 120) return null;

  const evening =
    input.period === "golden" || input.period === "dusk" || input.period === "night";
  if (!evening && mins > 90) return null;

  return fill(t(UI.gallery.weather_mood_twilight_fading, input.lang), { minutes: mins });
}

function warmRefreshmentCopy(input: WeatherMoodInput, now: Date): string | null {
  if (input.tempC < 24 || input.tempC > 34) return null;
  if (input.period !== "noon" && input.period !== "golden" && input.period !== "dusk") return null;
  if (input.sky !== "clear" && input.sky !== "cloudy") return null;

  const variants = [
    UI.gallery.weather_mood_ice_cola,
    UI.gallery.weather_mood_iced_tea,
    UI.gallery.weather_mood_cold_drink,
  ] as const;
  const idx = (input.tempC + now.getHours() + input.lat * 10) % variants.length;
  return t(variants[idx]!, input.lang);
}

/** One poetic line beneath the factual subline · null = hide row. */
export function inferWeatherMoodCopy(input: WeatherMoodInput): string | null {
  const now = input.now ?? new Date();

  const twilight = twilightFadeCopy(input, now);
  if (twilight) return twilight;

  const warm = warmRefreshmentCopy(input, now);
  if (warm) return warm;

  if (input.tempC <= 8) return t(UI.gallery.weather_mood_cozy_cold, input.lang);
  if (input.sky === "rain" || input.sky === "storm") return t(UI.gallery.weather_mood_rain, input.lang);
  if (input.period === "dawn") return t(UI.gallery.weather_mood_dawn, input.lang);
  if (input.period === "night" && input.sky === "clear") return t(UI.gallery.weather_mood_starry, input.lang);
  if (input.tempC >= 16 && input.tempC <= 23) return t(UI.gallery.weather_mood_mild_stroll, input.lang);

  return null;
}
