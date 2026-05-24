import type { CountryId, Poster } from "./types";

interface PlaceholderDef {
  slug: string;
  emoji: string;
  name: { zh: string; en: string; ja: string };
  pin: string;
  bg1: string;
  bg2: string;
  glow: string;
  ribbon: string;
  tags: { zh: string[]; en: string[]; ja: string[] };
  desc: { zh: string; en: string; ja: string };
}

const TOKYO: PlaceholderDef[] = [
  {
    slug: "ramen",
    emoji: "🍜",
    name: {
    zh: "东京拉面",
    en: "Tokyo Ramen",
    ja: "ラーメン",
  },
    pin: "東京·新宿",
    bg1: "#3A1F0E",
    bg2: "#1A0B0B",
    glow: "rgba(255,140,80,.4)",
    ribbon: "#E60012",
    tags: {
    zh: ["豚骨", "こってり"],
    en: ["Tonkotsu", "Rich"],
    ja: ["豚骨", "こってり"],
  },
    desc: {
    zh: "东京拉面以醤油为底，叉烧、味玉、海苔、葱花，是深夜与归宿。",
    en: "Tokyo ramen — shoyu base, chashu, ajitama, nori, scallion.",
    ja: "東京の醤油ラーメン。チャーシュー、味玉、海苔。",
  },
  },
  {
    slug: "sushi",
    emoji: "🍣",
    name: {
    zh: "江户前寿司",
    en: "Edomae Sushi",
    ja: "寿司",
  },
    pin: "東京·築地",
    bg1: "#0F2C1A",
    bg2: "#031A11",
    glow: "rgba(180,255,200,.18)",
    ribbon: "#E60012",
    tags: {
    zh: ["江戸前", "鮮魚"],
    en: ["Edomae", "Fresh"],
    ja: ["江戸前", "鮮魚"],
  },
    desc: {
    zh: "江户前握寿司讲究熟成与海苔香，米饭微温与鱼脂相融。",
    en: "Edomae nigiri — aged fish, warm rice, balance of vinegar and sea.",
    ja: "江戸前握り。熟成と酢飯の調和。",
  },
  },
  {
    slug: "tempura",
    emoji: "🍤",
    name: {
    zh: "天妇罗",
    en: "Tempura",
    ja: "天ぷら",
  },
    pin: "東京·浅草",
    bg1: "#3A2A12",
    bg2: "#1A1A1A",
    glow: "rgba(255,220,140,.35)",
    ribbon: "#E60012",
    tags: {
    zh: ["サクサク", "海老"],
    en: ["Crisp", "Shrimp"],
    ja: ["サクサク", "海老"],
  },
    desc: {
    zh: "轻薄面衣油炸，蔬果海鲜原味放大；蘸萝卜泥与天つゆ。",
    en: "Light tempura — vegetables & seafood, dashi-radish dip.",
    ja: "薄衣の天ぷら、天つゆと大根おろし。",
  },
  },
  {
    slug: "tonkatsu",
    emoji: "🍱",
    name: {
    zh: "猪排饭",
    en: "Tonkatsu",
    ja: "とんかつ",
  },
    pin: "東京·上野",
    bg1: "#2A1505",
    bg2: "#4A2A12",
    glow: "rgba(255,200,120,.32)",
    ribbon: "#E60012",
    tags: {
    zh: ["ロース", "カリッ"],
    en: ["Loin", "Crispy"],
    ja: ["ロース", "カリッ"],
  },
    desc: {
    zh: "厚切里脊裹面包糠炸至金黄，配高丽菜丝与中浓酱。",
    en: "Thick pork loin fried to gold — shredded cabbage, tonkatsu sauce.",
    ja: "厚切ロース、千切キャベツ、ソース。",
  },
  },
  {
    slug: "takoyaki",
    emoji: "🐙",
    name: {
    zh: "章鱼烧",
    en: "Takoyaki",
    ja: "たこ焼き",
  },
    pin: "東京·渋谷",
    bg1: "#5A1A05",
    bg2: "#2A0A02",
    glow: "rgba(255,170,90,.4)",
    ribbon: "#FF6B9D",
    tags: {
    zh: ["屋台", "鰹節"],
    en: ["Yatai", "Bonito"],
    ja: ["屋台", "鰹節"],
  },
    desc: {
    zh: "圆球面糊裹章鱼粒，外脆内糯；木鱼花和酱汁是灵魂。",
    en: "Crispy-outside, gooey-inside octopus balls — bonito flakes & sauce.",
    ja: "外カリ中トロのたこ焼き、鰹節と濃ソース。",
  },
  },
  {
    slug: "gyudon",
    emoji: "🍚",
    name: {
    zh: "牛丼",
    en: "Gyudon",
    ja: "牛丼",
  },
    pin: "東京·渋谷",
    bg1: "#2A1505",
    bg2: "#3A2A12",
    glow: "rgba(255,180,90,.32)",
    ribbon: "#E60012",
    tags: {
    zh: ["旨味", "早"],
    en: ["Umami", "Quick"],
    ja: ["旨味", "早"],
  },
    desc: {
    zh: "薄切牛肉与洋葱以酱油味汁炖煮，盖热饭，撒七味。",
    en: "Thin beef simmered in shoyu broth over rice — quick & comforting.",
    ja: "牛肉と玉ねぎの煮汁、丼飯に。",
  },
  },
  {
    slug: "curry",
    emoji: "🍛",
    name: {
    zh: "日式咖喱饭",
    en: "Japanese Curry",
    ja: "カレー",
  },
    pin: "東京·秋葉原",
    bg1: "#5A2D0A",
    bg2: "#3A1A0A",
    glow: "rgba(255,170,80,.4)",
    ribbon: "#E60012",
    tags: {
    zh: ["スパイス", "欧風"],
    en: ["Spice", "European"],
    ja: ["スパイス", "欧風"],
  },
    desc: {
    zh: "日式咖喱浓稠香甜，蔬果与肉慢炖；秋叶原是咖喱店密度之冠。",
    en: "Thick, mellow-spiced curry — Akihabara's curry alley.",
    ja: "濃厚な日本式カレー、秋葉原の聖地。",
  },
  },
  {
    slug: "monja",
    emoji: "🥘",
    name: {
    zh: "文字烧",
    en: "Monjayaki",
    ja: "もんじゃ焼き",
  },
    pin: "東京·月島",
    bg1: "#2A2A2A",
    bg2: "#0A0A0A",
    glow: "rgba(255,200,140,.28)",
    ribbon: "#FF6B9D",
    tags: {
    zh: ["铁板", "下町"],
    en: ["Teppan", "Downtown"],
    ja: ["鉄板", "下町"],
  },
    desc: {
    zh: "东京下町独有，铁板上糊状面汁与馅料拌炒，焦边香脆。",
    en: "Tokyo's downtown teppanyaki — runny batter, crispy edges.",
    ja: "月島の鉄板焼き、ヘラで食べる。",
  },
  },
];

const BY_SLUG = new Map(TOKYO.map((d) => [d.slug, d]));

export function buildPlaceholder(
  countryId: CountryId,
  regionId: string,
  slug: string,
): Poster | null {
  const def = BY_SLUG.get(slug);
  if (!def) return null;
  return {
    slug: def.slug,
    countryId,
    regionId,
    path: "_svg/",
    file: null,
    fileNoChar: null,
    placeholder: true,
    emoji: def.emoji,
    romaji: def.slug,
    name: def.name,
    pin: def.pin,
    bg1: def.bg1,
    bg2: def.bg2,
    glow: def.glow,
    ribbon: def.ribbon,
    tags: def.tags,
    desc: def.desc,
  };
}
