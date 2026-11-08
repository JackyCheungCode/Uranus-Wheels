import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: { include: ['@emdzej/bimmerz-ui'] },
  server: { proxy: { '/api': { target: 'https://uranus-wheels.xg-y.workers.dev', changeOrigin: true } } },
});
