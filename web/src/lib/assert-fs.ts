import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Repo root (`meishi/`), one level above `web/`. */
const REPO_ROOT = path.join(fileURLToPath(import.meta.url), "../../../..");

/** True when `/asserts/…` PNG exists on disk (gallery should not list missing files). */
export function assertPngExists(publicUrl: string | null | undefined): boolean {
  if (!publicUrl || !publicUrl.startsWith("/asserts/")) return false;
  const rel = publicUrl.slice(1).split("/").join(path.sep);
  return fs.existsSync(path.join(REPO_ROOT, rel));
}
