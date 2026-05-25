/**
 * 天气卡片 · 全幅温度点击特效（Canvas 粒子 + CSS 整卡 wash）
 */

import type { Lang } from "./i18n";
import { UI, t } from "./i18n";
import {
  vibeCoolGel,
  vibeCosmicBurst,
  vibeHeatBurst,
  vibeHumidSplash,
  vibeSandBurst,
  vibeSunBeam,
} from "./weather-temp-fx-haptics";
import { fxIdToDataAttr, type TempFxId } from "./weather-temp-fx-profile";
import { syncWeatherStarsCanvas } from "./weather-stars-canvas";

const HEAT_MS = 1500;
const SAND_MS = 1300;
const HUMID_MS = 1180;
const ICE_MS = 1400;
const COSMIC_MS = 1600;
const SUN_MS = 1500;

type ParticleKind =
  | "fire"
  | "ember"
  | "sand"
  | "watermelon"
  | "ice"
  | "ice_shard"
  | "cosmic_star"
  | "cosmic_nebula"
  | "sun_ray"
  | "sun_spark";

interface FxParticle {
  kind: ParticleKind;
  angle: number;
  dist: number;
  size: number;
  spin: number;
  phase: number;
  vy: number;
  vx: number;
}

export interface FxDomRefs {
  chip: HTMLElement;
  live: HTMLElement;
  fxHost: HTMLElement;
  hit: HTMLElement;
  tempLine: HTMLElement;
  tempEl: HTMLElement;
  fxCanvas: HTMLCanvasElement | null;
  fxStage: HTMLElement | null;
  fxWash: HTMLElement | null;
  fxHands: HTMLElement | null;
  bubbles: HTMLElement | null;
  scrim: HTMLElement | null;
  gelBadge: HTMLElement | null;
  lang: Lang;
}

export interface FxRuntime {
  canvasFx: CanvasFxState | null;
  cleanupTimer: ReturnType<typeof setTimeout> | null;
  squeezeStarted: boolean;
  portalMounts: PortalMount[];
  portalMounted: boolean;
}

interface PortalMount {
  el: HTMLElement;
  parent: Node;
  next: ChildNode | null;
}

const FX_PORTAL_ID = "bento-weather-temp-fx-portal";

interface CanvasFxState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  fxId: TempFxId;
  particles: FxParticle[];
  start: number;
  duration: number;
  raf: number;
  width: number;
  height: number;
  originX: number;
  originY: number;
  bubbleTimer: ReturnType<typeof setInterval> | null;
}

const STAGE_CLASS: Record<TempFxId, string> = {
  FX_Heat_Explosion: "bento-weather-fx-stage--heat",
  FX_Humidity_Squeeze: "bento-weather-fx-stage--humid",
  FX_Dry_Sandstorm: "bento-weather-fx-stage--sand",
  FX_Cool_Gel: "bento-weather-fx-stage--gel",
  FX_Cosmic_Bang: "bento-weather-fx-stage--cosmic",
  FX_Sun_Beam: "bento-weather-fx-stage--sun",
  FX_Mild: "bento-weather-fx-stage--heat",
};

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - 2 ** (-10 * t);
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function maxRadius(originX: number, originY: number, vw: number, vh: number): number {
  const corners: [number, number][] = [
    [0, 0],
    [vw, 0],
    [0, vh],
    [vw, vh],
  ];
  let farthest = 0;
  for (const [cx, cy] of corners) {
    farthest = Math.max(farthest, Math.hypot(cx - originX, cy - originY));
  }
  return farthest * 1.05;
}

function isAtlasFxMode(refs: FxDomRefs): boolean {
  return refs.live.hasAttribute("data-atlas-fx-live");
}

function getFxOriginViewport(refs: FxDomRefs): {
  originX: number;
  originY: number;
  vw: number;
  vh: number;
} {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (isAtlasFxMode(refs)) {
    return { originX: vw * 0.5, originY: vh * 0.5, vw, vh };
  }

  const card = refs.chip.getBoundingClientRect();
  return {
    originX: card.left + card.width * 0.5,
    originY: card.top + card.height * 0.5,
    vw,
    vh,
  };
}

function ensureFxPortal(): HTMLElement {
  let portal = document.getElementById(FX_PORTAL_ID);
  if (!portal) {
    portal = document.createElement("div");
    portal.id = FX_PORTAL_ID;
    portal.className = "bento-weather-temp-fx-portal";
    portal.hidden = true;
    portal.setAttribute("aria-hidden", "true");
    document.body.appendChild(portal);
  }
  return portal;
}

function mountFxPortal(refs: FxDomRefs, rt: FxRuntime): void {
  const portal = ensureFxPortal();
  const { originX, originY, vw, vh } = getFxOriginViewport(refs);
  portal.style.setProperty("--weather-fx-origin-x", isAtlasFxMode(refs) ? "50%" : `${(originX / vw) * 100}%`);
  portal.style.setProperty("--weather-fx-origin-y", isAtlasFxMode(refs) ? "50%" : `${(originY / vh) * 100}%`);
  portal.hidden = false;

  if (!rt.portalMounted) {
    const layers = [refs.scrim, refs.fxStage, refs.fxCanvas].filter(Boolean) as HTMLElement[];
    rt.portalMounts = layers.map((el) => ({
      el,
      parent: el.parentNode!,
      next: el.nextSibling,
    }));
    for (const { el } of rt.portalMounts) portal.appendChild(el);
    rt.portalMounted = true;
  }

  refs.live.classList.add("bento-weather-live--fx-fullscreen");
}

function unmountFxPortal(refs: FxDomRefs, rt: FxRuntime): void {
  if (rt.portalMounted) {
    for (const { el, parent, next } of rt.portalMounts) {
      if (next && next.parentNode === parent) parent.insertBefore(el, next);
      else parent.appendChild(el);
    }
    rt.portalMounts = [];
    rt.portalMounted = false;
  }

  const portal = document.getElementById(FX_PORTAL_ID);
  if (portal) {
    portal.hidden = true;
    portal.style.removeProperty("--weather-fx-origin-x");
    portal.style.removeProperty("--weather-fx-origin-y");
  }

  refs.live.classList.remove("bento-weather-live--fx-fullscreen");
  resetFxCanvasLayout(refs.fxCanvas);
  syncWeatherStarsCanvas(refs.chip);
}

