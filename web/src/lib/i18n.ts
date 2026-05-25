import type { Lang, Multilang } from "./types";

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
  brand: { zh: "街角食客", en: "Street Corner Foodie", ja: "街角フーディー" },
  tagline: {
    zh: "拐进世界的每个街角，看食物与城市如何一起呼吸。",
    en: "A diorama atlas of world street food & cityscapes",
    ja: "世界の街角を曲がるたび、味と街が立ち上がる。",
  },
  nav: {
    home: { zh: "首页", en: "Home", ja: "ホーム" },
    home_hint: { zh: "返回首页", en: "Back to home", ja: "ホームに戻る" },
    world: { zh: "世界", en: "World", ja: "世界" },
    poster: { zh: "海报", en: "Posters", ja: "ポスター" },
    zine: { zh: "小志", en: "Zines", ja: "小冊子" },
    street: { zh: "街景", en: "Streets", ja: "街角" },
    map: { zh: "地图", en: "Map", ja: "マップ" },
    world_atlas: { zh: "世界街景", en: "World Streets", ja: "世界の街角" },
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
    zine: { zh: "册", en: "ZINES", ja: "小冊子" },
    street: { zh: "街景", en: "STREETS", ja: "街角" },
  },
  empty: {
    coming: { zh: "敬请期待", en: "Coming soon", ja: "近日公開" },
  },
  flavor_axes: {
    aroma: { zh: "鲜香", en: "Aroma", ja: "旨み" },
    sweet: { zh: "甜蜜", en: "Sweet", ja: "甘み" },
    aftertaste: { zh: "回味", en: "Aftertaste", ja: "余韻" },
    spice: { zh: "辛辣", en: "Spice", ja: "辛さ" },
    richness: { zh: "醇厚", en: "Rich", ja: "コク" },
  },
  detail: {
    related: { zh: "同区更多", en: "More in this region", ja: "この地域のほか" },
    see_zine: { zh: "阅读小志", en: "Read mini-zine", ja: "小冊子を読む" },
    see_street: { zh: "关联街景", en: "Linked street scene", ja: "関連する街角" },
    download_poster: { zh: "下载海报", en: "Download poster", ja: "ポスターを保存" },
    origin: { zh: "出处", en: "Origin", ja: "由来" },
    flavors: { zh: "风味", en: "Flavors", ja: "味わい" },
    flavor_polygon: { zh: "风味多边形", en: "Flavor profile", ja: "味プロフィール" },
    with_char: { zh: "有人物版", en: "With characters", ja: "人物版" },
    no_char: { zh: "无人物版", en: "No characters", ja: "人物なし版" },
    zine_soon: { zh: "小志阅读器（v0.5）", en: "Zine reader (v0.5)", ja: "小冊子リーダー（v0.5）" },
  },
  street: {
    scenes: { zh: "场景", en: "Scenes", ja: "シーン" },
    time: { zh: "时段", en: "Time", ja: "時間帯" },
    frame: { zh: "画幅", en: "Frame", ja: "画角" },
    dawn: { zh: "黎明", en: "Dawn", ja: "夜明け" },
    day: { zh: "白天", en: "Day", ja: "昼" },
    sunset: { zh: "黄昏", en: "Sunset", ja: "夕暮れ" },
    night: { zh: "夜景", en: "Night", ja: "夜" },
    wide: { zh: "21:9 宽幅", en: "21:9 WIDE", ja: "21:9" },
    standard: { zh: "1:1 方图", en: "1:1 STANDARD", ja: "1:1" },
    sunset_wide: { zh: "黄昏宽幅", en: "SUNSET WIDE", ja: "夕暮れワイド" },
    eat_here: { zh: "在此寻味", en: "Eat here", ja: "ここで味わう" },
    eat_here_head_zh: { zh: "这条街吃什么", en: "Eat on this street", ja: "この街の味" },
    eat_here_head_en: { zh: "EAT HERE", en: "EAT HERE", ja: "EAT HERE" },
    eat_card_kinds: { zh: "海报 · 小志", en: "Poster · Zine", ja: "ポスター · 小冊子" },
    view_all: { zh: "查看全部", en: "View All", ja: "すべて見る" },
    see_all: { zh: "全部海报", en: "All posters", ja: "すべてのポスター" },
    matrix: { zh: "视角矩阵", en: "Matrix view", ja: "マトリクス" },
    matrix_view: { zh: "视角矩阵", en: "MATRIX VIEW", ja: "マトリクス" },
    export: { zh: "导出", en: "Export", ja: "エクスポート" },
    export_png: { zh: "PNG", en: "PNG", ja: "PNG" },
    export_wallpaper: { zh: "壁纸 4K", en: "Wallpaper 4K", ja: "壁紙 4K" },
    export_share: { zh: "分享", en: "Share", ja: "共有" },
    available: { zh: "已生成", en: "Available", ja: "生成済み" },
    photos_available: { zh: "张可用", en: "photos available", ja: "枚利用可" },
    photos_meta: {
      zh: "{unique} 张定稿 · {views} 视角",
      en: "{unique} assets · {views} views",
      ja: "定稿 {unique} · 視点 {views}",
    },
    character: { zh: "人物", en: "Character", ja: "人物" },
    minimap: { zh: "场景地图", en: "Scene map", ja: "シーンマップ" },
    panel_matrix: { zh: "视角矩阵", en: "MATRIX", ja: "マトリクス" },
    panel_geo: { zh: "涟漪地图", en: "GEO MAP", ja: "リップル" },
    geo_hint: {
      zh: "点击光点切换场景 · 滚轮缩放拖动",
      en: "Click ripples to switch scene · scroll to zoom",
      ja: "光点クリックでシーン切替 · スクロールでズーム",
    },
    side_panel: { zh: "街景工具", en: "Street tools", ja: "街景ツール" },
    zoom: { zh: "查看大图", en: "Full view", ja: "大画面" },
    zoom_close: { zh: "关闭", en: "Close", ja: "閉じる" },
    zoom_in: { zh: "放大", en: "Zoom in", ja: "拡大" },
    zoom_out: { zh: "缩小", en: "Zoom out", ja: "縮小" },
    zoom_reset: { zh: "重置", en: "Reset", ja: "リセット" },
    zoom_fullscreen: { zh: "全屏", en: "Fullscreen", ja: "全画面" },
    zoom_hint: {
      zh: "点击主图放大 · 滚轮或 ± 缩放",
      en: "Tap scene to zoom · scroll or ± to scale",
      ja: "シーンをタップで拡大 · スクロール／±で拡大縮小",
    },
    zoom_tap: { zh: "点击放大", en: "Tap to zoom", ja: "タップで拡大" },
  },
  zine: {
    story: { zh: "故事", en: "Story", ja: "物語" },
    recipe: { zh: "做法", en: "Recipe", ja: "レシピ" },
    prev: { zh: "上一页", en: "Previous", ja: "前へ" },
    next: { zh: "下一页", en: "Next", ja: "次へ" },
    keyboard: { zh: "← → 翻页", en: "Use arrow keys to turn pages", ja: "← → でページめくり" },
    download: { zh: "下载本页", en: "Download page", ja: "ページを保存" },
    other_in_region: { zh: "同区更多", en: "Other in region", ja: "この地域のほか" },
    about_dish: { zh: "本菜信息", en: "About this dish", ja: "この料理について" },
    zines_in_region: { zh: "本区读物", en: "books in this region", ja: "この地域の小冊子" },
    zoom: { zh: "放大查看", en: "Zoom in", ja: "拡大表示" },
    zoom_close: { zh: "关闭", en: "Close", ja: "閉じる" },
    zoom_in: { zh: "放大", en: "Zoom in", ja: "拡大" },
    zoom_out: { zh: "缩小", en: "Zoom out", ja: "縮小" },
    zoom_reset: { zh: "重置", en: "Reset", ja: "リセット" },
    zoom_hint: { zh: "点击主图放大 · 滚轮或 ± 缩放", en: "Tap to zoom · scroll or ± to scale", ja: "タップで拡大 · スクロール／±で拡大縮小" },
    page_of: { zh: "页", en: "Page", ja: "ページ" },
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
    street_spots: { zh: "{n} 处", en: "{n} spots", ja: "{n} 箇所" },
    read_zine: { zh: "阅读小志", en: "Read Zine", ja: "小冊子を読む" },
    read_short: { zh: "阅读", en: "Read", ja: "読む" },
    prev_slide: { zh: "上一张", en: "Previous image", ja: "前の画像" },
    next_slide: { zh: "下一张", en: "Next image", ja: "次の画像" },
    view_street: { zh: "看街景", en: "View Street", ja: "街角を見る" },
    sunset: { zh: "落日", en: "Sunset", ja: "夕暮れ" },
    tonight: { zh: "今日推荐", en: "Tonight's Pick", ja: "今夜の一皿" },
    map_label: { zh: "世界图鉴", en: "World Atlas", ja: "世界図鑑" },
    spots: { zh: "道菜", en: "dishes", ja: "料理" },
    coords: { zh: "坐标", en: "Coords", ja: "座標" },
    region_tag: { zh: "精选城市", en: "Featured City", ja: "注目の街" },
    country_ribbon_cn: {
      zh: "本期推荐 · TONIGHT'S SELECTION",
      en: "Tonight's Selection · 本期推荐",
      ja: "今期のおすすめ · TONIGHT'S SELECTION",
    },
    country_ribbon_jp: {
      zh: "本日推荐 · TONIGHT'S PICK",
      en: "Tonight's Pick · 本日のおすすめ",
      ja: "本日のおすすめ · TONIGHT'S PICK",
    },
    country_ribbon_us: {
      zh: "24 小时 · OPEN NOW",
      en: "Open 24 Hrs · Now Serving",
      ja: "24時間 · NOW SERVING",
    },
    grid_featured: { zh: "本期", en: "Featured", ja: "注目" },
    bottom_tagline_en: {
      zh: "拐进世界的每个街角，看食物与城市如何一起呼吸。",
      en: "Turn into every street corner of the world — taste the city, see the bite.",
      ja: "世界の街角を曲がるたび、味と街が立ち上がる。",
    },
    manifesto_kicker: {
      zh: "STREET · CORNER · FOODIE",
      en: "STREET · CORNER · FOODIE",
      ja: "STREET · CORNER · FOODIE",
    },
    manifesto_cta: {
      zh: "进入图鉴",
      en: "Enter atlas",
      ja: "図鑑へ",
    },
    /** Bento ad slot · distinct from #posters stat tile */
    manifesto_cta_map: {
      zh: "探索世界地图",
      en: "Explore world map",
      ja: "世界地図を探索",
    },
  },
  /** v0.6.1 · alt-c gallery */
  gallery: {
    breadcrumb_posters: { zh: "海报", en: "POSTERS", ja: "ポスター" },
    breadcrumb_zines: { zh: "MINI-ZINE", en: "MINI-ZINE", ja: "小冊子" },
    breadcrumb_streets: { zh: "街景", en: "STREETS", ja: "街角" },
    breadcrumb_map: { zh: "地图", en: "MAP", ja: "マップ" },
    map_hint: {
      zh: "点击涟漪光点进入街景 · 滚轮缩放拖动",
      en: "Click ripples to open street view · scroll to zoom",
      ja: "光点クリックで街角へ · スクロールでズーム",
    },
    map_hint_posters: {
      zh: "点击涟漪光点浏览该地区海报 · 滚轮缩放拖动",
      en: "Click ripples to browse posters · scroll to zoom",
      ja: "光点クリックでポスターへ · スクロールでズーム",
    },
    map_hint_country: {
      zh: "点击涟漪光点进入对应城市街景 · 滚轮缩放拖动",
      en: "Click ripples to open each city's street view · scroll to zoom",
      ja: "光点クリックで各都市の街角へ · スクロールでズーム",
    },
    map_legend_countries: {
      zh: "国家图例",
      en: "Countries",
      ja: "国別",
    },
    streets_meta: {
      zh: "{scenes} 个场景 · {photos} 张可浏览",
      en: "{scenes} scenes · {photos} photos",
      ja: "{scenes} シーン · {photos} 枚",
    },
    explore_scene: { zh: "进入探索", en: "Explore", ja: "探索へ" },
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
    atmosphere_hint: {
      zh: "Open-Meteo 实况 · 坐标为卡片标注城市（非您当前定位）· 点 + 看 5 日",
      en: "Open-Meteo live · city coords on chip (not your GPS) · + for 5-day",
      ja: "Open-Meteo 实况 · 表示都市の座標（現在地ではありません）· ＋で5日",
    },
    weather_expand: { zh: "展开 5 日预报", en: "Expand 5-day forecast", ja: "5日予報を開く" },
    weather_collapse: { zh: "收起预报", en: "Collapse forecast", ja: "予報を閉じる" },
    weather_live: { zh: "实时", en: "Live", ja: "ライブ" },
    weather_loading: { zh: "正在获取实况…", en: "Fetching live…", ja: "实况取得中…" },
    weather_unavailable: { zh: "实况暂不可用", en: "Live data unavailable", ja: "实况を取得できません" },
    weather_sunset: { zh: "日落", en: "Sunset", ja: "日没" },
    weather_local: { zh: "本地", en: "Local", ja: "現地" },
    weather_temp_poke: { zh: "戳一下气温", en: "Poke the temperature", ja: "気温をタップ" },
    atlas_fx_trigger: { zh: "特效", en: "FX", ja: "特效" },
    atlas_fx_aria: { zh: "播放特效", en: "Play FX", ja: "特效を再生" },
    weather_fx_watermelon_juicy: { zh: "多汁", en: "Juicy", ja: "ジューシー" },
    weather_fx_watermelon_sweet: { zh: "清甜", en: "Sweet", ja: "甘い" },
    weather_fx_humid_hot: { zh: "热气", en: "Steamy", ja: "むわっ" },
    weather_fx_humid_sticky: { zh: "黏糊", en: "Sticky", ja: "ねばねば" },
    weather_fx_sand_grain: { zh: "颗粒感", en: "Gritty", ja: "砂っぽい" },
    weather_fx_sand_burn: { zh: "灼烧", en: "Scorching", ja: "灼熱" },
    weather_fx_gel_label: { zh: "冰块爆炸", en: "Ice burst", ja: "氷ブレイク" },
    weather_fx_cosmic_label: { zh: "宇宙大爆炸", en: "Cosmic bang", ja: "宇宙大爆発" },
    weather_fx_sun_label: { zh: "太阳照射", en: "Sunbeam", ja: "太陽の照射" },
    weather_fx_sun_warm: { zh: "暖洋洋", en: "Warm glow", ja: "ぽかぽか" },
    weather_fx_sun_glow: { zh: "金光", en: "Golden light", ja: "金色の光" },
    weather_ambient_hint: {
      zh: "长按卡片可听夜境白噪音 · 展开预报同样会播放",
      en: "Long-press for calm night ambience · expand forecast too",
      ja: "長押しで静かな夜の環境音 · 予報を開いても再生",
    },
    weather_mood_twilight_fading: {
      zh: "距离落日余晖完全消失，还有 {minutes} 分钟。",
      en: "{minutes} min until the last glow fades away.",
      ja: "夕焼けの余韻が消えるまで、あと {minutes} 分。",
    },
    weather_mood_ice_cola: {
      zh: "适合下班去喝一杯冰可乐的气温。",
      en: "Cold cola weather — perfect for clocking out.",
      ja: "退勤後のアイスコーラにぴったりな気温。",
    },
    weather_mood_iced_tea: {
      zh: "来一杯加冰手打柠檬茶，刚好。",
      en: "Iced tea weather — just right.",
      ja: "氷入りレモンティーが欲しくなる温度。",
    },
    weather_mood_cold_drink: {
      zh: "窗边有风，适合握一握冰凉的杯壁。",
      en: "Breeze by the window — time for something ice-cold.",
      ja: "窓辺の風に、冷えたグラスを。",
    },
    weather_mood_cozy_cold: {
      zh: "把领口裹紧一点，呼出的白雾也算浪漫。",
      en: "Bundle up — breath mist in the cold has its own romance.",
      ja: "襟を立てて——白い息も、冬のロマンス。",
    },
    weather_mood_rain: {
      zh: "雨点敲打屋檐，适合慢走一段。",
      en: "Rain on the eaves — worth a slower walk.",
      ja: "雨音が軒を叩く——ゆっくり歩こう。",
    },
    weather_mood_dawn: {
      zh: "天将亮未亮，街角还留着昨夜的余温。",
      en: "Almost dawn — the corner still holds last night's warmth.",
      ja: "明け方手前——街角に昨夜のぬくもりが残る。",
    },
    weather_mood_starry: {
      zh: "星星就位，适合把晚风多听一分钟。",
      en: "Stars are out — stay one minute longer in the breeze.",
      ja: "星が揃った——夜風をもう一分だけ。",
    },
    weather_mood_mild_stroll: {
      zh: "不冷不热，拐进任意一家小馆都不会错。",
      en: "Not too hot, not too cold — any corner spot will do.",
      ja: "寒くも暑くもない——どの店に入っても正解。",
    },
    search_here: { zh: "搜索", en: "Search", ja: "検索" },
    load_more_n: { zh: "再显示 {n} 项", en: "Load {n} more", ja: "あと {n} 件" },
    show_all: { zh: "显示全部", en: "Show all", ja: "すべて表示" },
    showing_of: {
      zh: "已显示 {start}–{end} / {total}",
      en: "Showing {start}–{end} of {total}",
      ja: "{start}–{end} / {total} 件を表示",
    },
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
      zh: "© 2026 Street Corner Foodie · 街角食客 · 原型 v0.6",
      en: "© 2026 Street Corner Foodie · prototype v0.6",
      ja: "© 2026 Street Corner Foodie · 街角フーディー · プロトタイプ v0.6",
    },
  },
} as const;

export function t(m: Multilang | undefined, lang: Lang): string {
  if (!m) return "";
  return m[lang] ?? m.zh ?? "";
}

/** Zine reader toolbar page indicator (zh avoids English "Page"). */
export function formatZinePageLabel(lang: Lang, index: number, total: number): string {
  const cur = String(index + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");
  if (lang === "en") return `${UI.zine.page_of.en} ${cur} / ${tot}`;
  if (lang === "ja") return `${cur} / ${tot} ${UI.zine.page_of.ja}`;
  return `第 ${cur} / ${tot} ${UI.zine.page_of.zh}`;
}
