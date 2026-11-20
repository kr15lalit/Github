#!/usr/bin/env python3
"""Kestrel intraday confirmations (15- and 30-minute bars).

Takes the Cheat Filter's candidates from the last end-of-day build, fetches today's 15-minute
bars from Yahoo for just those stocks (plus the Nifty), and decides for each setup:

    watching     → hasn't reached its entry trigger yet
    triggered    → traded above the trigger, not confirmed yet (reason given)
    confirmed    → a 30-minute candle CLOSED above the trigger (after 9:45), above VWAP,
                   with enough volume for the time of day (+ a higher low for pullbacks)
    invalidated  → opened above the "don't buy above" limit, a 30-minute close below the stop,
                   or a confirmed setup closed back below its trigger
After 3:30 pm, confirmed setups are marked "held" or "failed" by the close.

Usage:
    python pipeline/intraday.py                                   # private: uses local data/, writes data/intraday/IN.json
    python pipeline/intraday.py --source https://<user>.github.io/<repo> --out live/intraday/IN.json
    python pipeline/intraday.py --now "2026-11-20 13:05"          # replay a time (testing)

The levels (entry / stop / max buy) use exactly the same rules as cheat.html.
"""
from __future__ import annotations

import argparse
import json
import math
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, time as dtime
from pathlib import Path

import pandas as pd

try:
    import yfinance as yf
except ImportError:  # pragma: no cover
    sys.exit("yfinance is not installed: pip install -r pipeline/requirements.txt")

ROOT = Path(__file__).resolve().parent.parent
IST = "Asia/Kolkata"
OPEN_NOISE_END = dtime(9, 45)   # ignore the first 30 minutes
MARKET_CLOSE = dtime(15, 30)
TURN_MIN = 10 * 1e7             # ₹10 Cr, same as the Cheat Filter
VOL_NEED = {"bo": 1.5, "pull": 1.0}
PAUSE_NIFTY_PCT = -1.0          # pause new confirmations if the Nifty is down 1% or more


# --------------------------------------------------------------------------- inputs
class Source:
    """Reads the published end-of-day files, from a local folder or the live site."""

    def __init__(self, base: str):
        self.base = base.rstrip("/")

    def json(self, rel: str):
        if not self.base.startswith("http"):
            return json.loads((Path(self.base) / rel).read_text(encoding="utf-8"))
        for attempt in range(3):  # the site host occasionally returns a 5xx; retry briefly
            try:
                req = urllib.request.Request(f"{self.base}/{rel}", headers={"User-Agent": "kestrel-intraday"})
                with urllib.request.urlopen(req, timeout=60) as r:
                    return json.loads(r.read().decode())
            except urllib.error.HTTPError as e:
                if e.code < 500 or attempt == 2:
                    raise
                time.sleep(2 * (attempt + 1))


def chart_file(ticker: str) -> str:  # must match build_data.py / chart.js
    return re.sub(r"[^A-Za-z0-9-]", "_", ticker) + ".json"


# ------------------------------------------------- Cheat Filter rules (mirror cheat.html)
def tick_up(p):
    return math.ceil(round(p * 20, 6)) / 20


def tick_dn(p):
    return math.floor(round(p * 20, 6)) / 20


def ema_last(values, p):
    k, e = 2 / (p + 1), values[0]
    for v in values:
        e = v * k + e * (1 - k)
    return e


def candidates(rows):
    big = lambda r: r["cap"] != "MI"
    pull = [r for r in rows if big(r) and r["stage2"] >= 6 and (r.get("rs") or 0) >= 80 and r["turnover"] >= TURN_MIN
            and r["from20"] <= 5 and r["from52"] >= -15 and 50 <= r["rsi"] <= 70]
    bo = [r for r in rows if big(r) and r.get("bo") and (r.get("rs") or 0) >= 70 and r["stage2"] >= 5
          and r["turnover"] >= TURN_MIN and (r["bo"].get("vol") or 0) >= 1.5
          and r["bo"].get("gain") is not None and -1 <= r["bo"]["gain"] < 5]
    return {"pull": pull, "bo": bo}


def levels(r, kind, b):
    if not b or len(b["c"]) < 30:
        return None
    entry = tick_up(b["h"][-1] * 1.001)
    stop = None
    if kind == "bo" and r.get("bo") and r["bo"].get("date") in b["t"]:
        i = b["t"].index(r["bo"]["date"])
        if i > 40:
            stop = tick_dn(max(b["c"][i - 40:i]) * 0.98)
    if stop is None:
        stop = tick_dn(min(ema_last(b["c"], 20), min(b["l"][-5:])) * 0.99)
    if stop >= entry:
        return None
    risk = entry - stop
    return {"entry": entry, "stop": stop, "maxBuy": tick_dn(entry + 0.5 * risk), "riskPct": round(risk / entry * 100, 2)}


