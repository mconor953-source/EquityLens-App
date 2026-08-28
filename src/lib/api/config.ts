/**
 * Central, environment-friendly API configuration.
 *
 * Override at build/run time with VITE_EQUITYLENS_API_URL — no other file
 * should hardcode the backend host.
 */
const DEFAULT_API_BASE_URL = "https://equitylens-k86w.onrender.com";

const configured = import.meta.env["VITE_EQUITYLENS_API_URL"] as string | undefined;

export const API_BASE_URL = (configured?.trim() || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

/** Longest we wait on a single request (the engine can cold-start). */
export const API_TIMEOUT_MS = 45_000;
