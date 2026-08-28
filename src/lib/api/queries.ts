import { queryOptions } from "@tanstack/react-query";
import { api, encodeTicker } from "./client";
import type { ApiAsset, ApiEvents, ApiInvestmentIdea, ApiMarketStructure, ApiResearch, ApiWatchlist } from "./types";

const base = { staleTime: 60_000, retry: 1 } as const;

export const healthQuery = () => queryOptions({ queryKey: ["health"], queryFn: () => api.get<{ status: string }>("/api/health"), ...base });

export const assetQuery = (ticker: string) =>
  queryOptions({
    queryKey: ["asset", ticker],
    queryFn: () => api.get<ApiAsset>(`/api/asset/${encodeTicker(ticker)}`),
    enabled: Boolean(ticker),
    ...base,
  });

export const researchQuery = (ticker: string) =>
  queryOptions({
    queryKey: ["research", ticker],
    queryFn: () => api.get<ApiResearch>(`/api/research/${encodeTicker(ticker)}`),
    enabled: Boolean(ticker),
    ...base,
  });

export const structureQuery = (ticker: string) =>
  queryOptions({
    queryKey: ["market-structure", ticker],
    queryFn: () => api.get<ApiMarketStructure>(`/api/market-structure/${encodeTicker(ticker)}`),
    enabled: Boolean(ticker),
    ...base,
  });

export const eventsQuery = (ticker: string) =>
  queryOptions({
    queryKey: ["events", ticker],
    queryFn: () => api.get<ApiEvents>(`/api/events/${encodeTicker(ticker)}`),
    enabled: Boolean(ticker),
    ...base,
  });

export const watchlistQuery = () =>
  queryOptions({ queryKey: ["watchlist"], queryFn: () => api.get<ApiWatchlist>("/api/watchlist"), ...base });

export const investmentIdeasQuery = () =>
  queryOptions({
    queryKey: ["investment-ideas"],
    queryFn: () => api.get<ApiInvestmentIdea[]>("/api/investment-ideas"),
    ...base,
  });
