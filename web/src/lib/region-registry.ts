import type { CountryId, Multilang } from "./types";

export interface RegionBinding {
  docSuffix: string;
  countryId: CountryId;
  regionId: string;
  name: Multilang;
  tagline: Multilang;
  flavors?: { zh: string[]; en: string[]; ja: string[] };
  posterFilter?: (entry: string) => boolean;
  /** Mini-zine frontmatter filter; defaults to {@link posterFilter} when omitted. */
  zineFilter?: (entry: string) => boolean;
  streetFilter?: (entry: string) => boolean;
  useFujiStreets?: boolean;
  streetPathOverride?: string;
  /** Override Gourmet recipe2 relative path (e.g. `cn/jiangsu/` from china.md entries). */
  posterPathPrefix?: string;
  placeholderSlugs?: string[];
}

export const REGION_BINDINGS: RegionBinding[] = [
  {
    docSuffix: "china/hainan.md",
    countryId: "cn",
    regionId: "hainan",
    name: { zh: "海南", en: "Hainan", ja: "海南" },
    tagline: {
      zh: "热带海岛上的清甜与椰香 — 文昌鸡、海南粉、清补凉、椰子鸡，从骑楼到老爸茶。",
      en: "Tropical sweetness — coconut, seafood and sweet rice from arcade streets to morning tea.",
      ja: "熱帯海島のココナッツと海鮮 — 文昌鶏、海南粉、清補涼。",
    },
    flavors: {
      zh: ["清甜", "椰香", "酸辣", "海鲜", "清淡"],
      en: ["Sweet", "Coconut", "Sour-spicy", "Seafood", "Light"],
      ja: ["甘み", "ココナッツ", "酸辣", "海鮮", "あっさり"],
    },
  },
  {
    docSuffix: "china/shijiazhuang.md",
    countryId: "cn",
    regionId: "hebei",
    name: { zh: "河北", en: "Hebei", ja: "河北" },
    tagline: {
      zh: "华北面食与重卤的烟火日常 — 板面、卤味、缸炉烧饼。",
      en: "Hearty northern noodles & smoked classics from the Hebei plain.",
      ja: "華北の麺と燻製。板麺と煮込みの日常。",
    },
    flavors: {
      zh: ["咸香", "重辣", "面食", "卤味"],
      en: ["Savory", "Spicy", "Noodle", "Braised"],
      ja: ["塩辛", "辛口", "麺", "煮込み"],
    },
  },
  {
    docSuffix: "china/china.md",
    countryId: "cn",
    regionId: "jiangsu",
    name: { zh: "江苏", en: "Jiangsu", ja: "江蘇" },
    tagline: {
      zh: "江南炒饭与豆腐百味 — 扬州、苏州烟火日常。",
      en: "Jiangnan fried rice and tofu — Yangzhou to Suzhou home cooking.",
      ja: "江南の炒飯と豆腐料理。",
    },
    flavors: {
      zh: ["咸鲜", "清淡", "锅气", "面食"],
      en: ["Savory", "Light", "Wok-hei", "Noodle"],
      ja: ["塩辛", "あっさり", "鍋気", "麺"],
    },
    posterFilter: (e) => e.startsWith("jiangsu/"),
    zineFilter: (e) => e.startsWith("jiangsu/"),
    posterPathPrefix: "cn/jiangsu/",
  },
  {
    docSuffix: "china/china.md",
    countryId: "cn",
    regionId: "guangdong",
    name: { zh: "广东", en: "Guangdong", ja: "広東" },
    tagline: {
      zh: "镬气炒饭与粤式鲜香 — 腊味、海鲜、煲仔。",
      en: "Wok-fried rice and Cantonese umami — cured meats and seafood.",
      ja: "広東の炒飯と海鮮の旨み。",
    },
    flavors: {
      zh: ["鲜香", "镬气", "腊味", "海鲜"],
      en: ["Umami", "Wok-hei", "Cured", "Seafood"],
      ja: ["旨み", "鍋気", "腊味", "海鮮"],
    },
    posterFilter: (e) => e.startsWith("guangdong/"),
    zineFilter: (e) => e.startsWith("guangdong/"),
    posterPathPrefix: "cn/guangdong/",
  },
  {
    docSuffix: "china/china.md",
    countryId: "cn",
    regionId: "sichuan",
    name: { zh: "四川", en: "Sichuan", ja: "四川" },
    tagline: {
      zh: "麻辣鲜香 — 回锅、宫保、鱼香、火锅。",
      en: "Mala heat and fragrance — twice-cooked pork to hot pot.",
      ja: "麻辣の香り — 四川の日常。",
    },
    flavors: {
      zh: ["麻辣", "鲜香", "酸辣", "重油"],
      en: ["Mala", "Umami", "Sour-spicy", "Rich"],
      ja: ["麻辣", "旨み", "酸辣", "濃厚"],
    },
    posterFilter: (e) => e.startsWith("sichuan/"),
    zineFilter: (e) => e.startsWith("sichuan/"),
    posterPathPrefix: "cn/sichuan/",
  },
  {
    docSuffix: "china/beijing.md",
    countryId: "cn",
    regionId: "beijing",
    name: { zh: "北京", en: "Beijing", ja: "北京" },
    tagline: {
      zh: "京味烤鸭与胡同小吃 — 炸酱面、卤煮、豆汁。",
      en: "Peking duck and hutong bites — noodles, offal stew, fermented soy.",
      ja: "北京ダックと胡同の味。",
    },
    flavors: {
      zh: ["咸香", "酱香", "面食", "京味"],
      en: ["Savory", "Sauce-rich", "Noodle", "Northern"],
      ja: ["塩辛", "醤香", "麺", "京味"],
    },
  },
  {
    docSuffix: "china/shaanxi.md",
    countryId: "cn",
    regionId: "shaanxi",
    name: { zh: "陕西", en: "Shaanxi", ja: "陝西" },
    tagline: {
      zh: "面食与牛羊肉的酸辣咸香 — 西安回民街、大唐夜市。",
      en: "Noodles and lamb — Xi'an Muslim quarter and Tang night streets.",
      ja: "麺と羊肉 — 西安の回民街と唐の夜市。",
    },
    flavors: {
      zh: ["酸辣", "麻香", "面食", "牛羊肉"],
      en: ["Sour-spicy", "Cumin", "Noodle", "Lamb"],
      ja: ["酸辣", "孜然", "麺", "羊肉"],
    },
    streetPathOverride: "cn/shaanxi/xian/",
    streetFilter: (e) => e.includes("cn_shaanxi_xian_"),
    posterFilter: () => false,
    zineFilter: () => false,
  },
  {
    docSuffix: "china/zhejiang.md",
    countryId: "cn",
    regionId: "zhejiang",
    name: { zh: "浙江", en: "Zhejiang", ja: "浙江" },
    tagline: {
      zh: "江南酸甜与时令的精致 — 西湖醋鱼、龙井虾仁、东坡肉。",
      en: "Jiangnan sweet-sour delicacy — seasonal and refined.",
      ja: "江南の酸甘と季節の繊細さ。",
    },
    flavors: {
      zh: ["酸甜", "清淡", "时令"],
      en: ["Sweet-sour", "Light", "Seasonal"],
      ja: ["酸甘", "あっさり", "旬"],
    },
    streetPathOverride: "cn/zhejiang/hangzhou/",
    streetFilter: (e) => e.includes("cn_zhejiang_hangzhou_"),
  },
  {
    docSuffix: "world/japan.md",
    countryId: "jp",
    regionId: "tokyo",
    name: { zh: "东京", en: "Tokyo", ja: "東京" },
    tagline: {
      zh: "霓虹与暖簾下的深夜味觉 — 拉面、寿司、天妇罗、屋台。",
      en: "Late-night flavors under neon and noren — ramen, sushi, tempura, yatai.",
      ja: "ネオンと暖簾の夜の味覚 — ラーメン、寿司、天ぷら、屋台。",
    },
    flavors: {
      zh: ["うま味", "醤油", "とんこつ", "屋台", "辛口"],
      en: ["Umami", "Shoyu", "Tonkotsu", "Yatai", "Spicy"],
      ja: ["うま味", "醤油", "とんこつ", "屋台", "辛口"],
    },
    streetPathOverride: "jp/tokyo/",
    placeholderSlugs: ["sushi", "tempura", "tonkatsu", "takoyaki", "gyudon", "curry", "monja"],
  },
  {
    docSuffix: "world/japan.md",
    countryId: "jp",
    regionId: "fuji",
    name: { zh: "富士", en: "Fuji", ja: "富士" },
    tagline: {
      zh: "湖光山色，乡土与温泉 — 蕎麦、湯豆腐、ほうとう。",
      en: "Lakes, mountains, hot-spring fare — soba, yudofu, hoto.",
      ja: "湖と山、郷土と温泉 — 蕎麦、湯豆腐、ほうとう。",
    },
    flavors: {
      zh: ["乡土", "蕎麦", "湯豆腐", "季節"],
      en: ["Rustic", "Soba", "Yudofu", "Seasonal"],
      ja: ["郷土", "蕎麦", "湯豆腐", "季節"],
    },
    streetPathOverride: "jp/fuji/",
    useFujiStreets: true,
    posterFilter: () => false,
  },
  {
    docSuffix: "world/usa.md",
    countryId: "us",
    regionId: "ny",
    name: { zh: "纽约", en: "New York", ja: "ニューヨーク" },
    tagline: {
      zh: "Diner、披萨与街头热狗的城市旋律 — 24 小时不打烊。",
      en: "Diners, slices and street-side dogs — open 24 hours.",
      ja: "ダイナーとピザとストリートフード。",
    },
    flavors: {
      zh: ["Smoky", "Cheesy", "Spicy", "Buttery"],
      en: ["Smoky", "Cheesy", "Spicy", "Buttery"],
      ja: ["スモーキー", "チーズ", "スパイシー", "バター"],
    },
    streetPathOverride: "us/nyc/",
    posterFilter: (e) =>
      e.includes("ny_") ||
      e.includes("cheeseburger") ||
      e.includes("three_sisters") ||
      e.includes("ny_pizza"),
    zineFilter: (e) =>
      e.includes("hot_dog") ||
      e.includes("pretzel") ||
      e.includes("ny_pizza"),
    streetFilter: (e) => e.includes("us_nyc_"),
  },
  {
    docSuffix: "world/usa.md",
    countryId: "us",
    regionId: "tx",
    name: { zh: "德州", en: "Texas", ja: "テキサス" },
    tagline: {
      zh: "烟熏 BBQ 与西南风情 — 牛胸、Brisket、Tex-Mex。",
      en: "Smoked BBQ and Tex-Mex.",
      ja: "スモーク BBQ とテックスメックス。",
    },
    flavors: {
      zh: ["BBQ", "Smoky", "Spicy"],
      en: ["BBQ", "Smoky", "Spicy"],
      ja: ["BBQ", "スモーキー", "スパイシー"],
    },
    streetPathOverride: "us/tx/",
    posterFilter: (e) => e.includes("tx") || e.includes("bbq") || e.includes("brisket"),
    zineFilter: (e) => e.includes("tx") || e.includes("bbq") || e.includes("brisket"),
    streetFilter: (e) => e.includes("us_tx_"),
  },
  {
    docSuffix: "world/usa.md",
    countryId: "us",
    regionId: "la",
    name: { zh: "洛杉矶", en: "Los Angeles", ja: "ロサンゼルス" },
    tagline: {
      zh: "阳光、棕榈与 food truck — tacos、fish tacos、中央市场。",
      en: "Sun, palms, and food trucks — tacos, fish tacos, Grand Central Market.",
      ja: "太陽とパーム、フードトラック — タコス、フィッシュタコス、中央市場。",
    },
    flavors: {
      zh: ["阳光", "Tacos", "海鲜", "多元"],
      en: ["Sunny", "Tacos", "Seafood", "Diverse"],
      ja: ["陽光", "タコス", "シーフード", "多様"],
    },
    streetPathOverride: "us/la/",
    posterFilter: (e) =>
      e.includes("us/la") ||
      e.includes("us_la") ||
      e.includes("fish_tacos") ||
      /(?:^|\/)tacos_/.test(e),
    zineFilter: (e) => e.includes("us/la") || e.includes("us_la"),
    streetFilter: (e) => e.includes("us_la_"),
  },
  {
    docSuffix: "world/usa.md",
    countryId: "us",
    regionId: "nola",
    name: { zh: "新奥尔良", en: "New Orleans", ja: "ニューオーリンズ" },
    tagline: {
      zh: "Cajun 与 Creole — gumbo、beignets、爵士与密西西比湿气。",
      en: "Cajun & Creole — gumbo, beignets, jazz and river humidity.",
      ja: "ケイジャンとクレオール — ガンボ、ベニエ、ジャズの街。",
    },
    flavors: {
      zh: ["浓郁", "香辣", "海鲜", "甜粉"],
      en: ["Rich", "Spicy", "Seafood", "Sweet"],
      ja: ["濃厚", "スパイシー", "シーフード", "甘い"],
    },
    streetPathOverride: "us/nola/",
    posterFilter: (e) =>
      e.includes("gumbo") ||
      e.includes("beignets") ||
      e.includes("us_nola") ||
      e.includes("nola"),
    zineFilter: (e) => e.includes("gumbo") || e.includes("beignets") || e.includes("nola"),
    streetFilter: (e) => e.includes("us_nola_"),
  },
];
