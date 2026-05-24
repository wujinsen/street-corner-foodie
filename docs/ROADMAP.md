# web/ · 路线图

> Street Corner Foodie · Web 应用从 v0.1 → v1.0 的演进计划。 
> 每个里程碑都有：**目标 / 范围 / 验收 / 不做**。改路线先 PR 本文。

---

## v0.1 · 骨架 ✅（已完成 2026-05-18）

**目标**：跑通最小可用版本，让原型 `index.html` 的数据落地到真实 Astro 路由。

**范围**：

- Astro 4 + TS strict
- 三国主题 token 与字体栈
- 三语 UI（`?lang=` 服务端切换）
- 三条路由：`/` · `/[country]` · `/[country]/[region]`
- 海口 8 张真海报 + 东京 8 张 placeholder
- asserts NTFS junction
- `astro check` 全绿

**验收**：所有 6 个示例 URL 返回 200，`<html lang>` / `data-country` 正确切换。✅

**不做**：

- 单菜详情页 / mini-zine / 街景
- 路径式 i18n
- 任何 island / JS 交互
- 部署

---

## v0.2 · 数据单源 + 真过滤 ✅（2026-05-18）

**目标**：把内容数据从 `lib/*.ts` 硬编码迁到 `docs/**/*.md` frontmatter；UI 上的风味 chip 真做过滤。

**范围**：

1. `src/lib/load-content.ts` 用 `import.meta.glob` + `gray-matter` 在构建期读：
   - `docs/china/hainan.md` `shijiazhuang.md` `zhejiang.md`
   - `docs/world/japan.md` `usa.md`
2. 定义 region/poster/zine/street 的 **frontmatter schema**（在本文档登记，与 `docs/ASSETS.md` 互不重叠）
3. `posters.ts` 改成纯 re-export 接口；旧硬编码删
4. 风味 chip：`?flavor=X` 过滤海报 `.tags[lang].includes(X)`
5. `?char=no` 真切换 `fileNoChar`（已可用，复检）
6. 增加 `region.editor_pick: string[]`（slug 列表），首屏置顶

**新增依赖**：`gray-matter`（约 30KB）

**验收**：

- `lib/posters.ts` 没有硬编码菜品；新增菜只动 md 不改 ts ✅（菜名 overlay 仍见 `poster-meta.ts`）
- `/cn/hainan?flavor=椰香` 只剩清补凉、椰子鸡 ✅（2/18 ITEMS）
- 三语风味文案完整（缺则 fallback 到 zh）✅

**不做**（仍有效）：

- 路径式 i18n（仍 `?lang=`）
- 详情页
- 菜名三语完全迁入 md（**v0.2.1 ✅** `web_posters:` + `lookup-poster-meta.ts`）

---

## v0.3 · 路径式 i18n + 回归 SSG ✅（2026-05-18）

**目标**：URL 改成 `/en/cn/hainan` 形式；所有页面回 SSG；为静态部署铺路。

**范围**：

1. `astro.config.mjs`:
   ```js
   i18n: {
     defaultLocale: "zh",
     locales: ["zh", "en", "ja"],
     routing: { prefixDefaultLocale: false },
     fallback: { en: "zh", ja: "zh" },
   }
   ```
2. 文件路由迁移：
   - `pages/index.astro` → 同
   - `pages/[country]/[region]/index.astro` → 用 `Astro.currentLocale` 替换 `readLang(url)`
   - **实现**：`pages/en/`、`pages/ja/` 镜像薄包装 + 共享 `src/views/*`；默认语 `zh` 无前缀
3. 移除所有 `prerender = false`；恢复 `output: "static"`
4. `getStaticPaths` 多乘以 locale 维度
5. Topbar 语言切换链接更新（生成 `/en/...` 而非 `?lang=en`）
6. 老 URL `?lang=en|ja`：`src/middleware.ts`（dev）+ `Base.astro` 内联脚本（静态 `preview`/CDN）302 → 路径式 locale

**验收**：

- `npm run build` 成功（无 adapter 需求）✅ — 36 页
- 静态产物在 `dist/` 下有 `index.html`、`en/`、`ja/`、`cn/hainan/index.html` 等 ✅
- `npm run preview` 静态服务 `/`、`/en/cn/hainan`、`/ja/jp/tokyo` 均 200 ✅

