#!/usr/bin/env python3
"""Kestrel data pipeline.

Downloads end-of-day OHLCV for every symbol in the universe CSVs, computes all screener
metrics, and writes one JSON file per market/timeframe into ../data/ for the static site:

    data/IN-daily.json   data/IN-weekly.json   data/US-daily.json   data/US-weekly.json

Usage:
    pip install -r pipeline/requirements.txt
    python pipeline/build_data.py                 # both markets, with earnings
    python pipeline/build_data.py --market IN --no-earnings

Data source is Yahoo Finance via `yfinance` (free, delayed EOD). To use a paid vendor, replace
`download_ohlcv()` and `fetch_earnings()` — everything downstream only needs OHLCV DataFrames.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import sys
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

import numpy as np
import pandas as pd

try:
    import yfinance as yf
except ImportError:  # pragma: no cover
    sys.exit("yfinance is not installed: pip install -r pipeline/requirements.txt")

ROOT = Path(__file__).resolve().parent.parent
MARKETS = {
    "IN": {
        "universe": ROOT / "pipeline" / "universe_in.csv",
        "suffix": ".NS",
        "tz": "Asia/Kolkata", "close": "15:45",
        "indices": [("Nifty 50", "^NSEI"), ("Nifty 100", "^CNX100"),
                    ("Nifty Midcap 50", "^NSEMDCP50"), ("Nifty Bank", "^NSEBANK")],
    },
    "US": {
        "universe": ROOT / "pipeline" / "universe_us.csv",
        "suffix": "",
        "tz": "America/New_York", "close": "16:15",
        "indices": [("S&P 500", "^GSPC"), ("Nasdaq 100", "^NDX"),
                    ("Dow Jones", "^DJI"), ("Russell 2000", "^RUT")],
    },
}
MIN_BARS = {"daily": 60, "weekly": 30}
HIST_LEN = 140          # bars of close/EMA history shipped for the chart modal
BREADTH_LEN = 60        # bars of breadth history for drill-down charts


# --------------------------------------------------------------------------- utilities
def rnd(x, d=1):
    if x is None:
        return None
    try:
        if math.isnan(x) or math.isinf(x):
            return None
    except TypeError:
        return x
    return round(float(x), d)


def ema(s: pd.Series | pd.DataFrame, span: int):
    return s.ewm(span=span, adjust=False).mean()


def wilder_rsi(close, period=14):
    delta = close.diff()
    gain = delta.clip(lower=0).ewm(alpha=1 / period, adjust=False).mean()
    loss = (-delta.clip(upper=0)).ewm(alpha=1 / period, adjust=False).mean()
    rs = gain / loss.replace(0, np.nan)
    return (100 - 100 / (1 + rs)).fillna(100)


def pivot_zone(price, h, l, c):
    pp = (h + l + c) / 3
    r1, s1 = 2 * pp - l, 2 * pp - h
    r2, s2 = pp + (h - l), pp - (h - l)
    if price > r2: return "Above R2"
    if price > r1: return "R1-R2"
    if price > pp: return "PP-R1"
    if price > s1: return "S1-PP"
    if price > s2: return "S2-S1"
    return "Below S2"


def resample(df: pd.DataFrame, rule: str) -> pd.DataFrame:
    """Aggregate to weekly/monthly bars, labelled with the last real trading day in each period."""
    out = df.resample(rule).agg({"Open": "first", "High": "max", "Low": "min",
                                 "Close": "last", "Volume": "sum"})
    last_day = df.index.to_series().resample(rule).max()
    out.index = last_day.reindex(out.index).values
    return out.dropna(subset=["Close"])


def momentum(close: pd.Series, i: int, weekly: bool) -> float | None:
    """Weighted 3/6/12-month return ending at positional index i (negative from end)."""
    lens = (13, 26, 52) if weekly else (63, 126, 250)
    n = len(close)
    end = n - 1 + i
    if end < 0:
        return None
    parts, weights = [], (0.4, 0.3, 0.3)
    for L, w in zip(lens, weights):
        start = max(0, end - L)
        if end - start < 10:
            return None
        parts.append(w * (close.iloc[end] / close.iloc[start] - 1))
    return sum(parts)


# ------------------------------------------------------------------------- data access
def read_universe(path: Path):
    with open(path, newline="", encoding="utf-8") as f:
        return [r for r in csv.DictReader(f) if r.get("ticker")]


def download_ohlcv(symbols: list[str], period="2y", retries=2) -> dict[str, pd.DataFrame]:
    out = _download(symbols, period)
    for _ in range(retries):  # Yahoo drops a few symbols per batch at random; retry those
        missing = [s for s in symbols if s not in out]
        if not missing:
            break
        out.update(_download(missing, period, threads=False))
    return out


def _download(symbols, period, threads=True):
    raw = yf.download(symbols, period=period, interval="1d", group_by="ticker",
                      auto_adjust=True, threads=threads, progress=False)
    out = {}
    for s in symbols:
        try:
            df = raw[s] if isinstance(raw.columns, pd.MultiIndex) else raw
            df = df[["Open", "High", "Low", "Close", "Volume"]].dropna(subset=["Close"])
            if len(df):
                df.index = pd.to_datetime(df.index).tz_localize(None)
                out[s] = df
        except KeyError:
            pass
    return out


def fetch_earnings(symbol: str):
    """Returns (last_date, next_date) or (None, None). Yahoo's endpoint is flaky — never fatal."""
    try:
        ed = yf.Ticker(symbol).get_earnings_dates(limit=8)
        if ed is None or ed.empty:
            return None, None
        days = sorted({pd.Timestamp(d).tz_localize(None).normalize() for d in ed.index})
        today = pd.Timestamp(date.today())
        past = [d for d in days if d <= today]
        fut = [d for d in days if d > today]
        return (past[-1] if past else None), (fut[0] if fut else None)
    except Exception:
        return None, None


