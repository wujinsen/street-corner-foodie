import { scfSourceExists } from "./scf-image";
import type { CountryId, Multilang } from "./types";

export type StreetTime = "day" | "night";
export type StreetFrame = "wide" | "standard";
/** UI mood (may map to day assets + CSS grade). */
export type StreetMood = "dawn" | "day" | "sunset" | "night";
export type StreetFrameMode = StreetFrame | "sunset_wide";

export interface StreetScene {
  id: string;
  name: Multilang;
  tag: Multilang;
  posterSlugs?: string[];
  /** Geographic position on region mini-map (0–100). */
  mapPin?: { x: number; y: number };
  /** WGS84 [lng, lat] for ECharts geo (optional; else derived from mapPin) */
  geo?: [number, number];
  /** Override region asset subdir (e.g. cn/hainan/sanya/ for Sanya scenes). */
  path?: string;
  /** Override region filename pattern for this scene. */
  filePattern?: (sceneId: string) => string;
}

export interface StreetViewSelection {
  mood: StreetMood;
  frame: StreetFrameMode;
}

export interface StreetRegionConfig {
  path: string;
  scenes: StreetScene[];
  filePattern: (sceneId: string) => string;
  /** Initial scene when URL has no `scene` param. */
  defaultSceneId?: string;
  /** Initial mood/frame when URL omits `time` / `frame`. */
  defaultView?: StreetViewSelection;
}

const A_STREET = "/asserts/Street View/";

/** 街景 Web / 探索器默认视角（无 URL `time` 时）。优先夜景 wide。 */
export const STREET_VIEW_DEFAULT_MOOD: StreetMood = "night";
export const STREET_VIEW_DEFAULT_FRAME: StreetFrameMode = "wide";
export const STREET_VIEW_DEFAULT_VIEW: StreetViewSelection = {
  mood: STREET_VIEW_DEFAULT_MOOD,
  frame: STREET_VIEW_DEFAULT_FRAME,
};

/** 地区级可覆盖；未配置则用 {@link STREET_VIEW_DEFAULT_VIEW}。 */
export function getStreetDefaultView(config?: StreetRegionConfig | null): StreetViewSelection {
  return config?.defaultView ?? STREET_VIEW_DEFAULT_VIEW;
}

function streetAssetUrl(
  config: StreetRegionConfig,
  sceneId: string,
  sel: StreetViewSelection,
): string | null {
  const assets = resolveStreetAssets(sel);
  return streetImageUrl(config, sceneId, assets.time, assets.frame);
}

function streetAssetUrlWithFallback(
  config: StreetRegionConfig,
  sceneId: string,
  sel: StreetViewSelection,
): string | null {
  const url = streetAssetUrl(config, sceneId, sel);
  if (url && scfSourceExists(url)) return url;
  if (url?.endsWith(".png")) {
    const legacy = url.replace(/\.png$/, "_no_char.png");
    if (scfSourceExists(legacy)) return legacy;
  }
  return null;
}

function firstExistingStreetUrl(
  config: StreetRegionConfig,
  sceneId: string,
  tries: StreetViewSelection[],
): string | null {
  for (const t of tries) {
    const url = streetAssetUrlWithFallback(config, sceneId, t);
    if (url) return url;
  }
  return null;
}

/** 无 URL time/frame 时：该场景有 night_wide 则默认夜景 wide。 */
export function pickDefaultStreetViewForScene(
  config: StreetRegionConfig,
  sceneId: string,
): StreetViewSelection {
  const fallback = getStreetDefaultView(config);
  const nightWide = streetAssetUrlWithFallback(config, sceneId, { mood: "night", frame: "wide" });
  if (nightWide) {
    return { mood: "night", frame: "wide" };
  }
  return fallback;
}

/** 解析街景 URL：仅 manifest 存在的 PNG；夜景 mood 时先 night_wide 再回退白天。 */
export function resolveStreetImageUrl(
  config: StreetRegionConfig,
  sceneId: string,
  sel: StreetViewSelection,
): string | null {
  const tries: StreetViewSelection[] = [];
  const push = (t: StreetViewSelection): void => {
    const key = `${t.mood}:${t.frame}`;
    if (!tries.some((x) => `${x.mood}:${x.frame}` === key)) tries.push(t);
  };

  if (sel.mood === "night") {
    push({ mood: "night", frame: sel.frame });
    if (sel.frame !== "wide") push({ mood: "night", frame: "wide" });
    push(sel);
    push({ mood: "day", frame: sel.frame });
    push({ mood: "day", frame: "wide" });
    return firstExistingStreetUrl(config, sceneId, tries);
  }

  push(sel);
  if (sel.mood !== "day") push({ mood: "day", frame: sel.frame });
  push({ mood: "day", frame: "wide" });
  push({ mood: "night", frame: "wide" });
  return firstExistingStreetUrl(config, sceneId, tries);
}

