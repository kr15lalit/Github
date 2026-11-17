#!/usr/bin/env python3
"""Kestrel analysis builder — runs after build_data.py.

For every stock it writes data/analysis/<MARKET>/<TICKER>.json containing:
  * "rule": a plain-English technical read generated from the indicators by fixed rules
            (always available, free, cannot invent numbers);
  * "ai":   an AI-written read from Google's Gemini API (free tier), only when the
            GEMINI_API_KEY environment variable is set. Missing or failed AI never breaks the site.

The site shows these when a visitor clicks "AI analysis" in a stock's popup.

Usage:
    python pipeline/analysis.py                       # rule-based only (no key)
    GEMINI_API_KEY=... python pipeline/analysis.py     # + AI for as many stocks as the free quota allows

Optional environment variables:
    GEMINI_MODEL     force a model id (default: newest "flash-lite" model your key can use)
    AI_MAX_STOCKS    cap AI calls per market per run (default 400)
    AI_DELAY         seconds between AI calls, to respect per-minute limits (default 4.5)
    AI_MARKETS       comma list of markets to send to AI (default "IN,US")
"""
from __future__ import annotations

import json
import os
import re
import shutil
import sys
import time
import urllib.error
import urllib.request
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta"


def chart_file_name(ticker: str) -> str:  # must match build_data.py / chart.js
    return re.sub(r"[^A-Za-z0-9-]", "_", ticker) + ".json"


def pct(a, b):
    return (a / b - 1) * 100 if b else 0.0


def r2(x):
    return None if x is None else round(float(x), 2)


# ----------------------------------------------------------------------------- facts
def ema(values, p):
    k = 2 / (p + 1)
    out, prev = [], values[0]
    for v in values:
        prev = v * k + prev * (1 - k)
        out.append(prev)
    return out


def build_facts(row: dict, bars: dict | None, market_ctx: dict, sector_ctx: dict) -> dict:
    """Everything the rules and the AI are allowed to talk about, including candidate price levels."""
    price = row["price"]
    levels = []
    if bars and len(bars["c"]) > 30:
        h, l, c = bars["h"], bars["l"], bars["c"]
        n = len(c)
        look = min(252, n)
        levels.append(("52-week high", max(h[-look:])))
        levels.append(("52-week low", min(l[-look:])))
        for p in (20, 50, 200):
            if n > p:
                levels.append((f"{p}-day EMA", ema(c, p)[-1]))
        # recent swing highs / lows (5-bar fractals) over ~6 months
        sh, sl = [], []
        for i in range(max(2, n - 126), n - 2):
            if h[i] == max(h[i - 2:i + 3]):
                sh.append(h[i])
            if l[i] == min(l[i - 2:i + 3]):
                sl.append(l[i])
        for v in sh[-3:]:
            levels.append(("recent swing high", v))
        for v in sl[-3:]:
            levels.append(("recent swing low", v))
        if row.get("bo") and row["bo"].get("date") and row["bo"]["date"] in bars["t"]:
            i = bars["t"].index(row["bo"]["date"])
            if i > 40:
                levels.append(("breakout level (top of prior base)", max(c[i - 40:i])))
        recent = [{"date": bars["t"][i], "open": bars["o"][i], "high": h[i], "low": l[i], "close": c[i], "volume": bars["v"][i]}
                  for i in range(max(0, n - 15), n)]
    else:
        recent = []
    # merge levels closer than 1.2% (keep the more meaningful label) and sort
    rank = {"breakout level (top of prior base)": 0, "52-week high": 1, "52-week low": 1, "200-day EMA": 2,
            "50-day EMA": 3, "20-day EMA": 4, "recent swing high": 5, "recent swing low": 5}
    uniq = []
    for name, v in sorted(levels, key=lambda x: rank.get(x[0], 9)):
        if v and not any(abs(v / u[1] - 1) < 0.012 for u in uniq):
            uniq.append((name, v))
    uniq.sort(key=lambda x: x[1])
    support = [x for x in uniq if x[1] < price * 0.999]
    resist = [x for x in uniq if x[1] > price * 1.001]
    return {
        "ticker": row["ticker"], "name": row["name"], "sector": row["sector"], "cap": row["cap"],
        "price": price, "change_1d_pct": row["chg"], "rsi14": row["rsi"], "rsi_above_its_average": row["rsiAboveMA"],
        "volume_vs_9day_avg": row["volSpike"], "opening_gap_pct": row["gap"],
        "pct_from_52w_high": row["from52"], "pct_from_20ema": row["from20"],
        "price_above_ema": row["emas"], "emas_stacked_bullishly": row["aligned"], "emas_converging": row["converge"],
        "days_since_10x20_bullish_cross": row["crossAgo"],
        "daily_pivot_zone": row["dPivot"], "weekly_pivot_zone": row["wPivot"],
        "breakout": row.get("bo"), "stage2_score_out_of_7": row["stage2"],
        "relative_strength_rank_1_99": row.get("rs"), "rs_rank_30_15_5_0_bars_ago": row.get("rsHist"),
        "darvas_box_breakout": row["darvas"], "fractal_breakout": row["fractal"], "recent_ipo": row["ipo"],
        "last_results_date": row.get("lastEarn"), "results_reaction_pct": {"day_before": row.get("e1"), "results_day": row.get("e0"), "day_after": row.get("e2")},
        "next_results_date": row.get("nextEarn"), "chaikin_money_flow_20": row.get("cmf"),
        "nearest_supports": [{"label": n_, "price": r2(v)} for n_, v in reversed(support[-4:])],
        "nearest_resistances": [{"label": n_, "price": r2(v)} for n_, v in resist[:4]],
        "last_15_daily_bars": recent,
        "market": market_ctx, "sector_strength": sector_ctx,
    }


