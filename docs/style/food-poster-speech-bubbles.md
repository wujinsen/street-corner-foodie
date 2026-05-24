# 美食海报 · 人物对话框规范

**适用**：`asserts/Gourmet recipe2/` 有人物版（`*_poster.png`）  
**无关**：无人物版（`*_poster_no_char.png`）——无厨师气泡；可有 1 条纯文案装饰气泡（无嘴指向）

**新旧对话均生效**：生成、重制、优化海报时自动读本节，用户不必重复口述。

---

## 形式（新旧共用）

| 项 | 要求 |
|----|------|
| 形状 | 圆角白/米色气泡，**细尾指向该厨师嘴** |
| 数量 | **≤ 厨师人数**；常见 **3～5** 条（3 人菜 3 条，5 人菜可 5 条，与文昌鸡饭、西湖醋鱼一致） |
| 字数 | 中文 **8～18 字**为宜，可含 `～` `！` `，` |
| 语言 | 简体中文；同一张海报内 **不要混用** 两种文体（见下） |

---

## 两种文体（均可使用）

### 对白体 · `dialogue`（新版，**默认推荐**）

厨师**边做边说**：第一人称或现场口吻，**绑定当前动作**。

| 厨师动作 | 对白体示例 |
|----------|------------|
| 淋姜葱油 | 姜葱油趁热淋，香得很～ |
| 调蒜泥 | 蒜泥蘸料我调好啦，快蘸！ |
| 端样盘 | 先尝这块，皮脆肉嫩！ |
| 淋糖醋芡 | 糖醋芡搅匀了，我趁热往上淋～ |

**金标准参考**：`cn/hainan/wenchang_jifan_poster.png`、`dingan_heizhu_poster.png`、`cn/zhejiang/xihu_cuyu_poster.png`

### 标语体 · `slogan`（旧版，**仍有效**）

短**卖点/功效**句，不必第一人称，偏海报文案。

| 示例 |
|------|
| 肉质细嫩 · 皮脆肉香 · 蘸料提鲜 |
| 姜丝点缀，提鲜去腥！ |
| 酸甜开胃，醋香入味 |

**适用**：已定稿旧图不重制、用户明确要求标语体、快速占位出图。  
**勿与对白体混排**：同一张图要么全对白体，要么全标语体。

---

## 何时选用

| 场景 | 建议 `BUBBLE_STYLE` |
|------|------------------------|
| **新海报**、批量火锅主菜、用户说「优化对话框」「像说出来」 | `dialogue` |
| **重制**已有海报且未指定文体 | `dialogue` |
| 用户写「保留旧气泡」「标语体」「卖点词」 | `slogan` |
| 仅补无人物版、旧有人物版不重做 | 不改动人物版气泡 |

---

## 写入 prompt

生成前在 prompt 或任务备注中写明 **`BUBBLE_STYLE=dialogue`** 或 **`slogan`**，并列出与厨师一一对应的 `{BUBBLE_1}` …（条数 = 有台词的厨师数）。

### 对白体（英文骨架片段）

```text
{BUBBLE_COUNT} rounded Chinese speech bubbles with tails to each speaking chef's mouth.
BUBBLE_STYLE dialogue: each line = chef speaking their current task in casual first-person (NOT floating ad slogans).
Lines: {BUBBLE_1} {BUBBLE_2} ...
```

### 标语体（英文骨架片段）

```text
{BUBBLE_COUNT} rounded Chinese speech bubbles with tails to chefs' mouths.
BUBBLE_STYLE slogan: short appetizing selling phrases tied to dish (may be third-person or feature words, NOT required first-person).
Lines: {BUBBLE_1} {BUBBLE_2} ...
```

---

## 无人物版

- **无**厨师与厨师气泡。  
- 可选 **1 条**无嘴指向的装饰气泡（纯菜名/卖点，如「海南名猪」），与上表两种文体无关。

---

## 相关

- 版式总 spec：[food-poster-diorama.md](food-poster-diorama.md)  
- 人数与食材碗：[food-poster-ingredients.md](food-poster-ingredients.md)  
- Skill：[meishi-food-poster](../../.cursor/skills/meishi-food-poster/SKILL.md)  
- 实例：[prompt-templates.md](../../.cursor/skills/meishi-food-poster/prompt-templates.md)
