# mini-zine · 多语言（i18n）规范

**风格 ID**：`mini-zine-i18n`  
**关联**：[mini-zine-dynasty-chibi.md](mini-zine-dynasty-chibi.md) · [BRAND.md](../../BRAND.md) · [usa.md](../world/usa.md)

---

## 一句话

`asserts/mini-zine/{cc}/` 内**画面文案语言**与目录约定一致：**中国 `cn/` → 简体中文**；**日本 `jp/` → 日文**（见该文件 §日本）；**美国 `us/` → 英文（EN）为当前默认**。同一 slug 未来将补 **中文（ZH）· 日文（JA）** 两套，与 Web 三语字段对齐。

---

## 目录与语言（2026-05 起）

| 画风目录 | 默认画面语言 | 服饰时代 | 角标示例（EN） |
|----------|--------------|----------|----------------|
| `mini-zine/cn/{省}/` | **简体中文** | `pre_qin`…`contemporary` | `海南风味 mini zine 03` |
| `mini-zine/jp/` | **日文** | `jp_*` 全集 `sum(ord)%13` | `東京の味 mini zine 03` |
| `mini-zine/us/` | **英文（EN）** ← 当前阶段 | `us_*` | `NYC Flavor mini zine 03` |

**禁止**在 `us/` 成品上保留中文栏目标题（风味、怎么吃、做法小志、四步做出、食材、纽约味道 等）；**禁止**在 `jp/` 用中文栏目标题（见 [mini-zine-dynasty-chibi.md](mini-zine-dynasty-chibi.md) §日本）。

---

## 美国 `us/` · 英文版（Phase 1 · 进行中）

### 栏目标题（故事与吃法 · 必用英文）

| 中文（cn） | **英文（us）** |
|------------|----------------|
| 风味 | **Flavor** |
| 怎么吃 | **How to Eat** |
| 健康小贴士 | **Health Tips** |
| 环境小贴士 | **Eco Tips** |
| 故事与吃法 | **Stories & How to Eat** |
| 做法小志 | **Recipe Guide** |
| 四步做出{菜} | **Four Steps to {Dish EN}** |
| 食材 | **Ingredients** |

### 角标与底栏

| 属地 | 角标 badge | 底栏 footer 左段 |
|------|------------|------------------|
| 纽约街头 | **NYC Flavor** mini zine 03 / 02 | `NYC Flavor \| …` |
| 全美通菜 | **American Flavor** mini zine 03 / 02 | `American Flavor \| …` |
| 德州 BBQ | **Texas Flavor** | `Texas Flavor \| …` |
| 洛杉矶 / Baja | **LA Flavor** | `LA Flavor \| …` |
| 新奥尔良 | **NOLA Flavor** | `NOLA Flavor \| …` |

竖牌与海报可仍用 **NYC Flavor** / **Texas Flavor**（英文），与 [usa.md](../world/usa.md) `web_posters` 的 `en` 字段一致。

### 人物与时代

- **全员女性** 3D chibi；`{DynastyDressEN}` 用 `us_*` 表（[dynasty-chibi.md](../../.cursor/skills/gourmet-recipe-mini-zine/dynasty-chibi.md) §美国）。
- 海报与 zine **可不同代**；zine 时代以 `dynasty-chibi.md` 的 zine 列为准。

### Phase 1 重做清单（`asserts/mini-zine/us/`）

| slug | 菜名 EN | zine 时代 | 四套 EN |
|------|---------|-----------|---------|
| `hot_dog` | NY Hot Dog | `us_contemporary` | story / recipe × `_no_char` |
| `pretzel` | Soft Pretzel | `us_roaring_20s` | 同上 |
| `ny_pizza` | NY Pizza Slice | `us_contemporary` | 同上 |

海报在 `Gourmet recipe2/us/` 的其它菜（`cheeseburger`、`texas_brisket` 等）→ **Phase 2** 起按本规范补 EN zine。

---

## 三语扩展（Phase 2–3 · 规划）

同一 slug、同一版式、**同一 `us_*` 时代与布景**，仅替换面板与气泡文案。

### 命名（推荐 · 同目录后缀）

| 语言 | 文件名后缀 | 示例 |
|------|------------|------|
| 英文（默认） | （无后缀） | `hot_dog_story_eating_mini_zine.png` |
| 中文 | `_zh` | `hot_dog_story_eating_mini_zine_zh.png` |
| 日文 | `_ja` | `hot_dog_story_eating_mini_zine_ja.png` |

做法小志同理：`…_recipe_mini_zine_zh.png`、`_ja.png`。

### 日文角标（us 菜在 JA 版时）

用 `web_posters` 中 `ja` 菜名 + 属地，例：`ニューヨークの味 mini zine 03`（勿写中文「纽约味道」）。

### 中文（us 菜 ZH 版时）

角标可用 **纽约风味** mini zine 03（与早期 cn 稿一致）；路径仍在 `mini-zine/us/` 带 `_zh` 后缀，**不**与 `mini-zine/cn/` 混淆。

### Web / frontmatter

`docs/world/usa.md` 的 `mini_zine:` 列表按语言分字段（待 Phase 2）：

```yaml
mini_zine_en:
  - hot_dog_story_eating_mini_zine.png
mini_zine_zh: []   # 待补
mini_zine_ja: []   # 待补
```

Phase 1 仅用 `mini_zine:` 记录 **EN** 四套路径。

---

## Agent 出图前表（`us/` 必含）

| 菜名 | slug | 属地 | 语言 | 时代代号 | 性别 | 角标 EN | 随机? |

---

## 参考

- 版式 UI：可参考 `cn/hainan/yezi_ji_*_mini_zine*` **色谱与网格**；**文案与地标**跟美国属地，不抄海南/西湖文字。
- Prompt 模板：[prompt-templates.md](../../.cursor/skills/gourmet-recipe-mini-zine/prompt-templates.md) §US English
- 入库：[ASSETS.md](../ASSETS.md) · [AGENTS.md](../../AGENTS.md)
