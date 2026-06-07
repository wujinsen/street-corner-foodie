# 资源分类 · 三大风格（禁止混用）

> **许可**：入库 PNG 等视觉素材适用 [LICENSE-ASSETS.md](../LICENSE-ASSETS.md)（**禁止商用**）；Web 代码见 [LICENSE](../LICENSE)（MIT）。

> **2026-05-21**：**无人物版已废除** — 禁止新建 `*_no_char*`；每 slug 海报 1 张、zine 2 张、街景 3 张矩阵。全文 → [asset-no-character-removed.md](style/asset-no-character-removed.md)

`asserts/` 下按 **文件夹 = 一种视觉风格** 管理。生成、入库、引用时必须先选对目录，**不得跨类参考、跨类输出**。

```
asserts/
├── Gourmet recipe2/          # ① 美食宣传海报（按国家/省分子目录）
│   ├── cn/hainan/
│   ├── cn/hebei/
│   └── cn/zhejiang/
├── mini-zine/                # ② 故事与吃法 / 做法小志
│   ├── _templates/           # 版式样张 jpg（非入库成品）
│   └── cn/{省}/
└── Street View/              # ③ 街景 3D 微缩沙盘
    ├── cn/hainan/haikou/
    └── jp/tokyo/
```

**按画风分三大文件夹**（禁止混用）；**同一画风内按 `{国家}/{省}/[{市}]` 分子目录**，便于浏览。文件名仍建议带 geo 前缀；清单写在 `docs/*.md`。

---

## 地区层级与文件命名

### 两层分工

| 层级 | 放哪 | 作用 |
|------|------|------|
| **画风** | `asserts/` 下三个子文件夹 | 海报 / zine / 街景 **禁止混用** |
| **国家 → 省 → 市** | **子目录路径** + **文件名** + **`docs/` 文档** | 浏览与检索 |

**禁止**在 `asserts/` 根目录或画风文件夹根目录堆放成品 PNG（`README`、`_templates` 除外）。

### 文档树（`docs/`）

```
docs/
├── world/
│   └── {country}.md          # 国家：japan.md
└── china/
    ├── README.md
    ├── {province}.md         # 省级：hainan.md、zhejiang.md、hebei.md（待建）
    └── {city}.md             # 市级：shijiazhuang.md（frontmatter 标明 province）
```

| 文档类型 | 路径示例 | frontmatter 建议 |
|----------|----------|------------------|
| 国家 | `docs/world/japan.md` | `country: 日本`、`type: country` |
| 省 | `docs/china/hainan.md` | `region: 海南`、`type: province` |
| 市 | `docs/china/shijiazhuang.md` | `region: 石家庄`、`province: 河北`、`type: city` |

每篇地区文档维护 **frontmatter 资源清单**（`gourmet_posters`、`mini_zine`、`street_view_*`），与 `asserts/` 内文件名一一对应。

### geo 前缀（从左到右：国家 → 省 → 市）

使用 **小写拼音或通用英文 slug**，段之间用 `_` 连接：

| 段 | 含义 | 示例 |
|----|------|------|
| `{cc}` | 国家/地区 | `cn`、`jp`、`us`（亚洲/美洲沿用二字码） |
| `{country}` | **世界新增国家** · 完整英文 slug | `united_kingdom`、`france`、`germany`、`south_africa`、`new_zealand` |
| `{admin}` | 省、都道府县、直辖市辖区等 | `hainan`、`hebei`、`zhejiang`、`tokyo` |
| `{local}` | 城市、区县、街区 | `haikou`、`shijiazhuang`、`ikebukuro` |

**可省略靠右的段**（当不会与其它地区冲突时），但**新入库建议写全**，便于以后跨省、跨国扩容。

### 三类资源的命名模板

**① 街景** `asserts/Street View/{cc|country}/{admin}/[{local}/]`

```
{geo}_{场景}_{day|night}_{wide|standard}.png
```