function resetFxCanvasLayout(canvas: HTMLCanvasElement | null | undefined): void {
  if (!canvas) return;
  canvas.hidden = true;
  canvas.style.width = "";
  canvas.style.height = "";
}

function seedFire(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "fire" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.15, 1),
    size: rand(10, 24),
    spin: rand(-1.4, 1.4),
    phase: rand(0, Math.PI * 2),
    vy: rand(-0.4, 1.4),
    vx: rand(-1.2, 1.2),
  }));
}

function seedEmbers(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "ember" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.1, 0.85),
    size: rand(3, 8),
    spin: rand(-0.6, 0.6),
    phase: rand(0, Math.PI * 2),
    vy: rand(-2.2, -0.4),
    vx: rand(-1.4, 1.4),
  }));
}

function seedSand(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "sand" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.1, 1),
    size: rand(2, 7),
    spin: rand(-2.5, 2.5),
    phase: rand(0, Math.PI * 2),
    vy: rand(-0.6, 1.8),
    vx: rand(-1.6, 1.6),
  }));
}

function seedWatermelon(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "watermelon" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.12, 1),
    size: rand(16, 32),
    spin: rand(-2.5, 2.5),
    phase: rand(0, Math.PI * 2),
    vy: rand(-1.4, 1.4),
    vx: rand(-1.6, 1.6),
  }));
}

function seedIce(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "ice" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.1, 1),
    size: rand(12, 28),
    spin: rand(-1.8, 1.8),
    phase: rand(0, Math.PI * 2),
    vy: rand(-1.6, 1.2),
    vx: rand(-1.8, 1.8),
  }));
}

function seedIceShard(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "ice_shard" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.15, 0.95),
    size: rand(5, 12),
    spin: rand(-3, 3),
    phase: rand(0, Math.PI * 2),
    vy: rand(-2, 2),
    vx: rand(-2.2, 2.2),
  }));
}

function seedCosmicStar(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "cosmic_star" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.08, 1),
    size: rand(4, 14),
    spin: rand(-2, 2),
    phase: rand(0, Math.PI * 2),
    vy: rand(-1.8, 1.8),
    vx: rand(-1.8, 1.8),
  }));
}

function seedCosmicNebula(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "cosmic_nebula" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.1, 0.92),
    size: rand(14, 36),
    spin: rand(-0.8, 0.8),
    phase: rand(0, Math.PI * 2),
    vy: rand(-0.8, 0.8),
    vx: rand(-0.8, 0.8),
  }));
}

function seedSunRay(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "sun_ray" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.2, 1),
    size: rand(22, 48),
    spin: 0,
    phase: rand(0, Math.PI * 2),
    vy: 0,
    vx: 0,
  }));
}

function seedSunSpark(count: number): FxParticle[] {
  return Array.from({ length: count }, () => ({
    kind: "sun_spark" as const,
    angle: rand(0, Math.PI * 2),
    dist: rand(0.12, 0.88),
    size: rand(3, 9),
    spin: rand(-1.2, 1.2),
    phase: rand(0, Math.PI * 2),
    vy: rand(-0.6, 0.6),
    vx: rand(-0.6, 0.6),
  }));
}

function setupCanvas(refs: FxDomRefs): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  originX: number;
  originY: number;
} | null {
  const canvas = refs.fxCanvas;
  if (!canvas) return null;

  const { originX, originY, vw, vh } = getFxOriginViewport(refs);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(Math.round(vw), 1);
  const height = Math.max(Math.round(vh), 1);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.hidden = false;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { canvas, ctx, width, height, originX, originY };
}

function drawFireBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  spin: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.globalCompositeOperation = "source-over";
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.4);
  g.addColorStop(0, `rgba(255, 248, 220, ${alpha * 0.85})`);
  g.addColorStop(0.2, `rgba(255, 180, 40, ${alpha * 0.72})`);
  g.addColorStop(0.48, `rgba(255, 105, 0, ${alpha * 0.58})`);
  g.addColorStop(0.78, `rgba(255, 70, 0, ${alpha * 0.28})`);
  g.addColorStop(1, "rgba(255, 120, 0, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, -size * 1.2);
  ctx.quadraticCurveTo(size * 0.9, -size * 0.2, size * 0.55, size * 0.95);
  ctx.quadraticCurveTo(0, size * 0.55, -size * 0.55, size * 0.95);
  ctx.quadraticCurveTo(-size * 0.9, -size * 0.2, 0, -size * 1.2);
  ctx.fill();
  ctx.restore();
}

