# 中国 · 各省美食索引

文档层级与资源命名见 [ASSETS.md §地区层级](../ASSETS.md#地区层级与文件命名)。

## 全国层

| 文档 | 说明 |
|------|------|
| [china.md](china.md) | **跨省品类**（[炒饭](china.md#炒饭--图鉴全国)、[豆腐](china.md#豆腐--图鉴全国) 图鉴等）；海报按省 `Gourmet recipe2/cn/{省}/` |

## 省级

| 省/自治区/直辖市 | 文档 | 资源 geo 前缀 | 状态 |
|------------------|------|---------------|------|
| 海南省 | [hainan.md](hainan.md) | 海报/zine `Gourmet recipe2/cn/hainan/` · 街景 `Street View/cn/hainan/haikou/` | 已收录 |
| 浙江省 | [zhejiang.md](zhejiang.md) | 海报 `…/cn/zhejiang/` · 街景 `…/cn/zhejiang/hangzhou/` | 西湖+河坊街 各 3 张 |
| 河北省 | [hebei.md](hebei.md) | 海报/zine `…/cn/hebei/` · 街景 `…/cn/hebei/shijiazhuang/` | 已收录（板面+街景；见 [shijiazhuang.md](shijiazhuang.md)） |
| 陕西省 | [shaanxi.md](shaanxi.md) | 街景 `…/cn/shaanxi/xian/` · `cn_shaanxi_xian_` | 回民街 + 唐长安西市 各 3 张 |
| 北京市 | [beijing.md](beijing.md) | 海报 `…/cn/beijing/` · 街景 `…/cn/beijing/` | 南锣鼓巷 3 张；京菜海报 ✅ |
| **西藏自治区** | [xizang.md](xizang.md) | 海报/zine `…/cn/xizang/` · 街景 `…/cn/xizang/lhasa/` | 糌粑·酥油茶·甜茶·青稞酒海报 ✅ · 布达拉宫 night_wide ✅ |
| **新疆维吾尔自治区** | [xinjiang.md](xinjiang.md) | 海报 `…/cn/xinjiang/`（羊肉炒饭·羊肉抓饭·拉条子·馕 ✅）· zine/街景待扩 | 文案 ✅ · 4 海报 |
| **香港特别行政区** | [hongkong.md](hongkong.md) | 海报/zine `…/cn/hongkong/` · 街景 `…/cn/hongkong/`（规划） | 肠粉·奶茶·柠茶·菠萝包·咖喱鱼蛋·叉烧·烧腊饭海报 ✅ · 其余待扩 |

## 市级（隶属上表某省）

| 城市 | 所属省 | 文档 | 资源 geo 前缀 | 状态 |
|------|--------|------|---------------|------|
| 海口市 | 海南 | 见 [hainan.md](hainan.md) | 街景 `cn_hainan_haikou_` | 与省文档合一 |
| 石家庄市 | 河北 | [shijiazhuang.md](shijiazhuang.md) | `…/cn/hebei/`（海报/zine）· `Street View/cn/hebei/shijiazhuang/` | 已收录 |

> 新增：省 → `docs/china/{省拼音}.md`；市 → `docs/china/{市拼音}.md`，frontmatter 写 `province`；文件名用 `cn_{省}_{市}_` 或 `cn_{省}_`。

## 街景（全项目 · 新旧对话）

| 规则 / 文档 | 说明 |
|-------------|------|
| `.cursor/rules/meishi-street-view-spec.mdc` | `alwaysApply`：子目录入库、每场景 3 张、**当地美食**、场景原型索引 |
| [AGENTS.md](../../AGENTS.md) | 入库三步 + 规范索引表 |
| [street-view-diorama.md](../style/street-view-diorama.md) | 画风与招牌分区 |