/** 列表缩略图 / OG：优先 `night_wide`，无则回退 `day_wide`。 */
export function streetPreferredImageUrl(
  config: StreetRegionConfig,
  sceneId: string,
  frame: StreetFrame | StreetFrameMode = "wide",
): string | null {
  const frameMode: StreetFrameMode = frame === "standard" ? "standard" : "wide";
  return resolveStreetImageUrl(config, sceneId, { mood: "night", frame: frameMode });
}

export const STREET_REGIONS: Partial<Record<CountryId, Record<string, StreetRegionConfig>>> = {
  cn: {
    hainan: {
      path: "cn/hainan/haikou/",
      defaultSceneId: "bay",
      defaultView: { mood: "night", frame: "wide" },
      scenes: [
        {
          id: "qilou",
          name: { zh: "骑楼老街", en: "Qilou Arcade", ja: "騎楼老街" },
          tag: { zh: "百年商埠", en: "Century arcade", ja: "百年商埠" },
          posterSlugs: ["laobacha", "hainan_fen", "haikou_zhazha", "yezi_ji", "qingbuliang", "yupian_zhou"],
          mapPin: { x: 52, y: 42 },
          geo: [110.339, 20.045],
        },
        {
          id: "fucheng",
          name: { zh: "府城", en: "Fucheng", ja: "府城" },
          tag: { zh: "明清古城", en: "Ming-Qing town", ja: "明清古城" },
          posterSlugs: ["wenchang_jifan", "lingshui_suanfen"],
          mapPin: { x: 56, y: 54 },
          geo: [110.354, 20.008],
        },
        {
          id: "laobacha",
          name: { zh: "老爸茶", en: "Laobacha", ja: "老爸茶" },
          tag: { zh: "早茶街巷", en: "Morning-tea lanes", ja: "朝茶の路地" },
          posterSlugs: ["laobacha", "qingbuliang"],
          mapPin: { x: 50, y: 47 },
          geo: [110.328, 20.032],
        },
        {
          id: "bay",
          name: { zh: "海口湾", en: "Haikou Bay", ja: "海口湾" },
          tag: { zh: "落日栈桥", en: "Sunset pier", ja: "夕景桟橋" },
          posterSlugs: ["yezi_ji", "qingbuliang"],
          mapPin: { x: 42, y: 39 },
          geo: [110.298, 20.055],
        },
        {
          id: "jiari_haitan",
          name: { zh: "假日海滩", en: "Holiday Beach", ja: "ホリデービーチ" },
          tag: { zh: "椰风海岸", en: "Palm coast", ja: "椰子の海岸" },
          posterSlugs: ["yezi_ji", "qingbuliang"],
          mapPin: { x: 30, y: 48 },
          geo: [110.245, 20.026],
        },
        {
          id: "wanlv",
          name: { zh: "湾绿", en: "Bay Park", ja: "湾緑" },
          tag: { zh: "城市绿廊", en: "Green corridor", ja: "緑の回廊" },
          posterSlugs: ["qingbuliang"],
          mapPin: { x: 59, y: 51 },
          geo: [110.368, 20.018],
        },
        {
          id: "sanyawan",
          name: { zh: "三亚湾", en: "Sanya Bay", ja: "三亚湾" },
          tag: { zh: "椰梦长廊", en: "Coconut corridor", ja: "椰夢長廊" },
          posterSlugs: ["qingbuliang", "hele_xie", "yezi_ji"],
          mapPin: { x: 28, y: 88 },
          geo: [109.451, 18.296],
          path: "cn/hainan/sanya/",
          filePattern: (id) => `sanya_${id}_{TIME}_{FRAME}.png`,
        },
        {
          id: "dadonghai",
          name: { zh: "大东海", en: "Dadonghai", ja: "大東海" },
          tag: { zh: "月牙海湾", en: "Crescent bay", ja: "月牙湾" },
          posterSlugs: ["qingbuliang", "hele_xie", "yezi_ji"],
          mapPin: { x: 34, y: 92 },
          geo: [109.528, 18.221],
          path: "cn/hainan/sanya/",
          filePattern: (id) => `sanya_${id}_{TIME}_{FRAME}.png`,
        },
        {
          id: "riyue_bay",
          name: { zh: "日月湾", en: "Riyue Bay", ja: "日月湾" },
          tag: { zh: "冲浪海湾", en: "Surf bay", ja: "サーフ湾" },
          posterSlugs: ["houan_fen", "hele_xie", "qingbuliang", "yezi_ji"],
          mapPin: { x: 62, y: 78 },
          geo: [110.286, 18.531],
          path: "cn/hainan/wanning/",
          filePattern: () => `wanning_riyue_bay_{TIME}_{FRAME}.png`,
        },
        {
          id: "rainforest",
          name: { zh: "五指山雨林", en: "Wuzhi Rainforest", ja: "五指山雨林" },
          tag: { zh: "热带五峰", en: "Tropical peaks", ja: "熱帯五峰" },
          posterSlugs: ["lijia_zhutongfan", "shanlan_jiu", "wuse_fan", "qingbuliang"],
          mapPin: { x: 48, y: 62 },
          geo: [109.702, 18.876],
          path: "cn/hainan/wuzhishan/",
          filePattern: () => `wuzhishan_rainforest_{TIME}_{FRAME}.png`,
        },
        {
          id: "fenjiezhou",
          name: { zh: "分界洲岛", en: "Fenjiezhou Island", ja: "分界洲島" },
          tag: { zh: "离岛潜水", en: "Island diving", ja: "離島ダイビング" },
          posterSlugs: ["lingshui_suanfen", "qingbuliang", "yezi_ji", "hele_xie"],
          mapPin: { x: 58, y: 86 },
          geo: [110.197, 18.581],
          path: "cn/hainan/lingshui/",
          filePattern: () => `lingshui_fenjiezhou_{TIME}_{FRAME}.png`,
        },
        {
          id: "dongjiao_yelin",
          name: { zh: "东郊椰林", en: "Dongjiao Coconut Grove", ja: "東郊ココナッツ林" },
          tag: { zh: "滨海椰乡", en: "Coastal coconuts", ja: "浜辺の椰林" },
          posterSlugs: ["baoluo_fen", "wenchang_jifan", "yezi_ji", "qingbuliang", "yezi_shui"],
          mapPin: { x: 72, y: 52 },
          geo: [110.827, 19.548],
          path: "cn/hainan/wenchang/",
          filePattern: () => `wenchang_dongjiao_yelin_{TIME}_{FRAME}.png`,
        },
        {
          id: "fushan_coffee",
          name: { zh: "福山咖啡镇", en: "Fushan Coffee Town", ja: "福山コーヒー町" },
          tag: { zh: "咖啡风情", en: "Coffee culture", ja: "コーヒー文化" },
          posterSlugs: ["fushan_kafei", "hainan_tanshao_kafei", "qingbuliang", "laobacha"],
          mapPin: { x: 38, y: 48 },
          geo: [110.012, 19.918],
          path: "cn/hainan/chengmai/",
          filePattern: () => `chengmai_fushan_coffee_{TIME}_{FRAME}.png`,
        },
      ],
      filePattern: (id) => `haikou_${id}_{TIME}_{FRAME}.png`,
    },
    hebei: {
      path: "cn/hebei/shijiazhuang/",
      scenes: [
        {
          id: "zhengding",
          name: { zh: "正定古城", en: "Zhengding", ja: "正定古城" },
          tag: { zh: "千年古郡", en: "Ancient town", ja: "千年古郡" },
          posterSlugs: ["cn_hebei_bannianmian"],
          mapPin: { x: 36, y: 40 },
          geo: [114.571, 38.146],
        },
        {
          id: "meiji_yeshi",
          name: { zh: "美吉夜市", en: "Meiji Night Market", ja: "美吉夜市" },
          tag: { zh: "灯火夜食", en: "Night eats", ja: "夜の屋台" },
          mapPin: { x: 52, y: 48 },
          geo: [114.514, 38.042],
        },
        {
          id: "bannianmian",
          name: { zh: "板面街", en: "Bannianmian St.", ja: "板麺通り" },
          tag: { zh: "面食日常", en: "Noodle daily", ja: "麺の日常" },
          posterSlugs: ["cn_hebei_bannianmian"],
          mapPin: { x: 64, y: 56 },
          geo: [114.478, 38.038],
        },
      ],
      filePattern: (id) => `cn_hebei_shijiazhuang_${id}_{TIME}_{FRAME}.png`,
    },
    beijing: {
      path: "cn/beijing/",
      scenes: [
        {
          id: "nanluoguxiang",
          name: { zh: "南锣鼓巷", en: "Nanluoguxiang", ja: "南鑼鼓巷" },
          tag: { zh: "胡同小吃", en: "Hutong bites", ja: "胡同の味" },
          posterSlugs: [
            "zhajiangmian",
            "beijing_kaoya",
            "luzhu_huoshao",
            "chaogan",
            "douzhi_jiaoquan",
          ],
          mapPin: { x: 52, y: 44 },
          geo: [116.403, 39.936],
        },
      ],
      filePattern: (id) => `cn_beijing_${id}_{TIME}_{FRAME}.png`,
    },
    zhejiang: {
      path: "cn/zhejiang/hangzhou/",
      scenes: [
        {
          id: "xihu",
          name: { zh: "西湖湖滨", en: "West Lake", ja: "西湖" },
          tag: { zh: "醋鱼与龙井", en: "Vinegar fish & tea", ja: "酢魚と龍井" },
          posterSlugs: ["xihu_cuyu"],
          mapPin: { x: 44, y: 46 },
          geo: [120.148, 30.242],
        },
        {
          id: "hefang",
          name: { zh: "河坊街", en: "Hefang Street", ja: "河坊街" },
          tag: { zh: "南宋御街", en: "Song-era lane", ja: "南宋の通り" },
          posterSlugs: ["dongpo_rou", "xihu_cuyu"],
          mapPin: { x: 58, y: 52 },
          geo: [120.169, 30.242],
        },
      ],
      filePattern: (id) => `cn_zhejiang_hangzhou_${id}_{TIME}_{FRAME}.png`,
    },
    shaanxi: {
      path: "cn/shaanxi/xian/",
      defaultSceneId: "changan",
      scenes: [
        {
          id: "changan",
          name: { zh: "回民街", en: "Muslim Quarter", ja: "回民街" },
          tag: { zh: "肉夹馍与泡馍", en: "Roujiamo & paomo", ja: "肉夹馍" },
          mapPin: { x: 42, y: 44 },
          geo: [108.942, 34.265],
        },
        {
          id: "tang_changan",
          name: { zh: "大唐不夜城", en: "Tang Night City", ja: "大唐不夜城" },
          tag: { zh: "唐风夜市", en: "Tang night market", ja: "唐の夜市" },
          mapPin: { x: 58, y: 52 },
          geo: [108.958, 34.212],
        },
      ],
      filePattern: (id) => `cn_shaanxi_xian_${id}_{TIME}_{FRAME}.png`,
    },
    xizang: {
      path: "cn/xizang/lhasa/",
      defaultSceneId: "potala",
      defaultView: { mood: "night", frame: "wide" },
      scenes: [
        {
          id: "potala",
          name: { zh: "布达拉宫", en: "Potala Palace", ja: "ポタラ宮" },
          tag: { zh: "高原广场", en: "High-plateau plaza", ja: "高原の広場" },
          posterSlugs: ["zanba", "suyoucha", "tiancha", "qingke_jiu"],
          mapPin: { x: 50, y: 38 },
          geo: [91.117, 29.657],
        },
      ],
      filePattern: (id) => `cn_xizang_lhasa_${id}_{TIME}_{FRAME}.png`,
    },
  },
  jp: {
    tokyo: {
      path: "jp/tokyo/",
      scenes: [
        { id: "shinjuku", name: { zh: "新宿", en: "Shinjuku", ja: "新宿" }, tag: { zh: "霓虹都心", en: "Neon heart", ja: "ネオンの中心" }, posterSlugs: ["ramen"], geo: [139.700, 35.694] },
        { id: "shibuya", name: { zh: "涩谷", en: "Shibuya", ja: "渋谷" }, tag: { zh: "十字路口", en: "Crossing", ja: "スクランブル" }, posterSlugs: ["sushi"], geo: [139.702, 35.658] },
        { id: "ikebukuro", name: { zh: "池袋", en: "Ikebukuro", ja: "池袋" }, tag: { zh: "亚文化街", en: "Subculture", ja: "サブカル" }, geo: [139.71, 35.729] },
        { id: "akihabara", name: { zh: "秋叶原", en: "Akihabara", ja: "秋葉原" }, tag: { zh: "电器与漫", en: "Electric town", ja: "電気街" }, geo: [139.772, 35.702] },
        { id: "asakusa", name: { zh: "浅草", en: "Asakusa", ja: "浅草" }, tag: { zh: "古寺下町", en: "Old town", ja: "下町" }, posterSlugs: ["tempura"], geo: [139.797, 35.715] },
        { id: "harajuku", name: { zh: "原宿", en: "Harajuku", ja: "原宿" }, tag: { zh: "潮流前线", en: "Fashion", ja: "ファッション" }, geo: [139.703, 35.67] },
        { id: "ueno", name: { zh: "上野", en: "Ueno", ja: "上野" }, tag: { zh: "市场公园", en: "Market & park", ja: "アメ横と公園" }, geo: [139.774, 35.714] },
        { id: "tsukiji", name: { zh: "筑地", en: "Tsukiji", ja: "築地" }, tag: { zh: "鱼市早食", en: "Fish market", ja: "魚河岸" }, posterSlugs: ["sushi"], geo: [139.771, 35.665] },
        { id: "denshi_senmon", name: { zh: "电子学院街", en: "Denshi School", ja: "電子専門学校" }, tag: { zh: "大久保学区", en: "School area", ja: "大久保学校街" }, geo: [139.7, 35.701] },
      ],
      filePattern: (id) => `tokyo_${id}_{TIME}_{FRAME}.png`,
    },
    fuji: {
      path: "jp/fuji/",
      scenes: [
        {
          id: "kawaguchiko",
          name: { zh: "河口湖", en: "Kawaguchiko", ja: "河口湖" },
          tag: { zh: "富士山下", en: "Below Fuji", ja: "富士山麓" },
          geo: [138.76, 35.5],
        },
      ],
      filePattern: (id) => `jp_fuji_${id}_{TIME}_{FRAME}.png`,
    },
  },
  us: {
    ny: {
      path: "us/nyc/",
      scenes: [
        {
          id: "times_square",
          name: { zh: "时代广场", en: "Times Square", ja: "タイムズスクエア" },
          tag: { zh: "餐车霓虹", en: "Carts & neon", ja: "屋台とネオン" },
          posterSlugs: ["ny_pizza", "hot_dog"],
          geo: [-73.986, 40.758],
        },
        {
          id: "lower_manhattan",
          name: { zh: "下城·金融区", en: "Lower Manhattan", ja: "ロウアーマンハッタン" },
          tag: { zh: "百吉饼与 deli", en: "Bagels & deli", ja: "ベーグルとデリ" },
          posterSlugs: ["pretzel"],
          geo: [-74.009, 40.708],
        },
        {
          id: "brooklyn_dumbo",
          name: { zh: "布鲁克林·DUMBO", en: "Brooklyn DUMBO", ja: "ブルックリン DUMBO" },
          tag: { zh: "大桥下汉堡", en: "Bridge-side burgers", ja: "橋の下のバーガー" },
          posterSlugs: ["cheeseburger", "ny_pizza"],
          geo: [-73.99, 40.703],
        },
      ],
      filePattern: (id) => `us_nyc_${id}_{TIME}_{FRAME}.png`,
    },
    la: {
      path: "us/la/",
      scenes: [
        {
          id: "hollywood",
          name: { zh: "好莱坞", en: "Hollywood", ja: "ハリウッド" },
          tag: { zh: "星光大道", en: "Walk of Fame", ja: "ウォーク・オブ・フェーム" },
          posterSlugs: ["tacos"],
          geo: [-118.326, 34.092],
        },
        {
          id: "venice_beach",
          name: { zh: "威尼斯海滩", en: "Venice Beach", ja: "ヴェニスビーチ" },
          tag: { zh: "西海岸 tacos", en: "West-coast tacos", ja: "西海岸タコス" },
          posterSlugs: ["fish_tacos"],
          geo: [-118.469, 33.985],
        },
        {
          id: "grand_central_market",
          name: { zh: "中央市场", en: "Grand Central Market", ja: "グランドセントラルマーケット" },
          tag: { zh: "多族裔食摊", en: "Global food hall", ja: "多民族フードホール" },
          posterSlugs: ["fish_tacos", "tacos"],
          geo: [-118.249, 34.05],
        },
      ],
      filePattern: (id) => `us_la_${id}_{TIME}_{FRAME}.png`,
    },
    tx: {
      path: "us/tx/",
      scenes: [
        {
          id: "austin_pit",
          name: { zh: "奥斯汀烟熏屋", en: "Austin BBQ Pit", ja: "オースティン BBQ" },
          tag: { zh: "牛腩与烟筒", en: "Brisket & smokers", ja: "ブリスケットと煙" },
          posterSlugs: ["texas_brisket"],
          geo: [-97.743, 30.267],
        },
        {
          id: "lockhart_main",
          name: { zh: "洛克哈特老城", en: "Lockhart Main St.", ja: "ロックハート本通り" },
          tag: { zh: "德州 BBQ 圣地", en: "BBQ holy ground", ja: "BBQ の聖地" },
          posterSlugs: ["bbq_ribs", "texas_brisket"],
          geo: [-97.67, 29.885],
        },
        {
          id: "bbq_trail",
          name: { zh: "BBQ 餐车列", en: "BBQ Trail", ja: "BBQ トレイル" },
          tag: { zh: "烟熏摊一排", en: "Smoker row", ja: "スモーカー列" },
          posterSlugs: ["bbq_ribs", "texas_brisket"],
          geo: [-97.79, 30.25],
        },
      ],
      filePattern: (id) => `us_tx_${id}_{TIME}_{FRAME}.png`,
    },
    nola: {
      path: "us/nola/",
      scenes: [
        {
          id: "french_quarter",
          name: { zh: "法国区", en: "French Quarter", ja: "フレンチクォーター" },
          tag: { zh: "铁阳台·石板街", en: "Balconies & bricks", ja: "鉄バルコニー" },
          posterSlugs: ["gumbo"],
          geo: [-90.064, 29.958],
        },
        {
          id: "bourbon_street",
          name: { zh: "波本街", en: "Bourbon Street", ja: "バーボンストリート" },
          tag: { zh: "霓虹夜生活", en: "Neon nightlife", ja: "ネオンナイト" },
          posterSlugs: ["beignets", "gumbo"],
          geo: [-90.069, 29.96],
        },
        {
          id: "jackson_square",
          name: { zh: "杰克逊广场", en: "Jackson Square", ja: "ジャクソンスクエア" },
          tag: { zh: "广场与咖啡", en: "Square & café", ja: "広場とカフェ" },
          posterSlugs: ["beignets"],
          geo: [-90.063, 29.957],
        },
      ],
      filePattern: (id) => `us_nola_${id}_{TIME}_{FRAME}.png`,
    },
  },
  fr: {
    paris: {
      path: "france/paris/",
      scenes: [
        {
          id: "eiffel_tower",
          name: { zh: "埃菲尔铁塔", en: "Eiffel Tower", ja: "エッフェル塔" },
          tag: { zh: "塞纳左岸", en: "Left Bank", ja: "セーヌ左岸" },
          posterSlugs: ["macaron", "croissant"],
          geo: [2.294, 48.858],
        },
        {
          id: "arc_de_triomphe",
          name: { zh: "凯旋门", en: "Arc de Triomphe", ja: "凱旋門" },
          tag: { zh: "香榭大道", en: "Champs-Élysées", ja: "シャンゼリゼ" },
          posterSlugs: ["baguette"],
          geo: [2.295, 48.874],
        },
      ],
      filePattern: (id) => `fr_paris_${id}_{TIME}_{FRAME}.png`,
    },
  },
  uk: {
    london: {
      path: "united_kingdom/london/",
      scenes: [
        {
          id: "thames_river",
          name: { zh: "泰晤士河", en: "Thames River", ja: "テムズ川" },
          tag: { zh: "河畔 pub", en: "Riverside pubs", ja: "川岸のパブ" },
          posterSlugs: ["full_english_breakfast", "afternoon_tea"],
          geo: [-0.121, 51.507],
        },
      ],
      filePattern: (id) => `uk_london_${id}_{TIME}_{FRAME}.png`,
    },
  },
  de: {
    cologne: {
      path: "germany/cologne/",
      scenes: [
        {
          id: "rhine_river",
          name: { zh: "莱茵河", en: "Rhine River", ja: "ライン川" },
          tag: { zh: "大教堂与 Biergarten", en: "Cathedral & beer garden", ja: "大聖堂とビアガルテン" },
          geo: [6.96, 50.941],
        },
      ],
      filePattern: (id) => `de_cologne_${id}_{TIME}_{FRAME}.png`,
    },
  },
  za: {
    south_africa: {
      path: "south_africa/agulhas/",
      defaultSceneId: "cape_of_good_hope",
      defaultView: { mood: "night", frame: "wide" },
      scenes: [
        {
          id: "cape_agulhas",
          name: { zh: "厄加勒斯角", en: "Cape Agulhas", ja: "アグラス岬" },
          tag: { zh: "非洲最南端", en: "Southern tip", ja: "最南端" },
          geo: [20.014, -34.832],
          path: "south_africa/agulhas/",
          filePattern: () => `za_cape_agulhas_{TIME}_{FRAME}.png`,
        },
        {
          id: "cape_of_good_hope",
          name: { zh: "好望角", en: "Cape of Good Hope", ja: "喜望峰" },
          tag: { zh: "Cape Point", en: "Cape Point", ja: "ケープポイント" },
          geo: [18.489, -34.357],
          path: "south_africa/good_hope/",
          filePattern: () => `za_cape_of_good_hope_{TIME}_{FRAME}.png`,
        },
      ],
      filePattern: (id) => `za_${id}_{TIME}_{FRAME}.png`,
    },
  },
  antarctica: {
    antarctica: {
      path: "antarctica/paradise_harbor/",
      defaultSceneId: "paradise_harbor",
      defaultView: { mood: "night", frame: "wide" },
      scenes: [
        {
          id: "paradise_harbor",
          name: { zh: "天堂湾", en: "Paradise Harbor", ja: "パラダイス湾" },
          tag: { zh: "南极半岛", en: "Antarctic Peninsula", ja: "南極半島" },
          geo: [-62.55, -64.75],
        },
      ],
      filePattern: () => `antarctica_paradise_harbor_{TIME}_{FRAME}.png`,
    },
  },
  arctic: {
    arctic: {
      path: "arctic/north_pole/",
      defaultSceneId: "north_pole",
      defaultView: { mood: "night", frame: "wide" },
      scenes: [
        {
          id: "north_pole",
          name: { zh: "地理北极点", en: "Geographic North Pole", ja: "地理北極点" },
          tag: { zh: "90°N 浮冰", en: "90°N sea ice", ja: "北緯90度" },
          geo: [0, 89.5],
        },
      ],
      filePattern: () => `arctic_north_pole_{TIME}_{FRAME}.png`,
    },
  },
};

