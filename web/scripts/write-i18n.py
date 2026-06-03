# -*- coding: utf-8 -*-
from pathlib import Path

I18N = r'''import type { Lang, Multilang } from "./types";

export type { Lang, Multilang } from "./types";

export const LANGS: Lang[] = ["zh", "en", "ja"];

export const LANG_LABELS: Record<Lang, string> = {
  zh: "中",
  en: "EN",
  ja: "日",
};

export const HTML_LANG: Record<Lang, string> = {
  zh: "zh-CN",
  en: "en",
  ja: "ja",
};

export const UI = {
  brand: { zh: "街角美食", en: "Street Corner Foodie", ja: "街角グルメ" },
  tagline: {
    zh: "拐进世界的每个街角，看食物与城市如何一起呼吸。",
    en: "A diorama atlas of world street food & cityscapes",
    ja: "世界の街角を曲がるたび、味と街が立ち上がる。",
  },
  nav: {
    world: { zh: "世界", en: "World", ja: "世界" },
    poster: { zh: "海报", en: "Posters", ja: "ポスター" },
    zine: { zh: "小志", en: "Zines", ja: "小冊子" },
    street: { zh: "街景", en: "Streets", ja: "街角" },
  },
  hero: {
    label: { zh: "世界街角图鉴", en: "World Food Atlas", ja: "世界の街角図鑑" },
  },
  filters: {
    flavor: { zh: "风味", en: "Flavor", ja: "味" },
    all: { zh: "全部", en: "All", ja: "すべて" },
    with_char: { zh: "有人物", en: "With characters", ja: "人物あり" },
    no_char: { zh: "无人物", en: "No characters", ja: "人物なし" },
  },
  stats: {
    poster: { zh: "海报", en: "POSTERS", ja: "ポスター" },
    zine: { zh: "小志", en: "ZINES", ja: "小冊子" },
    street: { zh: "街景", en: "STREETS", ja: "街角" },
  },
  empty: {
    coming: { zh: "敬请期待", en: "Coming soon", ja: "近日公開" },
  },
  detail: {
    related: { zh: "同区更多", en: "More in this region", ja: "この地域のほか" },
    see_zine: { zh: "阅读小志", en: "Read mini-zine", ja: "小冊子を読む" },
    see_street: { zh: "关联街景", en: "Linked street scene", ja: "関連する街角" },
    origin: { zh: "出处", en: "Origin", ja: "由来" },
    flavors: { zh: "风味", en: "Flavors", ja: "味わい" },
    with_char: { zh: "有人物版", en: "With characters", ja: "人物版" },
    no_char: { zh: "无人物版", en: "No characters", ja: "人物なし版" },
    zine_soon: { zh: "小志阅读器（v0.5）", en: "Zine reader (v0.5)", ja: "小冊子リーダー（v0.5）" },
  },
  street: {
    scenes: { zh: "场景", en: "Scenes", ja: "シーン" },
    time: { zh: "时段", en: "Time", ja: "時間帯" },
    frame: { zh: "画幅", en: "Frame", ja: "画角" },
    day: { zh: "白天", en: "Day", ja: "昼" },
    night: { zh: "夜景", en: "Night", ja: "夜" },
    wide: { zh: "21:9", en: "21:9", ja: "21:9" },
    standard: { zh: "1:1", en: "1:1", ja: "1:1" },
    eat_here: { zh: "在此寻味", en: "Eat here", ja: "ここで味わう" },
    see_all: { zh: "全部海报", en: "All posters", ja: "すべてのポスター" },
    matrix: { zh: "矩阵", en: "Matrix", ja: "マトリクス" },
  },
  zine: {
    story: { zh: "故事", en: "Story", ja: "物語" },
    recipe: { zh: "做法", en: "Recipe", ja: "レシピ" },
    prev: { zh: "上一页", en: "Previous", ja: "前へ" },
    next: { zh: "下一页", en: "Next", ja: "次へ" },
    keyboard: { zh: "← → 翻页", en: "Use arrow keys to turn pages", ja: "← → でページめくり" },
  },
  search: {
    title: { zh: "搜索", en: "Search", ja: "検索" },
    placeholder: { zh: "搜菜名、地区、风味…", en: "Search dishes, regions, flavors…", ja: "料理・地域・味を検索…" },
    empty: { zh: "输入菜名、地区或风味", en: "Try a dish, region, or flavor", ja: "料理・地域・味を入力" },
    none: { zh: "无结果", en: "No matches", ja: "該当なし" },
    kind_dish: { zh: "菜品", en: "Dish", ja: "料理" },
    kind_region: { zh: "地区", en: "Region", ja: "地域" },
    kind_scene: { zh: "街景", en: "Scene", ja: "シーン" },
  },
  fav: {
    title: { zh: "我的收藏", en: "My favorites", ja: "お気に入り" },
    empty: { zh: "还没有收藏", en: "No favorites yet", ja: "まだお気に入りがありません" },
    saved: { zh: "已收藏", en: "Saved", ja: "保存しました" },
    removed: { zh: "已取消", en: "Removed", ja: "削除しました" },
  },
  /** v0.6 · alt-c landing */
  landing: {
    eat_here: { zh: "在此寻味", en: "Eat Here", ja: "ここで味わう" },
    read_zine: { zh: "阅读小志", en: "Read Zine", ja: "小冊子を読む" },
    view_street: { zh: "看街景", en: "View Street", ja: "街角を見る" },
    sunset: { zh: "落日", en: "Sunset", ja: "夕暮れ" },
    tonight: { zh: "今日推荐", en: "Tonight's Pick", ja: "今夜の一皿" },
    map_label: { zh: "世界图鉴", en: "World Atlas", ja: "世界図鑑" },
    spots: { zh: "道菜", en: "dishes", ja: "料理" },
    coords: { zh: "坐标", en: "Coords", ja: "座標" },
    region_tag: { zh: "精选城市", en: "Featured City", ja: "注目の街" },
    bottom_tagline_en: {
      zh: "拐进世界的每个街角，看食物与城市如何一起呼吸。",
      en: "Turn into every street corner of the world — taste the city, see the bite.",
      ja: "世界の街角を曲がるたび、味と街が立ち上がる。",
    },
  },
  /** v0.6.1 · alt-c gallery */
  gallery: {
    breadcrumb_posters: { zh: "海报", en: "POSTERS", ja: "ポスター" },
    dishes: { zh: "道菜", en: "DISHES", ja: "料理" },
    streets_count: { zh: "条街景", en: "STREETS", ja: "街角" },
    zines_count: { zh: "册", en: "BOOKS", ja: "冊" },
    filter_country: { zh: "国家", en: "Country", ja: "国" },
    filter_province: { zh: "省份", en: "Province", ja: "地域" },
    with_chef: { zh: "有人物", en: "With Chef", ja: "シェフあり" },
    no_char_short: { zh: "无人物", en: "No Char", ja: "人物なし" },
    linked_street: { zh: "关联街景", en: "Linked street", ja: "関連する街角" },
    save: { zh: "收藏", en: "Save", ja: "保存" },
    items: { zh: "项", en: "ITEMS", ja: "件" },
    regions_title: { zh: "省 / 都府 / 州", en: "Regions", ja: "地域" },
    tropical: { zh: "热带", en: "Tropical", ja: "熱帯" },
    featured_sub: {
      zh: "海岛上的清甜与椰香，白切皮爽、蘸料点睛。",
      en: "Tropical sweetness on the island — tender chicken, coconut notes, dipping sauce to finish.",
      ja: "島の甘さとココナッツ——皮はしっとり、タレが決め手。",
    },
  },
  settings: {
    title: { zh: "设置", en: "Settings", ja: "設定" },
    theme: { zh: "外观", en: "Appearance", ja: "表示" },
    theme_dark: { zh: "深色", en: "Dark", ja: "ダーク" },
    theme_light: { zh: "浅色", en: "Light", ja: "ライト" },
    theme_auto: { zh: "跟随系统", en: "System", ja: "システム" },
  },
  footer: {
    copy: {
      zh: "© 2026 Street Corner Foodie · 街角美食 · 原型 v0.6",
      en: "© 2026 Street Corner Foodie · prototype v0.6",
      ja: "© 2026 Street Corner Foodie · 街角グルメ · プロトタイプ v0.6",
    },
  },
} as const;

export function t(m: Multilang | undefined, lang: Lang): string {
  if (!m) return "";
  return m[lang] ?? m.zh ?? "";
}
'''

Path(__file__).resolve().parent.parent.joinpath("src/lib/i18n.ts").write_text(
    I18N, encoding="utf-8", newline="\n"
)
print("wrote i18n.ts")
