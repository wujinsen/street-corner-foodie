/**
 * Sync web_posters frontmatter: gourmet_posters ∪ mini_zine ∪ posters.json ∪ placeholders.
 * Sources: poster-meta-bundle.json (hainan) · posters.json · EXTRA overrides.
 * Run: npm run sync:web-posters
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(__dirname, "..", "..");

const POSTERS_JSON = JSON.parse(
  fs.readFileSync(path.join(__dirname, "posters.json"), "utf8"),
);
const BUNDLE_PATH = path.join(__dirname, "poster-meta-bundle.json");
const META_BUNDLE = fs.existsSync(BUNDLE_PATH)
  ? JSON.parse(fs.readFileSync(BUNDLE_PATH, "utf8"))
  : { cn: { hainan: {} } };

/** Mirrors web/src/lib/region-registry.ts USA filters. */
const US_REGION = {
  ny: {
    posterFilter: (e) =>
      e.includes("ny_") ||
      e.includes("cheeseburger") ||
      e.includes("three_sisters") ||
      e.includes("ny_pizza"),
    zineFilter: (e) =>
      e.includes("hot_dog") || e.includes("pretzel") || e.includes("ny_pizza"),
    placeholders: [],
  },
  tx: {
    posterFilter: (e) => e.includes("tx") || e.includes("bbq") || e.includes("brisket"),
    zineFilter: (e) => e.includes("tx") || e.includes("bbq") || e.includes("brisket"),
    placeholders: [],
  },
  la: {
    posterFilter: (e) =>
      e.includes("us/la") ||
      e.includes("us_la") ||
      e.includes("fish_tacos") ||
      /(?:^|\/)tacos_/.test(e),
    zineFilter: (e) => e.includes("us/la") || e.includes("us_la"),
    placeholders: [],
  },
  nola: {
    posterFilter: (e) =>
      e.includes("gumbo") ||
      e.includes("beignets") ||
      e.includes("us_nola") ||
      e.includes("nola"),
    zineFilter: (e) => e.includes("gumbo") || e.includes("beignets") || e.includes("nola"),
    placeholders: [],
  },
};

const REGION_DOCS = [
  { doc: "docs/china/hainan.md", country: "cn", region: "hainan", regionZh: "海南", placeholders: [] },
  { doc: "docs/china/shijiazhuang.md", country: "cn", region: "hebei", regionZh: "河北", placeholders: [] },
  { doc: "docs/china/zhejiang.md", country: "cn", region: "zhejiang", regionZh: "浙江", placeholders: [] },
  {
    doc: "docs/world/japan.md",
    country: "jp",
    region: "tokyo",
    regionZh: "东京",
    placeholders: ["sushi", "tempura", "tonkatsu", "takoyaki", "gyudon", "curry", "monja"],
  },
  { doc: "docs/world/usa.md", country: "us", region: "ny", regionZh: "纽约", placeholders: [] },
  { doc: "docs/world/usa.md", country: "us", region: "tx", regionZh: "德州", placeholders: [] },
  { doc: "docs/world/usa.md", country: "us", region: "la", regionZh: "洛杉矶", placeholders: [] },
  { doc: "docs/world/usa.md", country: "us", region: "nola", regionZh: "新奥尔良", placeholders: [] },
];

