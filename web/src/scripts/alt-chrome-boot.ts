import { initGlassTileShine } from "./glass-tile-shine";
import { initFilterPillTracks } from "./filter-pill-track";
import { initFlavorRadarFx } from "./flavor-radar-fx";
import { initCountryPickers } from "./country-picker";
function bootAltChrome(): void {
  if (!document.body?.classList.contains("has-altc")) return;

  const bootChrome = () => {
    initCountryPickers(document);
    initGlassTileShine(document);
    initFilterPillTracks(document);
    initFlavorRadarFx(document);
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(bootChrome, { timeout: 1500 });
  } else {
    setTimeout(bootChrome, 1);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAltChrome);
} else {
  bootAltChrome();
}
