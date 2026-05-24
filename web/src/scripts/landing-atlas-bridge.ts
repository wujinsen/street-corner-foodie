/**
 * Landing · sync city card + bento when world-atlas pin focuses a country.
 */

type Spot = {
  id: string;
  city: { zh: string; en: string; ja: string };
  citySub: { zh: string; en: string; ja: string };
  coords: string;
  heroUrl: string | null;
  regionHref: string;
};

function readSpots(root: HTMLElement): Spot[] {
  const raw = root.getAttribute("data-landing-map-json");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Spot[];
  } catch {
    return [];
  }
}

function spotLang(root: HTMLElement): "zh" | "en" | "ja" {
  const l = root.getAttribute("data-lang");
  if (l === "en" || l === "ja") return l;
  return "zh";
}

function applyLandingCountry(root: HTMLElement, countryId: string): void {
  const spots = readSpots(root);
  const spot = spots.find((s) => s.id === countryId);
  if (!spot) return;

  const lang = spotLang(root);
  root.setAttribute("data-active-country", countryId);
  root.setAttribute("data-country", countryId);

  const cityDisplayEl = root.querySelector<HTMLElement>("[data-map-city-display]");
  const subEl = root.querySelector<HTMLElement>("[data-map-city-sub]");
  const coordsEl = root.querySelector<HTMLElement>("[data-map-city-coords]");
  const regionLink = root.querySelector<HTMLAnchorElement>("[data-map-region-link]");
  const bg = root.querySelector<HTMLElement>("[data-map-city-bg]");

  if (cityDisplayEl) {
    cityDisplayEl.textContent =
      lang === "en" ? spot.city.en : lang === "ja" ? spot.city.ja : spot.city.zh;
  }
  if (subEl) {
    const sub =
      (lang === "en" ? spot.citySub.en : lang === "ja" ? spot.citySub.ja : spot.citySub.zh) ||
      spot.citySub.zh;
    subEl.textContent = sub.trim();
    subEl.hidden = !sub.trim();
  }
  if (coordsEl) coordsEl.textContent = spot.coords;
  if (regionLink) regionLink.href = spot.regionHref;
  if (bg) {
    if (spot.heroUrl) {
      bg.style.backgroundImage = `url('${spot.heroUrl}')`;
      bg.classList.add("is-visible");
    } else {
      bg.style.backgroundImage = "";
      bg.classList.remove("is-visible");
    }
  }

  document.documentElement.setAttribute("data-country", countryId);
  root.dispatchEvent(
    new CustomEvent("scf:landing-spot", { bubbles: true, detail: { countryId } }),
  );
}

function initLandingAtlasBridge(): void {
  const root = document.querySelector<HTMLElement>("[data-landing-map-root]");
  if (!root) return;

  const defaultId = root.getAttribute("data-default-country") || "cn";
  applyLandingCountry(root, defaultId);

  document.addEventListener("scf:atlas-focus", (ev) => {
    const countryId = (ev as CustomEvent<{ countryId?: string }>).detail?.countryId;
    if (countryId) applyLandingCountry(root, countryId);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLandingAtlasBridge, { once: true });
  } else {
    initLandingAtlasBridge();
  }
}
