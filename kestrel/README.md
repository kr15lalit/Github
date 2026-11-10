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
│   ├── app.js            Screener logic: filters, sorting, panels, charts, watchlists
│   ├── data.js           Loads data/*.json; falls back to synthetic demo data
│   └── logo.svg
├── data/                 Generated: IN-daily, IN-weekly, US-daily, US-weekly .json
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
| **Stock drawer** | Price with 20/50/200 EMAs, key stats, notes, link to TradingView |
| **Your data** | 3 named watchlists, per-stock notes and saved filter templates, kept in browser storage, with backup/restore to a JSON file |
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

## Run it locally

```bash
cd kestrel
pip install -r pipeline/requirements.txt
python pipeline/build_data.py          # ~3–5 min; add --no-earnings for ~1 min
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
- **More stocks** (for example the full Nifty 500): add rows to `pipeline/universe_in.csv`.
  `cap` is one of `LC`, `MC`, `SC`, `MI`. Add a `yahoo` column to override a symbol (e.g. a `.BO` listing).
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