# ----------------------------------------------------------------------- per-stock math
def compute_stock(meta: dict, df: pd.DataFrame, daily: pd.DataFrame, tf: str, earn):
    weekly = tf == "weekly"
    if len(df) < MIN_BARS[tf]:
        return None
    o, h, l, c, v = (df[k] for k in ("Open", "High", "Low", "Close", "Volume"))
    price = float(c.iloc[-1])
    e10, e20, e50, e200 = ema(c, 10), ema(c, 20), ema(c, 50), ema(c, 200)
    rsi = wilder_rsi(c)
    rsi_ma = ema(rsi, 14)
    look = 52 if weekly else 252
    hi52 = float(h.iloc[-look:].max())
    lo52 = float(l.iloc[-look:].min())
    last = len(c) - 1

    cross_ago = None
    if e10.iloc[-1] > e20.iloc[-1]:
        for i in range(last, max(1, last - 60), -1):
            if e10.iloc[i - 1] <= e20.iloc[i - 1]:
                cross_ago = last - i
                break

    vals = [e10.iloc[-1], e20.iloc[-1], e50.iloc[-1]]
    spread = (max(vals) - min(vals)) / price

    d_piv = pivot_zone(price, h.iloc[-2], l.iloc[-2], c.iloc[-2])
    higher = resample(daily, "ME" if weekly else "W-FRI")
    w_piv = pivot_zone(price, *higher[["High", "Low", "Close"]].iloc[-2]) if len(higher) > 2 else None

    bo = None
    for i in range(last, max(41, last - 20), -1):
        base_hi, base_lo = c.iloc[i - 40:i].max(), c.iloc[i - 40:i].min()
        if c.iloc[i] > base_hi and c.iloc[i - 1] <= base_hi and (base_hi - base_lo) / base_hi < 0.35:
            avg_v = v.iloc[i - 20:i].mean()
            bo = {"ago": last - i, "gain": rnd((price / c.iloc[i] - 1) * 100),
                  "vol": rnd(v.iloc[i] / avg_v if avg_v else None),
                  "date": c.index[i].strftime("%Y-%m-%d")}
            break

    e200_prev = e200.iloc[-21] if len(e200) > 21 else e200.iloc[0]
    stage2 = sum([price > e50.iloc[-1], price > e200.iloc[-1], e50.iloc[-1] > e200.iloc[-1],
                  e200.iloc[-1] > e200_prev, price > lo52 * 1.3, price > hi52 * 0.75, rsi.iloc[-1] > 50])

    box_hi = h.iloc[-21:-1].max()
    box_lo = l.iloc[-21:-1].min()
    darvas = bool(price > box_hi and (box_hi - box_lo) / box_hi < 0.15 and price > hi52 * 0.9)

    fractal = False
    for i in range(last - 2, max(2, last - 30), -1):
        if h.iloc[i] > max(h.iloc[i - 2], h.iloc[i - 1], h.iloc[i + 1], h.iloc[i + 2]):
            fractal = bool(c.iloc[-1] > h.iloc[i] >= c.iloc[-2])
            break

    mfm = ((c - l) - (h - c)) / (h - l).replace(0, np.nan)
    cmf = (mfm * v).iloc[-20:].sum() / v.iloc[-20:].sum() if v.iloc[-20:].sum() else 0
    avg9 = v.iloc[-10:-1].mean()

    # Earnings reaction (always measured on daily bars)
    last_e, next_e = earn
    e1 = e0 = e2 = None
    if last_e is not None:
        dc = daily["Close"]
        pos = dc.index.searchsorted(last_e)
        if 2 <= pos < len(dc):
            e1 = rnd((dc.iloc[pos - 1] / dc.iloc[pos - 2] - 1) * 100)
            e0 = rnd((dc.iloc[pos] / dc.iloc[pos - 1] - 1) * 100)
            if pos + 1 < len(dc):
                e2 = rnd((dc.iloc[pos + 1] / dc.iloc[pos] - 1) * 100)

    dec = 1 if price > 1000 else 2
    return {
        "ticker": meta["ticker"], "name": meta["name"], "sector": meta["sector"], "cap": meta["cap"],
        "price": rnd(price, dec),
        "chg": rnd((price / c.iloc[-2] - 1) * 100),
        "rsi": int(round(rsi.iloc[-1])),
        "rsiAboveMA": bool(rsi.iloc[-1] > rsi_ma.iloc[-1]),
        "volSpike": rnd(v.iloc[-1] / avg9 if avg9 else None),
        "gap": rnd((o.iloc[-1] / c.iloc[-2] - 1) * 100),
        "from52": rnd((price / hi52 - 1) * 100),
        "emas": {"10": bool(price > e10.iloc[-1]), "20": bool(price > e20.iloc[-1]),
                 "50": bool(price > e50.iloc[-1]), "200": bool(price > e200.iloc[-1])},
        "aligned": bool(price > e10.iloc[-1] > e20.iloc[-1] > e50.iloc[-1] > e200.iloc[-1]),
        "converge": bool(spread < 0.025),
        "from20": rnd((price / e20.iloc[-1] - 1) * 100),
        "crossAgo": cross_ago,
        "dPivot": d_piv, "wPivot": w_piv,
        "bo": bo,
        "stage2": int(stage2),
        "lastEarn": last_e.strftime("%Y-%m-%d") if last_e is not None else None,
        "nextEarn": next_e.strftime("%Y-%m-%d") if next_e is not None else None,
        "e1": e1, "e0": e0, "e2": e2,
        "ipo": bool(len(daily) < 250),
        "darvas": darvas, "fractal": fractal,
        "turnover": rnd(price * float(v.iloc[-1]), 0),
        "cmf": rnd(cmf, 2),
        "series": [rnd(x, 2) for x in c.iloc[-HIST_LEN:]],
        "e20s": [rnd(x, 2) for x in e20.iloc[-HIST_LEN:]],
        "e50s": [rnd(x, 2) for x in e50.iloc[-HIST_LEN:]],
        "e200s": [rnd(x, 2) for x in e200.iloc[-HIST_LEN:]],
        "_close": c,  # removed before writing
    }