**不做**：

- 详情页（推到 v0.4）

---

## v0.4 · 单菜详情 + 街景探索 ✅（2026-05-18）

**目标**：完成原型 `index.html` 还没搬上来的两个关键页面。

### 4.1 单菜详情 `/[lang]/[country]/[region]/poster/[slug]`

| 区域 | 内容 |
|---|---|
| 顶部 hero | 海报大图（with/no_char 切换）+ 三语菜名 + pin |
| 信息卡 | tags、产地、tagline、风味雷达图 |
| 同地区相关 | 4 张同 region 海报 |
| mini-zine 入口 | 跳 zine 阅读器 |
| 街景关联 | 关联场景缩略图（如文昌鸡 → 府城） |

### 4.2 街景探索 `/[lang]/[country]/[region]/street/[scene]`

| 区域 | 内容 |
|---|---|
| 主图 | 当前 day/night × wide/standard 街景 |
| 切换 | `?time=day|night` `?frame=wide|standard` |
| 同地区场景 | 横向滚动缩略图 |
| 当地美食 | 该场景对应的 3-4 道菜海报 |

**新增**：

- `src/lib/streets.ts`（v0.2 之前先硬编码，v0.5 接 md）
- 性能：街景 PNG 需走 `<picture>` + AVIF；首屏走 fetchpriority="high"

**验收**：

- 任一菜 → 详情页有 mini-zine 跳转 ✅（链至 `/zine/[slug]` 占位，v0.5 阅读器）
- 任一街景 → 时段/画幅切换瞬时（< 100ms 视觉）✅（全组合 `prefetch` + 纯链接切换）
- 详情/街景三主题 + 三语都通 ✅
- `npm run build` → **213 页**（含 `/poster/` `/street/` `/zine/` 三语镜像）

---

## v0.5 · mini-zine 翻页 + 搜索 + 收藏 ✅（2026-05-18）

**目标**：原型里 lightbox / 收藏 / 搜索叠加层 全部上线，开始引入轻量 island。

### 5.1 mini-zine 阅读器 `/[lang]/[country]/[region]/zine/[slug]`

- 两列翻页（story 4 页 + recipe 4 页）
- 键盘 ←→ 翻页（**第一个 JS island**）
- ?mode=story|recipe 切换
- ?char=with|no 切换
- Tokyo placeholder zine 仍用 SVG 渲染（同原型）

### 5.2 搜索 `Cmd/Ctrl+K` 覆盖层

- 客户端预加载索引 JSON（构建期生成）
- 实时筛 menu / region / scene
- 全局可用（Topbar 加 search button）

### 5.3 收藏（localStorage）

- 海报卡 ♡ 按钮
- 右侧抽屉列表
- 跨设备需登录—— **不做**（v1+ 再说）

**island 预算**：≤ 15 KB（gzip），单 island 为 zine 翻页。搜索用 Astro 的 client-only 加 vanilla JS（不引框架）。

**验收**：

- 小志阅读器：`ZineReaderPage.astro` + `zine-reader.ts`（`?mode` `?char` `?page` + 键盘 ←→）✅
- 搜索：`/search-index.json` 构建期生成 + Topbar `Cmd/Ctrl+K` + `SiteChrome` 覆盖层 ✅
- 收藏：海报卡 ♡ + `localStorage` 键 `scf_favs` + 右侧抽屉 ✅
- 东京 placeholder zine：`zine-svg.ts` SVG 页（无 PNG 时）✅
- `npm run build` → **261 页**（含全部 zine 静态路径 × 三语）✅
- `astro check` 0 errors ✅
- Lighthouse Performance 桌面 ≥ 95 — **v0.6 CI 再测**（本里程碑未跑 Lighthouse）
- 关 JS 后基本浏览仍可用（zine 键盘翻页、搜索、收藏抽屉除外）✅

**实现备注**：

