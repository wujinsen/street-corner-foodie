/** Country picker · close on outside/Escape; sync trigger when map changes country. */

export function syncCountryChrome(countryId: string): void {
  document.querySelectorAll<HTMLElement>("[data-country-link]").forEach((el) => {
    const match = el.getAttribute("data-country-link") === countryId;
    el.classList.toggle("active", match);
    if (el.getAttribute("role") === "option") {
      if (match) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    }
  });

  document.querySelectorAll<HTMLDetailsElement>("[data-country-picker]").forEach((picker) => {
    const activeOpt = picker.querySelector<HTMLElement>(`[data-country-link="${countryId}"]`);
    if (!activeOpt) return;
    const triggerLabel = picker.querySelector<HTMLElement>(".country-picker__label");
    const triggerFlag = picker.querySelector<HTMLElement>(".country-picker__trigger .country-picker__flag");
    const nameEl = activeOpt.querySelector<HTMLElement>(".country-picker__option-label");
    const flagEl = activeOpt.querySelector<HTMLElement>(".country-picker__option-flag");
    if (triggerLabel && nameEl) triggerLabel.textContent = nameEl.textContent?.trim() ?? "";
    if (triggerFlag && flagEl) triggerFlag.textContent = flagEl.textContent ?? "";
  });
}

function closeAllCountryPickers(except?: HTMLDetailsElement): void {
  document.querySelectorAll<HTMLDetailsElement>("[data-country-picker][open]").forEach((picker) => {
    if (picker !== except) picker.open = false;
  });
}

export function initCountryPickers(root: ParentNode = document): void {
  if (root === document && (document.body as HTMLElement).dataset.countryPickerInit === "true") {
    return;
  }
  if (root === document) {
    (document.body as HTMLElement).dataset.countryPickerInit = "true";
  }

  root.querySelectorAll<HTMLDetailsElement>("[data-country-picker]").forEach((picker) => {
    if (picker.dataset.countryPickerBound === "true") return;
    picker.dataset.countryPickerBound = "true";

    picker.addEventListener("toggle", () => {
      if (picker.open) closeAllCountryPickers(picker);
    });
  });

  if (root !== document) return;

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    document.querySelectorAll<HTMLDetailsElement>("[data-country-picker][open]").forEach((picker) => {
      if (!picker.contains(target)) picker.open = false;
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllCountryPickers();
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initCountryPickers(), { once: true });
  } else {
    initCountryPickers();
  }
}
