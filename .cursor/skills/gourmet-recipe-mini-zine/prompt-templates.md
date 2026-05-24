# Mini-Zine Prompt Templates

> **2026-05-21**：仅生成 **有人物** 的 story + recipe **2 张**；**禁止**使用下文「no_char」节。见 [asset-no-character-removed.md](../../../docs/style/asset-no-character-removed.md)。

> **故事小志力求真实**：画面中文案须对照 `docs/*.md` 与 `dynasty-chibi.md` 文案源流；**禁止**编造朝代、张冠李戴；服饰 `{era}` **不得**写入食物断代；传说用「相传」。见 [mini-zine-dynasty-chibi.md §故事小志](../../../docs/style/mini-zine-dynasty-chibi.md)。

Before filling placeholders:

1. Pick **era code** (pre_qin → contemporary 2026) per [dynasty-chibi.md](dynasty-chibi.md) — food + local style; random from pool if ambiguous (`hash(slug)`).
2. Complete **four dimensions** in [regional-dimensions.md](regional-dimensions.md).

Replace `{...}` placeholders.

**`jp/` 日本菜 · 文案语言（必守）**：

> All panel titles, steps, badges, footers, and speech bubbles must be **Japanese only** (hiragana / katakana / kanji). **Forbidden**: Simplified Chinese labels such as 风味、怎么吃、健康小贴士、做法小志、四步做出、食材、东京味道（中文「味道」用法）. Use 味わい、食べ方、作り方ガイド、四つのステップで…、材料、**{属地}の味**（如 東京の味、山梨の味 — 跟 [japan.md](../../../docs/world/japan.md) 当地单元，勿全国菜硬套东京）。

**`jp/` 日本 mini-zine · 当地 + 随机服饰**：背景/角标/气质跟属地；`{DynastyDressEN}` = `JP_13[sum(ord(slug))%13]`；见 [mini-zine-dynasty-chibi.md](../../../docs/style/mini-zine-dynasty-chibi.md) §日本 mini-zine 定调。

**有人物版必加（性别 · 优先女性）**：

> All human characters must be cute **female** 3D chibi in era-appropriate dress (`{DynastyDressEN}`). No default male-only cast. At most one male only if user explicitly requested.

Always append:

> FACTUAL STORY COPY: All Chinese text in bubbles, panels, footers must match verified dish history from region docs (origin place, naming era if documented, cooking method, local ingredients). Do NOT invent dynasty origins to match costume era. Use 「相传」only for documented folklore. If uncertain, describe geography and flavor only—no fake dates.

