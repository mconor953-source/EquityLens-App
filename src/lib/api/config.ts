/**
 * Central, environment-friendly API configuration.
 *
 * By default requests go to the same-origin passthrough route
 * (/api/public/engine) which forwards to the FastAPI engine — the engine's CORS
 * policy rejects this app's browser origin, so direct calls are not possible.
 *
 * Set VITE_EQUITYLENS_API_URL to call an engine host directly from the browser
 * (only works once that host allows this origin). Set EQUITYLENS_API_URL to
 * change the upstream host behind the passthrough. No other file should
 * hardcode a backend URL.
 */
const DEFAULT_API_BASE_URL = "/api/public/engine";

const configured = import.meta.env["VITE_EQUITYLENS_API_URL"] as string | undefined;

export const API_BASE_URL = (configured?.trim() || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

/** Longest we wait on a single request (Render free tier cold starts ~60s). */
export const API_TIMEOUT_MS = 90_000;
