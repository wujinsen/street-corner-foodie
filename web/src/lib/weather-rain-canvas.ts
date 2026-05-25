import type { WeatherSky } from "./weather-chip";

const RAIN_SKIES = new Set<WeatherSky>(["rain", "storm"]);

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  width: number;
  wind: number;
}

interface RainLayer {
  countRatio: number;
  speedMin: number;
  speedMax: number;
  lengthMin: number;
  lengthMax: number;
  opacityMin: number;
  opacityMax: number;
  widthMin: number;
  widthMax: number;
}

const LAYERS: RainLayer[] = [
  {
    countRatio: 0.32,
    speedMin: 280,
    speedMax: 420,
    lengthMin: 6,
    lengthMax: 11,
    opacityMin: 0.12,
    opacityMax: 0.28,
    widthMin: 0.45,
    widthMax: 0.65,
  },
  {
    countRatio: 0.38,
    speedMin: 420,
    speedMax: 620,
    lengthMin: 10,
    lengthMax: 16,
    opacityMin: 0.22,
    opacityMax: 0.42,
    widthMin: 0.55,
    widthMax: 0.85,
  },
  {
    countRatio: 0.3,
    speedMin: 620,
    speedMax: 920,
    lengthMin: 14,
    lengthMax: 24,
    opacityMin: 0.35,
    opacityMax: 0.62,
    widthMin: 0.75,
    widthMax: 1.15,
  },
];

interface RainInstance {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  drops: RainDrop[];
  width: number;
  height: number;
  dpr: number;
  storm: boolean;
  rafId: number;
  lastTs: number;
  visible: boolean;
  resizeObserver: ResizeObserver;
  intersectionObserver: IntersectionObserver;
}

const instances = new WeakMap<HTMLElement, RainInstance>();

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickLayer(): RainLayer {
  const roll = Math.random();
  let acc = 0;
  for (const layer of LAYERS) {
    acc += layer.countRatio;
    if (roll <= acc) return layer;
  }
  return LAYERS[LAYERS.length - 1];
}

function createDrop(layer: RainLayer, width: number, height: number, y?: number): RainDrop {
  const wind = rand(2.2, 4.8);
  const length = rand(layer.lengthMin, layer.lengthMax);
  return {
    x: Math.random() * (width + 24) - 12,
    y: y ?? Math.random() * (height + length) - length,
    speed: rand(layer.speedMin, layer.speedMax),
    length,
    opacity: rand(layer.opacityMin, layer.opacityMax),
    width: rand(layer.widthMin, layer.widthMax),
    wind,
  };
}

function targetDropCount(width: number, height: number, storm: boolean): number {
  const area = width * height;
  const density = storm ? 0.0048 : 0.0032;
  return Math.max(36, Math.min(Math.round(area * density), storm ? 140 : 96));
}

function seedDrops(width: number, height: number, storm: boolean): RainDrop[] {
  const total = targetDropCount(width, height, storm);
  const drops: RainDrop[] = [];
  for (let i = 0; i < total; i += 1) {
    drops.push(createDrop(pickLayer(), width, height));
  }
  return drops;
}

function resetDrop(drop: RainDrop, width: number, height: number): void {
  const layer = pickLayer();
  const next = createDrop(layer, width, height, -rand(layer.lengthMin, layer.lengthMax + 8));
  Object.assign(drop, next);
  drop.x = Math.random() * (width + 24) - 12;
}

