# 时代 3D Q 版 · Agent 速查（古代 → 2026）

完整规范 → [docs/style/mini-zine-dynasty-chibi.md](../../../docs/style/mini-zine-dynasty-chibi.md)

## 决策（30 秒）

**故事文案力求真实** → [mini-zine-dynasty-chibi.md §故事小志](../../../docs/style/mini-zine-dynasty-chibi.md)：**服饰代号 ≠ 食物史**；先查地区 md 再写气泡。

**性别（优先女性）**：有人物版 → **全员女性** chibi；`{DynastyDressEN}` 前加 `All cute female 3D chibi in …`；禁止默认全男。例外：用户点名才可 ≤1 男。

1. **文案源流** → 地区 md / 下表备注 / 核实方志；输出 `文案源流 | 依据`  
2. **强锚定？**（服饰）→ 用规范 §强锚定，不随机  
3. **下表有「固定」？** → 服饰用固定  
4. **否则** → 候选池 → `sum(ord(slug))%len(pool)`  
5. 生成前表：`| 时代(服饰) | 文案源流 | 依据 | 性别 | 随机? |`

用户说「随机时代」→ 在地域池内执行步骤 3，标注 `随机抽取`。

## 已收录 · 固定或默认池

| slug / 菜 | 时代 | 服饰 | 备注 |
|-----------|------|------|------|
| `xihu_cuyu` | **song** 固定 | 宋服襕衫百迭裙 · 全员女性 | 角标**江南风味** · zine ✅ 四套 `cn/zhejiang/` 2026-05 重做；海报**杭州味道** |
| `dongpo_rou` | **`song`** 强锚定 | 宋服 · 4 女 · 5碗横木牌 | 竖牌**杭州味道**；海报 ✅ · zine **p01–p06** · 2026-05-19 六页重绘 · **前景 3D chibi** · 全员女性 |
| `hongshao_rou` | pool: `song`·`ming` → **`song`** | 宋服襕衫襦裙；家常红烧肉慢炖 | 竖牌**江苏味道**；海报 ✅ · zine **p01–p06** `cn/jiangsu/hongshao_rou_mini_zine_p*.png` · 全员女性 · 与东坡肉区分文案 |
| `maoshi_hongshao_rou` | **`prc_50s`** 强锚定 | 中山装/蓝工装；湘式红烧五花 | 竖牌**湖南味道**；`cn/hunan/` 海报 ✅ |
| `gongbao_jiding` | **`qing`** 强锚定 | 4 女 · 5料横木牌 | 竖牌**四川味道**；仅 `_poster.png` · `cn/sichuan/` ✅ 2026-05-21 |
| `laziji` | **`qing`** 强锚定 | 4 女 · 5料横木牌 | 辣子鸡/辣子鸡丁；竖牌**四川味道**；`cn/sichuan/` ✅ 2026-05 |
| `tanzi_rou` | pool → **`ming`** | 明制短袄围裙；坛焖肉 | `cn/sichuan/` 海报 ✅ |
| `zuozongtang_ji` | **`qing`** 强锚定 | changshan；左宗棠鸡 | `cn/sichuan/` 海报 ✅ |
| `ba_zi_rou` | pool → **`ming`** | 明制短袄；把子肉 | `cn/hebei/` 海报 ✅ |
| `wanzi_kourou` | pool → **`contemporary`** | 围裙/卫衣；万字扣肉 | `cn/guangdong/` 海报 ✅ |
| `meicai_kourou` | **`contemporary`** | 4 女 · 5料横木牌 | 梅菜扣肉；竖牌**广东味道**；仅 `_poster.png` · `cn/guangdong/` ✅ 2026-05-21 重绘 |
| `taishi_wushe_geng` | **`contemporary`** | 4 女 · 5料横木牌 | 太史五蛇羹；竖牌**广东味道**；仅 `_poster.png` · `cn/guangdong/` ✅ 2026-05-21 重绘 |
| `lihongzhang_dazahui` | **`qing`** 强锚定 | changshan 宴席 · 5 女锅边 | 竖牌**江苏味道**；`cn/jiangsu/` 海报 ✅ 2026-05 重绘 |
| `laobacha` | **`republic`** 固定 | 5 女 · 6料横木牌 · 龙井/铁观音 | boluo清晰风；禁普洱主茶；`laobacha_poster.png` ✅ 2026-05-19 茶品修正 · zine p01–p06 |
| `hele_xie` | **`republic`**（海报） | 4 女 · 5料横木牌 · 清蒸膏蟹 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 |
| `baoluo_fen` | **`republic`**（海报） | 4 女 · 5料横木牌 · 抱罗汤粉 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 |
| `hainan_fen` / `hainan_yanfen` / `yanfeng_xianshuiya` | **`republic`**（海报） | 旗袍/长衫；粉面/鸭 | 竖牌**海南味道**；海报 ✅ |
| `haikou_zhazha` | **`qing`**（海报） | 5 女 · 5料横木牌 · 炸串淋酱 | boluo**清新风**；竖牌**海南味道**；`cn/hainan/` ✅ 2026-05-19 清新风重绘 |
| `qiongshan_zhuxuetang` / `shaguozhou` | **`qing`**（海报池） | changshan 便服；猪血汤/砂锅粥 | 海报 ✅ |
| `chaoshan_shaguozhou` | **`contemporary`** | 粥店围裙；长堤新港夜宵 | 角标海南风味 · zine **p01–p06** · 文案：潮汕技法在海口，非海南发明砂锅粥 |
| `danzhou_milan` | **`contemporary`**（海报） | 4 女 · 5料横木牌 · 米烂浇卤 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 |
| `jiaji_ya` | **`contemporary`**（海报） | 4 女 · 5料横木牌 · 白切加积鸭 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 |
| `hainan_shaoya` | **`contemporary`**（海报） | 4 女 · 5料横木牌 · 海南烧鸭 | boluo清新风·禁穿模；竖牌**海南味道**；`cn/hainan/hainan_shaoya_poster.png` ✅ 2026-05-19 |
| `yezi_fan` | **`contemporary`** | 4 女 · 5料横木牌 · 椰壳糯米饭 · 度假围裙 | boluo清晰风；竖牌**海南味道**；海报 `yezi_fan_poster.png` ✅ · zine **p01–p06** `cn/hainan/yezi_fan_mini_zine_p*.png` · 全员女性 · 与椰子鸡区分 |
| `dongshan_yang` | **`contemporary`**（海报池） | 围裙/卫衣；山羊 | 海报 ✅ |
| `manhan_quanxi` | **`qing`** 强锚定 | 5 女 · 5料横木牌 · 合宴意象 | 烤鸭/海参/猴头/酸菜白肉/鹿尾；竖牌**北京味道**；`cn/beijing/` 海报+zine **p01–p06** ✅ · **文案**：清宫无专名、今宴代表菜组合 |
| `beijing_kaoya` | **`qing`** | 挂炉烤鸭坊 changshan 围裙；片鸭卷饼 | 竖牌**北京味道**；海报 ✅ |
| `zhajiangmian` | **`republic`** | 胡同面馆 qipao/changshan；炸酱菜码 | 竖牌**北京味道**；海报 ✅ |
| `shuanyangrou` | **`qing`** | 铜锅涮肉 changshan；切肉麻酱 | 竖牌**北京味道**；海报 ✅ |
| `luzhu_huoshao` | **`republic`** | 卤煮摊 qipao 围裙；肠肺火烧 | 竖牌**北京味道**；海报 ✅ |
| `chaogan` | **`republic`** | 4 女 · 5料横木牌 | 炒肝；竖牌**北京味道**；仅 `_poster.png` · `cn/beijing/` ✅ 2026-05-21 重绘 |
| `douzhi_jiaoquan` | **`republic`** | 护国寺早点 qipao；豆汁焦圈 | 竖牌**北京味道**；海报 ✅ |
| `wenchang_jifan` | **`song`**（海报） | 5 女 · 5料横木牌 · 文昌鸡饭 | boluo清新风·禁穿模；竖牌**海南味道**；`cn/hainan/wenchang_jifan_poster.png` ✅ 2026-05-19 · zine p01–p06 · 源流明代得名 |
| `hainan_jifan` | **`song`** 固定 | 5 女 · 5料横木牌 | 海南鸡饭；boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 · zine p01–p06 |
| `lijia_zhutongfan` | **`ethnic`** 固定 | 4 女 · 4料横木牌 | 黎家竹筒饭；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-21 重绘 |
| `wuse_fan` | **`ethnic`** 固定 | 黎苗节庆五彩糯米饭 | 角标海南风味 |
| `shanlan_jiu` | **`ethnic`** 固定 | 黎族山兰米酒 | 角标海南风味 |
| `danjia_yutang` | **`qing`** 固定 | 疍家渔家清汤鲜鱼；changshan 头巾 | 角标海南风味 |
| `yezi_yinpin` | **`contemporary`** | 合并稿（已拆为下三行）；保留 | 历史 |
| `yezi_shui` | **`republic`** | 椰子水；椰青摊 qipao | 角标海南风味 · zine **p01–p06** `cn/hainan/yezi_shui_mini_zine_p*.png` · 全员女性 |
| `yezi_gao` | **`song`** | 椰子糕；茶点宋服 | 角标海南风味 · zine **p01–p06** `cn/hainan/yezi_gao_mini_zine_p*.png` · 全员女性 |
| `yezi_tang` | **`republic`** | 椰子糖；手信店 qipao | 角标海南风味 · zine **p01–p06** `cn/hainan/yezi_tang_mini_zine_p*.png` · 全员女性 |
| `suandouzhi` | **`republic`** | 酸豆汁；骑楼茶饮 qipao | 角标海南风味 |
| `fushan_kafei` | **`republic`** 强锚定 | 福山咖啡；南洋咖啡馆 | 角标海南/澄迈风味 |
| `hainan_tanshao_kafei` | **`prc_80s`** | 海南炭烧咖啡；炭焙小馆花衬衫围裙 | 角标海南风味 · zine **p01–p06** `cn/hainan/hainan_tanshao_kafei_mini_zine_p*.png` · 全员女性 · 与福山咖啡区分 |
| `danzhou_zongzi` | **`republic`** | 儋州大块肉粽 | 角标海南风味 |
| `jishiteng_guozai` | **`republic`** | 鸡屎藤粿仔 · 旗袍糖水档 | 角标海南风味 · zine **p01–p06** `cn/hainan/jishiteng_guozai_mini_zine_p*.png` · 全员女性 · 勿与清补凉混写 |
| `banlan_gao` | **`contemporary`** | 斑斓糕 | 角标海南风味 |
| `hainan_babaofan` | **`song`** | 八宝糯米饭 | 角标海南风味 |
| `nanhai_yuanyang_yu` | **`qing`** | 鸳鸯鱼双味蒸 | 角标海南风味 |
| `jian_haikou_majiao` | **`qing`** | 3 女 · 4料横木牌 | 煎海口马鲛鱼；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-21 重绘 |
| `dongshu_luobo` | **`qing`** | 临高泡萝卜 | 角标海南风味 |
| `lingao_jiucai_bing` | **`ming`** | 临高韭菜饼 | 角标海南风味 |
| `huishui_gao` | **`republic`** | 灰水糕 | 角标海南风味 |
| `jiandui` | **`ming`** | 煎堆 | 角标海南风味 |
| `chunlin_yuebing` | **`republic`** | 春临月饼 · 旗袍 | 角标海南风味 · zine **p01–p06** `cn/hainan/chunlin_yuebing_mini_zine_p*.png` |
| `baimi_zhou` | **`republic`** | 白粥 · 旗袍茶肆 | 角标海南风味 · zine **p01–p06** `cn/hainan/baimi_zhou_mini_zine_p*.png` · 全员女性 |
| `yupian_zhou` | 海鲜粥池 → **`contemporary`** | 粥店围裙；石斑生滚 | 角标海南风味 · **文案**：生滚技法、鲜鱼片 · zine ✅ **p01–p06** `yupian_zhou_mini_zine_p*.png` |
| `maoshi_hongshaorou` | **`prc_50s`** 强锚定 | 毛氏湘菜红烧肉；蓝工装/中山装 | 角标湖南风味 |
| `zuozongtang_ji` | **`qing`** 强锚定 | 左宗棠名菜；酥鸡酸甜汁 | 角标湖南风味 |
| `tanzi_rou` | **`qing`** | 四川坛子慢炖肉；changshan | 角标四川风味 · zine ✅ 四套 |
| `gongbao_jiding` | **`qing`** 强锚定 | 宫保鸡丁；茶馆便服 | 角标四川风味 · zine ✅ 四套 |
| `bazirou` | **`ming`** 固定 | 济南把子肉；立领短袄围裙网巾 | 角标山东风味 · zine ✅ 四套 `cn/shandong/` 2026-05 重做 |
| `meicai_kourou` | **`republic`** 固定 | 客家梅菜扣肉；旗袍/长衫 | 角标广东风味 |
| `wanshi_kourou` | **`qing`** 固定 | 徽州万字刀纹扣肉 | 角标徽州风味 |
| `taishi_wushe_geng` | **`qing`** 强锚定 | 太史五蛇羹；粤宴 | 角标粤菜风味 |
| `lihongzhang_dazahui` | **`qing`** 强锚定 | 李鸿章烩菜；徽宴 | 角标安徽风味 |
| `qingbuliang` | **`republic`** 固定 | 5 女 · 6料横木牌 · 夜市清补凉 | boluo清新风·竖牌**海南味道**；海报 ✅ · zine **p01–p06** `cn/hainan/qingbuliang_mini_zine_p*.png` · 全员女性 · 勿与鸡屎藤粿仔混写 |
| `houan_fen` | **`republic`** 固定 | 4 女 · 5料横木牌 · 后安汤粉猪杂炸蛋 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 |
| `hainan_fen` | **republic** 固定 | 街边便装 | |
| `zaopocu_huoguo` | **`contemporary`**（海报） | 5 女 · 5料横木牌 · 糟粕醋火锅 | boluo清新风·锅外禁穿模；竖牌**海南味道**；`cn/hainan/zaopocu_huoguo_poster.png` ✅ 2026-05-19 · zine 池 `qing`·`contemporary` |
| `chongqing_huoguo` | **`qing`**（海报） | 5 女 · 5料横木牌 · 九宫格红汤 | boluo清新风·锅外禁穿模；竖牌**重庆味道**；`cn/chongqing/chongqing_huoguo_poster.png` ✅ 2026-05-19 · 舌尖 S1E6 |
| `hele_xie` | pool: `qing`·`republic` | 渔家 | 随机 |
| `haikou_zhazha` | pool: `republic`·`contemporary`·`qing` | 夜宵摊主 | 随机 |
| `bannianmian` | **`ming`** 固定 | 立领短袄、围裙、布巾面馆伙计 | 庄里板面四套已按明制重绘 |
| `ganglu_shaobing` | **`ming`** 固定 | 烧饼铺短袄 · 3 女 · 底行4碗 | 竖牌**庄里味道**；海报 ✅ 2026-05 重绘 |
| `lingshui_suanfen` | **`ming`**（海报） | 4 女 · 5料横木牌 · 陵水酸粉 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 · zine 池 `ming`·`contemporary` |
| `changliu_suanfen` | **`ming`** 固定 | 4 女 · 5料横木牌 · 凉拌厚宽酸粉 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 |
| `jiazi_fen` | **`ming`** 固定 | 立领短袄、围裙、头巾；甲子腌粉/粑条汤 | 角标海南风味；海报/zine 同代 |
| `yezi_ji` | **`contemporary`** | 4 女 · 5料横木牌 · 椰壳火锅 · 度假围裙 | boluo清晰风；竖牌**海南味道**；海报 `yezi_ji_poster.png` ✅ · zine **p01–p06** `cn/hainan/yezi_ji_mini_zine_p*.png` · 池 `song`·`contemporary` → `contemporary` · 全员女性 |
| `jinfeng_paji` | **`republic`** 固定 | 老字号掌柜、长衫茶客 | 角标庄里味道 |
| `haikou_yubao` | **`contemporary`**（海报） | 5 女 · 5料横木牌 · 砂锅鱼煲 | boluo清新风；竖牌**海南味道**；`haikou_yubao_poster.png` ✅ 2026-05-19 · zine p01–p06 |
| `lurou_fan` | **`contemporary`**（海报） | 4 女 · 5料横木牌 · 卤肉盖饭 | boluo清新风·禁穿模；竖牌**海南味道**；`cn/hainan/lurou_fan_poster.png` ✅ 2026-05-19 |
| `zhaicai_bao` | **`contemporary`**（海报） | 4 女 · 6料横木牌 · 海口素煲 | boluo清新风·锅外禁穿模；竖牌**海南味道**；`cn/hainan/zhaicai_bao_poster.png` ✅ 2026-05-19 · zine `contemporary` |
| `majiao_yuwan_tang` | **`contemporary`** 固定 | 同上；文昌铺前鱼丸汤 | 用户指定 |
| `dingan_heizhu` | **`qing`** | 3 女 · 4料横木牌 · 白切黑猪 | 竖牌**海南味道**；boluo清晰风；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 |
| `yanfeng_xianshuiya` | **`republic`** | 1920s 茶客/出城便装 | 池 `qing`·`republic` |
| `huangliu_laoya` | **`republic`** | 4 女 · 5料横木牌 · 砂锅老鸭汤 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 再次重绘 |
| `latang_fan` | **`republic`** 固定 | 水巷口早市 qipao/changshan；辣汤浇饭猪杂 | 角标海口风味 |
| `shishan_yongyang` | **`republic`** 固定 | 石山农家 qipao/changshan；白切清汤壅羊 | 角标海口风味 |
| `shishan_heidoufu` | **`republic`**（海报）· zine `qing` | 海报：石山农家 qipao/changshan 铁锅煎黑豆腐；zine：changshan 便服 | 角标海南风味 |
| `chaobing` | **`qing`**（海报） | 5 女 · 6料横木牌 · 夜市炒冰 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 · zine 池可随机 |
| `dingan_zongzi` | **`republic`** 固定 | 定安黑猪粽；骑楼 qipao/changshan 包粽 | 角标海南风味；用户指定 |
| `lingao_fen` | **`qing`** 固定 | 临高粉酸卤；面馆 changshan 便服牛肉干配料 | 角标海南风味；用户指定 |
| `niunan_fan` | **`qing`** 固定 | 博爱南牛腩饭；changshan 围裙炖锅 | 角标海南风味 |
| `zhujiao_fan` | **`contemporary`** 固定 | 4 女 · 5料横木牌 · 猪脚盖饭 | boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 |
| `wuji_hele` | **`ming`** | 饸饹床面馆短袄围裙 | 角标无极风味 |
| `shenze_rougao` | **`qing`** | 农家厨子 changshan 围裙 | 角标深泽风味 |
| `gaocheng_gongmian` | **`qing`** | 贡面坊精细长衫围裙 | 角标藁城风味 |
| `zhengding_badawan` | **`ming`** | 宴席厨子/食客襦衫 | 角标正定风味 |
| `majia_luji` | **`qing`** | 清真厨子白帽 changshan | 角标正定风味 |
| `zhengding_reqie_wanzi` | **`ming`** | 厨子襦衫围裙 | 角标正定风味 |
| `hot_dog` | **`us_contemporary`** | NYC food cart apron hoodie 2020s | Badge **NYC Flavor** · zine EN ✅ 四套 `mini-zine/us/` 2026-05 |
| `pretzel` | **`us_roaring_20s`** | 1920s newsboy cap suspenders subway cart | Badge **NYC Flavor** · zine EN ✅ 四套 2026-05 |
| `ny_pizza` | 海报 **`us_gilded`** · zine **`us_contemporary`** | 各自定代 | Badge **NYC Flavor** · zine EN ✅ 四套 2026-05 |
| `three_sisters` | **`us_indigenous`**（海报） | 3 女 · 4料横木牌 · 三道姐妹炖 | boluo清新风·**东部林地/易洛魁系**缎带衫（非农场围裙）·禁穿模·**EN**；`us/three_sisters_poster.png` ✅ 2026-05-19 服饰修正 · 强锚定 |
| `cheeseburger` | **`us_80s_nyc`** | 1980s 防风外套、大步裤、街头快餐店围裙（汉堡池 `sum(ord)%4`） | 角标美国味道 |
| `full_english_breakfast` | **`uk_wartime`** 固定 | 4 女 · 6料横木牌 · Full English | boluo清新风·**EN only**·British Flavor；海报 ✅ · zine **p01–p06** `uk/full_english_breakfast_mini_zine_p*.png` · 2026-05-19 |
| `afternoon_tea` | **`uk_edwardian`** 固定 | 4 女 · 6料横木牌 · Afternoon Tea | boluo清新风·**EN only**·British Flavor；海报 ✅ · zine **p01–p06** `uk/afternoon_tea_mini_zine_p*.png` · 2026-05-24 · 禁穿模 |
| `macaron` | **`fr_belle_epoque`**（海报） | 4 女 · 6料横木牌 · Macaron | boluo清新风·**FR**·Paris Flavor；`fr/macaron_poster.png` ✅ 2026-05-24 |
| `baguette` | **`fr_contemporary`**（海报） | **3** 女 · **5**料横木牌 · 法棍 | boluo清新风·**FR**·Paris Flavor·boulangerie L形+four à sole；`fr/baguette_poster.png` ✅ 2026-05-19 重绘 · 禁穿模 |
| `croissant` | **`fr_belle_epoque`**（海报） | **3** 女 · **6**料横木牌 · 可颂 | boluo清新风·**FR**·French Flavor·viennoiserie L形起酥台；`fr/croissant_poster.png` ✅ 2026-05-19 · **非** macaron/pâtissier 台 · 禁穿模 |
| `cheung_fun` | **`republic`** 固定 | **5** 女 · **6**料横木牌 · 鲜虾肠粉 | boluo清新风·竖牌**香港味道**；海报 ✅ 2026-05-19 重绘 · zine **p01–p06** `cn/hongkong/cheung_fun_mini_zine_p*.png` · 早茶强锚定 · 禁穿模 |
| `gangshi_naicha` | **`contemporary`**（海报） | **3** 女 · **5**料横木牌 · 丝袜奶茶 | boluo清新风·竖牌**香港味道**；`cn/hongkong/gangshi_naicha_poster.png` ✅ 2026-05-19 重绘 · 茶餐厅强锚定 · 禁穿模 |
| `ningmeng_cha` | **`contemporary`**（海报） | **3** 女 · **5**料横木牌 · 冻柠茶 | boluo清新风·竖牌**香港味道**；`cn/hongkong/ningmeng_cha_poster.png` ✅ 2026-05-19 重绘 · 茶餐厅强锚定 · 禁穿模 |
| `boluo_bao` | **`contemporary`**（海报） | **4** 女 · **5**料横木牌 · 港式菠萝包 | boluo清新风·竖牌**香港味道**；`cn/hongkong/boluo_bao_poster.png` ✅ 2026-05-19 重绘 · 饼房强锚定 · **非**海南炒饭 · 禁穿模 |
| `bao_zai_fan` | **`contemporary`** 固定 | 4 女 · 6料 · 腊肠排骨煲仔饭 | 竖牌**香港味道**；zine **p01–p06** `cn/hongkong/bao_zai_fan_mini_zine_p*.png` · 2026-05-24 · 庙街冬夜强锚定 · 禁穿模 |
| `gali_yudan` | **`contemporary`**（海报） | **3** 女 · **4**料横木牌 · 咖喱鱼蛋 | boluo清新风·竖牌**香港味道**；`cn/hongkong/gali_yudan_poster.png` ✅ 2026-05-19 重绘 · 旺角街头强锚定 · 禁穿模 |
| `char_siu` | **`contemporary`**（海报） | **4** 女 · **5**料横木牌 · 蜜汁叉烧 | boluo清新风·竖牌**香港味道**；`cn/hongkong/char_siu_poster.png` ✅ 2026-05-19 重绘 · 烧腊铺强锚定 · 禁穿模 |
| `shao_la_fan` | **`contemporary`**（海报） | **5** 女 · **6**料横木牌 · 烧腊双拼饭 | boluo清新风·竖牌**香港味道**；`cn/hongkong/shao_la_fan_poster.png` ✅ 2026-05-19 重绘 · 烧腊快餐强锚定 · 禁穿模 |

