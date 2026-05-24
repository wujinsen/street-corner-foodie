# Gourmet recipe2 · 时代服饰 3D Q 版（与 mini-zine 同源）

**风格 ID**：`food-poster-dynasty-chibi`  
**目录**：`asserts/Gourmet recipe2/{cc}/{admin}/`  
**版式**：仍用 [food-poster-diorama.md](food-poster-diorama.md)（巨型主菜 + 横木牌底行等）  
**boluo 清新风**：用户点名时见 [food-poster-diorama.md §boluo 清新风](food-poster-diorama.md#boluo-清新风--清晰风2026-05-19--新旧对话必守) — 主锚 `boluo_chaofan_poster.png`（明亮通透·清新）；底行 **必横木牌**  
**禁止**：mini-zine 羊皮纸分栏；街景等距沙盘；按街景分区定服饰/竖牌（见 [food-poster-diorama.md](food-poster-diorama.md)「与街景无关」）

---

## 一句话

有人物海报一律 **3D chibi**；**时代代号表**与 mini-zine 相同（中国 / 美国 **`us_*` 13+2 档** / 日本 **`jp_*` 古代至今 13 档**），由「食物 + 当地 + 国别」**各自**定代。**同 slug 不强制与 zine 同时代**；海报内部 `_poster` 与 `_poster_no_char` 仍须同时代、布景一致。**角色性别**：**优先女性**，默认全员女性 chibi → [mini-zine-dynasty-chibi.md §角色性别](mini-zine-dynasty-chibi.md#角色性别--优先女性2026--新旧对话必守)。

**新旧对话均生效**：`.cursor/rules/meishi-food-poster.mdc` · `.cursor/rules/meishi-food-poster-era.mdc`（均 `alwaysApply: true`）。版式 → [food-poster-ingredients.md §总览](food-poster-ingredients.md#新旧对话必守--海报版式总览2026-05-21)。

---

## 锁定范围 · 「一对」定义（与 mini-zine 一致）

详见 [mini-zine-dynasty-chibi.md §锁定范围](mini-zine-dynasty-chibi.md#锁定范围--一对定义2026--新旧对话必守)。海报侧摘要：

| 项 | 规则 |
|----|------|
| **一对** | 同 slug 仅 **`_poster.png` + `_poster_no_char.png`** |
| **不跨画风** | 与 zine 四套 **不强制**同时代 |
| **对齐** | 仅当用户说「跟 zine 一致」 |

---

## 与 mini-zine 的关系

| 项 | mini-zine | Gourmet recipe2 海报 |
|----|-----------|----------------------|
| 时代代号、候选池、强锚定 | [mini-zine-dynasty-chibi.md](mini-zine-dynasty-chibi.md) | **完全沿用** |
| 已收录 slug 表 | [dynasty-chibi.md](../../.cursor/skills/gourmet-recipe-mini-zine/dynasty-chibi.md) | **同表**；无行则走候选池 + `hash(slug)` |
| 随机 | `index = sum(ord(c) for c in slug) % len(pool)` | 海报、zine **各自**按公式抽；**不要求**结果相同 |
| 人物数量 | 故事 2–4 / 做法 1–3 | **3～5 按菜**（见 [food-poster-ingredients.md](food-poster-ingredients.md)） |
| 底行料展示 | — | **4～6 按菜**（器皿、件数可变；横放木牌）→ [§人料皆可变](food-poster-ingredients.md#按菜定布局--人料皆可变2026-05--新旧对话必守) |
| 站位 | 分栏内 | **地面或桌边四角**，与碗/盘留空带；**禁止**踩碗沿、半身入碗、站在食物上（河北历史稿常见问题） |
| 主菜占比 | — | 画面 **≥50%** 给巨型主菜，人物偏小 |
| 服饰 | 时代汉服/民国/当代等 | **禁止**默认全员「白帽绿围裙现代厨师」（除非时代为 `contemporary` 且刻意用夜市围裙/厨师马甲） |
| 无人物版 | 无小人 | `_poster_no_char.png` 无人物；**布景与有人物版一致** |

---

## 决策流程（Agent 必做）

与 mini-zine 相同顺序：

1. **强锚定**（典故、贡品、菜名、用户指定）→ 单一时代  
2. 查 [dynasty-chibi.md](../../.cursor/skills/gourmet-recipe-mini-zine/dynasty-chibi.md) 已收录行  
3. 无固定 → [mini-zine-dynasty-chibi.md](mini-zine-dynasty-chibi.md) §候选池  
4. 池内 ≥2 → `hash(slug)` 可复现随机  
5. **出图前**回复表：`| 菜名 | slug | 画风 | 时代代号 | 性别（默认全员女性） | 服饰摘要 | 随机? |`  
6. 用户未要求对齐时：**不必**查阅对侧已定时代；若说「跟 zine / 跟海报 一致」→ 与对侧锁定

---

## 海报专有要求

| 项 | 要求 |
|----|------|
| 体型 | 2.5–3 头身，手办感，与 zine 一致 |
| 性别 | **优先女性**：默认 **全员女性** chibi；prompt 写 `cute female 3D chibi` / `all female cooks` |
| 人数 | 3～5；简单主菜 3，火锅/多步骤 4～5 |
| 动作 | 倒汤、切菜、端盘等**动态**，配合 [food-poster-speech-bubbles.md](food-poster-speech-bubbles.md) |
| 梯子 | 允许小木梯**仅作道具**；无人物版 **禁止**梯子 |
| 竖牌 | `{地域}味道`（时代不写进竖牌，只体现在服饰） |
| 参考图 | 同地区 `_poster.png` **版式**；`_mini_zine.png` 仅参考构图，**服饰以本张海报自定的时代为准** |
| 日本/美国 | **`jp_*` / `us_*`**（见 [mini-zine-dynasty-chibi.md](mini-zine-dynasty-chibi.md) §按国家切换）；**禁止**中国朝代或笼统 `overseas` |

---

## 历史稿与新作（双轨保留 · 2026）

| 类型 | 文件名 | 人物 | 处理 |
|------|--------|------|------|
| **历史定稿** | `{slug}_poster.png`、`_poster_no_char.png` | 白帽绿围裙等旧符号 | **保留不删、不自动覆盖** |
| **朝代规范新作** | 同上路径新文件，或 `{slug}_poster_{era}_redraw.png` 试绘 | 按本文 + mini-zine 时代表 | **此后新做、新菜、用户点名重制** 均走此轨 |
| **无人物版** | `_poster_no_char.png` | 无人物 | 新旧布景一致；历史无人物版亦保留 |

**原则**

1. **历史先存在**：已有 `cn/hainan/` 等目录内定稿视为 **legacy**，除非用户明确「替换定稿」「覆盖」。  
2. **后面新做的都按新规范**：新 slug、新地区、补缺失、试绘样张 → **必须**定时代 + `{DynastyDressEN}`，**禁止**再默认全员白帽绿围裙。  
3. **同 slug 已有 mini-zine**：海报 **可另选时代**（例：zine `us_contemporary`、海报 `us_gilded`）；须在资源表注明各自时代。用户要求一致时才对齐。  
4. **试绘样张**：如 `wenchang_jifan_poster_song_redraw.png` — 与 `wenchang_jifan_poster.png` **并存**，写入省 md 资源表备查。

**海南示例（并存）**

| 菜品 | 历史定稿 | 朝代试绘 / 新作 |
|------|----------|-----------------|
| 文昌鸡饭 | `wenchang_jifan_poster.png` | `wenchang_jifan_poster_song_redraw.png`（宋） |

---

## Prompt 粘贴

英文服饰块 → [dynasty-chibi.md](../../.cursor/skills/gourmet-recipe-mini-zine/dynasty-chibi.md) §`{DynastyDressEN}`。

海报模板 → [prompt-templates.md](../../.cursor/skills/meishi-food-poster/prompt-templates.md) 模板 A（替换 `{DynastyDressEN}` `{CHEF_COUNT}`）。

---

## 生成前必填

```markdown
| 菜名 | slug | 时代代号 | 服饰摘要 | 随机? | 与 zine 一致? |
```

---

## 文件命名

`{slug}_poster.png` · `{slug}_poster_no_char.png`（或 `cn_hainan_{slug}_poster.png`）

---

## Cursor 强制规则

| 文件 | 作用 |
|------|------|
| `.cursor/rules/meishi-food-poster.mdc` | **`alwaysApply: true`** — 版式总览、横木牌、居中主菜、防穿模 |
| `.cursor/rules/meishi-food-poster-era.mdc` | **`alwaysApply: true`** — 时代服饰、人料表 |
| `.cursor/rules/meishi-assets.mdc` | 入库 `Gourmet recipe2/{cc}/{admin}/` |
| [AGENTS.md](../../AGENTS.md) | 海报全流程速览 |
| [food-poster-ingredients.md §总览](food-poster-ingredients.md#新旧对话必守--海报版式总览2026-05-21) | 新旧对话一页清单 |

### 用户怎么说

- `按海报朝代` / `海报也按 mini-zine 时代` → 本规范 + `meishi-food-poster`  
- `按 meishi-food-poster` → 默认含本规范（无需重复口述）

---

## 延伸

- 版式：[food-poster-diorama.md](food-poster-diorama.md)  
- 气泡：[food-poster-speech-bubbles.md](food-poster-speech-bubbles.md)  
- Skill：[meishi-food-poster/SKILL.md](../../.cursor/skills/meishi-food-poster/SKILL.md)