- 小志 slug 列表由 `load-content.ts` 解析 md `mini_zine`；阅读器页内 `<script>` 注入键盘逻辑（非 `client:*` island，仍零框架）
- 搜索 / 收藏为 `SiteChrome.astro` 内联 `<script>` + `site-chrome.ts`（vanilla JS）
- 编码修复：`repair-utf8.py` 已删除；数据文件可从 `index.html` 经 `web/scripts/generate-*.py` 再生

---

## v0.6 · 视觉对齐 · alt-c Modern Atlas（✅ 收尾 2026-05-20）

**目标**：把 web/ 的 UI 从 v0.5 "图鉴 v1" 切换到 `design/alt-c/` 现代探索 App 视觉系。 
**视觉真源**：[`design/alt-c/`](../../design/alt-c/) + [`design/alt-c/light/`](../../design/alt-c/light/) + [`design/alt-c/README.md`](../../design/alt-c/README.md)。

**稿图 PNG（对色用，仓库内已有）**：

| 文件 | 对应 Web | 典型路由 |
|------|----------|----------|
| `landing.png` | 首页 `HomePage` | `/` |
| `theme-cn.png` · `theme-jp.png` · `theme-us.png` | 国家总览 `CountryPage`（`mode=overview`）+ 三国 token | `/cn/` · `/jp/` · `/us/` |
| （无单独稿图 · 省内书柜） | 国家·省海报柜 `CountryPage`（`mode=region`） | `/cn/g/hainan/` 等 |
| `gallery.png` | 区域书柜 `RegionPage` | `/cn/hainan/` |
| `zine-reader.png` | `ZineReaderPage` | `/cn/hainan/zine/{slug}/` |
| `street-explorer.png` | `StreetPage` | `/cn/hainan/street/{scene}/` |
| `mobile.png` | 移动端走查 |
| `light/landing.png` · `light/gallery.png` | 亮色主题 `data-theme=light` | 
**不变量**：v0.5 不变量（三语 / 三主题 / 资源单源 / 零 JS 默认）全部保留；新增「**dark / light 双主题**」第四不变量。

### 6.0 总策略

| 项 | 决策 |
|---|---|
| 旧组件 | **保留**到对应页面被 v0.6.x 重写为止，期间共用同一 Topbar / Footer |
| 新组件 | 走新 token（`--bg-1` `--tile-bg` `--fg-strong` `--accent`），与 v0.5 token 并存 |
| 主题切换 | `<html data-theme="dark|light" data-country="cn|jp|us">` 两轴正交；FOUC 防闪烁内联脚本 |
| `data-country` 旧 surface 翻转 | **保留**给 v0.5 老页面；新页面只用 accent 维度，背景由 theme 决定 |

### 6.1 子里程碑

| ID | 范围 | 状态 |
|---|---|---|
| **v0.6.0** | 主题基建（tokens 双轴 + ThemeToggle + Base 注入）+ 玻璃 Topbar 重做 + 首页 landing 重做 + 4 个基础新组件（GlassTile / BentoGrid / BottomDock / GlassPill） | ✅ |
| v0.6.1 | 国家页 + 区域页 gallery（玻璃 hero + 4 列 Bento 菜卡 + 右侧今日推荐 sticky rail） | ✅ |
| v0.6.2 | mini-zine 阅读器玻璃幻灯版（左右滚 + thumbs + 三段 toolbar） | ✅ |
| v0.6.3 | 街景探索全屏暗色版（top chip + 左 scenes + 右 matrix + 底部 Eat Here） | ✅ |
| v0.6.4 | 移动端打磨（bento 单列 / dock 全宽 / 主题 toggle 移到设置入口） | ✅ |
| v0.6.5 | 三国主题变体（CN 灯笼红 · JP 霓虹 · US Diner Cyan）；同时通过 dark+light 双主题 | ✅（light 国家光晕 + 国家页 hero；稿图级对色可继续迭代） |
| v0.6.6 | 国家页 `theme-cn/jp/us` 全国海报网格（筛选 Country/Province/Flavor/人物 + 4 列 bento + 右侧 Tonight's Featured + 下方地区入口） | ✅ |
| v0.6.7 | 街景 MATRIX+EXPORT+地理小地图；小志左右 sticky+下载；国家页顶栏 Tab 锚点；扩省 jiangsu/guangdong/sichuan/beijing（china.md） | ✅ |
| v0.6.8 | 国家书柜顶栏 **地图** Tab（`#map` · ECharts 科幻点阵陆地 + pin 涟漪 · `land-particles.json` · 点击进 `#streets?scene=`） | ✅ |

