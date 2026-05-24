# 无人物版 · 已废除（2026-05-21）

**新旧 Cursor 对话均按本文执行。** 用户不必再说「不要无人物」。

## 一句话

**不再生成、不再入库、不再在 Web 提供切换** 任何 `*_no_char*` 成品。每道菜每种画风只保留**有人物 / 含场景**的标准文件。

### mini-zine（做法小志）· 重点

| 旧流程（废除） | 现行（必遵） |
|----------------|--------------|
| 每 slug **4 张**（story/recipe × 有/无人物） | **标准 2 张** + **叙事 4 页**（见下） |
| `*_story_eating_mini_zine_no_char.png` 等 | **禁止** `_no_char`；**禁止**用叙事页替代标准做法/四栏稿 |
| 补全缺失 `_no_char` | 忽略；缺叙事页 → 只补叙事；缺标准 2 张 → 补标准 |

### mini-zine · 双轨交付（2026-05 · 标准 + 叙事）

| 轨道 | 张数 | 文件名 | 版式 |
|------|------|--------|------|
| **标准** | **2** | `{slug}_story_eating_mini_zine.png` · `{slug}_recipe_mini_zine.png` | 左四栏信息图 + 做法四步（金标准 `baimi_zhou_*`） |
| **叙事** | **4** | `{slug}_narrative_01_story_mini_zine.png` … `_04_ingredients_mini_zine.png` | 绘本场景 / 文化 / 街景 / 食材图鉴（金标准 `wenchang_jifan_narrative_*`） |

`按 mini-zine` **默认做齐 6 张**（除非用户只要「标准两张」或「只要叙事」）。重复检测：标准 2 齐 → 跳过标准；叙事 4 齐 → 跳过叙事。

`alwaysApply`：[meishi-mini-zine-era.mdc](../../.cursor/rules/meishi-mini-zine-era.mdc) · Skill `gourmet-recipe-mini-zine`

## 废除范围

| 画风 | 旧命名（勿再新建） | 现行唯一交付 |
|------|-------------------|--------------|
| 美食海报 | `{slug}_poster_no_char.png` | `{slug}_poster.png` |
| mini-zine | `*_mini_zine_no_char.png`、story/recipe 无人物变体 | `{slug}_story_eating_mini_zine.png` · `{slug}_recipe_mini_zine.png` |
| 街景 | `*_no_char.png` 可选第三变体 | 每场景 **day_wide + night_wide + day_standard**（3 张） |

## Agent / 入库

- **禁止** `GenerateImage` 无人物海报、无人物 zine、无人物街景。
- **禁止** 在 frontmatter / 资源表新增 `*_no_char` 行。
- **重复检测**：海报 = 每 slug **1** 张 `_poster`；zine = 每 slug **2** 张（story + recipe）；街景 = 每场景 **3** 张矩阵。
- **「一对」重定义**：
  - 海报：同 slug **仅** `{slug}_poster.png`（同时代、布景、人料布局均锁在这一张）。
  - zine：同 slug **2** 张 mini-zine **同时代、同服饰**。
  - 海报 ↔ zine **仍不强制同时代**（除非用户说对齐）。

## 版式金标准（替代旧 `_no_char` 参考）

- 海报布局：`asserts/Gourmet recipe2/cn/guangdong/lachang_chaofan_poster.png`（居中主菜 + 底行横木牌 + 四角 chibi）。
- 禁止再以 `*_poster_no_char.png` 作为生成参考或 Skill 金标准。

## Web

- 移除 `?char=no` 及「有人物 / 无人物」切换。
- 解析 frontmatter 时**忽略** `*_no_char` 条目（legacy 文件可留在磁盘，不参与列表）。

## Legacy 磁盘文件

`asserts/` 下既有 `*_no_char*.png` **可保留不删**（历史资产）；新任务**不得**补全或重做无人物版。用户明确要求删除某文件时单独处理。

## 相关 alwaysApply

- [meishi-assets.mdc](../../.cursor/rules/meishi-assets.mdc)
- [meishi-food-poster.mdc](../../.cursor/rules/meishi-food-poster.mdc) · [meishi-food-poster-era.mdc](../../.cursor/rules/meishi-food-poster-era.mdc)
- [meishi-mini-zine-era.mdc](../../.cursor/rules/meishi-mini-zine-era.mdc)
- [meishi-street-view-spec.mdc](../../.cursor/rules/meishi-street-view-spec.mdc)
- [AGENTS.md](../../AGENTS.md) · [ASSETS.md](../ASSETS.md)
