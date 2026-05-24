/**
 * Build static world map paths for WorldMapHero (Natural Earth 110m + d3-geo).
 * Run: npm run map:data
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { feature, merge } from "topojson-client";
import { geoGraticule, geoNaturalEarth1, geoPath } from "d3-geo";
import countries110 from "world-atlas/countries-110m.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/data/world-map.generated.json");

const WIDTH = 1000;
const HEIGHT = 500;
const PAD = 8;

const projection = geoNaturalEarth1().fitExtent(
  [
    [PAD, PAD],
    [WIDTH - PAD, HEIGHT - PAD],
  ],
  { type: "Sphere" },
);

const pathGen = geoPath(projection);
const countries = feature(countries110, countries110.objects.countries);

/** Antarctica — declutter landing tile */
const SKIP = new Set(["010"]);

const landGeoms = countries110.objects.countries.geometries.filter(
  (g) => !SKIP.has(String(g.id)),
);

const landSilhouette = pathGen(merge(countries110, landGeoms)) || "";

const landFeatures = countries.features.filter((f) => !SKIP.has(String(f.id)));

const landPaths = landFeatures
  .map((f) => ({ id: String(f.id), d: pathGen(f) || "" }))
  .filter((p) => p.d.length > 8);

function countryPath(iso) {
  const f = countries.features.find((x) => String(x.id) === iso);
  return f ? pathGen(f) || "" : "";
}

const graticule = geoGraticule().step([30, 30]);
const graticulePaths = graticule
  .lines()
  .map((line) => pathGen(line) || "")
  .filter((d) => d.length > 4);

const PIN_LON_LAT = {
  us: [-74.01, 40.71],
  cn: [110.35, 20.02],
  jp: [139.69, 35.68],
};

function pinPercent(lon, lat) {
  const pt = projection([lon, lat]);
  if (!pt) return { x: 50, y: 50 };
  return {
    x: Math.round((pt[0] / WIDTH) * 1000) / 10,
    y: Math.round((pt[1] / HEIGHT) * 1000) / 10,
  };
}

const topoLines = [];
for (let i = 0; i < 9; i++) {
  const y = 32 + i * 48;
  const wobble = (i % 3) * 5 - 5;
  topoLines.push(
    `M -30 ${y} C 200 ${y - 20 + wobble}, 450 ${y + 16 - wobble}, 700 ${y - 6} S 980 ${y + 12}, 1040 ${y}`,
  );
}

const pins = Object.fromEntries(
  Object.entries(PIN_LON_LAT).map(([id, [lon, lat]]) => [id, pinPercent(lon, lat)]),
);

const payload = {
  width: WIDTH,
  height: HEIGHT,
  landSilhouette,
  landPaths,
  graticulePaths,
  zones: {
    us: countryPath("840"),
    cn: countryPath("156"),
    jp: countryPath("392"),
  },
  topoLines,
  pins,
};

writeFileSync(OUT, JSON.stringify(payload));
console.log(`[build-world-map-data] silhouette ${landSilhouette.length} chars, ${landPaths.length} countries → ${OUT}`);
console.log(`[build-world-map-data] pins`, pins);
