# web/ · 技术规范

> Street Corner Foodie · Web 应用工程口径。 
> 凡是在 `web/` 下写代码、加路由、改数据流，**必须**对齐本文件。 
> 配套规则：[`.cursor/rules/scf-web.mdc`](../../.cursor/rules/scf-web.mdc) · 风格：[FRONTEND-STYLE.md](FRONTEND-STYLE.md) · 路线：[ROADMAP.md](ROADMAP.md)

---

## 1 · 技术栈

| 层 | 选择 | 理由 |
|---|---|---|
| 渲染框架 | **Astro 4** | 默认零 JS、SSG；内置 i18n 路径前缀（v0.3 ✅） |
| 语言 | **TypeScript strict** (`astro/tsconfigs/strict`) | 域模型显式、IDE 自洽 |
| UI 框架 | **无**（纯 Astro 组件 + 原生 CSS） | 三大资产是图，组件交互浅；v0.5 起小量 vanilla `<script>`（小志键盘 / 搜索 / 收藏），不引框架 |
| 样式 | **原生 CSS + CSS Variables**，按文件组织 | 不引 Tailwind / CSS-in-JS；token 唯一真源 = `tokens.css` |
| 包管理 | **npm** | 已用 Node 22 / npm 11；无 monorepo |
| 字体 | Google Fonts（`<link>`） | 三语三族字体见 FRONTEND-STYLE.md §3 |
| 类型检查 | `npm run check`（`astro check`） | 提交前必须 0 errors / 0 warnings |
| 测试 | **暂无**（v0.6 引入） | 见 ROADMAP |

**禁止**（除非显式提议升级本规范）：

- 引 React / Vue / Svelte 等任何组件框架
- 引 Tailwind / UnoCSS / styled-components
- 引 SCSS / PostCSS 预处理（原生 CSS 嵌套 + Astro 内置作用域已够用）
- 跨包/Workspace 拆分

---

## 2 · 目录结构

```
web/
├── astro.config.mjs            # output:"static" + i18n；vite fs.allow [".."]
├── tsconfig.json               # strict + @/* 别名
├── package.json                # 仅 astro + @astrojs/check + typescript
├── README.md                   # 启动指南
├── docs/
│   ├── ARCHITECTURE.md         ← 本文件
│   ├── FRONTEND-STYLE.md
│   └── ROADMAP.md
├── public/
│   ├── favicon.svg
│   └── asserts/                # NTFS junction → ../../asserts/  (gitignore)
└── src/
    ├── env.d.ts
    ├── layouts/
    │   └── Base.astro          # <html> shell + Topbar + footer
    ├── components/
    │   ├── BrandMark.astro     # logo SVG (单源)
    │   ├── Topbar.astro        # 国家/语言切换 + 面包屑 + 搜索/收藏按钮
    │   ├── SiteChrome.astro    # 搜索覆盖层 + 收藏抽屉（全局）
    │   ├── PosterCard.astro    # 海报卡（含 ♡ 收藏 + Tokyo SVG placeholder）
    │   ├── FlavorRadar.astro   # 详情页风味雷达
    │   └── StreetPicture.astro # 街景主图 + prefetch
    ├── lib/
    │   ├── types.ts            # Lang / Multilang / Country / Region / Poster
    │   ├── i18n.ts             # UI 字典 + t() 帮手
    │   ├── locale-path.ts      # localePath / switchLocalePath / legacyLangRedirect
    │   ├── url.ts              # 兼容层（legacy ?lang=）
    │   ├── load-content.ts     # 构建期读 docs/**/*.md（海报 + zine slug）
    │   ├── region-registry.ts  # md → region 绑定 + filter
    │   ├── poster-meta.ts      # 菜名 / tags / desc overlay
    │   ├── placeholders.ts     # 东京 SVG 海报 placeholder
    │   ├── streets.ts          # 街景场景矩阵（v0.4；v0.6 可接 md）
    │   ├── zines.ts            # ZINES（re-export）+ zineImageUrl
    │   ├── parse-zines.ts      # mini_zine frontmatter 解析
    │   ├── zine-svg.ts         # 无 PNG 时 SVG 小志页
    │   ├── search-index.ts     # 构建期搜索索引
    │   ├── static-paths.ts     # poster / street / zine getStaticPaths
    │   ├── countries.ts        # COUNTRIES + REGIONS（re-export）
    │   └── posters.ts          # POSTERS（re-export）
    ├── scripts/                # 页面内 <script> 引用的纯 TS（非 island 框架）
    │   ├── site-chrome.ts      # 搜索 + 收藏 + Cmd/Ctrl+K
    │   └── zine-reader.ts      # 小志键盘 ←→
    ├── views/                  # HomePage … ZineReaderPage / PosterDetail / Street
    ├── middleware.ts           # dev：?lang= → 302 路径式 locale
    ├── styles/
    │   ├── tokens.css          # ✱ 唯一 token 源
    │   ├── base.css            # reset + 字号 + 公用 utility
    │   └── components.css      # topbar / hero / poster-card / filter-rail / footer
    └── pages/
        ├── index.astro                          # /  全球落地（zh 默认）
        ├── [country]/index.astro                # /cn /jp /us
        ├── [country]/[region]/index.astro       # /cn/hainan 等
        ├── search-index.json.ts                 # GET /search-index.json（prerender）
        ├── [country]/[region]/poster/[slug]/…
        ├── [country]/[region]/street/[scene]/…
        ├── [country]/[region]/zine/[slug]/…
        ├── en/…                                 # /en/… 镜像（薄包装 → views/）
        └── ja/…                                 # /ja/… 镜像
```

