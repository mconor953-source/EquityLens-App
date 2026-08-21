import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelBody, PanelHeader } from "@/components/equitylens/Panel";
import { AssetHeader } from "@/components/equitylens/AssetHeader";
import { PriceChart } from "@/components/equitylens/PriceChart";
import { KeyLevels, PhasePanel, TimeframeRow } from "@/components/equitylens/StructurePanel";
import { marketStructure, structureAsset } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/market-structure")({
  head: () => ({
    meta: [
      { title: "Market Structure — EquityLens Market Intelligence" },
      {
        name: "description",
        content:
          "Multi-timeframe price structure with key buyer and seller levels across 4H, 1H, 15M and 5M reads.",
      },
      { property: "og:title", content: "Market Structure — EquityLens" },
      {
        property: "og:description",
        content: "Multi-timeframe structure analysis with buyer and seller levels, break and continuation state.",
      },
    ],
  }),
  component: MarketStructurePage,
});

function MarketStructurePage() {
  const [open, setOpen] = useState(false);
  const s = marketStructure;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Market Structure"
        subtitle="Multi-timeframe price structure and key buyer/seller levels."
        right={
          <div className="text-[12px] text-steel">
            <div>Mock data — not live market data</div>
            <div className="num text-steel-light">Research view · not trade instructions</div>
          </div>
        }
      />

      <AssetHeader asset={structureAsset} status={s.status} statusTone="warn" statusLabel="Structure" />

      <TimeframeRow structure={s} />
      <p className="text-[12px] leading-5 text-steel">
        4H and 1H establish higher-timeframe direction. 15M and 5M provide lower-timeframe confirmation.
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <Panel>
          <PanelHeader
            title="Structure Chart"
            meta={`${structureAsset.ticker} · 4H · recent major structure only`}
          />
          <PanelBody className="px-2 pb-2">
            <PriceChart
              candles={s.candles}
              mode="candle"
              height={380}
              currency={structureAsset.currency}
              points={s.points}
              levels={[
                { price: s.sellerLevel, label: "Seller level", tone: "neg" },
                { price: s.buyerLevel, label: "Buyer level", tone: "pos" },
              ]}
            />
          </PanelBody>
        </Panel>

        <div className="grid gap-4 content-start">
          <Panel>
            <PanelHeader title="Key Levels" />
            <KeyLevels structure={s} />
          </Panel>

          <Panel>
            <PanelHeader title="Current Phase" />
            <PhasePanel structure={s} />
          </Panel>

          <Panel>
            <PanelHeader title="Structure Outlook" />
            <PanelBody>
              <ul className="space-y-2">
                {s.outlook.map((line) => (
                  <li key={line} className="flex gap-2 text-[13px] leading-5 text-foreground">
                    <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-steel-light" />
                    {line}
                  </li>
                ))}
              </ul>
            </PanelBody>
          </Panel>
        </div>
      </div>

      <Panel>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="row-hover grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2.5 text-left"
        >
          <span className="eyebrow text-foreground">Advanced Structure Details</span>
          <ChevronDown
            className={cn("size-4 shrink-0 text-steel transition-transform duration-150", open && "rotate-180")}
            strokeWidth={1.7}
          />
        </button>
        {open ? (
          <dl className="grid divide-y divide-border border-t border-border md:grid-cols-2 md:divide-y-0">
            {s.details.map((d) => (
              <div
                key={d.label}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-border px-3.5 py-2.5 md:border-b"
              >
                <dt className="truncate text-[12px] text-steel">{d.label}</dt>
                <dd className="num shrink-0 text-[12px] text-foreground">{d.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Panel>

      <Panel>
        <PanelHeader title="Event Risk" meta="This week" />
        <PanelBody>
          <p className="text-[13px] leading-5 text-foreground">{s.eventRisk}</p>
        </PanelBody>
      </Panel>
    </div>
  );
}