### 美国 · `us_*` 英文块（`{DynastyDressEN}`）

| 代号 | 英文块 |
|------|--------|
| `us_indigenous` | `3D chibi respectful Indigenous North American cook: region-matched simplified attire (Southwest Pueblo blanket-pattern apron OR Plains ribbon shirt without sacred war bonnet OR Pacific Northwest formline-pattern apron OR Great Lakes leather-trim apron), dignified cute NOT caricature, NOT Hollywood Indian stereotype, NOT feather headdress mascot, NOT face paint mockery, cooking traditional foods` |
| `us_indigenous_modern` | `3D chibi respectful contemporary Native American chef 2020s: ribbon shirt or tribal-pattern tee, modern kitchen apron, Indigenous-owned restaurant vibe, dignified NOT stereotype, year 2026` |
| `us_colonial` | `3D chibi 1776-1800 American Federal era: tricorn hat simplified, waistcoat, baker apron, colonial market, NOT Chinese hanfu` |
| `us_antebellum` | `3D chibi 1810s-1860 American antebellum: wide-brim hat, work shirt, river town vendor apron, NOT hanfu` |
| `us_gilded` | `3D chibi 1870s-1900 American street vendor: Victorian apron, newsboy cap, German-American baker style, NOT Chinese hanfu` |
| `us_progressive` | `3D chibi 1900s-1910 Progressive Era America: simple suit vest, immigrant deli apron, newsboy cap, NOT hanfu` |
| `us_roaring_20s` | `3D chibi 1920s New York City: newsboy cap, suspenders, rolled sleeves vest, simple flapper-era street clothes, pretzel or deli cart, NOT hanfu` |
| `us_depression_war` | `3D chibi 1930s-1945 America: WPA work clothes, canteen apron, simplified WWII USO cook outfit, NOT hanfu` |
| `us_50s_diner` | `3D chibi 1950s American diner: waitress uniform, soda jerk, poodle skirt simplified, retro diner grill` |
| `us_sixties` | `3D chibi 1960s-70s American roadside diner: mod color-block apron, go-go boots simplified, milkshake bar` |
| `us_80s_nyc` | `3D chibi 1980s New York City street food: windbreaker, baggy pants, pizza or burger shop tee, walkman-era casual, NOT hanfu` |
| `us_90s` | `3D chibi 1990s American street: oversized hoodie, backwards baseball cap, mall food court apron` |
| `us_contemporary` | `3D chibi contemporary 2020s NYC street food: food cart apron, baseball cap, hoodie tourist, year 2026` |

