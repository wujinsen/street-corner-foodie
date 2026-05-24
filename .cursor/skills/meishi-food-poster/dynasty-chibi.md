# 海报 · 时代 3D Q 版速查

**完整规范** → [docs/style/food-poster-dynasty-chibi.md](../../../docs/style/food-poster-dynasty-chibi.md)  
**时代表 / 候选池 / 强锚定** → [mini-zine-dynasty-chibi.md](../../../docs/style/mini-zine-dynasty-chibi.md)  
**已收录 slug + `{DynastyDressEN}`** → [gourmet-recipe-mini-zine/dynasty-chibi.md](../gourmet-recipe-mini-zine/dynasty-chibi.md)（**与海报共用**）

## 海报仅记这三条

1. **同 slug 只锁海报两张**：`_poster` / `_poster_no_char` 同时代；**与 zine 可不同代**  
2. **人数**：3～5，站桌边，不挡食  
3. **性别**：默认 **全员女性** chibi（优先女性）  
4. **prompt**：`{CHEF_COUNT} cute **female** 3D chibi figures (all female) in {DynastyDressEN}, …`

## 参考图顺序

1. 同菜或同地区 `_poster.png`（**版式**）  
2. 同 slug `_mini_zine.png`（**构图**可选；服饰以海报自定的时代为准）  
3. `_templates/487c2f*.jpg`（仅构图参考）

## 随机（与 zine 相同）

```python
era = pool[sum(ord(c) for c in slug) % len(pool)]
```

美国原住民：`us_indigenous` / `us_indigenous_modern` — 见 mini-zine §原住民。

日本：`jp_*` **13 档**古代至今全集 — 见 mini-zine §日本；`sum(ord)%13`。
