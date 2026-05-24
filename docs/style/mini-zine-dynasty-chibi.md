# mini-zine · 时代服饰 3D Q 版规范（古代 → 2026）

**风格 ID**：`mini-zine-dynasty-chibi`  
**目录**：`asserts/mini-zine/{cc}/{admin}/`  
**海报人物**：`Gourmet recipe2/` 共用**同一套时代代号表**与国别切换（版式见 [food-poster-dynasty-chibi.md](food-poster-dynasty-chibi.md)）。**海报与 zine 同 slug 不强制同时代**——各自独立定代；仅当用户说「跟 zine 一致」「跟海报一致」才对齐。

---

## 一句话

有人物版一律 **3D chibi**；**服饰时代**由「食物 + 当地风格 + 国别」决定。**同 slug**：**标准 mini-zine 2 张** + **叙事四页 4 张**（共 6 张，同时代）；海报 `{slug}_poster` 单张。**海报与 zine 可不同代**。拿不准时从候选池随机（可复现）。

**无人物 zine 已废除** → [asset-no-character-removed.md](asset-no-character-removed.md)（新旧对话禁止生成 `*_mini_zine_no_char*`）。

**角色性别**：有人物版 **优先女性**（默认全员女性 chibi）。详见下节 §角色性别；海报同规 → [food-poster-dynasty-chibi.md](food-poster-dynasty-chibi.md)。

**构图金标准（宋）**：`mini-zine/_templates/487c2f*.jpg`（江南故事 zine）；服饰则按本文件时代表，不必全用宋服。

**美国 `mini-zine/us/` · 英文画面文案（必守）**：面板、步骤、角标、气泡一律 **English**；三语后缀规划见 [mini-zine-i18n.md](mini-zine-i18n.md)。

**日本菜 · 借版式不借地标（必守）**：可参考 `cn/hainan/*_mini_zine.png`（有人物版）的**清新色谱**与**网格版式**；**禁止** `wenchang_jifan_*` 及海南/西湖地标文案。日本 mini-zine 定调见下节 §日本 mini-zine 定调（当地 + 服饰随机）；角标用 **`{属地}の味`**（非全国菜勿硬套东京塔）。

---

## 故事小志 · 内容力求真实（2026 · 新旧对话必守）

**故事与吃法、文化页、食材图鉴、叙事气泡**——凡写入画面的中文，以**可核对的事实**为准，不图省事编造朝代或典故。

### 查阅顺序（出图前必做）

1. 本菜所在 **`docs/china/*.md` / `docs/world/*.md`**（风味图鉴、菜肴条、`web_posters` / mini-zine 备注）  
2. **`.cursor/skills/gourmet-recipe-mini-zine/dynasty-chibi.md`** 已收录行的 **文案源流** 列  
3. 仍缺年代/得名 → 检索方志、地方志摘要或权威百科**一句核实**，再写进 prompt；**拿不准则写地理、物产、吃法**，不写具体朝代  

### 可写 / 慎写 / 禁止

| 类型 | 规则 |
|------|------|
| **可写** | 产地、时令、工艺、口感、当代吃法、有出处的得名传说（可标「相传」） |
| **慎写** | 具体朝代、历史人物、年号——须有文献或地区 md 锚定 |
| **禁止** | 为凑古风编造「宋代/唐代就已…」；服饰 `song` 推导食物断代；张冠李戴（把 A 菜典故套给 B 菜） |
| **`cn/`** | 画面文案 **纯中文**（`us/` 英文见 [mini-zine-i18n.md](mini-zine-i18n.md)） |

### 画面文案 vs 服饰时代（解耦）

| 维度 | 规则 |
|------|------|
| **`{era}` / `{DynastyDressEN}`** | 只决定 **3D chibi 服装与道具气质** |
| **故事文案** | **按食物真实源流**，与服饰代号无关 |

**例 · 文昌鸡饭 `wenchang_jifan`**：服饰 `song`；文案 **明代得名**、琼东散养、白切+鸡油饭——**不得**写宋代起菜。

### 出图前表（叙事稿必含）

`| 菜名 | slug | 时代(服饰) | 文案源流摘要 | 依据 |`

- **依据**：如 `hainan.md §文昌鸡`、`dynasty-chibi 表`、`方志相传`  
- 用户纠正史实 → **以用户与 md 为准**，重做气泡/文化页文案

---

## 叙事四页 · 标准双轨（2026-05 · 新旧对话必守）

`按 mini-zine` **默认做齐**标准 2 张 + 下列 4 页（用户可说「只要标准两张」）。

