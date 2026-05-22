# Deploy CVSpeak Web to Vercel

## One-time setup

1. Push this folder to a new GitHub repo (e.g. `cvspeak-web`).
2. Go to https://vercel.com/new → Import your repo.
3. Framework preset: **Other** (the `vercel.json` in the repo handles routing).
4. Build & dev settings (auto-detected, override only if needed):
   - **Install command**: `npm install`
   - **Build command**:  `npm run build`
   - **Output directory**: `dist/cvspeak-web`
5. **Environment variables** → none required at the moment (API base URL is baked at build time via `environment.production.ts`).
6. **Production domain** → `cvspeak.com` and `www.cvspeak.com`.

## Pointing at the API

Edit `src/environments/environment.production.ts`:

```ts
apiBase: 'https://api.cvspeak.com'
```

Re-deploy. Done.

## Sitemap

The sitemap is served by the API at `/sitemap.xml`. The `vercel.json` rewrite maps the frontend path `/sitemap.xml` to `/api/sitemap` — that route doesn't exist yet on Vercel-only, so the cleanest production setup is:

- Submit `https://api.cvspeak.com/sitemap.xml` directly to Google Search Console, **or**
- Add a tiny Vercel Serverless Function `api/sitemap.ts` that proxies to the backend.

## Enabling ads after monetisation

When AdSense is approved:

1. `environment.production.ts` → `adsense.enabled = true` and set `clientId`.
2. Add the AdSense script tag once in `index.html` (only when enabled):

   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX" crossorigin="anonymous"></script>
   ```

3. Add real `slotId` values to each `<app-ad-slot>` occurrence.

No layout shift — the AdSlot component reserves vertical space upfront.