### 6.2 v0.6.0 验收

- [x] `npm run check` 0 errors / 0 warnings
- [x] 首页 `/`、`/en/`、`/ja/` 在 `dark`/`light` × `cn`/`jp`/`us` 6 组合下均无视觉崩（人工走查；稿图级像素待续）
- [x] 切换主题 1) 即时生效；2) 不闪白（FOUC 防护到位）；3) 刷新后记忆；4) `⌘⇧L` / `Ctrl+Shift+L` 快捷键；5) 移动端 Dock「设置」面板
- [x] 玻璃 Topbar 在所有 alt-c 页面渲染
- [x] 关 JS 后 landing 仍可阅读（dock / 搜索 / 主题切换降级为不可点，但页面信息完整）

### 6.3 延后项（2026-05-20 收尾）

| 项 | 状态 |
|---|---|
| 真实交互地图（`WorldMapHero` · 大陆 hover · pin 预览 · 方向键） | ✅ |
| 玻璃 hover 光标高光 + 微倾斜（`glass-tile-shine` · `GlassTile` / 海报 / 区域卡 glint） | ✅ |
| 国家页 hero 顶栏 ribbon（CN/JP/US 三语） | ✅ |
| 书柜首格 `FEATURED` 角标（`GlassPosterCard`） | ✅ |
| 亮色主题地图弱化光晕（`data-theme=light`） | ✅ |
| alt-c 冒烟回归（`npm run test:altc` · CI `scf-web.yml`） | ✅ |
| `design/alt-c` 稿图级像素对色 | ✅ 首轮（`alt-c-refine.css` 对照全稿；可继续人工微调） |

---

## v0.7 · 性能、部署、CI

**目标**：决定部署形态，跑稳上线。

### 6.1 图片管线 ✅（2026-05-19）

| 来源 | 输出 |
|---|---|
| `asserts/**/*.png` | 构建期 `sharp` → `public/scf-img/{hash}/{w}.avif/webp` + PNG fallback |

实现：`npm run images` · [ScfPicture.astro](../src/components/ScfPicture.astro) · [optimize-images.mjs](../scripts/optimize-images.mjs) · manifest `web/.scf-image-manifest.json`。衍生品不入 git（`public/scf-img/` gitignore）。

### 6.2 部署候选评估

| 平台 | 评分 | 备注 |
|---|---|---|
| Cloudflare Pages | ★★★ | 边缘 + 0 trafic 费；asserts CDN 表现好 |
| Vercel | ★★ | 配置简单；图片生成可走 ISR |
| 自建 nginx | ★ | SSG 直挂；但 PNG 大需 CDN 前置 |

选 **Cloudflare Pages**（见 [DEPLOY.md](DEPLOY.md) · `public/_headers` 缓存）✅

### 6.2b 自动部署 ✅（2026-05-20）

- Workflow：[`.github/workflows/deploy-cloudflare.yml`](../../.github/workflows/deploy-cloudflare.yml)
- 项目名：`street-corner-foodie` · [wrangler.toml](../wrangler.toml)
- **main / tag `v*`** → production（`SITE_URL` = GitHub variable，默认 `https://streetcornerfoodie.com`）
- **PR** → preview 部署（`pr-<n>` 分支）
- 正式域名：在 Cloudflare Pages 绑定 `streetcornerfoodie.com`（见 DEPLOY.md）

### 6.3 CI

- GitHub Actions：`npm run sync:web-posters` + `npm run check` + `npm run build`（见 `.github/workflows/scf-web.yml`）✅
- Lighthouse CI（`npm run lhci` · [lighthouserc.cjs](../lighthouserc.cjs)）✅
- main 推 → 自动部署 production ✅（需配置 Cloudflare secrets）
- tag 推 → 生产部署 ✅

### 6.4 监控

