// vite.config.js
import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';

module.exports = defineConfig({
  base: '',
  plugins: [
    reactPlugin(),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    strictPort: true,
  }
});
