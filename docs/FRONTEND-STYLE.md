# Street Corner Foodie · Frontend Style

> Web 端视觉与 CSS 约定。技术栈见 [ARCHITECTURE.md](./ARCHITECTURE.md)（若未建则见 `web/README.md`）。  
> 视觉真源：`design/alt-c/README.md` §2.2。

## 1 · 样式文件分工

| 文件 | 职责 |
|------|------|
| `src/styles/tokens.css` | 色板、布局、`--type-*` 字号与字重 token |
| `src/styles/base.css` | reset、`.h-track` / `.h-serif-dish`、全站正文 |
| `src/styles/components.css` | v0.5 组件 + 共享块（含 `.alt-stats-line`） |
| `src/styles/alt-c-refine.css` | v0.6 alt-c：顶栏、画廊、**首页**、海报/小志阅读器 |

新 token **只**进 `tokens.css`；新页面优先用 `var(--type-*)`，禁止再写 10px UI 字。

## 2 · 字体族

| 类名 / 变量 | 用途 |
|-------------|------|
| `var(--font-body)` | UI、副标、按钮、导航（**默认**） |
| `var(--font-display)` | 区域名、bento 主标题 |
| `var(--font-en-display)` | 英文展示/斜体副标（老爸茶 EN 等） |
| `var(--font-poster-dish)` | `.h-serif-dish`、海报金色菜名 |
| `var(--font-mono)` | 仅键帽、坐标等**数据**；**不要**整段 UI 标签 |

混排：英文 sans + 中文 sans；大菜名可用 `.h-serif-dish`。

## 3 · 字号 scale（`tokens.css`）

| Token | 默认 | 用途 |
|-------|------|------|
| `--type-base` | 16px | `body` 正文 |
| `--type-ui` | 15px | 导语、tagline |
| `--type-ui-sm` | 14px | 卡片副标、按钮、双语副行 |
| `--type-label` | 13px | 栏目标签、统计行、雷达标题 |
| `--type-caption` | 12px | 极次要角标（**慎用在首页/阅读器主文案**） |
| `--type-min-ui` | 13px | UI 下限（文档约束；实现上请用 `--type-label` 及以上） |

| Token | 默认 | 用途 |
|-------|------|------|
| `--type-weight-body` | 500 | 正文 |
| `--type-weight-ui` | 600 | 标签、按钮 |
| `--type-weight-strong` | 700 | 标题 |

### 3.1 按页面作用域

| 页面 | 选择器前缀 | 说明 |
|------|------------|------|
| 海报 / 小志阅读器 | `#poster-reader-root`, `#zine-reader-root` | `alt-c-refine.css` 内 `body.has-altc :is(...)` 块 |
| 地区画廊 | `.alt-gallery` | 同上 |
| **首页** | `body.landing-page` / `body.landing-page.has-altc` | **`alt-c-refine.css` § Landing · typography**；与城市卡、bento 同步 scale |
| **首页天气卡** | `.bento-weather-live` | **`tokens.css` § weather chip**；规格 [WEATHER-CHIP-TOKENS.md](./WEATHER-CHIP-TOKENS.md) |
| 全球/国家 v0.5 | 无 `.has-altc` | 仍用 `components.css` 纸质感；逐步迁移 |

海报、小志、首页 **共用同一套 `--type-*`**；阅读器侧栏可再局部 `clamp()` 放大标题，但副标不得小于 `--type-ui-sm`。

## 4 · 首页（Landing）检查清单

改 `HomePage.astro` 或 bento 文案样式时核对：

- [ ] 无 `font-size: 10px` / `11px` 的 UI 文案（统计行、坐标、雷达头已改为 ≥13px）
- [ ] 副标、胶囊按钮 ≥ `--type-ui-sm`（14px）
- [ ] 字重：正文 500，标签/按钮 600，主标题 700
- [ ] 城市卡 `.label` / `.coords` 用 `--font-body`，非 mono 细字
- [ ] 叠在照片上的白字对比度：必要时提高 `font-weight` 或略加大号

## 5 · 与品牌

UI 文案遵循 [BRAND.md](../../BRAND.md) / `.cursor/rules/scf-brand.mdc`（Street Corner Foodie / 街角美食 / 街角グルメ）。
