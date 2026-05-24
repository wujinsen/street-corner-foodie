/**
 * World map art for WorldMapHero (1:1 prototype).
 *
 * Preferred: Figma export only the map tile →
 *   design/alt-c/world-map-dark.png
 *   design/alt-c/light/world-map-light.png  (or design/alt-c/world-map-light.png)
 *
 * Fallback: crop from full landing.png when direct files are missing.
 *
 * Run: npm run map:design
 */
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT_DIR = join(__dirname, "../public/design/alt-c");

/**
 * Crop map-only band from stack export (807×762).
 * Must stop before "海口 / HAIKOU" title strip — 430px wrongly included that text.
 */
const STACK_CROP_MAP = { left: 0, top: 0, width: 807, height: 318 };

/** Fallback crop from full landing (1536×1024) */
const LANDING_CROP_MAP = { left: 36, top: 76, width: 728, height: 478 };

/** @type {{ label: string; candidates: string[]; out: string; fallback?: string }[]} */
const STACK_DARK = join(ROOT, "design/alt-c/landing-left-stack-dark.png");

const JOBS = [
  {
    label: "dark",
    candidates: [join(ROOT, "design/alt-c/world-map-dark.png"), join(ROOT, "design/alt-c/world-map.png")],
    out: "world-map-dark.png",
    fallback: existsSync(STACK_DARK) ? STACK_DARK : join(ROOT, "design/alt-c/landing.png"),
    crop: existsSync(STACK_DARK) ? STACK_CROP_MAP : LANDING_CROP_MAP,
  },
  {
    label: "light",
    candidates: [
      join(ROOT, "design/alt-c/light/world-map-light.png"),
      join(ROOT, "design/alt-c/world-map-light.png"),
    ],
    out: "world-map-light.png",
    fallback: existsSync(join(ROOT, "design/alt-c/light/landing-left-stack-light.png"))
      ? join(ROOT, "design/alt-c/light/landing-left-stack-light.png")
      : join(ROOT, "design/alt-c/light/landing.png"),
    crop: existsSync(join(ROOT, "design/alt-c/light/landing-left-stack-light.png"))
      ? STACK_CROP_MAP
      : LANDING_CROP_MAP,
  },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const job of JOBS) {
  const dest = join(OUT_DIR, job.out);
  const direct = job.candidates.find((p) => existsSync(p));

  const writeMapPng = async (input, label) => {
    await sharp(input)
      .resize({ width: 1200, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toFile(dest);
    const meta = await sharp(dest).metadata();
    console.log(`[map:design] ${job.out} ← ${label} (${meta.width}×${meta.height})`);
  };

  if (direct) {
    await writeMapPng(direct, `direct ${direct}`);
    continue;
  }

  if (job.fallback && existsSync(job.fallback)) {
    const crop = job.crop ?? LANDING_CROP_MAP;
    const cropped = await sharp(job.fallback).extract(crop).toBuffer();
    await writeMapPng(cropped, `crop ${job.fallback}`);
    continue;
  }

  console.warn(`[map:design] skip ${job.label}: no direct export or fallback`);
}
