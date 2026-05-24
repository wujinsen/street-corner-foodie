/** v0.6 · alt-c · theme toggle (dark / light / auto).
 *  Companion FOUC-prevention inline script lives in `Base.astro` <head>;
 *  this module wires the UI button + ⌘⇧L shortcut after hydration.
 */

export const STORAGE_KEY = "scf:theme";
export type Theme = "dark" | "light" | "auto";

export function readStored(): Theme {
  const v = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  })();
  if (v === "dark" || v === "light" || v === "auto") return v;
  return "auto";
}

export function writeStored(t: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* private mode */
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveEffective(t: Theme): "dark" | "light" {
  if (t === "auto") return systemPrefersDark() ? "dark" : "light";
  return t;
}

export function applyTheme(t: Theme): void {
  const eff = resolveEffective(t);
  document.documentElement.setAttribute("data-theme", eff);
  document.documentElement.setAttribute("data-theme-pref", t);
  syncButton();
  document.dispatchEvent(new CustomEvent("scf:theme-change", { detail: { pref: t, effective: eff } }));
}

function nextTheme(t: Theme): Theme {
  return t === "dark" ? "light" : t === "light" ? "auto" : "dark";
}

function syncButton(): void {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const pref = document.documentElement.getAttribute("data-theme-pref") || "auto";
  const eff = document.documentElement.getAttribute("data-theme") || "dark";
  btn.setAttribute("aria-label", `Theme: ${pref} (effective ${eff}). Click to cycle.`);
  btn.setAttribute("title", `Theme: ${pref}`);
  btn.setAttribute("data-pref", pref);
}

export function initThemeToggle(): void {
  syncButton();

  const btn = document.getElementById("theme-toggle");
  btn?.addEventListener("click", () => {
    const cur = readStored();
    const next = nextTheme(cur);
    writeStored(next);
    applyTheme(next);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (readStored() === "auto") applyTheme("auto");
  });

  document.addEventListener("keydown", (e) => {
    const isToggle =
      (e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "L" || e.key === "l");
    if (!isToggle) return;
    e.preventDefault();
    const cur = readStored();
    const next = nextTheme(cur);
    writeStored(next);
    applyTheme(next);
  });
}