### 英国 · `uk_*` 英文块（`{DynastyDressEN}`）

| 代号 | 英文块 |
|------|--------|
| `uk_wartime` | `3D chibi 1940s-50s British café/greasy spoon cook: white apron, rolled-sleeve blouse, simple hairnet or cap, postwar English kitchen, NOT Chinese hanfu, NOT American diner only` |
| `uk_edwardian` | `3D chibi Edwardian British hotel breakfast cook: white apron, modest long skirt blouse simplified, NOT hanfu` |
| `uk_contemporary` | `3D chibi contemporary 2020s British brunch café: barista apron, casual tee, year 2026 London` |

### 法国 · `fr_*` 英文块（`{DynastyDressEN}`）

| 代号 | 英文块 |
|------|--------|
| `fr_belle_epoque` | `3D chibi Belle Époque Paris pâtissier 1890s-1910: white chef toque, white apron over pastel blouse, marble pastry shop, NOT Chinese hanfu, NOT Hainan tropical` |
| `fr_belle_epoque_viennoiserie` | `3D chibi Belle Époque Paris viennoiserie baker 1890s-1910: white toque, white apron, marble laminating table with rolling pin and butter block, feuilletage croissant workshop, NOT macaron piping station, NOT baguette deck oven` |
| `fr_contemporary` | `3D chibi contemporary 2020s Paris pâtissier: modern chef jacket, Ladurée-style pastel shop, year 2026` |
| `fr_contemporary_boulanger` | `3D chibi contemporary 2020s Paris boulanger: flour-dusted white/cream apron, baker bandana or small toque, warm wood deck-oven boulangerie, NOT pastel pâtissier, NOT macaron shop, year 2026` |

