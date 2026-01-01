import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        server: {
            port: 3009,
            host: '0.0.0.0',
            allowedHosts: true,
            proxy: {
                '/api/ollama': {
                    target: env.VITE_OLLAMA_BASE_URL || 'http://192.168.50.250:11434',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
                    configure: (proxy) => {
                        proxy.on('proxyReq', (proxyReq) => {
                            proxyReq.removeHeader('origin')
                            proxyReq.removeHeader('referer')
                        })
                        proxy.on('proxyRes', (proxyRes) => {
                            proxyRes.headers['Access-Control-Allow-Origin'] = '*'
                            proxyRes.headers['Access-Control-Allow-Headers'] = '*'
                            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
                        })
                    },
                },
            },
        },
        plugins: [react()],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.'),
            }
        }
    };
});
