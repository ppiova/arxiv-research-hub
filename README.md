
# arXiv Research Hub

[English version](./README.en.md)

Explora papers recientes de arXiv por tópicos o búsqueda de texto. Proyecto en React + Vite + Tailwind.


## 🧩 Stack

- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 y Radix UI (componentes en `src/components/ui`)
- Iconos: Phosphor Icons (`@phosphor-icons/react`)
- Fetch a arXiv (RSS/Atom) con cache en memoria del navegador

## 📁 Estructura principal

```text
src/
	App.tsx              # Página principal, tabs de tópicos y búsqueda
	main.tsx             # Bootstrap React
	styles/              # Tema y tokens Tailwind
	components/          # UI y vistas (tarjetas, estados vacíos/errores, etc.)
	lib/
		api.ts             # fetchPapers + parseo del feed y cache (10min)
		queryBuilder.ts    # Construcción de la URL de arXiv y proxy en dev
		types.ts           # Tipos (ArxivPaper, QueryParams, TOPICS, etc.)
```

Notas:

- En desarrollo usamos un proxy `/proxy` (configurado en `vite.config.ts`) para evitar CORS. En producción se llama directo a `https://export.arxiv.org`.
- Se dejaron stubs no-op de los plugins de Spark en `vite.config.ts` para que el proyecto compile sin dependencias privadas.

## ▶️ Ejecutar localmente

Requisitos: Node.js 18 o 20.

PowerShell (Windows):

```powershell
npm install
npm run dev
```

Vite mostrará la URL (por ejemplo, <http://localhost:5173> o 5174). Para detener: Ctrl+C.

Build y previsualización:

```powershell
npm run build
npm run preview
```

## 🔍 Cómo funciona (resumen)

- `fetchPapers(params)` arma la URL con `buildArxivQuery` y consulta el endpoint de arXiv.
- Se parsea el feed XML (DOMParser) a `ArxivPaper[]` y se cachea en un `Map` durante 10 minutos (clave derivada de topic/búsqueda/página).
- En dev: las requests van a `/proxy/api/query` y Vite las reenvía a `http://export.arxiv.org` (evita CORS).
- En prod: se usa `https://export.arxiv.org` directamente para evitar mixed content.

## 🚀 Deploy a Azure Static Web Apps (SWA)

Este repo ya incluye un workflow de GitHub Actions:

- Ruta: `.github/workflows/azure-static-web-apps-*.yml`
- Trigger: cada push a `main`
- Output configurado: `dist` (lo que genera Vite)

Pasos típicos:

1. Asegúrate de tener el secreto `AZURE_STATIC_WEB_APPS_API_TOKEN_...` en GitHub → Settings → Secrets and variables → Actions.

1. Haz commit y push a `main`:

```powershell
git add -A
git commit -m "chore: deploy"
git push origin main
```

1. Ve a la pestaña Actions del repo y abre el workflow “Azure Static Web Apps CI/CD” para ver el estado del deploy.

Archivo opcional de configuración:

- `staticwebapp.config.json` (incluido) asegura fallback SPA a `index.html` en rutas de cliente.

## 🛠️ Troubleshooting

### 1) Error de CORS en desarrollo

- Asegúrate de ejecutar con `npm run dev` (usa el proxy `/proxy`).
- Si cambiaste `vite.config.ts`, verifica que exista la sección `server.proxy['/proxy']` hacia `http://export.arxiv.org`.

### 2) CORS / Mixed content en producción

- Se usa `https://export.arxiv.org`. Si forzaste `http://`, cambiará a mixed content y el navegador bloqueará.

### 3) Pantalla en blanco

- Abre la consola del navegador y copia el primer error rojo. Errores comunes:
	- Import de íconos inexistentes (usa nombres válidos de `@phosphor-icons/react`).
	- Ruta de import con alias `@` mal resuelta (revisa `resolve.alias` en `vite.config.ts`).

### 4) Puerto ocupado

- Vite elige otro puerto automáticamente y lo muestra en la terminal. Abre la URL indicada.

### 5) Fallas al instalar o compilar (Windows)

- Si ves “Cannot find module @rollup/rollup-win32-x64-msvc” o no se borra `node_modules`:

```powershell
# cierra servidores/editores que bloqueen archivos y luego
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install
```

### 6) Rutas que devuelven 404 en SWA

- SWA debería redirigir a `index.html`. Si no, el `staticwebapp.config.json` de este repo fuerza el fallback.

## 📜 Scripts útiles

- `npm run dev`       → Vite dev server
- `npm run build`     → Compila a `dist` (Vite)
- `npm run preview`   → Sirve `dist` localmente
- `npm run lint`      → Linter (ESLint)

## 🤝 Contribuir

PRs bienvenidos. Antes de enviar, valida que el proyecto compila y corre localmente.

---

MIT License
