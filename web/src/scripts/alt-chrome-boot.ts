import { initGlassTileShine } from "./glass-tile-shine";
import { initFilterPillTracks } from "./filter-pill-track";

if (document.body.classList.contains("has-altc")) {
  const bootChrome = () => {
    initGlassTileShine(document);
    initFilterPillTracks(document);
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(bootChrome, { timeout: 1500 });
  } else {
    setTimeout(bootChrome, 1);
  }
}