**规则**：

| 想加什么 | 放哪里 |
|---|---|
| 新页面 | `src/pages/...`（一个文件 = 一条路由） |
| 跨页组件 | `src/components/X.astro` + props 显式类型 |
| 单页内只用一次的小块 | 写在页面 `---` 里或同文件 `<style>`，**不**进 components/ |
| 数据 / 业务逻辑 | `src/lib/*.ts`，纯函数 + 显式类型 |
| 全局样式 | 只能动 `tokens.css` `base.css` `components.css` 三处 |
| 组件局部样式 | `.astro` 内 `<style>`（Astro 自动作用域） |
| 临时实验 | `web/scratch/` (gitignored)；不要往 src/ 塞 |

---

## 3 · 渲染模式

```js
// astro.config.mjs
output: "static"
```

| 路由 | 模式 | 说明 |
|---|---|---|
| 全部 `src/pages/**` | **SSG**（默认 prerender） | 构建期生成 HTML；locale 由 Astro i18n + `pages/en|ja/` 镜像 |
| `?char=` / `?flavor=` | 构建期默认值 | 筛选链接仍用 query；无 SSR |

语言由 **URL 路径**（`/en/...`、`/ja/...`）决定，经 `Astro.currentLocale` → `resolveLang()`；不再用 `prerender = false` 读 `?lang=`。

`npm run build` 产出 `dist/`，可直接静态托管（v0.6 选型 CDN）。未来若加动态 API，可再开 `output: "hybrid"` 并加适配器。

---

## 4 · 路由约定

| URL 模式 | 文件 | 备注 |
|---|---|---|
| `/` | `pages/index.astro` | 全球落地（zh 默认，无前缀） |
| `/en/` `/ja/` | `pages/en/index.astro` 等 | 非 country code；由 locale 镜像优先匹配 |
| `/[country]` | `pages/[country]/index.astro` | 仅 `cn`/`jp`/`us` 合法 |
| `/[country]/[region]` | `pages/[country]/[region]/index.astro` | region ∈ `REGIONS[country]` |
| `/en/[country]/[region]` 等 | `pages/en/...` 镜像 | 与上同内容，UI 语言 en/ja |
| `/[country]/[region]/poster/[slug]` | `views/PosterDetailPage.astro` | 单菜详情（v0.4 ✅） |
| `/[country]/[region]/street/[scene]` | `views/StreetPage.astro` | 街景探索；`?time=` `?frame=` |
| `/[country]/[region]/zine/[slug]` | `views/ZineReaderPage.astro` | mini-zine 阅读器（v0.5 ✅） |
| `/search-index.json` | `pages/search-index.json.ts` | 构建期 JSON；`site-chrome.ts` fetch |