### 西藏 · `xizang_*` 英文块（`{DynastyDressEN}`）

| 代号 | 英文块 |
|------|--------|
| `xizang_pastoral` | `3D chibi respectful Tibetan plateau pastoral cook: simplified chuba robe with apron, braided hair, highland home kitchen, cute dignified NOT caricature, NOT Song/Ming hanfu, avoid excessive religious symbol mockery` |
| `xizang_lhasa_teahouse` | `3D chibi contemporary Lhasa sweet teahouse staff: simplified Tibetan patterned top, white teahouse apron, urban Barkhor teahouse vibe, year 2020s, NOT Hong Kong cha chaan teng, NOT pastoral butter tea churn only` |

| `ramen` | **`jp_heisei`**（`sum(ord)%13`→11；海报 `jp_showa`） | 4 女 · 醤油ラーメン · 東京横丁 | boluo高键·禁穿模；`jp/ramen_poster.png` ✅ · zine **p01–p06** `jp/ramen_mini_zine_p*.png` · 全员女性 |
| `gyoza` | **`jp_showa`**（`sum(ord)%13`→8） | 3 女 · 4料横木牌 · 煎饺 | boluo清新风；竖牌**日本の味**；`jp/gyoza_poster.png` ✅ · zine **p01–p06** `jp/gyoza_mini_zine_p*.png` · 東京 · 全员女性 |
| `sushi` | **`jp_edo`**（海报） | 3 女 · 4料横木牌 · 握り寿司 | boluo清新风；竖牌**日本の味**；`jp/sushi_poster.png` ✅ 2026-05-19 · zine 池 `sum(ord)%4` |
| `xianggelila_songrong` | **`contemporary`** | 围裙卫衣；黄油煎松茸 | 角标**云南风味** · 海报+zine ✅ 四套 · 舌尖 S1E1 |
| `nuodeng_huotui` | pool → **`ming`** | 明制短袄；手切诺邓火腿 | 竖牌**云南味道**；舌尖 S1E1 ✅ |
| `qiguo_ji` | **`qing`** | 昆明汽锅鸡；紫陶汽锅 changshan | 角标**云南风味** · zine ✅ 四套 · 舌尖 S1E5 |
| `suichang_dongsun` | pool → **`ming`** | 明制短袄；遂昌冬笋 | 竖牌**浙江味道**；舌尖 S1E1 ✅ |
| `huangdou_suansun_xiaohuangyu` | pool → **`contemporary`** | 围裙；酸笋小黄鱼 | 竖牌**广西味道**；舌尖 S1E1 ✅ |
| `jiayu_lianou` | pool → **`ming`** | 明制；嘉鱼莲藕汤 | 竖牌**湖北味道**；舌尖 S1E1 ✅ |
| `chaganhu_dongji_buyu` | pool → **`qing`** | changshan；查干湖头鱼蒸熟 | 竖牌**吉林味道**；海报 ✅ 2026-05 重绘（熟鱼装盘） |
| `nanhai_yuanyang_yu` | pool → **`republic`** | qipao/changshan；南海远洋渔获 | 竖牌**海南味道**；舌尖 S1E1 ✅ |
| `yangzhou_chaofan` | **`contemporary`**（海报） | 4 女 · 6料横木牌 · 扬州炒饭 | boluo清新风·锅边禁穿模；竖牌**江苏味道**；`cn/jiangsu/yangzhou_chaofan_poster.png` ✅ 2026-05-19 |
| `lachang_chaofan` | **`song`** | 3 女 · 4料横木牌 | 腊肠炒饭；竖牌**广东味道**；仅 `_poster.png` · `cn/guangdong/` ✅ 2026-05-21 重绘 |
| `chashao_chaofan` | **`song`** | 宋服 · 3 女 · 4 料异器皿+横木牌 | 竖牌**广东味道**；`cn/guangdong/` ✅ 2026-05 |
| `dan_chaofan` | **`song`** 固定 | 宋服炒锅 · 3 女锅边 | 竖牌**中国味道** · zine **p01–p06** `cn/jiangsu/dan_chaofan_mini_zine_p*.png` · 全员女性 · 禁穿模 |
| `jiangyou_chaofan` | **`contemporary`** 固定 | 当代厨房围裙 · 3 女锅边 | 竖牌**中国味道** · zine **p01–p06** `cn/jiangsu/jiangyou_chaofan_mini_zine_p*.png` · 全员女性 · 禁穿模 |
| `fanqie_dan_chaofan` | **`song`** | 宋服炒锅 · 3 女锅边 | 竖牌**江苏味道**；海报 ✅ 2026-05 重绘（人物不进锅） |
| `congyou_chaofan` | **`song`** | 宋服 · 3 女 · 4碗横木牌 | 竖牌**浙江味道**；`cn/zhejiang/` ✅ 2026-05 横木牌重绘 |
| `shijin_chaofan` | **`contemporary`** | 当代围裙 | 竖牌**中国味道** |
| `xuecai_rousichao` | **`song`** | 宋服 · 3 女 · 底行4碗 | 竖牌**浙江味道**；`cn/zhejiang/` ✅ 2026-05 重绘 |
| `meigan_cai_chaofan` | **`song`** | 宋服 · 3 女 · 4料异器皿+横木牌 | 竖牌**浙江味道**；`cn/zhejiang/` ✅ 2026-05 重绘 |
| `xiaren_dan_chaofan` | **`ming`**（海报） | 3 女 · 4料横木牌 · 虾仁蛋炒饭 | boluo清新风·锅边禁穿模；竖牌**江苏味道**；`cn/jiangsu/xiaren_dan_chaofan_poster.png` ✅ 2026-05-19 穿模修正 |
| `xianyu_jili_chaofan` | **`song`**（海报） | 4 女 · 5料横木牌 · 咸鱼鸡粒炒饭 | boluo清新风·锅边禁穿模；竖牌**广东味道**；`cn/guangdong/xianyu_jili_chaofan_poster.png` ✅ 2026-05-19 |
| `haixian_chaofan` | **`contemporary`** | 当代围裙 | 竖牌**广东味道** |
| `boluo_chaofan` | **`ming`** | 4 女 · 5料横木牌 | **boluo清新风主锚** `boluo_chaofan_poster.png`（用户定调清新明亮）；§boluo · `cn/hainan/` ✅ |
| `lingao_kaoruzhu` | **`republic`** | 4 女 · 4料横木牌 | 临高烤乳猪；boluo清晰风；竖牌**海南味道**；仅 `_poster.png` · `cn/hainan/` ✅ 2026-05-19 重绘 |
| `gali_chaofan` | **`ming`**（海报） | 4 女 · 5料横木牌 · 咖喱炒饭 | boluo清新风·锅边禁穿模；竖牌**广东味道**；`cn/guangdong/gali_chaofan_poster.png` ✅ 2026-05-19 |
| `fujian_chaofan` | **`song`** | 宋服 · 4 女 · 底行5碗 | 竖牌**福建味道**；`cn/fujian/` ✅ 2026-05 |
| `chaoshan_chaofan` | **`contemporary`** | 当代 · 4 女 · 4碗木牌 | 竖牌**广东味道**；`cn/guangdong/` ✅ 2026-05 木牌重绘 |
| `larou_chaofan` | **`song`** | 宋服 | 竖牌**湖南味道** · `cn/hunan/` |
| `niurou_chaofan` | **`ming`** | 明服 | 竖牌**四川味道** · zine ✅ `cn/sichuan/` |
| `laziji_chaofan` | **`song`** | 宋服 | 竖牌**四川味道** · zine ✅ `cn/sichuan/` |
| `duojiao_chaofan` | **`contemporary`**（海报） | 3 女 · 4料横木牌 · 剁椒炒饭 | boluo清新风·锅边禁穿模；竖牌**湖南味道**；`cn/hunan/duojiao_chaofan_poster.png` ✅ 2026-05-19 |
| `mutong_fan` | **`contemporary`**（海报） | 4 女 · 5料横木牌 · 木桶蒸饭 | boluo清新风·禁穿模；竖牌**湖南味道**；`cn/hunan/mutong_fan_poster.png` ✅ 2026-05-19 |
| `suanhua_chaofan` | **`song`** | 宋服 · 3 女 · 底行4碗 | 竖牌**东北味道**；`cn/liaoning/` ✅ 2026-05 全量重绘 |
| `paocai_chaofan` | **`contemporary`** | 当代围裙 · 3 女 · 底行4碗 | 竖牌**东北味道**；`cn/liaoning/` ✅ 2026-05 |
| `yangrou_chaofan` | **`ming`** | 明服 · 3 女 · 4料异器皿+横木牌 | 竖牌**新疆味道**；`cn/xinjiang/` ✅ 2026-05 重绘 |
| `zhuafan` | **`contemporary`**（海报） | 4 女 · 6料横木牌 · 羊肉抓饭 | boluo清新风·竖牌**新疆味道**；`cn/xinjiang/zhuafan_poster.png` ✅ 2026-05-24 · 维吾尔简式厨房服 · 焖饭强锚定 · 禁穿模 |
| `latiaozi` | **`contemporary`**（海报） | 4 女 · **5**料横木牌 · 过油肉拉条子 | boluo清新风·竖牌**新疆味道**；`cn/xinjiang/latiaozi_poster.png` ✅ 2026-05-19 · 维吾尔简式面馆服 · 手拉面强锚定 · 禁穿模 |
| `nang` | **`contemporary`**（海报） | 4 女 · **5**料横木牌 · 芝麻大馕 | boluo清新风·竖牌**新疆味道**；`cn/xinjiang/nang_poster.png` ✅ 2026-05-19 · 维吾尔简式馕铺服 · 馕坑强锚定 · 禁穿模 |
| `zanba` | **`xizang_pastoral`**（海报） | 4 女 · 6料横木牌 · 糌粑 | boluo清新风·竖牌**西藏味道**；`cn/xizang/zanba_poster.png` ✅ 2026-05-24 · 简化藏袍 · 禁穿模 |
| `suyoucha` | **`xizang_pastoral`**（海报） | 4 女 · 6料横木牌 · 酥油茶 | boluo清新风·竖牌**西藏味道**；`cn/xizang/suyoucha_poster.png` ✅ 2026-05-24 · 与糌粑同时代 · 禁穿模 |
| `tiancha` | **`contemporary`**（海报） | 4 女 · 6料横木牌 · 拉萨甜茶 | boluo清新风·竖牌**拉萨味道**；`cn/xizang/tiancha_poster.png` ✅ 2026-05-24 · 甜茶馆强锚定 · 禁穿模 |
| `qingke_jiu` | **`xizang_pastoral`**（海报） | 4 女 · 6料横木牌 · 青稞酒 | boluo清新风·竖牌**西藏味道**；`cn/xizang/qingke_jiu_poster.png` ✅ 2026-05-24 · 节庆待客 · 禁穿模 |
| `douhua_xian` | **`song`** | 早点铺宋服 | 竖牌**中国味道** · `cn/jiangsu/` |
| `douhua_tian` | **`contemporary`** | 糖水店 · 3 女 · 4料横木牌 | 甜豆花；竖牌**广东味道**；仅 `_poster.png` · `cn/guangdong/` ✅ 2026-05-21 重绘 |
| `sichuan_douhua` | **`qing`** | 川味早点 changshan 蘸水 | 竖牌**四川味道** · zine ✅ `cn/sichuan/` |
| `tianjin_doufunao` | **`contemporary`** | 津门早点围裙 · 无油条 | 竖牌**天津味道**；`cn/hebei/` ✅ 2026-05 去油条重绘 |
| `leshan_douhua` | **`contemporary`** | 乐山小吃摊围裙 | 竖牌**四川味道** · zine ✅ `cn/sichuan/` |
| `mapo_doufu` | **`qing`** | 清川菜馆 changshan 围裙炒锅 | 竖牌**四川味道** · zine ✅ `cn/sichuan/` |
| `yuxiang_doufu` | **`qing`** | 同麻婆川味 changshan | 竖牌**四川味道** · zine ✅ `cn/sichuan/` |
| `jiachang_doufu` | **`contemporary`** 固定 | 当代家庭厨房围裙 · 4 女 · 5碗 | 竖牌**河北味道**；海报 ✅ · zine **p01–p06** `cn/hebei/jiachang_doufu_mini_zine_p*.png` · 2026-05-24 · 菜名「家常」强锚定 · 禁穿模 |
| `shaguo_doufu` | **`contemporary`** | 砂锅灶围裙 | 竖牌**河北味道** |
| `hongshao_doufu` | **`song`** | 宋服炒锅 | 竖牌**中国味道** · `cn/jiangsu/` |
| `dongpo_doufu` | **`song`** | 宋服 · 4 女 · 底行4碗+木牌料签 | 竖牌**浙江味道**；`cn/zhejiang/` ✅ 2026-05 木牌重绘 |
| `xiefen_doufu` | **`ming`** | 明服蟹宴 · 4 女 · 底行5碗 | 竖牌**浙江味道**；`cn/zhejiang/` ✅ 2026-05 重绘 |
| `wensi_doufu` | **`song`** | 淮扬刀工宋服 | 竖牌**江苏味道**；强锚定 |
| `niang_doufu` | **`song`** | 4 女 · 5料横木牌 | 客家酿豆腐；竖牌**广东味道**；仅 `_poster.png` · `cn/guangdong/` ✅ 2026-05-21 重绘 |
| `tieban_doufu` | **`song`** | 宋服夜市铁板 | 竖牌**中国味道** |
| `jijiao_gan_doufu` | **`song`** | 宋服 · 3 女 · 底行4碗 | 竖牌**东北味道**；`cn/liaoning/` ✅ 2026-05 |
| `pidan_doufu` | **`contemporary`** | 凉菜当代围裙卫衣 · 3 女桌边 | 竖牌**江苏味道**；海报 ✅ 2026-05 重绘（人物不进盘） |
| `jiyu_doufu_tang` | **`ming`** | 明服汤锅 · 4 女锅边 | 竖牌**江苏味道**；海报 ✅ 2026-05 重绘 |
| `yutou_doufu_tang` | **`contemporary`** | 当代汤锅 | 竖牌**湖南味道** |
| `baicai_dong_doufu` | **`ming`** | 明服炖锅 · 3 女 · 底行4碗 | 竖牌**东北味道**；`cn/liaoning/` ✅ 2026-05 |
| `changsha_choudoufu` | **`song`** | 夜市宋服 | 竖牌**湖南味道** |
| `shaoxing_choudoufu` | **`song`** | 江南宋服 | 竖牌**浙江味道** |
| `maodoufu` | **`song`** | 徽州宋服 | 竖牌**安徽味道** · `cn/anhui/` |
| `you_doufu_niang` | **`song`** | 闽赣宋服 · 3 女 · 底行4碗 | 竖牌**福建味道**；`cn/fujian/` ✅ 2026-05 |
| `zha_doufu` | **`contemporary`**（海报） | 3 女 · 4料横木牌 · 炸豆腐 | boluo清新风·摊边禁穿模；竖牌**江苏味道**；`cn/jiangsu/zha_doufu_poster.png` ✅ 2026-05-19 |
| `tonkotsu_ramen` | **`jp_showa`**（`sum(ord)%13`→8） | 白濁豚骨·細麺·かえ玉·池袋 | zine **p01–p06** `jp/tonkotsu_ramen_mini_zine_p*.png` · 東京の味 · 全员女性 · boluo 高键 |
| `okinawa_soba` | **`jp_nara_heian`** | `sum(ord)%13`·冲绳 | 角标**沖縄の味** · zine ✅ |
| `rafute` | **`jp_90s`**（`sum(ord)%13`→10；海报 `jp_taisho`） | 4 女 · 泡盛黒糖豚バラ · 首里城/碧海 | 竖牌**沖縄の味**；`jp/rafute_poster.png` ✅ · zine **p01–p06** `jp/rafute_mini_zine_p*.png` · 全员女性 |

