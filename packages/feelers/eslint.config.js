import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  build: [
    '*.cjs',
    '*.js'
  ],
  lib: [
    'lib/**/*.js'
  ],
  test: [
    'test/**/*.js'
  ]
};

export default [

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

  // lib
  ...bpmnIoPlugin.configs.recommended.map(config => {
    return {
      ...config,
      files: files.lib
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
