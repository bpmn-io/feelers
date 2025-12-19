import js from '@eslint/js';
import bpmnPlugin from 'eslint-plugin-bpmn-io';
import mochaPlugin from 'eslint-plugin-mocha';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const baseParserOptions = {
  ecmaVersion: 2022,
  sourceType: 'module'
};

const bpmnRules = bpmnPlugin.configs.recommended?.rules ?? {};
const mochaRules = bpmnPlugin.configs.mocha?.rules ?? {};

export default [
  {
    ignores: [
      'dist/**',
      'feelers-playground/build/**',
      'feelers-playground/dist/**',
      'src/grammar/parser*.js',
      '.github/**',
      'karma.conf.js',
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
      'test/spec/**/*.js'
    ],
    languageOptions: {
      parserOptions: {
        ...baseParserOptions
      },
      globals: {
        ...globals.mocha,
        ...globals.browser,
        sinon: 'readonly',
        expect: 'readonly',
        FeelEditor: 'readonly'
      }
    },
    plugins: {
      mocha: mochaPlugin
    },
    rules: {
      ...mochaRules,
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  },

  // config files
  {
    files: [
      'rollup.config.js'
    ],
    languageOptions: {
      parserOptions: {
        ...baseParserOptions,
        sourceType: 'commonjs'
      },
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: [
      'test/testBundle.js'
    ],
    languageOptions: {
      parserOptions: {
        ...baseParserOptions,
        sourceType: 'commonjs'
      },
      globals: {
        require: 'readonly'
      }
    }
  }
];
