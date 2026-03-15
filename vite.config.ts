import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    {
      name: 'local-model-upload',
      configureServer(server) {
        server.middlewares.use('/api/upload-model', (req: any, res: any) => {
          if (req.method === 'POST') {
            try {
              // Extract name from query string
              const baseUrl = `http://${req.headers.host || 'localhost'}`;
              // use req.originalUrl to ensure we get the full path to parse query
              const url = new URL(req.originalUrl || req.url || '/', baseUrl);
              let filename = url.searchParams.get('name') || `model-${Date.now()}.glb`;
              
              // Sanitize filename to prevent directory traversal
              filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

              const publicModelsDir = path.resolve(process.cwd(), 'public/models');
              if (!fs.existsSync(publicModelsDir)) {
                fs.mkdirSync(publicModelsDir, { recursive: true });
              }

              const writeStream = fs.createWriteStream(path.join(publicModelsDir, filename));
              
              req.pipe(writeStream);

              req.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ url: `/models/${filename}` }));
              });

              req.on('error', (err) => {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              });
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          } else {
            res.statusCode = 405;
            res.end();
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(process.cwd(), './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
