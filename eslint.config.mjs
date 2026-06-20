import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  ignored: [
    'dist',
    'feelers-playground/build',
    'feelers-playground/dist',
    'src/grammar/parser*.js'
  ],
  core: [
    'src/interpreter/**/*.js',
    'src/grammar/**/*.js'
  ],
  playground: [
    'feelers-playground/**/*.js',
  ],
  build: [
    '*.mjs',
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
  ...bpmnIoPlugin.configs.jsx.map(config => {
    return {
      ...config,
      files: [
        ...files.playground
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