| 已定稿路径示例 | 新图路径示例 |
|----------------|--------------|
| `Street View/cn/hainan/haikou/haikou_qilou_day_wide.png` | `…/cn_hainan_haikou_qilou_day_wide.png` |
| `Street View/cn/hebei/shijiazhuang/cn_hebei_shijiazhuang_zhengding_day_wide.png` | 同左（已用全 geo） |
| `Street View/jp/tokyo/tokyo_ikebukuro_night_wide.png` | `…/jp_tokyo_ikebukuro_night_wide.png` |

**禁止**在 `Street View/` 根目录新增成品 PNG（历史误放须迁入子目录）。

| 层级 | geo 示例 | 完整文件名示例 |
|------|----------|----------------|
| 市 | `cn_hainan_haikou` | `cn_hainan_haikou_qilou_day_wide.png` |
| 市 | `cn_hebei_shijiazhuang` | `cn_hebei_shijiazhuang_zhengding_day_wide.png` |
| 国·都市 | `jp_tokyo` | `jp_tokyo_ikebukuro_night_wide.png` |
| 省·景 | `cn_zhejiang` | `cn_zhejiang_xihu_day_standard.png` |
| 国·景 | `jp` | `jp_kyoto_gion_day_wide.png`（仅国家级地标时） |

**② 海报** `asserts/Gourmet recipe2/{cc}/{admin}/`

```
{geo}_{菜品拼音}_poster.png
```

例：`Gourmet recipe2/cn/hebei/bannianmian_poster.png` · `Gourmet recipe2/cn/hainan/wenchang_jifan_poster.png`

- 路径已含 `{cc}/{admin}/` 时，文件名用 **`{slug}_poster`** 即可，不必再叠 `cn_hebei_` 前缀。
- 通用菜名（如 `banmian`、`jifan`）在**无省子目录**的旧路径下才须带 geo 前缀。

**③ mini-zine** `asserts/mini-zine/{cc}/{admin}/`（版式样张 → `mini-zine/_templates/`）

**双轨（`按 mini-zine` 默认齐做 · 每 slug 6 张）**：

| 阅读顺序 | 页码 | 现行文件名（已定稿，勿改） | 推荐新菜统一名（资源管理器按名排序即翻页顺序） |
|----------|------|---------------------------|------------------------------------------------|
| 1 | p01 | `{slug}_story_eating_mini_zine.png` | `{slug}_mini_zine_p01_story_eating.png` |
| 2 | p02 | `{slug}_narrative_01_story_mini_zine.png` | `{slug}_mini_zine_p02_narr_story.png` |
| 3 | p03 | `{slug}_narrative_02_culture_mini_zine.png` | `{slug}_mini_zine_p03_narr_culture.png` |
| 4 | p04 | `{slug}_narrative_03_street_mini_zine.png` | `{slug}_mini_zine_p04_narr_street.png` |
| 5 | p05 | `{slug}_narrative_04_ingredients_mini_zine.png` | `{slug}_mini_zine_p05_narr_ingredients.png` |
| 6 | p06 | `{slug}_recipe_mini_zine.png` | `{slug}_mini_zine_p06_recipe.png` |

- **现行名**：`hainan_jifan_*` 等已入库文件**保持**，Web `parse-zines.ts` 继续识别。  
- **推荐名**：新菜优先 `p01`…`p06` 前缀，避免 `story_eating` / `narrative_01` / `recipe` 混排、与「第 6 页=做法」对不齐。  
- **Web**：故事模式主区仍 5 页（p01 + 叙事 p02–p05）；p06 在「做法」或底部 **6 格缩略图** 第 06 格。详见 [mini-zine-dynasty-chibi.md](style/mini-zine-dynasty-chibi.md) §叙事四页 · **§六页版式金标准**（锚图 `wenchang_jifan` + `laobacha`）。

例：`mini-zine/cn/hainan/yupian_zhou_*`（6 张）。版式按 [mini-zine-dynasty-chibi.md](style/mini-zine-dynasty-chibi.md) **§六页版式金标准**（p02/p03/p05 → 文昌鸡饭；p01/p04/p06 → 老爸茶）。

### 已定稿短名（兼容，勿改名）

早期入库未带国家/省段，**继续有效**，新图优先用完整 geo：

