/** Hash → gallery tab (shared; keep free of street/map imports to avoid circular deps). */

export type GalleryTab = "posters" | "zines" | "streets";

export function galleryTabFromHash(hash: string): GalleryTab {
  const h = hash.replace("#", "");
  if (h === "zines" || h === "streets") return h;
  return "posters";
}

/** Legacy `#map` on country gallery → `/world-atlas`. */
export function redirectLegacyMapHash(): void {
  const h = (location.hash || "").replace("#", "");
  if (h !== "map") return;
  const path = location.pathname;
  let target = "/world-atlas";
  if (path.startsWith("/en/") || path === "/en") target = "/en/world-atlas";
  else if (path.startsWith("/ja/") || path === "/ja") target = "/ja/world-atlas";
  location.replace(target + location.search);
}
