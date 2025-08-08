# arXiv Research Hub

Explore recent arXiv papers by topic or full-text search. Built with React, Vite, and Tailwind CSS.

## 🧩 Tech stack

- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 and Radix UI (components in `src/components/ui`)
- Icons: Phosphor Icons (`@phosphor-icons/react`)
- Fetches arXiv (RSS/Atom) with client-side in-memory caching

## 📁 Project structure

```text
src/
  App.tsx              # Main page: topic tabs and search
  main.tsx             # React bootstrap
  styles/              # Tailwind theme and tokens
  components/          # UI and views (cards, empty/error states, etc.)
  lib/
    api.ts             # fetchPapers + feed parsing + 10‑min cache
    queryBuilder.ts    # Builds arXiv URL and uses dev proxy
    types.ts           # Types (ArxivPaper, QueryParams, TOPICS, etc.)
```

Notes:

- In development, requests go through `/proxy` (configured in `vite.config.ts`) to avoid CORS. In production we call `https://export.arxiv.org` directly.
- Spark Vite plugins are stubbed as no-ops in `vite.config.ts` so the project builds without private packages.

## ▶️ Run locally

Requirements: Node.js 18 or 20.

PowerShell (Windows):

```powershell
npm install
npm run dev
```

Vite will print the URL (for example, <http://localhost:5173> or 5174). Stop with Ctrl+C.

Build and preview:

```powershell
npm run build
npm run preview
```

## 🔍 How it works (summary)

- `fetchPapers(params)` builds the URL with `buildArxivQuery` and hits the arXiv endpoint.
- The XML feed is parsed (DOMParser) into `ArxivPaper[]` and cached for 10 minutes in a `Map` (keyed by topic/search/page).
- Dev: requests go to `/proxy/api/query` and Vite forwards them to `http://export.arxiv.org` (avoids CORS).
- Prod: uses `https://export.arxiv.org` directly to avoid mixed content.

## 🚀 Deploy to Azure Static Web Apps (SWA)

This repo already includes a GitHub Actions workflow:

- Path: `.github/workflows/azure-static-web-apps-*.yml`
- Trigger: every push to `main`
- Output directory: `dist` (Vite build)

Typical steps:

1. Ensure the secret `AZURE_STATIC_WEB_APPS_API_TOKEN_...` exists in GitHub → Settings → Secrets and variables → Actions.

1. Commit and push to `main`:

```powershell
git add -A
git commit -m "chore: deploy"
git push origin main
```

1. Open the Actions tab in GitHub and inspect the “Azure Static Web Apps CI/CD” workflow run.

Optional configuration file:

- `staticwebapp.config.json` (included) enables SPA fallback to `index.html` for client-side routes.

## 🛠️ Troubleshooting

### 1) CORS in development

- Use `npm run dev` (it relies on the `/proxy`).
- If you modified `vite.config.ts`, ensure `server.proxy['/proxy']` targets `http://export.arxiv.org`.

### 2) CORS / Mixed content in production

- The app uses `https://export.arxiv.org`. If you force `http://`, the browser may block mixed content.

### 3) Blank screen

- Open the browser Console and copy the first red error. Common issues:
  - Importing a non-existent icon (use valid names from `@phosphor-icons/react`).
  - Import path using alias `@` not resolving (check `resolve.alias` in `vite.config.ts`).

### 4) Port already in use

- Vite picks another port automatically and prints it in the terminal. Open the printed URL.

### 5) Install or build issues (Windows)

- If you see “Cannot find module @rollup/rollup-win32-x64-msvc” or cannot delete `node_modules`:

```powershell
# close servers/editors that may lock files, then
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install
```

### 6) 404 routes in SWA

- SWA should redirect to `index.html`. If not, this repo’s `staticwebapp.config.json` enforces the SPA fallback.

## 📜 Useful scripts

- `npm run dev`       → Vite dev server
- `npm run build`     → Compiles to `dist` (Vite)
- `npm run preview`   → Serves `dist` locally
- `npm run lint`      → Linter (ESLint)

## 🤝 Contributing

PRs are welcome. Please ensure the project builds and runs locally before submitting.

---

MIT License
