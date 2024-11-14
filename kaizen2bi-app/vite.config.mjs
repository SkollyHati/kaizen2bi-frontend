import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        noDiscovery: true
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3005/",
                changeOrigin: true,
                secure: false,
                rewrite: (p) => p.replace(/^\//, ""),
            },
        },
        cors: false,
    },
    preview: {
        proxy: {
            "/api": {
                target: "http://localhost:3005/",
                changeOrigin: true,
                secure: false,
                rewrite: (p) => p.replace(/^\/api/, ""),
            },
        },
        cors: false,
    },
});
