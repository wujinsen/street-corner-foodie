# 德国 · 莱茵河 · 街景原型

> 画风 [street-view-diorama.md](../style/street-view-diorama.md)。入库 `asserts/Street View/de/cologne/`。  
> 国家总览 → [germany.md](germany.md)

## 场景索引

| slug | 中文 | 美食重点 |
|------|------|----------|
| `rhine_river` | 莱茵河·科隆河滨 | Bratwurst、Currywurst、Brezel、Kölsch 啤酒、Biergarten |
| `altstadt` | 科隆老城（规划） | Himmel un Ääd、Reibekuchen、Kölsch Kneipe |
| `frankfurt` | 法兰克福·美因（规划） | Apfelwein、Handkäse、Bratwurst |

## 莱茵河 · `rhine_river`

### 区位

**科隆·莱茵河滨（Rheinuferpromenade / Köln Altstadt-Süd）** — 河滨步道为前景，**Kölner Dom（科隆大教堂）** 双塔为画面主地标；**Hohenzollernbrücke** 铁桥、河面游船、对岸 **Rheinauhafen** 起重机轮廓（远景可选）。

| 项 | 说明 |
|----|------|
| **构图主语** | **莱茵河（Rhein）水面**占画面 **~50%**，为视觉终点；大教堂/铁桥/美食/人物为陪衬 |
| 视角 | **偏高俯视** 等距微缩（对齐 `haikou_wanlv_night_wide`）；三层景深 |
| 地标 | 宽阔河面、**Hohenzollernbrücke** 铁桥、对岸 **Kölner Dom** 双塔（远景较小） |
| 气质 | 河滨夜景 + 水面冷蓝反光 + 对岸暖金投光；**非**香肠摊占满前景 |
| 语言 | 店招 **德文为主**（小摊即可） |

### 构图分层（night_wide · 必遵）

| 层 | 占比 | 内容 |
|----|------|------|
| **前景** | ~15% | 科隆河滨窄步道、**小** Bratwurst/Biergarten 摊、Q 版行人 |
| **中景（主）** | **~50%** | **River Rhine** 宽阔河面、倒影、游船、铁桥拱 |
| **远景** | ~25% | 科隆大教堂 + Rheinauhafen 天际线（空气透视、略小） |

### 当地美食（生成须突出）

| 美食 | 街景表现 |
|------|----------|
| **Bratwurst** 烤肠 | 香肠摊铁盘、mustard 瓶、「Bratwurst · Currywurst」灯箱 |
| **Currywurst** 咖喱肠 | 纸盘 + curry 酱、小摊蒸汽 |
| **Brezel** 碱水结 | 挂架大 brezel、纸袋 |
| **Kölsch** 科隆啤酒 | Biergarten 矮杯 Kölsch、「Kölsch · Reissdorf」招牌 |
| **Fischbrötchen** 鱼 sandwich | 小窗「Fischbrötchen」（北德河滨符号，可选） |

### 三景别要点

| 景别 | 画面要点 |
|------|----------|
| day_wide | 莱茵河滨 + 大教堂全景 + Bratwurst 摊 + Q 版游客 |
| night_wide | **河面占半幅** + 铁桥 + 对岸 Dom 远景 + 河滨小摊/chibi（万绿园式景深） |
| day_standard | 前景 Bratwurst 或 Brezel 摊，背景大教堂一角 |

### 招牌示例（德文）

Rhein、Bratwurst、Biergarten、Kölsch、Brezel、Köln、Dom

### 禁忌

- 无饮食的空河滨明信片  
- **整排香肠摊占满前景**（河非主语）  
- 海报风巨型 Bratwurst 占满画面  
- 中文/英文主招牌（**德文为主**）  
- 海南骑楼、东京霓虹主调

## 命名与目录

`de_cologne_{slug}_{day|night}_{wide|standard}[_no_char].png`  
→ `asserts/Street View/de/cologne/`
