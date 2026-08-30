/**
 * Write operations exposed by the engine. Bodies mirror the FastAPI schemas
 * exactly (WatchlistAddRequest, IdeaCreateRequest, IdeaUpdateRequest).
 */
import { api, encodeTicker } from "./client";

export interface WatchlistAddInput {
  watchlist_name: string;
  ticker: string;
}

export const addWatchlistTicker = (input: WatchlistAddInput) =>
  api.post<unknown>("/api/watchlist", { watchlist_name: input.watchlist_name, ticker: input.ticker.toUpperCase() });

export const removeWatchlistTicker = (input: WatchlistAddInput) =>
  api.del<unknown>(
    `/api/watchlist/${encodeTicker(input.ticker)}?watchlist_name=${encodeURIComponent(input.watchlist_name)}`,
  );

export interface IdeaCreateInput {
  asset_class: string;
  ticker: string;
  stance: string;
  horizon: string;
  conviction: number;
  status?: string;
  title?: string | null;
  thesis?: string | null;
}

export const createIdea = (input: IdeaCreateInput) => api.post<unknown>("/api/investment-ideas", input);

export const updateIdea = (id: string, patch: Record<string, unknown>) =>
  api.put<unknown>(`/api/investment-ideas/${encodeURIComponent(id)}`, patch);

export const deleteIdea = (id: string) => api.del<unknown>(`/api/investment-ideas/${encodeURIComponent(id)}`);
