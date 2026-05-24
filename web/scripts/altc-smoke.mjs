#!/usr/bin/env node
/**
 * v0.6 · alt-c regression smoke (no browser).
 * Run after `npm run build` in CI or locally: `node scripts/altc-smoke.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;

function fail(msg) {
  console.error(`[altc-smoke] FAIL: ${msg}`);
  failed += 1;
}

function ok(msg) {
  console.log(`[altc-smoke] OK: ${msg}`);
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

const altcViews = [
  "HomePage.astro",
  "CountryPage.astro",
  "RegionPage.astro",
  "PosterDetailPage.astro",
  "ZineReaderPage.astro",
  "StreetPage.astro",
];

for (const file of altcViews) {
  const rel = `src/views/${file}`;
  if (!exists(rel)) {
    fail(`missing ${rel}`);
    continue;
  }
  const src = read(rel);
  if (!/\baltc\b/.test(src)) fail(`${file} must pass altc to Base`);
  else ok(`${file} uses altc`);
}

const home = read("src/views/HomePage.astro");
if (!home.includes("WorldMapHero")) fail("HomePage must use WorldMapHero");
else ok("HomePage imports WorldMapHero");

if (!exists("src/components/WorldMapHero.astro")) fail("WorldMapHero.astro missing");
else ok("WorldMapHero.astro present");

if (!home.includes("data-landing-map")) fail("HomePage missing data-landing-map on landing-left");
else ok("HomePage landing-left interactive map");

if (!home.includes("LandingCityCard")) fail("HomePage missing LandingCityCard");
else ok("HomePage city showcase card");

if (!exists("src/scripts/glass-tile-shine.ts")) fail("glass-tile-shine.ts missing");
else ok("glass-tile-shine script present");

const css = read("src/styles/components.css");
for (const token of [
  "--tile-bg",
  "--country-glow-a",
  ".country-hero-ribbon",
  ".glass-poster-ribbon",
  "alt-c-refine.css",
]) {
  if (token.endsWith(".css")) {
    if (!exists("src/styles/alt-c-refine.css")) fail("missing alt-c-refine.css");
    else ok("alt-c-refine.css present");

const countryPage = read("src/views/CountryPage.astro");
if (!countryPage.includes("country-poster-grid")) {
  fail("CountryPage must include national poster grid (theme-cn)");
} else ok("CountryPage national poster grid");
if (!countryPage.includes('mode: "overview"') && !countryPage.includes("orderCountryPostersForGallery")) {
  fail("CountryPage overview must national interleave posters");
} else ok("CountryPage national mix");
if (!countryPage.includes("country-poster-layout--flat-8")) {
  fail("CountryPage region gallery must use flat 8-tile grid");
} else ok("CountryPage region flat 8");
    continue;
  }
  if (!css.includes(token)) fail(`components.css missing ${token}`);
  else ok(`token/class ${token}`);
}

const distIndex = path.join(root, "dist", "index.html");
if (exists(distIndex)) {
  const html = fs.readFileSync(distIndex, "utf8");
  if (!html.includes("map-hero") && !html.includes("data-landing-map")) {
    fail("dist/index.html missing map hero markers");
  } else {
    ok("built index.html contains map hero");
  }
} else {
  console.log("[altc-smoke] skip dist/ (run npm run build for full check)");
}

if (failed > 0) {
  process.exit(1);
}
console.log("[altc-smoke] all checks passed");
