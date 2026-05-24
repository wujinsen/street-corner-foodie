/**
 * Sci-fi map · land dot matrix for ECharts geo scatter (~5k points).
 * Run: npm run map:particles
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";
import { geoContains, geoGraticule } from "d3-geo";
import countries110 from "world-atlas/countries-110m.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PARTICLES = join(__dirname, "../public/geo/land-particles.json");
const OUT_GRATICULE = join(__dirname, "../public/geo/map-graticule.json");

const TARGET = 5200;
const SKIP = new Set(["010"]); // Antarctica

const land = feature(
  countries110,
  countries110.objects.countries,
).features.filter((f) => !SKIP.has(String(f.id)));

const particles = [];
let attempts = 0;
const maxAttempts = TARGET * 40;

while (particles.length < TARGET && attempts < maxAttempts) {
  attempts += 1;
  const lng = -175 + Math.random() * 350;
  const lat = -55 + Math.random() * 110;
  if (land.some((f) => geoContains(f, [lng, lat]))) {
    particles.push([
      Math.round(lng * 100) / 100,
      Math.round(lat * 100) / 100,
    ]);
  }
}

const graticule = geoGraticule().step([30, 30]);
const graticuleLines = graticule.lines().map((line) => ({
  coords: line.coordinates,
}));

writeFileSync(OUT_PARTICLES, JSON.stringify(particles));
writeFileSync(OUT_GRATICULE, JSON.stringify(graticuleLines));
console.log(
  `[map:particles] ${particles.length} land dots → ${OUT_PARTICLES}`,
);
console.log(
  `[map:particles] ${graticuleLines.length} graticule lines → ${OUT_GRATICULE}`,
);
