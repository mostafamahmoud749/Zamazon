import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    setupFiles: ['./server/e2e/setup.ts'],
  },
  resolve: {
    alias: {
      '@': rootDirectory,
    },
  },
});
