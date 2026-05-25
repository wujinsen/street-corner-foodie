# Landing · 天气时间卡片 · CSS Token 表（Phase A + B）

> 组件：`.bento-weather-live`（`LandingBentoMosaic.astro`）  
> Token 真源：`src/styles/tokens.css` § Landing weather chip  
> 动效样式（待 Phase A/B 实现）：`alt-c-refine.css` 消费下列变量  
> 数据脚本（Phase B）：`landing-bento-weather.ts` 写入 `data-weather-*`

---

## 1 · 驱动轴（JS 写入 / SSR fallback）

| `data-*` | 取值 | 来源 | 优先级 |
|----------|------|------|--------|
| `data-weather-period` | `dawn` · `morning` · `noon` · `golden` · `dusk` · `night` | 本地时刻 + region `timezone`（SunCalc / `Intl`） | 底色基准 |
| `data-weather-sky` | `clear` · `cloudy` · `fog` · `rain` · `snow` · `storm` | Open-Meteo `weather_code`（Phase B） | **覆盖** period 渐变（降水/雾） |
| `data-weather-climate` | `tropical` · `subtropical` · `temperate` · `arid` · `continental` | `region-atmosphere.ts`（策展） | 粒子 preset（萤火虫/热浪等） |

**点击温度特效** → [weather-temp-fx-rules.md](./weather-temp-fx-rules.md)（气候×气温矩阵 · 调试轮播）

**合成规则**

1. 默认：`period` 决定 `--weather-bg` 四色 stop + 字色。  
2. `sky` 为 `rain` / `snow` / `fog` / `storm` 时，改用 sky palette，保留 `period` 字色微调（深夜雨 = 更深字）。  
3. `climate=tropical` 且 `sky=clear|cloudy` 且 `period∈{dusk,night,golden}` → 开启 `--weather-fx-glow: 1`。  
4. `prefers-reduced-motion: reduce` → 关闭 mesh 流动与粒子（见 tokens 末尾）。

### Open-Meteo `weather_code` → `data-weather-sky`

| WMO 码 | sky |
|--------|-----|
| 0 | `clear` |
| 1–3 | `cloudy` |
| 45, 48 | `fog` |
| 51–67, 80–82 | `rain` |
| 71–77, 85–86 | `snow` |
| 95–99 | `storm` |

### 本地时刻 → `data-weather-period`（region timezone）

| 本地小时 | period |
|----------|--------|
| 05:00–07:59 | `dawn` |
| 08:00–10:59 | `morning` |
| 11:00–14:59 | `noon` |
| 15:00–17:59 | `golden` |
| 18:00–20:59 | `dusk` |
| 21:00–04:59 | `night` |

---

## 2 · 动画 / 结构 Token（Phase A · 全 period 共享）

| Token | 默认 | 用途 |
|-------|------|------|
| `--weather-mesh-period` | `15s` | mesh 渐变流动周期 |
| `--weather-mesh-ease` | `ease-in-out` | 流动缓动 |
| `--weather-mesh-size-1` | `220% 220%` | `background-size` 帧 A |
| `--weather-mesh-size-2` | `280% 240%` | `background-size` 帧 B |
| `--weather-mesh-pos-1` | `0% 40%` | `background-position` 帧 A |
| `--weather-mesh-pos-2` | `100% 60%` | `background-position` 帧 B |
| `--weather-fx-glow` | `0` | `1` = 热带微光粒子层 |
| `--weather-fx-particles` | `none` | `rain` · `snow` · `glow` · `stars` |
| `--weather-hover-light` | `0` | Phase C 预留；跟随指针光斑 |

---

## 3 · 渐变 Stop Token（四色 mesh）

每个 palette 提供 `--weather-bg-1…4`（145deg 线性叠加顺序）与合成 `--weather-bg`。

### 3.1 时段 · Dark theme（`html[data-theme="dark"]` 默认）

| period | stop-1 | stop-2 @38% | stop-3 @62% | stop-4 | 主字色 `--weather-fg` | 副字色 `--weather-fg-sub` |
|--------|--------|-------------|-------------|--------|------------------------|---------------------------|
| **dawn** | `#6B8FA8` | `#C4A882` | `#E8D4A0` | `#F5EDD8` | `#1E2832` | `#3D4A56` |
| **morning** | `#4A90C4` | `#7EB8E0` | `#B8DCF0` | `#E8F4FA` | `#1A3348` | `#3A5A6E` |
| **noon** | `#2E8BD8` | `#5CB4F0` | `#A8D8F8` | `#F0F8FF` | `#0C2840` | `#2A5070` |
| **golden** | `#8E6848` | `#C49268` | `#E8B878` | `#F8E0B0` | `#2A2018` | `#5A4838` |
| **dusk** ★ | `#4A3F7A` | `#8E4A7A` | `#C96A52` | `#E8A060` | `#FFFFFF` | `rgba(255,255,255,.88)` |
| **night** | `#0A1628` | `#121E32` | `#080E18` | `#060810` | `#E8EAED` | `rgba(232,234,237,.78)` |

