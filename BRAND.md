# Street Corner Foodie · 品牌手册

> 项目名称定于 2026-05-18，替代旧称「Meishi Atlas / 美食图鉴」。**中文正名 2026-05-28 起为 街角美食**（2026-05-18～2026-05-27 曾用「街角食客」）；**日文正名同日起为 街角グルメ**（曾用「街角フーディー」）。 
> 资产目录（`asserts/`）、文档目录（`docs/`）、文件命名前缀（`cn_hainan_…`、`jp_tokyo_…`）**保持不变** —— 这些是技术路径，与品牌名解耦。

---

## 1 · 名称体系

| 语言 | 主称 | 何时用 |
|------|------|--------|
| **英文** | **Street Corner Foodie** | 默认；全球品牌名 |
| 英文短名 | **SCF** | 内部代号、git/包名、build label |
| **中文** | **街角美食** | 中文区界面、中文宣发 |
| **日文** | **街角グルメ** | 日本市场界面 |

域名约定：正式站 **`https://streetcornerfoodie.com`**（Cloudflare Pages + GitHub `SITE_URL`）；注册备选 `.world` / `.food`；社媒 @streetcornerfoodie 或 @scfworld。部署见 [web/docs/DEPLOY.md](web/docs/DEPLOY.md)。

---

## 2 · 一句话定位（Tagline）

| 语言 | 文案 |
|------|------|
| EN | *Turn into every street corner of the world — taste the city, see the bite.* |
| ZH | *拐进世界的每个街角，看食物与城市如何一起呼吸。* |
| JA | *世界の街角を曲がるたび、味と街が立ち上がる。* |

副定位（一行）：**A diorama atlas of world street food & cityscapes** / **世界街角的美食与街景图鉴**。

---

## 3 · 视觉

### 3.1 Logo Mark

一个"街角 L"加一颗"咬一口的小圆点"。

```svg
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M7 7 L7 25 L25 25"/>
  <circle cx="20" cy="11.5" r="3.2" fill="currentColor"/>
</svg>
```

- 笔画白色，底色用所在**国家主题色**填充（CN 朱红、JP 红、US 蓝）
- 边角：CN 10px 圆角、JP 4px 圆角、US 4px 圆角

### 3.2 字标

| 用法 | 字体 |
|------|------|
| 英文标头 (Street Corner Foodie) | **Playfair Display** 600/700 |
| 英文小标 caps (STREET · CORNER · FOODIE) | **JetBrains Mono** 500，字距 .24em |
| 中文标头（街角美食） | **Noto Serif SC** 700 |
| 日文标头（街角グルメ） | **Noto Serif JP** 700 |

### 3.3 色板（同 index.html `:root`）

| Token | 中国 | 日本 | 美国 |
|-------|------|------|------|
| primary | `#C0392B` 朱红 | `#E60012` 日红 | `#1B3A6B` 钴蓝 |
| accent  | `#C9A14F` 金 | `#00D9E0` 青霓虹 | `#E8B842` 芥黄 |
| surface | `#F4EBD8` 宣纸米 | `#0F0F12` 墨黑 | `#FFF8E7` 暖白 |
| text    | `#2B2B2B` | `#F5F5F5` | `#1A1A2E` |

切换国家 → 切换整套 token；组件零改动（CSS 变量驱动）。

---

## 4 · 品牌支柱（三类资产）

| 画风 | 在品牌里扮演 | 文件夹 |
|------|-------------|--------|
| **海报 Poster** | 「这是什么菜 · 一眼可识」 | `asserts/Gourmet recipe2/{cc}/{admin}/` |
| **小志 Mini-Zine** | 「故事 · 做法 · 文化」 | `asserts/mini-zine/{cc}/{admin}/` |
| **街景 Street View** | 「这道菜的城市生存现场」 | `asserts/Street View/{cc}/{admin}/{local}/` |

三类**不可互相替代、不可混风格出图**（详见 [docs/ASSETS.md](docs/ASSETS.md)）。

---

## 5 · 名称迁移清单

技术路径**不改**。仅以下出现"Meishi Atlas / 美食图鉴"字样的展示位需要替换：

| 位置 | 状态 |
|------|------|
| `index.html` `<title>` / `<meta description>` | ✓ 已改 |
| `index.html` logo 字标 + SVG mark | ✓ 已改 |
| `index.html` hero label / footer | ✓ 已改 |
| `BRAND.md`（本文件） | ✓ 新增 |
| `idea.md` | 待补 |
| `docs/README.md`、`asserts/README.md` 等 | 可选；这些 README 主要描述结构，不必处处替换 |
| `AGENTS.md` / `.cursor/rules/` | **保持不变**；它们描述资产规范与流程，与品牌名解耦 |

---

## 6 · 使用规范（简）

- **正式书写**：Street Corner Foodie（每词首字母大写）；不写 `street corner foodie` 全小写、不写 `STREET CORNER FOODIE` 除非作 caps 字标
- **缩写**：仅在内部技术语境用 `scf`（小写），如 `scf-web`、`@scf/data`
- **中文**：街角美食（不写「街角的食客」「街角馋客」「街角食客」等变体；2026-05-28 前称「街角食客」）
- **日文**：街角グルメ（不写「街角フーディー」「フーディ」等旧称；2026-05-28 前称「街角フーディー」）
- **拼写易错**：Foodie 不是 Foodies、不是 Foody
- **不允许**：自行翻译成法/西/德等其他语种之前，先在本文件登记
