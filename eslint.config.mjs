import js from '@eslint/js';
import bpmnPlugin from 'eslint-plugin-bpmn-io';
import vitestPlugin from 'eslint-plugin-vitest';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const baseParserOptions = {
  ecmaVersion: 2022,
  sourceType: 'module'
};

const bpmnRules = bpmnPlugin.configs.recommended?.rules ?? {};
const vitestRules = vitestPlugin.configs.recommended?.rules ?? {};

export default [
  {
    ignores: [
      'dist/**',
      'feelers-playground/build/**',
      'feelers-playground/dist/**',
      'src/grammar/parser*.js',
      '.github/**',
      'eslint.config.mjs'
    ]
  },
  js.configs.recommended,
  
  // source files
  {
    files: [
      'src/**/*.js',
      'feelers-playground/src/**/*.js'
    ],
    languageOptions: {
      parserOptions: {
        ...baseParserOptions,
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      'bpmn-io': bpmnPlugin,
      react: reactPlugin,
      import: importPlugin
    },
    rules: {
      ...bpmnRules,

      'import/no-default-export': 'error',
      'import/default': 'error',
      'import/named': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'off',
      'no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrors: 'none'
    }]
    }
  },

  // test files
  {
    files: [
      'test/browser/**/*.js',
      'test/node/**/*.js'
    ],
    languageOptions: {
      parserOptions: {
        ...baseParserOptions
      },
      globals: {
        ...globals.vitest,
        ...globals.browser
      }
    },
    plugins: {
      vitest: vitestPlugin
    },
    rules: {
      ...vitestRules,
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'vitest/expect-expect': 'off'
    }
  },

  // test setup files
  {
    files: [
      'test/setup.js',
      'test/testContainer.js'
    ],
    languageOptions: {
      parserOptions: {
        ...baseParserOptions
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        document: 'readonly'
      }
    }
  },

  // config files
  {
    files: [
      'vite.config.js',
      'vitest.config.js'
    ],
    languageOptions: {
      parserOptions: {
        ...baseParserOptions
      },
      globals: {
        ...globals.node,
        __dirname: 'readonly'
      }
    }
  }
];