| 地区 | 街景（已定稿） | 新图推荐 |
|------|----------------|----------|
| 海口 | `haikou_{场景}_…` | `cn_hainan_haikou_{场景}_…` |
| 东京 | `tokyo_{区域}_…` | `jp_tokyo_{区域}_…` |
| 海南菜海报 | `wenchang_jifan_poster.png` 等 | 可选 `cn_hainan_wenchang_jifan_poster.png` |
| 浙江 | `xihu_cuyu_poster.png` | 可选 `cn_zhejiang_xihu_cuyu_poster.png` |

### 本项目 geo 速查

| 文档 | 海报 / zine geo | 街景 geo（新） | 街景（已定稿） |
|------|-----------------|----------------|----------------|
| [china.md](china/china.md) | `cn_{菜}` 或 `{省}_{菜}` | — | — |
| [hainan.md](china/hainan.md) | `cn_hainan_{菜}` 或 `{菜}` | `cn_hainan_haikou_{场景}` | `haikou_{场景}` |
| [shijiazhuang.md](china/shijiazhuang.md) | `{slug}`（目录 `cn/hebei/`） | `cn_hebei_shijiazhuang_{场景}` | — |
| [zhejiang.md](china/zhejiang.md) | `cn_zhejiang_{菜}` | `cn_zhejiang_{场景}` | — |
| [japan.md](world/japan.md) | `jp_{菜}` | `jp_tokyo_{区域}` · 富士 `jp_fuji_{场景}` | `tokyo_{区域}` |
| [usa.md](world/usa.md) | `us_{菜}` | `us_nyc_{场景}` · `us_la_{场景}`（待扩） | —（纽约 9 张在 `us/nyc/`） |
| [newzealand.md](world/newzealand.md) | `nz_{菜}` | `nz_auckland_{场景}` · `nz_wellington_*` · `nz_rotorua_*`（待扩） | — |

### 生成对话模板（带 geo）

```text
按 meishi-street-view 生成街景：
geo：cn_hainan_haikou（或 jp_tokyo_ikebukuro）
场景：qilou
时间：night · 画幅：wide · 要人物
保存：asserts/Street View/cn/hainan/haikou/cn_hainan_haikou_qilou_night_wide.png
并更新 docs/china/hainan.md 街景表
```

```text
按 meishi-food-poster 生成海报：
geo：cn_hebei
菜品：bannianmian（牛肉板面）
保存：asserts/Gourmet recipe2/cn/hebei/cn_hebei_bannianmian_poster.png
并更新 docs/china/shijiazhuang.md
```

---

## 总览对照

| 文件夹 | 风格名称 | 画什么 | 参考目录（只看本文件夹） | 典型文件名 |
|--------|----------|--------|--------------------------|------------|
| **Gourmet recipe2** | 美食宣传海报 | 巨型菜品 + Q 版厨师/厨房 | `asserts/Gourmet recipe2/` | `{slug}_poster.png` |
| **mini-zine** | 美食 mini zine | 竖版小志 + **朝代 3D Q 版**（每 slug **2 张**，均含 chibi） | `asserts/mini-zine/{cc}/{admin}/` | `{slug}_story_eating_mini_zine.png` · `{slug}_recipe_mini_zine.png` |
| **Street View** | 3D 微缩街景 | 各国城市地标与生活场景沙盘 | `asserts/Street View/` | `{geo}_{场景}_{day\|night}_{wide\|standard}.png`（见 §地区层级） |

---

## ① Gourmet recipe2 · 美食宣传海报

| 项 | 说明 |
|----|------|
| **观感** | 3D 微缩厨房/夜市；主菜 **居中上 45～55%**；**3～5 位** Q 版女厨师（四角、防穿模）；底行料 **横木牌**；大红 3D 标题 + 绿条副标题 |
| **用途** | 菜品主视觉、电商头图、菜单封面 |
| **禁止** | 不要参考 `Street View/`、`mini-zine/`；不要做成街景或连环画版式 |