/** Poster / zine slug → street scene id (optional curated link). */
export const DISH_STREET_SCENE: Partial<Record<CountryId, Record<string, Record<string, string>>>> = {
  cn: {
    hainan: {
      wenchang_jifan: "fucheng",
      qingbuliang: "qilou",
      yezi_ji: "qilou",
      laobacha: "laobacha",
      lingshui_suanfen: "fucheng",
      hele_xie: "sanyawan",
    },
    zhejiang: { xihu_cuyu: "xihu", dongpo_rou: "hefang" },
    beijing: {
      zhajiangmian: "nanluoguxiang",
      beijing_kaoya: "nanluoguxiang",
      luzhu_huoshao: "nanluoguxiang",
      chaogan: "nanluoguxiang",
      douzhi_jiaoquan: "nanluoguxiang",
    },
    xizang: {
      zanba: "potala",
      suyoucha: "potala",
      tiancha: "potala",
      qingke_jiu: "potala",
    },
  },
  jp: {
    tokyo: { ramen: "shinjuku", sushi: "tsukiji", tempura: "asakusa", takoyaki: "shibuya" },
  },
  us: {
    ny: {
      cheeseburger: "brooklyn_dumbo",
      ny_pizza: "times_square",
      hot_dog: "times_square",
      pretzel: "lower_manhattan",
    },
    la: {
      fish_tacos: "venice_beach",
      tacos: "hollywood",
    },
    tx: {
      texas_brisket: "austin_pit",
      bbq_ribs: "lockhart_main",
    },
    nola: {
      gumbo: "french_quarter",
      beignets: "jackson_square",
    },
  },
  fr: {
    paris: {
      macaron: "eiffel_tower",
      croissant: "eiffel_tower",
      baguette: "arc_de_triomphe",
    },
  },
  uk: {
    london: {
      full_english_breakfast: "thames_river",
      afternoon_tea: "thames_river",
    },
  },
};

