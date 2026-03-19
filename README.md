## Kitbase

Kitbase is a privacy-first collection of free online utilities (PDF, image, developer, text, calculators, and more) built with **Next.js (App Router)** and **Tailwind CSS**.

### Highlights

- **Client-side by default**: many tools run locally in your browser
- **Installable PWA**: add to home screen / install on desktop
- **Fast + modern UI**: Next.js App Router + React

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## PWA (offline + installable)

The project includes:

- `public/manifest.webmanifest`
- `public/sw.js`

Test installability/offline in a production build:

```bash
npm run build
npm run start
```

Then use Chrome DevTools → **Application** (Service Worker / Cache Storage).

## PDF compression (client-side)

PDF compression uses **Ghostscript compiled to WebAssembly** for stronger compression while preserving text/vectors.

Important:
- The Ghostscript WASM dependency is **AGPL-3.0**.
- If you deploy Kitbase publicly and users access it over the network, **AGPL requires you to provide the complete corresponding source code** to those users (commonly done by linking your public repo from the site footer).

## Environment variables

- `NEXT_PUBLIC_SOURCE_URL` (optional): URL to the public source repository (if you prefer configuring the footer via env instead of hardcoding).

## License

**GNU Affero General Public License v3.0 (AGPL-3.0)**. See [`LICENSE`](./LICENSE).

