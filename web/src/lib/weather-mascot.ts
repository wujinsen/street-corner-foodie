import type { WeatherClimate, WeatherPeriod } from "./weather-chip";

export type WeatherMascotState = "idle" | "hot" | "cold" | "dusk";

export interface WeatherMascotInput {
  tempC: number | null;
  period: WeatherPeriod;
  climate: WeatherClimate;
}

/** Pick corner mascot pose from live temp + local period + climate. */
export function inferWeatherMascotState(input: WeatherMascotInput): WeatherMascotState {
  const { tempC, period, climate } = input;

  if (tempC !== null && tempC <= 12) return "cold";
  if (period === "dusk" || period === "golden") return "dusk";

  const warmClimate =
    climate === "tropical" || climate === "subtropical" || climate === "arid";
  if (tempC !== null && tempC >= 26 && warmClimate) return "hot";
  if (tempC !== null && tempC >= 30) return "hot";

  return "idle";
}

export function applyWeatherMascotState(el: HTMLElement, state: WeatherMascotState): void {
  el.dataset.weatherMascot = state;
}