/** @deprecated Use DISH_STREET_SCENE */
export const POSTER_STREET_SCENE = DISH_STREET_SCENE;

export function getStreetConfig(countryId: CountryId, regionId: string): StreetRegionConfig | undefined {
  return STREET_REGIONS[countryId]?.[regionId];
}

export function getStreetScenes(countryId: CountryId, regionId: string): StreetScene[] {
  return getStreetConfig(countryId, regionId)?.scenes ?? [];
}

export function findStreetScene(
  countryId: CountryId,
  regionId: string,
  sceneId: string,
): StreetScene | undefined {
  return getStreetScenes(countryId, regionId).find((s) => s.id === sceneId);
}

export interface StreetMatrixCell {
  mood: StreetMood;
  frame: StreetFrameMode;
  url: string | null;
  available: boolean;
}

/** Resolve PNG asset time/frame from UI mood + frame mode. */
export function resolveStreetAssets(sel: StreetViewSelection): {
  time: StreetTime;
  frame: StreetFrame;
} {
  const time: StreetTime = sel.mood === "night" ? "night" : "day";
  const frame: StreetFrame =
    sel.frame === "standard" ? "standard" : "wide";
  return { time, frame };
}

export function parseStreetViewQuery(
  url: URL,
  defaults: StreetViewSelection = STREET_VIEW_DEFAULT_VIEW,
): StreetViewSelection {
  const t = url.searchParams.get("time");
  const f = url.searchParams.get("frame");
  let mood: StreetMood = defaults.mood;
  if (t === "night") mood = "night";
  else if (t === "sunset") mood = "sunset";
  else if (t === "dawn") mood = "dawn";
  else if (t === "day") mood = "day";
  let frame: StreetFrameMode = defaults.frame;
  if (f === "standard") frame = "standard";
  else if (f === "sunset_wide") frame = "sunset_wide";
  else if (f === "wide") frame = "wide";
  return { mood, frame };
}

