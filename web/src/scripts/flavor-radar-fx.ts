/**
 * Flavor radar · draw-on (CSS) + hover + click pulse (JS).
 * Surfaces: landing bento, zine reader, poster detail.
 * Pulse extras: spring morph, edge sweep, vertex particles, combo stacking.
 */

import { flavorAxisFxColor } from "../lib/flavor-radar-fx";
import { radarPolygonPoints, radarVertex, RADAR_R } from "../lib/flavor-radar-geometry";

const SVG_NS = "http://www.w3.org/2000/svg";
const PULSE_MS = 560;
const COMBO_WINDOW_MS = 650;
const MAX_COMBO = 3;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  el: SVGCircleElement;
}

interface RadarFxBinding {
  root: HTMLElement;
  polygon: SVGPolygonElement;
  glowPolygon: SVGPolygonElement | null;
  sweepPolygon: SVGPolygonElement | null;
  particlesG: SVGGElement | null;
  particles: Particle[];
  particleRaf: number;
  vertices: SVGCircleElement[];
  hits: SVGCircleElement[];
  spokes: SVGLineElement[];
  labelGroups: SVGGElement[];
  values: number[];
  n: number;
  r: number;
  raf: number;
  pulsing: boolean;
  pulseStart: number;
  pulseBase: number[] | null;
  pulsePeak: number[] | null;
  hoverAxis: number | null;
  hoverClearTimer: ReturnType<typeof setTimeout> | null;
  comboLevel: number;
  lastPulseAxis: number | null;
  lastPulseAt: number;
}

