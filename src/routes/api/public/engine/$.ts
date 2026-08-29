import { createFileRoute } from "@tanstack/react-router";
import { engineUrl } from "@/lib/api/upstream";

/**
 * Same-origin passthrough to the EquityLens FastAPI engine.
 *
 * It adds no logic of its own: the path, query, method and body are forwarded
 * verbatim and the engine's status/body are returned unchanged. This exists
 * purely because the engine does not send Access-Control-Allow-Origin for this
 * app's origins, so direct browser calls are blocked by CORS.
 */
async function proxy({ request, params }: { request: Request; params: { _splat?: string } }) {
  const upstream = `${engineUrl()}/${params._splat ?? ""}${new URL(request.url).search}`;

  const init: RequestInit = {
    method: request.method,
    headers: {
      Accept: "application/json",
      ...(request.headers.get("content-type") ? { "Content-Type": request.headers.get("content-type")! } : {}),
    },
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  try {
    const res = await fetch(upstream, init);
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(JSON.stringify({ detail: "The research engine could not be reached." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const Route = createFileRoute("/api/public/engine/$")({
  server: {
    handlers: {
      GET: proxy,
      POST: proxy,
      PUT: proxy,
      DELETE: proxy,
    },
  },
});
