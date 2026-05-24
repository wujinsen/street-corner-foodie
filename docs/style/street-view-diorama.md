# 街景微缩 · 3D 沙盘风（Street View）

**风格 ID**：`street-diorama`  
**对应目录**：`asserts/Street View/{cc}/{admin}/[{local}/]`  
**禁止混用**：`Gourmet recipe2/`、`mini-zine/`

> **Agent · 新旧对话**：`.cursor/rules/meishi-street-view-spec.mdc`（`alwaysApply`）汇总目录、美食、金标准矩阵、场景原型索引；本文档为视觉与场景招牌细则。

---

## Agent 速查（无对话历史时读此表）

| 项 | 规范 |
|----|------|
| 每场景张数 | `day_wide` + `night_wide` + `day_standard`（可选 `_no_char`） |
| **Web 默认展示** | **优先夜景**：无 `?time=` 时加载 `night_wide`；缩略图同；见 `STREET_VIEW_DEFAULT_VIEW`（`web/src/lib/streets.ts`） |
| 当地美食 | 摊/招牌/碗碟 + Q 版食客；见地区 md 与场景原型 |
| 入库 | `Copy-Item` → 子目录；更新 md `street_view_approved` |
| 海口 | `cn/hainan/haikou/` · `haikou_*` 已定稿 |
| 石家庄 | `cn/hebei/shijiazhuang/` · `cn_hebei_shijiazhuang_*` |
| 东京 | `jp/tokyo/` · `tokyo_*` 已定稿 |
| 府城 | 招牌用 **府城**，禁 **福城** |

**场景原型**：[hainan-fucheng-prototype.md](../china/hainan-fucheng-prototype.md) · [shijiazhuang-street-prototypes.md](../china/shijiazhuang-street-prototypes.md) · [japan-tokyo-street-prototypes.md](../world/japan-tokyo-street-prototypes.md) · [japan-fuji-prototype.md](../world/japan-fuji-prototype.md) · [usa-nyc-street-prototypes.md](../world/usa-nyc-street-prototypes.md) · [usa-la-street-prototypes.md](../world/usa-la-street-prototypes.md)

---

## 一句话

**3D 等距微缩沙盘** + **Q 版手办小人**：城市地标与街头生活场景，信息密度高，画面顶满画幅；像精致城市模型而非 2D 动漫背景。海口、东京等地点**仅换地标与招牌语言**，画风一致。

---

## 生成时看什么？（不必每次点名某张图）

| 优先级 | 依据 | 说明 |
|--------|------|------|
| **1** | 本文档 | 视角、质感、画幅、禁忌、场景招牌表 |
| **2** | Skill `meishi-street-view` + `prompt-templates.md` | 英文提示词模板 |
| **3** | 本目录任意 1 张**同类型**定稿 | 仅当需要校准色调/密度时 Read；**非必填** |

**不需要**每次写「参考 haikou_qilou_day_wide.png」。只有「要和某张几乎同款构图」时，才在 `reference_image_paths` 里指定那张。

---

## 已定稿参考（金标准 · 按场景类型）

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 骑楼老街 | `haikou_qilou_day_wide.png` | `haikou_qilou_night_wide.png` | `haikou_qilou_day_standard.png` |
| 老爸茶 | `haikou_laobacha_day_wide.png` | `haikou_laobacha_night_wide.png` | `haikou_laobacha_day_standard.png` |
| 城市公园 | `haikou_wanlv_day_wide.png` | `haikou_wanlv_night_wide.png` | `haikou_wanlv_day_standard.png` |
| 滨海沙滩 | `haikou_jiari_haitan_day_wide.png` | `haikou_jiari_haitan_night_wide.png` | `haikou_jiari_haitan_day_standard.png` |
| 海口湾 | `haikou_bay_day_wide.png` | `haikou_bay_night_wide.png` | `haikou_bay_day_standard.png` |
| 海口湾·日落 | `haikou_bay_sunset_wide.png` | `haikou_bay_sunset_night_wide.png` | `haikou_bay_sunset_standard.png` |
| 府城镇 | `haikou_fucheng_day_wide.png` | `haikou_fucheng_night_wide.png` | `haikou_fucheng_day_standard.png` |

