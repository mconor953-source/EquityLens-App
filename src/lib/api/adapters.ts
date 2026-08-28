/**
 * Adapters: map raw backend payloads onto the existing UI types.
 * No financial logic here — ratings, scores, levels and structure states are
 * passed through exactly as the engine supplies them.
 */
import type {
  Asset,
  Candle,
  FinancialHealth,
  HealthCategory,
  IndicatorSignal,
  MarketStructure,
  NewsItem,
  StructurePoint,
  TechnicalAnalysis,
  TimeframeRead,
} from "@/data/types";
import type {
  ApiAsset,
  ApiEvents,
  ApiFinancialHealth,
  ApiHealthCategory,
  ApiLevel,
  ApiMarketStructure,
  ApiResearch,
  ApiSwing,
  ApiTechnical,
} from "./types";

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function toAsset(raw: ApiAsset | ApiResearch): Asset {
  return {
    ticker: raw.symbol,
    name: raw.name?.trim() || raw.symbol,
    exchange: raw.asset_class ? `${raw.asset_class}${raw.data_status ? ` · ${raw.data_status}` : ""}` : (raw.data_status ?? ""),
    currency: "",
    price: raw.price ?? 0,
    changePct: raw.daily_change_pct ?? 0,
  };
}

export function toTechnical(raw: ApiTechnical | null | undefined, trend?: string | null): TechnicalAnalysis | null {
  if (!raw) return null;
  const rating = raw.rating ?? raw.signal ?? "";
  if (!rating) return null;
  const list = raw.signals ?? raw.indicators ?? [];
  const buy = raw.buy_count ?? 0;
  const neutral = raw.neutral_count ?? 0;
  const sell = raw.sell_count ?? 0;
  const total = raw.total_signals ?? buy + neutral + sell;

  const indicators: IndicatorSignal[] = list.map((i) => ({
    name: i.name,
    signal: i.signal,
    note: i.detail ?? "",
    value: i.value === null || i.value === undefined ? undefined : String(i.value),
  }));

  return {
    rating,
    // Meter position only: share of backend buy vs sell signals, nothing else.
    score: total > 0 ? Math.round(((buy - sell) / total) * 100) : 0,
    counts: { buy, neutral, sell },
    trend: trend ? titleCase(trend) : "—",
    indicators,
    rsi: raw.rsi ?? undefined,
  };
}

function normaliseCategories(input: ApiFinancialHealth["categories"]): HealthCategory[] {
  if (!input) return [];
  const rows: ApiHealthCategory[] = Array.isArray(input)
    ? input
    : Object.entries(input).map(([name, v]) =>
        v && typeof v === "object" ? { name, ...(v as ApiHealthCategory) } : { name, score: Number(v) },
      );
  return rows
    .filter((r) => typeof r.score === "number")
    .map((r) => ({
      name: r.name ?? "—",
      score: r.score as number,
      max: r.max ?? r.max_score ?? 20,
      note: r.note ?? r.detail ?? "",
    }));
}

export function toFinancialHealth(raw: ApiFinancialHealth | null | undefined): FinancialHealth | null {
  if (!raw || typeof raw.score !== "number") return null;
  return {
    score: raw.score,
    max: raw.max ?? raw.max_score ?? 100,
    label: raw.label ?? raw.grade ?? raw.rating ?? "",
    categories: normaliseCategories(raw.categories),
    strengths: raw.strengths ?? [],
    weaknesses: raw.weaknesses ?? [],
  };
}

/* ---------------------------------------------------------------- structure */

export const STRUCTURE_TFS = ["4h", "1h", "15m", "5m"] as const;
export type StructureTf = (typeof STRUCTURE_TFS)[number];
export const TF_LABEL: Record<StructureTf, string> = { "4h": "4H", "1h": "1H", "15m": "15M", "5m": "5M" };

/** Swing series as a price line. Only closes are real, so charts render in line mode. */
export function swingsToSeries(swings: ApiSwing[] | null | undefined): Candle[] {
  return (swings ?? []).map((s) => {
    const t = swingTime(s.time);
    return { t, o: s.price, h: s.price, l: s.price, c: s.price };
  });
}

export function swingsToPoints(swings: ApiSwing[] | null | undefined): StructurePoint[] {
  return (swings ?? []).map((s) => ({
    t: swingTime(s.time),
    price: s.price,
    kind: s.label,
    major: s.label.length === 2,
  }));
}

const swingTime = (iso: string) => iso.slice(0, 16).replace("T", " ");

const levelPrice = (l: ApiLevel | null | undefined) => (typeof l?.price === "number" ? l.price : null);

export function toMarketStructure(raw: ApiMarketStructure): MarketStructure {
  const tfs = raw.timeframes ?? {};
  const timeframes: TimeframeRead[] = STRUCTURE_TFS.filter((k) => tfs[k]).map((k) => {
    const tf = tfs[k]!;
    const seller = levelPrice(tf.levels?.seller_level);
    const buyer = levelPrice(tf.levels?.buyer_level);
    return {
      tf: TF_LABEL[k],
      bias: titleCase(tf.bias ?? "—"),
      note: [
        seller !== null ? `Seller ${seller.toFixed(2)}` : null,
        buyer !== null ? `Buyer ${buyer.toFixed(2)}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    };
  });

  const primary = tfs["4h"] ?? tfs["1h"];

  const details: { label: string; value: string }[] = [
    { label: "Direction", value: titleCase(raw.direction ?? "—") },
    { label: "Structure quality", value: raw.quality ?? "—" },
    ...Object.entries(raw.quality_factors ?? {}).map(([k, v]) => ({
      label: k.replace(/_/g, " ").replace(/^(\w)/, (m) => m.toUpperCase()),
      value: v ? "Yes" : "No",
    })),
    { label: "Break confirmed close", value: raw.break?.close != null ? raw.break.close.toFixed(2) : "—" },
    { label: "Break time", value: raw.break?.time ? swingTime(raw.break.time) : "—" },
    ...Object.entries(raw.data_available ?? {}).map(([k, v]) => ({
      label: `${k} data`,
      value: v ? "Available" : "Unavailable",
    })),
  ];

  return {
    status: raw.structure_status ?? "—",
    timeframes,
    sellerLevel: levelPrice(primary?.levels?.seller_level) ?? 0,
    buyerLevel: levelPrice(primary?.levels?.buyer_level) ?? 0,
    sellerLevels: (raw.seller_levels ?? []).map(toLevelRow),
    buyerLevels: (raw.buyer_levels ?? []).map(toLevelRow),
    phase: {
      breakState: raw.break_status ?? raw.advanced?.["indication"] ?? "—",
      correction: raw.pullback_status ?? raw.advanced?.["correction"] ?? "—",
      continuation: raw.continuation_status ?? raw.advanced?.["continuation"] ?? "—",
    },
    outlook: raw.explanation ? splitSentences(raw.explanation) : [],
    details,
    eventRisk: "",
    candles: [],
    points: [],
  };
}

const toLevelRow = (l: ApiLevel) => ({
  timeframe: l.timeframe ?? "—",
  price: l.price,
  label: l.label ?? "",
});

const splitSentences = (s: string) =>
  s
    .split(/(?<=\.)\s+/)
    .map((x) => x.trim())
    .filter(Boolean);

/* -------------------------------------------------------------------- news */

export function toNews(raw: ApiEvents | null | undefined): NewsItem[] {
  return (raw?.company_news ?? []).map((n) => ({
    headline: n.title,
    source: n.publisher ?? "",
    when: n.published ? formatWhen(n.published) : "",
    why: "",
    url: n.url ?? undefined,
  }));
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
