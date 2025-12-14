import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3009,
        host: '0.0.0.0',
        proxy: {
          // Прокси для Ollama API чтобы обойти CORS
          '/api/ollama': {
            target: env.VITE_OLLAMA_BASE_URL || 'http://192.168.50.64:11434',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
            configure: (proxy, options) => {
              proxy.on('error', (err, req, res) => {
                console.log('proxy error', err);
              });
              proxy.on('proxyReq', (proxyReq, req, res) => {
                console.log('Sending Request to Ollama:', req.method, req.url);
              });
              proxy.on('proxyRes', (proxyRes, req, res) => {
                console.log('Received Response from Ollama:', proxyRes.statusCode, req.url);
              });
            },
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