/** All matrix variants for street-explorer panel (design/alt-c). */
export function streetMatrixCells(
  config: StreetRegionConfig,
  sceneId: string,
): StreetMatrixCell[] {
  const moods: StreetMood[] = ["dawn", "day", "sunset", "night"];
  const frames: StreetFrameMode[] = ["wide", "standard", "sunset_wide"];
  return moods.flatMap((mood) =>
    frames.map((frame) => {
      const assets = resolveStreetAssets({ mood, frame });
      const url = streetImageUrl(config, sceneId, assets.time, assets.frame);
      return { mood, frame, url, available: !!url && scfSourceExists(url) };
    }),
  );
}

/** Unique PNG assets (matrix moods/frames may share the same file + CSS grade). */
export function countUniqueStreetPhotoUrls(
  config: StreetRegionConfig,
  scenes: StreetScene[],
): number {
  const urls = new Set<string>();
  for (const scene of scenes) {
    for (const cell of streetMatrixCells(config, scene.id)) {
      if (cell.url && cell.available) urls.add(cell.url);
    }
  }
  return urls.size;
}

export function countUniqueStreetPhotoUrlsForScene(
  config: StreetRegionConfig,
  sceneId: string,
): number {
  const urls = new Set<string>();
  for (const cell of streetMatrixCells(config, sceneId)) {
    if (cell.url && cell.available) urls.add(cell.url);
  }
  return urls.size;
}

