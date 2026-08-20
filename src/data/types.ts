/**
 * Shared domain types for EQUITYLENS.
 *
 * These mirror the shapes the existing FastAPI engine returns, so the mock
 * modules in this folder can later be swapped for REST calls
 * (/api/asset/{ticker}, /api/research/{ticker}, ...) without touching the UI.
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
  changeAbs: number;
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
  technical: Rating;
  structure: string;
  eventRisk: RiskLevel;
}

export interface IndicatorSignal {
  name: string;
  signal: Rating;
  note: string;
  value: string;
}

export interface TechnicalAnalysis {
  rating: Rating;
  score: number; // -100..100
  counts: { buy: number; neutral: number; sell: number };
  trend: TrendLabel;
  indicators: IndicatorSignal[];
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
  importance: RiskLevel;
  why: string;
}

export interface EventItem {
  label: string;
  detail: string;
  when: string;
  date: string;
  importance: RiskLevel;
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
  kind: "HH" | "HL" | "LH" | "LL";
  major: boolean;
}

export interface TimeframeRead {
  tf: "4H" | "1H" | "15M" | "5M";
  bias: StructureBias;
  note: string;
}

export interface MarketStructure {
  status: string;
  timeframes: TimeframeRead[];
  sellerLevel: number;
  buyerLevel: number;
  phase: { breakState: ConfirmState; correction: ConfirmState; continuation: ConfirmState };
  outlook: string[];
  details: { label: string; value: string }[];
  eventRisk: string;
  candles: Candle[];
  points: StructurePoint[];
}
