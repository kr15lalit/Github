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

Use it on your phone:
    python pipeline/private_live.py --phone
It then also listens on your home network (and Tailscale, if installed), asks for a password,
and prints the address to open on your phone. Without --phone it is reachable from this computer only.

Options: --site URL (default: your GitHub Pages site), --port 8000, --phone, --password TEXT
"""
from __future__ import annotations

import argparse
import base64
import functools
import hmac
import http.server
import json
import secrets
import shutil
import socket
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
    (LIVE / "data" / "private.json").write_text('{"private": true}', encoding="utf-8")  # unlocks levels + intraday in cheat.html
    print(f"Synced end-of-day data for {daily['session']} · {len(tickers)} Cheat Filter candidates", flush=True)


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k):
        pass


class PasswordProtected(Quiet):
    """Asks the browser for a username/password (HTTP Basic auth) before serving anything."""
    expected = ""  # set in serve()

    def _ok(self):
        header = self.headers.get("Authorization", "")
        if not header.startswith("Basic "):
            return False
        try:
            given = base64.b64decode(header[6:]).decode("utf-8")
        except Exception:
            return False
        return hmac.compare_digest(given, self.expected)

    def _deny(self):
        self.send_response(401)
        self.send_header("WWW-Authenticate", 'Basic realm="Kestrel private", charset="UTF-8"')
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write("Password required.".encode())

    def do_GET(self):
        return super().do_GET() if self._ok() else self._deny()

    def do_HEAD(self):
        return super().do_HEAD() if self._ok() else self._deny()


def _all_ipv4():
    ips = set()
    try:  # the address used for outgoing traffic (no packet is actually sent)
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ips.add(s.getsockname()[0])
        s.close()
    except OSError:
        pass
    try:
        ips.update(socket.gethostbyname_ex(socket.gethostname())[2])
    except OSError:
        pass
    return ips


def local_addresses():
    """IPv4 addresses other devices can use: home Wi-Fi (192.168.x / 10.x / 172.16-31.x) and Tailscale (100.64-127.x)."""
    ips = _all_ipv4()
    def kind(ip):
        a, b = (int(x) for x in ip.split(".")[:2])
        if a == 100 and 64 <= b <= 127:
            return "Tailscale (works from anywhere on your Tailscale devices)"
        if a == 192 and b == 168 or a == 10 or a == 172 and 16 <= b <= 31:
            return "home Wi-Fi"
        return None
    return [(ip, kind(ip)) for ip in sorted(ips) if not ip.startswith("127.") and kind(ip)]


def serve(port: int, phone: bool = False, password: str | None = None):
    if not phone:
        handler = functools.partial(Quiet, directory=str(LIVE))
        srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)  # this computer only
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        print(f"Private Kestrel running at http://localhost:{port}/cheat.html", flush=True)
        return
    password = password or secrets.token_urlsafe(6)
    PasswordProtected.expected = f"kestrel:{password}"
    handler = functools.partial(PasswordProtected, directory=str(LIVE))
    srv = http.server.ThreadingHTTPServer(("0.0.0.0", port), handler)  # reachable from your other devices
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    print("\nPhone access is ON (password protected).", flush=True)
    print(f"  On this computer: http://localhost:{port}/cheat.html")
    addrs = local_addresses()
    for ip, kind in addrs:
        print(f"  On your phone ({kind}): http://{ip}:{port}/cheat.html")
    if not addrs:
        others = sorted({ip for ip in _all_ipv4() if not ip.startswith("127.")})
        for ip in others:
            print(f"  On your phone (try): http://{ip}:{port}/cheat.html")
        if not others:
            print("  Couldn't detect this computer's network address: find its IP in your Wi-Fi settings,")
            print(f"  then open http://<that-IP>:{port}/cheat.html on your phone.")
    print(f"  Username: kestrel    Password: {password}")
    print("  Use this only on your own home Wi-Fi or Tailscale, never on public Wi-Fi.")
    print("  If your computer asks about firewall access, allow it on PRIVATE networks only.\n", flush=True)


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
    ap.add_argument("--phone", action="store_true",
                    help="let your phone open it over home Wi-Fi or Tailscale (password protected)")
    ap.add_argument("--password", help="password for --phone (default: a random one, shown when it starts)")
    a = ap.parse_args()

    sync(a.site.rstrip("/"))
    serve(a.port, a.phone, a.password)
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