| 阅读序 | 页 | 现行文件 | 推荐新名（见 [ASSETS.md](../ASSETS.md)） | 内容 |
|--------|-----|----------|----------------------------------------|------|
| **1** | 标准 | `{slug}_story_eating_mini_zine.png` | `{slug}_mini_zine_p01_story_eating.png` | 左四栏故事与吃法 |
| **2** | 叙事 01 | `{slug}_narrative_01_story_mini_zine.png` | `{slug}_mini_zine_p02_narr_story.png` | 全幅场景 + 气泡；**纯中文** |
| **3** | 叙事 02 | `{slug}_narrative_02_culture_mini_zine.png` | `{slug}_mini_zine_p03_narr_culture.png` | 文化/渊源；**按真实史** |
| **4** | 叙事 03 | `{slug}_narrative_03_street_mini_zine.png` | `{slug}_mini_zine_p04_narr_street.png` | 关联街景沙盘 |
| **5** | 叙事 04 | `{slug}_narrative_04_ingredients_mini_zine.png` | `{slug}_mini_zine_p05_narr_ingredients.png` | 食材图鉴 |
| **6** | 标准 | `{slug}_recipe_mini_zine.png` | `{slug}_mini_zine_p06_recipe.png` | 四步做法 |

已定稿 slug **勿批量改名**；新菜用 `p01`…`p06` 便于文件夹排序与阅读器缩略图 **01–06** 一致。

---

## 六页版式金标准（2026-05 · wenchang_jifan × laobacha）

> **锚图**（入库路径，生成前只读对照，勿跨画风混参考）  
> | 页 | 文昌鸡饭 `wenchang_jifan` | 老爸茶 `laobacha` |
> |----|---------------------------|-------------------|
> | p01 | `mini-zine/cn/hainan/wenchang_jifan_mini_zine_p01_story_eating.png` | `…/laobacha_mini_zine_p01_story_eating.png` |
> | p02 故事 | `…/wenchang_jifan_mini_zine_p02_narr_story.png` | `…/laobacha_mini_zine_p02_narr_story.png` |
> | p03 文化 | `…/wenchang_jifan_mini_zine_p03_narr_culture.png` | `…/laobacha_mini_zine_p03_narr_culture.png` |
> | p04 街景 | `…/wenchang_jifan_mini_zine_p04_narr_street.png` | `…/laobacha_mini_zine_p04_narr_street.png` |
> | p05 食材 | `…/wenchang_jifan_mini_zine_p05_narr_ingredients.png` | `…/laobacha_mini_zine_p05_narr_ingredients.png` |
> | p06 做法 | `…/wenchang_jifan_mini_zine_p06_recipe.png` | `…/laobacha_mini_zine_p06_recipe.png` |
>
> **分工**：p01/p04/p06 结构以 **laobacha** 为壳；**p02 故事 · p03 文化 · p05 食材** 的信息密度与版式以 **wenchang_jifan** 为壳。

### 全页共用（硬规）

| 项 | 规则 |
|----|------|
| 画幅 | 横 **3:2**；**p02–p05 必须 FULL-BLEED**（羊皮/场景铺满，**禁左右大白边**） |
| 人物 | **前景主角仅 3D chibi**（2.5–3 头身，带气泡）；**背景可弱化真人**（见 `laobacha` p01/p04：远景、小比例、浅景深/降饱和，**无气泡**、不抢 chibi 与主菜）；**禁 2D 扁平贴纸**；**禁写实人物作前景主角或带对白** |
| 性别 | **默认全员女性**；prompt 必含 `cute female 3D chibi` / `all female` |
| 人数 | **3～5**；桌边/四角/场景边，**不挡主菜、不与碗盘穿模** |
| 文案 | 中国 `cn/` → **纯中文**；日本 `jp/` → **`{属地}の味`** + 日文（见 §日本 mini-zine 定调） |
| 气泡 | **对白体**默认（[food-poster-speech-bubbles.md](food-poster-speech-bubbles.md)）；8～18 字，绑动作/场景 |
| 事实 | 故事/文化/食材须可核对（见上节 §故事小志）；**禁止张冠李戴** |
| 角标 | 圆章 `{地域}风味 mini zine 03`（p01）或 `02`（p06）；竖牌 `{地域}味道`（中国省菜） |
| 底栏 | `{地域}风味 \| {菜名}` 或 `{地域} · {地标} · {菜名}` |

### p01 · 故事与吃法（壳：laobacha + wenchang_jifan）

| 区块 | 要求 |
|------|------|
| 顶区 | 主标题 **「{菜名} 故事与吃法」** + 一行副标题（风味关键词） |
| 左栏 **四格** | ① **风味**（口感/香气） ② **怎么吃**（步骤或顺序） ③ **氛围/健康/小贴士**（择一） ④ **去哪/场景/属地**（店名、地标、时令） |
| 中区 | **主菜大图** + 蘸料/配餐；背景 **当地软景**（如骑楼、椰林、西湖） |
| 人物 | 3～5 女 chibi **围桌/四角**；2～4 条 **对白气泡**；背景茶室/骑楼内 **可** 有弱化真人食客（小、虚、无气泡），参照 `laobacha_mini_zine_p01_story_eating.png` |
| 竖牌 | 省/市味道竖牌（如 **海南味道**、**杭州味道**） |

