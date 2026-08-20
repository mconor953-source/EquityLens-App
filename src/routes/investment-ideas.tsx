import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelBody, PanelHeader } from "@/components/equitylens/Panel";

export const Route = createFileRoute("/investment-ideas")({
  head: () => ({
    meta: [
      { title: "Investment Ideas — EquityLens Market Intelligence" },
      {
        name: "description",
        content: "Screened investment ideas with technical ratings, financial health and event risk context.",
      },
      { property: "og:title", content: "Investment Ideas — EquityLens" },
      { property: "og:description", content: "Screened investment ideas backed by research, structure and risk signals." },
    ],
  }),
  component: InvestmentIdeasPage,
});

function InvestmentIdeasPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Investment Ideas" subtitle="Screened ideas ranked by research quality and risk." />
      <Panel>
        <PanelHeader title="Idea Engine" meta="Not yet wired" />
        <PanelBody className="py-14">
          <div className="mx-auto max-w-md text-center">
            <Lightbulb className="mx-auto size-5 text-steel" strokeWidth={1.6} />
            <h3 className="mt-3 text-[15px] font-semibold text-foreground">Ideas arrive with the research engine</h3>
            <p className="mt-1.5 text-[13px] leading-5 text-steel">
              This page will list ranked ideas from <span className="num">/api/investment-ideas</span>, combining
              technical ratings, financial health scoring and event risk.
            </p>
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}