**Query 参数清单**（保持稳定，写代码改时回查本表）：

| param | 取值 | 默认 | 用途 |
|---|---|---|---|
| `lang` | `zh` `en` `ja` | — | **已废弃**；访问时 302 → 路径式 `/en/...`（`middleware.ts` + `Base.astro` 脚本） |
| `char` | `with` `no` | `with` | 海报有/无人物 |
| `flavor` | string (region.flavors[lang] 之一) | 不筛选 | 风味筛选（v0.2 真做过滤） |
| `time` | `day` `night` | `day` | 街景（v0.4） |
| `frame` | `wide` `standard` | `wide` | 街景画幅（v0.4） |
| `mode` | `story` `recipe` | `story` | 小志故事/做法（v0.5） |
| `char` | `with` `no` | `with` | 小志有/无人物（v0.5） |
| `page` | `0`…`n-1` | `0` | 小志页码（v0.5） |

非法值一律**回落到默认**而非 404。

---

## 5 · 数据层

### 5.1 现状（v0.1）

- 所有内容硬编码在 `src/lib/countries.ts` `src/lib/posters.ts`，类型严格
- 与 `index.html` 原型数据 1:1 对齐，方便对比

### 5.2 现状（v0.2 ✅）

构建期由 `src/lib/load-content.ts` 读取 `docs/china|world/*.md`（`gray-matter` + `import.meta.glob`，路径相对 `web/src/lib/` → `../../../docs/`）。

| 文档 | Web region | 映射 |
|---|---|---|
| `docs/china/hainan.md` | `cn/hainan` | [region-registry.ts](../src/lib/region-registry.ts) |
| `docs/china/shijiazhuang.md` | `cn/hebei` | 同上 |
| `docs/china/zhejiang.md` | `cn/zhejiang` | 同上 |
| `docs/world/japan.md` | `jp/tokyo` · `jp/fuji` | 同文档拆两 region + `streetFilter` |
| `docs/world/usa.md` | `us/ny` · `us/tx` · `us/la` | 同文档拆三 region + `posterFilter` / `streetFilter` |

**可选 frontmatter（web 专用）**：

| 字段 | 类型 | 用途 |
|---|---|---|
| `web_editor_pick` | `string[]`（slug） | 区域海报画廊置顶排序 |
| `web_posters` | `{ slug: { name, tags, pin, desc } }` 或 usa 嵌套 | 海报/zine UI 文案（v0.2.1） |

**从既有字段推导**：

| frontmatter | 推导 |
|---|---|
| `gourmet_posters` | 海报列表（忽略 `*_no_char` / `*_redraw` / `gourmet_posters_era_samples`） |
| `mini_zine` | zine 数量（按 slug 去重） |
| `street_view_approved` / `street_view_fuji_approved` | 街景场景数（`*_day_wide.png` 计数） |
| `gourmet_poster_dir` | 海报 `path` 前缀 |
| `cuisine_tags` | 风味 chip（三语暂同值；覆盖见 registry `flavors`） |

**UI 文案 overlay（v0.2.1 ✅）**：`web_posters` frontmatter（单区 flat；`usa.md` 按 `ny`/`la`/`tx` 嵌套）。读取 [lookup-poster-meta.ts](../src/lib/lookup-poster-meta.ts)；同步 `npm run sync:web-posters`（`export-poster-meta-bundle.py` + `sync-web-posters-to-md.mjs`，源：`posters.json` · 海南 bundle · `EXTRA`）。新增菜：更新 `gourmet_posters` / `mini_zine` 后跑同步；手改 md 文案会被下次同步覆盖。

**图片管线（v0.7 ✅）**：`npm run images` / `images:quick` → [optimize-images.mjs](../scripts/optimize-images.mjs) → `public/scf-img/` + `.scf-image-manifest.json`；页面用 [ScfPicture.astro](../src/components/ScfPicture.astro)（AVIF/WebP + PNG fallback）。

