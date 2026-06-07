# 美食图鉴 · 文档索引

> **GitHub 仓库主页**展示的是根目录 **[../README.md](../README.md)**（项目介绍 + 界面截图），本页为内部文档索引。

本仓库整理各地特色美食文字资料，并配合 `asserts/` 下 **三种互不混用** 的视觉资源。



## 资源分类（必读）



→ **[ASSETS.md](ASSETS.md)**：三大文件夹风格、参考图、命名、生成模板、混风格禁忌。  
→ 新/旧对话 Agent 速览：**[../AGENTS.md](../AGENTS.md)**（含下单关键词表）  
→ 入库 + 重复跳过：**`.cursor/rules/meishi-assets.mdc`**（`alwaysApply`）  
→ mini-zine 时代：**`meishi-mini-zine-era.mdc`**（`alwaysApply`）→ [mini-zine-dynasty-chibi.md](style/mini-zine-dynasty-chibi.md)  
→ 海报全流程：**`meishi-food-poster.mdc`** · **`meishi-food-poster-era.mdc`**（`alwaysApply`）→ [food-poster-ingredients.md §总览](style/food-poster-ingredients.md#新旧对话必守--海报版式总览2026-05-21)（**「一对」**：海报两张 / zine 四套；**不跨画风锁时代**）  
→ 街景矩阵 + 当地美食：**`.cursor/rules/meishi-street-view-spec.mdc`**（`alwaysApply`）  
→ **[style/](style/)**：各画风 Style Spec。



```

asserts/

├── Gourmet recipe2/    # 美食宣传海报（巨型菜 + 厨师）

├── mini-zine/          # 故事与吃法 / 做法小志

└── Street View/        # 海口街景 3D 微缩沙盘

```



## 目录结构



```

meishi/

├── docs/

│   ├── README.md          # 本文件

│   ├── ASSETS.md          # 三大风格分类（不混用）

│   ├── china/

│   │   ├── README.md

│   │   └── hainan.md      # 海南：文案 + 本省资源清单

│   └── world/

│       ├── README.md

│       ├── japan.md

│       ├── usa.md

│       ├── uk.md

│       └── france.md

└── asserts/               # 三个子文件夹，各文件夹自参照定稿

    └── README.md

```



## 文档约定



### 地区文档树（国家 → 省 → 市）

| 层级 | 路径 | 示例 |
|------|------|------|
| 国家 | `docs/world/{country}.md` | `japan.md` |
| 国家/全国 | `docs/china/china.md` | 炒饭等跨省品类 |
| 省 | `docs/china/{province}.md` | `hainan.md`、`zhejiang.md` |
| 市 | `docs/china/{city}.md` | `shijiazhuang.md`（`frontmatter` 标明 `province`） |

**资源文件**不按地区分子文件夹，见 [ASSETS.md §地区层级](ASSETS.md#地区层级与文件命名)：`asserts/` 仍只分海报 / zine / 街景三类，文件名用 `cn_hainan_haikou_*`、`jp_tokyo_ikebukuro_*` 等 geo 前缀。

### 每篇地区文档建议包含

| 区块 | 说明 |
|------|------|
| 元信息 | 地区中英文名、`type`（country / province / city）、风味标签 |
| 概览 | 地理与饮食特点 |
| 代表菜品 | 分类列表 + 简要说明 |
| 资源索引 | frontmatter + 正文表，指向 `Gourmet recipe2/`、`mini-zine/`、`Street View/` 内**文件名** |

新增：省级 `docs/china/{省拼音}.md`；市级 `{市拼音}.md`；国家 `docs/world/{国家}.md`；并在对应 README 登记。



## 已收录



### 中国



| 地区 | 文档 |

|------|------|

| 中国（全国） | [china.md](china/china.md)（炒饭、豆腐图鉴） |
| 北京市 | [china/beijing.md](china/beijing.md)（京菜图鉴） |
| 海南省 | [hainan.md](china/hainan.md) |
| 石家庄市（河北） | [shijiazhuang.md](china/shijiazhuang.md) |



### 世界



| 国家/地区 | 文档 |
|-----------|------|
| 日本 | [world/japan.md](world/japan.md) |
| 美国 | [world/usa.md](world/usa.md) |
| 英国 | [world/uk.md](world/uk.md) |
| 法国 | [world/france.md](world/france.md) |
| 德国 | [world/germany.md](world/germany.md) |
| 新西兰 | [world/newzealand.md](world/newzealand.md) |

索引 → [world/README.md](world/README.md)

