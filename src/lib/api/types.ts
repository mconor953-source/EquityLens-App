/**
 * Raw FastAPI response shapes (source of truth = the backend).
 * Fields are intentionally permissive so a backend addition never crashes the UI.
 */

export interface ApiIndicator {
  name: string;
  signal: string;
  detail?: string | null;
  value?: number | string | null;
}

export interface ApiTechnical {
  signal?: string | null;
  rating?: string | null;
  buy_count?: number | null;
  neutral_count?: number | null;
  sell_count?: number | null;
  total_signals?: number | null;
  rsi?: number | null;
  indicators?: ApiIndicator[] | null;
  signals?: ApiIndicator[] | null;
}

export interface ApiEventRisk {
  available?: boolean | null;
  label?: string | null;
  events?: { title?: string | null; label?: string | null; date?: string | null; importance?: string | null }[] | null;
}

export interface ApiHealthCategory {
  name?: string | null;
  score?: number | null;
  max?: number | null;
  max_score?: number | null;
  note?: string | null;
  detail?: string | null;
}

export interface ApiFinancialHealth {
  score?: number | null;
  max?: number | null;
  max_score?: number | null;
  label?: string | null;
  grade?: string | null;
  rating?: string | null;
  categories?: ApiHealthCategory[] | Record<string, unknown> | null;
  strengths?: string[] | null;
  weaknesses?: string[] | null;
}

export interface ApiAsset {
  symbol: string;
  name?: string | null;
  asset_class?: string | null;
  price?: number | null;
  daily_change_pct?: number | null;
  data_status?: string | null;
  technical?: ApiTechnical | null;
  financial_health?: ApiFinancialHealth | null;
  event_risk?: ApiEventRisk | null;
  market_structure?: { status?: string | null; direction?: string | null; quality?: string | null } | null;
}

export interface ApiResearch extends ApiAsset {
  price_statistics?: Record<string, number | null> | null;
  fundamentals?: Record<string, unknown> | null;
  analyst_consensus?: Record<string, unknown> | null;
  earnings?: Record<string, unknown> | null;
  summary?: string | null;
}

export interface ApiSwing {
  time: string;
  price: number;
  type: "high" | "low" | string;
  label: string;
}

export interface ApiLevel {
  time?: string | null;
  price: number;
  type?: string | null;
  label?: string | null;
  timeframe?: string | null;
}

export interface ApiTimeframe {
  bias?: string | null;
  swings?: ApiSwing[] | null;
  levels?: { seller_level?: ApiLevel | null; buyer_level?: ApiLevel | null } | null;
  candle_count?: number | null;
  last_time?: string | null;
}

export interface ApiMarketStructure {
  symbol: string;
  direction?: string | null;
  structure_status?: string | null;
  quality?: string | null;
  quality_factors?: Record<string, boolean> | null;
  explanation?: string | null;
  timeframes?: Record<string, ApiTimeframe> | null;
  seller_levels?: ApiLevel[] | null;
  buyer_levels?: ApiLevel[] | null;
  break?: { broken?: boolean | null; time?: string | null; close?: number | null } | null;
  break_status?: string | null;
  pullback_status?: string | null;
  continuation_status?: string | null;
  advanced?: Record<string, string | null> | null;
  data_available?: Record<string, boolean> | null;
}

export interface ApiNews {
  title: string;
  publisher?: string | null;
  published?: string | null;
  url?: string | null;
}

export interface ApiEvents {
  symbol: string;
  asset_class?: string | null;
  economic_events?: { available?: boolean | null; events?: unknown[] | null } | null;
  company_news?: ApiNews[] | null;
  earnings?: Record<string, unknown> | null;
}

/** GET /api/watchlist → { "List name": ["AAPL", ...] } */
export type ApiWatchlist = Record<string, string[]>;

export interface ApiInvestmentIdea {
  id?: string | number;
  idea_id?: string | number;
  symbol?: string | null;
  ticker?: string | null;
  thesis?: string | null;
  note?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}
