import { API_BASE_URL, API_TIMEOUT_MS } from "./config";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { Accept: "application/json", ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
    });

    const text = await res.text();
    const body = text ? safeJson(text) : null;

    if (!res.ok) {
      const detail =
        (body && typeof body === "object" && "detail" in body ? String((body as { detail: unknown }).detail) : null) ??
        `Request failed (${res.status})`;
      throw new ApiError(detail, res.status);
    }
    return body as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("The research engine did not respond in time. Please try again.", 408);
    }
    throw new ApiError("Could not reach the research engine. Check your connection and try again.", 0);
  } finally {
    clearTimeout(timer);
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Encodes tickers such as GC=F or BTC-USD safely. */
export const encodeTicker = (ticker: string) => encodeURIComponent(ticker.trim().toUpperCase());

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