/** One grid thumb per distinct PNG (dawn/sunset reuse day assets + CSS). */
export function streetMatrixCellsForGrid(
  config: StreetRegionConfig,
  sceneId: string,
): StreetMatrixCell[] {
  const byUrl = new Map<string, StreetMatrixCell>();
  for (const cell of streetMatrixCells(config, sceneId)) {
    if (cell.url && cell.available && !byUrl.has(cell.url)) {
      byUrl.set(cell.url, cell);
    }
  }
  return [...byUrl.values()];
}

/** @deprecated Prefer {@link countUniqueStreetPhotoUrls} for UI totals. */
export function countStreetPhotos(
  config: StreetRegionConfig,
  scenes: StreetScene[],
): number {
  return countUniqueStreetPhotoUrls(config, scenes);
}

export function sceneMapPin(
  scene: StreetScene,
  index: number,
  total: number,
): { x: number; y: number } {
  if (scene.mapPin) return scene.mapPin;
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + Math.cos(angle) * 32,
    y: 50 + Math.sin(angle) * 32,
  };
}

function sceneAssetConfig(
  config: StreetRegionConfig,
  sceneId: string,
): { path: string; filePattern: (sceneId: string) => string } {
  const scene = config.scenes.find((s) => s.id === sceneId);
  return {
    path: scene?.path ?? config.path,
    filePattern: scene?.filePattern ?? config.filePattern,
  };
}

