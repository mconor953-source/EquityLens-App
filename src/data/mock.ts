/**
 * MOCK DATA — clearly labelled placeholder content for interface build only.
 * Every export here maps to a future FastAPI endpoint; see comments.
 */
import { mockCandles } from "./series";
import type {
  Asset,
  EventItem,
  FinancialHealth,
  MarketStructure,
  NewsItem,
  QuoteRow,
  TechnicalAnalysis,
  StructurePoint,
  WatchlistRow,
} from "./types";

export const MOCK_NOTICE = "Mock data — not live market data";

export const asOfDate = "Thursday, 20 August 2026";
export const lastUpdated = "18:42 UTC";

/* /api/market/overview */
export const globalMarkets: QuoteRow[] = [
  { ticker: "SPX", name: "S&P 500", price: 7676.08, changePct: -0.41 },
  { ticker: "IXIC", name: "NASDAQ", price: 26077.47, changePct: -0.96 },
  { ticker: "DJI", name: "Dow Jones", price: 53050.2, changePct: -0.77 },
  { ticker: "UKX", name: "FTSE 100", price: 10752.84, changePct: 0.09 },
  { ticker: "DAX", name: "DAX", price: 25995.87, changePct: -0.37 },
  { ticker: "NKY", name: "Nikkei 225", price: 65326.42, changePct: -3.16 },
];

export const majorAssets: QuoteRow[] = [
  { ticker: "GC=F", name: "Gold Futures", price: 4536.3, changePct: 1.04 },
  { ticker: "SI=F", name: "Silver Futures", price: 62.14, changePct: 4.68 },
  { ticker: "CL=F", name: "WTI Crude", price: 71.86, changePct: -0.62 },
  { ticker: "BTC-USD", name: "Bitcoin", price: 118422.0, changePct: 0.74 },
  { ticker: "GBPUSD", name: "GBP / USD", price: 1.3184, changePct: -0.18 },
  { ticker: "US10Y", name: "US 10Y Yield", price: 4.128, changePct: 0.41 },
];

export const movers: QuoteRow[] = [
  { ticker: "SI=F", name: "Silver Futures", price: 62.14, changePct: 4.68 },
  { ticker: "NVDA", name: "NVIDIA Corp.", price: 214.62, changePct: 2.91 },
  { ticker: "AAPL", name: "Apple Inc.", price: 316.83, changePct: 2.19 },
  { ticker: "GC=F", name: "Gold Futures", price: 4536.3, changePct: 1.04 },
  { ticker: "GBPJPY", name: "GBP / JPY", price: 201.44, changePct: -1.12 },
  { ticker: "NKY", name: "Nikkei 225", price: 65326.42, changePct: -3.16 },
];

/* /api/watchlist */
export const watchlist: WatchlistRow[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 316.83,
    changePct: 2.19,
    technical: "Strong Buy",
    structure: "Continuation",
    eventRisk: "Low",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: 214.62,
    changePct: 2.91,
    technical: "Strong Buy",
    structure: "Break confirmed",
    eventRisk: "High",
  },
  {
    ticker: "GC=F",
    name: "Gold Futures",
    price: 4536.3,
    changePct: 1.04,
    technical: "Buy",
    structure: "Watching seller level",
    eventRisk: "Moderate",
  },
  {
    ticker: "GBPJPY",
    name: "GBP / JPY",
    price: 201.44,
    changePct: -1.12,
    technical: "Sell",
    structure: "Correction",
    eventRisk: "High",
  },
  {
    ticker: "NKY",
    name: "Nikkei 225",
    price: 65326.42,
    changePct: -3.16,
    technical: "Neutral",
    structure: "Range",
    eventRisk: "Moderate",
  },
];

export const dashboardMetrics = [
  { label: "Market Breadth", value: "8 / 14", note: "advancing", tone: "neutral" as const },
  { label: "Biggest Mover", value: "Silver", note: "+4.68%", tone: "pos" as const },
  { label: "Event Risk", value: "Low", note: "next 24h", tone: "pos" as const },
  { label: "Watchlist", value: "5", note: "assets tracked", tone: "neutral" as const },
];

export const whatMattersToday = [
  "Markets are mixed today. 8 of 14 tracked assets are advancing.",
  "Silver leads gains at +4.68%, extending a strong precious metals run.",
  "Nikkei 225 is the weakest at -3.16% after a sharp reversal in Tokyo.",
];