def rank_rs(rows, weekly):
    """RS = percentile rank (1–99) of weighted momentum; history at T-30/T-15/T-5/T0 bars."""
    offsets = (-30, -15, -5, 0)
    for k, off in enumerate(offsets):
        scored = [(r, momentum(r["_close"], off, weekly)) for r in rows]
        scored = [(r, m) for r, m in scored if m is not None]
        scored.sort(key=lambda x: x[1])
        n = len(scored)
        for i, (r, _) in enumerate(scored):
            r.setdefault("rsHist", [None] * 4)[k] = max(1, round((i + 1) / n * 99))
    for r in rows:
        r.setdefault("rsHist", [None] * 4)
        r["rs"] = r["rsHist"][3]


def breadth(frames: dict[str, pd.DataFrame], weekly: bool):
    C = pd.DataFrame({t: f["Close"] for t, f in frames.items()}).sort_index()
    H = pd.DataFrame({t: f["High"] for t, f in frames.items()}).reindex(C.index)
    L = pd.DataFrame({t: f["Low"] for t, f in frames.items()}).reindex(C.index)
    valid = C.notna()
    n = valid.sum(axis=1).replace(0, np.nan)
    chg = C.pct_change(fill_method=None)
    rsi = C.apply(wilder_rsi)
    pp = ((H + L + C) / 3).shift(1)
    hi52 = H.rolling(52 if weekly else 252, min_periods=20).max()
    base_hi = C.shift(1).rolling(40, min_periods=40).max()
    base_lo = C.shift(1).rolling(40, min_periods=40).min()
    event = (C > base_hi) & (C.shift(1) <= base_hi.shift(1)) & ((base_hi - base_lo) / base_hi < 0.35)
    recent_bo = event.astype(float).rolling(20, min_periods=1).max() > 0

    def share(mask):
        return ((mask & valid).sum(axis=1) / n * 100)

    series = {
        "ad": ((chg > 0).sum(axis=1) - (chg < 0).sum(axis=1)) / n * 100,
        "e20": share(C > ema(C, 20)),
        "e200": share(C > ema(C, 200)),
        "rsi60": share(rsi > 60),
        "piv": share(C > pp),
        "hi52": share(C >= hi52 * 0.95),
        "bo": share(recent_bo),
    }
    meta = [
        ("ad", "Advance / decline", "(Advancers − decliners) ÷ total stocks in the universe."),
        ("e20", "Above 20 EMA", "Share of stocks closing above their 20-period EMA."),
        ("e200", "Above 200 EMA", "Share of stocks above their 200-period EMA — the long-term trend filter."),
        ("rsi60", "RSI above 60", "Share of stocks with 14-period RSI above 60 (strong momentum)."),
        ("piv", "Above daily pivot", "Share of stocks trading above the classic floor pivot point."),
        ("hi52", "Near 52-week high", "Share of stocks within 5% of their 52-week high."),
        ("bo", "Recent breakout", "Share of stocks with a qualified base breakout in the last 20 sessions."),
    ]
    out = []
    for key, label, help_ in meta:
        hist = [rnd(x) for x in series[key].dropna().iloc[-BREADTH_LEN:]]
        if not hist:
            continue
        out.append({"key": key, "label": label, "help": help_, "unit": "%", "value": hist[-1],
                    "history": hist, "delta": rnd(hist[-1] - hist[-6]) if len(hist) > 5 else 0})
    return out


