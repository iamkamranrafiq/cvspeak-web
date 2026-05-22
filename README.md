# CVSpeak Web

Angular 18 (standalone, signals, SSR) — Vercel-deployable. Pure read-side; the API lives in the separate `cvspeak-api` repo.

## Stack

- Angular 18 standalone components
- Angular Universal SSR with hydration + event replay
- RxJS for HTTP, signals for component state
- SCSS design tokens (light/dark)
- Lazy-loaded routes
- Vercel Edge / Node deployment

## Run

```bash
npm install
npm start          # dev server (CSR for fast feedback)
npm run build      # production SSR build → dist/cvspeak-web
npm run serve:ssr  # serve the SSR bundle locally
```

## Project layout

```
src/
├── app/
│   ├── core/
│   │   ├── services/         api.service, seo.service, session.service, theme.service
│   │   ├── interceptors/     api-base, session-token
│   │   └── models/           api.models.ts
│   ├── shared/components/    navbar, footer, logo, file-upload, score-ring, ad-slot, not-found
│   └── features/
│       ├── home/             conversion landing
│       ├── resume-analyzer/  upload + 6-ring ATS analysis
│       ├── ats-checker/      paste-text variant
│       ├── job-match/        resume vs JD matcher
│       ├── resume-builder/   live-preview builder with print-to-PDF
│       ├── templates/        template gallery
│       ├── cover-letter/     generator
│       ├── tools/            all-tools index
│       ├── blog/             list + detail (markdown → HTML from API)
│       └── seo-pages/        programmatic SEO router (resume-examples/*, etc.)
├── styles/                   _tokens, _base, _utilities, _components
├── environments/             environment.ts + environment.production.ts
├── assets/                   logo.svg, og-default.png, …
├── index.html                meta + JSON-LD shell
├── main.ts / main.server.ts / server.ts   SSR entrypoints
```

## Ad placement rule

`<app-ad-slot variant="…" slotId="…">` is the **only** way to render ads. It is disabled until you flip `environment.production.ts → adsense.enabled = true`. By design it lives:

- between content blocks on the home page (not in the hero)
- after the article on blog/SEO pages (not inside the body)
- after results on analysis pages (not above or inside them)
- in sidebars on long pages

The component reserves layout space (`min-height`) so enabling ads later won't cause CLS hits to Core Web Vitals.

## SEO

`SeoService.apply({...})` is called from every page's `ngOnInit`:

- `<title>`, `meta description`
- OpenGraph + Twitter cards
- canonical link
- JSON-LD (FAQ, Article, Breadcrumb) via `setJsonLd()`

Server-rendered HTML is what crawlers see; client hydration follows.

## Deploy to Vercel

```bash
# from cvspeak-web/
vercel --prod
```

Or push to GitHub and connect the repo on Vercel — `vercel.json` is already configured.

Set the env var `apiBase` (or edit `environment.production.ts`) to point at your Azure VM API origin, e.g. `https://api.cvspeak.com`.
