export function fmtNum(n: number, dp?: number) {
  const decimals = dp ?? (Math.abs(n) >= 1000 ? 2 : Math.abs(n) >= 10 ? 2 : 4);
  return n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtPct(n: number) {
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}

export type Tone = "pos" | "neg" | "warn" | "neutral" | "brand";

export function changeTone(n: number): Tone {
  if (n > 0.0001) return "pos";
  if (n < -0.0001) return "neg";
  return "neutral";
}

export function toneText(tone: Tone) {
  switch (tone) {
    case "pos":
      return "text-pos";
    case "neg":
      return "text-neg";
    case "warn":
      return "text-warn";
    case "brand":
      return "text-brand";
    default:
      return "text-foreground";
  }
}

export function ratingTone(rating: string): Tone {
  switch (rating) {
    case "Strong Buy":
    case "Buy":
    case "Bullish":
    case "Uptrend":
      return "pos";
    case "Sell":
    case "Strong Sell":
    case "Bearish":
    case "Downtrend":
      return "neg";
    case "Developing":
    case "Watching":
      return "warn";
    default:
      return "neutral";
  }
}

export function riskTone(level: string): Tone {
  const l = level.toLowerCase();
  if (l === "high") return "neg";
  if (l === "moderate" || l === "medium") return "warn";
  if (l === "low") return "pos";
  return "neutral";
}