**日本 mini-zine**（`jp/`）：属地定画面 → 服饰 **13 档全集** `sum(ord(slug))%13`（例 `gyoza`→`jp_edo`）；**不用**下表强锚定/场景池。见 [mini-zine-dynasty-chibi.md](../../../docs/style/mini-zine-dynasty-chibi.md) §日本 mini-zine 定调。

### 日本 · `jp_*` 英文块（`{DynastyDressEN}`）

默认句首加：`cute female 3D chibi figurine 2.5-3 head ratio,` … `NOT Chinese hanfu`

| 代号 | 英文块 |
|------|--------|
| `jp_ancient` | `cute female 3D chibi ancient Japan Yayoi-Kofun: simplified kimono, straw apron, clay pot cooking, rice ritual, NOT samurai armor` |
| `jp_nara_heian` | `cute female 3D chibi Nara-Heian court Japan: simplified junihitoe or kosode, gentle court cook, wagashi tray, NOT Chinese hanfu` |
| `jp_kamakura` | `cute female 3D chibi Kamakura Japan: simplified samurai-era apron over kosode, Zen temple vegetarian cook, wooden bowl` |
| `jp_muromachi` | `cute female 3D chibi Muromachi Japan: tea ceremony host apron, merchant kosode, matcha whisk, wabi-sabi simple clothes` |
| `jp_edo` | `cute female 3D chibi Edo period Japan: yukata or merchant kosode, tenugui headband, geta simplified, soba udon shop` |
| `jp_meiji` | `cute female 3D chibi Meiji Japan: Western vest over kimono, student cap, railroad bento vendor apron, early Western-Japanese cafe` |
| `jp_taisho` | `cute female 3D chibi Taisho Japan 1910s-20s: romantic cafe apron, cloche hat simplified, gyoza street stall, Western-Japanese mix` |
| `jp_showa_early` | `cute female 3D chibi prewar Showa Japan 1920s-40s: old diner apron, urban canteen cook, simple kimono-western mix` |
| `jp_showa` | `cute female 3D chibi postwar Showa Japan 1950s-70s: ramen-ya white apron, hachimaki headband, yatai stall, NOT Chinese chef hat` |
| `jp_80s` | `cute female 3D chibi 1980s Japan bubble era: shoulder-pad casual, family restaurant uniform, bright mall food court` |
| `jp_90s` | `cute female 3D chibi 1990s Japan: loose streetwear, konbini culture apron, casual Tokyo` |
| `jp_heisei` | `cute female 3D chibi Heisei Japan 2000s-2010s: delivery apron, chain izakaya uniform, casual hoodie` |
| `jp_contemporary` | `cute female 3D chibi Reiwa Japan 2020s: ramen gyoza shop tee, modern kitchen apron, year 2026 Tokyo` |

