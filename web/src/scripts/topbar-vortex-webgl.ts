/**
 * Three.js / WebGL particle vortex behind the active top-nav tab.
 *
 * Two render passes (single scene, ortho cam):
 *   1. Full-screen quad with a fragment shader that draws the red iris core,
 *      rotating spiral bands, dark pupil and outer halo bloom.
 *   2. Points (instanced positions baked as attributes) animated in a vertex
 *      shader: orbital motion, outward drift, and mouse-position attraction.
 *
 * Lazy-loaded with dynamic import("three") so first paint is cheap.
 * One WebGL instance per nav — tab 切换时只移动宿主，不重建 renderer。
 */

import type {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  Mesh,
  Points,
  ShaderMaterial,
  BufferGeometry,
  Clock,
} from "three";

const NAV_SELECTOR = ".topbar-glass .topbar-center";
const TAB_SELECTOR = ".tab";
/** 含「世界街景」在内，任一 active tab 均显示银河旋涡 */
const VORTEX_ACTIVE_SELECTOR = `${TAB_SELECTOR}.active`;
const HOST_CLASS = "topbar-tab-vortex";
const HOST_READY_CLASS = "topbar-tab-vortex--ready";
const VORTEX_W = 42;
const VORTEX_H = 36;
const PARTICLE_COUNT = 220;

let threeModulePromise: Promise<typeof import("three")> | null = null;

interface VortexInstance {
  host: HTMLElement;
  canvas: HTMLCanvasElement;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  quad: Mesh;
  points: Points;
  quadMaterial: ShaderMaterial;
  pointsMaterial: ShaderMaterial;
  particleGeometry: BufferGeometry;
  clock: Clock;
  rafId: number | null;
  resizeObserver: ResizeObserver;
  mouseHandler: (event: PointerEvent) => void;
  leaveHandler: () => void;
  targetMouse: { x: number; y: number };
  smoothedMouse: { x: number; y: number };
  tabEl: HTMLElement | null;
  disposed: boolean;
}

const instances = new WeakMap<HTMLElement, VortexInstance>();
const navVortex = new WeakMap<HTMLElement, VortexInstance>();
const lastVortexTab = new WeakMap<HTMLElement, HTMLElement | null>();
const initedNavs = new WeakSet<HTMLElement>();
let mountGeneration = 0;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function getThree(): Promise<typeof import("three")> {
  if (!threeModulePromise) {
    threeModulePromise = import("three");
  }
  return threeModulePromise;
}

