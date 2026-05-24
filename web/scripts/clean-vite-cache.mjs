import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const webRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const viteCache = path.join(webRoot, "node_modules", ".vite");

if (fs.existsSync(viteCache)) {
  fs.rmSync(viteCache, { recursive: true, force: true });
  console.log("[clean-vite-cache] removed node_modules/.vite");
} else {
  console.log("[clean-vite-cache] nothing to remove");
}