# ------------------------------------------------------------------------- rule read
def rule_read(f: dict, session: str) -> dict:
    pts, risks = [], []
    e = f["price_above_ema"]
    s2, rs, hist = f["stage2_score_out_of_7"], f["relative_strength_rank_1_99"], f["rs_rank_30_15_5_0_bars_ago"] or [None] * 4

    if s2 >= 6 and e["200"] and e["50"]:
        trend = "Uptrend"
        pts.append(f"Primary trend is up: Stage 2 score {s2}/7, price above the 50- and 200-day EMAs.")
    elif not e["50"] and not e["200"]:
        trend = "Downtrend"
        pts.append(f"Primary trend is down: price is below the 50- and 200-day EMAs (Stage 2 score {s2}/7).")
    else:
        trend = "Sideways / transition"
        pts.append(f"Trend is mixed: Stage 2 score {s2}/7, price {'above' if e['200'] else 'below'} the 200-day EMA and {'above' if e['50'] else 'below'} the 50-day.")
    if f["emas_stacked_bullishly"]:
        pts.append("All EMAs are stacked bullishly (price > 10 > 20 > 50 > 200).")
    if f["emas_converging"]:
        pts.append("The 10/20/50-day EMAs are tightly converged — volatility is compressed, a larger move often follows.")

    d20 = f["pct_from_20ema"]
    if d20 > 10:
        pos = "extended"
        pts.append(f"Price is extended, {d20:+.1f}% from the 20-day EMA — chasing here carries more risk.")
        risks.append(f"Extended {d20:.1f}% above the 20-day EMA; pullbacks toward it are common.")
    elif 0 <= d20 <= 5 and e["50"]:
        pos = "near support"
        pts.append(f"Price is close to its 20-day EMA ({d20:+.1f}%), a typical support area in an uptrend.")
    elif d20 < 0:
        pos = "below 20 EMA"
        pts.append(f"Price is below its 20-day EMA ({d20:+.1f}%); short-term momentum has cooled.")
    else:
        pos = "above 20 EMA"

    h52 = f["pct_from_52w_high"]
    if h52 > -5:
        pts.append(f"Trading within {abs(h52):.1f}% of its 52-week high.")
    elif h52 < -40:
        pts.append(f"Still {abs(h52):.0f}% below its 52-week high — a long way from leadership.")
        risks.append("Deep below the 52-week high; overhead supply from earlier buyers.")

    if rs is not None:
        trend_rs = ""
        if hist[0] is not None and hist[3] is not None:
            d = hist[3] - hist[0]
            trend_rs = f", {'up' if d > 0 else 'down'} from {hist[0]} thirty bars ago" if abs(d) >= 5 else ", roughly unchanged over 30 bars"
        label = "a market leader" if rs >= 80 else "above average" if rs >= 50 else "a laggard"
        pts.append(f"Relative strength rank is {rs}/99 ({label}){trend_rs}.")

    bo = f["breakout"]
    if bo:
        when = "today" if bo["ago"] == 0 else f"{bo['ago']} bars ago"
        vol = f" on {bo['vol']}x average volume" if bo.get("vol") else ""
        g = bo.get("gain") or 0
        pts.append(f"Broke out of a base {when}{vol}; now {g:+.1f}% from the breakout close.")
        if g < -3:
            risks.append("Trading back below the breakout close — the breakout is at risk of failing.")
        if bo.get("vol") and bo["vol"] < 1.3:
            risks.append("The breakout came on light volume, which makes it less reliable.")

    vs, chg = f["volume_vs_9day_avg"], f["change_1d_pct"]
    if vs and vs >= 2:
        pts.append(f"Volume was {vs}x its recent average on a {chg:+.1f}% day — {'strong buying interest' if chg > 0 else 'heavy selling pressure'}.")
        if chg < 0:
            risks.append("High-volume decline (possible distribution).")

    r = f["rsi14"]
    if r >= 75:
        pts.append(f"RSI {r} is stretched; momentum is strong but short-term overbought.")
    elif r >= 50:
        pts.append(f"RSI {r} shows healthy momentum{' and is rising above its average' if f['rsi_above_its_average'] else ''}.")
    elif r < 40:
        pts.append(f"RSI {r} is weak.")

    if f["days_since_10x20_bullish_cross"] is not None and f["days_since_10x20_bullish_cross"] <= 5:
        pts.append(f"The 10-day EMA crossed above the 20-day {f['days_since_10x20_bullish_cross']} bars ago — an early sign of a turn up.")

    nxt = f["next_results_date"]
    if nxt:
        days = (date.fromisoformat(nxt) - date.fromisoformat(session)).days
        if 0 <= days <= 14:
            risks.append(f"Results due in about {days} days ({nxt}) — expect a volatility event.")

    m = f["market"]
    if m.get("pct_above_200ema") is not None and m["pct_above_200ema"] < 40:
        risks.append(f"Weak market backdrop: only {m['pct_above_200ema']:.0f}% of stocks are above their 200-day EMA.")
    sc = f["sector_strength"]
    if sc.get("rank") and sc.get("of"):
        if sc["rank"] <= 3:
            pts.append(f"Its sector ({f['sector']}) ranks {sc['rank']} of {sc['of']} — among the strongest groups.")
        elif sc["rank"] > sc["of"] - 3:
            risks.append(f"Its sector ({f['sector']}) ranks {sc['rank']} of {sc['of']} — one of the weakest groups.")

    headline = {
        ("Uptrend", "near support"): "Uptrend, pulling back toward support",
        ("Uptrend", "extended"): "Strong uptrend, but extended",
        ("Downtrend", "below 20 EMA"): "Downtrend, still under pressure",
        ("Downtrend", "extended"): "Sharp bounce inside a downtrend",
    }.get((trend, pos), f"{trend}, {pos}")
    return {
        "headline": headline, "trend": trend, "points": pts, "risks": risks,
        "supports": f["nearest_supports"][:3], "resistances": f["nearest_resistances"][:3],
    }