# ----------------------------------------------------------------------- intraday data
def fetch_15m(symbols: list[str]) -> dict[str, pd.DataFrame]:
    out = {}
    for i in range(0, len(symbols), 100):
        part = symbols[i:i + 100]
        raw = yf.download(part, period="30d", interval="15m", group_by="ticker",
                          auto_adjust=True, threads=True, progress=False)
        for s in part:
            try:
                df = raw[s] if isinstance(raw.columns, pd.MultiIndex) else raw
            except KeyError:
                continue
            df = df[["Open", "High", "Low", "Close", "Volume"]].dropna(subset=["Close"])
            if df.empty:
                continue
            idx = pd.to_datetime(df.index)
            df.index = idx.tz_convert(IST) if idx.tz is not None else idx.tz_localize(IST)
            out[s] = df
    return out


def completed_15m(df, now):
    return df[(df.index + pd.Timedelta(minutes=15)) <= now]


def to_30m(day15, now):
    """Pair 15-minute bars into NSE-aligned 30-minute bars (9:15, 9:45, …) and keep completed ones."""
    if day15.empty:
        return day15
    b = day15.resample("30min", offset="15min", label="left", closed="left").agg(
        {"Open": "first", "High": "max", "Low": "min", "Close": "last", "Volume": "sum"}).dropna(subset=["Close"])
    keep = []
    for ts in b.index:
        end = ts + pd.Timedelta(minutes=30)
        keep.append(end <= now or (ts.time() == dtime(15, 15) and now.time() >= MARKET_CLOSE))
    return b[keep]


def volume_baseline(hist15, upto):
    """Average cumulative volume up to time-of-day `upto` over the last 20 sessions."""
    days = sorted(set(hist15.index.date))[-20:]
    if not days:
        return None
    sums = []
    for d in days:
        x = hist15[(hist15.index.date == d) & (hist15.index.time < upto)]
        if len(x):
            sums.append(float(x["Volume"].sum()))
    sums = [v for v in sums if v > 0]
    return sum(sums) / len(sums) if sums else None


# -------------------------------------------------------------------------- the rules
def evaluate(df, lv, kind, now, paused):
    today = now.date()
    day15 = completed_15m(df[df.index.date == today], now)
    hist15 = df[df.index.date < today]
    base = {"entry": lv["entry"], "stop": lv["stop"], "maxBuy": lv["maxBuy"]}
    if day15.empty:
        return {**base, "status": "watching", "note": "No completed bars yet today"}

    first_open = float(day15["Open"].iloc[0])
    if first_open > lv["maxBuy"]:
        return {**base, "status": "invalidated", "reason": "gap",
                "note": f"Opened at ₹{first_open:,.2f}, above the ₹{lv['maxBuy']:,.2f} limit (gap-up): skip"}

    triggered = bool((day15["High"] >= lv["entry"]).any())
    tp = (day15["High"] + day15["Low"] + day15["Close"]) / 3
    cum_v = day15["Volume"].cumsum()
    vwap_series = (tp * day15["Volume"]).cumsum() / cum_v.replace(0, float("nan"))

    rec = {**base, "status": "triggered" if triggered else "watching",
           "note": "Traded above the trigger; waiting for a 30-min close above it" if triggered else "Below the trigger"}
    confirmed = None
    for ts, bar in to_30m(day15, now).iterrows():
        end = ts + pd.Timedelta(minutes=30)
        close = float(bar["Close"])
        label = (end if end.time() <= MARKET_CLOSE else end.replace(hour=15, minute=30)).strftime("%H:%M")
        if close < lv["stop"]:
            return {**rec, "status": "invalidated", "reason": "stop",
                    "note": f"30-min close ₹{close:,.2f} below the stop at {label}", **({"confirmedAt": confirmed["at"]} if confirmed else {})}
        if confirmed and close < lv["entry"]:
            return {**rec, **confirmed, "status": "invalidated", "reason": "failed",
                    "note": f"Confirmed at {confirmed['at']}, then closed back below the trigger at {label}"}
        if confirmed or ts.time() < OPEN_NOISE_END or close <= lv["entry"]:
            continue
        # a completed 30-minute close above the trigger: check quality
        upto = day15[day15.index < end]
        vw = upto.index[-1]
        vwap = float(vwap_series.loc[vw]) if pd.notna(vwap_series.loc[vw]) else None
        today_vol = float(upto["Volume"].sum())
        baseline = volume_baseline(hist15, end.time())
        rel_vol = round(today_vol / baseline, 2) if baseline else None
        problems = []
        if vwap is not None and close <= vwap:
            problems.append(f"below VWAP ₹{vwap:,.2f}")
        if rel_vol is not None and rel_vol < VOL_NEED[kind]:
            problems.append(f"volume {rel_vol}x vs {VOL_NEED[kind]}x needed")
        if kind == "pull":
            before = day15[day15.index < ts]
            if len(before) and float(bar["Low"]) <= float(before["Low"].min()):
                problems.append("no higher low yet")
        if paused:
            problems.append("market sell-off: confirmations paused")
        if problems:
            rec.update({"status": "triggered", "note": f"30-min close above trigger at {label}, but " + "; ".join(problems)})
            continue
        confirmed = {"at": label, "close30": round(close, 2), "vwap": round(vwap, 2) if vwap else None, "relVol": rel_vol}
        rec.update({"status": "confirmed", **confirmed,
                    "note": f"30-min close ₹{close:,.2f} above trigger ₹{lv['entry']:,.2f}"
                            + (f" · volume {rel_vol}x normal for this time" if rel_vol else "")
                            + (f" · above VWAP ₹{vwap:,.2f}" if vwap else "")})

    if rec["status"] == "confirmed" and now.time() >= MARKET_CLOSE:
        last = float(day15["Close"].iloc[-1])
        rec["final"] = "held" if last > lv["entry"] else "failed"
        rec["finalClose"] = round(last, 2)
    return rec


