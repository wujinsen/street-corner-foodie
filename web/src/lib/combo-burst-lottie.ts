/**
 * 连击 / 狂戳 · Lottie 爆炸卡片控制器
 *
 * 用法：在可点击区域（温度数字等）上 initComboBurstLottie()，
 * 每次 pointerdown 调用 controller.handleTap()。
 *
 * 核心能力：
 * - clickCount：滑动时间窗内统计连击
 * - 超过阈值 → 显示 Lottie overlay 并从第 0 帧播放
 * - 动画未结束时再次狂戳 → goToAndPlay(0) 立即叠加重播
 * - complete → 淡出隐藏并重置计数
 * - 每次点击：卡片 + 数字 scale(0.95) 弹性反馈（不阻塞后续点击）
 */

import type { AnimationItem } from "lottie-web";
import lottie from "lottie-web";

/** 默认 Lottie JSON（可通过 options.animationPath 覆盖） */
const DEFAULT_BURST_JSON = "/lottie/temp-burst.json";

/** 连击判定：480ms 内连续点击 ≥ 3 次（第 3 下触发） */
const DEFAULT_COMBO_WINDOW_MS = 480;
/** 达到此次数即触发（含第 3 下） */
const DEFAULT_COMBO_MIN_CLICKS = 3;

/** 淡出时长（ms） */
const FADE_OUT_MS = 280;

export interface ComboBurstLottieOptions {
  /** 主点击热区（通常是温度数字外包层） */
  hitEl: HTMLElement;
  /** 参与缩放反馈的数字节点 */
  digitEl: HTMLElement;
  /** 可选：整张卡片，用于轻微整体缩放 */
  cardEl?: HTMLElement | null;
  /** Lottie 挂载容器（叠在数字正上方） */
  lottieHost: HTMLElement;
  /** 动画 JSON 路径 */
  animationPath?: string;
  /** 连击时间窗（ms） */
  comboWindowMs?: number;
  /** 触发所需最少点击次数（默认 3，即第 3 下触发） */
  comboMinClicks?: number;
  /** 狂戳成功瞬间回调（可在此加 backdrop / 主题 class） */
  onBurst?: () => void;
  /** 单次 Lottie 播放完毕且淡出结束后回调 */
  onBurstComplete?: () => void;
  /** 主题修饰：heat | sand | neutral（影响 overlay 色调） */
  theme?: "heat" | "sand" | "neutral";
}

export interface ComboBurstLottieController {
  /** 每次 pointerdown / Enter / Space 时调用 */
  handleTap(): boolean;
  /** 强制从第 0 帧重播（外部也可直接调） */
  triggerBurst(): void;
  /** 重置计数与动画状态 */
  reset(): void;
  destroy(): void;
}

interface InternalState {
  clickTimes: number[];
  lastTapAt: number;
  anim: AnimationItem | null;
  animReady: boolean;
  isVisible: boolean;
  isPlaying: boolean;
  fadeTimer: ReturnType<typeof setTimeout> | null;
  completeHandler: (() => void) | null;
  pendingBurst: boolean;
}

function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

/** 狂戳成功 · 短促三连震（规格要求 [40, 30, 40]） */
function vibeComboBurst(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([40, 30, 40]);
  } catch {
    /* ignore */
  }
}

/**
 * 防死锁弹性缩放：用 CSS animation + 强制 reflow 重启，
 * 不设置 pointer-events:none，不 await 动画结束才接受下一次点击。
 */
function pokeScaleFeedback(
  hitEl: HTMLElement,
  digitEl: HTMLElement,
  cardEl: HTMLElement | null | undefined,
  interTapMs: number,
): void {
  const fast = interTapMs > 0 && interTapMs < 120;
  const dur = fast ? "0.14s" : "0.22s";
  const targets = [hitEl, digitEl, ...(cardEl ? [cardEl] : [])];

  for (const el of targets) {
    el.style.setProperty("--combo-poke-dur", dur);
    el.classList.remove("combo-burst--tap-pulse");
    // 强制重排以重启同名 animation（避免连续点击时 animation 不触发）
    void el.offsetWidth;
    el.classList.add("combo-burst--tap-pulse");
  }
}

function showOverlay(host: HTMLElement): void {
  host.classList.remove("combo-burst-lottie--fade-out");
  host.classList.add("combo-burst-lottie--visible");
  host.setAttribute("aria-hidden", "false");
}

function hideOverlay(host: HTMLElement): void {
  host.classList.remove("combo-burst-lottie--visible");
  host.classList.add("combo-burst-lottie--fade-out");
  host.setAttribute("aria-hidden", "true");
}

