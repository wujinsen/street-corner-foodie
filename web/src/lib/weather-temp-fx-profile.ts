import type { WeatherClimate, WeatherSky } from "./weather-chip";

export type TempFxId =
  | "FX_Cool_Gel"
  | "FX_Heat_Explosion"
  | "FX_Humidity_Squeeze"
  | "FX_Dry_Sandstorm"
  | "FX_Cosmic_Bang"
  | "FX_Sun_Beam"
  | "FX_Mild";

/**
 * 气候 × 气温 → 点击温度特效
 *
 * | 气温 \ 气候 | 热带 | 亚热带 | 温带 | 干旱 | 海洋性 | 大陆性 |
 * |------------|------|--------|------|------|--------|--------|
 * | ≤18°C      | 冰块 | 冰块   | 冰块 | 冰块 | 冰块   | 冰块   |
 * | 19–21°C    | 轻触 | 轻触   | 轻触 | 轻触 | 轻触   | 轻触   |
 * | 22–29°C    | 西瓜 | 西瓜   | 轻触 | 沙暴 | 西瓜   | 轻触*  |
 * | 30–32°C    | 爆燃 | 爆燃   | 爆燃 | 沙暴 | 西瓜   | 沙暴†  |
 * | ≥33°C      | 爆燃 | 爆燃   | 爆燃 | 沙暴 | 爆燃   | 爆燃‡  |
 *
 * * 大陆性 24°C+ 且雨/雷 → 西瓜片爆炸；28°C+ 晴 → 沙暴
 * † 大陆性 28°C+ 晴 → 沙暴，否则爆燃
 * ‡ 大陆性 ≥33°C 优先爆燃（干热极值仍走沙暴见 arid 分支）
 *
 * 规则文档：docs/weather-temp-fx-rules.md
 */
export function inferTempFxId(
  tempC: number,
  climate: WeatherClimate,
  sky: WeatherSky,
): TempFxId {
  if (tempC <= 18) return "FX_Cool_Gel";
  if (sky === "snow" && tempC <= 22) return "FX_Cool_Gel";

  if (tempC >= 36) return "FX_Cosmic_Bang";

  if (
    sky === "clear" &&
    tempC >= 19 &&
    tempC <= 26 &&
    (climate === "temperate" || climate === "maritime" || climate === "continental")
  ) {
    return "FX_Sun_Beam";
  }

  const wetSky = sky === "rain" || sky === "storm" || sky === "fog";
  const humidClimate =
    climate === "tropical" || climate === "subtropical" || climate === "maritime";

  if (wetSky && tempC >= 22 && humidClimate) {
    return "FX_Humidity_Squeeze";
  }

  if (climate === "arid") {
    if (tempC >= 20) return "FX_Dry_Sandstorm";
    return "FX_Mild";
  }

  if (tempC >= 33) {
    return climate === "continental" && sky === "clear" ? "FX_Dry_Sandstorm" : "FX_Heat_Explosion";
  }

  switch (climate) {
    case "tropical":
      if (tempC >= 30) return "FX_Heat_Explosion";
      if (tempC >= 22) return "FX_Humidity_Squeeze";
      return "FX_Mild";

    case "subtropical":
      if (tempC >= 30) return "FX_Heat_Explosion";
      if (tempC >= 23) return "FX_Humidity_Squeeze";
      return "FX_Mild";

    case "maritime":
      if (tempC >= 32) return "FX_Heat_Explosion";
      if (tempC >= 21) return "FX_Humidity_Squeeze";
      return "FX_Mild";

    case "continental":
      if (tempC >= 33) return "FX_Heat_Explosion";
      if (tempC >= 28 && sky === "clear") return "FX_Dry_Sandstorm";
      if (tempC >= 30) return "FX_Heat_Explosion";
      if (tempC >= 24 && wetSky) return "FX_Humidity_Squeeze";
      return "FX_Mild";

    case "temperate":
    default:
      if (tempC >= 30) return "FX_Heat_Explosion";
      if (tempC >= 28) return "FX_Heat_Explosion";
      return "FX_Mild";
  }
}

export function fxIdToDataAttr(id: TempFxId): string {
  return id.replace(/^FX_/, "").toLowerCase().replace(/_/g, "-");
}

/** 便于调试 / 文案：当前组合的人类可读摘要 */
export function describeTempFx(
  tempC: number,
  climate: WeatherClimate,
  sky: WeatherSky,
): { fxId: TempFxId; reason: string } {
  const fxId = inferTempFxId(tempC, climate, sky);
  const reasons: Record<TempFxId, string> = {
    FX_Cool_Gel: "气温偏低 · 冰块爆炸",
    FX_Heat_Explosion: "高温 · 鲜橙爆炸",
    FX_Humidity_Squeeze: "暖湿 · 西瓜片爆炸",
    FX_Dry_Sandstorm: "干热 · 沙暴颗粒",
    FX_Cosmic_Bang: "极热 · 宇宙大爆炸",
    FX_Sun_Beam: "晴日 · 太阳照射",
    FX_Mild: "温和 · 轻触反馈",
  };
  return { fxId, reason: `${climate} · ${tempC}°C · ${reasons[fxId]}` };
}