const VERTEX_QUAD_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_QUAD_SHADER = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uFadeIn;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // Smooth log-spiral arm — Gaussian falloff around the spiral curve.
  // The arm peaks where (angle + log(r) * pitch + arm-offset) is 0 mod 2π/N.
  float spiralArm(float r, float angle, float time, float pitch, int numArms) {
    float spiralAngle = angle + log(max(r, 0.05)) * pitch + time;
    float seg = 6.28318530718 / float(numArms);
    float folded = mod(spiralAngle, seg) - seg * 0.5;
    return exp(-folded * folded * 6.0);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    // === Slow whole-galaxy rotation (no scale pulse, no flicker) ===
    float rot = uTime * 0.55;

    // === Log-spiral arms — two interleaved sets for richer galaxy feel ===
    float armA = spiralArm(dist, angle, rot, 2.6, 2);
    float armB = spiralArm(dist, angle, rot + 1.05, 3.4, 3);
    // Arms are dense inside the disc, fade at edges
    float discInner = smoothstep(0.05, 0.18, dist);
    float discOuter = smoothstep(1.05, 0.20, dist);
    float arms = (armA * 0.75 + armB * 0.55) * discInner * discOuter;

    // === Bright white-hot core ===
    float core = exp(-dist * dist * 60.0) * 1.6;
    float coreHalo = exp(-dist * dist * 18.0) * 0.55;

    // === Subtle dark pupil (very thin) ===
    float pupil = smoothstep(0.040, 0.022, dist) * 0.6;

    // === Outer red halo (steady) ===
    float halo = smoothstep(0.95, 0.10, dist) * 0.32;
    float wideHalo = smoothstep(1.30, 0.40, dist) * 0.14;

    // === Faint background disc behind arms (so they aren't just floating lines) ===
    float diffuseDisc = smoothstep(1.05, 0.10, dist) * 0.18;

    // === Compose ===
    vec3 redHot   = vec3(1.0, 0.22, 0.28);
    vec3 redGlow  = vec3(1.0, 0.42, 0.46);
    vec3 redDeep  = vec3(0.82, 0.12, 0.18);
    vec3 whiteHot = vec3(1.0, 0.94, 0.94);

    vec3 col = vec3(0.0);
    col += diffuseDisc * redDeep;
    col += arms * mix(redHot, redGlow, 0.4);
    col += coreHalo * redGlow * 0.85;
    col += core * whiteHot;
    col += halo * redHot * 0.85;
    col += wideHalo * redGlow;

    // Dark pupil cuts a small hole at the center
    col *= (1.0 - pupil);

    float alpha = clamp(arms + diffuseDisc * 1.4 + core + coreHalo + halo + wideHalo, 0.0, 1.0);

    // Subtle mouse attraction — brightens the side near the cursor
    vec2 toMouse = uMouse - uv;
    float mouseBoost = 1.0 + 0.14 * smoothstep(1.6, 0.0, length(toMouse));
    col *= mouseBoost;
    col *= uFadeIn;
    alpha *= uFadeIn;

    gl_FragColor = vec4(col, alpha);
  }
`;

const VERTEX_POINTS_SHADER = /* glsl */ `
  attribute vec2 aSeed;       // (baseAngle, baseRadius)
  attribute vec2 aPhase;      // (startPhase, speed)
  attribute float aSize;
  uniform float uTime;
  uniform float uFadeIn;
  uniform vec2 uMouse;
  uniform float uDpr;
  varying float vAlpha;
  varying float vKind;

  void main() {
    // Continuous slow orbital motion — no burst / no fade cycle (pulse-free).
    float baseSpeed = aPhase.y * 0.32;
    float spin = aPhase.y > 0.7 ? -0.45 : 1.0;
    float angle = aSeed.x + uTime * baseSpeed * spin;
    // Steady radius with tiny per-particle wobble (different phase per particle,
    // so no synchronized pulse across the cloud).
    float r = aSeed.y * 0.78 + sin(aPhase.x * 6.28 + uTime * 0.4) * 0.018;

    vec2 pos = vec2(cos(angle), sin(angle)) * r;

    // Mouse attraction
    vec2 toMouse = uMouse - pos;
    float mDist = length(toMouse);
    float pull = 0.32 * smoothstep(1.6, 0.0, mDist) * smoothstep(0.0, 0.05, mDist);
    pos += toMouse * pull;

    // Per-particle constant brightness (varies between particles, steady per particle).
    vAlpha = 0.45 + 0.50 * fract(aPhase.x * 7.13);
    vKind = aPhase.y > 0.7 ? 1.0 : 0.0;

    gl_Position = vec4(pos, 0.0, 1.0);
    float baseSize = aSize * 0.85;
    gl_PointSize = baseSize * uDpr;
  }
`;

const FRAGMENT_POINTS_SHADER = /* glsl */ `
  precision highp float;
  uniform float uFadeIn;
  varying float vAlpha;
  varying float vKind;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    // soft circular gradient
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    // color: sparks are slightly whiter
    vec3 col = mix(vec3(1.0, 0.20, 0.26), vec3(1.0, 0.65, 0.65), vKind * 0.6);
    gl_FragColor = vec4(col, a * 0.95 * uFadeIn);
  }
