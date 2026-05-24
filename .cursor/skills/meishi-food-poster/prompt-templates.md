# Food poster · prompt templates

Copy blocks into `GenerateImage`. Read gold-standard images in `asserts/Gourmet recipe2/` first.

**Era dress** (required): resolve era per [food-poster-dynasty-chibi.md](../../../docs/style/food-poster-dynasty-chibi.md) + [gourmet-recipe-mini-zine/dynasty-chibi.md](../gourmet-recipe-mini-zine/dynasty-chibi.md); paste `{DynastyDressEN}`. **Same slug as mini-zine → same era.**

**Speech bubbles**: `BUBBLE_STYLE` = `dialogue` (default) or `slogan` → [food-poster-speech-bubbles.md](../../../docs/style/food-poster-speech-bubbles.md). `BUBBLE_COUNT` ≤ `CHEF_COUNT`.

**Gender (default)**: **all female** cute 3D chibi cooks/eaters unless user requests mixed/male. Prompt: `cute female 3D chibi` or `all female chibi figures`.

**3D chibi（必写，防画成真人/2D）**：`3D chibi figurine 2.5-3 head ratio Nendoroid Pop Mart style, glossy toy plastic render, big head small body, NOT realistic humans NOT live-action NOT 2D flat anime illustration`. 参考图优先同项目 `qingbuliang_poster.png` 或同地区已定稿 `_poster.png` 的 **小人比例**。

---

## A · Character version (kitchen / hot dish)

**Reference**: same-era `*_mini_zine.png` if any; then `{slug}_poster.png` for layout; NOT cross-era poster refs.

```text
Vibrant 3D-rendered food promotional poster, miniature diorama toy photography style. Characters MUST be 3D chibi figurine 2.5-3 head ratio Nendoroid Pop Mart toy style, glossy plastic, NOT realistic humans NOT 2D flat anime.
Warm rustic {REGION} kopitiam kitchen, wooden furniture, soft bokeh, pale tiles,
{TABLECLOTH} tablecloth, NOT night market.
Central focus: oversized photorealistic {FOOD_DESC}.
{CHEF_COUNT} cute **female** 3D chibi figurines (all female, big head small body) at table edges corners NOT blocking central food, {DynastyDressEN}, distinct cooking actions: {CHEF_ACTIONS}.
{BUBBLE_COUNT} rounded Chinese speech bubbles with tails to speaking chefs' mouths.
BUBBLE_STYLE dialogue: each line = chef speaking current task in casual first-person: {BUBBLE_1} {BUBBLE_2} {BUBBLE_3} ...
Top: large bold 3D red title "{DISH_CN}" cream outline.
Green banner "{TAGLINE}".
Vertical wooden sign "{REGION}味道".
Bottom foreground lowest 12-18%: {BOWL_COUNT} ingredient items in **DIFFERENT vessels** per {VESSEL_LIST} (bowl/plate/dish/pot — NOT forced identical bowls). Each vessel has **horizontal wooden plaque** flat UNDER or in front on table (tan wood grain, dark brown border, black horizontal Chinese 2-4 chars): {INGREDIENT_LABELS}. CLEAR GAP — hero dish/wok NOT blocked. NOT green rectangular labels NOT six-copy-paste identical bowls unless dish requires.
Props: {PROPS}. Warm cinematic lighting, vertical commercial poster, highly detailed, no watermark.
```

**Variant A-slogan** — same as A, replace only the two bubble lines with:

```text
{BUBBLE_COUNT} rounded Chinese speech bubbles with tails to chefs' mouths.
BUBBLE_STYLE slogan: short appetizing selling phrases (NOT required first-person): {BUBBLE_1} {BUBBLE_2} ...
```

---

## B · Character version (night market / cold dessert)

**Reference**: `qingbuliang_poster.png`

```text
Vibrant 3D-rendered Chinese food promotional poster, miniature diorama toy photography style.
Tropical {REGION} night market dusk, string lights, palm trees, blurred stalls, soft neon {NEON_SIGN},
{TABLECLOTH} tablecloth.
Central focus: oversized photorealistic {FOOD_DESC}, cold mist rising.
{CHEF_COUNT} cute chibi FEMALE chefs at periphery NOT blocking dish, white hats green aprons: {CHEF_ACTIONS}.
{BUBBLE_COUNT} speech bubbles per food-poster-speech-bubbles.md (dialogue or slogan). Top 3D red title "{DISH_CN}", green banner "{TAGLINE}",
vertical wooden sign "{REGION}味道", TOP1 badge optional.
Props: {PROPS}. Warm festive lighting, vertical poster, no watermark.
```

---

## C · No-character (match character poster)

**Reference**: `qingbuliang_poster_no_char.png` + same dish `{slug}_poster.png`

**Before prompt**: fill ingredient table from [food-poster-ingredients.md](../../../docs/style/food-poster-ingredients.md) — `{BOWL_COUNT}` and `{INGREDIENT_LABELS}` (4–6 items, dish-specific).

