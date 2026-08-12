import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  // Resolves the `@/*` alias straight from tsconfig.json — no plugin needed.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      reportsDirectory: 'coverage',
      // Coverage gates apply to the logic layers only. Presentational sections are
      // verified by component tests without a hard numeric gate — see
      // .agents/06-testing.md ("Co mierzymy pokryciem").
      include: ['src/lib/**/*.ts', 'src/hooks/**/*.ts'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/index.ts'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
})
