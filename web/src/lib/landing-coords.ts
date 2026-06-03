/** Landing city card · coordinate display markup (N/E/S/W hemispheres). */

const COORDS_RE = /^([\d.]+)°\s*([NESW])\s*·\s*([\d.]+)°\s*([NESW])$/;

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

function hemiSpan(hemi: string): string {
  const key = hemi.toLowerCase();
  return `<span class="landing-city-coords__hemi landing-city-coords__hemi--${key}">${hemi}</span>`;
}

function pairMarkup(num: string, hemi: string, axis: "lat" | "lng"): string {
  return `<span class="landing-city-coords__pair landing-city-coords__pair--${axis}"><span class="landing-city-coords__num">${num}</span><span class="landing-city-coords__deg">°</span> ${hemiSpan(hemi)}</span>`;
}

/** Structured inner markup for `.landing-city-coords` (compass + lat/lng pairs). */
export function formatLandingCoordsInnerHtml(coords: string): string {
  const m = coords.match(COORDS_RE);
  if (!m) {
    return `<span class="landing-city-coords__fallback">${formatLandingCoordsHtml(coords)}</span>`;
  }
  const [, lat, latH, lng, lngH] = m;
  return [
    `<span class="landing-city-coords__compass" aria-hidden="true"></span>`,
    pairMarkup(lat!, latH!, "lat"),
    `<span class="landing-city-coords__sep" aria-hidden="true">·</span>`,
    pairMarkup(lng!, lngH!, "lng"),
  ].join("");
}

export function applyLandingCoordsEl(el: HTMLElement, coords: string): void {
  const prev = el.dataset.coordsValue;
  const changed = prev !== undefined && prev !== coords;
  const reduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  el.dataset.coordsValue = coords;
  el.innerHTML = formatLandingCoordsInnerHtml(coords);

  if (changed && !reduced) {
    el.classList.remove("landing-city-coords--swap");
    void el.offsetWidth;
    el.classList.add("landing-city-coords--swap");
    window.setTimeout(() => el.classList.remove("landing-city-coords--swap"), 680);
  }
}
