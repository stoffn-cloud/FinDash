import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import yahooFinance from 'yahoo-finance2'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'yahoo-finance-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url.startsWith('/api/quotes')) {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const symbols = url.searchParams.get('symbols');
            if (symbols) {
              try {
                const yf = new yahooFinance({ suppressNotices: ['yahooSurvey'] });
                const result = await yf.quote(symbols.split(','));
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } catch (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: error.message }));
              }
            } else {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'No symbols provided' }));
            }
            return;
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
