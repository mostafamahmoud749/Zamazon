import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  oxc: {
    jsx: { runtime: 'automatic' },
  },
  test: {
    setupFiles: ['./server/integration/setup.ts'],
    testTimeout: 30_000,
  },
  resolve: {
    alias: {
      '@': rootDirectory,
    },
  },
});
