import type { WeatherPeriod, WeatherSky } from "./weather-chip";

type StarDensity = "full" | "dusk" | "sparse";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: number;
  warm: boolean;
  glow: boolean;
}

interface Meteor {
  x: number;
  y: number;
  len: number;
  angle: number;
  progress: number;
  speed: number;
  tailLen: number;
}

interface StarsInstance {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  stars: Star[];
  width: number;
  height: number;
  dpr: number;
  density: StarDensity;
  rafId: number;
  startTs: number;
  visible: boolean;
  resizeObserver: ResizeObserver;
  intersectionObserver: IntersectionObserver;
  meteors: Meteor[];
  nextShowerAt: number;
  showerUntil: number;
  showerAngle: number;
  showerMeteorsLeft: number;
  lastMeteorSpawn: number;
  showerUiActive: boolean;
  chip: HTMLElement;
}

const instances = new WeakMap<HTMLElement, StarsInstance>();

/** Meteor shower cadence (seconds). */
const SHOWER_FIRST_S = [6, 12] as const;
const SHOWER_INTERVAL_S = [26, 36] as const;
const SHOWER_BURST_S = [3.4, 5.2] as const;
const SHOWER_COUNT = [12, 18] as const;

/** Seconds until first / next meteor shower after canvas boot. */
function scheduleNextShower(fromElapsed = 0, first = false): number {
  const [lo, hi] = first ? SHOWER_FIRST_S : SHOWER_INTERVAL_S;
  return fromElapsed + rand(lo, hi);
}

function resetMeteorState(instance: StarsInstance, elapsed = 0): void {
  instance.meteors = [];
  instance.nextShowerAt = scheduleNextShower(elapsed, elapsed <= 0);
  instance.showerUntil = 0;
  instance.showerAngle = rand(Math.PI * 0.18, Math.PI * 0.32);
  instance.showerMeteorsLeft = 0;
  instance.lastMeteorSpawn = 0;
  instance.showerUiActive = false;
  delete instance.chip.dataset.weatherMeteorShower;
}

function meteorScale(width: number, height: number): number {
  return Math.max(0.85, Math.min(1.35, Math.min(width, height) / 220));
}

function spawnMeteor(width: number, height: number, angle: number, scale = 1): Meteor {
  const s = scale * meteorScale(width, height);
  return {
    x: rand(width * -0.12, width * 0.95),
    y: rand(height * 0.01, height * 0.52),
    len: rand(36, 82) * s,
    angle: angle + rand(-0.06, 0.06),
    progress: 0,
    speed: rand(0.038, 0.058),
    tailLen: rand(28, 56) * s,
  };
}

