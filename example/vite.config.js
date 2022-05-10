import { defineConfig } from 'vite';
import ReactPlugin from 'vite-preset-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 1234,
  },
  plugins: [
    ReactPlugin({
      injectReact: false,
    }),
  ],
});
