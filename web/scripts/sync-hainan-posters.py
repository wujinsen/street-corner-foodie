# -*- coding: utf-8 -*-
"""Sync web posters.json + poster-meta EXTRA from hainan.md gourmet_posters (skips *_redraw*)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
HAINAN_MD = REPO / "docs" / "china" / "hainan.md"
POSTERS_JSON = ROOT / "posters.json"
GEN_SCRIPT = ROOT / "generate-meta-placeholders.py"

# Poster era per food-poster-dynasty-chibi (independent of mini-zine era)
POSTER_ERA: dict[str, str] = {
    "wenchang_jifan": "song",
    "hainan_jifan": "song",
    "qingbuliang": "republic",
    "yezi_ji": "contemporary",
    "zaopocu_huoguo": "contemporary",
    "houan_fen": "republic",
    "lingshui_suanfen": "ming",
    "dingan_heizhu": "qing",
    "huangliu_laoya": "republic",
    "lingao_kaoruzhu": "republic",
    "niunan_fan": "qing",
    "zhujiao_fan": "contemporary",
    "lurou_fan": "contemporary",
    "majiao_yuwan_tang": "contemporary",
    "zhaicai_bao": "contemporary",
    "puqian_majiao": "qing",
    "puqian_majiao_gan": "qing",
    "qionghai_xiangcao_ya": "republic",
    "changliu_suanfen": "ming",
    "jiazi_fen": "ming",
    "latang_fan": "republic",
    "shishan_yongyang": "republic",
    "shishan_heidoufu": "republic",
    "chaobing": "qing",
    "dingan_zongzi": "republic",
    "lingao_fen": "qing",
}

META: dict[str, dict] = {
    "wenchang_jifan": {
        "name": {"zh": "文昌鸡", "en": "Wenchang Chicken", "ja": "文昌チキン"},
        "tags": {"zh": ["清甜", "皮爽"], "en": ["Sweet", "Silky"], "ja": ["甘み", "つるん"]},
        "pin": "海南·文昌",
        "desc": {
            "zh": "海南四大名菜之首，皮黄爽脆，肉嫩骨香。配姜蓉、沙姜与青桔，灵魂在蘸料。",
            "en": "Top of Hainan's four classics — golden silky skin, tender chicken, ginger-lime dip.",
            "ja": "海南四大名菜の筆頭。黄金の皮としっとり肉。",
        },
    },
    "qingbuliang": {
        "name": {"zh": "清补凉", "en": "Qingbuliang", "ja": "チンプーリャン"},
        "tags": {"zh": ["椰奶", "解暑"], "en": ["Coconut", "Cooling"], "ja": ["ココナッツ", "暑気払い"]},
        "pin": "海南·海口",
        "desc": {
            "zh": "海南消暑神器，椰奶/糖水浇红豆、芋头、西瓜、绿豆、薏米。",
            "en": "Hainan's iconic cooler — coconut milk over taro, beans, fruits.",
            "ja": "海南の夏の定番。ココナッツミルクと豆と芋。",
        },
    },
    "yezi_ji": {
        "name": {"zh": "椰子鸡", "en": "Coconut Chicken", "ja": "ココナッツチキン"},
        "tags": {"zh": ["椰香", "清润"], "en": ["Coconut", "Mellow"], "ja": ["ココナッツ", "まろやか"]},
        "pin": "海南·海口",
        "desc": {
            "zh": "用文昌鸡与新鲜椰青同煮，汤色清澈，椰香入肉，蘸豉油与小米辣。",
            "en": "Wenchang chicken simmered in young coconut — clear broth, fragrant.",
            "ja": "文昌鶏とココナッツの澄まし鍋。",
        },
    },
    "houan_fen": {
        "name": {"zh": "后安粉", "en": "Houan Fen", "ja": "フーアン米麺"},
        "tags": {"zh": ["清汤", "白胡椒"], "en": ["Clear-soup", "Pepper"], "ja": ["澄まし", "白胡椒"]},
        "pin": "海南·万宁",
        "desc": {
            "zh": "万宁后安镇粉汤，骨汤清亮，白胡椒香气足，配粗米粉与肉片。",
            "en": "Wanning's clear-broth rice noodles — peppery, clean.",
            "ja": "万寧後安の澄まし米麺、白胡椒の香り。",
        },
    },
    "lingshui_suanfen": {
        "name": {"zh": "陵水酸粉", "en": "Lingshui Suanfen", "ja": "陵水酸粉"},
        "tags": {"zh": ["酸辣", "粉嫩"], "en": ["Sour-spicy", "Tender"], "ja": ["酸辣", "しなやか"]},
        "pin": "海南·陵水",
        "desc": {
            "zh": "陵水代表小吃，酸甜辣三味交织，配花生、芝麻与海味。",
            "en": "Lingshui's sour-spicy noodles, tossed with peanuts & seafood.",
            "ja": "陵水の酸甘辛麺、ピーナッツ＆海鮮。",
        },
    },
    "dingan_heizhu": {
        "name": {"zh": "定安黑猪", "en": "Dingan Black Pork", "ja": "定安黒豚"},
        "tags": {"zh": ["浓香", "本地"], "en": ["Rich", "Local"], "ja": ["濃厚", "地元"]},
        "pin": "海南·定安",
        "desc": {
            "zh": "定安特产黑猪，肉质紧实甘香，常做白切或卤味。",
            "en": "Dingan's heritage black pork — firm, fragrant, classic boiled.",
            "ja": "定安名物の黒豚、白切が定番。",
        },
    },
    "huangliu_laoya": {
        "name": {"zh": "黄流老鸭", "en": "Huangliu Old Duck", "ja": "黄流老鴨"},
        "tags": {"zh": ["醇香", "汤鲜"], "en": ["Mellow", "Broth"], "ja": ["まろやか", "出汁"]},
        "pin": "海南·乐东",
        "desc": {
            "zh": "乐东黄流镇老鸭名菜，慢炖入味，汤清肉香。",
            "en": "Ledong Huangliu's aged-duck classic, slow-simmered.",
            "ja": "楽東黄流の老鴨、じっくり煮込み。",
        },
    },
    "lingao_kaoruzhu": {
        "name": {"zh": "临高烤乳猪", "en": "Lingao Suckling Pig", "ja": "臨高子豚焼"},
        "tags": {"zh": ["脆皮", "炭烤"], "en": ["Crispy", "Charcoal"], "ja": ["パリパリ", "炭火"]},
        "pin": "海南·临高",
        "desc": {
            "zh": "临高名菜，乳猪炭火慢烤至皮脆肉嫩，金黄油亮。",
            "en": "Lingao's whole-roast suckling pig, crackling-skinned.",
            "ja": "臨高の子豚炭火焼、パリパリ。",
        },
    },
    "hainan_jifan": {
        "name": {"zh": "海南鸡饭", "en": "Hainan Chicken Rice", "ja": "海南チキンライス"},
        "tags": {"zh": ["清甜", "鸡油饭"], "en": ["Sweet", "Chicken rice"], "ja": ["甘み", "鶏油飯"]},
        "pin": "海南·海口",
        "desc": {
            "zh": "与文昌鸡一脉，鸡油饭 + 白切鸡 + 蘸料，简餐店普及。",
            "en": "Chicken-oil rice with poached chicken and dipping sauces.",
            "ja": "文昌鶏系の鶏油飯と白切鶏。",
        },
    },
    "zaopocu_huoguo": {
        "name": {"zh": "糟粕醋火锅", "en": "Zaopocu Hot Pot", "ja": "糟粕醋火鍋"},
        "tags": {"zh": ["酸辣", "海鲜"], "en": ["Sour-spicy", "Seafood"], "ja": ["酸辣", "海鮮"]},
        "pin": "海南·海口",
        "desc": {
            "zh": "发酵米糟醋为底，酸辣鲜香，涮海鲜与内脏。",
            "en": "Fermented rice-vinegar broth — sour, spicy, seafood hot pot.",
            "ja": "発酵酢の鍋、海鮮をしゃぶしゃぶ。",
        },
    },
    "niunan_fan": {
        "name": {"zh": "牛腩饭", "en": "Beef Brisket Rice", "ja": "牛ブリスケット飯"},
        "tags": {"zh": ["咸香", "软烂"], "en": ["Savory", "Tender"], "ja": ["塩辛", "ほろほろ"]},
        "pin": "海南·海口",
        "desc": {
            "zh": "博爱南路傍晚档口代表，牛腩炖至软烂，浓汁浇饭。",
            "en": "Haikou classic — tender brisket and rich gravy over rice.",
            "ja": "海口の牛腩飯、柔らかブリスケット。",
        },
    },
    "zhujiao_fan": {
        "name": {"zh": "猪脚饭", "en": "Pork Trotter Rice", "ja": "豚足飯"},
        "tags": {"zh": ["卤香", "软糯"], "en": ["Braised", "Tender"], "ja": ["煮込み", "とろとろ"]},
        "pin": "海南·海口",
        "desc": {
            "zh": "猪脚卤至软烂脱骨，配酸菜、卤蛋，简餐店常见。",
            "en": "Braised trotter over rice with pickles and egg.",
            "ja": "柔らか豚足丼、漬物と卵。",
        },
    },
    "lurou_fan": {
        "name": {"zh": "卤肉饭", "en": "Braised Pork Rice", "ja": "ルーローファン"},
        "tags": {"zh": ["咸香", "卤味"], "en": ["Savory", "Braised"], "ja": ["塩辛", "煮込み"]},
        "pin": "海南·海口",
        "desc": {"zh": "卤香浓郁，五花肉卤制切片，卤汁浇饭。", "en": "Savory braised pork over rice.", "ja": "香ばしい煮込み豚肉丼。"},
    },
    "majiao_yuwan_tang": {
        "name": {"zh": "马鲛鱼丸汤", "en": "Mackerel Fish Ball Soup", "ja": "サワラの魚団子スープ"},
        "tags": {"zh": ["鲜甜", "弹牙"], "en": ["Fresh", "Bouncy"], "ja": ["甘み", "弾力"]},
        "pin": "海南·文昌",
        "desc": {
            "zh": "铺前马鲛制丸，汤清味鲜，鱼丸弹牙，家常配汤。",
            "en": "Wenchang mackerel balls in clear fragrant broth.",
            "ja": "文昌のサワラ団子、澄んだスープ。",
        },
    },
    "zhaicai_bao": {
        "name": {"zh": "斋菜煲", "en": "Vegetarian Clay Pot", "ja": "菜食鍋"},
        "tags": {"zh": ["素斋", "年节"], "en": ["Vegetarian", "Festival"], "ja": ["精進", "年節"]},
        "pin": "海南·海口",
        "desc": {
            "zh": "海口传统素煲，腐竹粉丝木耳时蔬同煲，年节家宴常见。",
            "en": "Haikou's mixed vegetarian clay pot for festivals.",
            "ja": "海口の精進鍋、豆腐と野菜。",
        },
    },
    "puqian_majiao": {
        "name": {"zh": "铺前马鲛鱼", "en": "Puqian Mackerel", "ja": "鋪前サワラ"},
        "tags": {"zh": ["鲜香", "煎烤"], "en": ["Fresh", "Pan-fried"], "ja": ["旨み", "焼き"]},
        "pin": "海南·文昌",
        "desc": {
            "zh": "文昌铺前鲜马鲛厚片香煎，蒜瓣鱼肉肥美紧致。",
            "en": "Thick pan-fried Puqian mackerel — firm and savory.",
            "ja": "鋪前のサワラ厚切り焼き。",
        },
    },
    "puqian_majiao_gan": {
        "name": {"zh": "铺前马鲛鱼干", "en": "Dried Puqian Mackerel", "ja": "鋪前サワラ干し"},
        "tags": {"zh": ["干香", "配粥"], "en": ["Dried", "Savory"], "ja": ["干物", "粥"]},
        "pin": "海南·文昌",
        "desc": {
            "zh": "鲜马鲛晒制或盐渍成干，蒸煎煲粥均可，伴手礼常见。",
            "en": "Sun-dried mackerel — steam, fry, or congee.",
            "ja": "干しサワラ、蒸し・焼き・粥に。",
        },
    },
    "qionghai_xiangcao_ya": {
        "name": {"zh": "琼海香草鸭", "en": "Qionghai Herb Duck", "ja": "琼海香草鴨"},
        "tags": {"zh": ["香草", "皮香"], "en": ["Herbal", "Aromatic"], "ja": ["ハーブ", "香り"]},
        "pin": "海南·琼海",
        "desc": {
            "zh": "琼海香草与香料焖炖，皮香肉嫩，宴席农家菜常见。",
            "en": "Qionghai duck braised with local herbs.",
            "ja": "琼海の香草ダック、香草が香る。",
        },
    },
    "changliu_suanfen": {
        "name": {"zh": "长流酸粉", "en": "Changliu Sour Noodles", "ja": "長流酸粉"},
        "tags": {"zh": ["酸甜", "冰凉"], "en": ["Sweet-sour", "Cold"], "ja": ["酸甘", "冷たい"]},
        "pin": "海南·秀英",
        "desc": {
            "zh": "秀英长流厚宽粉条凉拌，米醋蒜头油、牛肉干与酸菜，夏日消暑。",
            "en": "Changliu's thick cold noodles — vinegar, pickles, beef jerky.",
            "ja": "長流の太麺冷やし、酢と牛肉干。",
        },
    },
    "jiazi_fen": {
        "name": {"zh": "甲子粉", "en": "Jiazi Noodles", "ja": "甲子粉"},
        "tags": {"zh": ["韧滑", "卤香"], "en": ["Chewy", "Savory"], "ja": ["コシ", "煮汁"]},
        "pin": "海南·琼山",
        "desc": {
            "zh": "琼山甲子镇粉条韧滑，腌粉干拌或粑条汤，配料丰富。",
            "en": "Jiazi's chewy noodles — dry tossed or in soup.",
            "ja": "甲子のコシある麺、干拌いかスープ。",
        },
    },
    "latang_fan": {
        "name": {"zh": "辣汤饭", "en": "Spicy Soup Rice", "ja": "辣湯飯"},
        "tags": {"zh": ["辣汤", "早食"], "en": ["Spicy", "Breakfast"], "ja": ["辛い", "朝食"]},
        "pin": "海南·海口",
        "desc": {
            "zh": "水巷口传统早餐，辣汤配猪杂猪血浇饭，胡椒浓香暖胃。",
            "en": "Shuixiangkou breakfast — spicy offal soup over rice.",
            "ja": "水巷口の朝食、辛いスープ丼。",
        },
    },
    "shishan_yongyang": {
        "name": {"zh": "石山壅羊", "en": "Shishan Goat", "ja": "石山ヤギ"},
        "tags": {"zh": ["清淡", "白切"], "en": ["Mild", "Poached"], "ja": ["淡白", "茹で"]},
        "pin": "海南·秀英",
        "desc": {
            "zh": "石山火山岩区放牧山羊，膻味轻，白切清汤皆宜。",
            "en": "Shishan volcanic pasture goat — mild, clean flavor.",
            "ja": "石山の山羊、さっぱり白切。",
        },
    },
    "shishan_heidoufu": {
        "name": {"zh": "石山黑豆腐", "en": "Shishan Black Tofu", "ja": "石山黒豆腐"},
        "tags": {"zh": ["豆香", "外酥"], "en": ["Nutty", "Crispy"], "ja": ["豆香", "カリッ"]},
        "pin": "海南·秀英",
        "desc": {
            "zh": "火山富硒黑豆石磨，铁锅煎至两面金黄，外酥里嫩。",
            "en": "Volcanic black-bean tofu pan-fried golden.",
            "ja": "火山性黒豆豆腐、鉄鍋焼き。",
        },
    },
    "chaobing": {
        "name": {"zh": "炒冰", "en": "Shaved Ice", "ja": "炒冰"},
        "tags": {"zh": ["冰沙", "夜市"], "en": ["Shaved ice", "Night market"], "ja": ["かき氷", "夜市"]},
        "pin": "海南·海口",
        "desc": {
            "zh": "鲜果或椰奶炒成冰沙，加炼乳椰果，夜市消暑标配。",
            "en": "Hainan night-market shaved ice with fruit and coconut.",
            "ja": "海南夜市のフルーツ炒冰。",
        },
    },
    "dingan_zongzi": {
        "name": {"zh": "定安粽子", "en": "Dingan Zongzi", "ja": "定安ちまき"},
        "tags": {"zh": ["咸香", "黑猪"], "en": ["Savory", "Pork"], "ja": ["塩味", "豚肉"]},
        "pin": "海南·定安",
        "desc": {
            "zh": "定安黑猪肉粽，糯米咸香馅料饱满，端午与伴手礼代表。",
            "en": "Dingan black-pork sticky rice dumplings.",
            "ja": "定安の黒豚肉ちまき。",
        },
    },
    "lingao_fen": {
        "name": {"zh": "临高粉", "en": "Lingao Rice Noodles", "ja": "臨高粉"},
        "tags": {"zh": ["酸卤", "早餐"], "en": ["Tangy", "Breakfast"], "ja": ["酸っぱい", "朝食"]},
        "pin": "海南·临高",
        "desc": {
            "zh": "临高米粉配酸咸卤汁，牛肉干、肉片、酸菜、花生。",
            "en": "Lingao noodles with sour gravy and toppings.",
            "ja": "臨高の米麺、酸っぱい卤汁。",
        },
    },
    "hainan_fen": {
        "name": {"zh": "海南粉", "en": "Hainan Rice Noodles", "ja": "海南粉"},
        "tags": {"zh": ["卤香", "街头"], "en": ["Savory", "Street"], "ja": ["煮汁", "屋台"]},
        "pin": "海南·海口",
        "desc": {"zh": "细米粉配卤汁、花生、酸菜、牛肉干，海口街头代表。", "en": "Thin noodles with gravy, peanuts, pickles, jerky.", "ja": "細麺に卤汁とピーナッツ。"},
    },
    "hainan_yanfen": {
        "name": {"zh": "海南腌粉", "en": "Hainan Pickled Noodles", "ja": "海南腌粉"},
        "tags": {"zh": ["酸辣", "开胃"], "en": ["Sour-spicy", "Refreshing"], "ja": ["酸辣", "さっぱり"]},
        "pin": "海南·海口",
        "desc": {"zh": "干拌腌粉，酸笋、腌菜、炸酥，夏季开胃。", "en": "Cold tossed noodles with pickles and crispy bits.", "ja": "酸っぱい干拌い麺。"},
    },
    "laobacha": {
        "name": {"zh": "老爸茶", "en": "Laoba Tea", "ja": "老爸茶"},
        "tags": {"zh": ["早茶", "骑楼"], "en": ["Tea", "Dim sum"], "ja": ["早茶", "点心"]},
        "pin": "海南·海口",
        "desc": {"zh": "早茶下午茶，配点心、肠粉、凤爪与糕点。", "en": "Hainan tea culture with dim sum and pastries.", "ja": "海南の早茶文化。"},
    },
    "baoluo_fen": {
        "name": {"zh": "抱罗粉", "en": "Baoluo Noodles", "ja": "抱羅粉"},
        "tags": {"zh": ["汤粉", "鲜甜"], "en": ["Soup noodles", "Fresh"], "ja": ["スープ麺", "甘み"]},
        "pin": "海南·文昌",
        "desc": {"zh": "文昌抱罗汤粉或干拌，汤头清鲜。", "en": "Wenchang Baoluo noodles in clear broth.", "ja": "文昌抱羅の澄まし麺。"},
    },
    "hele_xie": {
        "name": {"zh": "和乐蟹", "en": "Hele Crab", "ja": "和楽蟹"},
        "tags": {"zh": ["清蒸", "膏满"], "en": ["Steamed", "Roe-rich"], "ja": ["蒸し", "蟹味噌"]},
        "pin": "海南·万宁",
        "desc": {"zh": "万宁和乐蟹，清蒸膏满肉鲜。", "en": "Wanning's famous crab, best steamed.", "ja": "万寧和楽蟹、蒸しが定番。"},
    },
    "haikou_zhazha": {
        "name": {"zh": "海口炸炸", "en": "Haikou Fried Skewers", "ja": "海口炸炸"},
        "tags": {"zh": ["甜酸", "夜市"], "en": ["Sweet-sour", "Night market"], "ja": ["甘酸", "夜市"]},
        "pin": "海南·海口",
        "desc": {"zh": "快炸串淋甜酸或咖喱酱，夜市灵魂。", "en": "Fried skewers with sweet-sour or curry sauce.", "ja": "甘酸ソースの炸串。"},
    },
    "shaguozhou": {
        "name": {"zh": "砂锅粥", "en": "Clay Pot Porridge", "ja": "砂锅粥"},
        "tags": {"zh": ["蟹粥", "夜宵"], "en": ["Crab porridge", "Late night"], "ja": ["蟹粥", "夜食"]},
        "pin": "海南·海口",
        "desc": {"zh": "砂锅慢煲蟹粥、鸽粥，浓稠鲜香。", "en": "Slow-simmered clay pot crab or pigeon porridge.", "ja": "土鍋蟹粥。"},
    },
    "haikou_yubao": {
        "name": {"zh": "海口鱼煲", "en": "Haikou Fish Pot", "ja": "海口魚煲"},
        "tags": {"zh": ["砂锅", "鲜鱼"], "en": ["Clay pot", "Fresh fish"], "ja": ["土鍋", "鮮魚"]},
        "pin": "海南·海口",
        "desc": {"zh": "鲜鱼砂锅配豆腐、粉条、时蔬，香辣或清淡。", "en": "Whole fish clay pot with tofu and noodles.", "ja": "鮮魚の土鍋、豆腐と春雨。"},
    },
    "danzhou_milan": {
        "name": {"zh": "儋州米烂", "en": "Danzhou Rice Threads", "ja": "儋州米烂"},
        "tags": {"zh": ["细滑", "卤料"], "en": ["Fine", "Toppings"], "ja": ["細麺", "具沢山"]},
        "pin": "海南·儋州",
        "desc": {"zh": "儋州米丝配多种卤料与小菜。", "en": "Fine rice threads with assorted toppings.", "ja": "儋州の細米麺。"},
    },
    "dongshan_yang": {
        "name": {"zh": "东山羊", "en": "Dongshan Goat", "ja": "東山羊"},
        "tags": {"zh": ["清汤", "细嫩"], "en": ["Clear soup", "Tender"], "ja": ["澄まし", "しっとり"]},
        "pin": "海南·万宁",
        "desc": {"zh": "万宁东山羊，膻味轻，白切清汤皆宜。", "en": "Wanning goat, mild flavor, poached or in soup.", "ja": "万寧東山羊。"},
    },
    "jiaji_ya": {
        "name": {"zh": "加积鸭", "en": "Jiaji Duck", "ja": "加積鴨"},
        "tags": {"zh": ["白切", "四大名菜"], "en": ["Poached", "Classic"], "ja": ["白切", "名菜"]},
        "pin": "海南·琼海",
        "desc": {"zh": "琼海加积鸭，肥而不腻，白切名物。", "en": "Qionghai Jiaji duck, classic poached.", "ja": "琼海加積鴨、白切。"},
    },
    "qiongshan_zhuxuetang": {
        "name": {"zh": "琼山猪血汤", "en": "Qiongshan Blood Soup", "ja": "琼山猪血汤"},
        "tags": {"zh": ["胡椒", "早点"], "en": ["Peppery", "Breakfast"], "ja": ["胡椒", "朝食"]},
        "pin": "海南·府城",
        "desc": {"zh": "府城猪血汤，酸咸胡椒浓，配韭菜酸菜。", "en": "Peppery pig blood soup with chives.", "ja": "府城の猪血スープ。"},
    },
    "yanfeng_xianshuiya": {
        "name": {"zh": "演丰咸水鸭", "en": "Yanfeng Salted Duck", "ja": "演豊咸水鴨"},
        "tags": {"zh": ["白切", "咸鲜"], "en": ["Poached", "Savory"], "ja": ["白切", "塩味"]},
        "pin": "海南·美兰",
        "desc": {"zh": "演丰红树林咸水鸭，白切鲜咸无腥。", "en": "Mangrove-raised duck, poached and savory.", "ja": "演豊の塩水鴨。"},
    },
    "yezi_fan": {
        "name": {"zh": "椰子饭", "en": "Coconut Rice", "ja": "椰子飯"},
        "tags": {"zh": ["椰香", "糯米"], "en": ["Coconut", "Sticky rice"], "ja": ["ココナッツ", "もち米"]},
        "pin": "海南·全岛",
        "desc": {"zh": "糯米装入嫩椰蒸熟，椰香渗入饭粒。", "en": "Sticky rice steamed inside young coconut.", "ja": "ココナッツに入れた糯米饭。"},
    },
}


def parse_frontmatter_posters(md: str) -> list[str]:
    md = md.lstrip("\ufeff")
    if not md.startswith("---"):
        return []
    close = md.find("\n---", 4)
    if close < 0:
        return []
    block = md[4:close]
    in_list = False
    entries: list[str] = []
    for line in block.splitlines():
        if line.strip() == "gourmet_posters:":
            in_list = True
            continue
        if in_list:
            if line.startswith("  - "):
                entries.append(line[4:].strip())
            elif line and not line.startswith(" "):
                break
            elif line.strip() and not line.startswith("  -"):
                break
    return entries


def slug_from_entry(entry: str) -> str | None:
    base = entry.split("/")[-1]
    if "_redraw" in base or "_no_char" in base:
        return None
    m = re.match(r"^(.+)_poster\.png$", base)
    return m.group(1) if m else None


def build_entry(slug: str, existing: dict | None) -> dict:
    if existing:
        e = dict(existing)
        e["slug"] = slug
    else:
        if slug not in META:
            raise KeyError(f"Missing META for slug: {slug}")
        m = META[slug]
        e = {
            "slug": slug,
            "path": "cn/hainan/",
            "file": f"{slug}_poster.png",
            "fileNoChar": f"{slug}_poster_no_char.png",
            "name": m["name"],
            "tags": m["tags"],
            "pin": m["pin"],
            "desc": m["desc"],
        }
    if not e.get("fileNoChar"):
        nc = f"{slug}_poster_no_char.png"
        if (REPO / "asserts/Gourmet recipe2/cn/hainan" / nc).exists():
            e["fileNoChar"] = nc
    return e


def main() -> None:
    md = HAINAN_MD.read_text(encoding="utf-8")
    entries = parse_frontmatter_posters(md)
    slugs: list[str] = []
    seen: set[str] = set()
    for ent in entries:
        slug = slug_from_entry(ent)
        if slug and slug not in seen:
            seen.add(slug)
            slugs.append(slug)

    data = json.loads(POSTERS_JSON.read_text(encoding="utf-8"))
    old_by_slug = {p["slug"]: p for p in data["cn"]["hainan"]}

    new_hainan = [build_entry(s, old_by_slug.get(s)) for s in slugs]
    data["cn"]["hainan"] = new_hainan
    POSTERS_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"hainan posters: {len(new_hainan)} slugs")
    print("slugs:", ", ".join(slugs))


if __name__ == "__main__":
    main()
