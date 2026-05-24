/**
 * Build-time AVIF/WebP derivatives from repo asserts/*.png → public/scf-img/
 * Manifest: web/.scf-image-manifest.json (gitignored)
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(__dirname, "..");
const REPO = path.join(WEB, "..");
const ASSERTS = path.join(REPO, "asserts");
const OUT_DIR = path.join(WEB, "public", "scf-img");
const MANIFEST_PATH = path.join(WEB, ".scf-image-manifest.json");

const isQuick = process.argv.includes("--quick");
const WIDTHS = isQuick ? [320, 720] : [320, 720, 1280, 1920];
const SKIP_DIRS = new Set(["_templates", ".scf-image-cache", "scf-img"]);

function largestWidthInSrcset(srcset) {
  if (!srcset) return 0;
  let best = 0;
  for (const part of srcset.split(",")) {
    const trimmed = part.trim();
    const space = trimmed.lastIndexOf(" ");
    if (space <= 0) continue;
    const desc = trimmed.slice(space + 1);
    if (desc.endsWith("w")) best = Math.max(best, Number(desc.slice(0, -1)) || 0);
  }
  return best;
}

function walkPng(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".")) continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP_DIRS.has(name.name)) continue;
      walkPng(full, out);
    } else if (name.name.toLowerCase().endsWith(".png")) {
      out.push(full);
    }
  }
  return out;
}

function toPublicAssertPath(absPath) {
  const rel = path.relative(REPO, absPath).replace(/\\/g, "/");
  return `/${rel}`;
}

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    console.warn("[optimize-images] sharp not installed — skip (npm i -D sharp)");
    return null;
  }
}

function writeManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

async function main() {
  const sharp = await loadSharp();
  const files = walkPng(ASSERTS);
  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    } catch {
      manifest = {};
    }
  }

  if (!sharp || files.length === 0) {
    if (fs.existsSync(MANIFEST_PATH)) {
      Object.assign(manifest, JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")));
    }
    writeManifest(manifest);
    console.log(
      `[optimize-images] ${files.length} png found; sharp=${!!sharp}; manifest ${Object.keys(manifest).length} entries`,
    );
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  let processed = 0;

  for (const abs of files) {
    const publicSrc = toPublicAssertPath(abs);
    let st;
    try {
      st = fs.statSync(abs);
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
        delete manifest[publicSrc];
        continue;
      }
      throw err;
    }
    const sig = `${st.mtimeMs}:${st.size}`;
    const hash = crypto.createHash("sha1").update(`${publicSrc}|${sig}`).digest("hex").slice(0, 12);
    const existing = manifest[publicSrc];
    if (existing?.sig === sig && existing?.hash === hash && existing?.avif) {
      /* dev:quick must not downgrade a full build to 320/720 only */
      if (isQuick) continue;
      const meta = await sharp(abs).metadata();
      const maxW = meta.width ?? 1920;
      const hasDisplayTier =
        largestWidthInSrcset(existing.avif) >= Math.min(1280, maxW);
      if (hasDisplayTier) continue;
    }
    /* 路径 + sig → 新 hash，避免同 URL 继续命中浏览器/CDN 里的旧 WebP */
    const bucket = path.join(OUT_DIR, hash);
    const prevHash = manifest[publicSrc]?.hash;
    if (prevHash && prevHash !== hash) {
      const orphan = path.join(OUT_DIR, prevHash);
      if (fs.existsSync(orphan)) fs.rmSync(orphan, { recursive: true, force: true });
    }
    if (fs.existsSync(bucket)) {
      fs.rmSync(bucket, { recursive: true, force: true });
    }
    fs.mkdirSync(bucket, { recursive: true });

    const meta = await sharp(abs).metadata();
    const maxW = meta.width ?? 1920;
    const avif = [];
    const webp = [];
    const widthTargets = [...WIDTHS];
    if (!widthTargets.includes(maxW) && maxW > widthTargets[widthTargets.length - 1]) {
      widthTargets.push(maxW);
    }

    for (const w of widthTargets) {
      const width = Math.min(w, maxW);
      const avifName = `${width}.avif`;
      const webpName = `${width}.webp`;
      const avifPath = path.join(bucket, avifName);
      const webpPath = path.join(bucket, webpName);

      const avifQuality = width >= 1280 ? 58 : 52;
      const webpQuality = width >= 1280 ? 90 : 82;
      await sharp(abs)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: avifQuality })
        .toFile(avifPath);
      await sharp(abs)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: webpQuality })
        .toFile(webpPath);

      avif.push(`/scf-img/${hash}/${avifName} ${width}w`);
      webp.push(`/scf-img/${hash}/${webpName} ${width}w`);
    }

    const isWideBanner = /_(?:day|night|sunset)_wide\.png$/i.test(publicSrc);
    manifest[publicSrc] = {
      sig,
      hash,
      fallback: publicSrc,
      avif: avif.join(", "),
      webp: webp.join(", "),
      sizes: "(max-width: 720px) 100vw, (max-width: 1280px) 50vw, 720px",
      sizesDisplay: "(max-width: 960px) 100vw, 1280px",
      sizesBanner: isWideBanner ? "(max-width: 1280px) 100vw, 1280px" : undefined,
    };
    processed++;
    if (processed % 20 === 0) {
      console.log(`[optimize-images] … ${processed}/${files.length}`);
    }
  }

  writeManifest(manifest);
  console.log(`[optimize-images] processed ${processed} png → ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