function parseValues(raw: string | undefined): number[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

/** 0 → peak → spring settle (clamped). */
function pulseBlend(t: number): number {
  if (t < 0.26) {
    return Math.min(1, easeOutBack(t / 0.26));
  }
  const u = (t - 0.26) / 0.74;
  return Math.max(0, 1 - easeOutElastic(u));
}

function pulseValues(base: number[], axisIndex: number, comboLevel: number): number[] {
  const boost = 14 + comboLevel * 5;
  const dip = 5 + comboLevel * 1.5;
  return base.map((v, i) => {
    if (i === axisIndex) return Math.min(100, v + boost);
    return Math.max(18, v - dip);
  });
}

function hoverValues(base: number[], axisIndex: number): number[] {
  return base.map((v, i) => {
    if (i === axisIndex) return Math.min(100, v + 9);
    return Math.max(18, v * 0.955);
  });
}

function interpolateValues(base: number[], peak: number[], blend: number): number[] {
  return base.map((v, i) => v + (peak[i]! - v) * blend);
}

function ensureFxLayers(binding: RadarFxBinding): void {
  const shape = binding.polygon.parentElement;
  if (!shape) return;

  if (!binding.sweepPolygon) {
    const sweep = document.createElementNS(SVG_NS, "polygon");
    sweep.classList.add("flavor-radar__poly-sweep");
    shape.insertBefore(sweep, binding.polygon);
    binding.sweepPolygon = sweep;
  }

  if (!binding.particlesG) {
    const group = document.createElementNS(SVG_NS, "g");
    group.classList.add("flavor-radar__particles");
    shape.appendChild(group);
    binding.particlesG = group;
  }
}

function applyPoints(binding: RadarFxBinding, values: number[]): void {
  const points = radarPolygonPoints(values, binding.n, binding.r);
  binding.polygon.setAttribute("points", points);
  binding.glowPolygon?.setAttribute("points", points);
  for (let i = 0; i < binding.n; i += 1) {
    const vertex = binding.vertices[i];
    const hit = binding.hits[i];
    const { x, y } = radarVertex(i, values[i] ?? 0, binding.n, binding.r);
    if (vertex) {
      vertex.setAttribute("cx", String(x));
      vertex.setAttribute("cy", String(y));
    }
    if (hit) {
      hit.setAttribute("cx", String(x));
      hit.setAttribute("cy", String(y));
    }
  }
}

function syncLabelHighlight(binding: RadarFxBinding, axisIndex: number | null): void {
  binding.labelGroups.forEach((group, i) => {
    group.classList.toggle("radar-label-group--active", axisIndex !== null && i === axisIndex);
    group.classList.toggle("radar-label-group--dim", axisIndex !== null && i !== axisIndex);
  });
  binding.vertices.forEach((vertex, i) => {
    vertex.classList.toggle("flavor-radar__vertex--hover", axisIndex !== null && i === axisIndex);
  });
}

function syncSpokePulse(binding: RadarFxBinding, axisIndex: number | null): void {
  binding.spokes.forEach((spoke, i) => {
    spoke.classList.toggle("flavor-radar__spoke--pulse", axisIndex !== null && i === axisIndex);
  });
}

function tickParticles(binding: RadarFxBinding, now: number, prev: number): void {
  const dt = Math.min(32, now - prev);
  binding.particles = binding.particles.filter((particle) => {
    particle.life += dt;
    particle.x += particle.vx * (dt / 16);
    particle.y += particle.vy * (dt / 16);
    particle.vy += 0.045 * (dt / 16);
    particle.vx *= 0.965;
    particle.vy *= 0.965;

    const alpha = 1 - particle.life / particle.maxLife;
    particle.el.setAttribute("cx", String(particle.x));
    particle.el.setAttribute("cy", String(particle.y));
    particle.el.setAttribute("opacity", String(Math.max(0, alpha * 0.92)));
    particle.el.setAttribute("r", String(0.55 + alpha * 0.85));

    if (particle.life >= particle.maxLife) {
      particle.el.remove();
      return false;
    }
    return true;
  });

  if (binding.particles.length) {
    binding.particleRaf = requestAnimationFrame((next) => tickParticles(binding, next, now));
  } else {
    binding.particleRaf = 0;
  }
}

function spawnParticles(binding: RadarFxBinding, axisIndex: number, color: string): void {
  if (!binding.particlesG) return;

  const value = binding.values[axisIndex] ?? 50;
  const { x, y } = radarVertex(axisIndex, value, binding.n, binding.r);
  const outward = Math.atan2(y - 50, x - 50);
  const count = 4 + (binding.comboLevel > 0 ? 1 : 0) + (binding.comboLevel > 1 ? 1 : 0);

  for (let i = 0; i < count; i += 1) {
    const spread = (Math.random() - 0.5) * 0.75;
    const dir = outward + spread;
    const speed = 1.35 + Math.random() * 1.8 + binding.comboLevel * 0.35;
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", "1.2");
    circle.setAttribute("fill", color);
    circle.style.filter = `drop-shadow(0 0 2px ${color})`;
    binding.particlesG.appendChild(circle);

    binding.particles.push({
      x,
      y,
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed,
      life: 0,
      maxLife: 380 + Math.random() * 180,
      el: circle,
    });
  }

  if (!binding.particleRaf) {
    const start = performance.now();
    binding.particleRaf = requestAnimationFrame((now) => tickParticles(binding, now, start));
  }
}

function setupEdgeSweep(binding: RadarFxBinding, points: string, color: string): number {
  const sweep = binding.sweepPolygon;
  if (!sweep) return 0;

  sweep.setAttribute("points", points);
  sweep.style.stroke = color;
  sweep.style.opacity = "0.95";

  const len = sweep.getTotalLength?.() ?? 220;
  const dash = Math.max(8, len * 0.2);
  sweep.style.strokeDasharray = `${dash} ${Math.max(1, len - dash)}`;
  sweep.style.strokeDashoffset = String(len);
  return len;
}

function updateEdgeSweep(binding: RadarFxBinding, sweepLen: number, t: number): void {
  const sweep = binding.sweepPolygon;
  if (!sweep || sweepLen <= 0) return;

  const progress = Math.min(1, t * 1.25);
  sweep.style.strokeDashoffset = String(sweepLen * (1 - progress));
  sweep.style.opacity = String(0.92 * (1 - progress * 0.92));
}

function clearPulseFx(binding: RadarFxBinding): void {
  const { root } = binding;
  delete root.dataset.pulseAxis;
  root.style.removeProperty("--radar-pulse-color");
  binding.vertices.forEach((v) => v.classList.remove("flavor-radar__vertex--pulse"));
  binding.labelGroups.forEach((g) => g.classList.remove("radar-label-group--pulse"));
  syncSpokePulse(binding, null);
  binding.sweepPolygon?.style.setProperty("opacity", "0");
}

function setHoverAxis(binding: RadarFxBinding, axisIndex: number | null): void {
  if (binding.pulsing) return;

  binding.hoverAxis = axisIndex;

  if (axisIndex === null) {
    delete binding.root.dataset.hoverAxis;
    binding.root.style.removeProperty("--radar-hover-color");
    syncLabelHighlight(binding, null);
    applyPoints(binding, binding.values);
    return;
  }

  binding.root.dataset.hoverAxis = String(axisIndex);
  binding.root.style.setProperty("--radar-hover-color", flavorAxisFxColor(axisIndex));
  syncLabelHighlight(binding, axisIndex);
  applyPoints(binding, hoverValues(binding.values, axisIndex));
}

function runPulse(binding: RadarFxBinding, axisIndex: number): void {
  if (binding.raf) cancelAnimationFrame(binding.raf);

  ensureFxLayers(binding);

  const now = performance.now();
  if (binding.lastPulseAxis === axisIndex && now - binding.lastPulseAt < COMBO_WINDOW_MS) {
    binding.comboLevel = Math.min(MAX_COMBO, binding.comboLevel + 1);
  } else {
    binding.comboLevel = 0;
  }
  binding.lastPulseAxis = axisIndex;
  binding.lastPulseAt = now;

  let base = binding.values.slice();
  if (binding.pulsing && binding.pulseBase && binding.pulsePeak) {
    const midT = Math.min(1, (now - binding.pulseStart) / PULSE_MS);
    base = interpolateValues(binding.pulseBase, binding.pulsePeak, pulseBlend(midT));
  }

  binding.pulsing = true;
  setHoverAxis(binding, null);

  const peak = pulseValues(base, axisIndex, binding.comboLevel);
  const color = flavorAxisFxColor(axisIndex);
  const { root } = binding;

  binding.pulseStart = now;
  binding.pulseBase = base;
  binding.pulsePeak = peak;

  root.dataset.pulseAxis = String(axisIndex);
  root.style.setProperty("--radar-pulse-color", color);
  binding.vertices.forEach((v) => v.classList.remove("flavor-radar__vertex--pulse"));
  binding.vertices[axisIndex]?.classList.add("flavor-radar__vertex--pulse");
  binding.labelGroups.forEach((g, i) => {
    g.classList.toggle("radar-label-group--pulse", i === axisIndex);
  });
  syncSpokePulse(binding, axisIndex);

  const sweepLen = setupEdgeSweep(binding, radarPolygonPoints(base, binding.n, binding.r), color);
  spawnParticles(binding, axisIndex, color);

  const frame = (frameNow: number): void => {
    const t = Math.min(1, (frameNow - binding.pulseStart) / PULSE_MS);
    const blend = pulseBlend(t);
    applyPoints(binding, interpolateValues(base, peak, blend));
    updateEdgeSweep(binding, sweepLen, t);

    if (t < 1) {
      binding.raf = requestAnimationFrame(frame);
    } else {
      binding.raf = 0;
      binding.pulsing = false;
      binding.pulseBase = null;
      binding.pulsePeak = null;
      applyPoints(binding, binding.values);
      window.setTimeout(() => clearPulseFx(binding), 100);
    }
  };

  binding.raf = requestAnimationFrame(frame);
}

function bindAxisTarget(binding: RadarFxBinding, el: Element, axisIndex: number): void {
  el.addEventListener("pointerenter", () => {
    if (binding.hoverClearTimer) {
      clearTimeout(binding.hoverClearTimer);
      binding.hoverClearTimer = null;
    }
    setHoverAxis(binding, axisIndex);
  });
  el.addEventListener("pointerleave", () => {
    binding.hoverClearTimer = setTimeout(() => {
      binding.hoverClearTimer = null;
      if (binding.hoverAxis === axisIndex) setHoverAxis(binding, null);
    }, 40);
  });
  el.addEventListener("focus", () => setHoverAxis(binding, axisIndex));
  el.addEventListener("blur", () => {
    if (binding.hoverAxis === axisIndex) setHoverAxis(binding, null);
  });

  el.addEventListener("click", (ev) => {
    ev.preventDefault();
    runPulse(binding, axisIndex);
  });

  el.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    runPulse(binding, axisIndex);
  });
}

