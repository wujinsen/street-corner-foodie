# 贡献 · Street Corner Foodie

感谢参与 **Street Corner Foodie / 街角食客** 内容或 Web 开发。

## 仓库结构

| 路径 | 说明 |
|------|------|
| `docs/china/` · `docs/world/` | 地区文档与资源表（海报 / zine / 街景） |
| `asserts/` | 海报、mini-zine、街景 PNG（**只读**输入，勿堆在画风根目录） |
| `web/` | Astro 静态站 |
| `AGENTS.md` | AI / 协作者入库规范（生成图时自动遵循） |

## 添加一道菜（海报 + 文案）

1. 在对应 `docs/*.md` 增加 `gourmet_posters` 文件名，并运行 `cd web && npm run sync:web-posters` 写入 `web_posters` 三语文案。
2. PNG 存入 `asserts/Gourmet recipe2/{cc}/{admin}/`，命名 `{slug}_poster.png` / `_poster_no_char.png`。
3. 人物海报遵 [food-poster-ingredients.md §总览](docs/style/food-poster-ingredients.md#新旧对话必守--海报版式总览2026-05-21)、[food-poster-dynasty-chibi.md](docs/style/food-poster-dynasty-chibi.md)、[meishi-food-poster.mdc](.cursor/rules/meishi-food-poster.mdc)、[meishi-food-poster-era.mdc](.cursor/rules/meishi-food-poster-era.mdc)（均 `alwaysApply`）。

## 添加街景

每场景 3 张：`day_wide`、`night_wide`、`day_standard`。见 [docs/style/street-view-diorama.md](docs/style/street-view-diorama.md) 与 `meishi-street-view-spec` 规则。

## Web 开发

读 [web/docs/ARCHITECTURE.md](web/docs/ARCHITECTURE.md)、[FRONTEND-STYLE.md](web/docs/FRONTEND-STYLE.md)、[ROADMAP.md](web/docs/ROADMAP.md)。

```bash
cd web
npm run dev
npm run check
```

## 提交菜品建议

使用 GitHub Issue 模板 **Submit a dish**（`.github/ISSUE_TEMPLATE/submit-dish.yml`），提供菜名、地区、参考链接与简述。

## 品牌

对外名称见 [BRAND.md](BRAND.md)：**Street Corner Foodie / 街角食客 / 街角フーディー**（勿写「美食图鉴」）。
