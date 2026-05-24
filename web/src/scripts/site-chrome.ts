/** v0.5 · search overlay + favorites (vanilla, no framework). */





import type { SearchIndexEntry } from "../lib/search-index";





const FAV_KEY = "scf_favs";





interface FavItem {


  slug: string;


  country: string;


  region: string;


  name: { zh: string; en: string; ja: string };


  pin: string;


  thumb: string;


}





interface Labels {


  searchPh: string;


  searchEmpty: string;


  searchNone: string;


  favTitle: string;


  favEmpty: string;


  favSaved: string;


  favRemoved: string;


  kindDish: string;


  kindRegion: string;


  kindScene: string;


}





function localePrefix(): string {


  const m = location.pathname.match(/^\/(en|ja)(?=\/|$)/);


  return m ? `/${m[1]}` : "";


}





function localizedPath(path: string): string {


  const prefix = localePrefix();


  if (!prefix || path === "/") return prefix ? `${prefix}/` : path;


  return prefix + path;


}





function currentLang(): "zh" | "en" | "ja" {


  const root = document.getElementById("site-chrome");


  const lang = root?.dataset.lang;


  if (lang === "en" || lang === "ja" || lang === "zh") return lang;


  const m = location.pathname.match(/^\/(en|ja)(?=\/|$)/);


  return (m?.[1] as "en" | "ja") ?? "zh";


}





function tName(name: { zh: string; en: string; ja: string }): string {


  const lang = currentLang();


  return name[lang] ?? name.zh;


}





function loadFavs(): FavItem[] {


  try {


    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]") as FavItem[];


  } catch {


    return [];


  }


}





function saveFavs(items: FavItem[]): void {


  localStorage.setItem(FAV_KEY, JSON.stringify(items));


}





function isFav(slug: string): boolean {


  return loadFavs().some((f) => f.slug === slug);


}





function getLabels(): Labels {


  const root = document.getElementById("site-chrome");


  try {


    return JSON.parse(root?.dataset.labels ?? "{}") as Labels;


  } catch {


    return {


      searchPh: "",


      searchEmpty: "",


      searchNone: "",


      favTitle: "",


      favEmpty: "",


      favSaved: "",


      favRemoved: "",


      kindDish: "",


      kindRegion: "",


      kindScene: "",


    };


  }


}





function toast(msg: string): void {


  const el = document.getElementById("scf-toast");


  if (!el) return;


  el.textContent = msg;


  el.classList.add("show");


  window.setTimeout(() => el.classList.remove("show"), 1800);


}





function toggleFavFromButton(btn: HTMLElement): void {


  const slug = btn.dataset.favSlug;


  const country = btn.dataset.favCountry;


  const region = btn.dataset.favRegion;


  if (!slug || !country || !region) return;





  const labels = getLabels();


  const name = {


    zh: btn.dataset.favNameZh ?? slug,


    en: btn.dataset.favNameEn ?? slug,


    ja: btn.dataset.favNameJa ?? slug,


  };


  const pin = btn.dataset.favPin ?? "";


  const thumb = btn.dataset.favThumb ?? "";





  const list = loadFavs();


  const idx = list.findIndex((f) => f.slug === slug);


  if (idx >= 0) {


    list.splice(idx, 1);


    toast(labels.favRemoved);


  } else {


    list.unshift({ slug, country, region, name, pin, thumb });


    toast(labels.favSaved);


  }


  saveFavs(list);


  syncFavUi();


}





function syncFavUi(): void {


  const count = loadFavs().length;


  const badge = document.getElementById("fav-count");


  if (badge) {


    badge.textContent = String(count);


    badge.classList.toggle("show", count > 0);


  }


  document.querySelectorAll<HTMLElement>("[data-fav-slug]").forEach((btn) => {


    const on = isFav(btn.dataset.favSlug ?? "");


    btn.classList.toggle("active", on);


    btn.textContent = on ? "\u2665" : "\u2661";


    btn.setAttribute("aria-pressed", on ? "true" : "false");


  });


  renderFavPanel();


}





