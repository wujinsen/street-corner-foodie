/** v0.6.4 · alt-c · settings sheet (theme; opened from dock Profile). */

import { applyTheme, readStored, writeStored, type Theme } from "./theme-toggle";

function syncThemeButtons(pref: Theme): void {
  document.querySelectorAll<HTMLButtonElement>("[data-theme-pick]").forEach((btn) => {
    const pick = btn.getAttribute("data-theme-pick") as Theme;
    btn.classList.toggle("active", pick === pref);
    btn.setAttribute("aria-pressed", pick === pref ? "true" : "false");
  });
}

export function initSettingsSheet(): void {
  const panel = document.getElementById("settings-panel");
  const overlay = document.getElementById("settings-overlay");
  if (!panel || !overlay) return;

  syncThemeButtons(readStored());

  const open = (): void => {
    overlay.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    syncThemeButtons(readStored());
    panel.querySelector<HTMLButtonElement>("[data-theme-pick].active")?.focus();
  };

  const close = (): void => {
    overlay.hidden = true;
    panel.setAttribute("aria-hidden", "true");
  };

  document.getElementById("dock-settings-btn")?.addEventListener("click", open);
  document.getElementById("settings-close")?.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
  });

  panel.querySelectorAll<HTMLButtonElement>("[data-theme-pick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pick = btn.getAttribute("data-theme-pick") as Theme;
      if (pick !== "dark" && pick !== "light" && pick !== "auto") return;
      writeStored(pick);
      applyTheme(pick);
      syncThemeButtons(pick);
    });
  });

  document.addEventListener("scf:theme-change", () => syncThemeButtons(readStored()));
}
