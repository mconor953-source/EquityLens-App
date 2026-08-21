import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Candle, StructurePoint } from "@/data/types";
import { fmtNum } from "@/lib/format";

interface Level {
  price: number;
  label: string;
  tone: "pos" | "neg";
}

/**
 * Lightweight SVG price chart (candles or line) with crosshair tooltip.
 * Rendered locally so styling stays inside the design system; data is
 * whatever the API/mock layer supplies.
 */
export function PriceChart({
  candles,
  mode = "candle",
  levels = [],
  points = [],
  height = 340,
  currency = "$",
  className,
}: {
  candles: Candle[];
  mode?: "candle" | "line";
  levels?: Level[];
  points?: StructurePoint[];
  height?: number;
  currency?: string;
  className?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 1000;
  const H = height;
  const padT = 12;
  const padB = 26;
  const padR = 62;

  const { min, max } = useMemo(() => {
    const lows = candles.map((c) => c.l);
    const highs = candles.map((c) => c.h);
    for (const l of levels) {
      lows.push(l.price);
      highs.push(l.price);
    }
    const lo = Math.min(...lows);
    const hi = Math.max(...highs);
    const pad = (hi - lo) * 0.08;
    return { min: lo - pad, max: hi + pad };
  }, [candles, levels]);

  const x = (i: number) => ((W - padR) * (i + 0.5)) / candles.length;
  const y = (p: number) => padT + ((max - p) / (max - min)) * (H - padT - padB);
  const step = (W - padR) / candles.length;
  const bw = Math.max(1.4, Math.min(step * 0.6, 9));

  const gridLines = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i <= 4; i++) out.push(min + ((max - min) * i) / 4);
    return out;
  }, [min, max]);

  const linePath = candles.map((c, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(c.c).toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L${x(candles.length - 1).toFixed(2)},${H - padB} L${x(0).toFixed(2)},${H - padB} Z`;

  const hoverCandle = hover !== null ? candles[hover] : undefined;
  const labelEvery = Math.max(1, Math.ceil(candles.length / 7));

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - rect.left) / rect.width) * W;
          const idx = Math.floor((rel / (W - padR)) * candles.length);
          setHover(idx >= 0 && idx < candles.length ? idx : null);
        }}
      >
        <defs>
          <linearGradient id="eq-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridLines.map((g) => (
          <g key={g}>
            <line
              x1={0}
              x2={W - padR}
              y1={y(g)}
              y2={y(g)}
              stroke="var(--color-border)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={W - padR + 8}
              y={y(g) + 3.5}
              fill="var(--color-steel-light)"
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {fmtNum(g, g >= 1000 ? 0 : 2)}
            </text>
          </g>
        ))}

        {candles.map((c, i) =>
          i % labelEvery === 0 ? (
            <text
              key={`t${c.t}`}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              fill="var(--color-steel-light)"
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {c.t.slice(5)}
            </text>
          ) : null,
        )}

        {mode === "line" ? (
          <>
            <path d={areaPath} fill="url(#eq-area)" />
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : (
          candles.map((c, i) => {
            const up = c.c >= c.o;
            const color = up ? "var(--color-pos)" : "var(--color-neg)";
            const top = y(Math.max(c.o, c.c));
            const bottom = y(Math.min(c.o, c.c));
            return (
              <g key={c.t}>
                <line
                  x1={x(i)}
                  x2={x(i)}
                  y1={y(c.h)}
                  y2={y(c.l)}
                  stroke={color}
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <rect
                  x={x(i) - bw / 2}
                  y={top}
                  width={bw}
                  height={Math.max(1, bottom - top)}
                  fill={up ? color : color}
                  opacity={up ? 0.85 : 0.9}
                />
              </g>
            );
          })
        )}

        {levels.map((l) => (
          <g key={l.label}>
            <line
              x1={0}
              x2={W - padR}
              y1={y(l.price)}
              y2={y(l.price)}
              stroke={l.tone === "pos" ? "var(--color-pos)" : "var(--color-neg)"}
              strokeWidth="1"
              strokeDasharray="5 4"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={6}
              y={y(l.price) - 5}
              fill={l.tone === "pos" ? "var(--color-pos)" : "var(--color-neg)"}
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.08em"
            >
              {l.label.toUpperCase()} {fmtNum(l.price, 2)}
            </text>
          </g>
        ))}

        {points.map((p) => {
          const i = candles.findIndex((c) => c.t === p.t);
          if (i < 0) return null;
          const above = p.kind === "HH" || p.kind === "LH";
          return (
            <g key={`${p.kind}${p.t}`} opacity={p.major ? 1 : 0.4}>
              <circle
                cx={x(i)}
                cy={y(p.price)}
                r={p.major ? 3 : 2}
                fill="var(--color-charcoal)"
                stroke="var(--color-card)"
                strokeWidth="1"
              />
              <text
                x={x(i)}
                y={above ? y(p.price) - 9 : y(p.price) + 15}
                textAnchor="middle"
                fill="var(--color-charcoal)"
                fontSize={p.major ? 10 : 9}
                fontWeight={p.major ? 700 : 500}
                fontFamily="var(--font-mono)"
              >
                {p.kind}
              </text>
            </g>
          );
        })}

        {hover !== null && hoverCandle ? (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={padT}
            y2={H - padB}
            stroke="var(--color-steel)"
            strokeWidth="1"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>

      {hoverCandle ? (
        <div className="pointer-events-none absolute top-2 left-2 rounded-[3px] border border-border-strong bg-card/95 px-2.5 py-1.5 text-[11px] shadow-[0_1px_2px_rgba(37,42,48,0.08)]">
          <div className="num text-steel">{hoverCandle.t}</div>
          <div className="num mt-0.5 grid grid-cols-2 gap-x-3 text-foreground">
            <span>O {currency}{fmtNum(hoverCandle.o, 2)}</span>
            <span>H {currency}{fmtNum(hoverCandle.h, 2)}</span>
            <span>L {currency}{fmtNum(hoverCandle.l, 2)}</span>
            <span>C {currency}{fmtNum(hoverCandle.c, 2)}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TimeframeSelector<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-[3px] border border-border-strong">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "num border-r border-border-strong px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 last:border-r-0",
            value === o ? "bg-charcoal text-white" : "bg-card text-steel hover:bg-surface-active",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