const EXTRA = {
  "cn/hebei": {
    ganglu_shaobing: {
      name: { zh: "缸炉烧饼", en: "Ganglu Shaobing", ja: "缸炉焼餅" },
      tags: { zh: ["酥香", "芝麻"], en: ["Crispy", "Sesame"], ja: ["サクサク", "ごま"] },
      pin: "河北·石家庄",
      desc: {
        zh: "瓷缸贴壁烘烤，方酥满芝麻；夹深泽肉糕或驴肉为庄里吃法。",
        en: "Clay-oven square flatbread — sesame crust, often stuffed with meat.",
        ja: "甕窯の四角い焼き餅、ごま香る。",
      },
    },
  },
  "cn/zhejiang": {
    dongpo_rou: {
      name: { zh: "东坡肉", en: "Dongpo Pork", ja: "東坡肉" },
      tags: { zh: ["浓香", "软糯"], en: ["Rich", "Melt-soft"], ja: ["濃厚", "とろり"] },
      pin: "浙江·杭州",
      desc: {
        zh: "带皮五花肉方块，冰糖黄酒酱油慢炖，色如玛瑙、软烂不腻。",
        en: "Hangzhou braised pork belly — caramel soy glaze, melt-soft.",
        ja: "杭州名物の豚バラ煮込み、琥珀色の甘辛ダレ。",
      },
    },
  },
  "jp/tokyo": {
    gyoza: {
      name: { zh: "日式煎饺", en: "Gyoza", ja: "餃子" },
      tags: { zh: ["焦香", "猪肉"], en: ["Pan-fried", "Pork"], ja: ["焼き", "豚"] },
      pin: "東京·上野",
      desc: {
        zh: "底部焦脆、上部蒸软，蘸醋酱油蒜泥。",
        en: "Crisp-bottomed dumplings with vinegar-soy dip.",
        ja: "底はカリッ、上はふっくら餃子。",
      },
    },
  },
  "us/ny": {
    cheeseburger: {
      name: { zh: "芝士汉堡", en: "Cheeseburger", ja: "チーズバーガー" },
      tags: { zh: ["芝士", "经典"], en: ["Cheesy", "Classic"], ja: ["チーズ", "クラシック"] },
      pin: "美国·纽约",
      desc: {
        zh: "美式 diner 标志 — 芝士、酸黄瓜、炭烤肉饼。",
        en: "The American diner icon — cheese, pickle, char.",
        ja: "アメリカのダイナー定番。",
      },
    },
    hot_dog: {
      name: { zh: "纽约热狗", en: "NY Hot Dog", ja: "ニューヨークホットドッグ" },
      tags: { zh: ["街头", "芥末"], en: ["Street", "Mustard"], ja: ["ストリート", "マスタード"] },
      pin: "美国·纽约",
      desc: {
        zh: "餐车与地铁口标配 — 香肠、芥末洋葱酱、软面包。",
        en: "Cart classic — sausage, mustard-onion relish, soft bun.",
        ja: "屋台の定番、ソーセージとマスタード。",
      },
    },
    pretzel: {
      name: { zh: "椒盐卷饼", en: "Soft Pretzel", ja: "プレッツェル" },
      tags: { zh: ["碱水", "粗盐"], en: ["Pretzel", "Salt"], ja: ["プレッツェル", "塩"] },
      pin: "美国·纽约",
      desc: {
        zh: "碱水扭结、粗盐、软心 — 配芥末酱；时代广场与地铁口常见。",
        en: "Twisted pretzel — coarse salt, soft center, mustard dip.",
        ja: "アカリ水の扭結、粗塩、中はふわっと。",
      },
    },
    ny_pizza: {
      name: { zh: "纽约披萨", en: "NY Pizza Slice", ja: "NYピザ" },
      tags: { zh: ["芝士", "薄底"], en: ["Cheesy", "Thin crust"], ja: ["チーズ", "薄焼き"] },
      pin: "美国·纽约",
      desc: {
        zh: "薄底大扇、窑烤、折角吃，芝士拉丝。",
        en: "Thin-crust slice — fold, pull, go.",
        ja: "薄焼き大きな一切れ、折って食べる。",
      },
    },
    three_sisters: {
      name: { zh: "三姐妹炖菜", en: "Three Sisters Stew", ja: "三姉妹シチュー" },
      tags: { zh: ["本土", "温和"], en: ["Indigenous", "Hearty"], ja: ["先住民", "ほっこり"] },
      pin: "美国·原住民",
      desc: {
        zh: "玉米、豆类、南瓜同煮，体现原住民农耕饮食。",
        en: "Corn, beans, squash — indigenous harvest bowl.",
        ja: "トウモロコシ・豆・カボチャの収穫シチュー。",
      },
    },
  },
  "us/tx": {
    texas_brisket: {
      name: { zh: "德州牛腩", en: "Texas Brisket", ja: "テキサスブリスケット" },
      tags: { zh: ["烟熏", "慢烤"], en: ["Smoked", "Low & slow"], ja: ["スモーク", "ロースロー"] },
      pin: "美国·德州",
      desc: {
        zh: "橡木长时间烟熏牛胸，粉红烟熏环、黑椒脆皮、切片配白面包。",
        en: "Oak-smoked brisket — smoke ring, pepper bark, sliced on white bread.",
        ja: "オーク燻製のブリスケット、スモークリングとペッパークラスト。",
      },
    },
    bbq_ribs: {
      name: { zh: "烧烤肋排", en: "BBQ Ribs", ja: "BBQリブ" },
      tags: { zh: ["烟熏", "酱汁"], en: ["Smoked", "Glazed"], ja: ["スモーク", "グレーズ"] },
      pin: "美国·德州",
      desc: {
        zh: "慢熏猪肋 — 德州偏干熏重烟，酱汁另蘸或轻刷。",
        en: "Low-and-slow pork ribs — Texas style, smoke-forward.",
        ja: "豚リブのロースロースモーク、テキサス流。",
      },
    },
  },
  "us/la": {
    fish_tacos: {
      name: { zh: "鱼塔可", en: "Fish Tacos", ja: "フィッシュタコス" },
      tags: { zh: ["Baja", "清爽"], en: ["Baja", "Bright"], ja: ["バハ", "さっぱり"] },
      pin: "美国·洛杉矶",
      desc: {
        zh: "南加州 Baja 风格 — 炸鱼或烤鱼、卷心菜丝、青柠奶油酱、玉米饼。",
        en: "Baja-style — fried or grilled fish, slaw, lime crema, corn tortilla.",
        ja: "バハ風タコス、魚とキャベツ、ライムクリーム。",
      },
    },
    tacos: {
      name: { zh: "塔可", en: "Street Tacos", ja: "タコス" },
      tags: { zh: ["墨西哥裔", "炭烤"], en: ["Mexican-American", "Grilled"], ja: ["メキシコ系", "グリル"] },
      pin: "美国·洛杉矶",
      desc: {
        zh: "玉米饼夹炭烤肉、洋葱香菜、莎莎 — 东洛杉矶与 food truck 符号。",
        en: "Corn tortilla tacos — charred meat, onion, cilantro, salsa.",
        ja: "トルティーヤに炭火肉、サルサ、パクチー。",
      },
    },
  },
  "us/nola": {
    gumbo: {
      name: { zh: "秋葵海鲜饭", en: "Louisiana Gumbo", ja: "ルイジアナガンボ" },
      tags: { zh: ["浓郁", "海鲜"], en: ["Rich", "Seafood"], ja: ["濃厚", "シーフード"] },
      pin: "美国·新奥尔良",
      desc: {
        zh: "路易斯安那浓汤饭 — 虾、香肠、秋葵与米饭，Creole 与 Cajun 的灵魂。",
        en: "Louisiana stew — shrimp, sausage, okra and rice; Creole soul food.",
        ja: "エビとソーセージ、オクラのガンボ、クレオールの定番。",
      },
    },
    beignets: {
      name: { zh: "法式甜圈", en: "Beignets", ja: "ベニエ" },
      tags: { zh: ["甜粉", "咖啡"], en: ["Powdered", "Coffee"], ja: ["粉糖", "コーヒー"] },
      pin: "美国·新奥尔良",
      desc: {
        zh: "油炸方包撒满糖粉，配菊苣咖啡 — 杰克逊广场与波本街早餐符号。",
        en: "Fried squares buried in powdered sugar — chicory coffee on the side.",
        ja: "揚げた四角パンに粉糖たっぷり、チコリコーヒーと共に。",
      },
    },
  },
};