```text
Edit/reference: same composition and scene as reference but ZERO people NO characters NO dolls.
Absolutely NO ladder NO wooden ladder NO step ladder.
{FOOD_DESC} with food-only dynamics: {FOOD_ACTIONS} (no hands visible if pouring).
Bottom row: {BOWL_COUNT} ingredient displays with **varied vessels** ({VESSEL_LIST}). Each has **horizontal wooden plaque** centered UNDER vessel on table: tan wood grain, dark brown border, black horizontal brush text. Labels ONLY: {INGREDIENT_LABELS}. Hero food upper 50% with gap above bottom props.
NOT green rectangular labels NOT digital UI stickers NOT fluorescent green tags.
Do not force six bowls; do not add unrelated optional sides.
Top 3D title "{DISH_CN}", green banner "{TAGLINE}", {REGION}味道 sign, TOP1 badge optional.
Sharp crisp bowl rim, no blur no smudge. Vertical poster, no watermark.
```

---

## Worked example · 清补凉（夜市）

**DISH_CN** 清补凉 · **TAGLINE** 海南经典 · 椰香消暑 · 料足冰爽

**FOOD_DESC**: giant glass bowl Qingbuliang, coconut milk, ice, red beans, mung beans, taro balls, coconut strips, mango, watermelon, grass jelly

**CHEF_ACTIONS**: pour coconut milk splash from ladder, add fruit, add ice, stir, present small cup

**FOOD_ACTIONS (no-char)**: pitcher pouring coconut splash, watermelon tipping in, ice spilling, wooden spoon stirring, small serving bowl foreground

**BOWL_COUNT** 6 · **INGREDIENT_LABELS** 蜜红豆 绿豆 芋圆 椰丝 仙草冻 水晶冻

**PROPS**: green coconuts, halved coconut, bottom bowls with wooden plaque labels (蜜红豆 绿豆 芋圆 椰丝 仙草冻 水晶冻), chalkboard menu

---

## Worked example · 文昌鸡饭（厨房）

**DISH_CN** 文昌鸡饭 · **TAGLINE** 海南经典 · 皮爽肉嫩 · 鸡油饭香

**FOOD_DESC**: sliced Wenchang chicken golden skin, mound chicken-oil rice, cucumber, dipping sauces

**CHEF_ACTIONS**: pour ginger-scallion oil from ladder, carry ginger, scoop rice, slice chicken, present sample plate

**PROPS**: Hainan rice sack, teapot, ginger calamansi sauce bowls

---

## Worked example · 西湖醋鱼（杭帮 · 5 人）

**DISH_CN** 西湖醋鱼 · **TAGLINE** 江南经典 · 酸甜鲜嫩 · 醋香入味 · **REGION** 杭州

**CHEF_COUNT** 5 · **TABLECLOTH** green-white checkered · **SCENE** West Lake window pagoda bokeh

**CHEF_ACTIONS**: ladder pour sauce; lift vinegar jar; chopsticks place ginger; present sample bite; knife garnish fish head

**BUBBLE_1** 糖醋芡搅匀了，我趁热往上淋～ · **BUBBLE_2** 这坛香醋酸甜正好，别倒多啦！ · **BUBBLE_3** 姜丝我来摆，提鲜又去腥～ · **BUBBLE_4** 你先尝这一筷，肉嫩汁亮！ · **BUBBLE_5** 鱼头上再铺点姜，醋香能闷进去～

---

## Worked example · 定安黑猪（厨房 · 3 人）

**DISH_CN** 定安黑猪 · **TAGLINE** 海南经典 · 肉质细嫩 · 白切鲜香

**CHEF_COUNT** 3 · **CHEF_ACTIONS**: pour hot ginger-scallion oil; stir garlic dip; present one slice on plate

**BUBBLE_1** 姜葱油趁热淋，香得很～ · **BUBBLE_2** 蒜泥蘸料我调好啦，快蘸！ · **BUBBLE_3** 先尝这块，皮脆肉嫩！

---

## 构图 · 防穿模（复制进 A，有人物时必写）

```text
CRITICAL COMPOSITION: hero dish CENTER-UPPER 45-55% fully visible NOT blocked. CLEAR GAP between dish bottom and ingredient props.
CRITICAL PLACEMENT: {CHEF_COUNT} cute female 3D chibi at FOUR OUTER CORNERS, smaller scale, NO overlap NO clipping into dish, hands outside bowl/wok rim.
```

## 料碗木牌 · 英文块（复制进 A / C · 默认横放）

```text
Bottom foreground only lowest 12-18%: {BOWL_COUNT} ingredient items in varied vessels ({VESSEL_LIST}). Each has horizontal rectangular wooden plaque flat UNDER or in front on table (tan wood grain, dark brown border, black horizontal brush Chinese 2-4 chars): {INGREDIENT_LABELS}. Hero dish upper area with gap. NOT green rectangular labels NOT six identical bowls unless dish requires.
```

**版式金标准**：`asserts/Gourmet recipe2/cn/guangdong/lachang_chaofan_poster_no_char.png`。竖式样张 `docs/style/refs/ingredient-wooden-plaque-ref.png` 仅备用。

---

## Placeholder quick reference

| Key | Example |
|-----|---------|
| BUBBLE_STYLE | `dialogue` (default) / `slogan` |
| INGREDIENT_LABELS | 腊肠 · 米饭 · 葱花 · 酱油（木牌横排 2～4 字，器皿正下方） |
| VESSEL_LIST | bowl / plate / dish / pot — per ingredient |
| BUBBLE_COUNT | 3 (dingan) / 5 (wenchang, xihu) |
| REGION | 海南 |
| TABLECLOTH | red-white checkered / green-white checkered |
| NEON_SIGN | 海南夜市 |
| slug | qingbuliang, wenchang_jifan, yezi_ji |