**东京 placeholder**：`japan.md` 已入库 `ramen` / `gyoza` 真图；其余 slug 由 registry `placeholderSlugs` + [placeholders.ts](../src/lib/placeholders.ts) 补足。

### 5.3 客户端交互（v0.5 ✅）

| 功能 | 入口 | 存储 / 数据 |
|---|---|---|
| 搜索 | Topbar 按钮 · `Cmd/Ctrl+K` | `GET /search-index.json`（`buildSearchIndex()`） |
| 收藏 | 海报卡 ♡ · Topbar 抽屉 | `localStorage` 键 `scf_favs` |
| 小志翻页 | `ZineReaderPage` 链式导航 + 键盘 | `?mode` `?char` `?page`；无图时 [zine-svg.ts](../src/lib/zine-svg.ts) |

脚本挂在 `SiteChrome.astro` / `ZineReaderPage.astro` 的 `<script>` 中，**不**使用 React/Vue island。

### 5.4 类型契约

| 类型 | 位置 | 不可破坏 |
|---|---|---|
| `Lang = "zh" | "en" | "ja"` | `lib/types.ts` | 顺序固定（zh 默认） |
| `Multilang = { zh; en; ja }` | 同上 | 三键齐全；缺失填同语种或 zh |
| `CountryId = "cn" | "jp" | "us"` | 同上 | v0.x 不扩；v1 想加新国先扩 token 表 |
| `Region.id` | 同上 | `[a-z0-9_]+`；与 frontmatter `region_id` 一致 |
| `Poster.slug` | 同上 | `[a-z0-9_]+`；与 PNG 文件名前缀一致 |

---

## 6 · 静态资源

**单源**：仓库根 `asserts/`（全部 PNG 已按 [docs/ASSETS.md](../../docs/ASSETS.md) 入库）。

**接入 web/ 的方式**：`web/public/asserts` 是一个 NTFS junction，指向 `../../asserts`。

```powershell
New-Item -ItemType Junction -Path "web\public\asserts" -Target "..\asserts"
```

| 项 | 决定 |
|---|---|
| URL prefix | **必须**用 `/asserts/...`（Astro 不重写） |
| 文件路径里的空格 | 用 `encodeURI()` 包整段（如 `Gourmet recipe2/` 会被编码为 `Gourmet%20recipe2/`） |
| Git 跟踪 | junction 已 `.gitignore`；切机器后需重建 |
| macOS / Linux | 用 `ln -s ../../asserts web/public/asserts`（功能等价） |
| CI / 部署 | build 前的钩子需要重建 link **或** 改为构建期 copy（v0.6 部署时决定） |

**禁止**：

- 把 `asserts/` 内的 PNG 复制进 `web/public/asserts/` 当真实文件提交
- 在 `web/` 内自建第二份 asset 目录

---

## 7 · i18n

### 7.1 路径式 locale（v0.3 ✅）

| 语言 | URL 示例 |
|---|---|
| 中文（默认） | `/`、`/cn/hainan` |
| English | `/en/`、`/en/cn/hainan` |
| 日本語 | `/ja/`、`/ja/cn/hainan` |

`astro.config.mjs` 启用 Astro i18n（`prefixDefaultLocale: false`）。页面体在 `src/views/`，`pages/` 与 `pages/en|ja/` 为薄包装；链接用 `src/lib/locale-path.ts` 的 `localePath()` / `switchLocalePath()`。

- 组件仍接 `lang: Lang` props，调 `t(multilang, lang)`
- 页面语言：`resolveLang(Astro.currentLocale)`
- `<html lang>` 由 `HTML_LANG[lang]` 同步

**遗留 `?lang=`**：开发时 `middleware.ts` 302；静态部署时 `Base.astro` 内联脚本同等重定向。

### 7.2 历史（v0.1–v0.2）

曾用 `?lang=` + `prerender = false`（hybrid SSR）。v0.3 已移除。

### 7.3 文案规范

