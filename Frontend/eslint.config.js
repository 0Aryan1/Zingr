import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Without these, `no-unused-vars` can't see identifiers that are only
      // referenced from JSX — `<Icon />`, `<motion.div />`, imported pages.
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' },
      ],
      // shadcn/ui primitives intentionally export a component plus its cva
      // variants from one file; the same applies to a context + its hook.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
])
