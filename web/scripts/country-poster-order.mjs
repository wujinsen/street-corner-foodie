/**
 * Smoke test: country poster interleave (no Astro import.meta.glob).
 */
import assert from "node:assert/strict";

function interleave(posters, regionOrder) {
  const byRegion = new Map();
  for (const p of posters) {
    const list = byRegion.get(p.regionId) ?? [];
    list.push(p);
    byRegion.set(p.regionId, list);
  }
  const queues = regionOrder
    .map((id) => byRegion.get(id) ?? [])
    .filter((q) => q.length > 0);
  const out = [];
  for (let round = 0; ; round++) {
    let added = false;
    for (const q of queues) {
      if (round < q.length) {
        out.push(q[round]);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}

const posters = [
  { slug: "a1", regionId: "hainan" },
  { slug: "a2", regionId: "hainan" },
  { slug: "b1", regionId: "hebei" },
  { slug: "c1", regionId: "jiangsu" },
];
const order = ["hainan", "hebei", "jiangsu"];
const mixed = interleave(posters, order);
assert.deepEqual(
  mixed.map((p) => p.regionId),
  ["hainan", "hebei", "jiangsu", "hainan"],
  "first screen should rotate provinces",
);
console.log("[country-poster-order] ok");