★ 当前静态稿默认值（与现有 `.bento-weather-bg` 一致）

### 3.2 时段 · Light theme

| period | stop-1 | stop-2 | stop-3 | stop-4 | `--weather-fg` | `--weather-fg-sub` |
|--------|--------|--------|--------|--------|----------------|---------------------|
| **dawn** | `#C8DCE8` | `#F0E0D0` | `#F8ECD0` | `#FFFAF0` | `#2A3540` | `#5A6470` |
| **morning** | `#A8D0F0` | `#D0E8F8` | `#E8F4FC` | `#FFFFFF` | `#1A3050` | `#4A6080` |
| **noon** | `#88C0F0` | `#B8E0F8` | `#E0F2FC` | `#FFFFFF` | `#0A2840` | `#3A5878` |
| **golden** | `#D8B888` | `#F0D0A0` | `#F8E8C8` | `#FFFAF0` | `#3A2818` | `#6A5848` |
| **dusk** | `#B8A8C8` | `#D8A8A8` | `#F0B890` | `#F8D8B0` | `#2A2030` | `#5A5060` |
| **night** | `#485868` | `#384858` | `#283040` | `#202830` | `#F0F2F5` | `rgba(240,242,245,.82)` |

### 3.3 天空 · Dark（覆盖 period 渐变）

| sky | stop-1 | stop-2 | stop-3 | stop-4 | `--weather-fx-particles` |
|-----|--------|--------|--------|--------|--------------------------|
| **clear** | _(inherit period)_ | | | | `none` |
| **cloudy** | 在 period 基础上 stop-1/2 **−8% 饱和度** | | | | `none` |
| **fog** | `#4A5568` | `#687888` | `#788898` | `#8898A8` | `none` |
| **rain** | `#2A3848` | `#3A5060` | `#506878` | `#687888` | `rain` |
| **snow** | `#3A4858` | `#5A7088` | `#88A0B8` | `#B0C8D8` | `snow` |
| **storm** | `#1A2030` | `#283848` | `#384858` | `#506068` | `rain` |

### 3.4 天空 · Light

| sky | stop-1 | stop-2 | stop-3 | stop-4 |
|-----|--------|--------|--------|--------|
| **fog** | `#C8D0D8` | `#D8E0E8` | `#E8EEF2` | `#F0F4F8` |
| **rain** | `#A8B8C8` | `#B8C8D8` | `#C8D8E8` | `#D8E8F0` |
| **snow** | `#D0DCE8` | `#E0EAF0` | `#EEF4F8` | `#F8FAFC` |
| **storm** | `#9098A8` | `#A0A8B8` | `#B0B8C8` | `#C0C8D8` |

---

## 4 · 粒子 Token（Phase A 热带 / Phase B 雨雪）

| Token | `rain` | `snow` | `glow`（热带） | `stars`（深夜 clear） |
|-------|--------|--------|----------------|----------------------|
| `--weather-particle-color` | `rgba(255,255,255,.38)` | `rgba(255,255,255,.55)` | `rgba(255,210,120,.45)` | `rgba(255,255,255,.65)` |
| `--weather-particle-size` | `1px × 14px`（斜线） | `3px`（圆） | `2px`（圆） | `1.5px` |
| `--weather-particle-angle` | `105deg` | — | — | — |
| `--weather-particle-duration` | `0.9s` | `4.5s` | `6s` | —（静态） |
| `--weather-particle-opacity` | `.55` | `.7` | `.35` | `.5` |
| `--weather-particle-count` | `24`（实现参考） | `18` | `10` | `6` |

---

## 5 · 图标与对比度

| Token | 说明 |
|-------|------|
| `--weather-icon-color` | 默认 `color-mix(in oklab, var(--weather-fg) 92%, white)` |
| `--weather-icon-opacity` | `0.95` |
| `--weather-min-contrast` | 正文/背景 WCAG AA；`dawn`/`morning`/`noon`/`golden` light 底 **必须** 用深字 |

---

## 6 · Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .bento-weather-live {
    --weather-mesh-period: 0s;
    --weather-fx-particles: none;
    --weather-fx-glow: 0;
  }
}
```

---

## 7 · 实现检查清单（Phase A → B）

- [ ] `.bento-weather-bg` 改用 `var(--weather-bg)` + mesh `@keyframes`  
- [ ] `.bento-weather-main/sub` 改用 `--weather-fg` / `--weather-fg-sub`  
- [ ] `landing-bento-weather.ts`：算 `period` + 拉 `weather_code` → 设 `data-weather-*`  
- [ ] SSR：`data-weather-period="dusk"` + `data-weather-climate` 与 `region-atmosphere` 一致  
- [ ] 浅色主题走 `html[data-theme="light"]` 块内 override  
- [ ] 旧硬编码渐变从 `alt-c-refine.css` 删除

---

## 8 · Phase C 预留（本次不实现）

- `--weather-hover-light` + 指针跟随  
- `data-weather-expanded` 展开地图 / 5 日曲线  
- 温度 `0→N` 滚动计数 keyframes
