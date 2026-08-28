/**
 * Shared domain types for EQUITYLENS.
 *
 * These mirror the shapes the FastAPI engine returns (see src/lib/api), so
 * string unions stay open where the backend is the source of truth.
 */

export type Rating = "Strong Buy" | "Buy" | "Neutral" | "Sell" | "Strong Sell";
export type RiskLevel = "Low" | "Moderate" | "High";
export type TrendLabel = "Uptrend" | "Range" | "Downtrend";
export type StructureBias = "Bullish" | "Bearish" | "Developing" | "Neutral";
export type ConfirmState = "Confirmed" | "Not confirmed" | "Waiting";

export interface Asset {
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  changePct: number;
  /** Absolute change — only present when the source supplies it. */
  changeAbs?: number;
}

export interface QuoteRow {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
}

export interface WatchlistRow {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  technical: string;
  structure: string;
  eventRisk: string;
}

export interface IndicatorSignal {
  name: string;
  signal: string;
  note: string;
  value?: string;
}

export interface TechnicalAnalysis {
  rating: string;
  score: number; // -100..100 signal balance
  counts: { buy: number; neutral: number; sell: number };
  trend: string;
  indicators: IndicatorSignal[];
  rsi?: number;
}

export interface HealthCategory {
  name: string;
  score: number;
  max: number;
  note: string;
}

export interface FinancialHealth {
  score: number;
  max: number;
  label: string;
  categories: HealthCategory[];
  strengths: string[];
  weaknesses: string[];
}

export interface NewsItem {
  headline: string;
  source: string;
  when: string;
  importance?: string;
  why?: string;
  url?: string;
}

export interface EventItem {
  label: string;
  detail: string;
  when: string;
  date: string;
  importance: string;
}

export interface Candle {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
}

export interface StructurePoint {
  t: string;
  price: number;
  kind: string;
  major: boolean;
}

export interface TimeframeRead {
  tf: string;
  bias: string;
  note: string;
}

export interface StructureLevel {
  timeframe: string;
  price: number;
  label: string;
}

export interface MarketStructure {
  status: string;
  timeframes: TimeframeRead[];
  sellerLevel: number;
  buyerLevel: number;
  sellerLevels?: StructureLevel[];
  buyerLevels?: StructureLevel[];
  phase: { breakState: string; correction: string; continuation: string };
  outlook: string[];
  details: { label: string; value: string }[];
  eventRisk: string;
  candles: Candle[];
  points: StructurePoint[];
}
