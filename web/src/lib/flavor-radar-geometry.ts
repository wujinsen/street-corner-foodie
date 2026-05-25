/** Shared radar geometry · SSR SVG + client axis pulse. */

export const RADAR_CX = 50;
export const RADAR_CY = 50;
export const RADAR_R = 36;
/** Landing bento fill · larger polygon, same center (FX morph must use matching r). */
export const RADAR_R_BENTO_FILL = 42;

export function radarVertex(i: number, value: number, n: number, r = RADAR_R): { x: number; y: number } {
  const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
  const dist = (value / 100) * r;
  return {
    x: RADAR_CX + Math.cos(angle) * dist,
    y: RADAR_CY + Math.sin(angle) * dist,
  };
}

export function radarPolygonPoints(values: number[], n: number, r = RADAR_R): string {
  return values
    .slice(0, n)
    .map((v, i) => {
      const { x, y } = radarVertex(i, v, n, r);
      return `${x},${y}`;
    })
    .join(" ");
}

/** Indices of leading axes (within `gap` of max, min score floor). */
export function leadingAxisIndices(values: number[], gap = 8, minScore = 55): number[] {
  if (!values.length) return [];
  const max = Math.max(...values);
  return values
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => v >= max - gap && v >= minScore)
    .map(({ i }) => i);
}
