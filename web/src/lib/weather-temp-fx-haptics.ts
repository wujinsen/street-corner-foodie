/** Navigator.vibrate patterns for weather temp FX (no-op when unsupported). */

function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

export function vibeTapLight(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(10);
  } catch {
    /* ignore */
  }
}

/** Heat · rapid tap feedback */
export function vibeHeatTap(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([8, 18, 14, 12, 10]);
  } catch {
    /* ignore */
  }
}

/** Heat · fireball burst */
export function vibeHeatBurst(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([12, 35, 90, 40, 130]);
  } catch {
    /* ignore */
  }
}

/** Humidity · hold ramp */
export function vibeHumidHoldRamp(step: number): void {
  if (!canVibrate()) return;
  const pulse = Math.min(28, 8 + step * 4);
  try {
    navigator.vibrate(pulse);
  } catch {
    /* ignore */
  }
}

/** Humidity · green splash */
export function vibeHumidSplash(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([18, 22, 55, 30]);
  } catch {
    /* ignore */
  }
}

/** Sand · gritty micro tap */
export function vibeSandTap(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([6, 14, 8]);
  } catch {
    /* ignore */
  }
}

/** Sand · blunt shockwave */
export function vibeSandBurst(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([35, 45, 110, 50]);
  } catch {
    /* ignore */
  }
}

/** Cool gel · soft jelly wave */
export function vibeCoolGel(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([14, 28, 16, 32, 18, 26, 12]);
  } catch {
    /* ignore */
  }
}

/** Cosmic · deep rumble burst */
export function vibeCosmicBurst(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([20, 40, 80, 55, 120, 60, 90]);
  } catch {
    /* ignore */
  }
}

/** Sun · warm radiant pulse */
export function vibeSunBeam(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([10, 24, 14, 28, 12, 20, 10]);
  } catch {
    /* ignore */
  }
}

export function vibeCancel(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(0);
  } catch {
    /* ignore */
  }
}
