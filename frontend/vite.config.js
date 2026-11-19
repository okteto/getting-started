import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The dev server of the Development Container: it listens on port 80, the
  // port of the frontend Service, and accepts the hosts of the Okteto
  // endpoints. The Ingress sends the requests to /api to the api service.
  server: {
    host: true,
    port: 80,
    strictPort: true,
    allowedHosts: process.env.OKTETO_DOMAIN ? [`.${process.env.OKTETO_DOMAIN}`] : [],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
});