def indices(defs, tz, close):
    syms = [s for _, s in defs]
    data = download_ohlcv(syms, period="1mo")
    drop_unfinished_bar(data, tz, close)
    out = []
    for name, s in defs:
        df = data.get(s)
        if df is None or len(df) < 2:
            continue
        c = df["Close"]
        out.append({"name": name, "value": rnd(c.iloc[-1], 2), "chg": rnd((c.iloc[-1] / c.iloc[-2] - 1) * 100, 2)})
    return out


# --------------------------------------------------------------------------------- main
def drop_unfinished_bar(frames: dict, tz: str, close_hhmm: str):
    """If the market is still open, today's bar is partial — drop it so signals use completed bars."""
    now = pd.Timestamp.now(tz)
    hh, mm = map(int, close_hhmm.split(":"))
    if now.hour * 60 + now.minute >= hh * 60 + mm:
        return
    today = now.normalize().tz_localize(None)
    for k, df in frames.items():
        if len(df) and df.index[-1] >= today:
            frames[k] = df.iloc[:-1]


def build_market(market: str, with_earnings: bool, out_dir: Path):
    cfg = MARKETS[market]
    universe = read_universe(cfg["universe"])
    sym = {u["ticker"]: (u.get("yahoo") or u["ticker"] + cfg["suffix"]) for u in universe}
    print(f"[{market}] downloading {len(sym)} symbols …", flush=True)
    daily = download_ohlcv(list(sym.values()))
    print(f"[{market}] got data for {len(daily)} / {len(sym)}", flush=True)
    drop_unfinished_bar(daily, cfg["tz"], cfg["close"])

    earnings = {}
    if with_earnings:
        print(f"[{market}] fetching earnings dates …", flush=True)
        with ThreadPoolExecutor(max_workers=8) as ex:
            for t, res in zip(sym, ex.map(fetch_earnings, sym.values())):
                earnings[t] = res
    idx = indices(cfg["indices"], cfg["tz"], cfg["close"])

    for tf in ("daily", "weekly"):
        weekly = tf == "weekly"
        frames, rows = {}, []
        for u in universe:
            d = daily.get(sym[u["ticker"]])
            if d is None:
                continue
            df = resample(d, "W-FRI") if weekly else d
            try:
                row = compute_stock(u, df, d, tf, earnings.get(u["ticker"], (None, None)))
            except Exception as e:  # keep going on bad symbols
                print(f"  ! {u['ticker']}: {e}", file=sys.stderr)
                continue
            if row:
                rows.append(row)
                frames[u["ticker"]] = df
        if not rows:
            print(f"[{market}/{tf}] no rows — skipping", file=sys.stderr)
            continue
        rank_rs(rows, weekly)
        session = max(r["_close"].index[-1] for r in rows)
        for r in rows:
            del r["_close"]
        payload = {"session": session.strftime("%Y-%m-%d"), "generated": pd.Timestamp.now("UTC").isoformat(),
                   "indices": idx, "breadth": breadth(frames, weekly), "rows": rows}
        path = out_dir / f"{market}-{tf}.json"
        path.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
        print(f"[{market}/{tf}] wrote {len(rows)} stocks → {path.relative_to(ROOT)}", flush=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--market", choices=["IN", "US", "all"], default="all")
    ap.add_argument("--no-earnings", action="store_true", help="skip the (slow) earnings-date lookup")
    ap.add_argument("--out", default=str(ROOT / "data"))
    a = ap.parse_args()
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    for m in (["IN", "US"] if a.market == "all" else [a.market]):
        build_market(m, not a.no_earnings, out)


if __name__ == "__main__":
    main()
