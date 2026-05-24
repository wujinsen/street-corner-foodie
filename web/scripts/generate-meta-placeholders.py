# -*- coding: utf-8 -*-
"""
Legacy entry: poster copy now lives in docs/*.md `web_posters:` (v0.2.1).

This script only refreshes posters.json placeholder rows from posters.json + EXTRA
in sync-web-posters-to-md.mjs. Run the npm script instead:

  npm run sync:web-posters
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main() -> int:
    export = ROOT / "export-poster-meta-bundle.py"
    sync = ROOT / "sync-web-posters-to-md.mjs"
    if export.is_file():
        subprocess.run([sys.executable, str(export)], check=True, cwd=ROOT)
    subprocess.run(["node", str(sync)], check=True, cwd=ROOT)
    print("ok — web_posters synced to docs; poster-meta.ts is not regenerated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