新菜无行 → **日本 mini-zine**：属地 + `sum(ord)%13`；**日本海报**：强锚定 → 场景池；**美国** §美国；**中国** §候选池。

## Prompt 粘贴块（`{DynastyDressEN}`）

| 代号 | 英文块 |
|------|--------|
| `song` | `3D chibi Song dynasty hanfu: banbi, panling, pleated skirt, futou hair bun, scholar or gentle eater, match West Lake zine reference` |
| `tang` | `3D chibi Tang dynasty: round-collar robe, ruqun, futou, lively Chang'an street eater` |
| `han` | `3D chibi Han dynasty: quju-style simplified robe, hair bun, central plains market` |
| `ming` | `3D chibi Ming dynasty: standing-collar short jacket, apron, head towel, noodle shop worker` |
| `qing` | `3D chibi late Qing: changshan, vest, small cap, teahouse civilian` |
| `republic` | `3D chibi 1920s-40s Republican South China: qipao or changshan, teahouse guest, qilou street` |
| `prc_50s` | `3D chibi 1950s-70s China: zhongshan suit or blue work clothes, enamel mug, canteen worker` |
| `prc_80s` | `3D chibi 1980s-90s China: floral shirt, apron, small private restaurant cook` |
| `prc_2000s` | `3D chibi 2000s China: casual t-shirt, jeans, food court apron` |
| `contemporary` | `3D chibi contemporary 2020s China street food: hoodie or delivery vest, night market apron, baseball cap, modern casual, year 2026 vibe` |
| `ethnic` | `All cute female 3D chibi in respectful simplified Li ethnic Hainan attire: black indigo jacket with colorful embroidered trim, silver hair ornaments, woven skirt elements, dignified festival cook NOT caricature NOT stereotype` |
| `yuan` | `3D chibi Yuan dynasty: simplified Mongol-influenced robe, belt, pastoral eater` |
| `pre_qin` | `3D chibi pre-Qin simplified shenyi ritual guest, archaic minimal` |

## 参考图顺序

1. `_templates/487c2f*.jpg`（构图 + 宋服参考，**服饰以时代代号为准**）  
2. 同 slug 已入库 `*_mini_zine.png`（本套 zine 内同时代）  
3. 海报 `_poster.png` 仅参考**版式**；**服饰不跟海报走**，除非用户要求对齐

**锁定范围**：同 slug **四套 zine** 同时代；**不强制**与海报同时代。

## Python 式随机（伪代码）

```python
pool = ["ming", "qing", "contemporary"]  # from 候选池表
slug = "bannianmian"
era = pool[sum(ord(c) for c in slug) % len(pool)]
```
