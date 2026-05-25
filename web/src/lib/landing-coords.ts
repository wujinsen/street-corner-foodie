/** Landing city card · coordinate display markup (N/E/S/W hemispheres). */

/** WGS84 [lng, lat] → landing card string e.g. `20.02° N · 110.35° E`. */
export function formatLandingGeoCoords(geo: [number, number]): string {
  const [lng, lat] = geo;
  const latAbs = Math.abs(lat);
  const lngAbs = Math.abs(lng);
  const latHemi = lat >= 0 ? "N" : "S";
  const lngHemi = lng >= 0 ? "E" : "W";
  return `${latAbs.toFixed(2)}° ${latHemi} · ${lngAbs.toFixed(2)}° ${lngHemi}`;
}

export function formatLandingCoordsHtml(coords: string): string {
  return coords.replace(/\b([NESW])\b/g, (_match, hemi: string) => {
    const key = hemi.toLowerCase();
    return `<span class="landing-city-coords__hemi landing-city-coords__hemi--${key}">${hemi}</span>`;
  });
}

export function applyLandingCoordsEl(el: HTMLElement, coords: string): void {
  el.innerHTML = formatLandingCoordsHtml(coords);
}
