import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelBody, PanelHeader } from "@/components/equitylens/Panel";
import { StatusIndicator } from "@/components/equitylens/StatusIndicator";
import { RetryButton, SkeletonRows, StateMessage } from "@/components/equitylens/States";
import { investmentIdeasQuery } from "@/lib/api/queries";
import { createIdea, deleteIdea, updateIdea, type IdeaCreateInput } from "@/lib/api/mutations";
import { ratingTone } from "@/lib/format";
import type { ApiInvestmentIdea } from "@/lib/api/types";

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

const STATUSES = ["Watching", "Active", "Closed"] as const;
const STANCES = ["Long", "Short", "Neutral"] as const;
const HORIZONS = ["1-4 weeks", "1-3 months", "3-6 months", "6-12 months"] as const;
const ASSET_CLASSES = ["Equity", "Commodity", "FX", "Index", "Crypto"] as const;

const inputCls =
  "rounded-[3px] border border-border-strong bg-card px-2 py-1 text-[12px] text-foreground placeholder:text-steel-light focus:outline-none";

const ideaId = (i: ApiInvestmentIdea) => String(i.id ?? i.idea_id ?? "");

function InvestmentIdeasPage() {
  const qc = useQueryClient();
  const ideas = useQuery(investmentIdeasQuery());
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<IdeaCreateInput>({
    asset_class: "Equity",
    ticker: "",
    stance: "Long",
    horizon: "1-3 months",
    conviction: 3,
    status: "Watching",
    title: "",
    thesis: "",
  });

  const invalidate = () => void qc.invalidateQueries({ queryKey: ["investment-ideas"] });

  const create = useMutation({
    mutationFn: (input: IdeaCreateInput) =>
      createIdea({
        ...input,
        ticker: input.ticker.trim().toUpperCase(),
        title: input.title?.trim() || null,
        thesis: input.thesis?.trim() || null,
      }),
    onSuccess: () => {
      setError(null);
      setForm((f) => ({ ...f, ticker: "", title: "", thesis: "" }));
      invalidate();
    },
    onError: (e: Error) => setError(e.message),
  });

  const patch = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) => updateIdea(id, body),
    onSuccess: () => {
      setError(null);
      invalidate();
    },
    onError: (e: Error) => setError(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteIdea(id),
    onSuccess: () => {
      setError(null);
      invalidate();
    },
    onError: (e: Error) => setError(e.message),
  });

  const rows = ideas.data ?? [];

  return (
    <div className="space-y-4">
      <PageHeader title="Investment Ideas" subtitle="Screened ideas ranked by research quality and risk." />

      <Panel>
        <PanelHeader title="New Idea" meta="Saved to the research engine" />
        <PanelBody className="py-3.5">
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.ticker.trim()) {
                setError("Enter a ticker.");
                return;
              }
              create.mutate(form);
            }}
          >
            <Field label="Ticker">
              <input
                value={form.ticker}
                onChange={(e) => setForm({ ...form, ticker: e.target.value })}
                placeholder="AAPL"
                aria-label="Ticker"
                className={`num w-[110px] ${inputCls}`}
              />
            </Field>
            <Field label="Asset class">
              <select
                value={form.asset_class}
                onChange={(e) => setForm({ ...form, asset_class: e.target.value })}
                aria-label="Asset class"
                className={`w-[130px] ${inputCls}`}
              >
                {ASSET_CLASSES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
            <Field label="Stance">
              <select
                value={form.stance}
                onChange={(e) => setForm({ ...form, stance: e.target.value })}
                aria-label="Stance"
                className={`w-[110px] ${inputCls}`}
              >
                {STANCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Horizon">
              <select
                value={form.horizon}
                onChange={(e) => setForm({ ...form, horizon: e.target.value })}
                aria-label="Horizon"
                className={`w-[140px] ${inputCls}`}
              >
                {HORIZONS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </Field>
            <Field label="Conviction">
              <input
                type="number"
                min={1}
                max={5}
                value={form.conviction}
                onChange={(e) => setForm({ ...form, conviction: Number(e.target.value) })}
                aria-label="Conviction"
                className={`num w-[80px] ${inputCls}`}
              />
            </Field>
            <Field label="Title">
              <input
                value={form.title ?? ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Optional"
                aria-label="Title"
                className={`w-[190px] ${inputCls}`}
              />
            </Field>
            <Field label="Thesis">
              <input
                value={form.thesis ?? ""}
                onChange={(e) => setForm({ ...form, thesis: e.target.value })}
                placeholder="Optional"
                aria-label="Thesis"
                className={`w-[240px] ${inputCls}`}
              />
            </Field>
            <button
              type="submit"
              disabled={create.isPending}
              className="rounded-[3px] border border-border-strong bg-card px-2.5 py-1 text-[12px] font-medium text-steel transition-colors duration-150 hover:bg-surface-active disabled:opacity-50"
            >
              {create.isPending ? "Saving…" : "Add idea"}
            </button>
          </form>
          {error ? <p className="mt-2 text-[12px] text-neg">{error}</p> : null}
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title="Idea Log" meta={ideas.data ? `${rows.length} ideas · live` : "Engine output"} />
        {ideas.isPending ? (
          <SkeletonRows rows={5} />
        ) : ideas.isError ? (
          <StateMessage
            tone="error"
            title="Investment ideas unavailable"
            detail={(ideas.error as Error).message}
            action={<RetryButton onClick={() => void ideas.refetch()} />}
          />
        ) : rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="eyebrow px-3.5 py-2 font-semibold">Ticker</th>
                  <th className="eyebrow px-3.5 py-2 font-semibold">Idea</th>
                  <th className="eyebrow px-3.5 py-2 font-semibold">Stance</th>
                  <th className="eyebrow px-3.5 py-2 font-semibold">Horizon</th>
                  <th className="eyebrow px-3.5 py-2 text-right font-semibold">Conviction</th>
                  <th className="eyebrow px-3.5 py-2 font-semibold">Status</th>
                  <th className="eyebrow px-3.5 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((i) => {
                  const id = ideaId(i);
                  const stance = (i["stance"] as string | null) ?? "—";
                  return (
                    <tr key={id} className="row-hover border-b border-border/60 last:border-b-0">
                      <td className="num px-3.5 py-2 font-medium text-foreground">
                        {i.ticker ?? i.symbol ?? "—"}
                      </td>
                      <td className="px-3.5 py-2 text-steel">
                        <span className="text-foreground">{(i["title"] as string | null) ?? "—"}</span>
                        {i.thesis ? <span className="block text-[12px] text-steel">{i.thesis}</span> : null}
                      </td>
                      <td className="px-3.5 py-2">
                        <StatusIndicator label={stance} tone={ratingTone(stance)} />
                      </td>
                      <td className="px-3.5 py-2 text-steel">{(i["horizon"] as string | null) ?? "—"}</td>
                      <td className="num px-3.5 py-2 text-right text-steel">
                        {i["conviction"] != null ? String(i["conviction"]) : "—"}
                      </td>
                      <td className="px-3.5 py-2">
                        <select
                          value={i.status ?? "Watching"}
                          disabled={patch.isPending}
                          onChange={(e) => patch.mutate({ id, body: { status: e.target.value } })}
                          aria-label={`Status for ${i.ticker ?? id}`}
                          className={`w-[120px] ${inputCls}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3.5 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => remove.mutate(id)}
                          disabled={remove.isPending}
                          className="rounded-[3px] border border-border-strong bg-card px-2 py-1 text-[11px] font-medium text-steel transition-colors duration-150 hover:bg-surface-active disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <StateMessage
            title="No investment ideas yet"
            detail="The engine's idea log is empty. Add an idea above and it is stored by the research engine."
          />
        )}
      </Panel>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="eyebrow text-[10px] font-semibold text-steel">{label}</span>
      {children}
    </label>
  );
}