| 来源 | 谁负责 |
|---|---|
| **UI 文案**（按钮、栏目名、空态） | `src/lib/i18n.ts` 的 `UI` 对象；改这里需三语齐改 |
| **内容文案**（菜名、tagline、tag） | `src/lib/posters.ts` `countries.ts`，v0.2 后改为 md frontmatter |
| **品牌文案**（brand、tagline） | `src/lib/i18n.ts` 引自 [BRAND.md](../../BRAND.md)，**禁止**临时改写；改先 PR BRAND.md |

---

## 8 · 主题切换

| 触发 | 实现 |
|---|---|
| `<html data-country="cn">` | 默认（红 + 米白） |
| `<html data-country="jp">` | 黑底霓虹（红 + 品红 + 青绿） |
| `<html data-country="us">` | Diner 蓝黄米白 |

变量定义全部在 `src/styles/tokens.css`。**组件不能写死颜色**，必须用 `var(--primary)` 等。

主题与字体绑定：CN 用 Noto Serif/Sans SC，JP 用 Noto Serif/Sans JP，US 用 Roboto Slab + Inter + Lobster。字体栈在 tokens.css 里随 `--font-display/--font-body/--font-en-display` 切换。

详见 [FRONTEND-STYLE.md §3](FRONTEND-STYLE.md#3--颜色与字体)。

---

## 9 · 构建脚本

| 命令 | 用途 |
|---|---|
| `npm run dev` | dev server @ `http://127.0.0.1:4321/` |
| `npm run check` | `astro check`；提交门槛 = 0 errors |
| `npm run build` | 静态站 → `dist/`（**261 页**，v0.5；含 `search-index.json` 与 zine/poster/street 三语镜像） |
| `npm run preview` | 本地静态预览 `dist/` |

---

## 10 · 部署（v0.6 决策）

候选：

| 平台 | 适配器 | 注意 |
|---|---|---|
| **Vercel** | `@astrojs/vercel` | hybrid 友好；asserts/ 需构建期 copy 或 R2/S3 |
| **Cloudflare Pages** | `@astrojs/cloudflare` | edge runtime；junction 需 copy 步骤 |
| **静态 + CDN**（推荐） | 无 | v0.3 SSG 已就绪；v0.6 定 CDN 与 copy 步骤 |

在 v0.6 选型前 **不要** 加 SSR 适配器或上线生产。

构建时可通过环境变量设置正式域名（影响 canonical / sitemap / OG 绝对 URL）：

```bash
SITE_URL=https://your-domain.example npm run build
```

默认回退：`https://streetcornerfoodie.example`（见 `astro.config.mjs`）。

---

## 11 · 编码约定（务必）

| 项 | 规则 |
|---|---|
| TS 风格 | strict 全开；`any` 仅在第三方边界临时用并加 `// TODO` |
| 命名 | 文件 `kebab-case.ts`、`PascalCase.astro`；导出符号 `camelCase` / `PascalCase` |
| 默认导出 | 仅 Astro 组件可（`.astro`）；`.ts` 一律 named export |
| 副作用 | `lib/*.ts` 必须**纯**（无 fetch、无 fs、无 window）；副作用放 `pages/` 顶部 |
| 注释 | 不重复代码；解释**为什么**或者**约束**，禁止 narrate-the-code |
| 控制台 | 不留 `console.log`；调试用 `console.debug` 并在 PR 前删 |
| 提交 | conventional commits；`scf:` / `web:` / `docs:` / `style:` / `fix:` |
| commit 体内引用 | 改了规则/品牌时引 [BRAND.md](../../BRAND.md) 或本文件章节号 |

---

## 12 · 不变量（任何改动都必须保持）

1. **三语等价**：每一条 UI / 内容文案都有 `zh/en/ja` 三个键；缺失填回 zh
2. **三主题等价**：每加一个新组件 CSS 都必须在三个 country 下视觉合理
3. **资源单源**：所有 PNG 只在 `/asserts/` 下，不复制副本
4. **路径无空格泄漏**：`Gourmet recipe2` 这种空格必须 `encodeURI()`
5. **品牌名硬性**：UI 上的 brand 文字三语必须是 `Street Corner Foodie / 街角食客 / 街角フーディー`；改动需先动 [BRAND.md](../../BRAND.md) 与 [scf-brand.mdc](../../.cursor/rules/scf-brand.mdc)