function drawFrame(instance: RainInstance, dt: number): void {
  const { ctx, drops, width, height, storm } = instance;
  ctx.clearRect(0, 0, width, height);

  const mist = ctx.createLinearGradient(0, height * 0.72, 0, height);
  mist.addColorStop(0, "rgba(180, 200, 230, 0)");
  mist.addColorStop(1, storm ? "rgba(140, 165, 200, 0.14)" : "rgba(160, 185, 220, 0.1)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, height * 0.72, width, height * 0.28);

  for (const drop of drops) {
    drop.y += drop.speed * dt;
    drop.x += drop.wind * dt * 28;

    if (drop.y - drop.length > height + 6 || drop.x > width + 20) {
      resetDrop(drop, width, height);
      continue;
    }

    const tailX = drop.x - drop.wind * drop.length * 0.14;
    const tailY = drop.y - drop.length;

    const grad = ctx.createLinearGradient(drop.x, drop.y, tailX, tailY);
    grad.addColorStop(0, `rgba(215, 230, 255, ${drop.opacity * 0.35})`);
    grad.addColorStop(0.35, `rgba(195, 215, 245, ${drop.opacity})`);
    grad.addColorStop(1, `rgba(170, 195, 230, 0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = drop.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(drop.x, drop.y);
    ctx.stroke();
  }

  if (storm && Math.random() < 0.018) {
    ctx.fillStyle = "rgba(210, 225, 255, 0.06)";
    ctx.fillRect(0, 0, width, height);
  }
}

function tick(instance: RainInstance, ts: number): void {
  if (!instance.visible) {
    instance.rafId = 0;
    return;
  }
  const dt = instance.lastTs ? Math.min(0.05, (ts - instance.lastTs) / 1000) : 0.016;
  instance.lastTs = ts;
  drawFrame(instance, dt);
  instance.rafId = requestAnimationFrame((next) => tick(instance, next));
}

function resizeCanvas(instance: RainInstance, cssWidth: number, cssHeight: number): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  instance.dpr = dpr;
  instance.width = cssWidth;
  instance.height = cssHeight;
  instance.canvas.width = Math.max(1, Math.round(cssWidth * dpr));
  instance.canvas.height = Math.max(1, Math.round(cssHeight * dpr));
  instance.canvas.style.width = `${cssWidth}px`;
  instance.canvas.style.height = `${cssHeight}px`;
  instance.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  instance.drops = seedDrops(cssWidth, cssHeight, instance.storm);
}

function startLoop(instance: RainInstance): void {
  if (instance.rafId) return;
  instance.lastTs = 0;
  instance.rafId = requestAnimationFrame((ts) => tick(instance, ts));
}

function stopLoop(instance: RainInstance): void {
  if (instance.rafId) {
    cancelAnimationFrame(instance.rafId);
    instance.rafId = 0;
  }
  instance.lastTs = 0;
}

function destroyInstance(chip: HTMLElement): void {
  const instance = instances.get(chip);
  if (!instance) return;
  stopLoop(instance);
  instance.resizeObserver.disconnect();
  instance.intersectionObserver.disconnect();
  instance.canvas.remove();
  instances.delete(chip);
}

function ensureCanvas(chip: HTMLElement, storm: boolean): RainInstance | null {
  const host = chip.querySelector<HTMLElement>(".bento-weather-fx--particles");
  if (!host) return null;

  let instance = instances.get(chip);
  if (!instance) {
    const canvas = document.createElement("canvas");
    canvas.className = "bento-weather-rain";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    instance = {
      canvas,
      ctx,
      drops: [],
      width: 0,
      height: 0,
      dpr: 1,
      storm,
      rafId: 0,
      lastTs: 0,
      visible: true,
      resizeObserver: new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const { width, height } = entry.contentRect;
        if (width < 1 || height < 1) return;
        resizeCanvas(instance!, width, height);
      }),
      intersectionObserver: new IntersectionObserver(
        (entries) => {
          const visible = entries.some((e) => e.isIntersecting);
          instance!.visible = visible;
          if (visible) startLoop(instance!);
          else stopLoop(instance!);
        },
        { threshold: 0.05 },
      ),
    };

    instance.resizeObserver.observe(host);
    instance.intersectionObserver.observe(chip);
    instances.set(chip, instance);
  }

  if (instance.storm !== storm) {
    instance.storm = storm;
    if (instance.width > 0 && instance.height > 0) {
      instance.drops = seedDrops(instance.width, instance.height, storm);
    }
  }

  return instance;
}

/** Start / stop canvas rain to match chip `data-weather-sky`. */
export function syncWeatherRainCanvas(chip: HTMLElement): void {
  const sky = chip.dataset.weatherSky as WeatherSky | undefined;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!sky || !RAIN_SKIES.has(sky) || reduced) {
    destroyInstance(chip);
    return;
  }

  const instance = ensureCanvas(chip, sky === "storm");
  if (!instance) return;

  const host = chip.querySelector<HTMLElement>(".bento-weather-fx--particles");
  if (host) {
    const rect = host.getBoundingClientRect();
    if (rect.width >= 1 && rect.height >= 1) {
      resizeCanvas(instance, rect.width, rect.height);
    }
  }

  if (instance.visible) startLoop(instance);
}
