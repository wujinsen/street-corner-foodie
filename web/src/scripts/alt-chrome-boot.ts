import { initGlassTileShine } from "./glass-tile-shine";
import { initFilterPillTracks } from "./filter-pill-track";
import { initFlavorRadarFx } from "./flavor-radar-fx";

if (document.body.classList.contains("has-altc")) {
  const bootChrome = () => {
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