**文昌鸡饭范例（左栏）**：风味五星感、怎么吃三蘸、健康/散养、环境/骑楼。  
**老爸茶范例（左栏）**：风味（浓酽茶+蒸笼）、怎么吃（早茶点心）、氛围（一坐半天）、去哪（河坊/聚福恒兴）。

### p02 · 故事（壳：wenchang_jifan · 金标准）

| 区块 | 要求 |
|------|------|
| 顶区 | 大标题 **「故事 · {一句主题}」** + 副标题（如「一只鸡 · 一座岛 · 一份传承」）+ 朱印 **「故事」** |
| 主场景 | **全幅**当地场景（农家/茶室/厨房/摊点）；人物 **参与动作**（散养、开笼、炖肉、点茶） |
| 气泡 ×3 | 各讲 **一条事实**：① 物产/地理 ② 得名/典故（有依据） ③ 经典吃法 |
| 底段 | **2～4 句说明文**（可核对摘要）+ 地域 seal（如 **文昌印记**、**海口印记**） |
| 可选 | 左下角 **水墨小插图**（典故/旧照感），与 3D 主场景并存 |

**Prompt 必写**：`FULL-BLEED` · `ZERO white side margins` · 说明文勿编造朝代。

### p03 · 文化（壳：wenchang_jifan · 金标准）

| 区块 | 要求 |
|------|------|
| 顶区 | **「文化 · {主题}」** + 副标题 + 朱印 **「文化」** |
| 左栏 | **竖卷轴 3 联**（或 3 张横卷），每联含：**小标题 + 水墨/线稿插图 + 2～3 句** |
| 三联内容 | 建议固定三类（按菜替换）：① **得名/历史** ② **地理/物产/工艺** ③ **与易混菜对比** 或 **当代地位** |
| 右栏 | 1 女 chibi **2～3 姿势**（持卷、指图、讲解）+ **1 条总结气泡** |
| 可选 | 左上 **意境地图/地标示意图**（如琼东文昌、西湖） |
| 底栏 | 朱印 **「文化篇」** + `{地域}风味` 圆章 |

**老爸茶三联范例**：名字由来 / 点心谱系 / 与清补凉别。  
**文昌鸡饭三联范例**：明代得名 / 文昌地名 / 散养椰林。

### p04 · 街景（壳：laobacha）

| 区块 | 要求 |
|------|------|
| 顶区 | **「街景 · {地标+场景}」** + 副标题 + 朱印 **「街景」** |
| 主场景 | **当地可识别街景**（骑楼、横丁、河坊、池袋等）；店招含 **本菜名**；微缩沙盘/3D 街景气质 |
| 人物 | 3 女 chibi（前景、带气泡）；街景背景 **可** 弱化真人路人/食客（参照 `laobacha_mini_zine_p04_narr_street.png`） |
| 底栏 | `{城市} · {地标} · {菜名}` |

关联文档：同地区 **Street View** 原型 md（仅借地标气质，**不**复制街景 PNG 构图）。

### p05 · 食材（壳：wenchang_jifan · 金标准）

| 区块 | 要求 |
|------|------|
| 顶区 | **「食材 · {一句主题}」**（如「一只文昌鸡的味道图谱」）+ 朱印 **「食材」** |
| 主布局 | **中心主材大图**（如整鸡、茶点组合、鱼、面碗）+ **环绕标注** |
| 标注 | 每项 **竖牌/横牌中文名** + 小图（生/熟均可）；**5～8 项**，含主材、核心配材、蘸料 |
| 人物 | 1～2 女 chibi **互动道具**（放大镜、托盘点料）——**仅 3D chibi** |
| 底栏 | 横卷 **一句收束**（如「滑甜肉质 · 皮薄骨软 · 三蘸提鲜」）+ 朱印 **「食材图鉴」** |

**禁止**：写他菜食材（如把清补凉料写进老爸茶 p05）。

### p06 · 做法（壳：laobacha）

| 区块 | 要求 |
|------|------|
| 顶区 | **「做法 · {菜名}」** + **「四步上桌」** + 朱印 **「做法」** |
| 主体 | **①②③④** 四步；每步 **1 句 + 小插图**（可并排或田字） |
| 人物 | 1～2 女 chibi + **对白气泡**（绑当前步骤） |
| 底栏 | `{地域}风味 \| {菜名}` |

体验版（茶点、早茶）可写「点单→上桌→食用→搭配」，不必强行写家庭灶台四步。

### 出图前表（六页 · 必含）

`| 菜名 | slug | 属地 | 时代(服饰) | 性别 | p02 故事要点 | p03 文化三联 | p05 食材清单 | 随机? |`

### Agent Prompt 尾缀（复制块）

