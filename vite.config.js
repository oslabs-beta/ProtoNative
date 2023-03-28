// vite.config.js
const { defineConfig } = require('vite');
const reactPlugin = require('@vitejs/plugin-react');

module.exports = defineConfig({
  plugins: [reactPlugin()],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  }
});