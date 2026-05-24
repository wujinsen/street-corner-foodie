# 北京南锣鼓巷 · 街景原型

> 画风 [street-view-diorama.md](../style/street-view-diorama.md)。入库 `asserts/Street View/cn/beijing/`。

## 命名

`cn_beijing_nanluoguxiang_{day|night}_{wide|standard}[_no_char].png`

## 场景 `nanluoguxiang`

| 项 | 内容 |
|----|------|
| 区位 | **东城区南锣鼓巷** 南北向胡同主巷；灰砖四合院墙、红门、槐树荫 |
| 地标 | 巷口牌坊「南锣鼓巷」、青砖影壁、可远景 **钟鼓楼** 轮廓 |
| 美食 | **糖葫芦**、**炸酱面**（小馆招牌）、**豌豆黄/驴打滚**、**老北京酸奶**、**爆肚**（摊档）；碗碟蒸汽，非巨型海报主菜 |
| 招牌 | 南锣鼓巷、北京味道、炸酱面、糖葫芦、爆肚 |
| 气质 | 胡同市井 + 旅游小吃街；**画风校准** `haikou_qilou_day_wide.png`（密度、铺面、桌边 chibi、95% 满幅） |
| 材质 | **哑光**：青砖/石板地面 **禁** 镜面湿反光、油腻高光；Q 版 **哑光手办漆**（禁塑料油光肤） |
| 构图 | **街口等距微缩**（同骑楼），禁空旷鸟瞰、禁仅三五人 |
| **Web 矩阵** | 定稿 **3** 张（`day_wide` / `night_wide` / `day_standard`）；UI 黎明/黄昏/黄昏宽幅 = 日图 + CSS 滤镜，「已生成」格只显示 **3** 枚不重复缩略图 |

**非**海南骑楼立面、**非**江南水街。

### 金标准矩阵

| 画幅 | 文件名 |
|------|--------|
| day wide | `cn_beijing_nanluoguxiang_day_wide.png` |
| night wide | `cn_beijing_nanluoguxiang_night_wide.png` |
| day standard | `cn_beijing_nanluoguxiang_day_standard.png` |

## 禁忌

- 空街无饮食、巨型单品海报风  
- 主招牌堆海南/东京/杭州西湖  
- 画面过密（参考海口骑楼疏朗度）  
- **油腻感**：湿地面镜面反射、人物皮肤/地面高光过强（夜景 `night_wide` 重绘须哑光材质）