# ------------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--source", default=str(ROOT), help="folder or site URL holding data/IN-daily.json and data/charts/")
    ap.add_argument("--out", default=str(ROOT / "data" / "intraday" / "IN.json"))
    ap.add_argument("--now", help='override the current IST time, e.g. "2026-11-20 13:05"')
    a = ap.parse_args()

    now = pd.Timestamp(a.now, tz=IST) if a.now else pd.Timestamp.now(tz=IST)
    src = Source(a.source)
    daily = src.json("data/IN-daily.json")
    session = daily["session"]
    if now.weekday() >= 5 or str(now.date()) <= session:
        print(f"Nothing to do: {now:%a %d %b} is not a trading day after the last session ({session}).")
        return
    if now.time() < dtime(9, 30):
        print("Market not open yet (needs at least one completed 15-minute bar).")
        return

    cands = candidates(daily["rows"])
    tickers = sorted({r["ticker"] for k in cands for r in cands[k]})
    print(f"{len(cands['pull'])} pullback + {len(cands['bo'])} breakout candidates from the {session} close", flush=True)

    bars = {}
    for t in tickers:
        try:
            bars[t] = src.json(f"data/charts/IN/{chart_file(t)}")
        except Exception as e:
            print(f"  ! no daily bars for {t}: {e}", file=sys.stderr)

    sym = {t: t + ".NS" for t in tickers}
    intraday = fetch_15m(list(sym.values()) + ["^NSEI"])

    # market check: Nifty vs yesterday's close and today's open
    market = {}
    n = intraday.get("^NSEI")
    if n is not None:
        today_n = completed_15m(n[n.index.date == now.date()], now)
        prev_n = n[n.index.date < now.date()]
        if len(today_n) and len(prev_n):
            last, prev, op = float(today_n["Close"].iloc[-1]), float(prev_n["Close"].iloc[-1]), float(today_n["Open"].iloc[0])
            chg = (last / prev - 1) * 100
            market = {"nifty": round(last, 2), "chg": round(chg, 2), "aboveOpen": last >= op, "paused": chg <= PAUSE_NIFTY_PCT}
    paused = bool(market.get("paused"))

    setups, counts = {"pull": {}, "bo": {}}, {}
    for kind, rows in cands.items():
        for r in rows:
            t = r["ticker"]
            lv = levels(r, kind, bars.get(t))
            df = intraday.get(sym[t])
            if not lv:
                continue
            res = evaluate(df, lv, kind, now, paused) if df is not None else {"entry": lv["entry"], "stop": lv["stop"], "maxBuy": lv["maxBuy"], "status": "watching", "note": "No intraday data"}
            setups[kind][t] = res
            key = f"{kind}:{res['status']}"
            counts[key] = counts.get(key, 0) + 1

    out = {
        "date": str(now.date()), "asOf": now.isoformat(timespec="minutes"), "asOfLabel": now.strftime("%H:%M"),
        "dailySession": session, "closed": now.time() >= MARKET_CLOSE, "market": market,
        "setups": setups, "counts": counts,
    }
    path = Path(a.out)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    conf = [f"{k}:{t}@{v['at']}" for k in setups for t, v in setups[k].items() if v["status"] == "confirmed"]
    print(f"As of {now:%H:%M} IST · Nifty {market.get('chg', '?')}% · {counts} · confirmed: {conf or 'none'}")
    print(f"Wrote {path}")


if __name__ == "__main__":
    main()
