/** Drop manifest keys whose asserts PNG no longer exists on disk. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(__dirname, "..");
const REPO = path.join(WEB, "..");
const MANIFEST_PATH = path.join(WEB, ".scf-image-manifest.json");

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
let pruned = 0;

for (const key of Object.keys(manifest)) {
  const rel = key.replace(/^\//, "");
  const abs = path.join(REPO, rel);
  if (!fs.existsSync(abs)) {
    delete manifest[key];
    pruned++;
  }
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`[prune-image-manifest] pruned ${pruned}; left ${Object.keys(manifest).length} entries`);
