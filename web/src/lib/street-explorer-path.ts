/** Path helpers for dedicated street routes — client-safe (no load-content). */

/** `/…/street/{sceneId}/` → sceneId */
export function parseStreetSceneIdFromPath(pathname: string): string | null {
  const parts = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const i = parts.indexOf("street");
  if (i < 0 || i >= parts.length - 1) return null;
  try {
    return decodeURIComponent(parts[i + 1]!);
  } catch {
    return parts[i + 1] ?? null;
  }
}

/** Replace scene segment on dedicated street pages */
export function replaceStreetSceneInPath(pathname: string, sceneId: string): string {
  const parts = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const i = parts.indexOf("street");
  if (i < 0 || i >= parts.length - 1) return pathname;
  parts[i + 1] = sceneId;
  return `/${parts.join("/")}/`;
}
