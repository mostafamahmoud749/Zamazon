import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    setupFiles: ['./server/integration/setup.ts'],
  },
  resolve: {
    alias: {
      '@': rootDirectory,
    },
  },
});
