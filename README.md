# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Deploying to Netlify (from GitHub)

The build is TanStack Start + Nitro. `vite.config.ts` pins Nitro's `netlify`
preset automatically when `NETLIFY=true` (set by Netlify CI), so no manual
preset flag is needed.

Netlify settings (also committed in `netlify.toml`):

- **Build command:** `bun run build`
- **Publish directory:** `dist`  ← not `dist/client`; the Netlify preset writes
  the static client straight into `dist`
- **Functions:** auto-detected from `.netlify/functions-internal/` (SSR handler)
- **Node version:** 22

Optional environment variable: `EQUITYLENS_API_URL` overrides the upstream host
behind the `/api/public/engine/*` passthrough (defaults to the Render engine).

Local checks:

```sh
bun run build            # Lovable/Cloudflare target
NETLIFY=true bun run build   # Netlify target (outputs dist + .netlify)
```
