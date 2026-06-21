import { linter as createLinter } from '@codemirror/lint';
import { cmFeelersLinter } from './cmFeelersLinter.js';

export const feelersLinter = createLinter(cmFeelersLinter());