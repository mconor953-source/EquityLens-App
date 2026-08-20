import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelBody, PanelHeader } from "@/components/equitylens/Panel";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EquityLens Market Intelligence" },
      { name: "description", content: "Configure data sources, display preferences and research defaults in EquityLens." },
      { property: "og:title", content: "Settings — EquityLens" },
      { property: "og:description", content: "Data source, display and research defaults for EquityLens." },
    ],
  }),
  component: SettingsPage,
});

const groups = [
  {
    title: "Data",
    rows: [
      { label: "Data source", value: "Mock dataset (local)" },
      { label: "Backend endpoint", value: "Not connected" },
      { label: "Refresh interval", value: "Manual" },
    ],
  },
  {
    title: "Display",
    rows: [
      { label: "Number format", value: "Tabular, 2 dp" },
      { label: "Timezone", value: "UTC" },
      { label: "Density", value: "Compact" },
    ],
  },
  {
    title: "Research defaults",
    rows: [
      { label: "Default timeframe", value: "6M" },
      { label: "Structure timeframes", value: "4H / 1H / 15M / 5M" },
      { label: "Chart style", value: "Candlestick" },
    ],
  },
];

function SettingsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Settings" subtitle="Preferences will persist once the backend is connected." />
      <div className="grid gap-4 lg:grid-cols-3">
        {groups.map((g) => (
          <Panel key={g.title}>
            <PanelHeader title={g.title} />
            <PanelBody className="px-0 py-0">
              <dl className="divide-y divide-border">
                {g.rows.map((r) => (
                  <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2.5">
                    <dt className="truncate text-[12px] text-steel">{r.label}</dt>
                    <dd className="num shrink-0 text-[12px] text-foreground">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </PanelBody>
          </Panel>
        ))}
      </div>
    </div>
  );
}
