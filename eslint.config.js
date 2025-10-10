// eslint.config.js
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';

import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import a11yPlugin from 'eslint-plugin-jsx-a11y';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(['**/vite.config.mjs']),
  {
    extends: fixupConfigRules(compat.extends('plugin:import/warnings')),

    files: ['**/*.{js,jsx,ts,tsx,css,scss,sass}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': a11yPlugin,
      prettier: prettierPlugin,
      css: cssPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: 'readonly',
      },
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    // Define custom rules
    rules: {
      // GENERAL RULES
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'always'],
      'jsx-quotes': ['error', 'prefer-single'],
      'linebreak-style': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-extra-semi': 'error',
      'no-undef': 'error',
      'no-unused-vars': 'off',
      'no-use-before-define': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: 'error',

      // REACT RULES
      // 'react-hooks/exhaustive-deps': 'error',
      // 'react-hooks/rules-of-hooks': 'error',
      // 'react/boolean-prop-naming': [
      //   'error',
      //   { rule: '^(is|has|show)[A-Z]([A-Za-z0-9]?)+' },
      // ],
      // 'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      // 'react/no-unknown-property': 'error',
      // 'react/react-in-jsx-scope': 0,
    },
  },
  {
    // Ignore specific files or directories
    ignores: ['node_modules/**', 'public/**', 'build/**', 'src/serviceWorker.js', 'dist/**'],
  },
]);