/**
 * 初始化 Lottie 连击爆炸控制器
 */
export function initComboBurstLottie(options: ComboBurstLottieOptions): ComboBurstLottieController {
  const {
    hitEl,
    digitEl,
    cardEl,
    lottieHost,
    animationPath = DEFAULT_BURST_JSON,
    comboWindowMs = DEFAULT_COMBO_WINDOW_MS,
    comboMinClicks = DEFAULT_COMBO_MIN_CLICKS,
    onBurst,
    onBurstComplete,
    theme = "neutral",
  } = options;

  lottieHost.classList.add("combo-burst-lottie");
  lottieHost.dataset.comboBurstTheme = theme;
  lottieHost.setAttribute("aria-hidden", "true");

  const state: InternalState = {
    clickTimes: [],
    lastTapAt: 0,
    anim: null,
    animReady: false,
    isVisible: false,
    isPlaying: false,
    fadeTimer: null,
    completeHandler: null,
    pendingBurst: false,
  };

  /** 预加载 Lottie：autoplay false · loop false */
  state.anim = lottie.loadAnimation({
    container: lottieHost,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: animationPath,
  });

  state.anim.addEventListener("DOMLoaded", () => {
    state.animReady = true;
    if (state.pendingBurst) triggerBurst();
  });

  const clearFadeTimer = (): void => {
    if (state.fadeTimer) {
      clearTimeout(state.fadeTimer);
      state.fadeTimer = null;
    }
  };

  const resetClickCount = (): void => {
    state.clickTimes = [];
  };

  const onAnimComplete = (): void => {
    state.isPlaying = false;
    hideOverlay(lottieHost);
    resetClickCount();
    clearFadeTimer();
    state.fadeTimer = setTimeout(() => {
      lottieHost.classList.remove("combo-burst-lottie--fade-out");
      state.fadeTimer = null;
      onBurstComplete?.();
    }, FADE_OUT_MS);
  };

  state.completeHandler = onAnimComplete;
  state.anim.addEventListener("complete", onAnimComplete);

  const triggerBurst = (): void => {
    if (!state.anim) return;
    if (!state.animReady) {
      state.pendingBurst = true;
      return;
    }
    state.pendingBurst = false;

    clearFadeTimer();
    lottieHost.classList.remove("combo-burst-lottie--fade-out");

    // 瞬间显示 overlay
    if (!state.isVisible) {
      showOverlay(lottieHost);
      state.isVisible = true;
    }

    vibeComboBurst();
    onBurst?.();

    // 高级叠加：无论是否在播，一律从第 0 帧强行重播
    state.isPlaying = true;
    state.anim.goToAndStop(0, true);
    state.anim.goToAndPlay(0, true);
  };

  const recordCombo = (): boolean => {
    const now = performance.now();
    const interTap = state.lastTapAt ? now - state.lastTapAt : 0;
    state.lastTapAt = now;

    pokeScaleFeedback(hitEl, digitEl, cardEl, interTap);

    state.clickTimes.push(now);
    state.clickTimes = state.clickTimes.filter((t) => now - t <= comboWindowMs);

    // 第 3 下（含）即触发狂戳
    if (state.clickTimes.length >= comboMinClicks) {
      return true;
    }
    return false;
  };

  const handleTap = (): boolean => {
    const combo = recordCombo();
    if (combo) {
      // 触发后清空，避免同一次连击窗口内重复计数；重播靠动画播放期间的新点击
      state.clickTimes = [];
      triggerBurst();
      return true;
    }

    // 动画播放中继续戳：即使未达连击阈值，也允许叠加重播（解压爽感）
    if (state.isPlaying) {
      triggerBurst();
      return true;
    }

    return false;
  };

  const reset = (): void => {
    resetClickCount();
    state.lastTapAt = 0;
    state.isPlaying = false;
    state.isVisible = false;
    clearFadeTimer();
    hideOverlay(lottieHost);
    lottieHost.classList.remove("combo-burst-lottie--fade-out");
    state.anim?.stop();
  };

  const destroy = (): void => {
    reset();
    if (state.completeHandler && state.anim) {
      state.anim.removeEventListener("complete", state.completeHandler);
    }
    state.anim?.destroy();
    state.anim = null;
    state.animReady = false;
    hitEl.classList.remove("combo-burst--tap-pulse");
    digitEl.classList.remove("combo-burst--tap-pulse");
    cardEl?.classList.remove("combo-burst--tap-pulse");
  };

  return { handleTap, triggerBurst, reset, destroy };
}