```
Foreground characters: ONLY cute female 3D chibi figurines WITH (speech bubbles)
Background extras: optional softened out-of-focus photorealistic passersby (like laobacha p01/p04) — small scale, desaturated/blurred, NO speech bubbles, must NOT compete with chibi or hero dish
NO 2D flat sticker characters; NO photorealistic humans as foreground protagonists with dialogue
FULL-BLEED on p02-p05 — ZERO white side margins
Follow mini-zine-dynasty-chibi.md §六页版式金标准:
  p01 four left panels + center dish (laobacha shell)
  p02 story scene + 3 bubbles + bottom factual paragraph (wenchang_jifan shell)
  p03 culture three scrolls + chibi guide (wenchang_jifan shell)
  p04 street local landmark + shop signs (laobacha shell)
  p05 ingredient orbit map + labels + bottom tagline (wenchang_jifan shell)
  p06 four recipe steps (laobacha shell)
Content from docs/china|world *.md — no cross-dish mix-ups
```

---

## 角色性别 · 优先女性（2026 · 新旧对话必守）

| 项 | 规则 |
|----|------|
| **默认** | 有人物 mini-zine / 海报 → **全员女性** 3D chibi（厨师、食客、帮厨造型均按所选时代服饰，性别为女） |
| **Prompt** | 必含 `cute female 3D chibi` / `all female characters` / `all female cooks`（写在 `{DynastyDressEN}` 前或句末） |
| **禁止** | 默认全员男性、默认「绿围裙男厨师」、未写性别导致生成全男 |
| **例外** | 用户点名「要男性」「男女各半」或史料强锚定（如指定历史人物性别）→ 可含 **≤1 位** 男性，**其余仍为女性** |
| **无人物版** | **已废除** — 不再生成 zine `_no_char` |

与 [food-poster-ingredients.md](food-poster-ingredients.md) §性别、`.cursor/rules/meishi-mini-zine-era.mdc`、`.cursor/rules/meishi-food-poster-era.mdc`（`alwaysApply`）一致。

---

## 锁定范围 · 「一对」定义（2026 · 新旧对话必守）

本仓库 **「一对」仅指同一画风、同一 slug 内的成套文件**，**不**指海报 + mini-zine 绑在一起。

| 画风 | 「一对 / 一套」指什么 | 同时锁什么 | 不锁什么 |
|------|----------------------|------------|----------|
| **mini-zine** | 同 slug **标准 2 + 叙事 4** | 同时代、同服饰；标准=四栏+四步，叙事=01～04 | 与 `{slug}_poster` **不要求**同时代 |
| **Gourmet recipe2 海报** | 同 slug **1 张** | `{slug}_poster` → **时代 + 布景 + 人料布局** | 与 `{slug}_*_mini_zine*` **不要求**同时代 |

**跨画风**：海报与 zine **各自独立定时代**（共用代号表：`song`/`ming`…、`us_*`、`jp_*`）。  
**例外**：用户明确说 **「跟 zine 一致」** / **「跟海报一致」** → 才对齐另一侧。

**alwaysApply**：`.cursor/rules/meishi-mini-zine-era.mdc` · `.cursor/rules/meishi-food-poster-era.mdc` · [AGENTS.md](../../AGENTS.md)

---

## 决策流程（Agent 必走）

```
1. 强锚定？（典故、发明史、文献、菜名地名）
   → 是：用对应单一时代，不随机
2. 查 dish-to-region / dynasty-chibi 已收录行
   → 有「固定时代」：用该行
   → 有「候选池」：进入步骤 3
3. 按「地域 × 吃法场景」查候选池表（下文）
   → 仅 1 个候选：直接用
   → 多个候选：随机抽 1（见 §随机规则）
4. 填生成表（菜名、时代代号、服饰摘要、背景、角标）→ 再出图
```

---

## 时代代号一览（古代 → 2026）

| 代号 | 年代 | 3D chibi 服饰要点 | 适用气质 |
|------|------|-------------------|----------|
| `pre_qin` | 先秦 | 深衣、冠带简化；祭祀/GDP 礼仪菜 | 古早礼仪、九鼎宴 |
| `han` | 汉 | 曲裾/直裾、冠冕简化 | 丝路、中原厚重 |
| `tang` | 唐 | 圆领袍、襦裙、幞头；胡风 | 长安市井、烤肉酪饮 |
| `song` | 宋 | 襕衫、褙子、百迭裙、东坡巾 | 文人宴、江南精致（**西湖样张**） |
| `yuan` | 元 | 质孙服、袍服简化 | 草原融合、牛羊面食 |
| `ming` | 明 | 立领袄、比甲、网巾/布巾 | 市井面馆、漕运码头 |
| `qing` | 清 | 长衫、马甲、瓜皮帽可爱化 | 京冀卤煮、宫廷小吃民间化 |
| `republic` | 民国 | 旗袍、长衫、学生装、南洋衬衫 | 骑楼、老爸茶、海派 |
| `prc_50s` | 1950s–70s | 中山装、工装、蓝灰棉布、搪瓷缸 | 国营食堂、大锅饭记忆菜 |
| `prc_80s` | 1980s–90s | 花衬衫、喇叭裤简化、早期围裙 | 个体餐馆兴起、家常菜 |
| `prc_2000s` | 2000s–2010s | 休闲 T 恤、牛仔裤、简易围裙 | 连锁快餐、商场美食街 |
| `contemporary` | 2015–**2026** | 卫衣/冲锋衣、外卖马甲、夜市围裙、棒球帽、现代厨师服 | 炸炸、板面夜宵、网红小吃 |
| `ethnic` | 民族 | 仅文档点名；黎苗等简化 | 竹筒饭、五色饭 |
| `overseas` | 海外（**兼容旧稿**） | 见下「按国家切换」 | 新做 `docs/world/` **不用**本行默认 |

