# -*- coding: utf-8 -*-
"""Export META from sync-hainan-posters.py → poster-meta-bundle.json for sync-web-posters-to-md.mjs."""
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
spec = importlib.util.spec_from_file_location(
    "sync_hainan_posters",
    ROOT / "sync-hainan-posters.py",
)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

bundle = {"cn": {"hainan": mod.META}}
out = ROOT / "poster-meta-bundle.json"
out.write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"wrote {out} ({len(mod.META)} hainan slugs)")
