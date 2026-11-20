#!/usr/bin/env python3
"""Private intraday mode for Kestrel: one command on your own computer.

    python pipeline/private_live.py

1. Downloads the latest end-of-day files from your published site into kestrel/.live/
   (a private, git-ignored copy, so your repository files are never touched).
2. Serves that copy at http://localhost:8000 (open /cheat.html).
3. Every 30 minutes during market hours (about 9:48 … 3:18 IST, plus a final check at 3:40)
   runs pipeline/intraday.py, so the Cheat Filter shows only setups confirmed on 30-minute closes.
4. Stops by itself after the close. Press Ctrl+C to stop earlier.

Nothing is published: the confirmations stay on your computer.
Options: --site URL (default: your GitHub Pages site), --port 8000
"""
from __future__ import annotations

import argparse
import functools
import http.server
import json
import shutil
import subprocess
import sys
import threading
import time
import urllib.request
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
LIVE = ROOT / ".live"
DEFAULT_SITE = "https://kr15lalit.github.io/Github"
IST = "Asia/Kolkata"
PAGES = ["index.html", "screener.html", "cheat.html", "playbook.html", "guide.html", "privacy.html", "terms.html"]


def fetch(url: str, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "kestrel-private-live"})
            with urllib.request.urlopen(req, timeout=60) as r:
                dest.write_bytes(r.read())
            return True
        except Exception:
            time.sleep(2 * (attempt + 1))
    return False


def sync(site: str):
    """Fresh private copy: site pages from this checkout + the latest published data."""
    if LIVE.exists():
        shutil.rmtree(LIVE)
    LIVE.mkdir(parents=True)
    for p in PAGES:
        shutil.copy2(ROOT / p, LIVE / p)
    shutil.copytree(ROOT / "assets", LIVE / "assets")
    for f in ("IN-daily", "IN-weekly", "US-daily", "US-weekly"):
        if not fetch(f"{site}/data/{f}.json", LIVE / "data" / f"{f}.json"):
            sys.exit(f"Could not download {f}.json from {site}. Check your internet connection.")
    sys.path.insert(0, str(ROOT / "pipeline"))
    import intraday  # same candidate rules as the Cheat Filter
    daily = json.loads((LIVE / "data" / "IN-daily.json").read_text(encoding="utf-8"))
    cands = intraday.candidates(daily["rows"])
    tickers = sorted({r["ticker"] for k in cands for r in cands[k]})
    for t in tickers:  # price history + analysis for the candidates (charts, levels, AI button)
        for sub in ("charts", "analysis"):
            fetch(f"{site}/data/{sub}/IN/{intraday.chart_file(t)}", LIVE / "data" / sub / "IN" / intraday.chart_file(t))
    print(f"Synced end-of-day data for {daily['session']} · {len(tickers)} Cheat Filter candidates", flush=True)


def serve(port: int):
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(LIVE))
    handler.log_message = lambda *a, **k: None
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    print(f"Private Kestrel running at http://localhost:{port}/cheat.html", flush=True)


def schedule(now: pd.Timestamp):
    day = now.normalize()
    slots = [day + pd.Timedelta(hours=h, minutes=m) for h in range(9, 16) for m in (18, 48)
             if (9, 48) <= (h, m) <= (15, 18)]
    slots.append(day + pd.Timedelta(hours=15, minutes=40))  # final "held / failed" check
    return slots


def run_intraday():
    cmd = [sys.executable, str(ROOT / "pipeline" / "intraday.py"), "--source", str(LIVE),
           "--out", str(LIVE / "data" / "intraday" / "IN.json")]
    out = subprocess.run(cmd, capture_output=True, text=True)
    lines = [l for l in (out.stdout + out.stderr).splitlines() if l.startswith(("As of", "Nothing", "Market", "  !"))]
    print("\n".join(lines) or out.stderr[-500:], flush=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--site", default=DEFAULT_SITE)
    ap.add_argument("--port", type=int, default=8000)
    a = ap.parse_args()

    sync(a.site.rstrip("/"))
    serve(a.port)
    now = pd.Timestamp.now(tz=IST)
    if now.weekday() >= 5:
        print("It's the weekend: showing end-of-day data only. Press Ctrl+C to stop.")
    run_intraday()  # immediately, so the page is current right away
    try:
        for slot in schedule(now):
            wait = (slot - pd.Timestamp.now(tz=IST)).total_seconds()
            if wait <= 0:
                continue
            print(f"Next check at {slot:%H:%M} IST", flush=True)
            time.sleep(wait)
            run_intraday()
        print("Market closed. Final status is on the page; press Ctrl+C to stop the local server.")
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
