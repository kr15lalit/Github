/* Kestrel screener — application logic (vanilla JS, no build step). */
(function () {
  "use strict";
  const D = window.Kestrel.data;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- persistent user store (browser storage; swap for a backend if you add accounts) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem("kestrel-" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("kestrel-" + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  const WL_COLORS = ["#2f9e6b", "#2463b8", "#e0912f"];
  let lists = store.get("lists", [{ name: "Watchlist 1", items: [] }, { name: "Watchlist 2", items: [] }, { name: "Watchlist 3", items: [] }]);
  let notes = store.get("notes", {});
  let templates = store.get("templates", []);

  // ---------- state ----------
  const DEFAULT_FILTERS = { priceMin: "", priceMax: "", chgMin: "", chgMax: "", rsiMin: "", rsiMax: "", volMin: "", from52Min: "", from20Max: "", stageMin: "", rsMin: "", turnMin: "", above50: false, above200: false, crossRecent: false, nearEarn: false };
  const state = {
    market: "IN", tf: "daily", view: "stocks", cap: "", sector: "", q: "",
    presets: [], filters: { ...DEFAULT_FILTERS }, list: -1,
    sort: { key: "chg", dir: -1 }, limit: 100,
    hidden: store.get("hiddenGroups", []), health: store.get("health", true),
  };
  let data = null;

  // ---------- presets (recommended scans) ----------
  const PRESETS = [
    { id: "aligned", label: "EMAs Aligned", help: "Price > 10 > 20 > 50 > 200 EMA", test: (r) => r.aligned },
    { id: "converge", label: "EMAs Converge", help: "10/20/50 EMAs within 2.5% of each other — a coiled spring", test: (r) => r.converge },
    { id: "rsima", label: "RSI > MA", help: "RSI above its 14-period average and above 50", test: (r) => r.rsiAboveMA && r.rsi > 50 },
    { id: "bo", label: "Breakout stocks", help: "Closed above a 40-bar base in the last 20 bars", test: (r) => !!r.bo },
    { id: "pivot", label: "Crossed Pivot", help: "Trading above the daily pivot point", test: (r) => /PP-R1|R1|R2/.test(r.dPivot) },
    { id: "ipo", label: "IPO stocks", help: "Listed within roughly the last year", test: (r) => r.ipo },
    { id: "fractal", label: "Fractal Breakout", help: "Closed above the most recent up-fractal high", test: (r) => r.fractal },
    { id: "darvas", label: "Darvas Box", help: "Broke above a tight 20-bar box near 52-week highs", test: (r) => r.darvas },
    { id: "stage2", label: "Stage 2 (6+/7)", help: "Scores 6 or 7 on the Stage 2 checklist", test: (r) => r.stage2 >= 6 },
    { id: "leaders", label: "RS Leaders", help: "Relative strength rank 80 or above", test: (r) => r.rs >= 80 },
  ];

  // ---------- formatting ----------
  const nf = (n, d = 1) => n == null ? "--" : Number(n).toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
  const sgn = (n, d = 1) => n == null ? "--" : (n > 0 ? "+" : n < 0 ? "−" : "") + nf(Math.abs(n), d) + "%";
  const cls = (n) => n == null ? "" : n > 0 ? "pos" : n < 0 ? "neg" : "";
  const pill = (n) => `<span class="pill ${n == null ? "flat" : n > 0 ? "pos" : n < 0 ? "neg" : "flat"}">${sgn(n)}</span>`;
  const cur = () => (state.market === "US" ? "$" : "₹");
  const rankCls = (v) => v == null ? "" : v >= 70 ? "r-hi" : v >= 40 ? "r-mid" : "r-lo";
  const fmtDate = (d) => d ? D.fmtShort(d) : "--";
  const crore = (v) => state.market === "US" ? "$" + nf(v / 1e6, 1) + "M" : "₹" + nf(v / 1e7, 1) + " Cr";

  // ---------- column definitions ----------
  const COLS = [
    { k: "idx", g: "core", label: "#", cls: "c num-idx", sticky: true, w: 44, render: (r, i) => i + 1 },
    { k: "wl", g: "core", label: "Watch", sub: "lists", cls: "c", sticky: true, w: 76, render: (r) => `<span class="wl">${lists.map((l, i) => `<button style="--wc:${WL_COLORS[i]}" data-wl="${i}" data-t="${esc(r.ticker)}" aria-pressed="${l.items.includes(r.ticker)}" title="${esc(l.name)}" aria-label="Toggle ${esc(r.ticker)} in ${esc(l.name)}"></button>`).join("")}</span>` },
    { k: "cap", g: "core", label: "Cap", cls: "c", sticky: true, w: 54, sort: (r) => ({ LC: 4, MC: 3, SC: 2, MI: 1 }[r.cap]), render: (r) => `<span class="cap ${r.cap}">${r.cap === "MI" ? "Mic" : r.cap}</span>`, help: "Market-cap bucket" },
    { k: "ticker", g: "core", label: "Ticker", cls: "l", sticky: true, last: true, w: 150, sort: (r) => r.ticker, render: (r) => `<button class="tk" data-open="${esc(r.ticker)}" title="${esc(r.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>${esc(r.ticker)}</button>${r.ipo ? '<span class="tag">IPO</span>' : ""}` },
    { k: "sector", g: "core", label: "Sector", cls: "l", sort: (r) => r.sector, render: (r) => `<div class="sector-cell">${esc(r.sector)}</div>` },

    { k: "price", g: "pv", label: () => `Price (${cur()})`, sub: () => data ? D.fmtShort(data.session) : "", sort: (r) => r.price, render: (r) => nf(r.price, r.price >= 1000 ? 1 : 2) },
    { k: "chg", g: "pv", label: () => state.tf === "weekly" ? "1W%" : "1D%", sort: (r) => r.chg, render: (r) => pill(r.chg), help: "Change versus previous close" },
    { k: "rsi", g: "pv", label: "RSI", sort: (r) => r.rsi, render: (r) => `${r.rsi}<span class="dot ${r.rsiAboveMA ? "up" : "dn"}" title="RSI ${r.rsiAboveMA ? "above" : "below"} its average"></span>`, help: "14-period Wilder RSI. Dot: green when above its 14-period average." },
    { k: "volSpike", g: "pv", label: "Vol spike", sub: "1D / 9D avg", sort: (r) => r.volSpike, render: (r) => `<span class="${r.volSpike >= 2 ? "pos" : ""}">${nf(r.volSpike)}x</span>`, help: "Latest volume ÷ average of the 9 prior bars" },
    { k: "gap", g: "pv", label: "Gap", sub: "opening", sort: (r) => r.gap, render: (r) => `<span class="pill outline">${sgn(r.gap)}</span>` },
    { k: "from52", g: "pv", label: "52W high", sub: "distance", sort: (r) => r.from52, render: (r) => `<span class="${r.from52 > -5 ? "pos" : ""}">${sgn(r.from52)}</span>` },

    { k: "emas", g: "ema", label: "EMAs", sub: "price above?", cls: "c", sort: (r) => Object.values(r.emas).filter(Boolean).length, render: (r) => `<span class="emas">${[10, 20, 50, 200].map((p) => `<span class="${r.emas[p] ? "up" : "dn"}">${p}</span>`).join("")}</span>`, help: "Green = price above that EMA" },
    { k: "from20", g: "ema", label: "% from", sub: "20 EMA", sort: (r) => r.from20, render: (r) => sgn(r.from20) },
    { k: "crossAgo", g: "ema", label: "EMA cross", sub: "10 × 20", cls: "c", sort: (r) => r.crossAgo == null ? 9999 : r.crossAgo, render: (r) => r.crossAgo == null ? '<span class="pill flat">--</span>' : `<span class="badge-days">${r.crossAgo === 0 ? "today" : r.crossAgo + (state.tf === "weekly" ? " wk" : " days")}</span>`, help: "Bars since 10 EMA crossed above 20 EMA" },

    { k: "dPivot", g: "piv", label: () => state.tf === "weekly" ? "W-pivot" : "D-pivot", cls: "l", sort: (r) => pivRank(r.dPivot), render: (r) => pivCell(r.dPivot) },
    { k: "wPivot", g: "piv", label: () => state.tf === "weekly" ? "M-pivot" : "W-pivot", cls: "l", sort: (r) => pivRank(r.wPivot), render: (r) => pivCell(r.wPivot) },

    { k: "boGain", g: "bo", label: "BO gain%", sort: (r) => r.bo ? r.bo.gain : -999, render: (r) => r.bo ? `${pill(r.bo.gain)} <small class="caption">${r.bo.ago === 0 ? "today" : r.bo.ago + " ago"}</small>` : '<span class="pill flat">--</span>' },
    { k: "boVol", g: "bo", label: "BO vol", sub: "vs 20 avg", sort: (r) => r.bo ? r.bo.vol : -1, render: (r) => r.bo ? nf(r.bo.vol) + "x" : "--" },
    { k: "stage2", g: "bo", label: "Stage 2", sub: "score /7", cls: "c", sort: (r) => r.stage2, render: (r) => `<span class="stage" title="${r.stage2}/7">${Array.from({ length: 7 }, (_, i) => `<i class="${i < r.stage2 ? "on" : ""}"></i>`).join("")}</span> ${r.stage2}`, help: "7-point checklist: price>50EMA, price>200EMA, 50>200, 200 EMA rising, 30% above 52W low, within 25% of 52W high, RSI>50" },

    { k: "rs", g: "rs", label: "RS", sub: "rank 1–99", cls: "c", sort: (r) => r.rs, render: (r) => `<span class="pill ${rankCls(r.rs)}">${r.rs ?? "--"}</span>`, help: "Percentile rank of weighted 3/6/12-month return across the universe" },
    { k: "rsHist", g: "rs", label: "RS history", sub: "T-30 → T-15 → T-5 → T0", cls: "c", sort: (r) => (r.rsHist[3] ?? 0) - (r.rsHist[0] ?? 0), render: (r) => `<span class="rsh">${r.rsHist.map((v, i) => `${i ? "<em>→</em>" : ""}<span class="${rankCls(v)}">${v ?? "--"}</span>`).join("")}</span>` },

    { k: "lastEarn", g: "earn", label: "Last earn.", sort: (r) => r.lastEarn ? +r.lastEarn : 0, render: (r) => fmtDate(r.lastEarn) },
    { k: "e1", g: "earn", label: "−1D%", sort: (r) => r.e1, render: (r) => `<span class="${cls(r.e1)}">${sgn(r.e1)}</span>` },
    { k: "e0", g: "earn", label: "E-day%", sort: (r) => r.e0, render: (r) => pill(r.e0) },
    { k: "e2", g: "earn", label: "+1D%", sort: (r) => r.e2, render: (r) => `<span class="${cls(r.e2)}">${sgn(r.e2)}</span>` },
    { k: "nextEarn", g: "earn", label: "Next earn.", sort: (r) => r.nextEarn ? +r.nextEarn : 9e15, render: (r) => r.nextEarn ? `<b>${fmtDate(r.nextEarn)}</b>` : "--" },

    { k: "turnover", g: "liq", label: "Turnover", sub: "last bar", sort: (r) => r.turnover, render: (r) => crore(r.turnover) },
    { k: "cmf", g: "liq", label: "CMF", sub: "20", sort: (r) => r.cmf, render: (r) => `<span class="${cls(r.cmf)}">${nf(r.cmf, 2)}</span>`, help: "Chaikin Money Flow (20)" },

    { k: "notes", g: "notes", label: "Notes", cls: "l", sort: (r) => notes[r.ticker] || "", render: (r) => `<button class="note-btn ${notes[r.ticker] ? "has" : ""}" data-note="${esc(r.ticker)}">${notes[r.ticker] ? esc(notes[r.ticker]) : "+ Add note"}</button>` },
  ];
  const GROUPS = { core: "", pv: "Price & volume", ema: "EMAs", piv: "Pivots", bo: "Breakouts", rs: "Relative strength", earn: "Earnings reaction", liq: "Liquidity", notes: "Research" };
  const PIV = ["Below S2", "S2-S1", "S1-PP", "PP-R1", "R1-R2", "Above R2"];
  const pivRank = (z) => PIV.indexOf(z);
  const pivCell = (z) => z ? `<span class="${pivRank(z) >= 3 ? "pos" : "neg"}">${z}</span>` : "--";
  const val = (v, r) => typeof v === "function" ? v(r) : v || "";

  // ---------- filtering ----------
  const numOr = (v) => (v === "" || v == null || isNaN(+v) ? null : +v);
  function filtered() {
    const f = state.filters, q = state.q.trim().toLowerCase();
    const n = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, typeof v === "boolean" ? v : numOr(v)]));
    const listSet = state.list >= 0 ? new Set(lists[state.list].items) : null;
    const today = data.session;
    let rows = data.rows.filter((r) => {
      if (state.cap && r.cap !== state.cap) return false;
      if (state.sector && r.sector !== state.sector) return false;
      if (listSet && !listSet.has(r.ticker)) return false;
      if (q && !(r.ticker.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.sector.toLowerCase().includes(q))) return false;
      for (const id of state.presets) { const p = PRESETS.find((x) => x.id === id); if (p && !p.test(r)) return false; }
      if (n.priceMin != null && r.price < n.priceMin) return false;
      if (n.priceMax != null && r.price > n.priceMax) return false;
      if (n.chgMin != null && r.chg < n.chgMin) return false;
      if (n.chgMax != null && r.chg > n.chgMax) return false;
      if (n.rsiMin != null && r.rsi < n.rsiMin) return false;
      if (n.rsiMax != null && r.rsi > n.rsiMax) return false;
      if (n.volMin != null && r.volSpike < n.volMin) return false;
      if (n.from52Min != null && r.from52 < n.from52Min) return false;
      if (n.from20Max != null && r.from20 > n.from20Max) return false;
      if (n.stageMin != null && r.stage2 < n.stageMin) return false;
      if (n.rsMin != null && (r.rs ?? 0) < n.rsMin) return false;
      if (n.turnMin != null && r.turnover < n.turnMin * (state.market === "US" ? 1e6 : 1e7)) return false;
      if (f.above50 && !r.emas[50]) return false;
      if (f.above200 && !r.emas[200]) return false;
      if (f.crossRecent && !(r.crossAgo != null && r.crossAgo <= 5)) return false;
      if (f.nearEarn && !(r.nextEarn && (r.nextEarn - today) / 864e5 <= 14)) return false;
      return true;
    });
    const col = COLS.find((c) => c.k === state.sort.key) || COLS.find((c) => c.k === "chg");
    const dir = state.sort.dir;
    rows.sort((a, b) => {
      const x = col.sort(a), y = col.sort(b);
      if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
      return (typeof x === "string" ? x.localeCompare(y) : x - y) * dir;
    });
    return rows;
  }

  // ---------- rendering: header bits ----------
  function renderIndices() {
    $("#indices").innerHTML = data.indices.map((x) => `<div><span>${esc(x.name)}</span><span><b>${nf(x.value, 2)}</b><small class="${cls(x.chg)}">${sgn(x.chg, 2)}</small></span></div>`).join("");
  }
  function spark(hist, color) {
    const w = 120, h = 22, min = Math.min(...hist), max = Math.max(...hist), span = max - min || 1;
    const pts = hist.map((v, i) => `${(i / (hist.length - 1)) * w},${h - 2 - ((v - min) / span) * (h - 4)}`).join(" ");
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>`;
  }
  function breadthColor(b) {
    const v = b.key === "ad" ? b.value + 50 : b.value;
    return v >= 60 ? "var(--pos)" : v >= 40 ? "var(--accent)" : "var(--neg)";
  }
  function renderBreadth() {
    const el = $("#breadth");
    el.hidden = !state.health;
    $("#healthBtn").classList.toggle("active", state.health);
    $("#healthBtn").setAttribute("aria-expanded", state.health);
    el.innerHTML = data.breadth.map((b) => {
      const c = breadthColor(b);
      return `<button class="tile" style="--c:${c}" data-breadth="${b.key}" title="${esc(b.help)}">
        <div class="l">${esc(b.label)}</div>
        <div><span class="v">${b.value > 0 && b.key === "ad" ? "+" : ""}${nf(b.value)}%</span><span class="d ${cls(b.delta)}">${b.delta >= 0 ? "↗" : "↘"} ${nf(Math.abs(b.delta))} pts</span></div>
        ${spark(b.history, c)}</button>`;
    }).join("");
  }
  function renderSectorsSelect() {
    const secs = [...new Set(data.rows.map((r) => r.sector))].sort();
    if (state.sector && !secs.includes(state.sector)) state.sector = "";
    $("#secSel").innerHTML = `<option value="">All sectors</option>` + secs.map((s) => `<option ${s === state.sector ? "selected" : ""}>${esc(s)}</option>`).join("");
    $("#capSel").value = state.cap;
  }
  function renderPresets() {
    const box = $("#presets");
    box.innerHTML = `<span class="lbl">RECOMMENDED SCANS:</span>` + PRESETS.map((p) => `<button class="chip" data-preset="${p.id}" aria-pressed="${state.presets.includes(p.id)}" title="${esc(p.help)}">${esc(p.label)}</button>`).join("")
      + `<span style="flex:1"></span><button class="chip" id="shareBtn" title="Copy a link to this exact screen">🔗 Share active filters</button>`;
  }

  // ---------- rendering: main table ----------
  function visibleCols() { return COLS.filter((c) => c.g === "core" || !state.hidden.includes(c.g)); }
  function renderStocks() {
    const rows = filtered();
    const cols = visibleCols();
    // group header
    let groupRow = "", prev = null, span = 0;
    const flush = () => { if (prev !== null) groupRow += `<th colspan="${span}" ${prev === "core" ? `class="sticky" style="--left:0"` : ""}>${prev === "core" ? `<button class="chip" id="copyBtn" style="height:22px">⧉ Copy tickers</button>` : esc(GROUPS[prev])}</th>`; };
    cols.forEach((c) => { if (c.g !== prev) { flush(); prev = c.g; span = 0; } span++; });
    flush();
    // sticky offsets
    let left = 0; const lefts = {};
    cols.forEach((c) => { if (c.sticky) { lefts[c.k] = left; left += c.w; } });
    const thCls = (c) => [c.cls || "", c.sort ? "sortable" : "", state.sort.key === c.k ? "sorted" : "", c.sticky ? "sticky" : "", c.last ? "sticky-last" : ""].join(" ");
    const stickyStyle = (c) => c.sticky ? `style="--left:${lefts[c.k]}px;min-width:${c.w}px;max-width:${c.w}px"` : "";
    const head = `<thead><tr class="groups">${groupRow}</tr><tr class="cols">${cols.map((c) => `<th class="${thCls(c)}" ${stickyStyle(c)} ${c.sort ? `data-sort="${c.k}" tabindex="0" aria-sort="${state.sort.key === c.k ? (state.sort.dir > 0 ? "ascending" : "descending") : "none"}"` : ""} ${c.help ? `title="${esc(c.help)}"` : ""}>${c.sort ? `<span class="arrow">${state.sort.key === c.k ? (state.sort.dir > 0 ? "↑" : "↓") : "⇅"}</span>` : ""}${esc(val(c.label))}${c.sub ? `<span class="sub">${esc(val(c.sub))}</span>` : ""}</th>`).join("")}</tr></thead>`;
    const body = rows.slice(0, state.limit).map((r, i) => `<tr>${cols.map((c) => `<td class="${c.cls || ""} ${c.sticky ? "sticky" : ""} ${c.last ? "sticky-last" : ""}" ${stickyStyle(c)}>${c.render(r, i)}</td>`).join("")}</tr>`).join("");
    $("#grid").innerHTML = head + `<tbody>${body || `<tr><td class="l" colspan="${cols.length}" style="height:80px;color:var(--muted)">No stocks match these filters. Try removing a scan or widening a range.</td></tr>`}</tbody>`;
    $("#metaLeft").innerHTML = `${D.fmtISO(data.session)} · <b>${rows.length}</b> stocks match${data.source === "demo" ? ` <span class="demo-flag" title="No data/*.json found — showing synthetic values. Run pipeline/build_data.py.">DEMO DATA</span>` : ""}`;
    $("#metaRight").innerHTML = `Active sort: <b>${esc(val(COLS.find((c) => c.k === state.sort.key)?.label))} ${state.sort.dir > 0 ? "asc" : "desc"}</b>`;
    $("#showing").textContent = `Showing ${Math.min(state.limit, rows.length)} of ${rows.length}`;
    $("#moreBtn").hidden = rows.length <= state.limit;
    renderActiveFilters();
    return rows;
  }

  function sectorAgg() {
    const base = data.rows.filter((r) => !state.cap || r.cap === state.cap);
    const totalTurn = base.reduce((s, r) => s + r.turnover, 0) || 1;
    const by = {};
    base.forEach((r) => { (by[r.sector] = by[r.sector] || []).push(r); });
    const out = Object.entries(by).map(([sector, rs]) => {
      const n = rs.length, avg = (f) => rs.reduce((s, r) => s + (f(r) ?? 0), 0) / n;
      const adv = rs.filter((r) => r.chg > 0).length, dec = rs.filter((r) => r.chg < 0).length;
      return { sector, n, chg: avg((r) => r.chg), rs: avg((r) => r.rs), e20: (rs.filter((r) => r.emas[20]).length / n) * 100, e200: (rs.filter((r) => r.emas[200]).length / n) * 100, adv, dec, turn: (rs.reduce((s, r) => s + r.turnover, 0) / totalTurn) * 100, cmf: avg((r) => r.cmf), bo: rs.filter((r) => r.bo).length, leaders: [...rs].sort((a, b) => (b.rs ?? 0) - (a.rs ?? 0)).slice(0, 3).map((r) => r.ticker) };
    });
    out.forEach((s) => { s.score = s.rs * 0.5 + s.e20 * 0.25 + s.e200 * 0.25; });
    out.sort((a, b) => b.score - a.score).forEach((s, i) => (s.rank = i + 1));
    return out;
  }
  const SECTOR_COLS = [
    { k: "rank", label: "Rank", cls: "c" }, { k: "sector", label: "Sector", cls: "l" }, { k: "n", label: "Stocks" },
    { k: "chg", label: "Avg 1D%" }, { k: "rs", label: "Avg RS" }, { k: "e20", label: "% > 20 EMA" }, { k: "e200", label: "% > 200 EMA" },
    { k: "adv", label: "Adv / Dec", cls: "c" }, { k: "turn", label: "Turnover share" }, { k: "cmf", label: "CMF (avg)" }, { k: "bo", label: "Breakouts" }, { k: "leaders", label: "Leaders by RS", cls: "l" },
  ];
  let sectorSort = { key: "rank", dir: 1 };
  function renderSectors() {
    const rows = sectorAgg();
    rows.sort((a, b) => { const x = a[sectorSort.key], y = b[sectorSort.key]; return (typeof x === "string" ? x.localeCompare(y) : x - y) * sectorSort.dir; });
    const bar = (v, c) => `<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:60px;height:6px;border-radius:3px;background:var(--neutral-bg);overflow:hidden"><span style="display:block;height:100%;width:${Math.max(0, Math.min(100, v))}%;background:${c}"></span></span>${nf(v)}%</span>`;
    $("#grid").innerHTML = `<thead><tr class="groups"><th colspan="${SECTOR_COLS.length}">Sector rotation — ranked by blended RS and trend participation</th></tr><tr class="cols">${SECTOR_COLS.map((c) => `<th class="sortable ${c.cls || ""} ${sectorSort.key === c.k ? "sorted" : ""}" data-ssort="${c.k}"><span class="arrow">${sectorSort.key === c.k ? (sectorSort.dir > 0 ? "↑" : "↓") : "⇅"}</span>${c.label}</th>`).join("")}</tr></thead><tbody>${rows.map((s) => `<tr>
      <td class="c num-idx">${s.rank}</td><td class="l"><button class="tk" data-sector="${esc(s.sector)}">${esc(s.sector)}</button></td><td>${s.n}</td>
      <td>${pill(+s.chg.toFixed(2))}</td><td><span class="pill ${rankCls(s.rs)}">${nf(s.rs, 0)}</span></td><td>${bar(s.e20, "var(--pos)")}</td><td>${bar(s.e200, "var(--brand)")}</td>
      <td class="c"><span class="pos">${s.adv}</span> / <span class="neg">${s.dec}</span></td><td>${nf(s.turn)}%</td><td class="${cls(s.cmf)}">${nf(s.cmf, 2)}</td><td>${s.bo}</td>
      <td class="l">${s.leaders.map((t) => `<button class="chip" data-open="${esc(t)}" style="height:22px">${esc(t)}</button>`).join(" ")}</td></tr>`).join("")}</tbody>`;
    $("#metaLeft").innerHTML = `${D.fmtISO(data.session)} · <b>${rows.length}</b> sectors${data.source === "demo" ? ` <span class="demo-flag">DEMO DATA</span>` : ""}`;
    $("#metaRight").textContent = "Click a sector to screen its stocks";
    $("#showing").textContent = ""; $("#moreBtn").hidden = true;
    $("#activeFilters").innerHTML = "";
  }

  function renderActiveFilters() {
    const labels = { priceMin: "Price ≥", priceMax: "Price ≤", chgMin: "Chg ≥", chgMax: "Chg ≤", rsiMin: "RSI ≥", rsiMax: "RSI ≤", volMin: "Vol spike ≥", from52Min: "From 52W high ≥", from20Max: "From 20 EMA ≤", stageMin: "Stage 2 ≥", rsMin: "RS ≥", turnMin: "Turnover ≥", above50: "Above 50 EMA", above200: "Above 200 EMA", crossRecent: "EMA cross ≤ 5 bars", nearEarn: "Earnings ≤ 14 days" };
    const chips = Object.entries(state.filters).filter(([, v]) => v !== "" && v !== false).map(([k, v]) => `<button class="chip" data-clear="${k}">${labels[k]}${v === true ? "" : " " + esc(v)} ✕</button>`);
    if (state.list >= 0) chips.unshift(`<button class="chip" data-clear="__list">${esc(lists[state.list].name)} ✕</button>`);
    if (state.q) chips.unshift(`<button class="chip" data-clear="__q">“${esc(state.q)}” ✕</button>`);
    if (chips.length > 1) chips.push(`<button class="chip" data-clear="__all">Clear all</button>`);
    $("#activeFilters").innerHTML = chips.join("");
  }

  // ---------- panels ----------
  function renderFiltersPanel() {
    const f = state.filters, unit = state.market === "US" ? "$M" : "₹ Cr";
    const num = (k, ph) => `<input type="number" step="any" data-f="${k}" value="${esc(f[k])}" placeholder="${ph}" />`;
    $("#panel-filters").innerHTML = `<h4>Custom filters <span class="caption">— applied live, combined with scans above</span></h4>
      <div class="grid-form">
        <label class="field">Price<div class="pair">${num("priceMin", "min")}${num("priceMax", "max")}</div></label>
        <label class="field">Change %<div class="pair">${num("chgMin", "min")}${num("chgMax", "max")}</div></label>
        <label class="field">RSI (14)<div class="pair">${num("rsiMin", "min")}${num("rsiMax", "max")}</div></label>
        <label class="field">Volume spike ≥ (x)${num("volMin", "e.g. 2")}</label>
        <label class="field">Within % of 52W high${num("from52Min", "e.g. -10")}</label>
        <label class="field">Max % above 20 EMA${num("from20Max", "e.g. 8")}</label>
        <label class="field">Stage 2 score ≥${num("stageMin", "0–7")}</label>
        <label class="field">RS rank ≥${num("rsMin", "1–99")}</label>
        <label class="field">Turnover ≥ (${unit})${num("turnMin", "e.g. 10")}</label>
      </div>
      <div class="grid-form" style="margin-top:12px">
        ${[["above50", "Above 50 EMA"], ["above200", "Above 200 EMA"], ["crossRecent", "10×20 EMA cross in last 5 bars"], ["nearEarn", "Earnings in next 14 days"]].map(([k, l]) => `<label class="check"><input type="checkbox" data-f="${k}" ${f[k] ? "checked" : ""}/> ${l}</label>`).join("")}
      </div>
      <div class="panel-actions"><button class="btn" data-act="reset-filters">Reset filters</button><button class="btn primary" data-act="save-template">Save as template…</button></div>`;
  }
  function renderColumnsPanel() {
    $("#panel-columns").innerHTML = `<h4>Column groups</h4><div class="col-groups">${Object.entries(GROUPS).filter(([g]) => g !== "core").map(([g, l]) => `<label class="check"><input type="checkbox" data-group="${g}" ${state.hidden.includes(g) ? "" : "checked"}/> ${l}</label>`).join("")}</div>`;
  }
  function renderSavedPanel() {
    $("#panel-saved").innerHTML = `<h4>Saved filter templates</h4>${templates.length ? `<div class="list-rows">${templates.map((t, i) => `<div class="row"><button class="btn" data-load-tpl="${i}">${esc(t.name)}</button><span class="caption">${t.presets.length} scans · ${Object.values(t.filters).filter((v) => v !== "" && v !== false).length} filters${t.cap ? " · " + t.cap : ""}${t.sector ? " · " + esc(t.sector) : ""}</span><button class="btn ghost" data-del-tpl="${i}" aria-label="Delete ${esc(t.name)}">✕</button></div>`).join("")}</div>` : `<p class="empty">No templates yet. Set up scans and filters, then use “Save as template” in the Filters panel or below.</p>`}
      <div class="panel-actions"><button class="btn primary" data-act="save-template">Save current screen…</button></div>`;
  }
  function renderListsPanel() {
    $("#panel-lists").innerHTML = `<h4>Watchlists <span class="caption">— tap the coloured dots in the Watch column to add stocks</span></h4><div class="list-rows">${lists.map((l, i) => `<div class="row"><span class="wl"><button style="--wc:${WL_COLORS[i]}" aria-pressed="true" tabindex="-1"></button></span><input data-rename="${i}" value="${esc(l.name)}" aria-label="Rename watchlist ${i + 1}"/><button class="btn ${state.list === i ? "active" : ""}" data-show-list="${i}">Show (${l.items.length})</button><button class="btn ghost" data-copy-list="${i}">Copy</button><button class="btn ghost" data-clear-list="${i}">Clear</button></div>`).join("")}</div>`;
  }
  function togglePanel(name) {
    $$(".panel").forEach((p) => { if (p.id !== "panel-" + name) p.hidden = true; });
    const p = $("#panel-" + name); p.hidden = !p.hidden;
    $$("[data-panel]").forEach((b) => b.classList.toggle("active", b.dataset.panel === name && !p.hidden));
    if (!p.hidden) ({ filters: renderFiltersPanel, columns: renderColumnsPanel, saved: renderSavedPanel, lists: renderListsPanel })[name]();
  }

  // ---------- render all ----------
  function render() {
    $$("[data-market]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.market === state.market));
    $$("[data-tf]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tf === state.tf));
    $$("[data-view]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.view === state.view));
    $("#secSel").value = state.sector; $("#capSel").value = state.cap;
    renderPresets();
    if (state.view === "sectors") renderSectors(); else renderStocks();
    writeHash();
  }

  async function reload() {
    $("#metaLeft").textContent = "Loading…";
    data = await D.load(state.market, state.tf);
    renderIndices(); renderBreadth(); renderSectorsSelect(); render();
  }

  // ---------- URL hash (share) ----------
  function writeHash() {
    const s = { m: state.market, t: state.tf, v: state.view, c: state.cap, s: state.sector, p: state.presets, f: Object.fromEntries(Object.entries(state.filters).filter(([, v]) => v !== "" && v !== false)), o: state.sort };
    const h = "#" + encodeURIComponent(JSON.stringify(s));
    history.replaceState(null, "", h.length > 3 ? h : location.pathname);
  }
  function readHash() {
    if (!location.hash) return;
    try {
      const s = JSON.parse(decodeURIComponent(location.hash.slice(1)));
      if (s.m) state.market = s.m === "US" ? "US" : "IN";
      if (s.t) state.tf = s.t === "weekly" ? "weekly" : "daily";
      if (s.v) state.view = s.v === "sectors" ? "sectors" : "stocks";
      state.cap = s.c || ""; state.sector = s.s || "";
      state.presets = Array.isArray(s.p) ? s.p : [];
      state.filters = { ...DEFAULT_FILTERS, ...(s.f || {}) };
      if (s.o && COLS.some((c) => c.k === s.o.key)) state.sort = s.o;
    } catch (e) { /* ignore malformed links */ }
  }

  // ---------- modal helpers ----------
  function openModal(html, small) {
    const box = $("#modalBox"); box.className = "modal" + (small ? " sm" : ""); box.innerHTML = html;
    $("#modal").hidden = false;
    setTimeout(() => (box.querySelector("[autofocus]") || box.querySelector("button, input, textarea"))?.focus(), 0);
  }
  function closeModal() { $("#modal").hidden = true; endTour(); }
  const modalHead = (title, sub) => `<div class="modal-head"><div><h3 id="modalTitle">${title}</h3>${sub ? `<p>${sub}</p>` : ""}</div><button class="btn icon ghost" data-close aria-label="Close">✕</button></div>`;
  function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 1800); }
  async function copy(text, msg) { try { await navigator.clipboard.writeText(text); toast(msg); } catch (e) { prompt("Copy:", text); } }

  // ---------- charts ----------
  function lineChart(series, opts = {}) {
    const W = 760, H = 300, P = { l: 8, r: 54, t: 10, b: 22 };
    const all = series.flatMap((s) => s.data.filter((v) => v != null));
    let min = Math.min(...all), max = Math.max(...all);
    if (opts.min != null) min = Math.min(min, opts.min); if (opts.max != null) max = Math.max(max, opts.max);
    const pad = (max - min) * 0.06 || 1; min -= pad; max += pad;
    const n = series[0].data.length;
    const x = (i) => P.l + (i / (n - 1)) * (W - P.l - P.r), y = (v) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b);
    const ticks = 5, grid = Array.from({ length: ticks }, (_, i) => min + ((max - min) * i) / (ticks - 1));
    const lines = series.map((s) => `<polyline fill="none" stroke="${s.color}" stroke-width="${s.w || 1.5}" ${s.dash ? 'stroke-dasharray="4 3"' : ""} points="${s.data.map((v, i) => v == null ? "" : `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")}"/>`).join("");
    const area = opts.area ? `<path d="M${x(0)},${y(series[0].data[0])} ${series[0].data.map((v, i) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")} L${x(n - 1)},${H - P.b} L${x(0)},${H - P.b}Z" fill="${series[0].color}" opacity=".08"/>` : "";
    const ref = (opts.refs || []).map((v) => `<line x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}" stroke="var(--border-strong)" stroke-dasharray="3 3"/>`).join("");
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(opts.label || "chart")}">
      ${grid.map((g) => `<line x1="${P.l}" x2="${W - P.r}" y1="${y(g)}" y2="${y(g)}" stroke="var(--border)"/><text x="${W - P.r + 6}" y="${y(g) + 3}">${nf(g, g > 100 ? 0 : 1)}</text>`).join("")}
      ${ref}${area}${lines}
      <text x="${P.l}" y="${H - 6}">${esc(opts.startLabel || "")}</text><text x="${W - P.r}" y="${H - 6}" text-anchor="end">${esc(opts.endLabel || "")}</text></svg>`;
  }
  function openStock(t) {
    const r = data.rows.find((x) => x.ticker === t); if (!r) return;
    const tvSym = state.market === "US" ? r.ticker : "NSE:" + r.ticker.replace("&", "_").replace("-", "_");
    openModal(modalHead(`${esc(r.ticker)} <span class="cap ${r.cap}" style="vertical-align:2px">${r.cap === "MI" ? "Mic" : r.cap}</span>`, `${esc(r.name)} · ${esc(r.sector)}`) + `<div class="modal-body">
      <div style="display:flex;align-items:baseline;gap:12px"><span style="font-size:28px;font-weight:800">${cur()}${nf(r.price, 2)}</span>${pill(r.chg)}</div>
      ${lineChart([{ data: r.series, color: "var(--text)", w: 1.8 }, { data: r.e20s, color: "#2f9e6b" }, { data: r.e50s, color: "#2463b8" }, { data: r.e200s, color: "#e0912f", dash: true }], { area: true, label: r.ticker + " price", startLabel: `${r.series.length} ${state.tf === "weekly" ? "weeks" : "sessions"} ago`, endLabel: D.fmtShort(data.session) })}
      <div class="legend"><span><i style="background:var(--text)"></i>Close</span><span><i style="background:#2f9e6b"></i>20 EMA</span><span><i style="background:#2463b8"></i>50 EMA</span><span><i style="background:#e0912f"></i>200 EMA</span></div>
      <div class="stats">
        <div><span>RSI (14)</span><b>${r.rsi}</b></div><div><span>RS rank</span><b>${r.rs ?? "--"}</b></div><div><span>Stage 2</span><b>${r.stage2}/7</b></div><div><span>From 52W high</span><b>${sgn(r.from52)}</b></div>
        <div><span>Vol spike</span><b>${nf(r.volSpike)}x</b></div><div><span>Daily pivot</span><b>${r.dPivot}</b></div><div><span>Breakout</span><b>${r.bo ? sgn(r.bo.gain) + " since" : "None"}</b></div><div><span>Next earnings</span><b>${fmtDate(r.nextEarn)}</b></div>
      </div>
      <h4 style="margin:16px 0 6px">Notes</h4><textarea class="note" id="noteText" placeholder="Your thesis, levels to watch, reasons to exit…">${esc(notes[r.ticker] || "")}</textarea>
    </div><div class="modal-foot"><a class="btn" href="https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSym)}" target="_blank" rel="noopener">Open in TradingView ↗</a><button class="btn primary" data-save-note="${esc(r.ticker)}">Save note</button></div>`);
  }
  function openBreadth(key) {
    const b = data.breadth.find((x) => x.key === key);
    const refs = key === "ad" ? [0] : [50];
    openModal(modalHead(esc(b.label), esc(b.help)) + `<div class="modal-body">
      <div style="display:flex;gap:12px;align-items:baseline"><span style="font-size:28px;font-weight:800">${nf(b.value)}%</span><span class="${cls(b.delta)}">${b.delta >= 0 ? "+" : ""}${nf(b.delta)} pts vs 5 bars ago</span></div>
      ${lineChart([{ data: b.history, color: breadthColor(b), w: 2 }], { area: true, refs, label: b.label + " history", startLabel: `${b.history.length} ${state.tf === "weekly" ? "weeks" : "sessions"} ago`, endLabel: "latest" })}
      <p class="caption">Readings above 60% generally indicate broad participation; below 40% suggests a narrow or weak market.</p></div>`);
  }
  function openEye() {
    const rows = state.view === "stocks" ? filtered() : data.rows;
    const pts = rows.filter((r) => r.rsHist && r.rsHist[3] != null && r.rsHist[2] != null);
    const W = 760, H = 460, P = 36;
    const x = (v) => P + (v / 100) * (W - 2 * P);
    const dmax = Math.max(10, ...pts.map((r) => Math.abs(r.rsHist[3] - r.rsHist[2])));
    const y = (v) => H / 2 - (v / dmax) * (H / 2 - P);
    const color = (r) => r.chg > 0 ? "var(--pos)" : r.chg < 0 ? "var(--neg)" : "var(--faint)";
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Relative strength map">
      <rect x="${x(50)}" y="${P}" width="${x(100) - x(50)}" height="${H / 2 - P}" fill="var(--pos-bg)" opacity=".6"/>
      <rect x="${P}" y="${H / 2}" width="${x(50) - P}" height="${H / 2 - P}" fill="var(--neg-bg)" opacity=".6"/>
      <line x1="${x(50)}" x2="${x(50)}" y1="${P}" y2="${H - P}" stroke="var(--border-strong)"/><line x1="${P}" x2="${W - P}" y1="${H / 2}" y2="${H / 2}" stroke="var(--border-strong)"/>
      <text class="q" x="${W - P - 6}" y="${P + 16}" text-anchor="end">LEADING</text><text class="q" x="${W - P - 6}" y="${H - P - 8}" text-anchor="end">WEAKENING</text>
      <text class="q" x="${P + 6}" y="${H - P - 8}">LAGGING</text><text class="q" x="${P + 6}" y="${P + 16}">IMPROVING</text>
      <text class="q" x="${W / 2}" y="${H - 8}" text-anchor="middle" style="font-weight:600">RS rank →</text>
      <text class="q" x="12" y="${H / 2}" transform="rotate(-90 12 ${H / 2})" text-anchor="middle" style="font-weight:600">RS change (5 bars) →</text>
      ${pts.map((r) => `<circle cx="${x(r.rsHist[3]).toFixed(1)}" cy="${y(r.rsHist[3] - r.rsHist[2]).toFixed(1)}" r="${4 + Math.min(6, Math.abs(r.chg))}" fill="${color(r)}" fill-opacity=".55" stroke="${color(r)}" data-open="${esc(r.ticker)}" data-tip="${esc(`${r.ticker} · RS ${r.rs} (${r.rsHist[3] - r.rsHist[2] >= 0 ? "+" : ""}${r.rsHist[3] - r.rsHist[2]}) · ${sgn(r.chg)}`)}"/>`).join("")}
    </svg>`;
    openModal(modalHead("Kestrel Eye", `Relative-strength map of the ${pts.length} stocks in your current screen. Top-right = strong and getting stronger. Click a bubble to open it.`) + `<div class="modal-body eye">${svg}</div>`);
  }
  function openNote(t) {
    openModal(modalHead("Note · " + esc(t)) + `<div class="modal-body"><textarea class="note" id="noteText" autofocus placeholder="Your thesis, levels to watch, reasons to exit…">${esc(notes[t] || "")}</textarea></div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn primary" data-save-note="${esc(t)}">Save note</button></div>`, true);
  }
  function saveTemplate() {
    openModal(modalHead("Save filter template", "Stores the current scans, filters, cap, sector and sort in this browser.") + `<div class="modal-body"><label class="field">Template name<input type="text" id="tplName" autofocus placeholder="e.g. Pullbacks in leaders" /></label></div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn primary" data-act="confirm-template">Save</button></div>`, true);
  }
  function openDataModal() {
    openModal(modalHead("My data", "Watchlists, notes and filter templates are stored in this browser only. Back them up or move them to another device here.") + `<div class="modal-body">
      <p class="caption">${lists.reduce((s, l) => s + l.items.length, 0)} watchlist entries · ${Object.keys(notes).length} notes · ${templates.length} templates</p>
      <div class="panel-actions"><button class="btn primary" data-act="export">Download backup (.json)</button><label class="btn">Restore from file<input type="file" accept="application/json" id="importFile" hidden/></label></div></div>`, true);
  }

  // ---------- tour ----------
  const TOUR = [
    ["#breadth", "Read market participation", "Breadth tiles show how much of the market supports new setups. Click any tile to see its history."],
    ["#toolbar", "Narrow the universe", "Switch market cap, sector, daily/weekly timeframe, or flip to the Sectors view to see rotation."],
    ["#presets", "Start from a scan", "Recommended scans stack together. Combine them with custom ranges in the Filters panel."],
    ["#tableWrap", "Sort and research", "Click any column header to sort. Click a ticker for its chart and notes; the coloured dots add it to a watchlist."],
    ["#eyeBtn", "Spot leaders fast", "Kestrel Eye plots your current screen on an RS map — leaders gaining strength sit top-right."],
  ];
  let tourStep = -1;
  function showTour(i) {
    endTour(true); tourStep = i;
    const [sel, title, body] = TOUR[i]; const el = $(sel);
    if (sel === "#breadth" && !state.health) { state.health = true; renderBreadth(); }
    el.classList.add("highlight"); el.scrollIntoView({ block: "center", behavior: "smooth" });
    openModal(`<div class="modal-head"><h3 id="modalTitle" style="font-size:12px;letter-spacing:.06em;color:var(--muted)">SCREENER TOUR</h3><span class="caption">${i + 1} / ${TOUR.length}</span></div>
      <div class="modal-body"><div class="tour-dots">${TOUR.map((_, j) => `<i class="${j <= i ? "on" : ""}"></i>`).join("")}</div><h3 style="margin:0 0 6px">${title}</h3><p style="color:var(--muted);margin:0">${body}</p></div>
      <div class="modal-foot" style="justify-content:space-between"><button class="btn ghost" data-close>Skip</button><span style="display:flex;gap:8px"><button class="btn" data-tour="${i - 1}" ${i === 0 ? "disabled" : ""}>Back</button><button class="btn primary" data-tour="${i + 1}" autofocus>${i === TOUR.length - 1 ? "Done" : "Next"}</button></span></div>`, true);
    $("#modal").style.background = "transparent";
    $("#modal").style.alignItems = "end";
  }
  function endTour(keep) {
    $$(".highlight").forEach((e) => e.classList.remove("highlight"));
    $("#modal").style.background = ""; $("#modal").style.alignItems = "";
    if (!keep && tourStep >= 0) { tourStep = -1; store.set("toured", true); }
  }

  // ---------- search suggest ----------
  let hl = -1;
  function renderSuggest() {
    const q = state.q.trim().toLowerCase(), box = $("#suggest");
    if (!q) { box.hidden = true; return; }
    const m = data.rows.filter((r) => r.ticker.toLowerCase().startsWith(q) || r.name.toLowerCase().includes(q)).slice(0, 8);
    box.innerHTML = m.map((r, i) => `<button data-open="${esc(r.ticker)}" class="${i === hl ? "hl" : ""}"><span class="t">${esc(r.ticker)}</span><span class="n">${esc(r.name)}</span><span class="${cls(r.chg)}">${sgn(r.chg)}</span></button>`).join("");
    box.hidden = !m.length;
  }

  // ---------- events ----------
  function bind() {
    document.addEventListener("click", async (e) => {
      const t = e.target.closest("button, [data-open], [data-sort], [data-ssort], a, label"); if (!t) { $("#suggest").hidden = true; return; }
      const d = t.dataset;
      if (!t.closest(".search")) $("#suggest").hidden = true;
      if (d.market && d.market !== state.market) { state.market = d.market; state.sector = ""; state.limit = 100; state.list = -1; return reload(); }
      if (d.tf && d.tf !== state.tf) { state.tf = d.tf; return reload(); }
      if (d.view) { state.view = d.view; return render(); }
      if (d.preset) { const i = state.presets.indexOf(d.preset); i >= 0 ? state.presets.splice(i, 1) : state.presets.push(d.preset); state.limit = 100; return render(); }
      if (d.panel) return togglePanel(d.panel);
      if (d.sort) { state.sort = state.sort.key === d.sort ? { key: d.sort, dir: -state.sort.dir } : { key: d.sort, dir: ["ticker", "sector", "crossAgo", "nextEarn"].includes(d.sort) ? 1 : -1 }; return render(); }
      if (d.ssort) { sectorSort = sectorSort.key === d.ssort ? { key: d.ssort, dir: -sectorSort.dir } : { key: d.ssort, dir: ["rank", "sector"].includes(d.ssort) ? 1 : -1 }; return renderSectors(); }
      if (d.sector) { state.sector = d.sector; state.view = "stocks"; return render(); }
      if (d.open) { if ($("#modal").hidden === false && !t.closest(".eye")) closeModal(); $("#suggest").hidden = true; return openStock(d.open); }
      if (d.wl != null) { const L = lists[+d.wl].items, i = L.indexOf(d.t); i >= 0 ? L.splice(i, 1) : L.push(d.t); store.set("lists", lists); t.setAttribute("aria-pressed", i < 0); if (state.list >= 0) render(); return; }
      if (d.note) return openNote(d.note);
      if (d.saveNote) { const v = $("#noteText").value.trim(); if (v) notes[d.saveNote] = v; else delete notes[d.saveNote]; store.set("notes", notes); closeModal(); toast("Note saved"); return render(); }
      if (d.breadth) return openBreadth(d.breadth);
      if (d.close != null) return closeModal();
      if (d.tour != null) { const i = +d.tour; if (i >= TOUR.length) return closeModal(); return showTour(Math.max(0, i)); }
      if (d.clear) { if (d.clear === "__all") { state.filters = { ...DEFAULT_FILTERS }; state.list = -1; state.q = ""; $("#search").value = ""; state.presets = []; } else if (d.clear === "__list") state.list = -1; else if (d.clear === "__q") { state.q = ""; $("#search").value = ""; } else state.filters[d.clear] = DEFAULT_FILTERS[d.clear]; if (!$("#panel-filters").hidden) renderFiltersPanel(); return render(); }
      if (d.showList != null) { const i = +d.showList; state.list = state.list === i ? -1 : i; state.view = "stocks"; renderListsPanel(); return render(); }
      if (d.copyList != null) return copy(lists[+d.copyList].items.join(","), "Watchlist copied");
      if (d.clearList != null) { if (confirm(`Remove all stocks from ${lists[+d.clearList].name}?`)) { lists[+d.clearList].items = []; store.set("lists", lists); renderListsPanel(); render(); } return; }
      if (d.loadTpl != null) { const tp = templates[+d.loadTpl]; Object.assign(state, { presets: [...tp.presets], filters: { ...DEFAULT_FILTERS, ...tp.filters }, cap: tp.cap || "", sector: tp.sector || "", sort: tp.sort || state.sort, view: "stocks" }); toast(`Loaded “${tp.name}”`); return render(); }
      if (d.delTpl != null) { templates.splice(+d.delTpl, 1); store.set("templates", templates); return renderSavedPanel(); }
      switch (d.act) {
        case "reset-filters": state.filters = { ...DEFAULT_FILTERS }; renderFiltersPanel(); return render();
        case "save-template": return saveTemplate();
        case "confirm-template": { const name = $("#tplName").value.trim() || `Template ${templates.length + 1}`; templates.push({ name, presets: [...state.presets], filters: { ...state.filters }, cap: state.cap, sector: state.sector, sort: { ...state.sort } }); store.set("templates", templates); closeModal(); toast("Template saved"); if (!$("#panel-saved").hidden) renderSavedPanel(); return; }
        case "export": { const blob = new Blob([JSON.stringify({ lists, notes, templates }, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "kestrel-backup.json"; a.click(); return; }
      }
      if (t.id === "copyBtn") { const rows = filtered(); return copy(rows.map((r) => state.market === "US" ? r.ticker : "NSE:" + r.ticker).join(","), `${rows.length} tickers copied (TradingView format)`); }
      if (t.id === "shareBtn") { writeHash(); return copy(location.href, "Link to this screen copied"); }
      if (t.id === "moreBtn") { state.limit += 100; return renderStocks(); }
      if (t.id === "healthBtn") { state.health = !state.health; store.set("health", state.health); return renderBreadth(); }
      if (t.id === "eyeBtn") return openEye();
      if (t.id === "themeBtn") { const n = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = n; try { localStorage.setItem("kestrel-theme", n); } catch (er) { /* ignore */ } return; }
      if (t.id === "tourBtn") return showTour(0);
      if (t.id === "dataBtn") return openDataModal();
    });
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
    document.addEventListener("change", (e) => {
      const t = e.target;
      if (t.id === "capSel") { state.cap = t.value; return render(); }
      if (t.id === "secSel") { state.sector = t.value; return render(); }
      if (t.dataset.group) { const g = t.dataset.group; state.hidden = t.checked ? state.hidden.filter((x) => x !== g) : [...state.hidden, g]; store.set("hiddenGroups", state.hidden); return render(); }
      if (t.dataset.f && t.type === "checkbox") { state.filters[t.dataset.f] = t.checked; return render(); }
      if (t.dataset.rename != null) { lists[+t.dataset.rename].name = t.value.trim() || `Watchlist ${+t.dataset.rename + 1}`; store.set("lists", lists); return render(); }
      if (t.id === "importFile" && t.files[0]) {
        t.files[0].text().then((txt) => {
          try { const j = JSON.parse(txt); if (Array.isArray(j.lists)) lists = j.lists.slice(0, 3); if (j.notes && typeof j.notes === "object") notes = j.notes; if (Array.isArray(j.templates)) templates = j.templates; store.set("lists", lists); store.set("notes", notes); store.set("templates", templates); closeModal(); toast("Backup restored"); render(); }
          catch (er) { toast("That file is not a Kestrel backup"); }
        });
      }
    });
    let deb;
    document.addEventListener("input", (e) => {
      const t = e.target;
      if (t.id === "search") { state.q = t.value; hl = -1; renderSuggest(); clearTimeout(deb); deb = setTimeout(() => { state.limit = 100; if (state.view === "stocks") render(); }, 150); }
      if (t.dataset.f && t.type === "number") { state.filters[t.dataset.f] = t.value; clearTimeout(deb); deb = setTimeout(render, 250); }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $("#search").focus(); }
      if (e.key === "Escape") { if (!$("#modal").hidden) closeModal(); $("#suggest").hidden = true; }
      if (document.activeElement.id === "search") {
        const items = $$("#suggest button");
        if (e.key === "ArrowDown") { e.preventDefault(); hl = Math.min(items.length - 1, hl + 1); renderSuggest(); }
        if (e.key === "ArrowUp") { e.preventDefault(); hl = Math.max(-1, hl - 1); renderSuggest(); }
        if (e.key === "Enter" && items[hl]) { e.preventDefault(); openStock(items[hl].dataset.open); $("#suggest").hidden = true; }
      }
      if (e.key === "Enter" && e.target.dataset && e.target.dataset.sort) e.target.click();
      if (e.key === "Enter" && e.target.id === "tplName") $('[data-act="confirm-template"]').click();
    });
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-tip]"), tip = $("#tip");
      if (!t) { tip.hidden = true; return; }
      tip.textContent = t.dataset.tip; tip.hidden = false;
      const r = t.getBoundingClientRect(); tip.style.left = r.left + r.width / 2 + 10 + "px"; tip.style.top = r.top - 34 + "px";
    });
  }

  // ---------- boot ----------
  const hadHash = !!location.hash;
  readHash();
  const qs = new URLSearchParams(location.search);
  if (qs.get("view") === "sectors") state.view = "sectors";
  if (qs.get("market") === "US") state.market = "US";
  if (qs.get("open") === "health") state.health = true;
  bind();
  reload().then(() => {
    const open = qs.get("open"), stock = qs.get("stock");
    if (qs.toString()) history.replaceState(null, "", location.pathname + location.hash);
    if (stock) return openStock(stock.toUpperCase());
    if (open === "eye") return openEye();
    if (open === "lists") return togglePanel("lists");
    if (open === "health") return $("#breadth").scrollIntoView({ block: "center" });
    if (!store.get("toured", false) && !hadHash) setTimeout(() => showTour(0), 600);
  });
})();
