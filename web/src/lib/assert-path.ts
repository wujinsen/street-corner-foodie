import { publicAssetUrl } from "./public-asset-origin";

/** Normalize assert-relative directory (trailing slash, no duplicate slashes). */
export function joinAssertRelDir(...parts: string[]): string {
  const segments = parts
    .filter((p) => p != null && String(p).length > 0)
    .flatMap((p) => String(p).replace(/\\/g, "/").split("/"))
    .filter((s) => s.length > 0 && s !== ".");
  return segments.length > 0 ? `${segments.join("/")}/` : "";
}

/** Build a public URL under a base prefix (e.g. `/asserts/mini-zine/`). */
export function assertPublicUrl(base: string, relDir: string, file: string): string {
  const rel = joinAssertRelDir(relDir) + file.replace(/^\//, "");
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return publicAssetUrl(prefix + encodeURI(rel));
}