export function streetImageUrl(
  config: StreetRegionConfig,
  sceneId: string,
  time: StreetTime,
  frame: StreetFrame,
): string | null {
  const { path, filePattern } = sceneAssetConfig(config, sceneId);
  if (!path) return null;
  const pattern = filePattern(sceneId)
    .replace("{TIME}", time)
    .replace("{FRAME}", frame);
  if (!pattern) return null;
  return A_STREET + encodeURI(path + pattern);
}

export function dishLinkedScene(
  countryId: CountryId,
  regionId: string,
  dishSlug: string,
): StreetScene | undefined {
  const map = DISH_STREET_SCENE[countryId]?.[regionId];
  const sceneId = map?.[dishSlug];
  if (sceneId) return findStreetScene(countryId, regionId, sceneId);
  return getStreetScenes(countryId, regionId)[0];
}

export function posterLinkedScene(
  countryId: CountryId,
  regionId: string,
  posterSlug: string,
): StreetScene | undefined {
  return dishLinkedScene(countryId, regionId, posterSlug);
}

/** @deprecated Use {@link parseStreetViewQuery} */
export function parseStreetQuery(url: URL): { time: StreetTime; frame: StreetFrame } {
  return resolveStreetAssets(parseStreetViewQuery(url));
}

export function streetViewImageUrl(
  config: StreetRegionConfig,
  sceneId: string,
  sel: StreetViewSelection,
): string | null {
  return resolveStreetImageUrl(config, sceneId, sel);
}

export function streetQueryHref(
  basePath: string,
  url: URL,
  patch: Partial<StreetViewSelection & { char?: "with" | "no" }>,
): string {
  const current = parseStreetViewQuery(url);
  const mood = patch.mood ?? current.mood;
  const frame = patch.frame ?? current.frame;
  const params = new URLSearchParams(url.searchParams);
  params.delete("lang");
  if (mood === STREET_VIEW_DEFAULT_MOOD) params.delete("time");
  else params.set("time", mood);
  if (frame === STREET_VIEW_DEFAULT_FRAME) params.delete("frame");
  else params.set("frame", frame);
  if (patch.char === "with") params.delete("char");
  else if (patch.char === "no") params.set("char", "no");
  const qs = params.toString();
  return basePath + (qs ? `?${qs}` : "");
}