同一 `slug` 四套：**时代代号 + 服饰 locked**。

---

## 按国家切换时代体系（必守）

| 文档 | 代号体系 | 禁止混用 |
|------|----------|----------|
| `docs/china/*.md` | 中国：`pre_qin` … `contemporary` | `us_*`、`jp_*` |
| [usa.md](../world/usa.md) | **美国：`us_*`**（见下表） | 宋/明/清/汉服等中国朝代 |
| [japan.md](../world/japan.md) | **日本：`jp_*`**（江户/明治/昭和/令和） | 中国朝代；新稿不用笼统 `overseas` |

生成前：先读文档 `type: country` 与路径 → 选对应国别表；**不得**给纽约热狗穿襕衫、给文昌鸡穿 newsboy cap。

### 美国 · `us_*` 时代一览（原住民·生生至今 + 开国 → 2026）

**禁止**对中国菜用本表；**禁止**对美国菜用 `song`/`ming`/`contemporary`（中国当代）。新做 `docs/world/usa.md` **不得**默认 `overseas` 或中国 `contemporary`。

文档用语：**原住民**（Indigenous / Native American）为规范称谓；用户口语「印第安」指同一套 **`us_indigenous*`** 代号，**禁止**好莱坞刻板扮装。

| 代号 | 年代 | 3D chibi 服饰要点 | 典型场景 |
|------|------|-------------------|----------|
| `us_indigenous` | 原住民·传统（土地上的饮食史） | **尊重简化**：按菜品地域选可读元素（西南 Pueblo 毯纹围裙、平原缎带衬衫无神圣战羽、太平洋西北 formline 纹围裙、东北/大湖鹿皮元素简化）；**禁止**羽毛战冠 mascot、面部彩绘丑化、泛化「印第安」单一套装 | 三道姐妹、野米、熏鲑、部落集市、玉米料理渊源 |
| `us_indigenous_modern` | 原住民·当代（2000s–**2026**） | 当代原住民厨师/家庭：缎带衬衫、现代围裙、部落图案 T 恤简化、原住民自营餐馆制服； dignified casual | 当代原住民餐馆、fry bread 摊（注明现代创制史）、美食复兴运动 |
| `us_colonial` | 1776–1800 | 简化三角帽、马甲、联邦早期围裙面包师 | 开国烘焙、殖民市集 |
| `us_antebellum` | 1810s–1860 | 拓殖工装、宽檐帽、南北前街贩 | 河运码头、早市 |
| `us_gilded` | 1870s–1900 | 维多利亚街贩、德裔移民围裙、报童帽 | 椒盐卷饼、移民烘焙 |
| `us_progressive` | 1900s–1910 | 进步时代简西装、新移民围裙、帽针 | 工厂城午餐、熟食铺 |
| `us_roaring_20s` | 1920s | 报童帽、吊带裤、flapper 风简裙 | 地铁口餐车、禁酒令前后 |
| `us_depression_war` | 1930s–1945 | 工装、食堂围裙、二战简军便服可爱化 | 大萧条食堂、USO 小食 |
| `us_50s_diner` | 1950s | 餐厅女侍、苏打柜台、圆领短袖、格纹围裙 | 公路 diner、汉堡炸鸡 |
| `us_sixties` | 1960s–70s | 波普色块、公路餐厅、喇叭裤简化 | 公路旅行餐、奶昔吧 |
| `us_80s_nyc` | 1980s | 防风外套、大步裤、街头休闲、Walkman 时代 | 纽约快餐复兴 |
| `us_90s` | 1990s | 宽松卫衣、棒球帽反戴、滑板街头 | 西海岸 mall food、grunge 街食 |
| `us_contemporary` | 2015–**2026** | 餐车围裙、卫衣、现代厨师马甲 | 热狗 cart、外卖、food truck |

**开国至今全集（默认随机池）** — `docs/world/usa.md` 无场景锚定、表内无固定行时用（**含原住民两档**）：

`us_indigenous` · `us_indigenous_modern` · `us_colonial` · `us_antebellum` · `us_gilded` · `us_progressive` · `us_roaring_20s` · `us_depression_war` · `us_50s_diner` · `us_sixties` · `us_80s_nyc` · `us_90s` · `us_contemporary`

