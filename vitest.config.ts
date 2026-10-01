import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Separate from vite.config.ts: the Cloudflare and TanStack Start plugins
// expect a Workers runtime, which unit tests do not need.
export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] })],
  resolve: {
    alias: {
      // Server modules read bindings from here; tests only exercise their pure helpers.
      'cloudflare:workers': fileURLToPath(
        new URL('./src/test/cloudflare-workers.ts', import.meta.url),
      ),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
