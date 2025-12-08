import { linter } from '@codemirror/lint';
import { cmFeelersLinter } from './cmFeelersLinter.js';

export const feelersLinter = linter(cmFeelersLinter());