**美国场景候选池（优先于全集；仍服从强锚定）**

| 场景 | 随机池 |
|------|--------|
| **原住民饮食**（野米、三道姐妹、熏鲑、部落集市玉米料理等） | **`us_indigenous`** · `us_indigenous_modern`（二选一或强锚定单列） |
| 纽约街头 cart（热狗、pretzel、披萨 slice） | `us_roaring_20s` · `us_gilded` · `us_80s_nyc` · `us_contemporary` |
| 汉堡 / 快餐 / diner | `us_roaring_20s` · `us_50s_diner` · `us_80s_nyc` · `us_contemporary` |
| 烧烤 / 南部 | `us_antebellum` · `us_50s_diner` · `us_depression_war` · `us_contemporary` |
| 西海岸 / 精酿吧当代符号 | `us_sixties` · `us_90s` · `us_contemporary` |
| 新英格兰海鲜 | `us_colonial` · `us_gilded` · `us_contemporary` |
| 西南部 / 沙漠物产（非墨西哥裔 taco 时） | `us_indigenous` · `us_gilded` · `us_contemporary` |

**原住民造型 · 文化尊重（必守）**

| 允许 | 禁止 |
|------|------|
| 按**菜品地域**选西南/平原/太平洋西北/大湖等**简化**日常或节庆便服元素 | 神圣战羽、全羽冠当 mascot、面部战纹丑化 |
| 当代原住民厨师、家庭烹饪、部落图案围裙/T 恤 | 「好莱坞印第安」、泛化单一套装套所有菜 |
| chibi 可爱但** dignified**；与食物动作一致（捣玉米、熏架、煮汤） | 把原住民当异域道具；与殖民时代服饰混穿同一小人 |

随机：`index = sum(ord(c) for c in slug) % len(pool)`，`era = pool[index]`（跨环境可复现；**勿**用 Python 内置 `hash()`，进程间盐值不一致）。

**美国强锚定（原住民 · 示例）**

| 菜品/主题 | 时代 |
|-----------|------|
| 三道姐妹（玉米·豆·南瓜）、野米饭、太平洋西北熏鲑 | `us_indigenous` |
| fry bread / 印第安炸面包（当代摊售） | `us_indigenous_modern`（可注创制史） |
| 用户指定「原住民」「印第安造型」 | `us_indigenous` 或 `us_indigenous_modern`（按当代/传统） |

### 日本 · `jp_*`（古代 → 令和 2026）

**禁止**对中国菜用本表；**禁止**对日本菜用 `song`/`ming`/`contemporary`（中国）。新做 `docs/world/japan.md` **不用**笼统 `overseas`。

| 代号 | 年代 | 3D chibi 服饰要点 | 典型场景 |
|------|------|-------------------|----------|
| `jp_ancient` | 古代·弥生～古坟 | 简化和服、绳文陶炊、农耕祭礼便服 | 米曲、早期蒸煮、祭膳 |
| `jp_nara_heian` | 奈良–平安 | 贵族简服、直衣/襦袢可爱化、乌帽子简化 | 精进料理、和果子、宫廷膳 |
| `jp_kamakura` | 镰仓 | 武士简装、禅宗素斋围裙、钵盂 | 禅坊素食、茶碗蒸雏形 |
| `jp_muromachi` | 室町 | 町人雏形、侘寂简衣、茶人围裙 | 抹茶、怀石前身的简膳 |
| `jp_edo` | 江户 | 浴衣、町人简服、头巾、木屐 | 荞麦/乌冬、江户前寿司、天妇罗 |
| `jp_meiji` | 明治 | 洋装马甲混搭、学生帽、铁路便当贩 | 洋食传入、早期拉面/咖喱 |
| `jp_taisho` | 大正 | 浪漫街角、宽檐帽、咖啡洋食围裙 | 中华街饺子、洋菓子、居酒屋雏形 |
| `jp_showa_early` | 战前昭和 1920s–40s | 军需/都市简服、旧式食堂围裙 | 战时便当、萧条期食堂 |
| `jp_showa` | 战后昭和 1950s–70s | **拉面摊**白围裙、头巾、工装 | **ラーメン**、横丁、大众食堂 |
| `jp_80s` | 1980年代 | 泡沫时代摩登、垫肩休闲、商场美食 | 回转寿司普及、family restaurant |
| `jp_90s` | 1990年代 | 宽松街头、原宿风简化、便利店文化 | 便利店饭团、连锁快餐扩张 |
| `jp_heisei` | 平成 2000s–2010s | 休闲卫衣、外卖马甲、家庭餐厅制服 | 外卖拉面、居酒屋连锁 |
| `jp_contemporary` | 令和 2015–**2026** | 现代 T 恤、厨师马甲、food hall | 网红拉面、饺子专门店、外卖 2026 |

**古代至今全集（默认随机池）** — `docs/world/japan.md` 无场景锚定、表内无固定行时用（**13 档**，顺序固定）：

