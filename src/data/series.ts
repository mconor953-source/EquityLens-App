import type { Candle } from "./types";

/**
 * Deterministic pseudo-random price series used ONLY to render realistic
 * looking mock charts. This is presentation filler, not analysis: the real
 * OHLC data will come from the FastAPI engine.
 */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function mockCandles(opts: {
  seed: number;
  count: number;
  start: number;
  end: number;
  volatility?: number;
  startDate?: string;
  stepDays?: number;
}): Candle[] {
  const { seed, count, start, end, volatility = 0.012, startDate = "2026-02-02", stepDays = 1 } = opts;
  const rand = rng(seed);
  const drift = (end - start) / (count - 1);
  const out: Candle[] = [];
  let close = start;
  const base = new Date(startDate + "T00:00:00Z").getTime();

  for (let i = 0; i < count; i++) {
    const target = start + drift * i;
    const noise = (rand() - 0.5) * 2 * volatility * start;
    const wave = Math.sin(i / 6.5) * volatility * start * 0.9;
    const open = close;
    close = target + noise + wave;
    const high = Math.max(open, close) + rand() * volatility * start * 0.6;
    const low = Math.min(open, close) - rand() * volatility * start * 0.6;
    out.push({
      t: new Date(base + i * stepDays * 86400000).toISOString().slice(0, 10),
      o: round(open),
      h: round(high),
      l: round(low),
      c: round(close),
    });
  }
  return out;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
