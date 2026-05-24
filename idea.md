
# Street Corner Foodie · 项目想法簿

> 项目名称已定（2026-05-18）：**Street Corner Foodie / 街角食客 / 街角フーディー**。详见 [BRAND.md](BRAND.md)。

---

## 最初灵感

设计高保真产品 UI，先出图我看看。

我要做的是展示美食和街景，城市风貌，要做全世界的，国家 → 省 → 市等等，不同国家的风格可能不一样，目前考虑中美日。

做的图片主要在 `D:\work\moli_project\meishi\asserts` 目录下。

你帮我归化产品设计、功能、想法，然后出高保真产品 UI 我看下；先出三个版本的 UI 看下。

继续设计图片，这回我想看到那三个目录下的图片是如何展示的，当然要包括设计功能和内容。

---

## 已决策

| 项 | 决定 |
|----|------|
| 项目名 | Street Corner Foodie（英）/ 街角食客（中）/ 街角フーディー（日） |
| 三类资产 | 海报 `Gourmet recipe2/` · 小志 `mini-zine/` · 街景 `Street View/` |
| 行政层级 | 国家 → 省/都府/州 → 市/区 |
| 主题切换 | CN 朱红 / JP 墨红霓虹 / US 蓝黄 Diner（CSS 变量驱动） |
| 三语 | zh-CN / en / ja，`data-zh/en/ja` 属性同步 |
| Prototype | `index.html`（单文件，零依赖） |
| **Web 应用栈**（2026-05-18）| **Astro 4 + TypeScript strict + 原生 CSS**，无 UI 框架、无 Tailwind；详见 [web/docs/ARCHITECTURE.md](web/docs/ARCHITECTURE.md) |
| **渲染模式** | `output: "static"` + Astro i18n 路径前缀（v0.3 ✅）；`?lang=` 仅兼容重定向 |
| **资源接入** | `web/public/asserts` 是 `asserts/` 的 NTFS junction（已 gitignore） |
| **工程规范**（2026-05-18）| [ARCHITECTURE.md](web/docs/ARCHITECTURE.md) · [FRONTEND-STYLE.md](web/docs/FRONTEND-STYLE.md) · [ROADMAP.md](web/docs/ROADMAP.md)，自动加载规则 [scf-web.mdc](.cursor/rules/scf-web.mdc) |
| **Web v0.5**（2026-05-18）| 小志阅读器 · 全局搜索 · localStorage 收藏；`web/` 版本 `0.5.0` |

## 当前进度

| 里程碑 | 状态 | 备注 |
|--------|------|------|
| v0.1 骨架 | ✅ 完 | `/` `/cn` `/cn/hainan` `/jp/tokyo` `/us` 全通；8 张海南海报 + 8 张东京 placeholder |
| v0.2 数据单源 + 真过滤 | ✅ 完 | `load-content.ts` + `poster-meta.ts` overlay；`?flavor=` 真筛选 |
| v0.3 路径式 i18n + SSG | ✅ 完 | `/en/cn/hainan`、`/ja/...`；`locale-path.ts` + `pages/en|ja/` |
| v0.4 单菜详情 + 街景探索 | ✅ 完 | `/poster/[slug]`、`/street/[scene]`；`streets.ts` + 风味雷达 |
| v0.5 mini-zine 翻页 + 搜索 + 收藏 | ✅ 完 | `ZineReaderPage` + `/search-index.json` + `scf_favs`；261 页 SSG |
| v0.6 性能 / 部署 / CI | 待开 | 部署平台未定 |
| v1.0 公开发布 | 待开 | 内容广度驱动 |

待决策见 [BRAND.md](BRAND.md) 末尾的"名称迁移清单"与 [web/docs/ROADMAP.md](web/docs/ROADMAP.md) v1.1+ 候选池。
