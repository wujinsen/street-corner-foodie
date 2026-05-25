# 伦敦 · 街景原型

> 画风 [street-view-diorama.md](../style/street-view-diorama.md)。入库 `asserts/Street View/united_kingdom/london/`。  
> 国家总览 → [uk.md](uk.md)

## 场景索引

| slug | 中文 | 美食重点 |
|------|------|----------|
| `thames_river` | 泰晤士河·南岸/威斯敏斯特 | fish & chips 纸袋、pie & mash、pub 招牌、afternoon tea 橱窗 |
| `east_end` | 东区（规划） | pie shop、curry house、market stall |
| `west_end` | 西区（规划） | afternoon tea、café、 theatre district snack |

## 泰晤士河 · `thames_river`

### 区位

**伦敦·泰晤士河南岸（South Bank）与威斯敏斯特对岸（Westminster Embankment）** — 河滨步道为前景，**Big Ben / Houses of Parliament** 与 **Westminster Bridge** 为对岸主地标；可选远景 **London Eye**、**Tower Bridge** 一角。

| 项 | 说明 |
|----|------|
| **构图主语** | **泰晤士河水面**占画面 40～50%，为视觉终点；建筑/人物/美食仅作河滨陪衬 |
| 视角 | **偏高俯视** 等距微缩（对齐 `haikou_wanlv_night_wide`）；三层景深：近岸步道 → 宽阔河面 → 对岸远景 |
| 地标 | 河面游船/驳岸反光；对岸 **Big Ben / Westminster**（远景较小）；**Westminster Bridge** 横贯河面；可选 **London Eye**、远天际线 |
| 气质 | 河滨夜景 + 水面冷蓝反光 + 对岸暖金投光；**非**街铺占满前景 |
| 语言 | 店招 **英文为主**（小摊即可，勿整排店面） |

### 构图分层（night_wide · 必遵）

| 层 | 占比 | 内容 |
|----|------|------|
| **前景** | ~15% | 南岸河滨步道、灯柱、**小** fish & chips / pub 窗、Q 版行人 |
| **中景（主）** | **40～50%** | **River Thames** 宽阔河面、倒影、游船、桥拱 |
| **远景** | ~25% | 议会大厦 + 伦敦眼 + 薄雾天际线（空气透视、略小） |

### 当地美食（生成须突出）

| 美食 | 街景表现 |
|------|----------|
| **Fish & chips** 炸鱼薯条 | 纸袋/报纸包装、vinegar 瓶、炸栏蒸汽、「Fish & Chips」灯箱 |
| **Pie & mash** 派薯泥 | 小店橱窗「Pie & Mash · Liquor」、派盘 |
| **Pub food** 酒吧小食 | 「The Anchor」或「Pub · Real Ale」招牌、炸物拼盘窗 |
| **Afternoon tea** 下午茶 | 茶室橱窗三层架、scone + clotted cream（小窗即可） |
| **Chicken tikka** 印度咖喱 | takeaway 窗「Curry · Tikka Masala」（伦敦移民符号，小招牌） |

### 三景别要点

| 景别 | 画面要点 |
|------|----------|
| day_wide | 泰晤士河滨 + 议会大厦全景 + fish & chips 摊 + Q 版游客 |
| night_wide | **河面占主** + 对岸 Big Ben 远景 + 桥 + 河滨小摊/ chibi 食客（对齐万绿园景深） |
| day_standard | 前景 fish & chips 或 pie 摊，背景议会大厦一角 |

### 招牌示例（英文）

River Thames、Fish & Chips、Pie & Mash、Pub、Afternoon Tea、Westminster、London

### 禁忌

- 无饮食的空河滨明信片  
- **整排店面占满前景**（河非主语）  
- 海报风巨型 fish & chips 占满画面  
- 中文/法文主招牌（**英文为主**）  
- 海南骑楼、东京霓虹主调

## 命名与目录

`uk_london_{slug}_{day|night}_{wide|standard}[_no_char].png`  
→ `asserts/Street View/united_kingdom/london/`
