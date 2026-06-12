import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Repo root (`meishi/`), one level above `web/`. */
const REPO_ROOT = path.join(fileURLToPath(import.meta.url), "../../../..");

const LOCAL_ASSERTS_ROOT = path.join(REPO_ROOT, "asserts");

/**
 * Local dev has `asserts/` via junction; CI/Pages build has no repo asserts (images on R2).
 * Only filter missing files when the tree is present — otherwise trust docs manifest.
 */
export function hasLocalAssertsTree(): boolean {
  return fs.existsSync(LOCAL_ASSERTS_ROOT);
}

/** True when `/asserts/…` PNG exists on disk (gallery should not list missing files). */
export function assertPngExists(publicUrl: string | null | undefined): boolean {
  if (!publicUrl || !publicUrl.startsWith("/asserts/")) return false;
  const rel = publicUrl.slice(1).split("/").join(path.sep);
  return fs.existsSync(path.join(REPO_ROOT, rel));
}

/** Skip disk check in CI; filter stale entries only when local asserts are mounted. */
export function posterListedInGallery(publicUrl: string | null | undefined): boolean {
  if (!hasLocalAssertsTree()) return true;
  return assertPngExists(publicUrl);
}
