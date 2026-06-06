import manifestData from "../../.scf-image-manifest.json";
import { publicAssetKey, publicAssetUrl } from "./public-asset-origin";

export interface ScfPictureData {
  fallback: string;
  avif?: string;
  webp?: string;
  sizes: string;
  /** Reader / detail `<picture sizes=…>`. */
  sizesDisplay?: string;
  /** Wide gallery hero / landing strip (full content width, not 50vw card slot). */
  sizesBanner?: string;
  /** mtime:size from optimize-images — cache-bust when asserts PNG changes */
  sig?: string;
}

type Manifest = Record<string, ScfPictureData>;

const MANIFEST = manifestData as Manifest;

/** data:/blob:/http(s): — must not be prefixed with `/` for site-relative lookup. */
export function isInlineOrAbsoluteUrl(src: string): boolean {
  return (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}

function sigQuery(sig: string | undefined): string {
  if (!sig) return "";
  return `?v=${encodeURIComponent(sig)}`;
}

function withSig(url: string, sig: string | undefined): string {
  if (!sig || !url) return url;
  return `${url}${sigQuery(sig)}`;
}

function withSigSrcset(srcset: string | undefined, sig: string | undefined): string | undefined {
  if (!srcset || !sig) return srcset;
  return srcset
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      const space = trimmed.lastIndexOf(" ");
      if (space <= 0) return trimmed;
      const url = trimmed.slice(0, space);
      const descriptor = trimmed.slice(space + 1);
      return `${withSig(url, sig)} ${descriptor}`;
    })
    .join(", ");
}

function withCdnSrcset(srcset: string | undefined, sig: string | undefined): string | undefined {
  const signed = withSigSrcset(srcset, sig);
  if (!signed) return signed;
  return signed
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      const space = trimmed.lastIndexOf(" ");
      if (space <= 0) return publicAssetUrl(trimmed);
      return `${publicAssetUrl(trimmed.slice(0, space))} ${trimmed.slice(space + 1)}`;
    })
    .join(", ");
}

function withCdnPicture(hit: ScfPictureData): ScfPictureData {
  const sig = hit.sig;
  return {
    ...hit,
    fallback: publicAssetUrl(withSig(hit.fallback, sig)),
    avif: withCdnSrcset(hit.avif, sig),
    webp: withCdnSrcset(hit.webp, sig),
  };
}

/** Resolve optimized <picture> sources for a public /asserts/… URL. */
export function getScfPicture(src: string | null | undefined): ScfPictureData | null {
  if (!src) return null;
  if (isInlineOrAbsoluteUrl(src)) {
    return { fallback: src, sizes: "100vw" };
  }
  const key = publicAssetKey(src);
  const hit = MANIFEST[key];
  if (hit) {
    return withCdnPicture(hit);
  }
  return { fallback: publicAssetUrl(key), sizes: "100vw" };
}

export function hasOptimizedVariants(src: string | null | undefined): boolean {
  const p = getScfPicture(src);
  return Boolean(p?.avif || p?.webp);
}

/** True when optimize-images has registered this `/asserts/…` PNG (file on disk at last build). */
export function scfSourceExists(src: string | null | undefined): boolean {
  if (!src || isInlineOrAbsoluteUrl(src)) return false;
  const key = src.startsWith("/") ? src : `/${src}`;
  return Object.prototype.hasOwnProperty.call(MANIFEST, key);
}

function largestFromSrcset(srcset: string | undefined): string | undefined {
  if (!srcset) return undefined;
  let bestUrl: string | undefined;
  let bestW = 0;
  for (const part of srcset.split(",")) {
    const trimmed = part.trim();
    const space = trimmed.lastIndexOf(" ");
    if (space <= 0) continue;
    const url = trimmed.slice(0, space);
    const desc = trimmed.slice(space + 1);
    const w = desc.endsWith("w") ? Number(desc.slice(0, -1)) : 0;
    if (w >= bestW) {
      bestW = w;
      bestUrl = url;
    }
  }
  return bestUrl;
}

/** Original `/asserts/…` PNG (download / archive). */
export function scfOriginalSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  if (isInlineOrAbsoluteUrl(src)) return src;
  return publicAssetUrl(publicAssetKey(src));
}

/** Largest AVIF/WebP derivative (~1280–1920w) for on-screen reading. */
export function scfLargestVariant(src: string | null | undefined): string | null {
  if (!src) return null;
  const pic = getScfPicture(src);
  if (!pic) return scfOriginalSrc(src);
  return (
    largestFromSrcset(pic.avif) ??
    largestFromSrcset(pic.webp) ??
    pic.fallback
  );
}

/** Largest WebP derivative for text-heavy display (posters). */
export function scfLargestWebpVariant(src: string | null | undefined): string | null {
  if (!src) return null;
  const pic = getScfPicture(src);
  if (!pic) return scfOriginalSrc(src);
  return largestFromSrcset(pic.webp) ?? pic.fallback;
}

/** `display` for viewport; `full` for download / zoom archive. */
export function scfSpreadUrls(src: string | null | undefined): {
  full: string | null;
  display: string | null;
} {
  const full = scfOriginalSrc(src);
  if (!full) return { full: null, display: null };
  const display = scfLargestVariant(src) ?? full;
  return { full, display };
}

/** Smallest WebP (list cards / prefetch). */
export function scfBestSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  const pic = getScfPicture(src);
  if (pic?.webp) {
    const first = pic.webp.split(",")[0]?.trim().split(/\s+/)[0];
    if (first) return first;
  }
  return pic?.fallback ?? src;
}

/** Reader / detail `<picture sizes=…>`. */
export const SCF_DISPLAY_SIZES = "(max-width: 960px) 100vw, 1280px";

/** Poster reader center column — 3-col grid minus sidebars (~480px). */
export const SCF_POSTER_READER_SIZES =
  "(max-width: 1024px) 100vw, min(1280px, calc(100vw - 480px))";

/** Country gallery `country-hero-scene` · wide shallow strip (loads 1280–1536w, not 720w card slot). */
export const SCF_BANNER_SIZES = "(max-width: 1280px) 100vw, 1280px";

/** Prefetch / LCP hint for gallery hero banners. */
export function scfBannerPrefetchSrc(src: string | null | undefined): string | null {
  return scfLargestVariant(src) ?? scfOriginalSrc(src);
}
