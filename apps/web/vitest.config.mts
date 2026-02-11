import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@cosmos/ui': path.resolve(__dirname, '../../packages/cosmos-ui/src'),
      '@cosmos/agents': path.resolve(__dirname, '../../packages/cosmos-agents/src'),
      '@cosmos/pipeline': path.resolve(__dirname, '../../packages/cosmos-pipeline/src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['app/**', 'components/**', 'lib/**'],
      exclude: ['**/*.test.*', '**/__tests__/**', '**/ui/**'],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
  },
});
