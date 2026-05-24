/** Street explorer · bottom eat-here carousel (对齐书柜 glass-zine-card) */

import type { StreetExplorerEatCard } from "../lib/street-explorer-payload";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function eatCardMarkup(card: StreetExplorerEatCard): string {
  const thumb = card.thumbUrl
    ? `<img src="${escapeHtml(card.thumbUrl)}" alt="${escapeHtml(card.name)}" loading="lazy" decoding="async" />`
    : `<span class="street-eat-card__ph" aria-hidden="true">📖</span>`;
  return `<a class="street-eat-card tile sm" href="${escapeHtml(card.href)}">
  <div class="street-eat-card__photo">${thumb}</div>
  <span class="street-eat-card__cap"><strong class="h-serif-dish">${escapeHtml(card.name)}</strong></span>
</a>`;
}

function cardsInTrack(track: HTMLElement): HTMLElement[] {
  return [...track.querySelectorAll<HTMLElement>(".street-eat-card")];
}

function firstVisibleCardIndex(track: HTMLElement, cards: HTMLElement[]): number {
  const left = track.getBoundingClientRect().left + 4;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].getBoundingClientRect().right > left + 2) return i;
  }
  return 0;
}

function scrollToCard(track: HTMLElement, index: number): void {
  const cards = cardsInTrack(track);
  const card = cards[Math.max(0, Math.min(cards.length - 1, index))];
  if (!card) return;
  card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
}

/** 同步轨道布局，避免首屏偏左再居中。 */
export function syncStreetEatTrackLayout(_shell: HTMLElement, track: HTMLElement): void {
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  const canScroll = maxScroll > 2;
  track.classList.toggle("street-eat-carousel__track--fit", !canScroll);
  track.classList.toggle("street-eat-carousel__track--scroll", canScroll);
  if (!canScroll) track.scrollLeft = 0;
}

function updateNavButtons(shell: HTMLElement, track: HTMLElement): void {
  const prev = shell.querySelector<HTMLButtonElement>("[data-street-eat-prev]");
  const next = shell.querySelector<HTMLButtonElement>("[data-street-eat-next]");
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  const sl = track.scrollLeft;
  const canScroll = maxScroll > 2;
  syncStreetEatTrackLayout(shell, track);
  if (prev) {
    prev.disabled = !canScroll || sl <= 2;
    prev.setAttribute("aria-disabled", prev.disabled ? "true" : "false");
  }
  if (next) {
    next.disabled = !canScroll || sl >= maxScroll - 2;
    next.setAttribute("aria-disabled", next.disabled ? "true" : "false");
  }
}

export function refreshStreetEatCarousels(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-street-eat-carousel][data-eat-carousel-init='true']").forEach((shell) => {
    const track = shell.querySelector<HTMLElement>("[data-street-eat-track]");
    if (track) updateNavButtons(shell, track);
  });
}

export function initStreetEatCarousel(shell: HTMLElement): void {
  if (shell.dataset.eatCarouselInit === "true") return;
  shell.dataset.eatCarouselInit = "true";

  const track = shell.querySelector<HTMLElement>("[data-street-eat-track]");
  const prev = shell.querySelector<HTMLButtonElement>("[data-street-eat-prev]");
  const next = shell.querySelector<HTMLButtonElement>("[data-street-eat-next]");
  if (!track) return;

  const onPrev = (e: Event): void => {
    e.stopPropagation();
    const cards = cardsInTrack(track);
    const i = firstVisibleCardIndex(track, cards);
    scrollToCard(track, Math.max(0, i - 1));
  };

  const onNext = (e: Event): void => {
    e.stopPropagation();
    const cards = cardsInTrack(track);
    const i = firstVisibleCardIndex(track, cards);
    scrollToCard(track, Math.min(cards.length - 1, i + 1));
  };

  prev?.addEventListener("click", onPrev);
  next?.addEventListener("click", onNext);

  track.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev(e);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext(e);
      }
    },
    { passive: false },
  );

  track.addEventListener("scroll", () => updateNavButtons(shell, track), { passive: true });
  window.addEventListener("resize", () => updateNavButtons(shell, track), { passive: true });
  updateNavButtons(shell, track);
  requestAnimationFrame(() => updateNavButtons(shell, track));
  track.querySelectorAll("img").forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", () => updateNavButtons(shell, track), { once: true });
    }
  });
}

export function syncStreetEatTrack(root: HTMLElement, cards: StreetExplorerEatCard[]): void {
  const track = root.querySelector<HTMLElement>("[data-street-eat-track]");
  const shell = root.querySelector<HTMLElement>("[data-street-eat-carousel]");
  if (!track) return;

  track.innerHTML = cards.map((c) => eatCardMarkup(c)).join("");
  track.scrollLeft = 0;

  if (shell) {
    initStreetEatCarousel(shell);
    updateNavButtons(shell, track);
    requestAnimationFrame(() => updateNavButtons(shell, track));
  }
}