> FORBIDDEN: copy asserts/*_poster.png layout (neon night market poster, TOP1 badge, 3D red commercial title, bottom ingredient row array).  
> FORBIDDEN: multi-panel manga/comic grid, 2D anime girl, lifestyle photo poster, sepia/night ramen-ya look — must match mini-zine layout (left parchment panels + center hero food + 3D figurine chibi). **NOT** `jp/ramen_*`.  
> **`jp/` 画风锁定（与海南差距大时必用）**：**画风锚** = `cn/hainan/yezi_ji_recipe_mini_zine.png`（做法）/ `yezi_ji_story_eating_mini_zine.png`（故事）— 锁 **同一套 UI**：奶白羊皮纸、**青绿书法大标题**、**深绿丝带**副题、**深绿底栏**、左侧悬挂 **材料/食材卷轴**、底部 **深绿 01–04 标签** 四格步骤、scalloped 角标、3D chibi 材质与海南一致。**禁止**红/蓝海报丝带、旅游广告构图。**禁止** `_no_char` 参考；**禁止** `wenchang_jifan_*` 文案。角标 **東京の味**；禁止 文昌/海南/西湖/椰子。  
> **`jp/` 背景必跟属地（勿抄参考图风景）**：参考图只锁 UI/色谱；**禁止**照搬海南棕榈、海滩、椰林、草屋。餃子→东京餃子暖帘·居酒屋灯笼·樱花·晴空塔远景（高键虚化）；冲绳→首里城/碧海；山梨→富士河口湖。见 [japan.md](../../../docs/world/japan.md) 属地单元表。  
> **`jp/` forbidden words (image text):** 文昌 · Wenchang · 海南 · Hainan · 西湖 · West Lake · 椰子 · 鸡饭 · 海南风味 · 西湖風味 · Chinese panel labels (风味 / 怎么吃 / 做法小志). Aprons/signs: **東京餃子** or **餃子** only.

**`us/` 美国菜 · 文案语言（必守）** — 全文 [mini-zine-i18n.md](../../../docs/style/mini-zine-i18n.md)：

> All panel titles, steps, badges, footers, and speech bubbles must be **English only**. **Forbidden**: Simplified Chinese labels (风味、怎么吃、健康小贴士、做法小志、四步做出、食材、纽约味道). Use **Flavor**, **How to Eat**, **Health Tips**, **Eco Tips**, **Recipe Guide**, **Four Steps to {Dish}**, **Ingredients**, badge **NYC Flavor** / **American Flavor** / **Texas Flavor** / **LA Flavor** / **NOLA Flavor** mini zine 03|02. `{DynastyDressEN}` = `us_*` from [dynasty-chibi.md](dynasty-chibi.md). Background = US locale (Times Square, subway cart, pizza slice shop, BBQ pit, etc.) — NOT Hainan palms or West Lake.

**`us/` UI**：可参考 `cn/hainan/yezi_ji_*_mini_zine*` 的羊皮纸+深绿标题网格；**仅锁版式色谱**，文案全英文。

---

## A — 故事与吃法 (with characters)

```
Chinese food culture mini-zine poster, "{DishCN}故事与吃法" / "Culture, serving & notes", {RegionTheme}.
Same layout as Jiangnan mini-zine: soft traditional landscape background ({BackgroundElements}).
Center-right: realistic platter — {HeroFoodDescription}.
Left column: four parchment panels — 风味 (star ratings), 怎么吃 (4 steps), 健康小贴士, 环境小贴士.
Multiple cute **female** 3D chibi in {DynastyDressEN}, all female cooks and diners, Chinese speech bubbles. Dynasty rules: docs/style/mini-zine-dynasty-chibi.md §角色性别
Top: calligraphy title, scalloped badge "{Region}风味 mini zine 03", intro box "{IntroOneLine}".
Props: {PropsList}. Bottom banner "{Region}风味 | {FooterSlogan}".
Palette: {Palette}. Vertical infographic poster.
```

## ~~A — 故事与吃法 (no_char)~~ — **已废除，勿用**

---

## B — 做法小志 (with characters)

```
Chinese recipe mini-zine "做法小志", {RegionTheme} background ({BackgroundElements}).
Badge "{Region}风味 mini zine 02", banner "四步做出{DishCN}".
Center: {HeroFoodDescription}. Left 食材: {IngredientList}.
Three cute **female** 3D chibi figures with Chinese speech bubbles, all female.
Bottom 2×2 steps:
01 {Step1Title} — {Step1Text}
02 {Step2Title} — {Step2Text}
03 {Step3Title} — {Step3Text}
04 {Step4Title} — {Step4Text}
Footer "{FooterLeft} | {FooterRight}". Vertical poster.
```

## ~~B — 做法小志 (no_char)~~ — **已废除，勿用**

---

## Placeholder reference

| Placeholder | Source |
|-------------|--------|
| `{RegionLabel}` | 海南 / 海口 / 三亚 / 江南 / … |
| `{BackgroundElements}` | regional-dimensions.md §背景 |
| `{TitleColor}` / `{FooterBar}` | regional-dimensions.md §标题与底栏 |
| `{DynastyDressEN}` | [dynasty-chibi.md](dynasty-chibi.md) 粘贴块 |
| `{ChibiProps}` | regional-dimensions.md §Q版 |
| `{FooterSlogan}` | dish + region specific |

---

## Wenchang Chicken Rice — filled example (Hainan province profile)

**Hero:** sliced poached chicken golden skin, chicken-oil rice, cucumber, three dips (姜葱油, 辣椒酱, 青金桔).

**Ingredients:** 文昌鸡, 海南香米, 姜, 葱, 蒜, 盐, 鸡油.

**Steps:**
1. 处理鸡身 — 整鸡洗净，腹腔塞姜葱去腥
2. 浸煮鸡肉 — 冷水下锅，小火浸煮至皮黄肉嫩
3. 煮鸡油饭 — 鸡油炒香米，鸡汤焖煮金黄饭
4. 斩件上桌 — 冰镇斩件，配姜葱油与蘸料

**Story panels:** 风味 / 怎么吃（先原味→姜葱油→辣椒→青金桔）/ 健康 / 环境（本地散养鸡）

**Background:** coconut palms, lighthouse, qilou, coastal sky.

**Palette:** golden yellows, palm greens, parchment cream, soft ocean blue.
