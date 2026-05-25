import type { FlavorAxisKey } from "./flavor-polygon";
import { FLAVOR_AXIS_KEYS } from "./flavor-polygon";

/** Per-axis accent for pulse FX (aligned with FLAVOR_AXIS_KEYS order). */
export const FLAVOR_AXIS_FX_COLORS: Record<FlavorAxisKey, string> = {
  aroma: "#e8c878",
  sweet: "#f0a860",
  aftertaste: "#78c8b8",
  spice: "#f06848",
  richness: "#c88868",
};

export function flavorAxisKeyAt(index: number): FlavorAxisKey {
  return FLAVOR_AXIS_KEYS[index] ?? FLAVOR_AXIS_KEYS[0];
}

export function flavorAxisFxColor(index: number): string {
  return FLAVOR_AXIS_FX_COLORS[flavorAxisKeyAt(index)];
}