# --------------------------------------------------------------------------- Gemini
SYSTEM = (
    "You are a technical analyst writing short, factual chart reads for an educational stock screener. "
    "Use ONLY the numbers in the JSON you are given; never invent prices, dates or indicator values. "
    "Price levels you mention must come from nearest_supports / nearest_resistances or other fields given. "
    "Describe what the chart shows; do NOT give buy/sell/hold recommendations, entry or exit advice, "
    "price targets or predictions. Plain English, no hype, no emojis."
)
SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "summary": {"type": "STRING", "description": "3-4 sentence overview of the chart"},
        "trend": {"type": "STRING", "description": "Primary trend and stage in one sentence"},
        "setup": {"type": "STRING", "description": "Pattern currently forming (base, breakout, pullback, breakdown, range) and its quality"},
        "volume_momentum": {"type": "STRING", "description": "What volume, RSI and relative strength say"},
        "key_levels": {"type": "ARRAY", "items": {"type": "OBJECT", "properties": {
            "price": {"type": "NUMBER"}, "role": {"type": "STRING", "enum": ["support", "resistance"]},
            "why": {"type": "STRING"}}, "required": ["price", "role", "why"]}},
        "risks": {"type": "ARRAY", "items": {"type": "STRING"}},
        "watch_for": {"type": "ARRAY", "items": {"type": "STRING"}, "description": "Observable chart events that would confirm or invalidate the current picture (no trade advice)"},
    },
    "required": ["summary", "trend", "setup", "volume_momentum", "key_levels", "risks", "watch_for"],
}


