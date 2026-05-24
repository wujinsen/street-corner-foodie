import type { ECharts } from "echarts";
import type { WorldAtlasPayload, WorldAtlasScene } from "../lib/world-atlas-payload";
import { mapPinStyle } from "../lib/map-pin-colors";
import { clusterRegionScenes } from "../lib/world-atlas-clusters";

export interface SpiderCardState {
  clusterKey: string;
  sceneIds: string[];
  center: [number, number];
}

const LAYER = "data-world-atlas-spider";
/** Keep in sync with `.world-atlas-spider-card` in alt-c-refine.css */
const SPIDER_CARD_W = 132;
const SPIDER_CARD_H = 102;

function sceneShortName(name: string): string {
  return name.split(" · ")[0]?.trim() || name;
}

/** Fan card anchors above hub in screen space (arc opens upward). */
function spiderPixelFan(
  cx: number,
  cy: number,
  count: number,
  radiusPx: number,
): { x: number; y: number }[] {
  if (count <= 0) return [];
  if (count === 1) return [{ x: cx, y: cy - radiusPx }];

  const start = -Math.PI * 0.92;
  const span = Math.PI * 0.84;
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const angle = start + span * t;
    out.push({
      x: cx + Math.cos(angle) * radiusPx,
      y: cy + Math.sin(angle) * radiusPx,
    });
  }
  return out;
}

function fanRadiusPx(hostW: number, hostH: number, count: number): number {
  const base = Math.min(hostW, hostH);
  return Math.min(base * 0.4, 96 + count * 30);
}

function ensureLayer(host: HTMLElement): HTMLElement {
  let layer = host.querySelector<HTMLElement>(`[${LAYER}]`);
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "world-atlas-spider-layer";
    layer.setAttribute(LAYER, "");
    layer.hidden = true;
    host.appendChild(layer);
  }
  return layer;
}

export function clearSpiderCards(host: HTMLElement): void {
  const layer = host.querySelector<HTMLElement>(`[${LAYER}]`);
  if (!layer) return;
  layer.hidden = true;
  layer.replaceChildren();
}

export function syncSpiderCards(opts: {
  host: HTMLElement;
  chart: ECharts | null;
  payload: WorldAtlasPayload;
  regionKey: string | null;
  spider: SpiderCardState | null;
  onNavigate: (href: string) => void;
}): void {
  const { host, chart, payload, regionKey, spider, onNavigate } = opts;
  if (!chart || !spider || !regionKey) {
    clearSpiderCards(host);
    return;
  }

  const cluster = clusterRegionScenes(payload.scenes, regionKey).find(
    (c) => c.key === spider.clusterKey,
  );
  if (!cluster || cluster.scenes.length === 0) {
    clearSpiderCards(host);
    return;
  }

  const hub = chart.convertToPixel("geo", spider.center) as [number, number] | undefined;
  if (!hub || !Number.isFinite(hub[0]) || !Number.isFinite(hub[1])) {
    clearSpiderCards(host);
    return;
  }

  const scenes = [...cluster.scenes].sort((a, b) => a.sceneId.localeCompare(b.sceneId));
  const layer = ensureLayer(host);
  layer.hidden = false;
  layer.replaceChildren();

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("world-atlas-spider-layer__lines");
  svg.setAttribute("aria-hidden", "true");
  layer.appendChild(svg);

  const grid = document.createElement("div");
  grid.className = "world-atlas-spider-layer__cards";
  grid.setAttribute("role", "list");
  layer.appendChild(grid);

  const [cx, cy] = hub;
  const radius = fanRadiusPx(host.clientWidth, host.clientHeight, scenes.length);
  const anchors = spiderPixelFan(cx, cy, scenes.length, radius);
  const pin = mapPinStyle(scenes[0]!.countryId);

  svg.setAttribute("width", String(host.clientWidth));
  svg.setAttribute("height", String(host.clientHeight));
  svg.style.width = `${host.clientWidth}px`;
  svg.style.height = `${host.clientHeight}px`;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i]!;
    const anchor = anchors[i]!;
    const cardW = SPIDER_CARD_W;
    const cardH = SPIDER_CARD_H;
    const left = anchor.x - cardW / 2;
    const top = anchor.y - cardH - 10;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(cx));
    line.setAttribute("y1", String(cy));
    line.setAttribute("x2", String(anchor.x));
    line.setAttribute("y2", String(top + cardH));
    line.setAttribute("stroke", pin.core);
    line.setAttribute("stroke-width", "1.5");
    line.setAttribute("stroke-opacity", "0.55");
    svg.appendChild(line);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "world-atlas-spider-card";
    btn.style.left = `${left}px`;
    btn.style.top = `${top}px`;
    btn.setAttribute("role", "listitem");
    btn.setAttribute(
      "aria-label",
      `${sceneShortName(scene.name)} · ${payload.i18n.tip_navigate.replace(/^→\s*/, "")}`,
    );

    const thumb = document.createElement("span");
    thumb.className = "world-atlas-spider-card__thumb";
    if (scene.thumbUrl) {
      thumb.style.backgroundImage = `url('${scene.thumbUrl}')`;
    }
    btn.appendChild(thumb);

    const label = document.createElement("span");
    label.className = "world-atlas-spider-card__label";
    label.textContent = sceneShortName(scene.name);
    btn.appendChild(label);

    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      onNavigate(scene.streetsHref);
    });

    grid.appendChild(btn);
  }
}

export function sceneFromPayload(payload: WorldAtlasPayload, meta: string): WorldAtlasScene | undefined {
  return payload.scenes.find((s) => s.id === meta);
}
