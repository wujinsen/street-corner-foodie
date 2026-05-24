---
name: meishi-street-view
description: >-
  Street View 3D isometric miniature for Haikou, Shijiazhuang, Tokyo. Auto-ingest
  to asserts/Street View/{cc}/{admin}/{local}/ with LOCAL FOOD stalls and signs.
  alwaysApply rule: meishi-street-view-spec.mdc. No user phrase 按规范 needed.
  Read scene prototype md before GenerateImage. Not posters or mini-zine.
disable-model-invocation: true
---

# Meishi Street View (city diorama)

## Always-on rules (new + old chats)

1. [AGENTS.md](../../../AGENTS.md) — ingest checklist  
2. [.cursor/rules/meishi-street-view-spec.mdc](../../../.cursor/rules/meishi-street-view-spec.mdc) — **food, matrix, paths, prototypes**  
3. [docs/style/street-view-diorama.md](../../../docs/style/street-view-diorama.md) — visuals + signage table  

## When to use

| Location | Style | This skill? |
|----------|-------|-------------|
| `asserts/Street View/` | 3D isometric miniature + chibi + **street food** | **Yes** |
| `Gourmet recipe2/` | Giant food + chefs | No → `meishi-food-poster` |
| `mini-zine/` | Parchment zine panels | No → `gourmet-recipe-mini-zine` |

## Before generating

1. Read [street-view-diorama.md](../../../docs/style/street-view-diorama.md).  
2. Read **scene prototype** for this slug (see spec rule index).  
3. Read region md street matrix: `hainan.md` / `shijiazhuang.md` / `japan.md`.  
4. `denshi_senmon` → [japan-denshi-senmon-prototype.md](../../../docs/world/japan-denshi-senmon-prototype.md) (multi-building campus).  
5. [prompt-templates.md](prompt-templates.md) — include `{FOOD_SIGNS}` / `{FOOD_DETAILS}`.  
6. Check target subdir + `street_view_approved` — skip if full set exists (unless user says redo).

## Gold standard matrix (per scene)

| File | Ratio |
|------|-------|
| `{geo}_{slug}_day_wide.png` | 21:9 day |
| `{geo}_{slug}_night_wide.png` | 21:9 night |
| `{geo}_{slug}_day_standard.png` | 1:1 day |

**Web / 探索器默认展示**：优先 **`night_wide`**（无 URL `time` 时）。代码 `STREET_VIEW_DEFAULT_VIEW` in `web/src/lib/streets.ts`；规则 §2b in `meishi-street-view-spec.mdc`. Still generate **both** day and night assets.

## Paths & geo

| City | Directory | Filename |
|------|-----------|----------|
| Haikou | `Street View/cn/hainan/haikou/` | `haikou_*` or `cn_hainan_haikou_*` |
| Shijiazhuang | `Street View/cn/hebei/shijiazhuang/` | `cn_hebei_shijiazhuang_*` |
| Tokyo | `Street View/jp/tokyo/` | `tokyo_*` or `jp_tokyo_*` |
| NYC | `Street View/us/nyc/` | `us_nyc_*` |
| LA | `Street View/us/la/` | `us_la_*` |

**Never** save new finals to `Street View/` root.

## Workflow

1. Resolve geo + slug + day/night + wide/standard.  
2. Pick food + signs from prototype + style doc signage row.  
3. `GenerateImage` (`filename` = final basename).  
4. `Copy-Item` → subdir above.  
5. Update `street_view_approved` in region md.

## Quality gates

- Frame ~95% full; no empty grey void.  
- **Ground-level food** present; NOT food-poster giant dish.  
- Scene-appropriate signs only (no sign soup).  
- Fucheng: **府城** not 福城.  
- Denshi senmon: multiple labeled buildings, not single glass gate.