function drawMeteor(ctx: CanvasRenderingContext2D, meteor: Meteor): void {
  const headX = meteor.x + Math.cos(meteor.angle) * meteor.len * meteor.progress;
  const headY = meteor.y + Math.sin(meteor.angle) * meteor.len * meteor.progress;
  const tailX = headX - Math.cos(meteor.angle) * meteor.tailLen;
  const tailY = headY - Math.sin(meteor.angle) * meteor.tailLen;
  const fade = 1 - meteor.progress * 0.35;

  const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
  grad.addColorStop(0, "rgba(255, 255, 255, 0)");
  grad.addColorStop(0.35, `rgba(190, 215, 255, ${0.55 * fade})`);
  grad.addColorStop(0.72, `rgba(240, 248, 255, ${0.92 * fade})`);
  grad.addColorStop(1, `rgba(255, 255, 255, ${1 * fade})`);
  ctx.strokeStyle = grad;
  ctx.lineWidth = meteor.tailLen > 38 ? 1.65 : 1.25;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(headX, headY);
  ctx.stroke();

  ctx.fillStyle = `rgba(255, 255, 255, ${0.96 * fade})`;
  ctx.beginPath();
  ctx.arc(headX, headY, meteor.tailLen > 38 ? 1.45 : 1.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(200, 225, 255, ${0.35 * fade})`;
  ctx.beginPath();
  ctx.arc(headX, headY, meteor.tailLen > 38 ? 3.2 : 2.6, 0, Math.PI * 2);
  ctx.fill();
}

function syncMeteorShowerUi(instance: StarsInstance, elapsed: number): void {
  const active = elapsed < instance.showerUntil;
  if (active === instance.showerUiActive) return;
  instance.showerUiActive = active;
  if (active) {
    instance.chip.dataset.weatherMeteorShower = "active";
  } else {
    delete instance.chip.dataset.weatherMeteorShower;
  }
}

function updateMeteors(instance: StarsInstance, elapsed: number): void {
  const { width, height } = instance;
  if (width < 1 || height < 1) return;

  if (elapsed >= instance.nextShowerAt && elapsed >= instance.showerUntil) {
    instance.showerUntil = elapsed + rand(SHOWER_BURST_S[0], SHOWER_BURST_S[1]);
    instance.showerAngle = rand(Math.PI * 0.16, Math.PI * 0.34);
    instance.showerMeteorsLeft = Math.round(rand(SHOWER_COUNT[0], SHOWER_COUNT[1]));
    instance.lastMeteorSpawn = elapsed - rand(0.15, 0.45);
    instance.nextShowerAt = scheduleNextShower(elapsed);
  }

  if (elapsed < instance.showerUntil && instance.showerMeteorsLeft > 0) {
    const gap = elapsed - instance.lastMeteorSpawn;
    if (gap > rand(0.1, 0.28)) {
      instance.meteors.push(spawnMeteor(width, height, instance.showerAngle, rand(0.95, 1.18)));
      instance.showerMeteorsLeft -= 1;
      instance.lastMeteorSpawn = elapsed;
    }
  }

  for (const meteor of instance.meteors) {
    meteor.progress = Math.min(1, meteor.progress + meteor.speed);
  }
  instance.meteors = instance.meteors.filter((m) => m.progress < 1);
  syncMeteorShowerUi(instance, elapsed);
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Weather chip default bg · always full starfield (period/sky kept for call-site compat). */
export function starfieldDensity(_period: WeatherPeriod, _sky: WeatherSky): StarDensity {
  return "full";
}

function densityFactor(density: StarDensity): number {
  if (density === "full") return 1;
  if (density === "dusk") return 0.72;
  return 0.48;
}

function targetStarCount(width: number, height: number, density: StarDensity): number {
  const area = width * height;
  const base = Math.round(area * 0.0042 * densityFactor(density));
  return Math.max(density === "sparse" ? 28 : 48, Math.min(base, density === "full" ? 200 : 120));
}

function seedStars(width: number, height: number, density: StarDensity): Star[] {
  const total = targetStarCount(width, height, density);
  const stars: Star[] = [];
  for (let i = 0; i < total; i += 1) {
    const roll = Math.random();
    const radius = roll < 0.58 ? rand(0.35, 0.7) : roll < 0.88 ? rand(0.75, 1.1) : rand(1.15, 1.85);
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius,
      baseOpacity: rand(0.32, 0.96) * densityFactor(density),
      twinkleSpeed: rand(0.8, 3.2),
      twinklePhase: Math.random() * Math.PI * 2,
      hue: rand(200, 252),
      warm: Math.random() < 0.14,
      glow: radius > 1.05 && Math.random() < 0.28,
    });
  }
  return stars;
}

function starColor(star: Star, opacity: number): string {
  if (star.warm) return `rgba(255, 244, 220, ${opacity})`;
  return `rgba(${Math.round(star.hue)}, ${Math.round(star.hue + 10)}, 255, ${opacity})`;
}

function drawSkyBase(ctx: CanvasRenderingContext2D, width: number, height: number, density: StarDensity, elapsed: number): void {
  if (density === "dusk") {
    const grad = ctx.createLinearGradient(0, height, 0, 0);
    grad.addColorStop(0, "#2a1838");
    grad.addColorStop(0.22, "#221838");
    grad.addColorStop(0.48, "#141830");
    grad.addColorStop(0.72, "#0c1224");
    grad.addColorStop(1, "#060810");
    ctx.fillStyle = grad;
  } else if (density === "sparse") {
    const grad = ctx.createLinearGradient(0, 0, width * 0.25, height);
    grad.addColorStop(0, "#070b16");
    grad.addColorStop(0.45, "#0e1428");
    grad.addColorStop(1, "#141c30");
    ctx.fillStyle = grad;
  } else {
    const grad = ctx.createLinearGradient(0, 0, width * 0.35, height);
    grad.addColorStop(0, "#080c18");
    grad.addColorStop(0.35, "#101830");
    grad.addColorStop(0.68, "#0c1228");
    grad.addColorStop(1, "#050810");
    ctx.fillStyle = grad;
  }
  ctx.fillRect(0, 0, width, height);

  const pulse = 0.82 + 0.18 * Math.sin(elapsed * 0.12);
  const nebula = ctx.createRadialGradient(width * 0.68, height * 0.32, 0, width * 0.68, height * 0.32, width * 0.52);
  nebula.addColorStop(0, `rgba(90, 70, 150, ${0.14 * pulse})`);
  nebula.addColorStop(0.45, `rgba(50, 60, 120, ${0.08 * pulse})`);
  nebula.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width * 0.42, height * 0.38);
  ctx.rotate(-0.42);
  const band = ctx.createLinearGradient(-width, 0, width, 0);
  band.addColorStop(0, "rgba(255, 255, 255, 0)");
  band.addColorStop(0.32, `rgba(190, 210, 255, ${0.05 * pulse})`);
  band.addColorStop(0.5, `rgba(230, 240, 255, ${density === "sparse" ? 0.04 : 0.1})`);
  band.addColorStop(0.68, `rgba(190, 210, 255, ${0.05 * pulse})`);
  band.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = band;
  ctx.fillRect(-width, -height * 0.12, width * 2, height * 0.24);
  ctx.restore();

  if (density === "dusk") {
    const horizon = ctx.createLinearGradient(0, height * 0.55, 0, height);
    horizon.addColorStop(0, "rgba(255, 160, 100, 0)");
    horizon.addColorStop(0.55, "rgba(200, 100, 80, 0.12)");
    horizon.addColorStop(1, "rgba(120, 60, 90, 0.22)");
    ctx.fillStyle = horizon;
    ctx.fillRect(0, height * 0.55, width, height * 0.45);
  }

  if (density === "sparse") {
    ctx.fillStyle = "rgba(140, 160, 190, 0.12)";
    ctx.fillRect(0, 0, width, height);
  }
}

function drawFrame(instance: StarsInstance, elapsed: number, staticStars = false): void {
  const { ctx, stars, width, height, density } = instance;
  drawSkyBase(ctx, width, height, density, staticStars ? 0.6 : elapsed);

  for (const star of stars) {
    const twinkle = staticStars
      ? 1
      : 0.38 + 0.62 * Math.sin(elapsed * star.twinkleSpeed + star.twinklePhase);
    const opacity = Math.min(1, star.baseOpacity * twinkle);

    ctx.fillStyle = starColor(star, opacity);
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    if (star.glow) {
      ctx.fillStyle = `rgba(220, 235, 255, ${opacity * 0.24})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.38})`;
      ctx.lineWidth = 0.45;
      const spike = star.radius * 3;
      ctx.beginPath();
      ctx.moveTo(star.x - spike, star.y);
      ctx.lineTo(star.x + spike, star.y);
      ctx.moveTo(star.x, star.y - spike);
      ctx.lineTo(star.x, star.y + spike);
      ctx.stroke();
    }
  }

  if (!staticStars) {
    updateMeteors(instance, elapsed);
    for (const meteor of instance.meteors) {
      drawMeteor(ctx, meteor);
    }
  }
}

function drawStatic(instance: StarsInstance): void {
  drawFrame(instance, 0, true);
}

function tick(instance: StarsInstance, ts: number): void {
  if (!instance.visible) {
    instance.rafId = 0;
    return;
  }
  if (!instance.startTs) instance.startTs = ts;
  const elapsed = (ts - instance.startTs) / 1000;
  drawFrame(instance, elapsed, false);
  instance.rafId = requestAnimationFrame((nextTs) => tick(instance, nextTs));
}

function startLoop(instance: StarsInstance, reduced: boolean): void {
  stopLoop(instance);
  if (reduced) {
    drawStatic(instance);
    return;
  }
  instance.rafId = requestAnimationFrame((ts) => tick(instance, ts));
}

function stopLoop(instance: StarsInstance): void {
  if (instance.rafId) {
    cancelAnimationFrame(instance.rafId);
    instance.rafId = 0;
  }
  instance.startTs = 0;
}

function resizeCanvas(instance: StarsInstance, cssWidth: number, cssHeight: number): void {
  const prevW = instance.width;
  const prevH = instance.height;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  instance.dpr = dpr;
  instance.width = cssWidth;
  instance.height = cssHeight;
  instance.canvas.width = Math.max(1, Math.round(cssWidth * dpr));
  instance.canvas.height = Math.max(1, Math.round(cssHeight * dpr));
  instance.canvas.style.width = `${cssWidth}px`;
  instance.canvas.style.height = `${cssHeight}px`;
  instance.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const widthStable = prevW >= 1 && Math.abs(cssWidth - prevW) < 2;
  const hasStars = instance.stars.length > 0;

  if (hasStars && widthStable && prevH >= 1 && Math.abs(cssHeight - prevH) > 0.5) {
    if (cssHeight > prevH) {
      const ratio = cssHeight / prevH;
      for (const star of instance.stars) star.y *= ratio;
      const band = seedStars(cssWidth, cssHeight - prevH, instance.density);
      for (const star of band) {
        star.y += prevH;
        instance.stars.push(star);
      }
    } else {
      const ratio = cssHeight / prevH;
      for (const star of instance.stars) star.y *= ratio;
      instance.stars = instance.stars.filter((star) => star.y <= cssHeight + 2);
    }
    return;
  }

  if (prevW < 1 || prevH < 1 || !widthStable) {
    instance.stars = seedStars(cssWidth, cssHeight, instance.density);
    resetMeteorState(instance);
    instance.startTs = 0;
  }
}

function setStarsActive(chip: HTMLElement, active: boolean): void {
  if (active) {
    chip.dataset.weatherStars = "active";
  } else {
    delete chip.dataset.weatherStars;
  }
}

function destroyInstance(chip: HTMLElement): void {
  const instance = instances.get(chip);
  if (!instance) return;
  stopLoop(instance);
  instance.resizeObserver.disconnect();
  instance.intersectionObserver.disconnect();
  instance.canvas.remove();
  instances.delete(chip);
  setStarsActive(chip, false);
  delete chip.dataset.weatherStarsReady;
  delete chip.dataset.weatherMeteorShower;
}

function ensureCanvas(chip: HTMLElement, density: StarDensity): StarsInstance | null {
  const host = chip.querySelector<HTMLElement>(".bento-weather-bg");
  if (!host) return null;

  let instance = instances.get(chip);
  if (!instance) {
    const canvas = document.createElement("canvas");
    canvas.className = "bento-weather-stars";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    instance = {
      chip,
      canvas,
      ctx,
      stars: [],
      width: 0,
      height: 0,
      dpr: 1,
      density,
      rafId: 0,
      startTs: 0,
      visible: true,
      resizeObserver: new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const { width, height } = entry.contentRect;
        if (width < 1 || height < 1) return;
        resizeCanvas(instance!, width, height);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (instance!.visible) startLoop(instance!, reduced);
      }),
      intersectionObserver: new IntersectionObserver(
        (entries) => {
          const visible = entries.some((e) => e.isIntersecting);
          instance!.visible = visible;
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (visible) startLoop(instance!, reduced);
          else stopLoop(instance!);
        },
        { threshold: 0.05 },
      ),
      meteors: [],
      nextShowerAt: scheduleNextShower(0, true),
      showerUntil: 0,
      showerAngle: rand(Math.PI * 0.18, Math.PI * 0.32),
      showerMeteorsLeft: 0,
      lastMeteorSpawn: 0,
      showerUiActive: false,
    };

    instance.resizeObserver.observe(host);
    instance.intersectionObserver.observe(chip);
    instances.set(chip, instance);
  }

  if (instance.density !== density) {
    instance.density = density;
    if (instance.width > 0 && instance.height > 0) {
      instance.stars = seedStars(instance.width, instance.height, density);
    }
  }

  setStarsActive(chip, true);
  drawStatic(instance);
  chip.dataset.weatherStarsReady = "true";
  return instance;
}

/** Full starfield canvas background (always on when period/sky are set). */
export function syncWeatherStarsCanvas(chip: HTMLElement): void {
  const period = chip.dataset.weatherPeriod as WeatherPeriod | undefined;
  const sky = chip.dataset.weatherSky as WeatherSky | undefined;
  if (!period || !sky) {
    destroyInstance(chip);
    return;
  }

  const density = starfieldDensity(period, sky);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const instance = ensureCanvas(chip, density);
  if (!instance) return;

  const host = chip.querySelector<HTMLElement>(".bento-weather-bg");
  if (host) {
    const rect = host.getBoundingClientRect();
    if (rect.width >= 1 && rect.height >= 1) {
      resizeCanvas(instance, rect.width, rect.height);
    }
  }

  startLoop(instance, reduced);
  if (instance.width > 0 && instance.height > 0) {
    chip.dataset.weatherStarsReady = "true";
  }
}

function bootStarsWhenReady(chip: HTMLElement, attempt = 0): void {
  syncWeatherStarsCanvas(chip);
  const host = chip.querySelector<HTMLElement>(".bento-weather-bg");
  const ready = host && host.getBoundingClientRect().width >= 1;
  if (!ready && attempt < 12) {
    requestAnimationFrame(() => bootStarsWhenReady(chip, attempt + 1));
  }
}

/** Retry layout until the chip has dimensions (avoids 0×0 canvas on first paint). */
export function bootWeatherStarsCanvas(chip: HTMLElement): void {
  bootStarsWhenReady(chip);
}