class QuotaExhausted(Exception):
    pass


def _http(url, key, body=None, timeout=60):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"x-goog-api-key": key, "Content-Type": "application/json"},
                                 method="POST" if body is not None else "GET")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def pick_model(key: str) -> str:
    forced = os.environ.get("GEMINI_MODEL")
    if forced:
        return forced.removeprefix("models/")
    names = []
    url = f"{GEMINI_BASE}/models?pageSize=1000"
    j = _http(url, key)
    for m in j.get("models", []):
        if "generateContent" in m.get("supportedGenerationMethods", []):
            names.append(m["name"].removeprefix("models/"))
    if "gemini-flash-lite-latest" in names:
        return "gemini-flash-lite-latest"
    lite = [n for n in names if "flash-lite" in n and not re.search(r"preview|exp|tts|image|live|audio", n)]
    if not lite:
        lite = [n for n in names if "flash" in n and not re.search(r"preview|exp|tts|image|live|audio", n)]
    if not lite:
        raise RuntimeError("no suitable Gemini model available to this key")
    ver = lambda n: [float(x) for x in re.findall(r"\d+(?:\.\d+)?", n)] or [0.0]
    return sorted(lite, key=ver)[-1]


def gemini_read(key: str, model: str, facts: dict) -> dict:
    body = {
        "systemInstruction": {"parts": [{"text": SYSTEM}]},
        "contents": [{"role": "user", "parts": [{"text": "Write the chart read for this stock.\n\n" + json.dumps(facts, default=str)}]}],
        "generationConfig": {"responseMimeType": "application/json", "responseSchema": SCHEMA, "temperature": 0.3, "maxOutputTokens": 1200},
    }
    url = f"{GEMINI_BASE}/models/{model}:generateContent"
    for attempt in range(4):
        try:
            j = _http(url, key, body)
            text = j["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")
            if e.code == 429:
                if re.search(r"per ?day|PerDay|daily", msg, re.I):
                    raise QuotaExhausted(msg[:200])
                time.sleep(30 * (attempt + 1))  # per-minute limit: back off and retry
                continue
            if e.code >= 500:
                time.sleep(5 * (attempt + 1))
                continue
            raise RuntimeError(f"HTTP {e.code}: {msg[:200]}")
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            if attempt == 3:
                raise RuntimeError(f"unexpected response: {e}")
    raise RuntimeError("gave up after retries")


def clean_ai(ai: dict, facts: dict) -> dict:
    """Drop any price level the model did not take from the data we supplied."""
    allowed = [x["price"] for x in facts["nearest_supports"] + facts["nearest_resistances"]] + [facts["price"]]
    ok = []
    for lv in ai.get("key_levels", []) or []:
        try:
            p = float(lv["price"])
        except (TypeError, ValueError, KeyError):
            continue
        if any(a and abs(p / a - 1) < 0.006 for a in allowed):
            ok.append({"price": p, "role": lv.get("role", ""), "why": str(lv.get("why", ""))[:200]})
    out = {k: (str(ai.get(k, ""))[:900]) for k in ("summary", "trend", "setup", "volume_momentum")}
    out["key_levels"] = ok[:5]
    out["risks"] = [str(x)[:240] for x in (ai.get("risks") or [])][:5]
    out["watch_for"] = [str(x)[:240] for x in (ai.get("watch_for") or [])][:4]
    return out


# ----------------------------------------------------------------------------- main
PRIORITY_TESTS = [
    lambda r: r["aligned"], lambda r: bool(r.get("bo")), lambda r: r["stage2"] >= 6,
    lambda r: (r.get("rs") or 0) >= 80, lambda r: r["darvas"], lambda r: r["fractal"], lambda r: r["converge"],
]