`jp_ancient` · `jp_nara_heian` · `jp_kamakura` · `jp_muromachi` · `jp_edo` · `jp_meiji` · `jp_taisho` · `jp_showa_early` · `jp_showa` · `jp_80s` · `jp_90s` · `jp_heisei` · `jp_contemporary`

**日本场景候选池（优先于全集；仍服从强锚定）**

| 场景 | 随机池 |
|------|--------|
| **ラーメン / つけ麺** | `jp_meiji` · `jp_taisho` · `jp_showa_early` · `jp_showa` · `jp_heisei` · `jp_contemporary` |
| **餃子 / 煎饺** | `jp_taisho` · `jp_showa_early` · `jp_showa` · `jp_80s` · `jp_heisei` · `jp_contemporary` |
| 寿司·江户前 | `jp_edo` · `jp_meiji` · `jp_showa` · `jp_contemporary` |
| 牛丼·快餐丼 | `jp_showa` · `jp_90s` · `jp_heisei` · `jp_contemporary` |
| 富士乡土（ほうとう） | `jp_edo` · `jp_muromachi` · `jp_meiji` |
| 抹茶·和果子 | `jp_muromachi` · `jp_edo` · `jp_nara_heian` |

### 日本 mini-zine 定调（2026 · 必守）

**仅 `asserts/mini-zine/jp/`**；与海报 `_poster` 规则分开。

| 层 | 规则 |
|----|------|
| **1 · 食物在当地** | 先定 **属地单元**（关东东京 / 山梨富士 / 关西大阪…），查 [japan.md](../world/japan.md) 菜品表「地域/备注」与 §地域速览；无写明时按菜名常识（全国通识 → 東京；乡土菜 → 山梨等） |
| **2 · 画面与人物气质** | 背景地标、角标、底栏、饮食场景、小道具 **跟当地**；人物神态/店招气质与当地一致（都市清新 / 富士乡土 / 关西屋台等）。系列常量：mini-zine 四栏/四步 + **高键日光**版式（勿抄 `jp/ramen_*` sepia 夜景） |
| **3 · 服饰随机朝代** | **一律** `index = sum(ord(c) for c in slug) % 13`，取上表 **13 档全集** `{DynastyDressEN}`；生成表写 **随机? = 是**。同 slug 四套同代 |

**mini-zine 不用**：日本场景候选池、日本强锚定（下列表 **仅海报**）。用户点名「江户」「令和」「跟海报一致」→ 按指定或对齐海报。

**角标 · 全日文**：`{属地}の味 mini zine 03|02`（例：東京の味、山梨の味、大阪の味）。**禁止**文昌/海南/西湖及中文栏目标签。

已入库 zine **不必**因本定调自动重绘；新菜与「重做」按本表执行。

---

**日本强锚定（仅 `Gourmet recipe2/jp/*_poster` · mini-zine 不适用）**

| 菜品 | 时代 |
|------|------|
| `ramen` ラーメン | **`jp_showa`**（战后拉面摊） |
| `tonkotsu_ramen` 豚骨拉面 | `jp_showa` · `jp_heisei`（池内 `sum(ord)%2`） |
| `gyoza` 餃子 | 海报常用 **`jp_showa`**；zine 服饰仍 `sum(ord)%13` |
| `sushi` 寿司 | 场景池 `sum(ord)%4` → `jp_edo` 等 |
| 用户指定「江户」「令和」等 | 用对应单列代号 |

**旧 4 档映射（已入库海报不必改文件名）**：原 `jp_meiji`（明治–大正）→ 新稿拆为 `jp_meiji` / `jp_taisho`；`jp_edo` · `jp_showa` · `jp_contemporary` **代号不变**。

随机（中国/美国/日本海报等）：`index = sum(ord(c) for c in slug) % len(pool)`（全集 `len=13`；场景池用池长）。**日本 mini-zine 服饰**固定 `len=13` 全集。

---

## 候选池（无强锚定时 · 可随机 · 仅中国）

按 **当地风格 + 食物场景** 抽一档；左列优先仍服从「强锚定」。

| 地域/场景 | 候选时代（随机池） | 说明 |
|-----------|-------------------|------|
| 江南水网、文人菜、糖醋鲜 | `song` · `ming` | 默认偏 `song`；无锚定可 50/50 |
| 唐风长安/胡风肉面 | `tang` · `han` | 面食烤肉 |
| 华北面馆、烧饼、板面 | `ming` · `qing` · `contemporary` | 庄里夜宵可抽到 2026 围裙 |
| 东北/冀鲁卤味硬菜 | `qing` · `prc_80s` · `ming` | |
| 粤闽骑楼、早茶、清补凉 | `republic` · `qing` · `contemporary` | 海口老爸茶偏 `republic` |
| 海南热带街头、炸炸、炒冰 | `republic` · `contemporary` · `qing` | 夜宵随机趣味强 |
| 海鲜渔港、蟹粥 | `qing` · `republic` · `contemporary` | |
| 火锅、排档、糟粕醋 | `qing` · `contemporary` · `prc_2000s` | |
| 椰子鸡、热带度假 | `song` · `contemporary` · `republic` | 度假风可当代 |
| 日本街景料理 | `overseas`（江户/令和便装） | |
| 完全 Generic（蛋炒饭） | `song` · `ming` · `contemporary` | 必须随机或问用户 |

