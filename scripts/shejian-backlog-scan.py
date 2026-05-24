# -*- coding: utf-8 -*-
"""Scan shejian-shang-de-zhongguo.md S1 episodes vs asserts posters/zines."""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MD = ROOT / "docs/china/shejian-shang-de-zhongguo.md"

SUF_P = "_poster.png"
SUF_Z = "_story_eating_mini_zine.png"

KNOWN = {
    "香格里拉松茸": "xianggelila_songrong",
    "遂昌冬笋": "suichang_dongsun",
    "黄豆酸笋小黄鱼": "huangdou_suansun_xiaohuangyu",
    "云南大理诺邓火腿": "nuodeng_huotui",
    "诺邓火腿": "nuodeng_huotui",
    "湖北嘉鱼莲藕": "jiayu_lianou",
    "嘉鱼莲藕": "jiayu_lianou",
    "吉林查干湖冬季捕鱼": "chaganhu_dongji_buyu",
    "南海远洋打渔": "nanhai_yuanyang_yu",
    "西湖醋鱼": "xihu_cuyu",
    "浙江杭州西湖醋鱼": "xihu_cuyu",
    "麻婆豆腐": "mapo_doufu",
    "文思豆腐": "wensi_doufu",
    "长沙油炸臭豆腐": "changsha_choudoufu",
    "湖南长沙油炸臭豆腐": "changsha_choudoufu",
    "安徽休宁毛豆腐": "maodoufu",
    "毛豆腐": "maodoufu",
    "绍兴臭豆腐": "shaoxing_choudoufu",
    "东坡肉": "dongpo_rou",
    "蟹粉豆腐": "xiefen_doufu",
    "蟹粉汪豆腐": "xiefen_doufu",
    "乐山嫩豆花": "leshan_douhua",
    "鱼香肉丝": "yuxiang_rousi",  # no slug yet
}


def collect_slugs(base: Path, suffix: str) -> set[str]:
    out: set[str] = set()
    for dp, _, fs in os.walk(base):
        for f in fs:
            if f.endswith(suffix) and (suffix != SUF_Z or "_no_char" not in f):
                out.add(f[: -len(suffix)])
    return out


def split_items(raw: str) -> list[str]:
    parts = re.split(r"[、，,；;]", raw)
    out: list[str] = []
    for p in parts:
        p = p.strip().strip("「」").strip()
        if len(p) >= 2:
            out.append(p)
    return out


def resolve_slug(name: str) -> str | None:
    if name in KNOWN:
        return KNOWN[name]
    for k, v in KNOWN.items():
        if k in name or name in k:
            return v
    return None


def main() -> None:
    posters = collect_slugs(ROOT / "asserts/Gourmet recipe2", SUF_P)
    zines = collect_slugs(ROOT / "asserts/mini-zine", SUF_Z)
    md = MD.read_text(encoding="utf-8")
    s1 = md.split("## 第二季")[0]

    eps: list[tuple[int, str, int]] = []
    for m in re.finditer(r"^### 第 (\d+) 集 · (.+)$", s1, re.M):
        eps.append((int(m.group(1)), m.group(2), m.end()))

    for i, (num, title, start) in enumerate(eps):
        end = eps[i + 1][2] if i + 1 < len(eps) else len(s1)
        block = s1[start:end]
        if "#### 海报定稿" in block:
            block = block.split("#### 海报定稿")[0]
        items: list[str] = []
        for line in block.splitlines():
            if line.strip().startswith("- "):
                items.extend(split_items(line.strip()[2:]))
        print(f"E{num} {title} n={len(items)}")
        for it in items:
            slug = resolve_slug(it)
            p = slug in posters if slug else False
            z = slug in zines if slug else False
            mark = "DONE" if p and z else ("P" if p else ("Z" if z else "-"))
            print(f"  [{mark}] {it} | {slug or '-'}")


if __name__ == "__main__":
    main()
