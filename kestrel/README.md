# Kestrel — technical stock screener

A complete, launchable stock-screener website for **Indian (NSE)** and **US** equities, with
market breadth, trend and momentum scans, breakouts, Stage 2 scoring, sector rotation and
relative-strength ranking.

It is a **static site**: no server and no database. A Python pipeline downloads end-of-day
prices, computes every indicator and writes JSON files. The browser app reads those files.
A GitHub Action re-runs the pipeline every weekday and redeploys, so hosting is free.

```
kestrel/
├── index.html            Landing page: live breadth meters and today's movers
├── screener.html         The screener app
├── privacy.html, terms.html   Legal templates (fill in before launch)
├── assets/
│   ├── styles.css        Theme. All colours and fonts are tokens at the top
│   ├── app.js            Screener logic: filters, sorting, panels, watchlists
│   ├── chart.js          Interactive candlestick chart (loads on first use)
│   ├── data.js           Loads data/*.json; falls back to synthetic demo data
│   └── logo.svg
├── data/                 Generated: IN/US daily + weekly .json, plus charts/<MARKET>/<TICKER>.json
│                         (per-stock OHLCV for the chart; not committed, built by the pipeline)
└── pipeline/
    ├── build_data.py     Downloads OHLCV and computes all metrics
    ├── universe_in.csv   Stocks to scan (ticker,name,sector,cap). Edit freely
    ├── universe_us.csv
    └── requirements.txt
```

## Features

| Area | What it does |
|---|---|
| **Market health** | 7 breadth gauges (A/D, % above 20/200 EMA, RSI>60, above pivot, near 52W high, recent breakouts), each with a 60-bar history chart |
| **Results table** | 28 columns in groups: price & volume, EMAs, pivots, breakouts, relative strength, earnings reaction, liquidity, notes. Sticky ticker column, sort by any column |
| **Recommended scans** | EMAs aligned, EMAs converging, RSI > MA, base breakouts, crossed pivot, IPOs, fractal breakout, Darvas box, Stage 2 (6+/7), RS leaders. They stack |
| **Custom filters** | Price, change, RSI, volume spike, distance from 52W high and 20 EMA, Stage 2, RS, turnover, EMA position, recent cross, upcoming earnings |
| **Sectors view** | Sectors ranked by RS and trend participation, with advance/decline, turnover share, CMF, breakout count and RS leaders |
| **Kestrel Eye** | RS rank vs. RS change map (leading / weakening / lagging / improving) of your current screen |
| **Interactive chart** | Click any ticker: candlesticks or line, daily/weekly, 3M–All ranges, EMA 20/50/200, volume, RSI pane, 52W-high line, breakout and earnings markers, zoom/pan, ← → to flip through your results. Built with TradingView's open-source Lightweight Charts |
| **Your data** | 3 named watchlists, per-stock notes and saved filter templates, kept in browser storage, with backup/restore to a JSON file |
| **Cheat Filter** (`cheat.html`) | Runs the swing playbook automatically: green/yellow/red market verdict (with a warning gate when the market is unsuitable), top-5 strong sectors, and the pullback and breakout setups that match the rules, each scored on the 10-point checklist. **Public site:** matches, scores and warnings only, with no trade levels. **Private copy** (`pipeline/private_live.py`): adds rule-based entry, stop, 2x/3x targets, quantity, order instructions and intraday confirmations |
| **AI analysis** | "✨ AI analysis" button in every stock popup. Shows a Gemini-written chart read (trend, setup, volume/momentum, key levels, risks, what to watch) when available, otherwise Kestrel's rule-based read. Pre-generated nightly, so it's instant and costs nothing per click |
| **Sharing** | "Share active filters" copies a link that reproduces the exact screen. "Copy tickers" exports in TradingView format |
| **Also** | Daily/weekly timeframes, IN/US markets, dark mode, `/` to search, guided tour, mobile layout |

### How the indicators are computed (`pipeline/build_data.py`)
- **EMAs** 10/20/50/200 on closes. **RSI** is 14-period Wilder; its "MA" is a 14-period EMA of RSI.
- **Volume spike**: latest volume ÷ average of the previous 9 bars. **Gap**: open ÷ prior close.
- **Pivots**: classic floor pivots from the previous bar (D-pivot) and previous week (W-pivot).
- **Breakout**: a close above the highest close of the prior 40 bars (base depth under 35%) within the last 20 bars. Shows gain since breakout and breakout-day volume vs. its 20-bar average.
- **Stage 2 (0–7)**: price>50EMA, price>200EMA, 50>200, 200 EMA rising, ≥30% above 52W low, within 25% of 52W high, RSI>50.
- **RS rank (1–99)**: percentile of the weighted 3/6/12-month return (40/30/30), recomputed at T-30/T-15/T-5/T0.
- **Darvas**: a close above a tight 20-bar box (<15% tall) while within 10% of the 52W high. **Fractal**: a close above the latest Bill Williams up-fractal.
- **Earnings reaction**: % move the day before, the day of and the day after the last results date.
- A bar from today is dropped until that market has closed, so a mid-session run never sees a half-finished day.

## AI analysis (free)

`pipeline/analysis.py` runs after `build_data.py` and writes `data/analysis/<MARKET>/<TICKER>.json` for every stock:

