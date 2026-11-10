/* Kestrel — demo data layer.
 * All numbers below are SYNTHETIC and generated deterministically from a seed so the
 * UI has something realistic to show. Replace `Kestrel.data.load()` with a call to your
 * own end-of-day data API to make the screener live. */
(function () {
  "use strict";

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function gauss(r) { // Box–Muller
    let u = 0, v = 0;
    while (u === 0) u = r(); while (v === 0) v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const round = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;

  // ---- Universes -------------------------------------------------------------------
  // [ticker, company, sector, cap]   cap: LC large, MC mid, SC small, MI micro
  const IN = `RELIANCE|Reliance Industries|Oil & Gas|LC
TCS|Tata Consultancy Services|IT Services|LC
HDFCBANK|HDFC Bank|Private Banks|LC
ICICIBANK|ICICI Bank|Private Banks|LC
INFY|Infosys|IT Services|LC
BHARTIARTL|Bharti Airtel|Telecom|LC
SBIN|State Bank of India|PSU Banks|LC
ITC|ITC|FMCG|LC
LT|Larsen & Toubro|Construction & Engineering|LC
HINDUNILVR|Hindustan Unilever|FMCG|LC
KOTAKBANK|Kotak Mahindra Bank|Private Banks|LC
AXISBANK|Axis Bank|Private Banks|LC
BAJFINANCE|Bajaj Finance|NBFC|LC
BAJAJFINSV|Bajaj Finserv|NBFC|LC
MARUTI|Maruti Suzuki|Automobiles|LC
M&M|Mahindra & Mahindra|Automobiles|LC
SUNPHARMA|Sun Pharmaceutical|Pharmaceuticals|LC
HCLTECH|HCL Technologies|IT Services|LC
TITAN|Titan Company|Consumer Durables|LC
ULTRACEMCO|UltraTech Cement|Cement|LC
NTPC|NTPC|Power|LC
POWERGRID|Power Grid Corp|Power|LC
ONGC|Oil & Natural Gas Corp|Oil & Gas|LC
TATASTEEL|Tata Steel|Metals & Mining|LC
JSWSTEEL|JSW Steel|Metals & Mining|LC
ASIANPAINT|Asian Paints|Chemicals|LC
WIPRO|Wipro|IT Services|LC
NESTLEIND|Nestle India|FMCG|LC
GRASIM|Grasim Industries|Cement|LC
ADANIPORTS|Adani Ports & SEZ|Logistics|LC
COALINDIA|Coal India|Metals & Mining|LC
HINDALCO|Hindalco Industries|Metals & Mining|LC
DRREDDY|Dr. Reddy's Laboratories|Pharmaceuticals|LC
CIPLA|Cipla|Pharmaceuticals|LC
TECHM|Tech Mahindra|IT Services|LC
EICHERMOT|Eicher Motors|Automobiles|LC
HEROMOTOCO|Hero MotoCorp|Automobiles|LC
BRITANNIA|Britannia Industries|FMCG|LC
APOLLOHOSP|Apollo Hospitals|Healthcare Services|LC
TRENT|Trent|Retail|LC
BEL|Bharat Electronics|Aerospace & Defense|LC
HAL|Hindustan Aeronautics|Aerospace & Defense|LC
DLF|DLF|Realty|LC
SIEMENS|Siemens India|Electrical Equipment|LC
PIDILITIND|Pidilite Industries|Chemicals|LC
DMART|Avenue Supermarts|Retail|LC
VEDL|Vedanta|Metals & Mining|LC
PFC|Power Finance Corp|NBFC|LC
RECLTD|REC|NBFC|LC
BANKBARODA|Bank of Baroda|PSU Banks|LC
PNB|Punjab National Bank|PSU Banks|LC
TVSMOTOR|TVS Motor|Automobiles|LC
ZYDUSLIFE|Zydus Lifesciences|Pharmaceuticals|LC
GODREJCP|Godrej Consumer|FMCG|LC
TATAPOWER|Tata Power|Power|LC
PERSISTENT|Persistent Systems|IT Services|MC
COFORGE|Coforge|IT Services|MC
MPHASIS|Mphasis|IT Services|MC
LTM|LTIMindtree|IT Services|LC
POLYCAB|Polycab India|Electrical Equipment|MC
CUMMINSIND|Cummins India|Industrial Machinery|MC
VOLTAS|Voltas|Consumer Durables|MC
DIXON|Dixon Technologies|Consumer Durables|MC
LUPIN|Lupin|Pharmaceuticals|MC
AUROPHARMA|Aurobindo Pharma|Pharmaceuticals|MC
ALKEM|Alkem Laboratories|Pharmaceuticals|MC
MAXHEALTH|Max Healthcare|Healthcare Services|MC
FORTIS|Fortis Healthcare|Healthcare Services|MC
INDHOTEL|Indian Hotels|Hotels & Leisure|MC
FEDERALBNK|Federal Bank|Private Banks|MC
IDFCFIRSTB|IDFC First Bank|Private Banks|MC
AUBANK|AU Small Finance Bank|Private Banks|MC
INDUSTOWER|Indus Towers|Telecom|MC
ASHOKLEY|Ashok Leyland|Automobiles|MC
BHARATFORG|Bharat Forge|Auto Components|MC
MRF|MRF|Auto Components|MC
APOLLOTYRE|Apollo Tyres|Auto Components|MC
SUPREMEIND|Supreme Industries|Chemicals|MC
SRF|SRF|Chemicals|MC
DEEPAKNTR|Deepak Nitrite|Chemicals|MC
PIIND|PI Industries|Agrochemicals|MC
UPL|UPL|Agrochemicals|MC
COROMANDEL|Coromandel International|Agrochemicals|MC
GODREJPROP|Godrej Properties|Realty|MC
OBEROIRLTY|Oberoi Realty|Realty|MC
PRESTIGE|Prestige Estates|Realty|MC
PHOENIXLTD|Phoenix Mills|Realty|MC
JUBLFOOD|Jubilant FoodWorks|Hotels & Leisure|MC
TATACOMM|Tata Communications|Telecom|MC
CONCOR|Container Corp|Logistics|MC
ABB|ABB India|Electrical Equipment|MC
BHEL|Bharat Heavy Electricals|Electrical Equipment|MC
SAIL|Steel Authority of India|Metals & Mining|MC
NMDC|NMDC|Metals & Mining|MC
LICHSGFIN|LIC Housing Finance|NBFC|MC
MUTHOOTFIN|Muthoot Finance|NBFC|MC
CHOLAFIN|Cholamandalam Finance|NBFC|MC
IREDA|Indian Renewable Energy Dev.|NBFC|MC
SUZLON|Suzlon Energy|Renewable Energy|MC
INOXWIND|Inox Wind|Renewable Energy|SC
KPIGREEN|KPI Green Energy|Renewable Energy|SC
WAAREEENER|Waaree Energies|Renewable Energy|MC
PREMIERENE|Premier Energies|Renewable Energy|MC
BDL|Bharat Dynamics|Aerospace & Defense|MC
MAZDOCK|Mazagon Dock|Aerospace & Defense|MC
COCHINSHIP|Cochin Shipyard|Aerospace & Defense|SC
DATAPATTNS|Data Patterns|Aerospace & Defense|SC
ASTRAMICRO|Astra Microwave|Aerospace & Defense|SC
KAYNES|Kaynes Technology|Electrical Equipment|SC
AMBER|Amber Enterprises|Consumer Durables|SC
BLUESTARCO|Blue Star|Consumer Durables|SC
CROMPTON|Crompton Greaves Consumer|Consumer Durables|SC
KEI|KEI Industries|Electrical Equipment|MC
CGPOWER|CG Power|Electrical Equipment|MC
SALZERELEC|Salzer Electronics|Electrical Equipment|MI
ELECON|Elecon Engineering|Industrial Machinery|SC
TIMKEN|Timken India|Industrial Machinery|SC
GRINDWELL|Grindwell Norton|Industrial Machinery|SC
KPITTECH|KPIT Technologies|IT Services|MC
TATAELXSI|Tata Elxsi|IT Services|SC
CYIENT|Cyient|IT Services|SC
SONATSOFTW|Sonata Software|IT Services|SC
NEWGEN|Newgen Software|IT Services|SC
ZENSARTECH|Zensar Technologies|IT Services|SC
GLENMARK|Glenmark Pharma|Pharmaceuticals|SC
IPCALAB|IPCA Laboratories|Pharmaceuticals|SC
GRANULES|Granules India|Pharmaceuticals|SC
AARTIDRUGS|Aarti Drugs|Pharmaceuticals|MI
IOLCP|IOL Chemicals & Pharma|Pharmaceuticals|SC
GUFICBIO|Gufic Biosciences|Pharmaceuticals|MI
NATCOPHARM|Natco Pharma|Pharmaceuticals|SC
LAURUSLABS|Laurus Labs|Pharmaceuticals|SC
METROPOLIS|Metropolis Healthcare|Healthcare Services|SC
RAINBOW|Rainbow Children's Medicare|Healthcare Services|SC
REPCOHOME|Repco Home Finance|NBFC|MI
CREDITACC|CreditAccess Grameen|NBFC|SC
MANAPPURAM|Manappuram Finance|NBFC|SC
ANGELONE|Angel One|Capital Markets|SC
CDSL|CDSL|Capital Markets|SC
BSE|BSE|Capital Markets|MC
MCX|Multi Commodity Exchange|Capital Markets|SC
CAMS|Computer Age Mgmt Services|Capital Markets|SC
KARURVYSYA|Karur Vysya Bank|Private Banks|SC
CUB|City Union Bank|Private Banks|SC
RBLBANK|RBL Bank|Private Banks|SC
UCOBANK|UCO Bank|PSU Banks|SC
CENTRALBK|Central Bank of India|PSU Banks|SC
CHEMPLASTS|Chemplast Sanmar|Commodity Chemicals|MI
AARTIIND|Aarti Industries|Commodity Chemicals|SC
TATACHEM|Tata Chemicals|Commodity Chemicals|SC
GNFC|Gujarat Narmada Valley Fert.|Commodity Chemicals|SC
NAVINFLUOR|Navin Fluorine|Chemicals|SC
CLEAN|Clean Science & Tech|Chemicals|SC
SPMLINFRA|SPML Infra|Construction & Engineering|MI
NCC|NCC|Construction & Engineering|SC
KEC|KEC International|Construction & Engineering|SC
KPIL|Kalpataru Projects|Construction & Engineering|SC
IRCON|IRCON International|Construction & Engineering|SC
RVNL|Rail Vikas Nigam|Construction & Engineering|MC
IRFC|Indian Railway Finance|NBFC|LC
TITAGARH|Titagarh Rail Systems|Industrial Machinery|SC
JWL|Jupiter Wagons|Industrial Machinery|SC
IRMENERGY|IRM Energy|Gas Distribution|MI
IGL|Indraprastha Gas|Gas Distribution|MC
MGL|Mahanagar Gas|Gas Distribution|SC
GAIL|GAIL India|Gas Distribution|LC
PETRONET|Petronet LNG|Gas Distribution|MC
BPCL|Bharat Petroleum|Oil & Gas|LC
IOC|Indian Oil Corp|Oil & Gas|LC
HINDPETRO|Hindustan Petroleum|Oil & Gas|MC
SUNTV|Sun TV Network|Media & Entertainment|SC
PVRINOX|PVR INOX|Media & Entertainment|SC
SAREGAMA|Saregama India|Media & Entertainment|SC
SUNSHINE|Sunshine Pictures|Media & Entertainment|MI
NAZARA|Nazara Technologies|Media & Entertainment|SC
ZEEL|Zee Entertainment|Media & Entertainment|SC
ALEMBICLTD|Alembic|Realty|MI
SOBHA|Sobha|Realty|SC
BRIGADE|Brigade Enterprises|Realty|SC
SIGNATURE|Signatureglobal|Realty|SC
QUESS|Quess Corp|Business Services|SC
TEAMLEASE|TeamLease Services|Business Services|SC
FSL|Firstsource Solutions|Business Services|SC
ECLERX|eClerx Services|Business Services|SC
KPEL|K.P. Energy|Renewable Energy|MI
SWSOLAR|Sterling & Wilson RE|Renewable Energy|SC
BORORENEW|Borosil Renewables|Renewable Energy|SC
VBL|Varun Beverages|FMCG|LC
DABUR|Dabur India|FMCG|MC
MARICO|Marico|FMCG|MC
COLPAL|Colgate-Palmolive India|FMCG|MC
TATACONSUM|Tata Consumer Products|FMCG|LC
EMAMILTD|Emami|FMCG|SC
BIKAJI|Bikaji Foods|FMCG|SC
VMART|V-Mart Retail|Retail|SC
NYKAA|FSN E-Commerce (Nykaa)|Retail|MC
ETERNAL|Eternal|Internet|LC
PAYTM|One 97 Communications|Internet|MC
POLICYBZR|PB Fintech|Internet|MC
NAUKRI|Info Edge|Internet|MC
INDIGO|InterGlobe Aviation|Airlines|LC
SHREECEM|Shree Cement|Cement|MC
AMBUJACEM|Ambuja Cements|Cement|LC
DALBHARAT|Dalmia Bharat|Cement|MC
JKCEMENT|JK Cement|Cement|SC
RAMCOCEM|Ramco Cements|Cement|SC
SONACOMS|Sona BLW Precision|Auto Components|MC
UNOMINDA|Uno Minda|Auto Components|MC
ENDURANCE|Endurance Technologies|Auto Components|SC
CRAFTSMAN|Craftsman Automation|Auto Components|SC
BAJAJ-AUTO|Bajaj Auto|Automobiles|LC
ESCORTS|Escorts Kubota|Automobiles|MC
OLAELEC|Ola Electric|Automobiles|MC
HYUNDAI|Hyundai Motor India|Automobiles|LC
SWIGGY|Swiggy|Internet|MC
JSWENERGY|JSW Energy|Power|MC
NHPC|NHPC|Power|MC
SJVN|SJVN|Power|SC
TORNTPOWER|Torrent Power|Power|MC
ADANIGREEN|Adani Green Energy|Renewable Energy|LC
HINDZINC|Hindustan Zinc|Metals & Mining|LC
NATIONALUM|National Aluminium|Metals & Mining|MC
JINDALSTEL|Jindal Steel & Power|Metals & Mining|MC
APLAPOLLO|APL Apollo Tubes|Metals & Mining|MC
RATNAMANI|Ratnamani Metals|Metals & Mining|SC
GMDCLTD|Gujarat Mineral Dev.|Metals & Mining|SC
DELHIVERY|Delhivery|Logistics|MC
BLUEDART|Blue Dart Express|Logistics|SC
ALLCARGO|Allcargo Logistics|Logistics|MI
TBOTEK|TBO Tek|Hotels & Leisure|SC
LEMONTREE|Lemon Tree Hotels|Hotels & Leisure|SC
EIHOTEL|EIH|Hotels & Leisure|SC
DEVYANI|Devyani International|Hotels & Leisure|SC
HFCL|HFCL|Telecom|SC
TEJASNET|Tejas Networks|Telecom|SC
ROUTE|Route Mobile|Telecom|MI
HBLENGINE|HBL Engineering|Electrical Equipment|SC
APARINDS|Apar Industries|Electrical Equipment|SC
TARIL|Transformers & Rectifiers|Electrical Equipment|MI
GENUSPOWER|Genus Power Infra|Electrical Equipment|MI
PGEL|PG Electroplast|Consumer Durables|SC
SYRMA|Syrma SGS Technology|Electrical Equipment|SC
SANSERA|Sansera Engineering|Auto Components|MI
JYOTICNC|Jyoti CNC Automation|Industrial Machinery|SC
PRAJIND|Praj Industries|Industrial Machinery|SC
THERMAX|Thermax|Industrial Machinery|MC
HONAUT|Honeywell Automation|Industrial Machinery|MC
SHAKTIPUMP|Shakti Pumps|Industrial Machinery|MI
RRKABEL|RR Kabel|Electrical Equipment|SC
FINCABLES|Finolex Cables|Electrical Equipment|SC
CERA|Cera Sanitaryware|Consumer Durables|MI
KAJARIACER|Kajaria Ceramics|Consumer Durables|SC
RELAXO|Relaxo Footwears|Consumer Durables|MI
BATAINDIA|Bata India|Consumer Durables|SC
PAGEIND|Page Industries|Textiles & Apparel|MC
KPRMILL|KPR Mill|Textiles & Apparel|SC
TRIDENT|Trident|Textiles & Apparel|MI
WELSPUNLIV|Welspun Living|Textiles & Apparel|SC
RAYMOND|Raymond|Textiles & Apparel|SC
ARVIND|Arvind|Textiles & Apparel|MI`;

  const US = `AAPL|Apple|Technology Hardware|LC
MSFT|Microsoft|Software|LC
NVDA|NVIDIA|Semiconductors|LC
AMZN|Amazon.com|Internet Retail|LC
GOOGL|Alphabet|Interactive Media|LC
META|Meta Platforms|Interactive Media|LC
TSLA|Tesla|Automobiles|LC
AVGO|Broadcom|Semiconductors|LC
JPM|JPMorgan Chase|Banks|LC
LLY|Eli Lilly|Pharmaceuticals|LC
V|Visa|Payments|LC
MA|Mastercard|Payments|LC
UNH|UnitedHealth|Health Care Services|LC
XOM|Exxon Mobil|Energy|LC
COST|Costco|Retail|LC
WMT|Walmart|Retail|LC
HD|Home Depot|Retail|LC
PG|Procter & Gamble|Consumer Staples|LC
NFLX|Netflix|Media|LC
AMD|Advanced Micro Devices|Semiconductors|LC
CRM|Salesforce|Software|LC
ORCL|Oracle|Software|LC
ADBE|Adobe|Software|LC
BAC|Bank of America|Banks|LC
KO|Coca-Cola|Consumer Staples|LC
PEP|PepsiCo|Consumer Staples|LC
MRK|Merck|Pharmaceuticals|LC
ABBV|AbbVie|Pharmaceuticals|LC
CVX|Chevron|Energy|LC
CAT|Caterpillar|Industrials|LC
GE|GE Aerospace|Aerospace & Defense|LC
RTX|RTX|Aerospace & Defense|LC
LMT|Lockheed Martin|Aerospace & Defense|LC
UBER|Uber|Internet|LC
PLTR|Palantir|Software|LC
NOW|ServiceNow|Software|LC
INTU|Intuit|Software|LC
QCOM|Qualcomm|Semiconductors|LC
MU|Micron|Semiconductors|LC
ANET|Arista Networks|Technology Hardware|LC
PANW|Palo Alto Networks|Software|LC
CRWD|CrowdStrike|Software|LC
SHOP|Shopify|Software|LC
GS|Goldman Sachs|Capital Markets|LC
MS|Morgan Stanley|Capital Markets|LC
SCHW|Charles Schwab|Capital Markets|LC
DE|Deere|Industrials|LC
HON|Honeywell|Industrials|LC
NEE|NextEra Energy|Utilities|LC
DUK|Duke Energy|Utilities|LC
DECK|Deckers Outdoor|Consumer Discretionary|MC
ELF|e.l.f. Beauty|Consumer Staples|MC
CELH|Celsius Holdings|Consumer Staples|MC
DKNG|DraftKings|Consumer Discretionary|MC
AFRM|Affirm|Payments|MC
HOOD|Robinhood|Capital Markets|MC
SOFI|SoFi Technologies|Banks|MC
RKLB|Rocket Lab|Aerospace & Defense|MC
AXON|Axon Enterprise|Aerospace & Defense|MC
VRT|Vertiv|Industrials|MC
SMCI|Super Micro Computer|Technology Hardware|MC
ENPH|Enphase Energy|Utilities|MC
FSLR|First Solar|Utilities|MC
ONON|On Holding|Consumer Discretionary|MC
CAVA|CAVA Group|Restaurants|MC
WING|Wingstop|Restaurants|MC
CMG|Chipotle|Restaurants|LC
DUOL|Duolingo|Software|MC
NET|Cloudflare|Software|MC
DDOG|Datadog|Software|MC
SNOW|Snowflake|Software|MC
MDB|MongoDB|Software|MC
APP|AppLovin|Software|LC
IONQ|IonQ|Technology Hardware|SC
SOUN|SoundHound AI|Software|SC
ACHR|Archer Aviation|Aerospace & Defense|SC
JOBY|Joby Aviation|Aerospace & Defense|SC
OKLO|Oklo|Utilities|SC
CRDO|Credo Technology|Semiconductors|SC
ALAB|Astera Labs|Semiconductors|SC`;

  function parse(txt) {
    return txt.trim().split("\n").map((l) => {
      const [t, n, s, c] = l.split("|");
      return { ticker: t, name: n, sector: s, cap: c };
    });
  }

  // ---- Helpers for "dates" ----------------------------------------------------------
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function lastSession(now) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    d.setDate(d.getDate() - 1);
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() - 1);
    return d;
  }
  function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function fmtShort(d) { return String(d.getDate()).padStart(2, "0") + " " + MONTHS[d.getMonth()]; }
  function fmtISO(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

  // ---- Per-stock synthetic metrics -------------------------------------------------
  const CAP_BASE = { LC: 1800, MC: 900, SC: 420, MI: 180 };
  const CAP_VOL = { LC: 0.012, MC: 0.018, SC: 0.025, MI: 0.034 };

  function buildSeries(r, start, n, vol, drift) {
    const s = [start];
    for (let i = 1; i < n; i++) s.push(Math.max(1, s[i - 1] * (1 + drift + vol * gauss(r))));
    return s;
  }
  function ema(series, p) {
    const k = 2 / (p + 1); const out = []; let prev = series[0];
    for (const v of series) { prev = v * k + prev * (1 - k); out.push(prev); }
    return out;
  }
  function rsi(series, p = 14) {
    let g = 0, l = 0;
    for (let i = 1; i <= p; i++) { const d = series[i] - series[i - 1]; if (d > 0) g += d; else l -= d; }
    g /= p; l /= p; const out = new Array(p + 1).fill(50);
    for (let i = p + 1; i < series.length; i++) {
      const d = series[i] - series[i - 1];
      g = (g * (p - 1) + Math.max(d, 0)) / p; l = (l * (p - 1) + Math.max(-d, 0)) / p;
      out.push(l === 0 ? 100 : 100 - 100 / (1 + g / l));
    }
    return out;
  }

  function makeStock(meta, market, tf, session) {
    const r = mulberry32(hash(market + ":" + tf + ":" + meta.ticker));
    const weekly = tf === "weekly";
    const n = weekly ? 260 : 320;
    const vol = CAP_VOL[meta.cap] * (weekly ? 2.2 : 1) * (0.7 + r() * 0.8);
    const drift = (r() - 0.45) * vol * 0.16;
    const start = CAP_BASE[meta.cap] * (0.15 + r() * 1.7);
    const s = buildSeries(r, start, n, vol, drift);
    // A few names get a big last bar so the default 1D% sort looks lively.
    if (r() < 0.06) s[n - 1] = s[n - 2] * (1 + 0.06 + r() * 0.14);

    const e10 = ema(s, 10), e20 = ema(s, 20), e50 = ema(s, 50), e200 = ema(s, 200);
    const rs = rsi(s), rsMA = ema(rs, 14);
    const last = n - 1, price = s[last];
    const hi52 = Math.max(...s.slice(-(weekly ? 52 : 250)));
    const lo52 = Math.min(...s.slice(-(weekly ? 52 : 250)));

    // EMA cross: last bar where 10 crossed above 20
    let crossAgo = null;
    if (e10[last] > e20[last]) {
      for (let i = last; i > last - 60; i--) if (e10[i - 1] <= e20[i - 1]) { crossAgo = last - i; break; }
    }
    const spread = (Math.max(e10[last], e20[last], e50[last]) - Math.min(e10[last], e20[last], e50[last])) / price;

    // Classic floor pivots from prior bar
    const H = Math.max(s[last - 1], s[last - 2]) * (1 + vol * 0.4), L = Math.min(s[last - 1], s[last - 2]) * (1 - vol * 0.4), C = s[last - 1];
    const PP = (H + L + C) / 3, R1 = 2 * PP - L, S1 = 2 * PP - H, R2 = PP + (H - L), S2 = PP - (H - L);
    const pivotZone = (p) => p > R2 ? "Above R2" : p > R1 ? "R1-R2" : p > PP ? "PP-R1" : p > S1 ? "S1-PP" : p > S2 ? "S2-S1" : "Below S2";
    const wpBias = (r() - 0.5) * 0.06;
    const wZone = pivotZone(price * (1 + wpBias));

    // Breakout: highest close of prior 40 bars exceeded within last 20 bars
    let bo = null;
    for (let i = last; i > last - 20; i--) {
      const base = Math.max(...s.slice(i - 40, i));
      const baseLo = Math.min(...s.slice(i - 40, i));
      if (s[i] > base && s[i - 1] <= base && (base - baseLo) / base < 0.35) {
        bo = { ago: last - i, gain: (price / s[i] - 1) * 100, vol: round(1 + r() * 3.2, 1) };
        break;
      }
    }
    const aligned = price > e10[last] && e10[last] > e20[last] && e20[last] > e50[last] && e50[last] > e200[last];
    const stage2 = [price > e50[last], price > e200[last], e50[last] > e200[last],
      e200[last] > e200[last - 20], price > lo52 * 1.3, price > hi52 * 0.75, rs[last] > 50].filter(Boolean).length;
    const momentum = (price / s[last - (weekly ? 13 : 63)] - 1) * 0.4 + (price / s[last - (weekly ? 26 : 126)] - 1) * 0.3 + (price / s[last - (weekly ? 52 : 250)] - 1) * 0.3;

    const pick = () => -0.08 + r() * 0.16;
    const lastE = addDays(session, -Math.floor(5 + r() * 95));
    const nextE = r() < 0.35 ? addDays(session, Math.floor(1 + r() * 30)) : null;
    const ipo = r() < 0.05;
    const darvas = r() < 0.08 && price > hi52 * 0.9;
    const fractal = r() < 0.1 && s[last] > Math.max(s[last - 3], s[last - 4], s[last - 5]);

    return {
      ...meta,
      price: round(price, price > 1000 ? 1 : 2),
      chg: round((s[last] / s[last - 1] - 1) * 100, 1),
      rsi: Math.round(rs[last]),
      rsiAboveMA: rs[last] > rsMA[last],
      volSpike: round(Math.max(0.2, Math.exp(gauss(r) * 0.55) * (Math.abs(s[last] / s[last - 1] - 1) > 0.05 ? 4 : 1.1)), 1),
      gap: round((r() - 0.5) * vol * 120, 1),
      from52: round((price / hi52 - 1) * 100, 1),
      emas: { 10: price > e10[last], 20: price > e20[last], 50: price > e50[last], 200: price > e200[last] },
      aligned,
      converge: spread < 0.025,
      from20: round((price / e20[last] - 1) * 100, 1),
      crossAgo,
      dPivot: pivotZone(price),
      wPivot: wZone,
      bo,
      stage2,
      rsScore: momentum,
      lastEarn: lastE,
      e1: round(pick() * 60, 1), e0: round(pick() * 90, 1), e2: round(pick() * 70, 1),
      nextEarn: nextE,
      ipo, darvas, fractal,
      series: s.slice(-140),
      e20s: e20.slice(-140), e50s: e50.slice(-140), e200s: e200.slice(-140),
      turnover: price * (2e5 + r() * 4e6) * (meta.cap === "LC" ? 6 : meta.cap === "MC" ? 2.5 : 1),
      cmf: round((r() - 0.45) * 0.5 + (s[last] / s[last - 20] - 1), 2),
      rsHist: null, // filled after ranking
    };
  }

  function rankRS(rows) {
    const sorted = [...rows].sort((a, b) => a.rsScore - b.rsScore);
    sorted.forEach((row, i) => { row.rs = Math.max(1, Math.round(((i + 1) / sorted.length) * 99)); });
    rows.forEach((row) => {
      const r = mulberry32(hash("rs:" + row.ticker));
      const t0 = row.rs;
      const t5 = clamp(Math.round(t0 - (r() - 0.45) * 22), 1, 99);
      const t15 = clamp(Math.round(t5 - (r() - 0.45) * 30), 1, 99);
      const t30 = clamp(Math.round(t15 - (r() - 0.45) * 36), 1, 99);
      row.rsHist = [t30, t15, t5, t0];
    });
  }

  // ---- Indices ---------------------------------------------------------------------
  const INDICES = {
    IN: [["Nifty 50", 25044.65], ["Nifty LargeCap 100", 25992.95], ["Nifty MidCap 150", 22408.55], ["Nifty SmallCap 250", 17577]],
    US: [["S&P 500", 6812.4], ["Nasdaq 100", 25120.8], ["Dow Jones", 47210.3], ["Russell 2000", 2468.7]],
  };

  function buildBreadthHistory(key, current, r) {
    const out = []; let v = current;
    for (let i = 0; i < 60; i++) { out.unshift(round(v, 1)); v = clamp(v + gauss(r) * 4, key === "ad" ? -80 : 2, key === "ad" ? 80 : 98); }
    return out;
  }

  const cache = {};

  // ---- Real data (produced by pipeline/build_data.py) --------------------------------
  function parseDate(s) { if (!s) return null; const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
  async function loadReal(market, tf) {
    const res = await fetch(`data/${market}-${tf}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error("no data file");
    const j = await res.json();
    j.rows.forEach((x) => { x.lastEarn = parseDate(x.lastEarn); x.nextEarn = parseDate(x.nextEarn); });
    j.session = parseDate(j.session);
    j.market = market; j.tf = tf; j.source = "live";
    return j;
  }

  /** Loads real data if `data/<MARKET>-<tf>.json` exists, otherwise synthetic demo data. */
  async function load(market = "IN", tf = "daily") {
    const k = market + tf;
    if (cache[k]) return cache[k];
    try { cache[k] = await loadReal(market, tf); }
    catch (e) { cache[k] = loadDemo(market, tf); }
    return cache[k];
  }

  function loadDemo(market = "IN", tf = "daily") {
    const k = market + tf;
    const session = lastSession(new Date());
    const metas = parse(market === "US" ? US : IN);
    const rows = metas.map((m) => makeStock(m, market, tf, session));
    rankRS(rows);
    const n = rows.length;
    const pct = (f) => round((rows.filter(f).length / n) * 100, 1);
    const adv = rows.filter((x) => x.chg > 0).length, dec = rows.filter((x) => x.chg < 0).length;
    const r = mulberry32(hash("breadth" + k));
    const breadth = [
      { key: "ad", label: "Advance / decline", value: round(((adv - dec) / n) * 100, 1), unit: "%", help: "(Advancers − decliners) ÷ total stocks in the universe." },
      { key: "e20", label: "Above 20 EMA", value: pct((x) => x.emas[20]), unit: "%", help: "Share of stocks closing above their 20-period EMA." },
      { key: "e200", label: "Above 200 EMA", value: pct((x) => x.emas[200]), unit: "%", help: "Share of stocks above their 200-period EMA — the long-term trend filter." },
      { key: "rsi60", label: "RSI above 60", value: pct((x) => x.rsi > 60), unit: "%", help: "Share of stocks with 14-period RSI above 60 (strong momentum)." },
      { key: "piv", label: "Above daily pivot", value: pct((x) => /R|PP-R1/.test(x.dPivot)), unit: "%", help: "Share of stocks trading above the classic floor pivot point." },
      { key: "hi52", label: "Near 52-week high", value: pct((x) => x.from52 > -5), unit: "%", help: "Share of stocks within 5% of their 52-week high." },
      { key: "bo", label: "Recent breakout", value: pct((x) => x.bo), unit: "%", help: "Share of stocks with a qualified base breakout in the last 20 sessions." },
    ];
    breadth.forEach((b) => { b.history = buildBreadthHistory(b.key, b.value, r); b.delta = round(b.value - b.history[b.history.length - 6], 1); });
    const indices = INDICES[market].map(([name, base]) => {
      const rr = mulberry32(hash(name + k)); const chg = round((rr() - 0.45) * 1.2, 2);
      return { name, value: base, chg };
    });
    return { rows, breadth, indices, session, market, tf, source: "demo" };
  }

  window.Kestrel = window.Kestrel || {};
  window.Kestrel.data = { load, fmtShort, fmtISO, round };
})();
