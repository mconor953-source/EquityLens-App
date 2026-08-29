/**
 * Upstream FastAPI engine host — server side only.
 *
 * The browser cannot call this host directly: the engine's CORS policy does not
 * allow the Lovable preview/published origins (preflight returns
 * "Disallowed CORS origin"). Requests are therefore forwarded through the
 * same-origin passthrough route at /api/public/engine/*, which returns the
 * engine's real responses untouched.
 *
 * Override with the EQUITYLENS_API_URL environment variable.
 */
export const DEFAULT_ENGINE_URL = "https://equitylens-k86w.onrender.com";

export function engineUrl() {
  return (process.env["EQUITYLENS_API_URL"]?.trim() || DEFAULT_ENGINE_URL).replace(/\/+$/, "");
}
