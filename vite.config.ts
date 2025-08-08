import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Provide stable no-op stubs for Spark plugins (package not public)
const sparkPlugin = () => ({ name: 'spark-stub', enforce: 'pre' }) as unknown as PluginOption;
const createIconImportProxy = () => ({ name: 'icon-proxy-stub' }) as unknown as PluginOption;

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = process.env.PROJECT_ROOT || __dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      // Proxy for arXiv export API to avoid CORS during development
      '/proxy': {
        target: 'http://export.arxiv.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy/, ''),
      },
    },
  },
});
