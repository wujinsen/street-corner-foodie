---
name: gourmet-recipe-mini-zine
description: >-
  Generates gourmet mini-zine (6 pages p01–p06 per slug, all with 3D chibi).
  Layout gold standard: wenchang_jifan × laobacha (see mini-zine-dynasty-chibi.md §六页版式金标准).
  FORBIDDEN: *_mini_zine_no_char. ALWAYS apply meishi-mini-zine-era.mdc + asset-no-character-removed.md.
  Era dress pre_qin through contemporary; all chats. Never *_poster.png style.
disable-model-invocation: true
---

# Gourmet Recipe Mini-Zine

**用户触发（新旧对话）**：`按 mini-zine` · **`按 mini-zine-dynasty-chibi`** — 均加载本 skill + [meishi-mini-zine-era.mdc](../../rules/meishi-mini-zine-era.mdc)（`alwaysApply`）。

**「一对」**：同 slug **p01–p06 六页** 同时代、同服饰；**禁止** `*_mini_zine_no_char*`。

**版式金标准**：生成前必读 [mini-zine-dynasty-chibi.md §六页版式金标准](../../../docs/style/mini-zine-dynasty-chibi.md) — **p02 故事 / p03 文化 / p05 食材** → `wenchang_jifan` 壳；**p01 / p04 / p06** → `laobacha` 壳；**p02–p05 FULL-BLEED**。

**故事小志力求真实**：气泡、四栏、文化页文案须对照 `docs/*.md` + 本表 **文案源流**；服饰 `song` 等**不得**推导「宋代起菜」。见 [mini-zine-dynasty-chibi.md §故事小志](../../../docs/style/mini-zine-dynasty-chibi.md)。

## When to use

| Location | Style | Examples |
|----------|-------|----------|
| `asserts/mini-zine/` | **This skill** — parchment panels, calligraphy titles, mini zine badges | `wenchang_jifan_*_mini_zine*.png` |
| `asserts/` (parent) | Commercial poster — 3D red title, green slogan, bottom ingredient bowls, NO mini zine layout | `*_poster.png` |

Reference templates (西湖醋鱼): `asserts/mini-zine/487c2f*.jpg` (故事与吃法), `5bfa29c*.jpg` (做法小志).

Gold-standard anchors（只读对照）:

| 页 | 文昌鸡饭 | 老爸茶 |
|----|----------|--------|
| p01 | `wenchang_jifan_mini_zine_p01_story_eating.png` | `laobacha_mini_zine_p01_story_eating.png` |
| p02 故事 | `wenchang_jifan_mini_zine_p02_narr_story.png` | `laobacha_mini_zine_p02_narr_story.png` |
| p03 文化 | `wenchang_jifan_mini_zine_p03_narr_culture.png` | `laobacha_mini_zine_p03_narr_culture.png` |
| p04 街景 | `wenchang_jifan_mini_zine_p04_narr_street.png` | `laobacha_mini_zine_p04_narr_street.png` |
| p05 食材 | `wenchang_jifan_mini_zine_p05_narr_ingredients.png` | `laobacha_mini_zine_p05_narr_ingredients.png` |
| p06 做法 | `wenchang_jifan_mini_zine_p06_recipe.png` | `laobacha_mini_zine_p06_recipe.png` |

路径前缀：`asserts/mini-zine/cn/hainan/`。Legacy `*_story_eating_mini_zine.png` 仍保留，**新菜优先 p01–p06 命名**。

## Deliverables per dish（2026-05 · 默认六页）

**Default full set = 6 files** (all with 3D chibi), unless user says「只要标准两张」:

| 页 | 推荐文件名 | 版式壳 | 内容 |
|----|------------|--------|------|
| p01 | `{slug}_mini_zine_p01_story_eating.png` | laobacha | 左四栏故事与吃法 · badge `mini zine 03` |
| p02 | `{slug}_mini_zine_p02_narr_story.png` | **wenchang_jifan** | 故事 · 3 气泡 + 底段说明文 |
| p03 | `{slug}_mini_zine_p03_narr_culture.png` | **wenchang_jifan** | 文化 · 三联卷轴 + chibi 讲解 |
| p04 | `{slug}_mini_zine_p04_narr_street.png` | laobacha | 街景 · 地标 + 店招 |
| p05 | `{slug}_mini_zine_p05_narr_ingredients.png` | **wenchang_jifan** | 食材 · 中心主材 + 环绕标注 |
| p06 | `{slug}_mini_zine_p06_recipe.png` | laobacha | 做法四步 · badge `mini zine 02` |

**Legacy 命名**（旧稿保留，新菜勿混用）：`{slug}_story_eating_mini_zine.png` · `{slug}_narrative_0*_*.png` · `{slug}_recipe_mini_zine.png`。

**Forbidden**: `*_no_char*`.

