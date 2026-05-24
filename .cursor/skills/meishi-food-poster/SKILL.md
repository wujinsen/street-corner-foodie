---
name: meishi-food-poster
description: >-
  Gourmet recipe2 posters: per-dish chef count (3-5) AND ingredient layout (4-6) both vary by dish table;
  horizontal wooden plaques; alwaysApply via meishi-food-poster.mdc. Triggers: 美食海报, meishi-food-poster, 人料可变.
  Not mini-zine or Street View.
disable-model-invocation: true
---

# Meishi Food Poster (Gourmet recipe2)

## When to use

| Location | Style | This skill? |
|----------|-------|-------------|
| `asserts/Gourmet recipe2/` | Giant food + 3–5 era chibi + 3D title | **Yes** |
| `asserts/mini-zine/` | Parchment panels, 故事/做法 | No → `gourmet-recipe-mini-zine` |
| `asserts/Street View/` | Isometric city diorama | No → `docs/ASSETS.md` Street View |

## boluo 清新风 / 清晰风（user trigger）

When user says **`按 boluo 清新风`** / **`boluo 清晰风`** / **`boluo清晰风`** / **`清新风格`** / **`跟菠萝炒饭一样`**:

1. Read [food-poster-diorama.md §boluo 只锁/不锁](../../../docs/style/food-poster-diorama.md#boluo-只锁什么--不锁什么2026-05-19--新旧对话必守) — **boluo ≠ 4-person symmetric template**.
2. Read **this dish’s row** in [food-poster-ingredients.md](../../../docs/style/food-poster-ingredients.md) **before** GenerateImage (chef count 3–5, ingredients 4–6, scene/站位).
3. **Style reference (required):** `cn/hainan/boluo_chaofan_poster.png` — **ONLY** bright airy look, brown brush title, horizontal plaques, hero gap — **DO NOT** copy its 4-chibi corner layout.
4. Optional: `boluo_chaofan_poster_no_char.png` — outdoor brightness only; **NOT** vertical cream tags.
5. Prompt: `EXACTLY {N} chefs` from dish table; `{SCENE_LAYOUT}`; `NOT symmetric 2+2`; `EXACTLY {M} ingredients` with varied vessels; `FRESH CLEAR` / high-key.
6. **Pre-image table** must include `厨师人数` + `场景/站位` + ingredient count — not just era/dress.
7. Era dress unchanged; per-dish counts **override** any boluo reference composition.

## Before generating

1. Read [food-poster-ingredients.md §总览](../../../docs/style/food-poster-ingredients.md#新旧对话必守--海报版式总览2026-05-21)（**alwaysApply** via `meishi-food-poster.mdc` + `meishi-food-poster-era.mdc`), then [food-poster-diorama.md](../../../docs/style/food-poster-diorama.md), [food-poster-dynasty-chibi.md](../../../docs/style/food-poster-dynasty-chibi.md), [food-poster-speech-bubbles.md](../../../docs/style/food-poster-speech-bubbles.md).
2. Resolve era + 竖牌 from [food-poster-ingredients.md](../../../docs/style/food-poster-ingredients.md) + `dynasty-chibi.md` — **禁止**读街景原型/分区表。海报两张同时代；与 zine 不强制同代。
3. Read **gold-standard PNGs**: same-region `_poster.png` (e.g. `cn/sichuan/mapo_doufu_poster.png`). **Do not** use `*_poster_no_char` as reference.
4. Read [prompt-templates.md](prompt-templates.md) + [dynasty-chibi.md](dynasty-chibi.md); fill `{DynastyDressEN}`.
5. Read **本菜所属地区 md**（海报表 + frontmatter）— **禁止**跨省/跨国改错文件：

| 地区 | 只读/只更新 | 入库目录 `{admin}` |
|------|-------------|------------------|
| 海南 | `docs/china/hainan.md` | `hainan` |
| 河北/庄里 | `docs/china/hebei.md` / `shijiazhuang.md` | `hebei` |
| 江苏/广东/四川/北京等（全国共性菜） | `docs/china/china.md` + 省 md | **`jiangsu` / `guangdong` / `sichuan` / `beijing`** 等 — **禁止** `cn/` 根 |
| 日本 | **`docs/world/japan.md`**（**不**改 `hainan.md`） | `jp`（国家级） |
| 美国 | `docs/world/usa.md` | `us` |

## Deliverables

| User asks | Files |
|-----------|--------|
| 海报（默认/唯一） | `{slug}_poster.png` — **有人物** |
| ~~无人物~~ | **已废除** — 禁止 `_poster_no_char` → [asset-no-character-removed.md](../../../docs/style/asset-no-character-removed.md) |

`geo` from `docs/ASSETS.md` §地区层级 (e.g. `cn_hainan`, `cn_hebei`, `cn_zhejiang`, `jp`). Legacy short names like `wenchang_jifan_poster` remain valid.

`slug` = dish pinyin, e.g. `bannianmian`, `hainan_fen`, `yezi_ji`.

## Workflow

**Do all steps without asking** whether to follow meishi storage rules. **First read [AGENTS.md](../../../AGENTS.md)** 入库检查表。

1. Read `docs/ASSETS.md` §地区层级; resolve `{geo}` from province/city doc frontmatter.
1b. For no-char (or labeled foreground bowls): read [food-poster-ingredients.md](../../../docs/style/food-poster-ingredients.md) and **list key ingredient labels** for this dish.
2. **Pick scene**: hot dish → kitchen; cold dessert → night market (see style doc).
3. **Generate** with `GenerateImage`; use `reference_image_paths` when matching an existing `_poster.png`.
4. **Copy** to `asserts/Gourmet recipe2/{cc}/{admin}/` via Shell — resolve `{admin}` from 竖牌/主关联省（例 `mapo_doufu` → `cn/sichuan/mapo_doufu_poster.png`）。**Never** leave finished PNG in `cn/` root.
5. **Update** 上表对应 md **仅此一份**（例：拉面/餃子 → **仅** `japan.md`）：frontmatter `gourmet_posters` + §美食海报表。
6. **Do not** inpaint-remove ladders on bowl rim; regenerate no-char whole image instead.

## Character rules（按菜 · 人数 3–5 可变）

- **Gender**: default **all female** 3D chibi unless user asks otherwise.
- **Era dress**: paste `{DynastyDressEN}` from [dynasty-chibi.md](../gourmet-recipe-mini-zine/dynasty-chibi.md).
- **Count**: **3–5 per dish** from [food-poster-ingredients.md](../../../docs/style/food-poster-ingredients.md) — **may differ** from bottom ingredient count (e.g. 3 chefs + 4 items).
- **Placement**: four corners; hero CENTER-UPPER 45–55%; gap above bottom props; no clipping into dish.
- **Before generate**: era table + `| 厨师人数 |` + `| 料名 | 容器 | 件数 |` — see [§人料皆可变](../../../docs/style/food-poster-ingredients.md#按菜定布局--人料皆可变2026-05--新旧对话必守).
- Speech bubbles: count **≤ chef count** (often 3–5). Style **`dialogue`** (default, task-like first-person) or **`slogan`** (legacy selling phrases)—see [food-poster-speech-bubbles.md](../../../docs/style/food-poster-speech-bubbles.md); do not mix both on one poster.
- Actions must be **dynamic** (pour splash, scoop, slice)—not static posing.

## ~~No-character~~（已废除）

**禁止**生成 `_poster_no_char`。底行料、横木牌、防穿模均在 **有人物** `{slug}_poster.png` 内完成 → [asset-no-character-removed.md](../../../docs/style/asset-no-character-removed.md)。

## Regional defaults (Hainan)

- Vertical sign: `海南味道`
- Banner pattern: `海南经典 · {phrase2} · {phrase3}`
- Night market neon optional: `海南夜市`
- Tablecloth: red-white checkered (dessert) or match `wenchang_jifan_poster.png` (kitchen)

Adapt sign and banner for other provinces (`广东味道`, etc.).

## Quality checklist

- [ ] [AGENTS.md](../../../AGENTS.md) 入库检查表已完成（复制 + 更新 docs）
- [ ] Reference read from `Gourmet recipe2/` only
- [ ] Title dish name matches user request
- [ ] Saved under `asserts/Gourmet recipe2/`, not repo root
- [ ] Province md poster table updated
- [ ] No-char has no smudged bowl rim / no ladder
- [ ] Legacy posters not overwritten unless user asked; new work uses era dress

## Additional resources

- Full style spec: [docs/style/food-poster-diorama.md](../../../docs/style/food-poster-diorama.md)  
- Speech bubbles: [docs/style/food-poster-speech-bubbles.md](../../../docs/style/food-poster-speech-bubbles.md)  
- Era chibi: [docs/style/food-poster-dynasty-chibi.md](../../../docs/style/food-poster-dynasty-chibi.md) · [dynasty-chibi.md](dynasty-chibi.md)
- Filled prompts: [prompt-templates.md](prompt-templates.md)
- Asset taxonomy: [docs/ASSETS.md](../../../docs/ASSETS.md)
