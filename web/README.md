# web/ · Street Corner Foodie (Astro)

> 街角美食 · Web 应用骨架。基于 [Astro 4](https://astro.build/)，零运行时框架依赖，TypeScript 严格模式。

## 启动

```bash
cd web
npm install          # 已装过则跳过
npm run dev          # http://127.0.0.1:4321
```

首启会自动生成 `.astro/` 类型缓存。

## 关键约定

| 项 | 决定 |
|---|---|
| 国家主题 | 由 `<html data-country="cn|jp|us">` 触发，对应 `src/styles/tokens.css` 三组 CSS 变量 |
| 三语 | 路径式 locale：`/`（zh）、`/en/...`、`/ja/...`；`?lang=` 仅兼容重定向 |
| 内容文档 | `web/docs/` 是仓库根 `docs/` 的 NTFS junction（可选；loader 亦可直接读 `../../../docs/`） |
| 静态资源 | `public/asserts/` 是仓库根 `asserts/` 的 NTFS junction，**勿提交**到 git |
| 渲染模式 | `output: "static"` + Astro i18n（`npm run build` → `dist/`） |
| 数据源 | `load-content.ts` 读 `docs/**/*.md` frontmatter；菜名 overlay 见 `poster-meta.ts` |

## 目录

```
src/
  layouts/Base.astro          # html shell + topbar + footer
  components/
    BrandMark.astro            # SVG logo mark
    Topbar.astro               # 国家·语言切换
    PosterCard.astro           # 海报卡
  lib/
    types.ts                   # Lang / Multilang / Country / Region / Poster
    i18n.ts                    # UI 字符串 + t() 帮手
    locale-path.ts             # localePath / switchLocalePath
    url.ts                     # legacy ?lang= 重定向
    countries.ts               # COUNTRIES / REGIONS（cn jp us）
    posters.ts                 # POSTERS（cn 真实 / jp placeholder）
  views/                       # 共享页面体
  pages/
    index.astro                # /
    [country]/…                # /cn …
    en/ …  ja/ …              # /en/… /ja/…
  styles/
    tokens.css                 # 三国主题 CSS 变量
    base.css                   # reset + typography
    components.css             # topbar / hero / poster-card / filter-rail
docs/
  FRONTEND-STYLE.md            # token / 字号 scale / 首页·阅读器作用域
public/
  favicon.svg
  asserts/                     # → junction to ../../asserts/
```

## 可用路由

| URL | 说明 |
|---|---|
| `/` | 全球落地（zh） |
| `/en/` `/ja/` | 全球落地（en / ja） |
| `/cn` `/jp` `/us` | 国家区域列表 |
| `/en/cn/hainan` | 海南海报 · English UI |
| `/cn/hainan?char=no` | 海报无人物版本 |
| `/cn/hainan?flavor=椰香` | 风味筛选（v0.2 真过滤） |
| `/cn/hainan?lang=en` | 302 → `/en/cn/hainan`（兼容） |

构建与预览：

```bash
npm run build
npm run preview    # http://127.0.0.1:4321
```

## 接下来（见 [docs/ROADMAP.md](docs/ROADMAP.md)）

- v0.4：单菜详情 + 街景探索
- v0.5：mini-zine 翻页 + 搜索（首个 island）
- v0.6：部署 / CI / 性能

## Brand

详见仓库根 [`BRAND.md`](../BRAND.md) 和规则 [`.cursor/rules/scf-brand.mdc`](../.cursor/rules/scf-brand.mdc)。
