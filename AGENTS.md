# meishi · Agent 入库须知

> **用户不必每次说「按规范存」「入库」「复制到 asserts」。** 生成美食/街景/zine 图时自动读本文件并完成入库。  
> **新旧 Cursor 对话**均加载（`alwaysApply: true`，**无对话历史也能用**；用户**不必**重复「按规范」「人料可变」「木牌」）：
> - [meishi-assets.mdc](.cursor/rules/meishi-assets.mdc) — 入库路径、重复检测、三画风  
> - [meishi-mini-zine-era.mdc](.cursor/rules/meishi-mini-zine-era.mdc) — **时代 3D Q 版**（zine **标准 2 + 叙事 4**，禁止 `_no_char`）  
> - [meishi-food-poster.mdc](.cursor/rules/meishi-food-poster.mdc) — **海报全流程**（**人料按菜定**、横木牌、居中主菜、防穿模）  
> - [meishi-food-poster-era.mdc](.cursor/rules/meishi-food-poster-era.mdc) — **海报时代服饰** + §人料皆可变（**每 slug 仅** `_poster.png`）  
> - [meishi-street-view-spec.mdc](.cursor/rules/meishi-street-view-spec.mdc) — 街景矩阵 + 当地美食
> - [asset-no-character-removed.md](docs/style/asset-no-character-removed.md) — **禁止** `_no_char`（海报 1 张 · zine 2 张）
>
> **海报布局（2026-05-21）**：人料按菜定；**只生成有人物** `{slug}_poster.png`；**禁止** `_poster_no_char`。

完整规范：[docs/ASSETS.md](docs/ASSETS.md)

## Web 应用（编辑 `web/` 时另读）

> Astro 4 实现的 web 前端骨架（2026-05-18 上线 v0.1）。 
> Cursor 规则 [.cursor/rules/scf-web.mdc](.cursor/rules/scf-web.mdc) 在动 `web/**` 时**自动加载**；首次编辑前请连同下面三份一起读：

| 文档 | 管什么 |
|------|--------|
| [web/docs/ARCHITECTURE.md](web/docs/ARCHITECTURE.md) | 技术栈 / 渲染 / 路由 / 数据 / 资源 / i18n / 主题 / 部署 / 不变量 |
| [web/docs/FRONTEND-STYLE.md](web/docs/FRONTEND-STYLE.md) | token / 组件 / CSS / 响应式 / a11y / 动画 / 性能预算 |
| [web/docs/ROADMAP.md](web/docs/ROADMAP.md) | v0.1 → v1.0 里程碑（**别越界做下一版的事**） |

**核心红线**（详见 scf-web.mdc）：

1. **不引** UI 框架（React/Vue/...）、不引 Tailwind / CSS-in-JS / SCSS、不写 `!important`
2. **三语 / 三主题 / 资源单源** 三大等价不变量
3. **零 JS 默认**；island 必须先在 ROADMAP 登记预算
4. `asserts/` 是输入，**只读**；web/ 不复制 PNG 副本，靠 NTFS junction `web/public/asserts → ../../asserts`
5. UI 字串必遵 [scf-brand.mdc](.cursor/rules/scf-brand.mdc)：**Street Corner Foodie / 街角食客 / 街角フーディー**

## 规范索引（对话无历史时从这里读）