### 石家庄

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 五七路板面街 | `cn_hebei_shijiazhuang_bannianmian_day_wide.png` | `cn_hebei_shijiazhuang_bannianmian_night_wide.png` | `cn_hebei_shijiazhuang_bannianmian_day_standard.png` |
| 正定古城 | `cn_hebei_shijiazhuang_zhengding_day_wide.png` | `cn_hebei_shijiazhuang_zhengding_night_wide.png` | `cn_hebei_shijiazhuang_zhengding_day_standard.png` |
| 煤机街夜市 | `cn_hebei_shijiazhuang_meiji_yeshi_day_wide.png` | `cn_hebei_shijiazhuang_meiji_yeshi_night_wide.png` | `cn_hebei_shijiazhuang_meiji_yeshi_day_standard.png` |

入库目录：`asserts/Street View/cn/hebei/shijiazhuang/`。原型 → [shijiazhuang-street-prototypes.md](../china/shijiazhuang-street-prototypes.md)

### 陕西 · 西安·长安

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 回民街·长安 `changan` | `cn_shaanxi_xian_changan_day_wide.png` | `cn_shaanxi_xian_changan_night_wide.png` | `cn_shaanxi_xian_changan_day_standard.png` |
| 唐朝长安 `tang_changan`（俯视） | `cn_shaanxi_xian_tang_changan_day_wide.png` | `cn_shaanxi_xian_tang_changan_night_wide.png` | `cn_shaanxi_xian_tang_changan_day_standard.png` |
| 长安·里坊近景 `tang_changan_fang` | `cn_shaanxi_xian_tang_changan_fang_day_wide.png` | `cn_shaanxi_xian_tang_changan_fang_night_wide.png` | — |

入库目录：`asserts/Street View/cn/shaanxi/xian/`。原型 → [shaanxi-changan-street-prototype.md](../china/shaanxi-changan-street-prototype.md)

### 浙江 · 杭州

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 西湖湖滨 `xihu` | `cn_zhejiang_hangzhou_xihu_day_wide.png` | `cn_zhejiang_hangzhou_xihu_night_wide.png` | `cn_zhejiang_hangzhou_xihu_day_standard.png` |
| 河坊街 `hefang` | `cn_zhejiang_hangzhou_hefang_day_wide.png` | `cn_zhejiang_hangzhou_hefang_night_wide.png` | `cn_zhejiang_hangzhou_hefang_day_standard.png` |

入库目录：`asserts/Street View/cn/zhejiang/hangzhou/`。原型 → [zhejiang-hangzhou-street-prototypes.md](../china/zhejiang-hangzhou-street-prototypes.md)

### 北京 · 南锣鼓巷

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 胡同 `nanluoguxiang` | `cn_beijing_nanluoguxiang_day_wide.png` | `cn_beijing_nanluoguxiang_night_wide.png` | `cn_beijing_nanluoguxiang_day_standard.png` |

入库目录：`asserts/Street View/cn/beijing/`。原型 → [beijing-nanluoguxiang-street-prototype.md](../china/beijing-nanluoguxiang-street-prototype.md)

### 日本 · 东京（全城 9 区）

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 新宿 | `tokyo_shinjuku_day_wide.png` | `tokyo_shinjuku_night_wide.png` | `tokyo_shinjuku_day_standard.png` |
| 涩谷 | `tokyo_shibuya_day_wide.png` | `tokyo_shibuya_night_wide.png` | `tokyo_shibuya_day_standard.png` |
| 浅草 | `tokyo_asakusa_day_wide.png` | `tokyo_asakusa_night_wide.png` | `tokyo_asakusa_day_standard.png` |
| 筑地 | `tokyo_tsukiji_day_wide.png` | `tokyo_tsukiji_night_wide.png` | `tokyo_tsukiji_day_standard.png` |
| 秋叶原 | `tokyo_akihabara_day_wide.png` | `tokyo_akihabara_night_wide.png` | `tokyo_akihabara_day_standard.png` |
| 原宿 | `tokyo_harajuku_day_wide.png` | `tokyo_harajuku_night_wide.png` | `tokyo_harajuku_day_standard.png` |
| 上野 | `tokyo_ueno_day_wide.png` | `tokyo_ueno_night_wide.png` | `tokyo_ueno_day_standard.png` |
| 池袋 | `tokyo_ikebukuro_day_wide.png` | `tokyo_ikebukuro_night_wide.png` | `tokyo_ikebukuro_day_standard.png` |
| 日本电子专门学校 | `tokyo_denshi_senmon_day_wide.png` | `tokyo_denshi_senmon_night_wide.png` | `tokyo_denshi_senmon_day_standard.png` |

