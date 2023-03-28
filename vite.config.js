// vite.config.js
import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';

module.exports = defineConfig({
  plugins: [
    reactPlugin(),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  }
});