import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'
import testingLibrary from 'eslint-plugin-testing-library'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    name: 'vanta/rules',
    rules: {
      // Unused code is a review smell, not a runtime problem — keep it out of the tree.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // `verbatimModuleSyntax` is on in tsconfig, so type-only imports must be explicit.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      // Diagnostics belong in tooling, not in shipped bundles.
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'framer-motion',
              message: "Use 'motion/react' — see .agents/05-animation-system.md.",
            },
          ],
          patterns: [
            {
              group: ['../../*'],
              message: "Reach across folders with the '@/*' alias instead of deep relative paths.",
            },
          ],
        },
      ],
    },
  },

  {
    name: 'vanta/tests',
    // vitest.setup.ts is intentionally excluded: Vitest runs with `globals: false`,
    // so Testing Library's automatic cleanup never registers and the manual
    // `afterEach(cleanup)` there is required, not redundant.
    files: ['**/*.{test,spec}.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  prettier,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
])

export default eslintConfig