美食分区 → [japan-tokyo-street-prototypes.md](../world/japan-tokyo-street-prototypes.md) · 清单 [japan.md](../world/japan.md)

### 日本 · 富士山（河口湖）

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 河口湖·富士山 | `jp_fuji_kawaguchiko_day_wide.png` | `jp_fuji_kawaguchiko_night_wide.png` | `jp_fuji_kawaguchiko_day_standard.png` |

目录 `Street View/jp/fuji/` · 原型 [japan-fuji-prototype.md](../world/japan-fuji-prototype.md)

### 美国 · 纽约

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 时代广场 | `us_nyc_times_square_day_wide.png` | `us_nyc_times_square_night_wide.png` | `us_nyc_times_square_day_standard.png` |
| 下城金融区 | `us_nyc_lower_manhattan_day_wide.png` | `us_nyc_lower_manhattan_night_wide.png` | `us_nyc_lower_manhattan_day_standard.png` |
| 布鲁克林 DUMBO | `us_nyc_brooklyn_dumbo_day_wide.png` | `us_nyc_brooklyn_dumbo_night_wide.png` | `us_nyc_brooklyn_dumbo_day_standard.png` |

入库目录：`asserts/Street View/us/nyc/`。原型 → [usa-nyc-street-prototypes.md](../world/usa-nyc-street-prototypes.md)

### 美国 · 洛杉矶

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 好莱坞 | `us_la_hollywood_day_wide.png` | `us_la_hollywood_night_wide.png` | `us_la_hollywood_day_standard.png` |
| 威尼斯海滩 | `us_la_venice_beach_day_wide.png` | `us_la_venice_beach_night_wide.png` | `us_la_venice_beach_day_standard.png` |
| 中央市场 | `us_la_grand_central_market_day_wide.png` | `us_la_grand_central_market_night_wide.png` | `us_la_grand_central_market_day_standard.png` |

入库目录：`asserts/Street View/us/la/`。原型 → [usa-la-street-prototypes.md](../world/usa-la-street-prototypes.md)

### 美国 · 德州 BBQ

| 场景类型 | 白天 wide | 夜景 wide | 方图 standard |
|----------|-----------|-----------|---------------|
| 奥斯汀烟熏屋 | `us_tx_austin_pit_day_wide.png` | `us_tx_austin_pit_night_wide.png` | `us_tx_austin_pit_day_standard.png` |
| 洛克哈特老城 | `us_tx_lockhart_main_day_wide.png` | `us_tx_lockhart_main_night_wide.png` | `us_tx_lockhart_main_day_standard.png` |
| BBQ 餐车列 | `us_tx_bbq_trail_day_wide.png` | `us_tx_bbq_trail_night_wide.png` | `us_tx_bbq_trail_day_standard.png` |

入库目录：`asserts/Street View/us/tx/`。原型 → [usa-tx-bbq-street-prototypes.md](../world/usa-tx-bbq-street-prototypes.md)

新地点：按上表**同类型**任选 1 张作校准即可，或**不附图**仅按本文 + 模板生成。  
各国清单见 `docs/world/{国家}.md`。

---

## 画面要素清单

| 元素 | 要求 |
|------|------|
| 视角 | 偏高俯视，略带等距；`wide` = 横向全景 |
| 人物 | Q 版小人（头大身小、手办感）；无人物版文件名加 `_no_char` |
| 建筑/环境 | 偏写实纹理；植物与道具符合**当地**（海南热带 / 日本都市等） |
| 密度 | 店铺/路径/道具填满画面；**场景约占 95%**，底座留白极小 |
| 光影 | 白天清透饱和；夜景灯笼/霓虹；海湾可用日落暖色 |
| 材质 | 夜景地面 **哑光**（禁湿镜面/油腻反光）；Q 版 **哑光手办漆**（禁塑料油光肤） |
| 远景 | 海口天际线 + 海面（滨海/公园类适用） |
| 禁忌 | 2D 动漫空镜；巨型菜品当主体；混用美食海报风 |

