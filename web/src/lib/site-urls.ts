/**
 * Build absolute URLs for sitemap / canonical (SSG).
 */
import { COUNTRY_ORDER, REGIONS } from "./countries";
import { LANGS } from "./i18n";
import { localePath, regionGalleryHref } from "./locale-path";
import { POSTERS } from "./posters";
import { ZINES } from "./load-content";
import { getStreetScenes } from "./streets";
import type { CountryId } from "./types";

export interface SitemapEntry {
  loc: string;
  priority: number;
  changefreq: "weekly" | "monthly";
}

function abs(siteOrigin: string, path: string): string {
  const base = siteOrigin.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** All locale variants of core routes for sitemap.xml. */
export function collectSitemapEntries(siteOrigin: string): SitemapEntry[] {
  const out: SitemapEntry[] = [];

  for (const lang of LANGS) {
    out.push({ loc: abs(siteOrigin, localePath(lang, "/")), priority: 1, changefreq: "weekly" });

    for (const cid of COUNTRY_ORDER) {
      const country = cid as CountryId;
      out.push({
        loc: abs(siteOrigin, localePath(lang, `/${cid}`)),
        priority: 0.9,
        changefreq: "weekly",
      });

      for (const region of REGIONS[country]) {
        const galleryLoc = regionGalleryHref(lang, cid, region.id);
        const detailBase = `/${cid}/${region.id}`;
        out.push({
          loc: abs(siteOrigin, galleryLoc),
          priority: 0.85,
          changefreq: "weekly",
        });

        for (const p of POSTERS[country][region.id] ?? []) {
          out.push({
            loc: abs(siteOrigin, localePath(lang, `${detailBase}/poster/${p.slug}`)),
            priority: 0.7,
            changefreq: "monthly",
          });
        }

        for (const z of ZINES[country][region.id] ?? []) {
          out.push({
            loc: abs(siteOrigin, localePath(lang, `${detailBase}/zine/${z.slug}`)),
            priority: 0.65,
            changefreq: "monthly",
          });
        }

        for (const scene of getStreetScenes(country, region.id)) {
          out.push({
            loc: abs(siteOrigin, localePath(lang, `${detailBase}/street/${scene.id}`)),
            priority: 0.6,
            changefreq: "monthly",
          });
        }
      }
    }
  }

  return out;
}

export function absoluteUrl(siteOrigin: string, path: string): string {
  return abs(siteOrigin, path);
}

export function pageCanonical(url: URL, site: URL | string | undefined): string {
  const origin = site ? String(site).replace(/\/$/, "") : url.origin;
  return `${origin}${url.pathname}`;
}

export function resolveOgImage(
  site: URL | string | undefined,
  assetPath: string | null | undefined,
): string | undefined {
  if (!assetPath || !site) return undefined;
  try {
    return new URL(assetPath, String(site)).href;
  } catch {
    return undefined;
  }
}
