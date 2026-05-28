/**
 * Weather chip · ambient loops (MP3 via HTMLAudioElement).
 * rain / storm → Saltwater Moon · dawn / dusk / golden / night → Velvet Currents
 *
 * playFromGesture() must run synchronously inside click/pointerdown — async fetch
 * after gesture ends will be blocked by the browser.
 */

import type { WeatherClimate, WeatherPeriod, WeatherSky } from "./weather-chip";

export type WeatherAmbientScene = "rain" | "night_calm";

export const WEATHER_AMBIENT_TRACKS: Record<WeatherAmbientScene, string> = {
  rain: "/audio/saltwater-moon.mp3",
  night_calm: "/audio/velvet-currents.mp3",
};

/** @deprecated use WEATHER_AMBIENT_TRACKS.night_calm */
export const WEATHER_AMBIENT_TRACK = WEATHER_AMBIENT_TRACKS.night_calm;

const MASTER_PEAK = 0.78;
const FADE_IN_SEC = 2.6;
const FADE_OUT_SEC = 1.1;

export interface WeatherAmbientInput {
  tempC: number;
  period: WeatherPeriod;
  sky: WeatherSky;
  climate: WeatherClimate;
}

export function inferWeatherAmbientScene(input: WeatherAmbientInput): WeatherAmbientScene | null {
  if (input.sky === "rain" || input.sky === "storm") return "rain";
  /* Default starfield card · always calm night loop except rain/storm. */
  return "night_calm";
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

class WeatherAmbientEngine {
  private audio: HTMLAudioElement | null = null;
  private scene: WeatherAmbientScene | null = null;
  private playing = false;
  /** Bumped on stop — ignores in-flight play() callbacks after collapse. */
  private playGeneration = 0;
  private fadeRaf = 0;
  private stopTimer: ReturnType<typeof setTimeout> | null = null;

  private ensureAudio(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.preload = "auto";
    }
    return this.audio;
  }

  private cancelFade(): void {
    if (this.fadeRaf) {
      cancelAnimationFrame(this.fadeRaf);
      this.fadeRaf = 0;
    }
  }

  private fadeVolume(from: number, to: number, durationSec: number, onDone?: () => void): void {
    const audio = this.audio;
    if (!audio) return;
    this.cancelFade();
    const start = performance.now();
    const span = Math.max(durationSec, 0.01) * 1000;

    const step = (now: number): void => {
      const t = Math.min(1, (now - start) / span);
      const eased = 1 - (1 - t) ** 3;
      audio.volume = from + (to - from) * eased;
      if (t < 1) {
        this.fadeRaf = requestAnimationFrame(step);
      } else {
        this.fadeRaf = 0;
        onDone?.();
      }
    };

    this.fadeRaf = requestAnimationFrame(step);
  }

  /** Unlock autoplay during user gesture (pointerdown on weather chip / toggle). */
  primeGesture(): void {
    if (prefersReducedMotion()) return;
    const audio = this.ensureAudio();
    if (this.playing && !audio.paused) return;
    if (!audio.src) audio.src = WEATHER_AMBIENT_TRACKS.night_calm;
    audio.muted = true;
    audio.volume = 0;
    void audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      })
      .catch(() => {
        audio.muted = false;
      });
  }

  /** Start loop — call synchronously from click/tap handler. */
  playFromGesture(scene: WeatherAmbientScene): boolean {
    if (prefersReducedMotion()) return false;

    const audio = this.ensureAudio();
    const src = WEATHER_AMBIENT_TRACKS[scene];
    const generation = ++this.playGeneration;

    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    this.cancelFade();

    if (this.playing && this.scene === scene && !audio.paused) {
      this.fadeVolume(audio.volume, MASTER_PEAK, FADE_IN_SEC);
      return true;
    }

    audio.muted = false;
    audio.loop = true;
    audio.volume = 0;
    if (!audio.src.endsWith(src)) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = src;
    }

    let started = false;
    try {
      const ret = audio.play();
      started = true;
      void ret
        ?.then(() => {
          if (generation !== this.playGeneration) {
            audio.pause();
            audio.currentTime = 0;
            return;
          }
          this.scene = scene;
          this.playing = true;
          this.fadeVolume(0, MASTER_PEAK, FADE_IN_SEC);
        })
        .catch(() => {
          if (generation === this.playGeneration) this.playing = false;
        });
    } catch {
      return false;
    }

    return started;
  }

  isPlaying(): boolean {
    const audio = this.audio;
    return !!audio && !audio.paused && (this.playing || audio.volume > 0.02);
  }

  currentScene(): WeatherAmbientScene | null {
    return this.scene;
  }

  async play(scene: WeatherAmbientScene): Promise<boolean> {
    return this.playFromGesture(scene);
  }

  async stop(): Promise<void> {
    this.playGeneration += 1;

    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    this.cancelFade();

    const audio = this.audio;
    this.playing = false;
    this.scene = null;

    if (!audio) return;

    const from = audio.volume;
    const finish = (): void => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
    };

    if (audio.paused && from <= 0.001) {
      finish();
      return;
    }

    if (from <= 0.001) {
      finish();
      return;
    }

    await new Promise<void>((resolve) => {
      this.fadeVolume(from, 0, FADE_OUT_SEC, () => {
        finish();
        resolve();
      });
    });
  }
}

let sharedEngine: WeatherAmbientEngine | null = null;

export function getWeatherAmbientEngine(): WeatherAmbientEngine {
  if (!sharedEngine) sharedEngine = new WeatherAmbientEngine();
  return sharedEngine;
}

export function primeWeatherAmbientGesture(): void {
  getWeatherAmbientEngine().primeGesture();
}

/** Sync play from user click — returns whether play() was invoked. */
export function playWeatherAmbientFromGesture(scene: WeatherAmbientScene): boolean {
  return getWeatherAmbientEngine().playFromGesture(scene);
}

export async function playWeatherAmbient(scene: WeatherAmbientScene): Promise<boolean> {
  return getWeatherAmbientEngine().play(scene);
}

export async function stopWeatherAmbient(): Promise<void> {
  await getWeatherAmbientEngine().stop();
}

export function isWeatherAmbientPlaying(): boolean {
  return getWeatherAmbientEngine().isPlaying();
}