---

## 画幅

| 后缀 | 比例 | 用途 |
|------|------|------|
| `wide` | 21:9 | 横幅头图、封面 |
| `standard` | 1:1 | 方图、卡片、建筑透视 |

---

## 命名

完整规则（国家 / 省 / 市 geo 链、三类资源、已定稿兼容）→ **[ASSETS.md §地区层级](../ASSETS.md#地区层级与文件命名)**。

街景模板：

```
{geo}_{区域}_{day|night}_{wide|standard}[_no_char].png
```

| 地区 | geo（新图推荐） | 区域 slug 示例 | 已定稿短名 |
|------|-----------------|----------------|------------|
| 海口 | `cn_hainan_haikou` | `qilou`、`laobacha`、`wanlv`、`jiari_haitan`、`bay`、`fucheng`（府城镇） | `haikou_*` |
| 石家庄 | `cn_hebei_shijiazhuang` | `bannianmian`、`zhengding`、`meiji_yeshi` | — |
| 东京 | `jp_tokyo` | `shinjuku`、`shibuya`、`asakusa`、`tsukiji`、`akihabara`、`harajuku`、`ueno`、`ikebukuro`、`denshi_senmon` | `tokyo_*` |
| 杭州 | `cn_zhejiang_hangzhou` | `xihu`、`hefang` | — |

示例：`cn_hainan_haikou_qilou_day_wide.png` · `jp_tokyo_ikebukuro_night_wide.png` · 兼容 `haikou_qilou_day_wide.png`

---

## 场景招牌分区（避免万能招牌）

生成时**只选与本场景匹配**的招牌，勿每张堆齐所有小吃名。

| 场景类型 | 宜用 | 避免 |
|----------|------|------|
| 骑楼·白天观光 | 骑楼老街、水巷口、博物馆、特产 | 老爸茶、糟粕醋 |
| 骑楼·夜景夜宵 | 烧烤、炒冰、生蚝、啤酒、夜宵 | 博物馆、特产 |
| 老爸茶 | 聚福、恒兴、肠粉、凤爪、糕点 | 骑楼牌坊、清补凉 |
| 公园（万绿园） | 万绿园、滨海大道、健身广场 | 骑楼、沙滩烧烤 |
| 沙滩（假日海滩） | 假日海滩、椰林、戏水、海鲜排档 | 骑楼、博物馆 |
| 海口湾 | 世纪大桥、云洞图书馆、海鲜、椰子鸡 | 骑楼类 |
| 府城镇 | **牛腩饭/猪脚饭**、**海口鱼煲**、**鸽子粥/蟹粥**、琼台书院；地名招牌用 **府城**；见 [hainan-fucheng-prototype.md](../china/hainan-fucheng-prototype.md) | **福城**误字、猪血汤、无饮食空古街、清补凉椰子鸡、骑楼商业街 |
| 石家庄·板面街 | **牛肉板面**、辣卤宽面、卤蛋豆皮肠、五七路、庄里味道；见 [shijiazhuang-street-prototypes.md](../china/shijiazhuang-street-prototypes.md) | 海南热带、骑楼、椰子 |
| 石家庄·正定古城 | **马家卤鸡**、**八大碗**、**热切丸子**、古城牌楼 | 现代 CBD、海南小吃 |
| 石家庄·煤机街夜市 | **缸炉烧饼**、**深泽肉糕**、板面、驴肉火烧、烧烤；煤机街夜市 | 热带海滩、东京歌舞伎町主调 |
| 东京·新宿白天 | **ラーメン**、**居酒屋**・焼き鳥、**牛丼**、新宿站、都厅远景；见 [japan-tokyo-street-prototypes.md](../world/japan-tokyo-street-prototypes.md) | 中文海南招牌、骑楼 |
| 东京·新宿夜景 | **焼肉**、カラオケ、居酒屋、ラーメン、歌舞伎町霓虹 | 海南大排档、热带海滩 |
| 东京·电子专门学校 | 多栋校舎、**ラーメン**・牛丼・からあげ・たこ焼き、大久保；见 [japan-denshi-senmon-prototype.md](../world/japan-denshi-senmon-prototype.md) | 单一玻璃校园大门、骑楼、海南小吃 |
| 东京·涩谷 | ラーメン、渋谷肉巻き、居酒屋；スクランブル交差点 | 海南招牌、骑楼 |
| 东京·浅草 | **人形焼**、天ぷら、うなぎ；雷門·仲見世 | 现代 CBD 主景 |
| 东京·筑地 | **寿司**、海鮮丼、玉子焼き；市场 | 中文海鲜大排档 |
| 东京·秋叶原 | ラーメン、**カレー**、たこ焼き；电器街 | 骑楼 |
| 东京·原宿 | **クレープ**、たい焼き；竹下通 | 热带海滩 |
| 东京·上野 | **焼き鳥**、弁当；アメヤ横丁 | 海南招牌 |
| 东京·池袋 | **餃子**、豚骨ラーメン、たい焼き、サンシャイン60、いけふくろう；见 [japan-ikebukuro-prototype.md](../world/japan-ikebukuro-prototype.md) | 骑楼、海南招牌 |
| 富士·河口湖 | **ほうとう**、吉田うどん、信玄餅、ます焼き；富士山+河口湖；见 [japan-fuji-prototype.md](../world/japan-fuji-prototype.md) | 空山无饮食、东京霓虹、海南招牌 |
| 纽约·时代广场 | 热狗 cart、pretzel、披萨 slice；霓虹 | 海南骑楼、日文主招牌 |
| 纽约·下城 | 百吉饼 bagel、deli、唐人街外卖窗 | 空街、巨型汉堡海报 |
| 纽约·DUMBO | smash burger、披萨、咖啡车；曼哈顿大桥 | 热带海滩 |
| LA·好莱坞 | 热狗、taco truck；星光大道 | NYC 石路主景 |
| LA·威尼斯海滩 | **fish tacos**、carne asada；壁画棕榈 | 空海滩 |
| LA·中央市场 | tacos、pastrami、pho；市场拱顶 | 户外纽约街 |
| 德州·奥斯汀 pit | **brisket**、smoker 烟、香肠；见 [usa-tx-bbq-street-prototypes.md](../world/usa-tx-bbq-street-prototypes.md) | 空停车场、NYC 霓虹 |
| 德州·洛克哈特 | ribs、brisket 全牛胸、啤酒 | 空街 |
| 德州·BBQ trail | 餐车列 brisket、jalapeño sausage | 无饮食 |

---

## 英文主提示词（通用）

```text
Ultra-wide 21:9 3D isometric miniature diorama of Haikou {SCENE_EN} ({SCENE_CN}),
toy-model tilt-shift aesthetic, cute chibi figurine people, dense tropical details,
scene fills 95% of frame minimal grey base, photorealistic architecture,
warm saturated daylight OR night lanterns neon as specified,
Haikou skyline and sea in background when coastal,
NOT anime 2D background NOT giant food poster, no watermark.
```

夜景将 `daylight` 换为 `nighttime, warm shop glow, neon signs, wet pavement reflections`。

无人物版追加：`ZERO human figures, empty tables optional, no chibi people`。

---

## 版本策略

| 版本 | 文件名 | 说明 |
|------|--------|------|
| 有人物 | 无 `_no_char` | 默认对外主视觉 |
| 无人物 | `_no_char` | 背景、裁切、二次设计 |

---

## 入库

1. 生成后常在 Cursor `assets/` → **复制到** `asserts/Street View/`  
2. 更新 `docs/china/{省}.md` 或 `docs/world/{国家}.md` 街景表  
3. 勿放到 `asserts/` 根目录或其它子文件夹

---

## Cursor 对话模板（无需写具体文件名）

```text
按 meishi-street-view 技能与 docs/style/street-view-diorama.md 生成海口街景：
- 地点：（如 假日海滩 / 万绿园 / 骑楼）
- 时间：day / night
- 画幅：wide / standard
- 人物：要 / 不要
保存到 asserts/Street View/cn/hainan/haikou/haikou_{slug}_{day|night}_{wide|standard}[_no_char].png
```

---

## 与 hainan.md 的关系

- **本文档** = 跨批次不变的视觉规范  
- **hainan.md** = 海南菜品文案 + 已入库文件清单