def sector_context(rows):
    by = {}
    for r in rows:
        by.setdefault(r["sector"], []).append(r)
    scores = []
    for s, rs in by.items():
        n = len(rs)
        score = 0.5 * sum((x.get("rs") or 0) for x in rs) / n + 0.25 * 100 * sum(x["emas"]["20"] for x in rs) / n + 0.25 * 100 * sum(x["emas"]["200"] for x in rs) / n
        scores.append((s, score))
    scores.sort(key=lambda x: -x[1])
    return {s: {"name": s, "rank": i + 1, "of": len(scores)} for i, (s, _) in enumerate(scores)}


def run_market(market: str, key: str | None, model: str | None, budget: dict):
    path = DATA / f"{market}-daily.json"
    if not path.exists():
        print(f"[{market}] no {path.name}; run build_data.py first", file=sys.stderr)
        return
    d = json.loads(path.read_text())
    session, rows = d["session"], d["rows"]
    b = {x["key"]: x["value"] for x in d.get("breadth", [])}
    mctx = {"pct_above_20ema": b.get("e20"), "pct_above_200ema": b.get("e200"), "advance_decline_pct": b.get("ad"),
            "pct_near_52w_high": b.get("hi52")}
    sctx = sector_context(rows)

    out_dir = DATA / "analysis" / market
    previous = {}
    if out_dir.exists():  # keep AI text from an earlier run on the same session (local re-runs)
        for p in out_dir.glob("*.json"):
            try:
                j = json.loads(p.read_text())
                if j.get("session") == session and j.get("ai"):
                    previous[p.name] = j["ai"]
            except (OSError, json.JSONDecodeError):
                pass
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True)

    order = sorted(rows, key=lambda r: (-sum(t(r) for t in PRIORITY_TESTS), -(r.get("rs") or 0)))
    ai_on = bool(key and model) and market in budget["markets"]
    done = 0
    for r in order:
        fname = chart_file_name(r["ticker"])
        bars_path = DATA / "charts" / market / fname
        bars = json.loads(bars_path.read_text()) if bars_path.exists() else None
        facts = build_facts(r, bars, mctx, sctx.get(r["sector"], {}))
        payload = {"ticker": r["ticker"], "session": session, "rule": rule_read(facts, session), "ai": previous.get(fname)}
        if ai_on and payload["ai"] is None and budget["left"] > 0 and not budget["exhausted"]:
            try:
                ai = clean_ai(gemini_read(key, model, facts), facts)
                payload["ai"] = {**ai, "model": model, "generated": datetime.now(timezone.utc).isoformat(timespec="minutes")}
                budget["left"] -= 1
                done += 1
                time.sleep(budget["delay"])
            except QuotaExhausted as e:
                budget["exhausted"] = True
                print(f"[{market}] daily AI quota reached after {done} stocks ({e}); rest use the rule-based read", flush=True)
            except Exception as e:  # never fail the build because of AI
                print(f"  ! AI {r['ticker']}: {e}", file=sys.stderr)
        (out_dir / fname).write_text(json.dumps(payload, separators=(",", ":"), default=str), encoding="utf-8")
    print(f"[{market}] wrote {len(rows)} analyses ({done} new AI) → {out_dir.relative_to(ROOT)}", flush=True)


def main():
    key = os.environ.get("GEMINI_API_KEY", "").strip() or None
    model = None
    if key:
        try:
            model = pick_model(key)
            print(f"AI: using Gemini model {model}", flush=True)
        except Exception as e:
            print(f"AI disabled: could not list Gemini models ({e})", file=sys.stderr)
    else:
        print("AI: GEMINI_API_KEY not set — writing rule-based analyses only", flush=True)
    budget = {"left": int(os.environ.get("AI_MAX_STOCKS", "400")), "delay": float(os.environ.get("AI_DELAY", "4.5")),
              "exhausted": False, "markets": [m.strip() for m in os.environ.get("AI_MARKETS", "IN,US").split(",")]}
    for m in ("IN", "US"):
        run_market(m, key, model, budget)


if __name__ == "__main__":
    main()
