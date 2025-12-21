import { defineConfig } from 'vitest/config';
import { preview } from '@vitest/browser-preview';

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          include: ['test/node/**/*.spec.js'],
          environment: 'node',
          name: 'node'
        }
      },
      {
        extends: true,
        test: {
          browser: {
            enabled: true,
            provider: preview(),
            instances: [{
              browser: 'firefox',
            }],
          },
          include: ['test/browser/**/*.spec.js'],
          name: 'browser'
        },
      }
    ],

    globals: true
  }
});