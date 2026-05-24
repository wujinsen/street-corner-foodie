# Street View · prompt templates

Primary spec: [docs/style/street-view-diorama.md](../../../docs/style/street-view-diorama.md).  
Always-on rule: [meishi-street-view-spec.mdc](../../../.cursor/rules/meishi-street-view-spec.mdc).  
Scene food: read prototype md for slug before filling `{FOOD_*}`.

Reference image **optional** — calibration only.

**All templates**: MUST include street-level food stalls, bowls, steam, shop signs (`{FOOD_SIGNS}`). NOT empty streets. NOT single giant dish poster composition.

---

## A · Day wide (21:9)

```text
Ultra-wide 21:9 3D isometric miniature diorama of {CITY_EN} {SCENE_EN} ({SCENE_CN}) bright daytime,
toy-model tilt-shift aesthetic, cute chibi figurine people, dense details,
scene fills 95% of frame minimal base margin,
{ENVIRONMENT_DETAILS}
FOOD (required): {FOOD_DETAILS} — stalls, steaming bowls, customers eating at low tables.
Signs: {SIGNS_DAY} {FOOD_SIGNS}
{BACKGROUND_NOTE}
warm saturated sunlight, photorealistic miniature NOT anime 2D NOT giant food poster, no watermark.
```

---

## B · Night wide (21:9)

```text
Ultra-wide 21:9 3D isometric miniature diorama of {CITY_EN} {SCENE_EN} ({SCENE_CN}) at night,
toy-model tilt-shift aesthetic, cute chibi figurine people, dense night life,
scene fills 95% of frame,
{ENVIRONMENT_DETAILS}
FOOD (required): {FOOD_DETAILS} — night stalls, grill smoke, ramen/yakiniku/烧烤 steam as appropriate.
Signs: {SIGNS_NIGHT} {FOOD_SIGNS}
Warm paper lanterns and soft neon, deep navy sky, cozy hutong night,
{BACKGROUND_NOTE}
MATTE surfaces: dry cobblestone/brick pavement (NO wet mirror reflections, NO oily shine),
chibi figures matte vinyl toy finish (NOT glossy plastic skin),
photorealistic miniature NOT anime 2D NOT giant food poster, no watermark.
```

---

## C · Standard (1:1)

```text
Square 1:1 3D isometric miniature diorama of Haikou {SCENE_EN} ({SCENE_CN}) daytime,
toy-model tilt-shift, chibi people, architectural focus, edge-to-edge composition,
{ENVIRONMENT_DETAILS}
Signs: {SIGNS_DAY}
Warm afternoon light, minimal hex base strip only, no watermark.
```

---

## D · No-character (append to A/B/C)

```text
ZERO human figures, no chibi people, deserted but props and furniture may remain.
```

---

## Slug examples

| 城市 | 中文 | geo / dir | slug |
|------|------|-----------|------|
| 海口 | 骑楼老街 | `cn/hainan/haikou` · `haikou_*` | `qilou` |
| 海口 | 府城 | `cn/hainan/haikou` · `haikou_fucheng_*` | `fucheng` |
| 石家庄 | 板面街 | `cn/hebei/shijiazhuang` | `bannianmian` |
| 石家庄 | 正定古城 | `cn/hebei/shijiazhuang` | `zhengding` |
| 石家庄 | 煤机街夜市 | `cn/hebei/shijiazhuang` | `meiji_yeshi` |
| 东京 | 新宿/涩谷/浅草/筑地/秋叶原/原宿/上野/池袋/电子学校 | `jp/tokyo` · `tokyo_*` | 见 [japan-tokyo-street-prototypes.md](../../../docs/world/japan-tokyo-street-prototypes.md) |

Filename: `{geo_or_city}_{slug}_{day|night}_{wide|standard}.png`

### BACKGROUND_NOTE examples

- Haikou coastal: `Haikou skyline and blue sea when coastal`
- Shijiazhuang: `North China urban street, cool autumn light, NOT tropical`
- Tokyo: `Dense Japanese urban canyon, Japanese signage only`

---

## Signage cheat sheet (Hainan)

**Qilou day**: 骑楼老街, 水巷口, 骑楼博物馆, 海南特产  
**Qilou night**: 夜串烧烤, 炒冰, 生蚝排档, 海口夜宵, 啤酒屋  
**Laobacha**: 海口老爸茶, 聚福茶楼, 恒兴, 肠粉, 凤爪  
**Wanlv park**: 万绿园, 滨海大道, 健身广场  
**Holiday beach**: 假日海滩, 椰林, 海鲜烧烤, 戏水区  
**Haikou bay**: 世纪大桥, 云洞图书馆, 海鲜大排档, 椰子鸡  
**Fucheng**: 牛腩饭, 猪脚饭, 海口鱼煲, 鸽子粥, 蟹粥 — use 府城 NOT 福城

## Food cheat sheet (Shijiazhuang)

**bannianmian**: 正宗安徽牛肉板面, 辣卤宽面, 卤蛋, 豆皮, 大红肠, 魔鬼椒  
**zhengding**: 马家卤鸡, 正定八大碗, 热切丸子  
**meiji_yeshi**: 缸炉烧饼, 深泽肉糕, 煤机街夜市, 板面, 驴肉火烧

## Food cheat sheet (Tokyo · 全城)

**shinjuku**: ラーメン, 居酒屋, 牛丼 · night 焼肉  
**shibuya**: ラーメン, 渋谷肉巻き · night 居酒屋  
**asakusa**: 人形焼, 天ぷら, うなぎ  
**tsukiji**: 寿司, 海鮮丼, 玉子焼き  
**akihabara**: ラーメン, カレー, たこ焼き  
**harajuku**: クレープ, たい焼き  
**ueno**: 焼き鳥, 弁当, 市場小吃  
**ikebukuro**: 餃子, 豚骨ラーメン  
**denshi_senmon**: ラーメン, 牛丼, からあげ — multi-building campus

## Food cheat sheet (Fuji · Kawaguchiko)

**kawaguchiko**: ほうとう hoto noodles, 吉田うどん, 信玄餅 shingen mochi, ます焼き grilled trout — Mount Fuji + lake background

## Food cheat sheet (NYC)

**times_square**: hot dog cart, soft pretzel, pizza by the slice  
**lower_manhattan**: bagel + lox, deli sandwich, Chinatown takeout window  
**brooklyn_dumbo**: smash burger, Brooklyn pizza, coffee cart

## Food cheat sheet (LA)

**hollywood**: hot dog cart, taco truck, pretzel, Walk of Fame  
**venice_beach**: fish tacos, carne asada tacos, acai bowl, murals palm beach  
**grand_central_market**: tacos, pastrami sandwich, pho, GRAND CENTRAL MARKET arch hall

## Food cheat sheet (Los Angeles)

**hollywood**: hot dog cart, taco truck, Walk of Fame tourists  
**venice_beach**: fish tacos Baja, carne asada tacos, acai bowl  
**grand_central_market**: tacos al pastor, pastrami sandwich, pho stall

## Food cheat sheet (Texas BBQ)

**austin_pit**: sliced brisket smoke ring, beef ribs, jalapeno sausage, outdoor smokers  
**lockhart_main**: Texas BBQ hall line, brisket ribs on butcher paper, sweet tea  
**bbq_trail**: row of BBQ trailers, BRISKET signs, picnic tables gravel lot
