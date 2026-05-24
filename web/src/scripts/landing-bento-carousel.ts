/** Home · bento tile image carousel (prev/next + dots) */

function findTileRoot(carousel: HTMLElement): HTMLElement | null {
  return carousel.closest<HTMLElement>("a.tile, .tile.is-link, a.tile");
}

function findCopyTargets(tile: HTMLElement): {
  title?: HTMLElement;
  sub?: HTMLElement;
} {
  const title =
    tile.querySelector<HTMLElement>(
      ".bento-dish-copy .n-zh, .bento-zine-copy .n-zh, .bento-street-title, .bento-tea-copy .nm-zh",
    ) ?? undefined;
  const sub =
    tile.querySelector<HTMLElement>(".bento-tea-copy .sub, .bento-street-eat") ?? undefined;
  return { title, sub };
}

function setActiveSlide(carousel: HTMLElement, index: number): void {
  const slides = [...carousel.querySelectorAll<HTMLElement>(".bento-carousel__slide")];
  if (!slides.length) return;
  const i = ((index % slides.length) + slides.length) % slides.length;
  const slide = slides[i];
  if (!slide) return;

  slides.forEach((el, idx) => {
    const on = idx === i;
    el.classList.toggle("is-active", on);
    if (on) el.removeAttribute("hidden");
    else el.setAttribute("hidden", "");
  });

  carousel.querySelectorAll<HTMLElement>("[data-bento-dot]").forEach((dot) => {
    const di = Number(dot.getAttribute("data-bento-dot"));
    dot.classList.toggle("is-active", di === i);
  });

  const tile = findTileRoot(carousel);
  if (!tile) return;

  const href = slide.getAttribute("data-href");
  if (
    href &&
    tile instanceof HTMLAnchorElement &&
    !tile.classList.contains("bento-dish--proto") &&
    !tile.classList.contains("bento-zine--proto")
  ) {
    tile.href = href;
  }

  const title = slide.getAttribute("data-title");
  const sub = slide.getAttribute("data-sub");
  const targets = findCopyTargets(tile);
  if (targets.title && title) targets.title.textContent = title;
  if (targets.sub && sub !== null) {
    if (targets.sub.classList.contains("bento-street-eat")) {
      /* street eat line stays static */
    } else if (sub) {
      targets.sub.textContent = sub;
    }
  }

  carousel.dataset.activeIndex = String(i);
}

function initCarousel(carousel: HTMLElement): void {
  if (carousel.dataset.bentoCarouselInit === "true") return;
  carousel.dataset.bentoCarouselInit = "true";

  const slides = carousel.querySelectorAll(".bento-carousel__slide");
  if (slides.length < 2) return;

  let index = Number(carousel.dataset.activeIndex ?? "0") || 0;

  const go = (delta: number) => {
    index = index + delta;
    setActiveSlide(carousel, index);
  };

  carousel.querySelector("[data-bento-prev]")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    go(-1);
  });

  carousel.querySelector("[data-bento-next]")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    go(1);
  });

  carousel.querySelectorAll<HTMLElement>("[data-bento-dot]").forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const di = Number(dot.getAttribute("data-bento-dot"));
      if (!Number.isNaN(di)) {
        index = di;
        setActiveSlide(carousel, index);
      }
    });
  });

  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      go(1);
    }
  });

  setActiveSlide(carousel, index);
}

export function initLandingBentoCarousels(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-landing-bento-carousel]").forEach(initCarousel);
}

if (typeof document !== "undefined") {
  initLandingBentoCarousels();
}