const PIN_DEFAULTS = {
  "cn/hainan": "海南",
  "cn/hebei": "河北·石家庄",
  "cn/zhejiang": "浙江·杭州",
  "jp/tokyo": "東京",
  "us/ny": "美国·纽约",
  "us/tx": "美国·德州",
  "us/la": "美国·洛杉矶",
  "us/nola": "美国·新奥尔良",
};

function slugFromPosterEntry(entry) {
  const base = path.basename(entry).replace(/\.png$/i, "");
  if (base.includes("_poster_no_char")) return null;
  if (base.includes("_redraw")) return null;
  let slug = base.replace(/_poster$/, "");
  const tail = slug.includes("/") ? slug.split("/").pop() : slug;
  slug = tail ?? slug;
  if (slug.startsWith("cn_hebei_")) slug = slug.slice("cn_hebei_".length);
  if (slug.startsWith("us/")) slug = slug.split("/").pop() ?? slug;
  return slug;
}

function slugFromZineEntry(entry) {
  const base = path.basename(entry).replace(/\.png$/i, "");
  const m = base.match(/^(.+?)_(?:story_eating|story|recipe)(?:_mini_zine)?/);
  return m ? m[1] : null;
}

function posterJsonToWebMeta(p) {
  if (!p?.name) return null;
  const meta = {
    name: p.name,
    tags: p.tags ?? { zh: [], en: [], ja: [] },
    pin: p.pin ?? "",
    desc: p.desc ?? { zh: "", en: "", ja: "" },
  };
  if (p.romaji) meta.romaji = p.romaji;
  return meta;
}