`geo` per [docs/ASSETS.md](../../../docs/ASSETS.md) §地区层级.

`slug` = pinyin dish id, e.g. `wenchang_jifan`, `yezi_ji`.

## Type A — 故事与吃法

**Layout:** Left column = 4 parchment panels (风味 / 怎么吃 / 健康小贴士 / 环境小贴士). Center-right = hero food photo. Top = calligraphy title + English subtitle + intro box. Top-right = scalloped badge `{地域}风味 mini zine 03`. Bottom = banner `{地域}风味 | {slogan}`.

**Background, title/footer, chibi:** Configure per locality — see [regional-dimensions.md](regional-dimensions.md). Do **not** default every dish to “Hainan daytime coconut + dark green + Song hanfu” unless the region is Hainan-generic.

**Character version:** **Foreground = 3D chibi only** (with speech bubbles). **Background** may include softened out-of-focus photorealistic passersby (like `laobacha` p01/p04) — small, desaturated, no bubbles. NO 2D flat stickers; NO photoreal humans as foreground protagonists. Era dress (**先秦 → 2026**); default **all female** chibi. See [dynasty-chibi.md](dynasty-chibi.md). Layout: §六页版式金标准 + `_templates/487c2f*.jpg`.

**No-character version:** **FORBIDDEN** for new work — see [asset-no-character-removed.md](../../../docs/style/asset-no-character-removed.md).

## Type B — 做法小志

**Layout:** Top = 做法小志 + banner `四步做出{菜名}` + badge `mini zine 02`. Center = finished dish hero. Left = 食材 scroll box. Bottom = 2×2 numbered steps (01–04) with photo icons + short Chinese lines. Footer banner `{味型} | {地域}经典`.

**3D chibi（必出）:** Chibi figures per step with speech bubbles; all female by default.

## Image generation workflow

**First read [AGENTS.md](../../../AGENTS.md)** 入库检查表（用户不必再提醒「按规范存」）。

**Duplicate skip (用户不必口述)** — before any `GenerateImage`:

1. Resolve `{slug}` and target dir `asserts/mini-zine/{cc}/{admin}/` (e.g. `cn/hainan/`).
2. Check **all six** `p01`…`p06` filenames exist on disk (or legacy pair if user only wants 2).
3. If **all six** exist → **do not regenerate**; reply which paths are already入库 and stop.
4. If only some exist → regenerate **missing** pages only, or full redo if user asked.

0. **Only dish name given?** Run [dish-to-region.md](dish-to-region.md): infer region from docs → name → knowledge; output filled dimension table; **confirm with user** unless they say to proceed directly.
1. Confirm **region unit** (e.g. 海口 / 三亚 / 海南 / 江南 / 泰国) and dish.
2. **Story facts first**: read region md + [dynasty-chibi.md](dynasty-chibi.md) 文案源流; draft p02/p03/p05 copy (factual, `cn/` Chinese only); fill 出图前表（§六页版式金标准）.
3. Pick **era code** (dress only) from dynasty-chibi: anchor → fixed row → else pool random; show `时代(服饰)|文案源流|依据|随机?`.
4. Fill [regional-dimensions.md](regional-dimensions.md) (background, title/footer, props, bans).
5. Read gold-standard anchors (`wenchang_jifan` / `laobacha` p01–p06) + `_templates/487c2f*.jpg` (layout shell).
6. Read [prompt-templates.md](prompt-templates.md) + §六页版式金标准 **Agent Prompt 尾缀**; embed verified copy; set `{DynastyDressEN}`.
7. `GenerateImage` ×6 → `{slug}_mini_zine_p01`…`p06`.
8. **Shell copy** → `asserts/mini-zine/{cc}/{admin}/`.
9. **Update** region md; note **era + 文案源流** in reply.
10. **Never** use `*_poster.png` as visual reference.

## Four configurable dimensions (summary)

| Dimension | Local adaptation | Series constant |
|-----------|------------------|-----------------|
| Background | Landmarks, light, scene for **that place + dish** | Painterly daytime info-graphic; zine layout |
| Title & footer | Local palette + copy (`{地域}风味 \| …`) | Calligraphy title + scroll footer structure |
| Chibi | **Era** dress ancient→2026 & props; random if pool | 3D chibi **required** on all 6 pages |
| Bans | No poster; no photoreal **foreground** protagonists; background passersby OK if softened; p02–p05 FULL-BLEED | Six-page structure per §六页版式金标准 |

Hainan defaults (文昌鸡饭、椰子鸡等) are **one profile**, not global defaults — see regional-dimensions.md for 海口 / 三亚 / 江南 / 海外示例.

## Additional resources

- Dish name only → infer region: [dish-to-region.md](dish-to-region.md)
- Dimension tables & examples: [regional-dimensions.md](regional-dimensions.md)
- Prompt blocks: [prompt-templates.md](prompt-templates.md)
