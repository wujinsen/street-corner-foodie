/**
 * v0.6 · Glass tile cursor highlight + subtle tilt (alt-c).
 * Respects prefers-reduced-motion and prefers-reduced-transparency.
 */

export function initGlassTileShine(scope: ParentNode = document): void {
  if (typeof window === "undefined") return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reducedTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
  if (reducedTransparency) return;

  const tiles = scope.querySelectorAll<HTMLElement>(
    ".tile.is-link, .tile.tile-shine, .glass-poster.is-link, .country-region-card.is-link",
  );
  for (const tile of tiles) {
    if (tile.dataset.shineBound === "1") continue;
    tile.dataset.shineBound = "1";

    tile.addEventListener(
      "pointermove",
      (e) => {
        const r = tile.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        tile.style.setProperty("--shine-x", `${x}%`);
        tile.style.setProperty("--shine-y", `${y}%`);

        if (!reducedMotion) {
          const tiltX = ((y - 50) / 50) * -2.5;
          const tiltY = ((x - 50) / 50) * 2.5;
          tile.style.setProperty("--tilt-x", `${tiltX}deg`);
          tile.style.setProperty("--tilt-y", `${tiltY}deg`);
        }
      },
      { passive: true },
    );

    tile.addEventListener("pointerleave", () => {
      tile.style.removeProperty("--tilt-x");
      tile.style.removeProperty("--tilt-y");
    });
  }
}

if (typeof document !== "undefined") {
  const run = () => initGlassTileShine(document);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
}
