import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelHeader } from "@/components/equitylens/Panel";
import { WatchlistTable } from "@/components/equitylens/WatchlistTable";
import { RetryButton, SkeletonRows, StateMessage } from "@/components/equitylens/States";
import { assetQuery, watchlistQuery } from "@/lib/api/queries";
import { toWatchlistRow } from "@/lib/api/adapters";
import { addWatchlistTicker, removeWatchlistTicker } from "@/lib/api/mutations";
import type { ApiAsset } from "@/lib/api/types";

export const Route = createFileRoute("/watchlists")({
  head: () => ({
    meta: [
      { title: "Watchlists — EquityLens Market Intelligence" },
      {
        name: "description",
        content: "Track assets with technical ratings, market structure state and event risk in one compact view.",
      },
      { property: "og:title", content: "Watchlists — EquityLens" },
      { property: "og:description", content: "Track ratings, structure and event risk across the assets you follow." },
    ],
  }),
  component: WatchlistsPage,
});

function WatchlistsPage() {
  const lists = useQuery(watchlistQuery());

  return (
    <div className="space-y-4">
      <PageHeader title="Watchlists" subtitle="Assets you follow, with research state attached." />

      {lists.isPending ? (
        <Panel>
          <SkeletonRows rows={6} />
        </Panel>
      ) : lists.isError ? (
        <Panel>
          <StateMessage
            tone="error"
            title="Watchlists unavailable"
            detail={(lists.error as Error).message}
            action={<RetryButton onClick={() => void lists.refetch()} />}
          />
        </Panel>
      ) : lists.data && Object.keys(lists.data).length ? (
        Object.entries(lists.data).map(([name, tickers]) => <ListPanel key={name} name={name} tickers={tickers} />)
      ) : (
        <Panel>
          <StateMessage title="No watchlists" detail="The engine returned no watchlists." />
        </Panel>
      )}
    </div>
  );
}

function ListPanel({ name, tickers }: { name: string; tickers: string[] }) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const results = useQueries({ queries: tickers.map((t) => assetQuery(t)) });
  const resolved = tickers
    .map((ticker, i) => ({ ticker, result: results[i] }))
    .filter((x) => Boolean(x.result?.data));
  const loadingTickers = tickers.filter((_, i) => results[i]?.isPending);
  const failedTickers = tickers.filter((_, i) => results[i]?.isError);
  const rows = resolved.map((x) => toWatchlistRow(x.result!.data as ApiAsset));


  const invalidate = () => void qc.invalidateQueries({ queryKey: ["watchlist"] });

  const add = useMutation({
    mutationFn: (ticker: string) => addWatchlistTicker({ watchlist_name: name, ticker }),
    onSuccess: () => {
      setText("");
      setError(null);
      invalidate();
    },
    onError: (e: Error) => setError(e.message),
  });

  const remove = useMutation({
    mutationFn: (ticker: string) => removeWatchlistTicker({ watchlist_name: name, ticker }),
    onSuccess: invalidate,
    onError: (e: Error) => setError(e.message),
  });

  return (
    <Panel>
      <PanelHeader
        title={name}
        meta={`${tickers.length} assets · live`}
        actions={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const t = text.trim().toUpperCase();
              if (t) add.mutate(t);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add ticker"
              aria-label={`Add ticker to ${name}`}
              className="num w-[130px] rounded-[3px] border border-border-strong bg-card px-2 py-1 text-[11px] text-foreground placeholder:text-steel-light focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                const t = text.trim().toUpperCase();
                if (t) add.mutate(t);
              }}
              disabled={add.isPending}
              className="rounded-[3px] border border-border-strong bg-card px-2 py-1 text-[11px] font-medium text-steel transition-colors duration-150 hover:bg-surface-active disabled:opacity-50"
            >
              {add.isPending ? "Adding…" : "Add"}
            </button>
          </form>
        }
      />
      {error ? <p className="border-b border-border px-3.5 py-2 text-[12px] text-neg">{error}</p> : null}
      {rows.length ? (
        <div className="overflow-x-auto">
          <WatchlistTable
            rows={rows}
            className="min-w-[780px]"
            onRemove={(t) => remove.mutate(t)}
            removingTicker={remove.isPending ? (remove.variables ?? null) : null}
          />
        </div>
      ) : loadingTickers.length ? (
        <SkeletonRows rows={Math.min(loadingTickers.length, 6)} />
      ) : tickers.length ? null : (
        <StateMessage title="Empty list" detail="Add a ticker to start tracking research state." />
      )}

      {rows.length && loadingTickers.length ? <SkeletonRows rows={Math.min(loadingTickers.length, 6)} /> : null}

      {failedTickers.length ? (
        <p className="border-t border-border px-3.5 py-2 text-[11px] text-steel">
          Unavailable:{" "}
          <span className="num text-foreground">{failedTickers.join(", ")}</span>
          {" — the engine did not return data for these assets."}
        </p>
      ) : null}

      {!rows.length && !loadingTickers.length && failedTickers.length ? (
        <StateMessage
          tone="error"
          title="No assets available"
          detail="None of the tickers in this list returned data from the engine."
        />
      ) : null}

    </Panel>
  );
}
