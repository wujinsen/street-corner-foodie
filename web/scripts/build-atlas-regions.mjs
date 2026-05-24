// @ts-check
/**
 * Build a slim atlas-regions.json from Natural Earth admin_1.
 *
 * Source: ne_50m_admin_1_states_provinces (~2.3 MB) — public domain.
 * Output: web/public/geo/atlas-regions.json with ONLY the 11 features
 * we currently use for the World Atlas (CN provinces, JP prefectures,
 * US states). Each feature gets a stable `regionKey` property matching
 * `${countryId}__${regionId}` so `world-atlas-echarts.ts` can look it up.
 *
 * Run:   node web/scripts/build-atlas-regions.mjs
 * Re-run whenever a new region is added to STREET_REGIONS or REGION_GEO.
 */

import { writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// 10m has finer detail and INCLUDES all 47 Japanese prefectures (50m only has a
// handful of "main island" features). Larger payload (~39 MB) is fine because
// we trim it down to ~11 features in the output.
const SOURCE_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");
const OUT = resolve(ROOT, "public/geo/atlas-regions.json");

/** @type {Array<{ regionKey: string; adm0: string; names: string[] }>} */
const TARGETS = [
  { regionKey: "cn__hainan", adm0: "CHN", names: ["Hainan"] },
  { regionKey: "cn__hebei", adm0: "CHN", names: ["Hebei"] },
  { regionKey: "cn__beijing", adm0: "CHN", names: ["Beijing", "Beijing Shi"] },
  { regionKey: "cn__zhejiang", adm0: "CHN", names: ["Zhejiang"] },
  { regionKey: "cn__shaanxi", adm0: "CHN", names: ["Shaanxi", "Shanxi"] },
  { regionKey: "jp__tokyo", adm0: "JPN", names: ["Tōkyō", "Tokyo"] },
  { regionKey: "jp__fuji", adm0: "JPN", names: ["Yamanashi"] },
  { regionKey: "us__ny", adm0: "USA", names: ["New York"] },
  { regionKey: "us__la", adm0: "USA", names: ["California"] },
  { regionKey: "us__tx", adm0: "USA", names: ["Texas"] },
  { regionKey: "us__nola", adm0: "USA", names: ["Louisiana"] },
];

const norm = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

console.log(`fetch ${SOURCE_URL}`);
const r = await fetch(SOURCE_URL);
if (!r.ok) {
  console.error(`failed: ${r.status} ${r.statusText}`);
  process.exit(1);
}
const all = /** @type {{ features: Array<{ properties: Record<string, unknown>; geometry: unknown }> }} */ (
  await r.json()
);
console.log(`loaded ${all.features.length} features`);

const matched = [];
const missed = [];

for (const t of TARGETS) {
  const f = all.features.find((feat) => {
    const p = feat.properties;
    const adm0 = String(p.adm0_a3 ?? "").toUpperCase();
    if (adm0 !== t.adm0) return false;
    const pool = [p.name, p.name_en, p.name_alt, p.gn_name, p.gns_name, p.woe_name]
      .filter(Boolean)
      .map((x) => norm(String(x)));
    return t.names.some((n) => pool.includes(norm(n)));
  });
  if (!f) {
    missed.push(t.regionKey);
    continue;
  }
  matched.push({ regionKey: t.regionKey, feature: f });
  console.log(`  + ${t.regionKey.padEnd(14)} ← ${String(f.properties.name)}`);
}

if (missed.length) {
  // Print all CN/JP/US names so we can adjust the matcher.
  const blob = new Map();
  for (const f of all.features) {
    const adm0 = String(f.properties.adm0_a3 ?? "").toUpperCase();
    if (!["CHN", "JPN", "USA"].includes(adm0)) continue;
    const list = blob.get(adm0) ?? [];
    list.push(String(f.properties.name));
    blob.set(adm0, list);
  }
  console.error(`missing: ${missed.join(", ")}`);
  for (const [adm0, names] of blob) {
    console.error(`  ${adm0}: ${names.sort().join(" | ")}`);
  }
  process.exit(2);
}

const out = {
  type: "FeatureCollection",
  features: matched.map((m) => ({
    type: "Feature",
    properties: {
      regionKey: m.regionKey,
      name: m.feature.properties.name,
    },
    geometry: m.feature.geometry,
  })),
};

const json = JSON.stringify(out);
await writeFile(OUT, json);
console.log(
  `wrote ${OUT}\n  ${(json.length / 1024).toFixed(1)} KB · ${out.features.length} features`,
);
