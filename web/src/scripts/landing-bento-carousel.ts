/** Home · bento tile image carousel (prev/next + dots + adjacent preload) */

const preloadedUrls = new Set<string>();

function findTileRoot(carousel: HTMLElement): HTMLElement | null {
  return carousel.closest<HTMLElement>("a.tile, .tile.is-link, a.tile");
}

function bestImageUrl(img: HTMLImageElement): string {
  if (img.currentSrc) return img.currentSrc;
  const display = img.getAttribute("data-display-src");
  if (display) return display;
  const srcset = img.getAttribute("srcset");
  if (srcset) {
    const parts = srcset.split(",").map((part) => part.trim());
    const last = parts[parts.length - 1];
    const url = last?.split(/\s+/)[0];
    if (url) return url;
  }
  return img.src;
}

function preloadImageUrl(url: string): Promise<void> {
  if (!url || preloadedUrls.has(url)) return Promise.resolve();

  preloadedUrls.add(url);
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => {
      preloadedUrls.delete(url);
      resolve();
    };
    image.src = url;
  });
}

async function preloadSlide(slide: HTMLElement | undefined): Promise<void> {
  if (!slide || slide.dataset.preloaded === "1") return;

  const img = slide.querySelector<HTMLImageElement>("img");
  if (!img) return;

  const url = bestImageUrl(img);
  await preloadImageUrl(url);

  if (img.loading === "lazy") img.loading = "eager";
  if (!img.complete) {
    try {
      await img.decode();
    } catch {
      /* decode optional */
    }
  }

  slide.dataset.preloaded = "1";
}

function markSlideWarm(slide: HTMLElement): void {
  const img = slide.querySelector<HTMLImageElement>("img");
  if (!img || slide.dataset.preloaded === "1" || (img.complete && img.naturalWidth > 0)) {
    slide.classList.add("is-warmed");
    return;
  }

  slide.classList.remove("is-warmed");
  const warm = () => slide.classList.add("is-warmed");
  img.addEventListener("load", warm, { once: true });
  void img.decode?.().then(warm).catch(warm);
}

function preloadAdjacentSlides(
  slides: HTMLElement[],
  activeIndex: number,
): void {
  if (slides.length < 2) return;
  const next = slides[(activeIndex + 1) % slides.length];
  void preloadSlide(next);
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

function pulseCopyTitle(el: HTMLElement): void {
  el.classList.remove("bento-copy--swap");
  void el.offsetWidth;
  el.classList.add("bento-copy--swap");
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
    if (on) {
      el.removeAttribute("hidden");
      markSlideWarm(el);
    } else {
      el.setAttribute("hidden", "");
      el.classList.remove("is-warmed");
    }
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
  if (targets.title && title) {
    if (targets.title.textContent !== title) {
      targets.title.textContent = title;
      pulseCopyTitle(targets.title);
    }
  }
  if (targets.sub && sub !== null) {
    if (targets.sub.classList.contains("bento-street-eat")) {
      /* street eat line stays static */
    } else if (sub) {
      targets.sub.textContent = sub;
    }
  }

  carousel.dataset.activeIndex = String(i);
  preloadAdjacentSlides(slides, i);
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

/* 初始化由 landing-bento-sync.ts 在面板可见性就绪后统一调用。 */
