# 天气卡片 · 点击温度特效规则

> 组件：`.bento-weather-live` · 点击 `[data-bento-weather-temp-hit]`  
> 代码：`web/src/lib/weather-temp-fx-profile.ts` · `weather-temp-poke.ts` · `weather-temp-fx-engine.ts`  
> 关联：[WEATHER-CHIP-TOKENS.md](./WEATHER-CHIP-TOKENS.md)（底色 / 粒子 token）

---

## 1 · 特效类型

| `TempFxId` | 中文 | 视觉 |
|------------|------|------|
| `FX_Heat_Explosion` | 鲜橙爆炸 | 整卡鲜橙冲击波 + Canvas 火团飞溅 |
| `FX_Humidity_Squeeze` | 西瓜片爆炸 | 整卡红绿 wash + Canvas 西瓜片飞溅 + 气泡 |
| `FX_Dry_Sandstorm` | 沙暴颗粒 | 整卡沙黄 haze + 旋涡 + 颗粒 + 气泡 |
| `FX_Cool_Gel` | 冰块爆炸 | 整卡冰蓝 frost + Canvas 冰块碎屑冲击波 |
| `FX_Cosmic_Bang` | 宇宙大爆炸 | 整卡深空紫蓝 wash + 多色冲击波 + 星尘/星云粒子 |
| `FX_Sun_Beam` | 太阳照射 | 整卡金色光晕 + 放射光束 + 暖尘粒子 |
| `FX_Mild` | 轻触 | 数字轻 punch + 微 wobble（无整卡大特效） |

---

## 2 · 判定输入

| 字段 | `data-*` | 取值 |
|------|----------|------|
| 气温 | `data-weather-temp-poke`（JS 同步）+ DOM 数字 | 整数 °C |
| 气候 | `data-weather-climate` | `tropical` · `subtropical` · `temperate` · `arid` · `maritime` · `continental` |
| 天空 | `data-weather-sky` | `clear` · `cloudy` · `fog` · `rain` · `snow` · `storm` |

函数：`inferTempFxId(tempC, climate, sky)`  
摘要：`describeTempFx(tempC, climate, sky)` → `{ fxId, reason }`

---

## 3 · 全局优先规则（先于气候矩阵）

1. **偏冷**：`tempC ≤ 18` → `FX_Cool_Gel`
2. **下雪**：`sky === snow` 且 `tempC ≤ 22` → `FX_Cool_Gel`
3. **极热宇宙**：`tempC ≥ 36` → `FX_Cosmic_Bang`
4. **晴日暖光**：`sky === clear` 且 `19–26°C` 且气候 ∈ `{ temperate, maritime, continental }` → `FX_Sun_Beam`
5. **湿天暖湿**：`sky ∈ { rain, storm, fog }` 且 `tempC ≥ 22` 且气候 ∈ `{ tropical, subtropical, maritime }` → `FX_Humidity_Squeeze`
6. **干旱区**：`climate === arid` 且 `tempC ≥ 20` → `FX_Dry_Sandstorm`；否则 `FX_Mild`
7. **极热**：`tempC ≥ 33` → 大陆性 + 晴 = `FX_Dry_Sandstorm`，其余 = `FX_Heat_Explosion`

---

## 4 · 气候 × 气温矩阵（常规段）

| 气温 | 热带 | 亚热带 | 温带 | 海洋性 | 大陆性 |
|------|------|--------|------|--------|--------|
| ≤18°C | 冰块 | 冰块 | 冰块 | 冰块 | 冰块 |
| 19–21°C | 轻触 | 轻触 | 轻触 | 轻触 | 轻触 |
| 22–29°C | 西瓜 | 西瓜† | 轻触 | 西瓜‡ | 轻触§ |
| 30–32°C | 爆燃 | 爆燃 | 爆燃 | 西瓜 | 见¶ |
| ≥33°C | 爆燃 | 爆燃 | 爆燃 | 爆燃 | 见全局规则 |

- **† 亚热带**：`tempC ≥ 23` 方为西瓜片爆炸；22°C 仍为轻触  
- **‡ 海洋性**：`tempC ≥ 21` 方为西瓜片爆炸；`≥ 32` 改爆燃  
- **§ 大陆性**：`tempC ≥ 24` 且湿天 → 西瓜片爆炸（已被全局湿天规则覆盖）  
- **¶ 大陆性 30–32°C**：`sky === clear` → 沙暴；否则 → 爆燃  

### 干旱（`arid`）

| 气温 | 特效 |
|------|------|
| ≤19°C | 轻触 |
| ≥20°C | 沙暴 |

---

## 5 · 示例

| 场景 | climate | temp | sky | 特效 |
|------|---------|------|-----|------|
| 海口首页 | tropical | 28 | clear | 西瓜片爆炸 |
| 海口酷暑 | tropical | 31 | clear | 鲜橙爆炸 |
| 石家庄夏 | continental | 29 | clear | 沙暴 |
| 江南梅雨 | subtropical | 26 | rain | 西瓜片爆炸（湿天规则） |
| 哈尔滨冬 | temperate | 16 | snow | 冰块爆炸 |
| 西北干热 | arid | 35 | clear | 沙暴 |

---

## 6 · 调试模式 · 点击轮播

调样式时**不跑气候矩阵**，改为每次点击依次播放六款主特效：

1. `FX_Heat_Explosion`  
2. `FX_Humidity_Squeeze`  
3. `FX_Dry_Sandstorm`  
4. `FX_Cool_Gel`  
5. `FX_Cosmic_Bang`  
6. `FX_Sun_Beam`  

### 开启

在 `LandingBentoMosaic.astro` 的 `.bento-weather-live` 上保留：

```html
data-weather-temp-fx-debug="cycle"
```

或在控制台：

```js
document.querySelector("[data-landing-weather]").dataset.weatherTempFxDebug = "cycle";
```

### 关闭（上线 / 按规则）

删除 `data-weather-temp-fx-debug="cycle"`，或设为任意非 `cycle` 值。  
此时 `weather-temp-poke.ts` 改走 `inferTempFxId()`。

### 调试辅助

每次播放后，根节点会写入 `data-weather-temp-fx-last="{fx-id}"`（如 `heat-explosion`），便于 DevTools 查看当前款。

---

## 7 · 实现文件

| 文件 | 职责 |
|------|------|
| `weather-temp-fx-profile.ts` | 规则真源 `inferTempFxId` |
| `weather-temp-poke.ts` | 点击绑定 · 调试轮播开关 |
| `weather-temp-fx-engine.ts` | Canvas + 整卡 CSS stage |
| `alt-c-refine.css` | `.bento-weather-fx-stage--*` · scrim · 气泡 |

---

## 8 · 变更记录

| 日期 | 说明 |
|------|------|
| 2026-05-24 | 新增宇宙大爆炸 · 太阳照射；调试轮播扩至 6 款 |
| 2026-05-24 | 湿热 → 西瓜片爆炸；Q弹冰感 → 冰块爆炸（Canvas 整卡） |
| 2026-05-24 | 初版：气候×气温矩阵；整卡特效；调试轮播 `data-weather-temp-fx-debug=cycle` |