function renderFavPanel(): void {


  const body = document.getElementById("fav-body");


  if (!body) return;


  const labels = getLabels();


  const list = loadFavs();


  body.innerHTML = "";


  if (list.length === 0) {


    body.innerHTML = `<div class="fav-empty"><span class="icon">\u2661</span><p>${labels.favEmpty}</p></div>`;


    return;


  }


  for (const item of list) {


    const el = document.createElement("a");


    el.className = "fav-item";


    el.href = localizedPath(`/${item.country}/${item.region}/poster/${item.slug}`);


    el.innerHTML = `


      <div class="thumb" style="background-image:url('${item.thumb}')"></div>


      <div>


        <div class="name">${tName(item.name)}</div>


        <div class="meta">${item.pin}</div>


      </div>


      <button type="button" class="remove" data-remove-slug="${item.slug}">\u2715</button>`;


    el.querySelector(".remove")?.addEventListener("click", (e) => {


      e.preventDefault();


      e.stopPropagation();


      saveFavs(loadFavs().filter((f) => f.slug !== item.slug));


      syncFavUi();


    });


    body.appendChild(el);


  }


}





let searchIndex: SearchIndexEntry[] | null = null;





async function ensureSearchIndex(): Promise<SearchIndexEntry[]> {


  if (searchIndex) return searchIndex;


  const res = await fetch("/search-index.json");


  searchIndex = (await res.json()) as SearchIndexEntry[];


  return searchIndex;


}





function openSearch(): void {


  const overlay = document.getElementById("search-overlay");


  const input = document.getElementById("search-input") as HTMLInputElement | null;


  if (!overlay || !input) return;


  overlay.hidden = false;


  overlay.classList.add("show");


  input.value = "";


  input.focus();


  void runSearch("");


}





function closeSearch(): void {


  const overlay = document.getElementById("search-overlay");


  if (!overlay) return;


  overlay.classList.remove("show");


  overlay.hidden = true;


}





function openFavPanel(): void {


  document.getElementById("fav-panel")?.classList.add("open");


  renderFavPanel();


}





function closeFavPanel(): void {


  document.getElementById("fav-panel")?.classList.remove("open");


}





async function runSearch(q: string): Promise<void> {


  const box = document.getElementById("search-results");


  if (!box) return;


  const labels = getLabels();





  if (!q.trim()) {


    box.innerHTML = `<div class="search-empty">${labels.searchEmpty}</div>`;


    return;


  }





  const idx = await ensureSearchIndex();


  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);


  const results = idx


    .filter((item) => tokens.every((tk) => item.haystack.includes(tk)))


    .slice(0, 30);





  if (results.length === 0) {


    box.innerHTML = `<div class="search-empty">${labels.searchNone}</div>`;


    return;


  }





  box.innerHTML = "";


  for (const item of results) {


    const kindLabel =


      item.kind === "dish"


        ? labels.kindDish


        : item.kind === "region"


          ? labels.kindRegion


          : labels.kindScene;


    const el = document.createElement("a");


    el.className = "search-result";


    el.href = localizedPath(item.path);


    const thumb = item.thumb


      ? `<div class="thumb" style="background-image:url('${item.thumb}')"></div>`


      : `<div class="thumb"></div>`;


    el.innerHTML = `${thumb}<div class="info"><div class="name">${tName(item.name)}</div><div class="meta">${tName(item.meta)}</div></div><span class="kind">${kindLabel}</span>`;


    el.addEventListener("click", () => closeSearch());


    box.appendChild(el);


  }


}





export function initSiteChrome(): void {


  const labels = getLabels();


  const input = document.getElementById("search-input") as HTMLInputElement | null;


  if (input) input.placeholder = labels.searchPh;





  document.getElementById("search-btn")?.addEventListener("click", openSearch);


  document.getElementById("fav-btn")?.addEventListener("click", openFavPanel);


  document.getElementById("fav-close")?.addEventListener("click", closeFavPanel);


  input?.addEventListener("input", () => void runSearch(input.value));





  document.getElementById("search-overlay")?.addEventListener("click", (e) => {


    if ((e.target as HTMLElement).id === "search-overlay") closeSearch();


  });





  document.addEventListener("click", (e) => {


    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-fav-slug]");


    if (btn) {


      e.preventDefault();


      e.stopPropagation();


      toggleFavFromButton(btn);


    }


  });





  document.addEventListener("keydown", (e) => {


    if (e.key === "Escape") {


      closeSearch();


      closeFavPanel();


    }


    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {


      e.preventDefault();


      openSearch();


    }


    if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {


      e.preventDefault();


      openSearch();


    }


  });





  syncFavUi();


  void ensureSearchIndex();


}