function stubFromSlug(slug, regionZh, country, region) {
  const label = slug.replace(/_/g, " ");
  const pinBase = PIN_DEFAULTS[`${country}/${region}`] ?? regionZh;
  return {
    name: { zh: label, en: label, ja: label },
    tags: { zh: [], en: [], ja: [] },
    pin: pinBase,
    desc: { zh: "", en: "", ja: "" },
  };
}

function pickMeta(country, region, slug, regionZh) {
  const extra = EXTRA[`${country}/${region}`]?.[slug];
  if (extra) return extra;

  const bundle = META_BUNDLE[country]?.[region]?.[slug];
  if (bundle) return bundle;

  const alt = slug.replace(/^cn_[a-z]+_/, "");
  if (alt !== slug && META_BUNDLE[country]?.[region]?.[alt]) {
    return META_BUNDLE[country][region][alt];
  }

  const list = POSTERS_JSON[country]?.[region] ?? [];
  const fromJson = list.find((p) => p.slug === slug);
  if (fromJson) {
    const m = posterJsonToWebMeta(fromJson);
    if (m) return m;
  }

  return stubFromSlug(slug, regionZh, country, region);
}

function collectSlugs(country, region, data, placeholders) {
  if (country === "us" && US_REGION[region]) {
    const u = US_REGION[region];
    const slugs = new Set();
    for (const entry of data.gourmet_posters ?? []) {
      if (u.posterFilter(entry)) {
        const s = slugFromPosterEntry(entry);
        if (s) slugs.add(s);
      }
    }
    for (const entry of data.mini_zine ?? []) {
      if (u.zineFilter(entry)) {
        const s = slugFromZineEntry(entry);
        if (s) slugs.add(s);
      }
    }
    for (const p of POSTERS_JSON.us?.[region] ?? []) {
      if (p.slug) slugs.add(p.slug);
    }
    for (const s of placeholders ?? []) slugs.add(s);
    return slugs;
  }

  const slugs = new Set();
  for (const entry of data.gourmet_posters ?? []) {
    const s = slugFromPosterEntry(entry);
    if (s) slugs.add(s);
  }
  for (const p of POSTERS_JSON[country]?.[region] ?? []) {
    if (p.slug) slugs.add(p.slug);
  }
  for (const s of placeholders ?? []) slugs.add(s);
  return slugs;
}

function buildRegionMap(country, region, regionZh, data, placeholders) {
  const slugs = collectSlugs(country, region, data, placeholders);
  const map = {};
  for (const slug of [...slugs].sort()) {
    map[slug] = pickMeta(country, region, slug, regionZh);
  }
  return map;
}

