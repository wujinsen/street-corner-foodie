/** Visible landing bento mosaic scope (cn region sub-panel or country panel). */

export function getVisibleBentoScope(root: ParentNode = document): HTMLElement | null {
  const bentoRoot =
    root instanceof HTMLElement && root.matches("[data-landing-bento-root]")
      ? root
      : root.querySelector<HTMLElement>("[data-landing-bento-root]");
  if (!bentoRoot) return null;

  const countryPanel = bentoRoot.querySelector<HTMLElement>("[data-landing-bento-panel]:not([hidden])");
  if (!countryPanel) return null;

  if (countryPanel.dataset.country === "cn") {
    return (
      countryPanel.querySelector<HTMLElement>("[data-landing-bento-region-panel]:not([hidden])") ??
      countryPanel
    );
  }
  return countryPanel;
}
