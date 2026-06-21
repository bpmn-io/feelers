import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  ignored: [
    'dist',
    'lib/grammar/parser*.js'
  ],
  core: [
    'lib/interpreter/**/*.js',
    'lib/grammar/**/*.js'
  ],
  build: [
    '*.cjs',
    '*.js'
  ],
  test: [
    'test/**/*.js'
  ]
};


export default [
  {
    ignores: files.ignored
  },

  // build
  ...bpmnIoPlugin.configs.node.map(config => {
    return {
      ...config,
      files: files.build
    };
  }),
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2025
      }
    },
    files: files.build
  },

  // lib - core
  ...bpmnIoPlugin.configs.recommended.map(config => {
    return {
      ...config,
      files: files.core,
    };
  }),

  // lib - browser
  ...bpmnIoPlugin.configs.browser.map(config => {
    return {
      ...config,
      ignores: [
        ...files.core,
        ...files.build
      ]
    };
  }),

  // all source files
  ...bpmnIoPlugin.configs.esm.map(config => {
    return {
      ...config,
      ignores: [
        ...files.build
      ]
    };
  }),

  // tests
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: files.test
    };
  })
];