function drawExplosionSpark(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  alpha: number,
  width: number,
): void {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = `rgba(255, 200, 80, ${alpha * 0.75})`;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawEmber(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number): void {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = `rgba(255, 160, 30, ${alpha * 0.75})`;
  ctx.shadowColor = "rgba(255, 100, 0, 0.45)";
  ctx.shadowBlur = size * 1.8;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSand(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, spin: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.fillStyle = `rgba(235, 195, 130, ${alpha})`;
  ctx.fillRect(-size, -size * 0.45, size * 2, size * 0.9);
  ctx.restore();
}

function drawWatermelonSlice(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  spin: number,
  seedPhase: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  const wedge = size * 0.55;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, wedge * 1.8, -0.55, 0.55);
  ctx.closePath();
  ctx.fillStyle = `rgba(255, 75, 90, ${alpha * 0.92})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(45, 165, 75, ${alpha})`;
  ctx.lineWidth = Math.max(2, size * 0.14);
  ctx.stroke();
  for (let i = 0; i < 4; i += 1) {
    const sx = wedge * (0.35 + i * 0.18);
    const sy = Math.sin(seedPhase + i * 1.7) * wedge * 0.22;
    ctx.fillStyle = `rgba(18, 18, 22, ${alpha * 0.85})`;
    ctx.beginPath();
    ctx.ellipse(sx, sy, size * 0.07, size * 0.11, spin * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawIceCube(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  spin: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  const s = size;
  const g = ctx.createLinearGradient(-s, -s, s, s);
  g.addColorStop(0, `rgba(235, 248, 255, ${alpha})`);
  g.addColorStop(0.45, `rgba(130, 215, 255, ${alpha * 0.9})`);
  g.addColorStop(1, `rgba(55, 165, 230, ${alpha * 0.75})`);
  ctx.fillStyle = g;
  ctx.beginPath();
  const r = s * 0.18;
  ctx.moveTo(-s + r, -s);
  ctx.lineTo(s - r, -s);
  ctx.quadraticCurveTo(s, -s, s, -s + r);
  ctx.lineTo(s, s - r);
  ctx.quadraticCurveTo(s, s, s - r, s);
  ctx.lineTo(-s + r, s);
  ctx.quadraticCurveTo(-s, s, -s, s - r);
  ctx.lineTo(-s, -s + r);
  ctx.quadraticCurveTo(-s, -s, -s + r, -s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.65})`;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.strokeStyle = `rgba(190, 235, 255, ${alpha * 0.45})`;
  ctx.beginPath();
  ctx.moveTo(-s * 0.35, -s * 0.15);
  ctx.lineTo(s * 0.42, s * 0.28);
  ctx.stroke();
  ctx.restore();
}

function drawIceShard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  spin: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.fillStyle = `rgba(210, 240, 255, ${alpha * 0.9})`;
  ctx.beginPath();
  ctx.moveTo(0, -size * 1.2);
  ctx.lineTo(size * 0.45, size * 0.9);
  ctx.lineTo(-size * 0.35, size * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function paintHeat(state: CanvasFxState, now: number): void {
  const elapsed = now - state.start;
  const flashDur = state.duration * 0.14;
  const flash = elapsed < flashDur ? easeOutExpo(elapsed / flashDur) : Math.max(0, 1 - (elapsed - flashDur) / (flashDur * 2));
  const burst = fxEaseExpand(elapsed, state.duration, 2.5);
  const fade = fxEaseFade(elapsed, state.duration, 0.52, 0.42);
  const alpha = fade * 0.62;
  const { ctx, width, height, originX: ox, originY: oy } = state;
  const maxR = maxRadius(ox, oy, width, height);

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  const coreR = maxR * (0.12 + burst * 0.42);
  const core = ctx.createRadialGradient(ox, oy, 0, ox, oy, coreR);
  core.addColorStop(0, `rgba(255, 248, 220, ${alpha * (0.42 + flash * 0.18)})`);
  core.addColorStop(0.18, `rgba(255, 210, 80, ${alpha * 0.52 * burst})`);
  core.addColorStop(0.42, `rgba(255, 120, 0, ${alpha * 0.44 * burst})`);
  core.addColorStop(0.72, `rgba(255, 80, 0, ${alpha * 0.22 * burst})`);
  core.addColorStop(1, "rgba(255, 100, 0, 0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(ox, oy, coreR, 0, Math.PI * 2);
  ctx.fill();

  for (let ring = 0; ring < 3; ring += 1) {
    const rb = fxRingExpand(elapsed, state.duration, ring);
    if (rb < 0.04) continue;
    const ringR = maxR * (0.28 + rb * 0.92);
    const ringA = alpha * (0.32 - ring * 0.08) * (1 - rb * 0.65);
    ctx.strokeStyle = `rgba(255, ${130 - ring * 20}, 0, ${ringA})`;
    ctx.lineWidth = 4.5 - ring * 1.1;
    ctx.beginPath();
    ctx.arc(ox, oy, ringR, 0, Math.PI * 2);
    ctx.stroke();
  }

  const bloomR = maxR * (0.5 + burst * 1.05);
  const bloom = ctx.createRadialGradient(ox, oy, 0, ox, oy, bloomR);
  bloom.addColorStop(0, `rgba(255, 150, 0, ${alpha * 0.14 * burst})`);
  bloom.addColorStop(0.45, `rgba(255, 100, 0, ${alpha * 0.08 * burst})`);
  bloom.addColorStop(1, "rgba(255, 120, 0, 0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  for (const p of state.particles) {
    if (p.kind === "fire") {
      const r = maxR * p.dist * burst * 1.08;
      const x = ox + Math.cos(p.angle) * r + Math.sin(now * 0.008 + p.phase) * 3;
      const y = oy + Math.sin(p.angle) * r * 0.88 + p.vy * burst * 18;
      drawFireBlob(ctx, x, y, p.size * (0.95 + burst * 0.55), alpha * (0.52 + p.dist * 0.28), p.spin + now * 0.004);
      if (burst > 0.35 && p.dist > 0.4) {
        const sx = ox + Math.cos(p.angle) * r * 0.35;
        const sy = oy + Math.sin(p.angle) * r * 0.35;
        drawExplosionSpark(ctx, sx, sy, x, y, alpha * 0.22 * burst, 1.8);
      }
    } else if (p.kind === "ember") {
      const r = maxR * p.dist * burst * 1.05;
      const x = ox + Math.cos(p.angle) * r + p.vx * burst * 30;
      const y = oy + Math.sin(p.angle) * r + p.vy * burst * 34;
      drawEmber(ctx, x, y, p.size * 1.15, alpha * 0.72);
    }
  }
}

function paintSand(state: CanvasFxState, now: number): void {
  const elapsed = now - state.start;
  const burst = fxEaseExpand(elapsed, state.duration, 2.3);
  const swirl = fxEaseExpand(elapsed, state.duration, 1.85);
  const fade = fxEaseFade(elapsed, state.duration, 0.48, 0.44);
  const { ctx, width, height, originX: ox, originY: oy } = state;
  const maxR = maxRadius(ox, oy, width, height);

  ctx.clearRect(0, 0, width, height);

  const haze = ctx.createRadialGradient(ox, oy, 0, ox, oy, maxR);
  haze.addColorStop(0, `rgba(255, 230, 170, ${fade * 0.35 * burst})`);
  haze.addColorStop(0.5, `rgba(220, 170, 90, ${fade * 0.18 * burst})`);
  haze.addColorStop(1, "rgba(180, 130, 70, 0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, width, height);

  for (let ring = 0; ring < 5; ring += 1) {
    const tt = ring / 5;
    const r = maxR * (0.2 + tt * 0.85) * burst;
    ctx.strokeStyle = `rgba(240, 200, 130, ${fade * (0.28 - tt * 0.05) * swirl})`;
    ctx.lineWidth = 2.5 - tt * 0.35;
    ctx.beginPath();
    ctx.arc(ox, oy, r, now * 0.0015 + tt, now * 0.0015 + tt + Math.PI * 1.4);
    ctx.stroke();
  }

  for (const p of state.particles) {
    if (p.kind !== "sand") continue;
    const r = maxR * p.dist * burst;
    const swirlOff = Math.sin(now * 0.006 + p.phase) * swirl * 14;
    const x = ox + Math.cos(p.angle + swirl * 0.8) * r + p.vx * burst * 16 + swirlOff;
    const y = oy + Math.sin(p.angle + swirl * 0.5) * r + p.vy * burst * 20;
    drawSand(ctx, x, y, p.size, fade * (0.5 + p.dist * 0.45), p.spin + now * 0.005);
  }
}

function fxEaseExpand(elapsed: number, duration: number, power = 2.35): number {
  const t = Math.min(1, Math.max(0, elapsed / duration));
  return 1 - (1 - t) ** power;
}

function fxEaseFade(
  elapsed: number,
  duration: number,
  fadeStartRatio = 0.56,
  fadeSpanRatio = 0.38,
): number {
  const fadeStart = duration * fadeStartRatio;
  if (elapsed <= fadeStart) return 1;
  const t = Math.min(1, (elapsed - fadeStart) / (duration * fadeSpanRatio));
  return 1 - easeOutCubic(t);
}

function fxRingExpand(elapsed: number, duration: number, ring: number, lagRatio = 0.038): number {
  const lag = duration * lagRatio * ring;
  return fxEaseExpand(Math.max(0, elapsed - lag), duration * 0.96, 2.25);
}

function paintWatermelon(state: CanvasFxState, now: number): void {
  const elapsed = now - state.start;
  const flashDur = state.duration * 0.1;
  const flash = elapsed < flashDur ? easeOutExpo(elapsed / flashDur) : Math.max(0, 1 - (elapsed - flashDur) / (flashDur * 1.5));
  const burst = fxEaseExpand(elapsed, state.duration, 2.4);
  const fade = fxEaseFade(elapsed, state.duration, 0.56, 0.36);
  const alpha = fade * 0.68;
  const { ctx, width, height, originX: ox, originY: oy } = state;
  const maxR = maxRadius(ox, oy, width, height);

  ctx.clearRect(0, 0, width, height);

  const coreR = maxR * (0.15 + burst * 0.58);
  const core = ctx.createRadialGradient(ox, oy, 0, ox, oy, coreR);
  core.addColorStop(0, `rgba(255, 240, 230, ${alpha * (0.32 + flash * 0.2)})`);
  core.addColorStop(0.2, `rgba(255, 100, 110, ${alpha * 0.38 * burst})`);
  core.addColorStop(0.5, `rgba(255, 60, 80, ${alpha * 0.22 * burst})`);
  core.addColorStop(0.75, `rgba(50, 170, 80, ${alpha * 0.12 * burst})`);
  core.addColorStop(1, "rgba(255, 120, 100, 0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, width, height);

  for (let ring = 0; ring < 2; ring += 1) {
    const ringT = fxRingExpand(elapsed, state.duration, ring, 0.032);
    const ringR = maxR * (0.25 + ringT * 0.92);
    ctx.strokeStyle = `rgba(255, 120, 130, ${alpha * (0.22 - ring * 0.07) * (1 - ringT * 0.45)})`;
    ctx.lineWidth = 3.5 - ring;
    ctx.beginPath();
    ctx.arc(ox, oy, ringR, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (const p of state.particles) {
    if (p.kind !== "watermelon") continue;
    const r = maxR * p.dist * burst * 1.06;
    const x = ox + Math.cos(p.angle) * r + p.vx * burst * 24;
    const y = oy + Math.sin(p.angle) * r * 0.9 + p.vy * burst * 26;
    drawWatermelonSlice(
      ctx,
      x,
      y,
      p.size * (1.05 + burst * 0.28),
      alpha * (0.68 + p.dist * 0.22),
      p.spin + now * 0.004,
      p.phase,
    );
  }
}

function paintIce(state: CanvasFxState, now: number): void {
  const elapsed = now - state.start;
  const flashDur = state.duration * 0.1;
  const flash = elapsed < flashDur ? easeOutExpo(elapsed / flashDur) : Math.max(0, 1 - (elapsed - flashDur) / (flashDur * 1.5));
  const burst = fxEaseExpand(elapsed, state.duration, 2.35);
  const fade = fxEaseFade(elapsed, state.duration, 0.54, 0.38);
  const alpha = fade * 0.58;
  const { ctx, width, height, originX: ox, originY: oy } = state;
  const maxR = maxRadius(ox, oy, width, height);

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  const coreR = maxR * (0.14 + burst * 0.45);
  const core = ctx.createRadialGradient(ox, oy, 0, ox, oy, coreR);
  core.addColorStop(0, `rgba(255, 255, 255, ${alpha * (0.38 + flash * 0.12)})`);
  core.addColorStop(0.25, `rgba(200, 240, 255, ${alpha * 0.38 * burst})`);
  core.addColorStop(0.55, `rgba(100, 200, 255, ${alpha * 0.24 * burst})`);
  core.addColorStop(1, "rgba(80, 180, 255, 0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(ox, oy, coreR, 0, Math.PI * 2);
  ctx.fill();

  for (let ring = 0; ring < 3; ring += 1) {
    const rb = fxRingExpand(elapsed, state.duration, ring, 0.042);
    if (rb < 0.05) continue;
    const ringR = maxR * (0.22 + rb * 0.88);
    ctx.strokeStyle = `rgba(180, 230, 255, ${alpha * (0.26 - ring * 0.07) * (1 - rb * 0.55)})`;
    ctx.lineWidth = 4 - ring * 0.9;
    ctx.beginPath();
    ctx.arc(ox, oy, ringR, 0, Math.PI * 2);
    ctx.stroke();
  }

  const bloomR = maxR * (0.48 + burst * 1);
  const bloom = ctx.createRadialGradient(ox, oy, 0, ox, oy, bloomR);
  bloom.addColorStop(0, `rgba(160, 225, 255, ${alpha * 0.12 * burst})`);
  bloom.addColorStop(0.5, `rgba(90, 190, 255, ${alpha * 0.07 * burst})`);
  bloom.addColorStop(1, "rgba(60, 160, 240, 0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  for (const p of state.particles) {
    const r = maxR * p.dist * burst * 1.02;
    const x = ox + Math.cos(p.angle) * r + p.vx * burst * 22;
    const y = oy + Math.sin(p.angle) * r * 0.88 + p.vy * burst * 24;
    if (p.kind === "ice") {
      drawIceCube(ctx, x, y, p.size * (1.05 + burst * 0.4), alpha * 0.82, p.spin + now * 0.003);
    } else if (p.kind === "ice_shard") {
      drawIceShard(ctx, x, y, p.size * 1.1, alpha * 0.75, p.spin + now * 0.006);
    }
  }
}

function drawCosmicStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  spin: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.fillStyle = `rgba(255, 248, 255, ${alpha * 0.88})`;
  ctx.beginPath();
  for (let i = 0; i < 4; i += 1) {
    const a = (Math.PI / 2) * i;
    ctx.lineTo(Math.cos(a) * size * 1.3, Math.sin(a) * size * 0.35);
    ctx.lineTo(Math.cos(a + Math.PI / 4) * size * 0.22, Math.sin(a + Math.PI / 4) * size * 0.22);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCosmicNebula(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  spin: number,
  phase: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.4);
  const hue = phase % 2 > 1 ? "180, 120, 255" : "255, 100, 180";
  g.addColorStop(0, `rgba(${hue}, ${alpha * 0.34})`);
  g.addColorStop(0.55, `rgba(80, 60, 180, ${alpha * 0.18})`);
  g.addColorStop(1, "rgba(20, 10, 60, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.72, phase * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSunRay(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  angle: number,
  length: number,
  alpha: number,
  width: number,
): void {
  const x2 = ox + Math.cos(angle) * length;
  const y2 = oy + Math.sin(angle) * length;
  ctx.save();
  ctx.strokeStyle = `rgba(255, 220, 120, ${alpha * 0.55})`;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.strokeStyle = `rgba(255, 248, 210, ${alpha * 0.28})`;
  ctx.lineWidth = width * 2.2;
  ctx.stroke();
  ctx.restore();
}

function drawSunSpark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number): void {
  ctx.save();
  ctx.fillStyle = `rgba(255, 230, 150, ${alpha * 0.72})`;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintCosmic(state: CanvasFxState, now: number): void {
  const elapsed = now - state.start;
  const flashDur = state.duration * 0.1;
  const flash = elapsed < flashDur ? easeOutExpo(elapsed / flashDur) : Math.max(0, 1 - (elapsed - flashDur) / (flashDur * 2.2));
  const burst = fxEaseExpand(elapsed, state.duration, 2.4);
  const fade = fxEaseFade(elapsed, state.duration, 0.54, 0.4);
  const alpha = fade * 0.58;
  const { ctx, width, height, originX: ox, originY: oy } = state;
  const maxR = maxRadius(ox, oy, width, height);

  ctx.clearRect(0, 0, width, height);

  const space = ctx.createRadialGradient(ox, oy, 0, ox, oy, maxR);
  space.addColorStop(0, `rgba(12, 8, 32, ${alpha * 0.42 * burst})`);
  space.addColorStop(0.45, `rgba(8, 6, 24, ${alpha * 0.28 * burst})`);
  space.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = space;
  ctx.fillRect(0, 0, width, height);

  const coreR = maxR * (0.08 + burst * 0.38);
  const core = ctx.createRadialGradient(ox, oy, 0, ox, oy, coreR);
  core.addColorStop(0, `rgba(255, 252, 245, ${alpha * (0.38 + flash * 0.22)})`);
  core.addColorStop(0.18, `rgba(255, 210, 140, ${alpha * 0.32 * burst})`);
  core.addColorStop(0.42, `rgba(180, 100, 255, ${alpha * 0.26 * burst})`);
  core.addColorStop(0.68, `rgba(60, 140, 255, ${alpha * 0.16 * burst})`);
  core.addColorStop(1, "rgba(20, 10, 60, 0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(ox, oy, coreR, 0, Math.PI * 2);
  ctx.fill();

  const ringColors = ["255, 180, 80", "255, 120, 200", "120, 200, 255", "200, 160, 255"];
  for (let ring = 0; ring < 4; ring += 1) {
    const rb = fxRingExpand(elapsed, state.duration, ring, 0.034);
    if (rb < 0.04) continue;
    const ringR = maxR * (0.18 + rb * 0.92);
    ctx.strokeStyle = `rgba(${ringColors[ring]}, ${alpha * (0.28 - ring * 0.05) * (1 - rb * 0.55)})`;
    ctx.lineWidth = 5 - ring * 0.8;
    ctx.beginPath();
    ctx.arc(ox, oy, ringR, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (const p of state.particles) {
    const r = maxR * p.dist * burst * 1.05;
    const x = ox + Math.cos(p.angle) * r + p.vx * burst * 18;
    const y = oy + Math.sin(p.angle) * r * 0.92 + p.vy * burst * 18;
    if (p.kind === "cosmic_star") {
      drawCosmicStar(ctx, x, y, p.size * (0.9 + burst * 0.35), alpha * 0.78, p.spin + now * 0.003);
    } else if (p.kind === "cosmic_nebula") {
      drawCosmicNebula(ctx, x, y, p.size, alpha * 0.62, p.spin + now * 0.001, p.phase);
    }
  }
}

function paintSun(state: CanvasFxState, now: number): void {
  const elapsed = now - state.start;
  const swell = fxEaseExpand(elapsed, state.duration, 1.65);
  const burst = fxEaseExpand(elapsed, state.duration, 2.3);
  const fade = fxEaseFade(elapsed, state.duration, 0.56, 0.38);
  const alpha = fade * 0.55;
  const { ctx, width, height, originX: ox, originY: oy } = state;
  const maxR = maxRadius(ox, oy, width, height);

  ctx.clearRect(0, 0, width, height);

  const warm = ctx.createRadialGradient(ox, oy, 0, ox, oy, maxR * (0.35 + swell * 0.75));
  warm.addColorStop(0, `rgba(255, 230, 150, ${alpha * 0.22 * swell})`);
  warm.addColorStop(0.35, `rgba(255, 190, 80, ${alpha * 0.12 * swell})`);
  warm.addColorStop(1, "rgba(255, 160, 60, 0)");
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 18; i += 1) {
    const angle = (Math.PI * 2 * i) / 18 + now * 0.0004;
    const len = maxR * (0.28 + burst * 0.72) * (0.82 + (i % 3) * 0.08);
    drawSunRay(ctx, ox, oy, angle, len, alpha * swell, 2.2 + (i % 2));
  }

  const discR = maxR * (0.06 + swell * 0.14);
  const disc = ctx.createRadialGradient(ox, oy, 0, ox, oy, discR);
  disc.addColorStop(0, `rgba(255, 252, 235, ${alpha * 0.48})`);
  disc.addColorStop(0.35, `rgba(255, 220, 100, ${alpha * 0.32})`);
  disc.addColorStop(0.72, `rgba(255, 170, 50, ${alpha * 0.14})`);
  disc.addColorStop(1, "rgba(255, 140, 0, 0)");
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(ox, oy, discR, 0, Math.PI * 2);
  ctx.fill();

  for (const p of state.particles) {
    if (p.kind === "sun_ray") {
      const len = maxR * p.dist * burst * (p.size / 28);
      drawSunRay(ctx, ox, oy, p.angle + p.phase * 0.02, len, alpha * 0.65, 2.8);
    } else if (p.kind === "sun_spark") {
      const r = maxR * p.dist * swell * 0.85;
      const x = ox + Math.cos(p.angle) * r + p.vx * swell * 12;
      const y = oy + Math.sin(p.angle) * r + p.vy * swell * 12;
      drawSunSpark(ctx, x, y, p.size, alpha * 0.7);
    }
  }
}

function spawnBubble(bubbles: HTMLElement, text: string, variant: "watermelon" | "sand" | "sun"): void {
  const el = document.createElement("span");
  el.className = `bento-weather-fx-bubble bento-weather-fx-bubble--${variant}`;
  el.textContent = text;
  el.style.setProperty("--bubble-x", `${rand(12, 88)}%`);
  el.style.setProperty("--bubble-y", `${rand(18, 72)}%`);
  el.style.setProperty("--bubble-drift", `${rand(-24, 24)}px`);
  el.style.setProperty("--bubble-rotate", `${rand(-12, 12)}deg`);
  bubbles.appendChild(el);
  requestAnimationFrame(() => el.classList.add("is-rise"));
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

function bubbleLabels(fxId: TempFxId, lang: Lang): string[] {
  if (fxId === "FX_Humidity_Squeeze") {
    return [t(UI.gallery.weather_fx_watermelon_juicy, lang), t(UI.gallery.weather_fx_watermelon_sweet, lang)];
  }
  if (fxId === "FX_Dry_Sandstorm") {
    return [t(UI.gallery.weather_fx_sand_grain, lang), t(UI.gallery.weather_fx_sand_burn, lang)];
  }
  if (fxId === "FX_Sun_Beam") {
    return [t(UI.gallery.weather_fx_sun_warm, lang), t(UI.gallery.weather_fx_sun_glow, lang)];
  }
  return [];
}

function bubbleVariant(fxId: TempFxId): "watermelon" | "sand" | "sun" {
  if (fxId === "FX_Dry_Sandstorm") return "sand";
  if (fxId === "FX_Sun_Beam") return "sun";
  return "watermelon";
}

function setFxBadge(refs: FxDomRefs, text: string | null): void {
  if (!refs.gelBadge) return;
  if (!text) {
    refs.gelBadge.hidden = true;
    return;
  }
  refs.gelBadge.textContent = text;
  refs.gelBadge.hidden = false;
}

function positionHands(refs: FxDomRefs): void {
  if (!refs.fxHands) return;
  const host = refs.fxHost.getBoundingClientRect();
  const temp = refs.tempEl.getBoundingClientRect();
  const cx = temp.left + temp.width * 0.5 - host.left;
  const cy = temp.top + temp.height * 0.5 - host.top;
  refs.fxHands.style.setProperty("--fx-hand-x", `${cx}px`);
  refs.fxHands.style.setProperty("--fx-hand-y", `${cy}px`);
}

function triggerStage(refs: FxDomRefs, fxId: TempFxId): void {
  if (!refs.fxStage) return;
  for (const cls of Object.values(STAGE_CLASS)) refs.fxStage.classList.remove(cls);
  refs.fxStage.classList.remove("is-playing");
  void refs.fxStage.offsetWidth;
  refs.fxStage.classList.add(STAGE_CLASS[fxId], "is-playing");
  refs.fxWash?.classList.remove("is-playing");
  void refs.fxWash?.offsetWidth;
  refs.fxWash?.classList.add("is-playing");
}

function stopStage(refs: FxDomRefs): void {
  refs.fxStage?.classList.remove("is-playing");
  refs.fxWash?.classList.remove("is-playing");
  for (const cls of Object.values(STAGE_CLASS)) refs.fxStage?.classList.remove(cls);
  if (refs.fxHands) {
    refs.fxHands.hidden = true;
    refs.fxHands.classList.remove("is-squeezing");
  }
}

export function stopCanvasFx(rt: FxRuntime): void {
  if (!rt.canvasFx) return;
  cancelAnimationFrame(rt.canvasFx.raf);
  if (rt.canvasFx.bubbleTimer) clearInterval(rt.canvasFx.bubbleTimer);
  resetFxCanvasLayout(rt.canvasFx.canvas);
  rt.canvasFx.ctx.clearRect(0, 0, rt.canvasFx.width, rt.canvasFx.height);
  rt.canvasFx = null;
}

function setChipFxTheme(refs: FxDomRefs, fxId: TempFxId | null, rt: FxRuntime): void {
  const theme = fxId ? fxIdToDataAttr(fxId) : "";
  refs.chip.dataset.weatherTempFx = theme;
  refs.live.classList.remove(
    "bento-weather-live--temp-fx-heat-explosion",
    "bento-weather-live--temp-fx-humidity-squeeze",
    "bento-weather-live--temp-fx-dry-sandstorm",
    "bento-weather-live--temp-fx-cool-gel",
    "bento-weather-live--temp-fx-cosmic-bang",
    "bento-weather-live--temp-fx-sun-beam",
    "bento-weather-live--fx-active",
  );
  refs.scrim?.classList.remove(
    "is-active",
    "bento-weather-fx-scrim--heat",
    "bento-weather-fx-scrim--humid",
    "bento-weather-fx-scrim--sand",
    "bento-weather-fx-scrim--gel",
    "bento-weather-fx-scrim--cosmic",
    "bento-weather-fx-scrim--sun",
    "bento-weather-fx-scrim--burst",
  );
  setFxBadge(refs, null);

  if (!fxId) {
    unmountFxPortal(refs, rt);
    return;
  }

  refs.live.classList.add("bento-weather-live--fx-active", `bento-weather-live--temp-fx-${theme}`);
  if (refs.scrim) {
    refs.scrim.classList.add("is-active", "bento-weather-fx-scrim--burst");
    if (fxId === "FX_Heat_Explosion") refs.scrim.classList.add("bento-weather-fx-scrim--heat");
    if (fxId === "FX_Humidity_Squeeze") refs.scrim.classList.add("bento-weather-fx-scrim--humid");
    if (fxId === "FX_Dry_Sandstorm") refs.scrim.classList.add("bento-weather-fx-scrim--sand");
    if (fxId === "FX_Cool_Gel") {
      refs.scrim.classList.add("bento-weather-fx-scrim--gel");
      setFxBadge(refs, t(UI.gallery.weather_fx_gel_label, refs.lang));
    }
    if (fxId === "FX_Cosmic_Bang") {
      refs.scrim.classList.add("bento-weather-fx-scrim--cosmic");
      setFxBadge(refs, t(UI.gallery.weather_fx_cosmic_label, refs.lang));
    }
    if (fxId === "FX_Sun_Beam") {
      refs.scrim.classList.add("bento-weather-fx-scrim--sun");
      setFxBadge(refs, t(UI.gallery.weather_fx_sun_label, refs.lang));
    }
  }
}

export function clearFxClasses(refs: FxDomRefs, rt: FxRuntime): void {
  const { hit, tempLine, tempEl } = refs;
  hit.classList.remove(
    "bento-weather-temp-hit--bursting",
    "bento-weather-temp-hit--burst-digit",
    "bento-weather-temp-hit--fx-heat",
    "bento-weather-temp-hit--fx-sand",
    "bento-weather-temp-hit--fx-squeeze",
    "bento-weather-temp-hit--fx-watermelon",
    "bento-weather-temp-hit--fx-gel",
    "bento-weather-temp-hit--fx-ice",
    "bento-weather-temp-hit--fx-cosmic",
    "bento-weather-temp-hit--fx-sun",
    "bento-weather-temp-hit--heat-punch",
  );
  tempLine.classList.remove("bento-weather-temp-line--gel");
  tempEl.classList.remove("bento-weather-temp--wobble", "bento-weather-temp--gel", "bento-weather-temp--squeeze");
  if (refs.bubbles) refs.bubbles.textContent = "";
  stopStage(refs);
  setChipFxTheme(refs, null, rt);
}

function runCanvasLoop(rt: FxRuntime): void {
  const fx = rt.canvasFx;
  if (!fx) return;
  const now = performance.now();
  if (fx.fxId === "FX_Heat_Explosion") paintHeat(fx, now);
  else if (fx.fxId === "FX_Dry_Sandstorm") paintSand(fx, now);
  else if (fx.fxId === "FX_Humidity_Squeeze") paintWatermelon(fx, now);
  else if (fx.fxId === "FX_Cool_Gel") paintIce(fx, now);
  else if (fx.fxId === "FX_Cosmic_Bang") paintCosmic(fx, now);
  else if (fx.fxId === "FX_Sun_Beam") paintSun(fx, now);
  if (now - fx.start >= fx.duration) {
    stopCanvasFx(rt);
    return;
  }
  fx.raf = requestAnimationFrame(() => runCanvasLoop(rt));
}

function playCanvasBurst(
  rt: FxRuntime,
  refs: FxDomRefs,
  fxId: TempFxId,
  duration: number,
  particles: FxParticle[],
): void {
  stopCanvasFx(rt);
  const setup = setupCanvas(refs);
  if (!setup) return;
  rt.canvasFx = {
    canvas: setup.canvas,
    ctx: setup.ctx,
    fxId,
    particles,
    start: performance.now(),
    duration,
    raf: 0,
    width: setup.width,
    height: setup.height,
    originX: setup.originX,
    originY: setup.originY,
    bubbleTimer: null,
  };
  runCanvasLoop(rt);
}

function finishFx(rt: FxRuntime, refs: FxDomRefs, delayMs: number): void {
  if (rt.cleanupTimer) clearTimeout(rt.cleanupTimer);
  rt.cleanupTimer = setTimeout(() => {
    stopCanvasFx(rt);
    clearFxClasses(refs, rt);
    rt.cleanupTimer = null;
    rt.squeezeStarted = false;
  }, delayMs);
}

function startBubbleLoop(rt: FxRuntime, refs: FxDomRefs, fxId: TempFxId, everyMs: number): void {
  if (!refs.bubbles || !rt.canvasFx) return;
  const labels = bubbleLabels(fxId, refs.lang);
  if (!labels.length) return;
  let i = 0;
  const tick = (): void => {
    if (refs.bubbles) spawnBubble(refs.bubbles, labels[i++ % labels.length]!, bubbleVariant(fxId));
  };
  tick();
  rt.canvasFx.bubbleTimer = setInterval(tick, everyMs);
}

function primeFxShell(refs: FxDomRefs, rt: FxRuntime, fxId: TempFxId): void {
  mountFxPortal(refs, rt);
  refs.hit.classList.add("bento-weather-temp-hit--bursting", "bento-weather-temp-hit--burst-digit");
  if (fxId === "FX_Heat_Explosion") refs.hit.classList.add("bento-weather-temp-hit--fx-heat");
  if (fxId === "FX_Dry_Sandstorm") refs.hit.classList.add("bento-weather-temp-hit--fx-sand");
  if (fxId === "FX_Humidity_Squeeze") refs.hit.classList.add("bento-weather-temp-hit--fx-watermelon");
  if (fxId === "FX_Cool_Gel") refs.hit.classList.add("bento-weather-temp-hit--fx-ice");
  if (fxId === "FX_Cosmic_Bang") refs.hit.classList.add("bento-weather-temp-hit--fx-cosmic");
  if (fxId === "FX_Sun_Beam") refs.hit.classList.add("bento-weather-temp-hit--fx-sun");
  setChipFxTheme(refs, fxId, rt);
  triggerStage(refs, fxId);
}

export function playHeatExplosion(refs: FxDomRefs, rt: FxRuntime, opts?: { restack?: boolean }): void {
  if (!opts?.restack && refs.live.classList.contains("bento-weather-live--fx-active")) return;
  primeFxShell(refs, rt, "FX_Heat_Explosion");
  vibeHeatBurst();
  playCanvasBurst(rt, refs, "FX_Heat_Explosion", HEAT_MS, [...seedFire(64), ...seedEmbers(48)]);
  finishFx(rt, refs, HEAT_MS + 180);
}

export function playSandstorm(refs: FxDomRefs, rt: FxRuntime, opts?: { restack?: boolean }): void {
  if (!opts?.restack && refs.live.classList.contains("bento-weather-live--fx-active")) return;
  primeFxShell(refs, rt, "FX_Dry_Sandstorm");
  vibeSandBurst();
  playCanvasBurst(rt, refs, "FX_Dry_Sandstorm", SAND_MS, seedSand(90));
  startBubbleLoop(rt, refs, "FX_Dry_Sandstorm", 360);
  finishFx(rt, refs, SAND_MS + 120);
}

export function playHumiditySqueeze(refs: FxDomRefs, rt: FxRuntime): void {
  if (rt.squeezeStarted) return;
  rt.squeezeStarted = true;
  primeFxShell(refs, rt, "FX_Humidity_Squeeze");
  vibeHumidSplash();
  playCanvasBurst(rt, refs, "FX_Humidity_Squeeze", HUMID_MS, seedWatermelon(52));
  startBubbleLoop(rt, refs, "FX_Humidity_Squeeze", 320);
  finishFx(rt, refs, HUMID_MS + 100);
}

export function playCoolGel(refs: FxDomRefs, rt: FxRuntime): void {
  primeFxShell(refs, rt, "FX_Cool_Gel");
  refs.hit.classList.add("bento-weather-temp-hit--burst-digit");
  vibeCoolGel();
  playCanvasBurst(rt, refs, "FX_Cool_Gel", ICE_MS, [...seedIce(48), ...seedIceShard(36)]);
  finishFx(rt, refs, ICE_MS + 160);
}

export function playCosmicBang(refs: FxDomRefs, rt: FxRuntime, opts?: { restack?: boolean }): void {
  if (!opts?.restack && refs.live.classList.contains("bento-weather-live--fx-active")) return;
  primeFxShell(refs, rt, "FX_Cosmic_Bang");
  vibeCosmicBurst();
  playCanvasBurst(rt, refs, "FX_Cosmic_Bang", COSMIC_MS, [...seedCosmicStar(72), ...seedCosmicNebula(28)]);
  finishFx(rt, refs, COSMIC_MS + 180);
}

export function playSunBeam(refs: FxDomRefs, rt: FxRuntime, opts?: { restack?: boolean }): void {
  if (!opts?.restack && refs.live.classList.contains("bento-weather-live--fx-active")) return;
  primeFxShell(refs, rt, "FX_Sun_Beam");
  vibeSunBeam();
  playCanvasBurst(rt, refs, "FX_Sun_Beam", SUN_MS, [...seedSunRay(24), ...seedSunSpark(56)]);
  startBubbleLoop(rt, refs, "FX_Sun_Beam", 380);
  finishFx(rt, refs, SUN_MS + 160);
}

export function playHeatPunch(refs: FxDomRefs): void {
  refs.hit.classList.add("bento-weather-temp-hit--heat-punch");
  window.setTimeout(() => refs.hit.classList.remove("bento-weather-temp-hit--heat-punch"), 180);
}

export function finishHeatLottieBurst(refs: FxDomRefs, rt: FxRuntime): void {
  if (rt.cleanupTimer) clearTimeout(rt.cleanupTimer);
  stopCanvasFx(rt);
  clearFxClasses(refs, rt);
  rt.squeezeStarted = false;
}

export const finishSandLottieBurst = finishHeatLottieBurst;

export function teardownFxRuntime(rt: FxRuntime, refs: FxDomRefs): void {
  if (rt.cleanupTimer) clearTimeout(rt.cleanupTimer);
  stopCanvasFx(rt);
  clearFxClasses(refs, rt);
  rt.squeezeStarted = false;
}