function isSlugMap(wp) {
  if (!wp || typeof wp !== "object") return false;
  for (const v of Object.values(wp)) {
    if (v && typeof v === "object" && "name" in v) return true;
  }
  return false;
}

function getExistingRegionMap(existing, region, isUsa) {
  if (!existing || typeof existing !== "object") return {};
  if (isUsa) {
    const nested = existing[region];
    if (nested && typeof nested === "object" && !("name" in nested)) {
      return nested;
    }
    return {};
  }
  if (isSlugMap(existing)) return existing;
  return {};
}

function mergeIntoDoc(docPath, country, region, map, placeholders = []) {
  const abs = path.join(REPO, docPath);
  const raw = fs.readFileSync(abs, "utf8");
  const { data, content } = matter(raw);
  const isUsa = docPath.endsWith("usa.md");
  const existing = data.web_posters ?? {};
  const existingRegion = getExistingRegionMap(existing, region, isUsa);

  // Authoritative per region: drop stale slugs (e.g. NY dishes on tx/la).
  const merged = { ...map };

  let next;
  if (isUsa) {
    next = isSlugMap(existing) ? {} : { ...existing };
    next[region] = merged;
  } else {
    next = merged;
  }

  data.web_posters = next;
  const out = matter.stringify(content, data);
  fs.writeFileSync(abs, out.endsWith("\n") ? out : `${out}\n`, "utf8");

  const slugs = collectSlugs(country, region, data, placeholders);
  const missing = [...slugs].filter((s) => !merged[s]);
  const stubCount = Object.values(merged).filter(
    (m) => m.desc?.zh === "" && m.desc?.en === "",
  ).length;
  console.log(
    `updated ${docPath} [${region}] ${Object.keys(merged).length} web_posters` +
      (stubCount ? ` (${stubCount} stub desc)` : "") +
      (missing.length ? ` · MISSING: ${missing.join(", ")}` : ""),
  );
}

function syncPostersJsonExtras() {
  const data = POSTERS_JSON;
  const pushIfMissing = (list, entry) => {
    if (!list.some((p) => p.slug === entry.slug)) list.push(entry);
  };

  if (!data.cn.hebei) data.cn.hebei = [];
  for (const [slug, meta] of Object.entries(EXTRA["cn/hebei"] ?? {})) {
    pushIfMissing(data.cn.hebei, {
      slug,
      path: "cn/hebei/",
      file: `cn/hebei/${slug}_poster.png`,
      fileNoChar: `cn_hebei_${slug}_poster_no_char.png`,
      ...meta,
    });
  }

  if (!data.cn.zhejiang) data.cn.zhejiang = [];
  for (const [slug, meta] of Object.entries(EXTRA["cn/zhejiang"] ?? {})) {
    pushIfMissing(data.cn.zhejiang, {
      slug,
      path: "cn/zhejiang/",
      file: `${slug}_poster.png`,
      fileNoChar: `${slug}_poster_no_char.png`,
      ...meta,
    });
  }

  if (!data.jp.tokyo) data.jp.tokyo = [];
  for (const [slug, meta] of Object.entries(EXTRA["jp/tokyo"] ?? {})) {
    pushIfMissing(data.jp.tokyo, {
      slug,
      path: "_svg/",
      file: null,
      fileNoChar: null,
      placeholder: true,
      ...meta,
    });
  }

  fs.writeFileSync(
    path.join(__dirname, "posters.json"),
    JSON.stringify(data, null, 2) + "\n",
    "utf8",
  );
  console.log("updated posters.json (extras)");
}

const seen = new Map();
for (const cfg of REGION_DOCS) {
  const key = `${cfg.doc}:${cfg.region}`;
  if (seen.has(key)) continue;
  seen.set(key, true);
  const abs = path.join(REPO, cfg.doc);
  const { data } = matter(fs.readFileSync(abs, "utf8"));
  const map = buildRegionMap(cfg.country, cfg.region, cfg.regionZh, data, cfg.placeholders);
  mergeIntoDoc(cfg.doc, cfg.country, cfg.region, map, cfg.placeholders);
}

syncPostersJsonExtras();
console.log("done");