`;

function buildParticleAttributes(THREE: typeof import("three")): BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const seed = new Float32Array(PARTICLE_COUNT * 2);
  const phase = new Float32Array(PARTICLE_COUNT * 2);
  const size = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    positions[i * 3 + 0] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;

    // baseAngle in 0..2π
    seed[i * 2 + 0] = Math.random() * Math.PI * 2;
    // baseRadius: most embers stay inside 0.85, ~20% are sparks reaching 1.4
    const isSpark = Math.random() < 0.2;
    seed[i * 2 + 1] = isSpark ? 1.05 + Math.random() * 0.45 : 0.55 + Math.random() * 0.40;

    phase[i * 2 + 0] = Math.random();
    phase[i * 2 + 1] = isSpark ? 0.72 + Math.random() * 0.25 : 0.35 + Math.random() * 0.30;

    size[i] = isSpark ? 3.0 + Math.random() * 2.5 : 1.6 + Math.random() * 1.6;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 2));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phase, 2));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  return geometry;
}

function detachTabPointer(inst: VortexInstance): void {
  if (!inst.tabEl) return;
  inst.tabEl.removeEventListener("pointermove", inst.mouseHandler as EventListener);
  inst.tabEl.removeEventListener("pointerleave", inst.leaveHandler);
  inst.tabEl = null;
}

function attachTabPointer(inst: VortexInstance, tab: HTMLElement): void {
  detachTabPointer(inst);
  inst.tabEl = tab;
  tab.addEventListener("pointermove", inst.mouseHandler as EventListener);
  tab.addEventListener("pointerleave", inst.leaveHandler);
}

function disposeInstance(inst: VortexInstance): void {
  if (inst.disposed) return;
  inst.disposed = true;
  if (inst.rafId != null) cancelAnimationFrame(inst.rafId);
  inst.resizeObserver.disconnect();
  detachTabPointer(inst);
  inst.quadMaterial.dispose();
  inst.pointsMaterial.dispose();
  inst.particleGeometry.dispose();
  (inst.quad.geometry as BufferGeometry).dispose();
  inst.renderer.dispose();
  inst.canvas.remove();
}

function purgeStaleHosts(nav: HTMLElement, keep: HTMLElement): void {
  nav.querySelectorAll<HTMLElement>(`.${HOST_CLASS}`).forEach((host) => {
    if (host === keep) return;
    const stale = instances.get(host);
    if (stale) disposeInstance(stale);
    instances.delete(host);
    host.remove();
  });
}

function relocateVortex(inst: VortexInstance, tab: HTMLElement): void {
  const icWrap = tab.querySelector<HTMLElement>(":scope > .tab-ic-wrap");
  if (!icWrap) return;
  detachTabPointer(inst);
  if (!inst.host.contains(inst.canvas)) {
    inst.host.appendChild(inst.canvas);
  }
  icWrap.insertBefore(inst.host, icWrap.firstChild);
  attachTabPointer(inst, tab);
  inst.host.classList.add(HOST_READY_CLASS);
}

function ensureHost(tab: HTMLElement): HTMLElement {
  if (!tab.querySelector(":scope > .tab-label")) {
    const labelText = (tab.textContent ?? "").trim();
    if (labelText) {
      tab.textContent = "";
      const label = document.createElement("span");
      label.className = "tab-label";
      label.textContent = labelText;
      tab.appendChild(label);
    }
  }
  const icWrap = tab.querySelector<HTMLElement>(":scope > .tab-ic-wrap");
  let host = tab.querySelector<HTMLElement>(`:scope .${HOST_CLASS}`);
  if (!host) {
    host = document.createElement("span");
    host.className = HOST_CLASS;
    host.setAttribute("aria-hidden", "true");
    if (icWrap) {
      icWrap.insertBefore(host, icWrap.firstChild);
    } else {
      const anchor = tab.querySelector(":scope > .topbar-tab-fx, :scope > .tab-label");
      if (anchor) anchor.before(host);
      else tab.prepend(host);
    }
  } else if (icWrap && host.parentElement !== icWrap) {
    icWrap.insertBefore(host, icWrap.firstChild);
  }
  return host;
}

function buildVortexInstance(THREE: typeof import("three"), tab: HTMLElement): VortexInstance | null {
  const host = ensureHost(tab);
  host.classList.remove(HOST_READY_CLASS);

  let canvasParent: HTMLDivElement | null = null;
  try {
    if (!document.body.contains(tab)) {
      host.remove();
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "width:100%;height:100%;display:block;background:transparent;";
    canvasParent = document.createElement("div");
    canvasParent.style.cssText =
      `position:fixed;left:-9999px;top:0;width:${VORTEX_W}px;height:${VORTEX_H}px;opacity:0;pointer-events:none;`;
    canvasParent.appendChild(canvas);
    document.body.appendChild(canvasParent);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const quadGeometry = new THREE.PlaneGeometry(2, 2);
    const quadMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uFadeIn: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: VERTEX_QUAD_SHADER,
      fragmentShader: FRAGMENT_QUAD_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(quadGeometry, quadMaterial);
    scene.add(quad);

    const particleGeometry = buildParticleAttributes(THREE);
    const pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uFadeIn: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uDpr: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: VERTEX_POINTS_SHADER,
      fragmentShader: FRAGMENT_POINTS_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(particleGeometry, pointsMaterial);
    scene.add(points);

    const clock = new THREE.Clock();
    const targetMouse = { x: 0, y: 0 };
    const smoothedMouse = { x: 0, y: 0 };

    const resizeRenderer = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(VORTEX_W, VORTEX_H, false);
      pointsMaterial.uniforms.uDpr.value = dpr;
    };

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(host);

    const mouseHandler = (event: PointerEvent): void => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.x = Math.max(-1.5, Math.min(1.5, x));
      targetMouse.y = Math.max(-1.5, Math.min(1.5, y));
    };
    const leaveHandler = (): void => {
      targetMouse.x = 0;
      targetMouse.y = 0;
    };

    const inst: VortexInstance = {
      host,
      canvas,
      renderer,
      scene,
      camera,
      quad,
      points,
      quadMaterial,
      pointsMaterial,
      particleGeometry,
      clock,
      rafId: null,
      resizeObserver,
      mouseHandler: mouseHandler as (e: PointerEvent) => void,
      leaveHandler,
      targetMouse,
      smoothedMouse,
      tabEl: null,
      disposed: false,
    };

    const renderFrame = (): void => {
      const t = inst.clock.getElapsedTime();
      inst.quadMaterial.uniforms.uTime.value = t;
      const fadeIn = Math.min(1, t / 0.28);
      inst.quadMaterial.uniforms.uFadeIn.value = fadeIn;
      inst.pointsMaterial.uniforms.uFadeIn.value = fadeIn;
      inst.pointsMaterial.uniforms.uTime.value = t;
      inst.smoothedMouse.x += (inst.targetMouse.x - inst.smoothedMouse.x) * 0.08;
      inst.smoothedMouse.y += (inst.targetMouse.y - inst.smoothedMouse.y) * 0.08;
      inst.quadMaterial.uniforms.uMouse.value.set(inst.smoothedMouse.x, inst.smoothedMouse.y);
      inst.pointsMaterial.uniforms.uMouse.value.set(inst.smoothedMouse.x, inst.smoothedMouse.y);
      inst.renderer.render(inst.scene, inst.camera);
    };

    resizeRenderer();
    renderFrame();

    canvasParent.remove();
    canvasParent = null;
    host.appendChild(canvas);

    relocateVortex(inst, tab);
    resizeRenderer();
    renderFrame();

    const animate = (): void => {
      if (inst.disposed) return;
      renderFrame();
      inst.rafId = requestAnimationFrame(animate);
    };
    inst.rafId = requestAnimationFrame(animate);

    instances.set(host, inst);
    return inst;
  } catch (err) {
    canvasParent?.remove();
    host.remove();
    if (import.meta.env.DEV) console.warn("[topbar-vortex]", err);
    return null;
  }
}

async function mountVortexOnActive(nav: HTMLElement): Promise<void> {
  const gen = ++mountGeneration;

  if (prefersReducedMotion()) return;

  const active = nav.querySelector<HTMLElement>(VORTEX_ACTIVE_SELECTOR);
  if (!active) {
    const existing = navVortex.get(nav);
    if (existing && !existing.disposed) {
      existing.host.classList.remove(HOST_READY_CLASS);
    }
    return;
  }

  let THREE: typeof import("three");
  try {
    THREE = await getThree();
  } catch {
    return;
  }

  if (gen !== mountGeneration) return;
  if (!active.classList.contains("active")) return;

  const existing = navVortex.get(nav);
  if (existing && !existing.disposed) {
    relocateVortex(existing, active);
    purgeStaleHosts(nav, existing.host);
    lastVortexTab.set(nav, active);
    return;
  }

  const inst = buildVortexInstance(THREE, active);
  if (!inst || gen !== mountGeneration) {
    inst?.host.remove();
    return;
  }

  navVortex.set(nav, inst);
  purgeStaleHosts(nav, inst.host);
  lastVortexTab.set(nav, active);
}

function observeNav(nav: HTMLElement): void {
  let scheduled = false;
  /* 用 microtask 取代 rAF：点击同步 toggle class 后立刻 drain，
   * 把旋涡迁移合并到同一帧，避免「点击 → 一帧空白 → 旋涡跳过去」的视觉滞后。 */
  const schedule = (): void => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      const active = nav.querySelector<HTMLElement>(VORTEX_ACTIVE_SELECTOR);
      const prev = lastVortexTab.get(nav) ?? null;
      if (active === prev) return;
      lastVortexTab.set(nav, active);
      void mountVortexOnActive(nav);
    });
  };
  /* 只 observe nav 一次，subtree + attributeFilter 比 4 个独立 observer 更便宜 */
  const observer = new MutationObserver((records) => {
    for (let i = 0; i < records.length; i += 1) {
      const rec = records[i];
      if (rec.type === "attributes" && rec.attributeName === "class") {
        schedule();
        return;
      }
    }
  });
  observer.observe(nav, {
    attributes: true,
    attributeFilter: ["class"],
    subtree: true,
  });
}

function wrapAllTabLabels(nav: HTMLElement): void {
  nav.querySelectorAll<HTMLElement>(TAB_SELECTOR).forEach((tab) => {
    if (tab.querySelector(":scope > .tab-label")) return;
    const text = (tab.textContent ?? "").trim();
    if (!text) return;
    tab.textContent = "";
    const span = document.createElement("span");
    span.className = "tab-label";
    span.textContent = text;
    tab.appendChild(span);
  });
}

function bootTopbarVortex(): void {
  if (!document.body?.classList.contains("has-altc")) return;
  const nav = document.querySelector<HTMLElement>(NAV_SELECTOR);
  if (!nav) return;
  if (!initedNavs.has(nav)) {
    wrapAllTabLabels(nav);
    observeNav(nav);
    initedNavs.add(nav);
    lastVortexTab.set(nav, null);
  }

  void mountVortexOnActive(nav);
}

/** Astro 会把组件 <script> 提升到 head，须在 DOM 就绪后再挂载。 */
export function initTopbarVortexWebGL(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootTopbarVortex, { once: true });
    return;
  }
  bootTopbarVortex();
}

/* 尽早拉取 three，缩短刷新后「空白 → 银河」间隔 */
if (typeof window !== "undefined" && !prefersReducedMotion()) {
  void getThree();
}
