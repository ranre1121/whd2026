import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    // Dev-only; the plugin strips the devtools from production builds.
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    react(),
    // Recompresses PNG/JPG/SVG (including public/) at build time.
    ViteImageOptimizer({
      includePublic: true,
      png: { quality: 80 },
      jpg: { quality: 80 },
      svg: { multipass: true },
    }),
  ],
});