export const importantToday = [
  { label: "Fed speaker", detail: "Policy remarks", when: "18:00" },
  { label: "NVDA earnings", detail: "After the close", when: "Tomorrow" },
  { label: "Gold", detail: "Elevated momentum", when: "Today" },
  { label: "GBP/USD", detail: "Major UK data", when: "Tomorrow" },
];

export const researchHighlights = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    lines: [
      { label: "Technical rating", value: "Strong Buy", tone: "pos" as const },
      { label: "Financial health", value: "82 / 100", tone: "pos" as const },
    ],
  },
  {
    ticker: "GC=F",
    name: "Gold Futures",
    lines: [
      { label: "Structure", value: "Watching seller level", tone: "warn" as const },
      { label: "4H bias", value: "Bullish", tone: "pos" as const },
    ],
  },
  {
    ticker: "GBPJPY",
    name: "GBP / JPY",
    lines: [
      { label: "Event risk", value: "High", tone: "neg" as const },
      { label: "Technical rating", value: "Sell", tone: "neg" as const },
    ],
  },
];

/* /api/events */
export const upcomingEvents: EventItem[] = [
  {
    label: "Fed speaker",
    detail: "FOMC member remarks on policy path",
    when: "18:00",
    date: "20 Aug",
    importance: "Moderate",
  },
  {
    label: "NVDA earnings",
    detail: "Q2 results after the US close",
    when: "21:00",
    date: "21 Aug",
    importance: "High",
  },
  {
    label: "UK retail sales",
    detail: "Consumer demand read for GBP crosses",
    when: "07:00",
    date: "21 Aug",
    importance: "Moderate",
  },
  {
    label: "US CPI",
    detail: "Headline and core inflation",
    when: "13:30",
    date: "24 Aug",
    importance: "High",
  },
  {
    label: "Eurozone PMI",
    detail: "Flash manufacturing and services",
    when: "09:00",
    date: "25 Aug",
    importance: "Low",
  },
];

/* /api/asset/{ticker} */
export const searchUniverse: Asset[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    currency: "$",
    price: 316.83,
    changePct: 2.19,
    changeAbs: 6.79,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    exchange: "NASDAQ",
    currency: "$",
    price: 214.62,
    changePct: 2.91,
    changeAbs: 6.07,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    exchange: "NASDAQ",
    currency: "$",
    price: 588.4,
    changePct: -0.34,
    changeAbs: -2.01,
  },
  {
    ticker: "GC=F",
    name: "Gold Futures",
    exchange: "COMEX",
    currency: "$",
    price: 4536.3,
    changePct: 1.04,
    changeAbs: 46.7,
  },
  {
    ticker: "GBPJPY",
    name: "GBP / JPY",
    exchange: "FX",
    currency: "",
    price: 201.44,
    changePct: -1.12,
    changeAbs: -2.28,
  },
];

export const researchAsset = searchUniverse[0]!;

export const priceHistory = {
  "1M": mockCandles({ seed: 7, count: 22, start: 292, end: 316.83, startDate: "2026-07-21" }),
  "3M": mockCandles({ seed: 11, count: 64, start: 268, end: 316.83, startDate: "2026-05-21" }),
  "6M": mockCandles({ seed: 13, count: 120, start: 244, end: 316.83, startDate: "2026-02-20" }),
  "1Y": mockCandles({ seed: 17, count: 180, start: 208, end: 316.83, stepDays: 2, startDate: "2025-08-20" }),
  "5Y": mockCandles({ seed: 23, count: 200, start: 96, end: 316.83, stepDays: 9, startDate: "2021-08-20" }),
};

/* /api/technical/{ticker} */
export const technical: TechnicalAnalysis = {
  rating: "Strong Buy",
  score: 68,
  counts: { buy: 6, neutral: 1, sell: 1 },
  trend: "Uptrend",
  indicators: [
    { name: "SMA 20", signal: "Buy", value: "308.42", note: "Price above the 20-day average" },
    { name: "SMA 50", signal: "Buy", value: "294.10", note: "Medium-term average rising" },
    { name: "SMA 200", signal: "Buy", value: "261.55", note: "Long-term uptrend intact" },
    { name: "RSI (14)", signal: "Neutral", value: "61.4", note: "Momentum firm, not stretched" },
    { name: "MACD", signal: "Sell", value: "-0.42", note: "Histogram rolling over short term" },
    { name: "ADX (14)", signal: "Buy", value: "27.8", note: "Trend strength above threshold" },
    { name: "Bollinger", signal: "Buy", value: "Upper half", note: "Trading in the upper band" },
    { name: "Volume trend", signal: "Buy", value: "+14%", note: "Advances on above-average volume" },
  ],
};