- 简易日志（platform 提供即可）
- 不引第三方 analytics（隐私优先；如需 v1 再选 Plausible 自托管）

---

## v1.0 · 内容扩展 + 公开发布

**目标**：稳定可宣发版本。

### 7.1 内容广度

| 增项 | 数量目标 |
|---|---|
| 中国省份 | ≥ 8（增川、粤、苏、闽、新等） |
| 日本地区 | ≥ 5（关西、九州、东北、北海道、富士） |
| 美国地区 | ≥ 5（NY、TX、LA、Cajun、PNW） |
| 海报 | ≥ 80（含 no_char 套） |
| 街景 | ≥ 60 场景（3 张矩阵） |
| zine | ≥ 50 套 |

详细排期跟 `docs/china/*.md` 与生成 skill 联动。

### 7.2 品牌可见

- 自定义域名（待定）
- favicon 主题色随 `data-country` 切换（PWA manifest）
- OG 卡 + sitemap.xml + robots.txt（构建期生成）— **部分 ✅ 2026-05-19**
  - `src/lib/site-urls.ts` · `pages/sitemap.xml.ts` · `pages/robots.txt.ts`
  - `Base.astro` canonical + OG/Twitter；海报详情 `ogImage` 用海报图
  - 首页地图 `#map-hero` + 三国 pin 链到 `/cn` `/jp` `/us`；Dock「地图」→ `/#map-hero`
  - ✅ zine/街景详情 OG（当前帧图）；按国 favicon + `manifest.webmanifest` + `theme-color`
  - `SITE_URL` 环境变量覆盖 `astro.config` `site`（部署时设正式域名）
  - 国家/区域页 OG + hero 回退（`region-hero.ts`）
  - Web `us/la` 区域名已改为 **洛杉矶**（与 `Street View/us/la/` 一致）
  - 小志 ↔ 街景关联（`DISH_STREET_SCENE`）；仅 zine 的菜不显示「海报」按钮
  - ✅ manifest 多国图标 + 三国 shortcuts（`manifest.webmanifest`）
  - ✅ Cajun **新奥尔良** `us/nola` region（街景 9 张 · gumbo/beignets 海报）

### 7.3 开放贡献

- ✅ [CONTRIBUTING.md](../../CONTRIBUTING.md) · Issue 模板 **Submit a dish**
- "Submit a Dish" 表单（GitHub Issue 模板，提交者提供描述 + 参考链接，生成走 image MCP）✅
- 译者通道（en/ja 校对）

---

## v1.1+ · 候选探索（未决）

只做选项池，**不承诺**：

- 用户账号 / 收藏云同步
- 浏览历史时间线（"今天我看了哪些菜"）
- 视频 / 短动画街景
- 第四个国家（候选：KR / IT / TH / VN）
- 移动端 PWA 离线缓存
- 中英双语并排 zine 模式
- 协同标注（社区添加 tag / pin）
- API（`/api/dish/[slug]`）

---

## 节奏与版本号

| 版本 | 周期目标 | 内容 |
|---|---|---|
| v0.1 | 完 | 骨架 |
| v0.2 | ~ 1 周 | md frontmatter + 过滤 |
| v0.3 | 完 | 路径式 i18n + SSG |
| v0.4 | 完 | 详情 + 街景 |
| v0.5 | 完 | zine + 搜索 + 收藏 |
| v0.6 | ~ 2 周（5 子里程碑） | 视觉对齐 · alt-c（玻璃 + bento + 双主题） |
| v0.7 | ~ 1 周 | 性能 + 部署 + CI |
| v1.0 | 内容驱动 | 取决于素材生成速度 |

**节奏原则**：每个 v0.x 不大于 2 周；超期就拆 v0.x.y。

---

## 不变量（任何版本都成立）

1. 三语 / 三主题 / 资源单源（详见 [ARCHITECTURE.md §12](ARCHITECTURE.md#12--不变量任何改动都必须保持)）
2. **零 JS 默认**；island 单独审批
3. **不引 UI 框架**；要破例先改本文档
4. 任何路由都能直链分享（state 必须可序列化进 URL）
5. 任何海报 / 街景 / zine 都可以单独不存在而不破坏页面（占位优雅）
