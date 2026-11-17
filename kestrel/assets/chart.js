/* Kestrel — interactive stock chart (candles, volume, EMAs, RSI, event markers).
 * Built on TradingView's open-source Lightweight Charts (Apache-2.0), loaded on first use.
 * Price history comes from data/charts/<MARKET>/<TICKER>.json written by pipeline/build_data.py. */
(function () {
  "use strict";
  const LIB = "https://unpkg.com/lightweight-charts@5.0.8/dist/lightweight-charts.standalone.production.js";
  let libPromise = null;
  const fileCache = {};

  function loadLib() {
    if (window.LightweightCharts) return Promise.resolve(window.LightweightCharts);
    if (!libPromise) {
      libPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = LIB; s.async = true;
        s.onload = () => resolve(window.LightweightCharts);
        s.onerror = () => { libPromise = null; reject(new Error("Chart library failed to load")); };
        document.head.appendChild(s);
      });
    }
    return libPromise;
  }

  /** Must match chart_file_name() in pipeline/build_data.py. */
  const chartFile = (ticker) => ticker.replace(/[^A-Za-z0-9-]/g, "_") + ".json";

  async function loadBars(market, ticker) {
    const key = market + ":" + ticker;
    if (!fileCache[key]) {
      fileCache[key] = fetch(`data/charts/${market}/${chartFile(ticker)}`, { cache: "no-cache" })
        .then((r) => { if (!r.ok) throw new Error("no chart file"); return r.json(); })
        .then((j) => j.t.map((t, i) => ({ time: t, open: j.o[i], high: j.h[i], low: j.l[i], close: j.c[i], volume: j.v[i] })))
        .catch((e) => { delete fileCache[key]; throw e; });
    }
    return fileCache[key];
  }

  /** Without a chart file (demo data), synthesise flat bars from the close series we already have. */
  function barsFromCloses(closes, endDate) {
    const out = []; const d = new Date(endDate);
    const dates = [];
    while (dates.length < closes.length) {
      if (d.getDay() !== 0 && d.getDay() !== 6) dates.unshift(new Date(d));
      d.setDate(d.getDate() - 1);
    }
    closes.forEach((c, i) => {
      const p = i ? closes[i - 1] : c;
      out.push({ time: iso(dates[i]), open: p, high: Math.max(p, c), low: Math.min(p, c), close: c, volume: 0 });
    });
    return out;
  }
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

  function toWeekly(bars) {
    const out = []; let cur = null, wk = null;
    for (const b of bars) {
      const d = new Date(b.time + "T00:00:00Z");
      const monday = new Date(d); monday.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
      const k = monday.toISOString().slice(0, 10);
      if (k !== wk) { if (cur) out.push(cur); wk = k; cur = { ...b }; }
      else { cur.high = Math.max(cur.high, b.high); cur.low = Math.min(cur.low, b.low); cur.close = b.close; cur.volume += b.volume; cur.time = b.time; }
    }
    if (cur) out.push(cur);
    return out;
  }

  function ema(values, p) {
    const k = 2 / (p + 1); let prev = values[0];
    return values.map((v) => (prev = v * k + prev * (1 - k)));
  }
  function rsi(values, p = 14) {
    const out = new Array(values.length).fill(null);
    let g = 0, l = 0;
    for (let i = 1; i < values.length; i++) {
      const d = values[i] - values[i - 1], up = Math.max(d, 0), dn = Math.max(-d, 0);
      if (i <= p) { g += up / p; l += dn / p; if (i === p) out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l); continue; }
      g = (g * (p - 1) + up) / p; l = (l * (p - 1) + dn) / p;
      out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l);
    }
    return out;
  }

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const fmtVol = (v) => v >= 1e7 ? (v / 1e7).toFixed(2) + " Cr" : v >= 1e5 ? (v / 1e5).toFixed(2) + " L" : v >= 1e3 ? (v / 1e3).toFixed(1) + "K" : String(v);
  const fmtVolUS = (v) => v >= 1e9 ? (v / 1e9).toFixed(2) + "B" : v >= 1e6 ? (v / 1e6).toFixed(2) + "M" : v >= 1e3 ? (v / 1e3).toFixed(1) + "K" : String(v);

  /**
   * Render a chart into `el`. opts: { market, row, tf, sessionDate, settings, legendEl }
   * settings: { type: "candles"|"line", range: "3M"|"6M"|"1Y"|"ALL", ema20, ema50, ema200, volume, rsi }
   * Returns { destroy() }.
   */
  async function render(el, opts) {
    const LW = await loadLib();
    const { row, market, settings, legendEl } = opts;
    let bars, approx = false;
    try { bars = await loadBars(market, row.ticker); }
    catch (e) { bars = barsFromCloses(row.series, opts.sessionDate); approx = true; }
    if (opts.tf === "weekly") bars = toWeekly(bars);
    if (!bars.length) throw new Error("No price history");

    const pos = css("--pos") || "#0f8a52", neg = css("--neg") || "#d4231a";
    const chart = LW.createChart(el, {
      autoSize: true,
      layout: { background: { type: "solid", color: css("--surface") }, textColor: css("--muted"), fontFamily: css("--font"), panes: { separatorColor: css("--border"), separatorHoverColor: css("--border-strong") }, attributionLogo: false },
      grid: { vertLines: { color: css("--border") + "80" }, horzLines: { color: css("--border") + "80" } },
      rightPriceScale: { borderColor: css("--border") },
      timeScale: { borderColor: css("--border"), rightOffset: 4, minBarSpacing: 1 },
      crosshair: { mode: LW.CrosshairMode.Normal },
      localization: { priceFormatter: (p) => p.toLocaleString(market === "US" ? "en-US" : "en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    });

    const closes = bars.map((b) => b.close);
    const main = settings.type === "line" || approx
      ? chart.addSeries(LW.AreaSeries, { lineColor: css("--brand"), topColor: css("--brand") + "33", bottomColor: css("--brand") + "00", lineWidth: 2 })
      : chart.addSeries(LW.CandlestickSeries, { upColor: pos, downColor: neg, wickUpColor: pos, wickDownColor: neg, borderVisible: false });
    main.setData(settings.type === "line" || approx ? bars.map((b) => ({ time: b.time, value: b.close })) : bars);

    // 52-week high reference line
    const look = opts.tf === "weekly" ? 52 : 252;
    const hi52 = Math.max(...bars.slice(-look).map((b) => b.high));
    main.createPriceLine({ price: hi52, color: css("--faint"), lineWidth: 1, lineStyle: LW.LineStyle.Dashed, axisLabelVisible: true, title: "52W high" });

    const emaDefs = [[20, "#2f9e6b", settings.ema20], [50, "#2563d9", settings.ema50], [200, "#e0912f", settings.ema200]];
    const emaSeries = {};
    emaDefs.forEach(([p, color, on]) => {
      if (!on || bars.length <= p) return; // not enough history for a meaningful EMA
      const s = chart.addSeries(LW.LineSeries, { color, lineWidth: p === 200 ? 2 : 1.5, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
      const vals = ema(closes, p);
      s.setData(bars.map((b, i) => ({ time: b.time, value: vals[i] })).slice(p - 1));
      emaSeries[p] = { s, vals };
    });

    let vol = null;
    if (settings.volume && !approx) {
      vol = chart.addSeries(LW.HistogramSeries, { priceFormat: { type: "volume" }, priceScaleId: "vol", lastValueVisible: false, priceLineVisible: false });
      vol.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      vol.setData(bars.map((b, i) => ({ time: b.time, value: b.volume, color: (i && b.close < bars[i - 1].close ? neg : pos) + "66" })));
    }

    let rsiVals = null;
    if (settings.rsi) {
      rsiVals = rsi(closes);
      const r = chart.addSeries(LW.LineSeries, { color: css("--brand"), lineWidth: 1.5, priceLineVisible: false, lastValueVisible: true }, 1);
      r.setData(bars.map((b, i) => (rsiVals[i] == null ? { time: b.time } : { time: b.time, value: rsiVals[i] })));
      [70, 30].forEach((lvl) => r.createPriceLine({ price: lvl, color: css("--faint"), lineWidth: 1, lineStyle: LW.LineStyle.Dotted, axisLabelVisible: false, title: String(lvl) }));
      const panes = chart.panes();
      if (panes[1]) panes[1].setHeight(Math.round(el.clientHeight * 0.22));
    }

    // Event markers: breakout and last earnings
    const markers = [];
    const nearest = (date) => { if (!date) return null; let best = null; for (const b of bars) { if (b.time <= date) best = b.time; else break; } return best; };
    if (row.bo && row.bo.date) { const t = nearest(row.bo.date); if (t) markers.push({ time: t, position: "belowBar", color: css("--brand"), shape: "arrowUp", text: "Breakout" }); }
    if (row.lastEarn) { const t = nearest(iso(row.lastEarn)); if (t) markers.push({ time: t, position: "aboveBar", color: css("--accent"), shape: "circle", text: "E" }); }
    markers.sort((a, b) => (a.time < b.time ? -1 : 1));
    if (markers.length && LW.createSeriesMarkers) LW.createSeriesMarkers(main, markers);

    // Visible range
    const spans = { "3M": 63, "6M": 126, "1Y": 252, "ALL": Infinity };
    let n = spans[settings.range] || 126;
    if (opts.tf === "weekly") n = n === Infinity ? n : Math.ceil(n / 5);
    if (n !== Infinity && bars.length > n) chart.timeScale().setVisibleLogicalRange({ from: bars.length - n, to: bars.length + 3 });
    else chart.timeScale().fitContent();

    // Crosshair legend
    const vf = market === "US" ? fmtVolUS : fmtVol;
    const pf = (p) => p == null ? "--" : p.toLocaleString(market === "US" ? "en-US" : "en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const index = new Map(bars.map((b, i) => [b.time, i]));
    function legend(i) {
      if (!legendEl) return;
      const b = bars[i], p = i ? bars[i - 1].close : b.open, ch = ((b.close / p - 1) * 100);
      const parts = [`<b>${b.time}</b>`];
      if (!approx) parts.push(`O <b>${pf(b.open)}</b>`, `H <b>${pf(b.high)}</b>`, `L <b>${pf(b.low)}</b>`);
      parts.push(`C <b>${pf(b.close)}</b>`, `<b class="${ch >= 0 ? "pos" : "neg"}">${ch >= 0 ? "+" : ""}${ch.toFixed(2)}%</b>`);
      if (!approx) parts.push(`Vol <b>${vf(b.volume)}</b>`);
      Object.entries(emaSeries).forEach(([p2, { vals }]) => parts.push(`<span style="color:${{ 20: "#2f9e6b", 50: "#2563d9", 200: "#e0912f" }[p2]}">EMA${p2} <b>${pf(vals[i])}</b></span>`));
      if (rsiVals && rsiVals[i] != null) parts.push(`RSI <b>${rsiVals[i].toFixed(1)}</b>`);
      legendEl.innerHTML = parts.join('<span class="sep">·</span>') + (approx ? ' <span class="demo-flag">approximate · run the data pipeline for full OHLC</span>' : "");
    }
    legend(bars.length - 1);
    chart.subscribeCrosshairMove((param) => {
      const i = param && param.time != null ? index.get(typeof param.time === "string" ? param.time : iso(new Date(param.time.year, param.time.month - 1, param.time.day))) : undefined;
      legend(i == null ? bars.length - 1 : i);
    });

    return { destroy() { try { chart.remove(); } catch (e) { /* already gone */ } } };
  }

  window.Kestrel = window.Kestrel || {};
  window.Kestrel.chart = { render, loadLib };
})();
