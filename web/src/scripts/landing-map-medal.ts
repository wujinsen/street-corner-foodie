/**
 * Landing world map · geo-anchored regional seal overlays (e.g. Hainan medal).
 */
import type { ECharts } from "echarts";

export function syncLandingMapMedals(
  chart: ECharts | null,
  host: HTMLElement,
  visible: boolean,
): void {
  const root = host.closest<HTMLElement>("[data-landing-world-atlas]");
  if (!root) return;

  const medals = root.querySelectorAll<HTMLElement>("[data-landing-map-medal]");
  if (medals.length === 0) return;

  const hostRect = host.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();

  for (const el of medals) {
    if (!visible || !chart) {
      el.hidden = true;
      continue;
    }

    const lng = Number.parseFloat(el.dataset.lng ?? "");
    const lat = Number.parseFloat(el.dataset.lat ?? "");
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      el.hidden = true;
      continue;
    }

    const px = chart.convertToPixel({ geoIndex: 0 }, [lng, lat]) as
      | [number, number]
      | undefined;
    if (!px || px.length < 2 || !Number.isFinite(px[0]) || !Number.isFinite(px[1])) {
      el.hidden = true;
      continue;
    }

    const size = el.offsetWidth || 72;
    const left = hostRect.left - rootRect.left + px[0] - size / 2;
    const top = hostRect.top - rootRect.top + px[1] - size / 2;

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.hidden = false;
  }
}
