/**
 * CDN prefix for `/asserts/` and `/scf-img/` in production (R2 custom domain).
 * Unset locally → same-origin paths under `public/`.
 */
export function getPublicAssetOrigin(): string {
  const raw = import.meta.env.PUBLIC_ASSET_ORIGIN;
  if (typeof raw !== "string" || !raw.trim()) return "";
  return raw.trim().replace(/\/$/, "");
}

/** Absolute or site-relative URL for browser requests. */
export function publicAssetUrl(path: string): string {
  if (!path) return path;
  if (
    path.startsWith("data:") ||
    path.startsWith("blob:") ||
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const origin = getPublicAssetOrigin();
  return origin ? `${origin}${normalized}` : normalized;
}

/** Manifest lookup key — always `/asserts/…` or `/scf-img/…`, never CDN origin. */
export function publicAssetKey(path: string): string {
  if (!path) return path;
  const origin = getPublicAssetOrigin();
  if (origin && path.startsWith(origin)) {
    const rest = path.slice(origin.length);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return path.startsWith("/") ? path : `/${path}`;
}
