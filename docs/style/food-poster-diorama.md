# 美食宣传海报 · 微缩厨房风（Gourmet recipe2）

**风格 ID**：`food-poster-diorama`  
**对应目录**：`asserts/Gourmet recipe2/`  
**禁止混用**：`mini-zine/`、`Street View/`、项目根目录参考 jpg

**与街景无关（必守）**：美食海报 / mini-zine **不**读取、不绑定 `Street View/` 分区（池袋、新宿、涩谷、`us_nyc_*` 场景等）。竖牌用 **国家 / 广域风味**（如 `日本味道`、`东京味道`、`美国味道`），**禁止**用街景矩阵里的区名竖牌（如 `池袋味道`）。街景原型 md 中的「当地美食」**仅**服务街景出图。

**新旧对话同步（`alwaysApply`）**：布局见 [food-poster-ingredients.md §按菜定布局 · 人料皆可变](food-poster-ingredients.md#按菜定布局--人料皆可变2026-05--新旧对话必守) — **厨师人数与底行料均按本菜表**（可不等）；规则 `.cursor/rules/meishi-food-poster.mdc` + `meishi-food-poster-era.mdc`。

---

## 一句话

港式 / 海南茶餐厅式 **3D 微缩厨房**：**巨型写实主菜** + **按菜 3～5 位** 3D chibi（见 [food-poster-ingredients.md](food-poster-ingredients.md)）+ **按菜 4～6 件**底行料（横放木牌、器皿随料）+ **大红 3D 标题** + **绿色副标题条** + **「海南味道」木牌**（地域可改）。

---

## 已定稿参考（金标准）

| 用途 | 文件 | 说明 |
|------|------|------|
| 热菜 · 有人物 | `wenchang_jifan_poster.png` | 暖色厨房、鸡饭、倒姜葱油 |
| 甜品 · 有人物 | `qingbuliang_poster.png` | **夜市**、灯串、玻璃大碗（主推） |
| 甜品 · 无人物 | `qingbuliang_poster_no_char.png` | 同夜市构图、无小人、无梯子 |
| 火锅 · 有人物 | `yezi_ji_poster.png` | 椰壳锅、女厨师（若已入库） |
| **料签·横木牌（首选）** | `cn/guangdong/lachang_chaofan_poster_no_char.png` | 底行横排碗 + 器皿正下方横木牌 + 居中主菜；**新图默认** |
| **料签·竖牌样张** | `docs/style/refs/ingredient-wooden-plaque-ref.png` | 竖式木纹（仅用户点名或旧稿） |
| **boluo 清新风（主锚 · 有人物定稿）** | `cn/hainan/boluo_chaofan_poster.png` | **用户定调清新范本**：明亮通透、高饱和不闷、户外木桌、写实主菜、棕刷顶题、横木牌、四角 chibi |
| **boluo 清新风（辅参考·光影）** | `cn/hainan/boluo_chaofan_poster_no_char.png` | 仅补户外亮度/棕榈 bokeh/顶题；**勿**抄竖奶油料签 |

生成前 **必须先 Read** `boluo_chaofan_poster.png`（清新完整版），再读 1 张同省本菜或 `_no_char` 辅参考。

---

## boluo 清新风 / 清晰风（2026-05-19 · 新旧对话必守）

> **同义触发**：`boluo 清新风` = `boluo 清晰风` = `跟菠萝炒饭一样` = **`boluo_chaofan_poster` 画风同款**（**仅**光影/顶题/横木牌，**非**整图构图同款）。  
> **主金标准**：`asserts/Gourmet recipe2/cn/hainan/boluo_chaofan_poster.png`（2026 用户确认「清新风格很好」）。

用户说 **`按 boluo 清晰风`** / **`boluo 清新风`** / **`boluo清晰风`** / **`boluo 风格`** / **`跟菠萝炒饭一样`** / **`清新风格`** 时，走本小节 + 本菜 [food-poster-ingredients.md](food-poster-ingredients.md) 人料表；时代服饰仍按 [food-poster-dynasty-chibi.md](food-poster-dynasty-chibi.md) 独立定代。

### boluo 只锁什么 · 不锁什么（2026-05-19 · 新旧对话必守）

> **用户定调**：boluo 清新风 **≠** 全系列统一「4 女 + 左二右二 + 六同款碗」。不同食物 **人数、料件、场景、站位、器皿** 必须不同。

| **只锁（画风）** | **不锁（按菜查表）** |
|------------------|----------------------|
| 明亮通透、高 key、写实主菜 | 厨师 **3～5 人**（各菜独立，**禁止**默认 4 人） |
| 棕刷顶题 + 奶油/米色描边 | 底行料 **4～6 件**（各菜独立，**禁止**默认 6 件） |
| 底行 **横木牌**（禁竖奶油签、禁绿矩形） | **场景**（蒸档 / 档口一字排 / 馕坑 / 起酥案板 / four à sole…） |
| 主菜居中上 45～55%，与底行明显留白 | **站位**（L 形工坊、流水线、贴档口…**禁止**机械左二右二对称） |
| 3D chibi · **默认全员女性** · 禁穿模 | **器皿**（粉袋/冰桶/签筒/黄油块…**禁止**六只同款瓷碗凑数） |
| | **竖牌** `{省/国}味道`（按地区 md） |
| | **时代服饰**（按 [food-poster-dynasty-chibi.md](food-poster-dynasty-chibi.md)） |

**`boluo_chaofan_poster.png` 是画风锚，不是构图模板。** 生成前 **MUST** 读 [food-poster-ingredients.md §按菜定布局](food-poster-ingredients.md#按菜定布局--人料皆可变2026-05--新旧对话必守) 本菜行；**出图前**回复：

```text
| 菜名 | 时代 | 性别 | 厨师人数 | 场景/站位 | 随机? |
| 料名 | 容器 | 件数 |
```

**禁止（boluo 批常见错）**：

- 全库默认 **4 女 + 对称 2+2 四角**（即使 prompt 写 NOT symmetric 仍须 **先定人数再写 EXACTLY N**）
- 全库默认 **底行 6 只同款碗** + 六料横木牌
- 把 boluo 参考图理解成「复制菠萝炒饭的人数与站位」
- 同地区多菜（港/疆/法）共用同一厨房构图，仅换主菜名

**正例（同 boluo 风、构图须不同）**：丝袜奶茶 **3** 女档口一字排 · 5 料 · 肠粉 **5** 女蒸档 · 6 料 · 咖喱鱼蛋 **3** 女 · **4** 料 · 法棍 **3～4** 女 boulangerie L 形 · **5** 料 — 见 [food-poster-ingredients.md](food-poster-ingredients.md) 各省节。

### 清新风观感（对齐 `boluo_chaofan_poster.png` · 仅画风）

| 项 | 要求 |
|----|------|
| **整体** | **清新明亮**：高 key、通透、不灰不闷；热带户外或敞亮摊档；画面 **锐利清晰** |
| 光影 | **黄金时刻**暖光 + 适度高光；写实主菜油光可见；浅景深棕榈/街景 bokeh |
| 色调 | 饱和度适中偏高、食欲感强；**禁止**暗沉厨房、浑浊 HDR、过度 3D 塑料感 |
| 顶题 | **棕刷书法** + **奶油/米色描边** + 柔光（与菠萝炒饭定稿一致） |
| 绿条副标题 | **省略**（清新风不套默认绿条幅，除非用户点名） |
| 主菜 | 居中上 **45～55%**，巨型写实单品；与底行 **明显留白** |
| 人物 | 3D chibi · **人数 3～5 按本菜表** · 站位随场景（桌边/档口/工坊）；**默认全员女性**；不挡主菜；**禁止**默认左二右二对称四人 |
| **底行料签** | **必横木牌**；**禁止**竖奶油签（`_no_char` 历史底行勿抄） |

### 与默认 diorama 的差异（简表）

| 项 | 默认 diorama | **boluo 清新风** |
|----|----------------|------------------|
| 画风关键词 | 微缩商业海报感 | **清新** + **清晰** + **写实主菜** |
| 顶题 | 大红 3D 立体字 | 棕刷字 + 奶油描边 |
| 底行 | 横木牌（通用默认） | 横木牌（**强制**，禁竖奶油签） |

### 横木牌（本风格强制）

- 底行 **4～6 件**（件数仍查本菜表）；每件器皿 **正下方** 或碗前桌面：**横长方形木牌**（浅棕木纹、深棕边框、**横排**黑字 2～4 字）。
- **禁止**：竖式奶油/米色长条签、竖木纹料签、绿底矩形数码标签（旧 `boluo_chaofan_poster_no_char` 底行仅为历史样张，**不作**新图料签范式）。
- 版式锁：主菜 **居中上 45～55%**；主菜与底行之间 **明显留白**；底行仅占 **12～18%** 高；器皿小于主菜、**不压**主菜。

### 参考图顺序（生成 boluo 清新风）

1. **`boluo_chaofan_poster.png`**（**必读 · 画风主锚**）— **仅**借：明亮通透、棕刷顶题、横木牌样式、主菜占比与底行留白；**勿抄**其 4 人构图  
2. [food-poster-ingredients.md](food-poster-ingredients.md) **本菜行** — 人数、料件、场景/站位（**先于** GenerateImage）  
3. `boluo_chaofan_poster_no_char.png`（可选）— 仅补户外高亮与 bokeh  
4. 同省**不同菜**已定稿 `_poster.png`（若已有）— 仅借竖牌/地区气质，**勿**统一复制人数与站位

### 英文 prompt 片段（贴入 GenerateImage）

```text
MATCH boluo_chaofan FRESH CLEAR style (boluo_chaofan_poster.png): bright airy golden-hour, high-key appetizing, sharp photoreal hero food, clean uncluttered vertical poster, NOT dark muddy NOT heavy 3D plastic — STYLE ONLY, NOT copy boluo_chaofan 4-person layout.
EXACTLY {N_CHEFS} female 3D chibi per dish table ({N_CHEFS} is 3 OR 4 OR 5 — NOT default 4). Scene layout: {SCENE_LAYOUT} — NOT symmetric 2+2 corner template, NOT six identical bowls.
Hero dish CENTER-UPPER 45-55% with CLEAR GAP above bottom row; bottom only 12-18%; EXACTLY {N_INGREDIENTS} ingredient vessels with varied shapes.
Top title {DISH_CN}: bold Chinese brush calligraphy dark chocolate brown with cream/beige outline and soft glow (boluo title style).
Bottom row: each ingredient with horizontal tan wooden plaque UNDER vessel (dark brown border, horizontal text) — NOT vertical cream tags, NOT green rectangular labels, NOT six matching porcelain bowls unless dish table says so.
Vertical carved wooden sign "{REGION_TASTE}" e.g. 海南味道.
NO green curved subtitle banner unless user requests.
```

人物、时代、`{DynastyDressEN}`、对白体气泡 → 仍遵 [meishi-food-poster-era.mdc](../../.cursor/rules/meishi-food-poster-era.mdc) 与 [food-poster-ingredients.md](food-poster-ingredients.md)。

**已入库 boluo 清新风 + 横木牌**（示例）：`boluo_chaofan_poster.png`（主锚）、`jp/gyoza_poster.png`（日本·日文料签）、海南系列见 `cn/hainan/` 各 `_poster.png`。

---

## 画面要素清单

| 元素 | 要求 |
|------|------|
| 主菜 | 占画面约 40～50%，质感写实（油光、蒸汽、冰雾） |
| 人物 | **3～5 位** 3D chibi（按菜定）：**默认全员女性**（优先女性，见 [food-poster-ingredients.md](food-poster-ingredients.md)）；**朝代/时代服饰**；站桌边/四角，**不挡主菜** |
| 标题 | 顶部 **3D 大红字** + 白/金描边，菜名中文 |
| 副标题 | 绿色弧形/条幅：如 `海南经典 · … · …`（三句短语用 · 分隔） |
| 竖牌 | `{省}味道` / `{国}味道` / 广域文化圈（如 `东京味道`、`江户味道`）；**非**街景分区名（见上文「与街景无关」） |
| 气泡 | 有人物版 **3～5 条**（≤厨师人数）；文体见 [food-poster-speech-bubbles.md](food-poster-speech-bubbles.md)（**对白体**默认 / **标语体**仍可用） |
| 前景 | 小料碗、蘸料、椰青、水果等（按菜） |
| **底行料签** | **按菜** 4～6 件 + 厨师 **3～5 人**（均查表，可不等）；器皿随料；横放木牌；见 [§人料皆可变](food-poster-ingredients.md#按菜定布局--人料皆可变2026-05--新旧对话必守)。**禁止**绿底矩形、禁止全库统一五人+六同款碗 |
| 桌布 | 红白格或绿白格（与金标准一致） |
| 画幅 | 竖版商业海报，`vertical poster` |

---

## 场景选择

| 菜品类型 | 推荐场景 | 示例 |
|----------|----------|------|
| 鸡饭、火锅、粉面（热食） | 暖色 **厨房 / 老爸茶档口** | 文昌鸡饭、椰子鸡 |
| 甜品、冰品 | **夜市**（灯串、棕榈、虚化摊位） | 清补凉 |
| 系列统一 | 同一菜品「有人物 / 无人物」**必须用同一布景** | 清补凉两版均为夜市 |

---

## 版本策略

| 版本 | 文件名 | 说明 |
|------|--------|------|
| 标准（有人物） | `{slug}_poster.png` | 默认对外主视觉 |
| 无人物 | `{slug}_poster_no_char.png` | 裁切友好；**优先整图重生成**，勿只局部擦除 |

### 无人物版要点（经验证）

- **不要**留空梯子、空凳子（会像缺人）。
- 用 **食物动态** 代替叙事：椰奶倒入、勺起分层、加冰、小料碗环绕。
- **禁止**对碗沿做大面积 inpaint（易产生右侧模糊/方块瑕疵）。
- **标准流程**：`reference_image_paths` 同时引用 `qingbuliang_poster_no_char.png`（版式金标准）+ 本菜 `_poster.png`（菜品与场景）；勿仅用独立英文 prompt 另起一张。
- 版式要素：底部 **按菜重点食材展示**（4～6 件，器皿随料变）+ **横放木牌料签**（碗/碟正下方或碗前桌面）、TOP1 徽章、左右地域木牌、食物动效、无梯子。人物版与无人物版 **同料名**。
- **食材清单**：生成前先查 [food-poster-ingredients.md](food-poster-ingredients.md) 或省 md 菜品描述，列出本菜重点料再写 prompt；禁止为凑碗数加无关配菜。

### 批量效率

1. 先 1 张有人物定调 → 用户确认  
2. 再同批 3～6 张或补无人物版  
3. 10 张一批可以，但风格可能轻微漂移，需筛图

---

## 命名与入库

- `slug` = 菜品拼音小写，如 `wenchang_jifan`、`qingbuliang`、`yezi_ji`
- 生成后常在 Cursor `assets/`，**复制到** `asserts/Gourmet recipe2/`
- 更新 `docs/china/{省}.md` 的 `gourmet_posters` 与海报表

---

## 英文提示词骨架（有人物）

将 `{DISH_CN}` `{DISH_EN}` `{TAGLINE}` `{SCENE}` `{FOOD_DESC}` `{ACTIONS}` 替换后用于 `GenerateImage`：

```text
Vibrant 3D-rendered Chinese food promotional poster, miniature diorama toy photography style.
{SCENE}. Central focus: oversized photorealistic {FOOD_DESC}.
{CHEF_COUNT} cute 3D chibi figures in {DynastyDressEN}, distinct cooking actions at table edges, NOT blocking food (see food-poster-dynasty-chibi.md): {ACTIONS}.
{BUBBLE_COUNT} rounded Chinese speech bubbles with tails to chefs' mouths. BUBBLE_STYLE dialogue OR slogan (see food-poster-speech-bubbles.md): {BUBBLE_LINES}. Top: large bold 3D red title "{DISH_CN}" cream outline.
Green banner "{TAGLINE}". Vertical wooden sign "海南味道". Warm appetizing cinematic lighting,
red-white or green-white checkered tablecloth, vertical commercial poster, highly detailed, no watermark.
```

**SCENE 示例**

- 厨房：`Warm rustic Hainan kopitiam kitchen, wooden furniture, soft bokeh, NOT night market`
- 夜市：`Tropical Hainan night market dusk, string lights, palm trees, blurred stalls, neon 海南夜市`

---

## 英文提示词骨架（无人物）

```text
Same composition and scene as reference poster but ZERO people NO characters NO dolls NO ladder NO wooden ladder.
{FOOD_DESC} CENTER-UPPER 45-55% fully visible with CLEAR GAP above bottom props.
Bottom foreground lowest 12-18%: ingredient items in varied vessels, each with horizontal wooden plaque UNDER or in front (tan wood grain, dark brown border, black horizontal Chinese) — NOT green rectangular labels.
Top 3D title "{DISH_CN}", green banner "{TAGLINE}", 海南味道 sign, sharp crisp rim no blur,
vertical poster, highly detailed, no watermark.
```

有参考图时：`reference_image_paths` 指向同菜 `{slug}_poster.png`。

---

## 混风格禁忌

- 不用 `Street View` 等距街景 brief  
- 不用 `mini-zine` 羊皮纸分栏版式  
- 不要 2D 扁平插画、不要纯美食特写无标题无道具（会显得空）

---

## 相关文档

- 三大资源总览：[ASSETS.md](../ASSETS.md)  
- Agent 执行：[.cursor/skills/meishi-food-poster/SKILL.md](../../.cursor/skills/meishi-food-poster/SKILL.md)  
- 人物气泡（新旧文体）：[food-poster-speech-bubbles.md](food-poster-speech-bubbles.md)  
- 人物时代服饰：[food-poster-dynasty-chibi.md](food-poster-dynasty-chibi.md)（与 mini-zine 同表）  
- 提示词实例：[prompt-templates.md](../../.cursor/skills/meishi-food-poster/prompt-templates.md)
