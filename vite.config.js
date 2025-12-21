import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['cjs', 'es'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js'
    },
    rollupOptions: {
      external: [
        '@bpmn-io/cm-theme',
        '@bpmn-io/feel-lint',
        '@codemirror/autocomplete',
        '@codemirror/commands',
        '@codemirror/language',
        '@codemirror/lint',
        '@codemirror/state',
        '@codemirror/view',
        '@lezer/common',
        '@lezer/highlight',
        '@lezer/lr',
        '@lezer/markdown',
        'feelin',
        'lezer-feel',
        'min-dom'
      ]
    },
    outDir: 'dist'
  }
});