function bindRadar(root: HTMLElement): void {
  if (root.dataset.radarFxBound === "1") return;

  const polygon = root.querySelector<SVGPolygonElement>(".flavor-radar__poly");
  if (!polygon) return;

  const glowPolygon = root.querySelector<SVGPolygonElement>(".flavor-radar__poly-glow");

  const values = parseValues(root.dataset.radarValues);
  const n = Number(root.dataset.radarN) || values.length;
  const r = Number(root.dataset.radarR) || RADAR_R;
  if (!values.length || n < 3) return;

  const vertices = Array.from(root.querySelectorAll<SVGCircleElement>(".flavor-radar__vertex"));
  const hits = Array.from(root.querySelectorAll<SVGCircleElement>(".flavor-radar__hit"));
  const spokes = Array.from(root.querySelectorAll<SVGLineElement>(".flavor-radar__spoke"));
  const labelGroups = Array.from(root.querySelectorAll<SVGGElement>(".radar-label-group"));

  const binding: RadarFxBinding = {
    root,
    polygon,
    glowPolygon,
    sweepPolygon: null,
    particlesG: null,
    particles: [],
    particleRaf: 0,
    vertices,
    hits,
    spokes,
    labelGroups,
    values,
    n,
    r,
    raf: 0,
    pulsing: false,
    pulseStart: 0,
    pulseBase: null,
    pulsePeak: null,
    hoverAxis: null,
    hoverClearTimer: null,
    comboLevel: 0,
    lastPulseAxis: null,
    lastPulseAt: 0,
  };

  root.dataset.radarFxBound = "1";

  root.querySelectorAll<HTMLElement>("[data-radar-axis-hit]").forEach((hit) => {
    const axisIndex = Number(hit.dataset.radarAxisHit);
    if (!Number.isFinite(axisIndex)) return;
    bindAxisTarget(binding, hit, axisIndex);
  });

  labelGroups.forEach((group) => {
    const axisIndex = Number(group.dataset.radarAxisLabel);
    if (!Number.isFinite(axisIndex)) return;
    bindAxisTarget(binding, group, axisIndex);
  });
}

export function initFlavorRadarFx(scope: ParentNode = document): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  scope.querySelectorAll<HTMLElement>(".flavor-radar--fx").forEach((root) => bindRadar(root));
}