---

## 强锚定（不随机）

| 线索 | 时代 |
|------|------|
| 东坡肉、东坡、苏轼 | `song` |
| 西湖醋鱼、杭帮名菜 | `song` |
| 文昌鸡（历史名鸡，宴饮） | `song` 或 `republic`（无考据则进海南池） |
| 宫保鸡丁（清宫传说） | `qing` |
| 毛氏红烧肉、毛泽东家宴名菜 | `prc_50s` |
| 李鸿章、李鸿章杂烩 | `qing` |
| 左宗棠（左宗棠鸡传说） | `qing` |
| 艺城宫面（慈禧贡品） | `qing` |
| 满汉全席、清宫御宴 | `qing` |
| 金凤扒鸡（近代老字号） | `republic` · `prc_50s` |
| 安徽板面（1980s 后流行石家庄） | 可锚 `prc_80s` 或 `contemporary`；**无考据则用华北池随机** |
| 用户指定「当代」「2026」 | `contemporary` |

---

## 随机规则

1. **何时随机**：候选池 ≥ 2 且步骤 1–2 无单一锚定。  
2. **如何随机（可复现）**：`index = sum(ord(c) for c in slug) % len(pool)`，取 `pool[index]`。同一 slug 多次生成服饰一致。（中国、美国、日本池均用此式；**勿**用 Python `hash(slug)`。）  
3. **用户说「随机时代」**：在该菜地域池内再随机，并在生成表注明 `随机抽取`。  
4. **禁止**：与菜品明显违和（如先秦服饰 + 外卖电动车）；当代可出现围裙/马甲，**避免**写实手机大屏抢戏。  
5. **输出**：生成前回复用户一小表：`时代代号 | 服饰摘要 | 是否随机`。

---

## 3D chibi 技术要求

| 项 | 要求 |
|----|------|
| 体型 | 2.5–3 头身，手办感 |
| 性别 | **优先女性**：默认 **全员女性** chibi（见 §角色性别）；禁止默认全男 |
| 服饰 | **时代可读**（领口、冠饰、面料） |
| 人数 | 故事 2–4 · 做法 1–3 |
| 气泡 | 中文短句 |
| 无人物版 | 无人物、无气泡 |

---

## 与背景、角标

1. **先定时代** → **再定地标背景**（[regional-dimensions.md](../../.cursor/skills/gourmet-recipe-mini-zine/regional-dimensions.md)）  
2. 角标仍用 `{地域}风味`；时代不写在角标里，写在服饰与生成表  
3. 当代背景可用：霓虹夜市、商场美食街、外卖停靠点（无品牌 logo）

---

## 生成前必填

```markdown
| 菜名 | slug | 时代代号 | 性别（默认全员女性） | 服饰摘要 | 随机? | 背景 | 角标 |
```

---

## 文件命名

`{geo}_{slug}_story_eating_mini_zine[_no_char].png`  
试验：`…_dynasty_sample.png`

---

## Cursor 强制规则（新旧对话）

| 文件 | 作用 |
|------|------|
| `.cursor/rules/meishi-mini-zine-era.mdc` | **`alwaysApply: true`** — mini-zine 时代服饰 |
| `.cursor/rules/meishi-food-poster-era.mdc` | **`alwaysApply: true`** — 海报人物时代（与本文同表） |
| `.cursor/rules/meishi-assets.mdc` | 入库子目录、三画风、重复跳过 |
| `.cursor/rules/meishi-mini-zine.mdc` | 编辑 `asserts/mini-zine/**` 时提醒 |
| [AGENTS.md](../../AGENTS.md) | 人类与 Agent 一页速览；**关键词表** |

### 用户怎么说（写入规范 · 2026）

- **`按 mini-zine-dynasty-chibi 做{菜名}`** — 推荐说法；等价于 `按 mini-zine` + 强制本文件时代流程  
- `按 mini-zine 做{菜名}` — 默认亦加载本规则（`alwaysApply`）  
- 仅菜名、无地名 → Agent 读 `dish-to-region.md` 补全后再定时代  

用户**不必**在旧对话里重复说「按朝代」「读宋服」「按规范存」；线程内旧约定与本文冲突时，**以本文件 + 上述 mdc 为准**。

---

## 延伸

- Agent 速查表：[dynasty-chibi.md](../../.cursor/skills/gourmet-recipe-mini-zine/dynasty-chibi.md)  
- 提示词：[prompt-templates.md](../../.cursor/skills/gourmet-recipe-mini-zine/prompt-templates.md)