- **Rule-based read**: always on, no key needed. Plain-English notes built directly from the indicators, so it can't make up numbers.
- **AI read**: uses Google's **Gemini API free tier** (a "flash-lite" model, roughly 500 requests a day, enough for every stock once a night).
  1. Get a free key at https://aistudio.google.com ("Get API key"; no card needed).
  2. In GitHub, go to **Settings → Secrets and variables → Actions → New repository secret**, name it `GEMINI_API_KEY`, and paste the key.
  3. The next nightly run (or **Actions → Run workflow**) generates AI reads. Stocks that pass the most scans go first.

The key only lives in GitHub Actions and never reaches the website. Price levels the AI mentions are checked against the data,
and any it invents are dropped. If the free quota runs out, the remaining stocks show the rule-based read.
The AI is instructed to describe the chart only, with no buy/sell calls or price targets.
Optional settings (as Actions variables or env): `GEMINI_MODEL`, `AI_MAX_STOCKS`, `AI_DELAY`, `AI_MARKETS`.

## Private mode: trade levels and intraday confirmations

Publishing entry, stop-loss and target levels for named stocks, or intraday "confirmed" calls, can
require SEBI Research Analyst registration, and NSE / Yahoo terms restrict redistributing price data.
So the **public site never shows them**. They exist only in a private copy on your own computer:

```bash
python pipeline/private_live.py
```

It downloads the latest end-of-day files from the published site into a git-ignored `.live/` copy,
marks it private (`data/private.json`), serves it at http://localhost:8000/cheat.html and, during market
hours, refreshes **intraday confirmations** every 30 minutes until the close.

`pipeline/intraday.py` checks the Cheat Filter's candidates on Yahoo's 15-minute bars (30-minute bars
are built from them). A setup is shown in the **⚡ Intraday** tab only once it is confirmed: a 30-minute
candle closes above the entry trigger after 9:45, above the day's VWAP, with volume at least 1.5x
(breakouts) or 1x (pullbacks) its normal level for that time of day, plus a higher low for pullbacks.
Gap-ups above the buy limit, 30-minute closes below the stop, and confirmations that fall back below the
trigger are dropped. New confirmations pause if the Nifty is down 1% or more, and after 3:30 pm each
confirmed setup is marked held or failed. The **📅 Swing** tab keeps the full end-of-day list.

## Run it locally

```bash
cd kestrel
pip install -r pipeline/requirements.txt
python pipeline/build_data.py          # ~3–5 min; add --no-earnings for ~1 min
python pipeline/analysis.py            # stock analyses (set GEMINI_API_KEY for AI)
python -m http.server 8000             # then open http://localhost:8000
```

Without `data/*.json` the site still runs on synthetic demo data, marked **DEMO DATA**.

## Launch it (free, about 10 minutes)

1. Push this repo to GitHub (the workflow lives at `.github/workflows/kestrel-deploy.yml`).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Actions → "Kestrel — refresh data & deploy" → Run workflow.** The site goes live at
   `https://<user>.github.io/<repo>/`. After that it refreshes every weekday at 22:17 UTC.
4. Custom domain: **Settings → Pages → Custom domain**, then add a `CNAME` DNS record pointing to
   `<user>.github.io`.

Other hosts work too. Netlify, Vercel or Cloudflare Pages can serve the `kestrel/` folder as-is;
run the pipeline from a cron job or the same GitHub Action.

## Customise

- **Brand and colours**: edit the tokens at the top of `assets/styles.css` (`--grad`, `--ink`,
  `--brand` and so on), the name in the HTML files, and `assets/logo.svg`.
- **Stock list**: the Indian universe is every NSE main-board stock (series EQ/BE), rebuilt by
  `pipeline/update_universe.py` before each nightly build. Cap buckets follow index membership
  (Nifty 100 = LC, Midcap 150 = MC, Smallcap 250 = SC, the rest = MI). Sectors are Yahoo's industry,
  looked up once per new listing. Earnings dates are fetched for LC/MC/SC stocks only (one slow request each).
  Put a symbol in the `yahoo` column of `universe_in.csv` to override it (e.g. a `.BO` listing). The US list is in `universe_us.csv`.
- **New scan**: add an entry to `PRESETS` in `assets/app.js`. It is a label plus a test function on a row.
- **New column**: compute it in `compute_stock()` and add an entry to `COLS` in `assets/app.js`.
- **Paid or real-time data**: replace `download_ohlcv()` and `fetch_earnings()` in the pipeline.
  Everything downstream only needs OHLCV DataFrames.

## Before you go public

- **Data licence**: Yahoo Finance data via `yfinance` is fine for personal use, but its terms do not allow
  commercial redistribution. For a public or paid product, licence EOD data from a vendor
  (e.g. NSE data vendors, TrueData or Global Datafeeds for India; Polygon or Tiingo for the US) and plug it in as above.
- **Regulation (India)**: publishing screens is generally fine. Giving buy/sell *recommendations* can
  require SEBI Research Analyst registration. Keep the "not investment advice" wording and take advice.
- **Legal pages**: fill in the bracketed placeholders in `privacy.html` and `terms.html`.
- **Accounts (optional)**: watchlists, notes and templates live in the browser. To sync across devices,
  replace the small `store` object at the top of `assets/app.js` with calls to a backend such as Supabase or Firebase.