| 类型 | 规则（自动加载） | 详细规格 |
|------|------------------|----------|
| **品牌 · 名称 / tagline / logo** | [scf-brand.mdc](.cursor/rules/scf-brand.mdc)（`alwaysApply`） | [BRAND.md](BRAND.md) |
| **Web · Astro 工程** | [scf-web.mdc](.cursor/rules/scf-web.mdc)（`globs: web/**`） | [web/docs/ARCHITECTURE.md](web/docs/ARCHITECTURE.md) + [FRONTEND-STYLE.md](web/docs/FRONTEND-STYLE.md) + [ROADMAP.md](web/docs/ROADMAP.md) |
| 入库路径 / geo / **重复跳过** | [meishi-assets.mdc](.cursor/rules/meishi-assets.mdc) | 本文 + [ASSETS.md](docs/ASSETS.md) |
| **街景**（美食·矩阵·原型） | [meishi-street-view-spec.mdc](.cursor/rules/meishi-street-view-spec.mdc) | [street-view-diorama.md](docs/style/street-view-diorama.md) |
| mini-zine + **时代 Q 版** | [meishi-mini-zine-era.mdc](.cursor/rules/meishi-mini-zine-era.mdc) | [mini-zine-dynasty-chibi.md](docs/style/mini-zine-dynasty-chibi.md) · **§六页版式金标准**（`wenchang_jifan`×`laobacha`）· **`us/` 英文** → [mini-zine-i18n.md](docs/style/mini-zine-i18n.md) |
| 海报 · **版式总览** | [meishi-food-poster.mdc](.cursor/rules/meishi-food-poster.mdc) | [food-poster-ingredients.md §总览](docs/style/food-poster-ingredients.md#新旧对话必守--海报版式总览2026-05-21) |
| 海报 + **时代** + **人料按菜定** | [meishi-food-poster-era.mdc](.cursor/rules/meishi-food-poster-era.mdc) | [food-poster-dynasty-chibi.md](docs/style/food-poster-dynasty-chibi.md) · [§按菜定布局](docs/style/food-poster-ingredients.md#按菜定布局--人料皆可变2026-05--新旧对话必守) |
| **无人物版废除** | [asset-no-character-removed.md](docs/style/asset-no-character-removed.md) | 海报 **1** 张 · zine **2** 张 · **禁止** `_no_char` |

### 时代锁定（新旧对话 · 2026-05-21）

**不跨画风。** 同 slug 内：

| 画风 | 一套 = | 锁定 |
|------|--------|------|
| mini-zine | **标准 2** + **叙事 4**（共 6 张） | 同时代 · **禁止** `_no_char` |
| 海报 | **1 张** `{slug}_poster.png` | 时代 + 布景 + 人料（全在有人物版） |

**海报 ↔ zine 不强制同时代**（例：披萨海报 `us_gilded`、zine `us_contemporary` 可并存）。用户说「跟 zine / 跟海报 一致」时才对齐。  
→ 全文 [mini-zine-dynasty-chibi.md §锁定范围](docs/style/mini-zine-dynasty-chibi.md#锁定范围--一对定义2026--新旧对话必守)

### 用户下单关键词（新旧对话等价）

| 关键词 | 走哪套 |
|--------|--------|
| `按 mini-zine` / `mini-zine` / `做法小志` / `故事与吃法` | zine + **meishi-mini-zine-era** + 入库 |
| **`按 mini-zine-dynasty-chibi`** | **同上**（显式强调时代服饰，非默认宋服） |
| `按 meishi-food-poster` / `美食海报` | Gourmet recipe2 + **人料按菜定** + 横木牌 + 气泡 |
| **`按 boluo 清新风`** / `boluo 清晰风` / `清新风格` | **画风**主锚 `boluo_chaofan_poster.png`（明亮·棕刷顶题·横木牌）；**人料场景按菜表**，禁止 4 人左二右二模板 → [§boluo 只锁/不锁](docs/style/food-poster-diorama.md#boluo-只锁什么--不锁什么2026-05-19--新旧对话必守) |
| `按 meishi-street-view` / `街景` | Street View + 矩阵 + 当地美食 |

## 目录结构（画风 + 地区子目录）

```
asserts/
├── Gourmet recipe2/cn/{省}/     # 海报
├── mini-zine/cn/{省}/           # zine（样张 → mini-zine/_templates/）
└── Street View/{cc}/{省}/{市}/  # 街景
```

**禁止**：成品 PNG 堆在画风文件夹根目录；禁止跨文件夹混风格。

## 入库路径公式

| 类型 | 保存到 |
|------|--------|
| 海报 | `asserts/Gourmet recipe2/{cc}/{admin}/{slug}_poster.png`（**禁止** `_no_char`） |
| zine | `asserts/mini-zine/{cc}/{admin}/{slug}_story_eating_mini_zine.png` · `{slug}_recipe_mini_zine.png`（**禁止** `_no_char`） |
| 街景 | `asserts/Street View/{cc}/{admin}/{local}/{geo}_{scene}_{day\|night}_{wide\|standard}.png` |

## geo 速查

| 文档 | 海报/zine 目录 | 街景目录 |
|------|----------------|----------|
| [hainan.md](docs/china/hainan.md) | `…/cn/hainan/` | `…/cn/hainan/haikou/` |
| [shijiazhuang.md](docs/china/shijiazhuang.md) | `…/cn/hebei/` | `…/cn/hebei/shijiazhuang/` |
| [shaanxi.md](docs/china/shaanxi.md) | `…/cn/shaanxi/` | `…/cn/shaanxi/xian/` |
| [zhejiang.md](docs/china/zhejiang.md) | `…/cn/zhejiang/` | `…/cn/zhejiang/hangzhou/` |
| [beijing.md](docs/china/beijing.md) | `…/cn/beijing/` | `…/cn/beijing/` |
| [japan.md](docs/world/japan.md) | `…/jp/`（美食 md 已定，海报待扩） | `…/jp/tokyo/` · 富士 `…/jp/fuji/` |
| [usa.md](docs/world/usa.md) | `…/us/` | 纽约 `…/nyc/` · LA `…/la/` · 德州 BBQ `…/tx/`（各 9 张） |
| [uk.md](docs/world/uk.md) | `…/united_kingdom/` | `…/united_kingdom/london/` |
| [france.md](docs/world/france.md) | `…/france/` | `…/france/paris/` |
| [germany.md](docs/world/germany.md) | `…/germany/` | `…/germany/cologne/` |
| [south-africa.md](docs/world/south-africa.md) | `…/south_africa/` | `…/south_africa/agulhas/` · `…/good_hope/` |
| [newzealand.md](docs/world/newzealand.md) | `…/new_zealand/` | `…/new_zealand/paradise_harbor/` |

## 入库三步

1. **Shell 复制** Cursor `assets/` → 上表对应**子目录**（不要只留在 `assets/`）  
2. 文件名带 geo；旧文件已在子目录内则勿重复移动  
3. **更新**对应 `docs/*.md` 资源表（路径写**相对子目录**或完整相对路径）

## 重复检测（不必重做）

生成前检查目标目录是否已有**完整 2 张 zine**（`story_eating` + `recipe`，**均有人物**）：

- 2 张齐全 → **跳过生成**，仅告知已有路径  
- 仅缺 1 张 → 只补缺失的现行文件（**勿**生成 `_no_char`）  
- 用户明确要求「重做 / 覆盖」→ 重做 **2 张有人物** 版

## 技能

- 街景 → `meishi-street-view` + `docs/style/street-view-diorama.md` + **场景原型 md**（见下节）
- 海报 → `meishi-food-poster` + `food-poster-diorama.md` + **`food-poster-dynasty-chibi.md`**（人物时代，**与 zine 共用代号表、各自定代**）+ `food-poster-speech-bubbles.md`
- zine → `gourmet-recipe-mini-zine` + **时代服饰**（下节）

---

## 海报人物（新旧对话必遵 · 2026）

**规则文件**：`.cursor/rules/meishi-food-poster.mdc` + `.cursor/rules/meishi-food-poster-era.mdc`（均 `alwaysApply`）

| 项 | 规范 |
|----|------|
| **版式总览** | [food-poster-ingredients.md §总览](docs/style/food-poster-ingredients.md#新旧对话必守--海报版式总览2026-05-21) — 仅 `_poster`；金标准同省已定稿 `_poster.png` |
| **时代服饰** | [food-poster-dynasty-chibi.md](docs/style/food-poster-dynasty-chibi.md) — 与 zine **共用代号表**，**各自定代** |
| **锁定** | 同 slug：**海报 1 张**；**zine 2 张**同时代（均含 chibi）；**海报↔zine 不强制同代**（用户点名才对齐） |
| **与街景无关** | 海报/zine **不**读街景分区、不用池袋·新宿·`us_nyc_*` 场景名竖牌；见 [food-poster-diorama.md](docs/style/food-poster-diorama.md) |
| **文档** | 日本菜 → **只**更新 [japan.md](docs/world/japan.md)；**不**改 [hainan.md](docs/china/hainan.md) |
| **日本 mini-zine** | **当地**定画面/角标 → 服饰 **`sum(ord(slug))%13`** 随机 `jp_*`（见 [mini-zine-dynasty-chibi.md](docs/style/mini-zine-dynasty-chibi.md) §日本 mini-zine 定调） |
| **性别** | **优先女性**，默认 **全员女性** chibi；prompt 写 `female` / `all female`（见 [§角色性别](docs/style/mini-zine-dynasty-chibi.md#角色性别--优先女性2026--新旧对话必守)） |
| **人数** | 3～5，**四角**偏小，防穿模、不挡主菜 |
| **人料按菜定** | 厨师 **3～5**、底行料 **4～6** 均查本菜表（可不等）；同 slug 两张锁同人同料 · 横木牌 · 禁绿矩形、禁全库五人+六同款碗 → [§按菜定布局](docs/style/food-poster-ingredients.md#按菜定布局--人料皆可变2026-05--新旧对话必守) |
| **气泡** | [food-poster-speech-bubbles.md](docs/style/food-poster-speech-bubbles.md) — 对白体默认 / 标语体仍可用 |
| **历史稿** | 已定稿 `{slug}_poster.png` **保留**（如海南白帽绿围裙批） |
| **新作** | 此后新菜 / 补图 / 试绘 **一律**朝代服；可与历史 **并存** |
| **试绘命名** | `{slug}_poster_{era}_redraw.png`（例 `wenchang_jifan_poster_song_redraw.png`） |
| **覆盖** | 仅当用户明确「替换定稿」「覆盖」 |

出图前表：`| 菜名 | 时代 | 性别 | 厨师人数 | 服饰 | 随机? |` + `| 料名 | 容器 | 件数 |`（人、料**各按本菜表**，可不等）。用户说 `按海报朝代` 即 era 规则。

---

## 街景新规范（新旧对话必遵 · 2026）

**规则文件**：`.cursor/rules/meishi-street-view-spec.mdc`（`alwaysApply`）

| 项 | 要求 |
|----|------|
| **矩阵** | 每场景默认 `day_wide` + `night_wide` + `day_standard` |
| **Web 默认图** | 街景探索器 / 街景 Tab **优先夜景** `night_wide`（`streets.ts` · `STREET_VIEW_DEFAULT_VIEW`）；规则 §2b → [meishi-street-view-spec.mdc](.cursor/rules/meishi-street-view-spec.mdc) |
| **当地美食** | 必须有摊/店/碗碟/招牌；来自地区「风味图鉴」；**非**海报巨型主菜、**非**空街 |
| **入库** | `asserts/Street View/{cc}/{admin}/{local}/`；禁止根目录 |
| **清单** | 更新对应 md 的 `street_view_approved` |

### 场景原型（生成前必读）

| 地区 | 文档 |
|------|------|
| 海口·府城 | [docs/china/hainan-fucheng-prototype.md](docs/china/hainan-fucheng-prototype.md) |
| 石家庄 | [docs/china/shijiazhuang-street-prototypes.md](docs/china/shijiazhuang-street-prototypes.md) |
| 西安·长安 | [docs/china/shaanxi-changan-street-prototype.md](docs/china/shaanxi-changan-street-prototype.md) |
| 杭州 | [docs/china/zhejiang-hangzhou-street-prototypes.md](docs/china/zhejiang-hangzhou-street-prototypes.md) |
| 东京 | [docs/world/japan-tokyo-street-prototypes.md](docs/world/japan-tokyo-street-prototypes.md) + 电子学校/池袋子页 |
| 富士山·河口湖 | [docs/world/japan-fuji-prototype.md](docs/world/japan-fuji-prototype.md) |
| 纽约 | [docs/world/usa-nyc-street-prototypes.md](docs/world/usa-nyc-street-prototypes.md) |
| 洛杉矶 | [docs/world/usa-la-street-prototypes.md](docs/world/usa-la-street-prototypes.md) |
| 德州 BBQ | [docs/world/usa-tx-bbq-street-prototypes.md](docs/world/usa-tx-bbq-street-prototypes.md) |

### 已定稿街景清单

→ [hainan.md §海口街景](docs/china/hainan.md) · [shijiazhuang.md §街景](docs/china/shijiazhuang.md) · [japan.md §东京全城 9 区](docs/world/japan.md)（27 张）

**易错**：海口 **府城** 勿写 **福城**；东京电子专门学校须**多栋校舎**街区。

---

## mini-zine 时代服饰（所有对话必遵 · 无需口述）

**Cursor 规则**：`.cursor/rules/meishi-mini-zine-era.mdc`（`alwaysApply: true`）  
**新对话、旧对话下一条消息**均自动加载。

| 步骤 | 动作 |
|------|------|
| 1 | 读 [docs/style/mini-zine-dynasty-chibi.md](docs/style/mini-zine-dynasty-chibi.md)（含 **§六页版式金标准**） |
| 2 | 读 [.cursor/skills/gourmet-recipe-mini-zine/dynasty-chibi.md](.cursor/skills/gourmet-recipe-mini-zine/dynasty-chibi.md) |
| 3 | 定时代：锚定 → 表内固定 → 否则候选池随机 |
| 4 | **性别**：有人物版 **优先女性**，默认 **全员女性** chibi（见 [mini-zine-dynasty-chibi.md §角色性别](docs/style/mini-zine-dynasty-chibi.md#角色性别--优先女性2026--新旧对话必守)） |
| 5 | 出图前输出：`| 时代代号 | 性别 | 服饰摘要 | 随机? |` |
| 6 | 人物 **3D chibi**；`487c2f*.jpg` 只参考版式，服饰按所选时代 |
| 7 | **标准 2 + 叙事 4** 同 slug 服饰一致；**禁止** `_no_char`；**故事力求真实**；入库 `mini-zine/{cc}/{admin}/` |

时代代号含：`song` `ming` `qing` `republic` `prc_50s` `prc_80s` `prc_2000s` **`contemporary`（2026）** 等。

旧线程若曾约定「全省宋服」→ **以本仓库现行 md 与规则为准**。

---

迁移脚本（已执行可略）：`scripts/migrate-assets-to-geo-dirs.ps1`