**完整规格**：[food-poster-ingredients.md §总览](style/food-poster-ingredients.md#新旧对话必守--海报版式总览2026-05-21) · [§人料按菜定](style/food-poster-ingredients.md#按菜定布局--人料皆可变2026-05--新旧对话必守) · [food-poster-diorama.md](style/food-poster-diorama.md) · [food-poster-dynasty-chibi.md](style/food-poster-dynasty-chibi.md) · [food-poster-speech-bubbles.md](style/food-poster-speech-bubbles.md)  
**AlwaysApply**：`meishi-food-poster.mdc` · `meishi-food-poster-era.mdc` · Skill `meishi-food-poster/`

**命名**：`{菜品拼音}_poster.png`（**禁止**新建 `_poster_no_char`）

**金标准**：`cn/guangdong/lachang_chaofan_poster.png`（居中主菜 + 横木牌 + 四角 chibi）  
**boluo 清新风**：主锚 `cn/hainan/boluo_chaofan_poster.png`（用户定调清新范本）；辅 `boluo_chaofan_poster_no_char.png` — **底行必横木牌** → [food-poster-diorama.md §boluo](style/food-poster-diorama.md#boluo-清新风--清晰风2026-05-19--新旧对话必守)

**生成对话模板**：

```text
按 meishi-food-poster 技能与 food-poster-diorama.md + food-poster-dynasty-chibi.md 生成美食海报：
菜品：（菜名）；场景：厨房 / 夜市；
人物气泡：对白体（默认）/ 标语体；
保存到 asserts/Gourmet recipe2/{cc}/{admin}/{slug}_poster.png
```

---

## ② mini-zine · 故事与做法小志

| 项 | 说明 |
|----|------|
| **观感** | 竖版杂志页 / 连环画格；分区排版（故事与吃法、或做法步骤） |
| **人物** | **3D chibi**；服饰时代 **先秦→2026**（`contemporary`），由**食物+当地**定，可候选池随机 |
| **用途** | 长文配图、小红书多图、菜谱说明页 |
| **禁止** | 不要做成海报风；不要全省统一同一时代 |

**时代服饰（所有对话必遵）**：[mini-zine-dynasty-chibi.md](style/mini-zine-dynasty-chibi.md)  
**Cursor 规则**：`.cursor/rules/meishi-mini-zine-era.mdc`（`alwaysApply`）  
**Agent 速查**：`.cursor/skills/gourmet-recipe-mini-zine/dynasty-chibi.md`

出图前必报：`| 时代代号 | 服饰摘要 | 随机? |`

**目录**：`asserts/mini-zine/{cc}/{admin}/` · 样张 `mini-zine/_templates/`

**画面语言**：`cn/` 中文 · `jp/` 日文 · **`us/` 英文（EN）**；三语后缀 `_zh` / `_ja` 规划见 [mini-zine-i18n.md](style/mini-zine-i18n.md)。

**命名**（每 slug **2 张**，**均含 3D chibi**）：

- `{slug}_story_eating_mini_zine.png`
- `{slug}_recipe_mini_zine.png`

**禁止**：`*_mini_zine_no_char*`（见 [asset-no-character-removed.md](style/asset-no-character-removed.md)）

**生成对话模板**：

```text
按 gourmet-recipe-mini-zine + mini-zine-dynasty-chibi.md 生成 mini-zine：
菜品：（菜名）· 地域：（省/市）
先定时代代号（可随机）并列出服饰表；
交付：故事与吃法 + 做法小志（共 2 张，有人物）；
保存到 asserts/mini-zine/{cc}/{admin}/；
更新对应 docs/*.md
```

---

## ③ Street View · 街景微缩（多地区）

| 项 | 说明 |
|----|------|
| **观感** | 3D 等距沙盘 + Q 版市民；建筑写实、人物手办感；信息密度高 |
| **用途** | 地域文化头图、城市印象横幅 |
| **当地美食** | **必须有**地面饮食摊/店面与招牌（见地区风味图鉴）；禁止空街、禁止海报风巨型主菜 |
| **矩阵** | 每场景默认 **day_wide + night_wide + day_standard** |
| **Web 默认图** | 探索器 / 街景 Tab **优先 `night_wide`**（`web/src/lib/streets.ts` · `STREET_VIEW_DEFAULT_VIEW`）；规则 §2b → [meishi-street-view-spec.mdc](../.cursor/rules/meishi-street-view-spec.mdc) |
| **禁止** | 不要参考 `Gourmet recipe2/`、`mini-zine/`；不要 2D 动漫空镜 |

**始终生效规则**（新旧对话）：`.cursor/rules/meishi-street-view-spec.mdc`  
**完整规格**：[docs/style/street-view-diorama.md](style/street-view-diorama.md)  
**场景原型**：海口府城 [hainan-fucheng-prototype.md](china/hainan-fucheng-prototype.md) · 石家庄 [shijiazhuang-street-prototypes.md](china/shijiazhuang-street-prototypes.md) · 东京 [japan-tokyo-street-prototypes.md](world/japan-tokyo-street-prototypes.md)  
**Agent Skill**：`.cursor/skills/meishi-street-view/`（含英文提示词模板）

**命名**：`{geo}_{地点}_{day|night}_{wide|standard}[_no_char].png`（geo 见 §地区层级；海口已定稿可用 `haikou_`）

**生成时依据**：**规范文档 + 模板**（不必每次写「参考 haikou_qilou_day_wide.png」）。仅当要几乎同款构图时，才指定某张 PNG。

**生成对话模板**：

```text
按 meishi-street-view 技能与 docs/style/street-view-diorama.md 生成海口街景：
地点：（万绿园 / 假日海滩 / 骑楼 …）
时间：day / night
画幅：wide / standard
人物：要 / 不要
保存到 asserts/Street View/{geo}_{slug}_{day|night}_{wide|standard}[_no_char].png
（例：cn_hainan_haikou_qilou_day_wide · jp_tokyo_ikebukuro_night_wide）
```

已定稿清单见 [china/hainan.md](china/hainan.md#海口街景微缩assertsstreet-view)。

---

## 混风格禁忌（检查清单）

生成前自问：

| 问题 | Gourmet recipe2 | mini-zine | Street View |
|------|-----------------|-----------|-------------|
| 生图依据？ | `food-poster-diorama.md` + 技能 | `ASSETS.md` §② + mini-zine 样张 | **`street-view-diorama.md` + 技能**（PNG 仅可选校准） |
| 主体是什么？ | **菜** | **排版+文字区+小插图** | **街景建筑** |
| 人物类型？ | 厨师 / 无 `_no_char` | 叙事小人或无人物 | Q 版市民 / 可选无人物 |
| 保存到哪？ | `Gourmet recipe2/` | `mini-zine/` | `Street View/` |

**一票否决**：把街景参考用于海报；把海报参考用于街景；把 mini-zine 版式用于单张海报。

---

## 一篇内容怎么搭配（示例）

| 位置 | 用哪类 | 示例文件 |
|------|--------|----------|
| 文章头图 / 地域氛围 | Street View | `haikou_qilou_day_wide.png` |
| 菜品主视觉 | Gourmet recipe2 | `wenchang_jifan_poster.png` |
| 吃法故事页 | mini-zine | `wenchang_jifan_story_eating_mini_zine.png` |
| 做法步骤页 | mini-zine | `wenchang_jifan_recipe_mini_zine.png` |

---

## 入库流程

1. AI 生成后可能在 Cursor `assets/`，**复制到上表对应子文件夹** 才算入库。  
2. 更新对应地区文档（`docs/china/{省|市}.md` 或 `docs/world/{国家}.md`）中的资源表。  
3. 文件名遵守 **§地区层级** 与各类命名规范，勿放到 `asserts/` 根目录（根目录仅保留三个子文件夹）。

---

## 参考目录（自参照：只看本文件夹）

| 风格 | 参考目录 | 说明 |
|------|----------|------|
| Gourmet recipe2 | `asserts/Gourmet recipe2/` | 以本目录已定稿海报为风格基准 |
| mini-zine | `asserts/mini-zine/` | 以本目录已定稿 zine + 夹内 jpg 样张为基准 |
| Street View | `asserts/Street View/` | 以本目录已定稿街景为风格基准 |

**原则**：生成某类新图时，只打开**同文件夹**里的现有作品作参考，不跨文件夹、不用项目根目录或 `a/`。