/* /api/fundamentals/{ticker} */
export const financialHealth: FinancialHealth = {
  score: 78,
  max: 100,
  label: "Good",
  categories: [
    { name: "Growth", score: 20, max: 20, note: "Revenue and EPS expanding" },
    { name: "Profitability", score: 20, max: 20, note: "High and stable margins" },
    { name: "Balance Sheet", score: 10, max: 20, note: "Leverage above sector median" },
    { name: "Cash Flow", score: 20, max: 20, note: "Strong free cash conversion" },
    { name: "Valuation", score: 8, max: 20, note: "Trading at a premium multiple" },
  ],
  strengths: ["Revenue growth", "Strong profitability", "Strong free cash flow"],
  weaknesses: ["High valuation multiples", "Rising capital intensity"],
};

/* /api/events/{ticker} + relevant news */
export const assetNews: NewsItem[] = [
  {
    headline: "Apple supplier outlook improves",
    source: "Market wire",
    when: "2h ago",
    importance: "Moderate",
    why: "Supplier guidance often leads hardware revenue expectations.",
  },
  {
    headline: "US inflation data tomorrow",
    source: "Macro calendar",
    when: "Tomorrow 13:30",
    importance: "High",
    why: "Rate expectations drive large-cap technology valuations.",
  },
  {
    headline: "Upcoming earnings",
    source: "Company filing",
    when: "24 Oct",
    importance: "High",
    why: "Guidance is the primary near-term repricing risk.",
  },
  {
    headline: "Services segment growth steady",
    source: "Analyst note",
    when: "1d ago",
    importance: "Low",
    why: "Supports the recurring-revenue portion of the model.",
  },
];

/* /api/market-structure/{ticker} */
const structureCandles = mockCandles({
  seed: 41,
  count: 90,
  start: 4402,
  end: 4536.3,
  volatility: 0.009,
  startDate: "2026-06-01",
});

function swing(
  i: number,
  side: "h" | "l",
  kind: StructurePoint["kind"],
  major: boolean,
): StructurePoint {
  const c = structureCandles[i]!;
  return { t: c.t, price: side === "h" ? c.h : c.l, kind, major };
}

export const marketStructure: MarketStructure = {
  status: "Watching Seller Level",
  timeframes: [
    { tf: "4H", bias: "Bullish", note: "Higher highs and higher lows intact" },
    { tf: "1H", bias: "Developing", note: "Compressing below the seller level" },
    { tf: "15M", bias: "Bearish", note: "Lower highs since the session open" },
    { tf: "5M", bias: "Bearish", note: "Short-term supply in control" },
  ],
  sellerLevel: 4583.8,
  buyerLevel: 4378.0,
  phase: { breakState: "Waiting", correction: "Not confirmed", continuation: "Not confirmed" },
  outlook: [
    "4H structure remains bullish.",
    "1H is developing below the active seller level.",
    "No confirmed candle-close break has occurred yet.",
  ],
  details: [
    { label: "Last major swing high", value: "4,583.80" },
    { label: "Last major swing low", value: "4,378.00" },
    { label: "Active range width", value: "205.80 (4.5%)" },
    { label: "4H higher-low sequence", value: "3 intact" },
    { label: "Candle-close break rule", value: "4H close above 4,583.80" },
    { label: "Correction reference", value: "50% of last impulse leg" },
    { label: "Structure sample window", value: "Last 90 4H candles" },
  ],
  eventRisk: "No major high-impact events scheduled this week for this asset.",
  candles: structureCandles,
  points: [
    swing(18, "h", "HH", false),
    swing(34, "l", "HL", false),
    swing(58, "h", "HH", true),
    swing(70, "l", "HL", true),
    swing(82, "h", "LH", true),
  ],
};

export const structureAsset: Asset = {
  ticker: "GC=F",
  name: "Gold Futures",
  exchange: "COMEX",
  currency: "$",
  price: 4536.3,
  changePct: 1.04,
  changeAbs: 46.7,
};
