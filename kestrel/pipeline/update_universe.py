#!/usr/bin/env python3
"""Rebuild pipeline/universe_in.csv from NSE's official lists.

* Stocks:      every NSE main-board equity in series EQ or BE (EQUITY_L.csv from NSE archives).
* Market cap:  index membership, mirroring AMFI's buckets — Nifty 100 = LC, Midcap 150 = MC,
               Smallcap 250 = SC, everything else = MI (micro).
* Sector:      Yahoo Finance's industry classification. Looked up once per symbol and kept in the
               CSV, so later runs only look up newly listed companies (use --refresh-sectors to redo all).

If NSE can't be reached the existing CSV is left untouched, so the build never breaks.

Usage:  python pipeline/update_universe.py [--refresh-sectors]
"""
from __future__ import annotations

import argparse
import csv
import io
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "pipeline" / "universe_in.csv"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
EQUITY_L = "https://archives.nseindia.com/content/equities/EQUITY_L.csv"
INDEX = "https://www.niftyindices.com/IndexConstituent/{}"
CAP_LISTS = [("LC", "ind_nifty100list.csv"), ("MC", "ind_niftymidcap150list.csv"), ("SC", "ind_niftysmallcap250list.csv")]
BROAD = "ind_niftytotalmarket_list.csv"  # NSE's broad industry, used if Yahoo has none
SERIES = {"EQ", "BE"}


def fetch_csv(url: str) -> list[dict]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/csv,*/*"})
    with urllib.request.urlopen(req, timeout=60) as r:
        text = r.read().decode("utf-8-sig", errors="replace")
    return [{(k or "").strip(): (v or "").strip() for k, v in row.items()} for row in csv.DictReader(io.StringIO(text))]


def clean_name(n: str) -> str:
    for suf in (" Limited", " Ltd.", " Ltd"):
        if n.endswith(suf):
            n = n[: -len(suf)]
    return n.strip()


def yahoo_industry(symbol: str):
    import time
    import yfinance as yf
    for attempt in range(3):  # Yahoo rate-limits bursts; back off and retry
        try:
            info = yf.Ticker(symbol + ".NS").info
            return symbol, (info.get("industry") or "").strip() or None
        except Exception:
            time.sleep(3 * (attempt + 1))
    return symbol, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh-sectors", action="store_true", help="look up every stock's industry again")
    a = ap.parse_args()

    try:
        eq = [r for r in fetch_csv(EQUITY_L) if r.get("SERIES") in SERIES]
        caps = {}
        for cap, f in CAP_LISTS:
            for r in fetch_csv(INDEX.format(f)):
                caps.setdefault(r["Symbol"], cap)
        try:
            broad = {r["Symbol"]: r["Industry"] for r in fetch_csv(INDEX.format(BROAD))}
        except Exception:
            broad = {}
    except Exception as e:
        print(f"Could not reach NSE ({e}); keeping existing {CSV_PATH.name}", file=sys.stderr)
        return

    if len(eq) < 1000:
        print(f"NSE list looks incomplete ({len(eq)} rows); keeping existing {CSV_PATH.name}", file=sys.stderr)
        return

    old = {}
    if CSV_PATH.exists():
        with open(CSV_PATH, newline="", encoding="utf-8") as f:
            old = {r["ticker"]: r for r in csv.DictReader(f)}

    need = [r["SYMBOL"] for r in eq if a.refresh_sectors or not old.get(r["SYMBOL"], {}).get("sector_source") == "yahoo"]
    found = {}
    if need:
        print(f"Looking up industry for {len(need)} symbols …", flush=True)
        with ThreadPoolExecutor(max_workers=3) as ex:
            for i, (s, ind) in enumerate(ex.map(yahoo_industry, need), 1):
                found[s] = ind
                if i % 250 == 0:
                    print(f"  {i}/{len(need)}", flush=True)

    rows = []
    for r in eq:
        s = r["SYMBOL"]
        prev = old.get(s, {})
        if s in found and found[s]:
            sector, src = found[s], "yahoo"
        elif prev.get("sector_source") == "yahoo":
            sector, src = prev["sector"], "yahoo"
        else:
            sector, src = broad.get(s) or "Unclassified", "nse"
        rows.append({"ticker": s, "name": clean_name(r.get("NAME OF COMPANY", s)), "sector": sector,
                     "cap": caps.get(s, "MI"), "yahoo": prev.get("yahoo", ""), "sector_source": src})
    rows.sort(key=lambda x: x["ticker"])

    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["ticker", "name", "sector", "cap", "yahoo", "sector_source"])
        w.writeheader()
        w.writerows(rows)
    by_cap = {c: sum(1 for x in rows if x["cap"] == c) for c in ("LC", "MC", "SC", "MI")}
    print(f"Wrote {len(rows)} stocks to {CSV_PATH.relative_to(ROOT)} {by_cap}; "
          f"{sum(1 for x in rows if x['sector_source'] == 'yahoo')} with Yahoo industry", flush=True)


if __name__ == "__main__":
    main()
