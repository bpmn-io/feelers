import { LanguageSupport } from '@codemirror/language';
import mixedParser from './mixedParser';

export const feelersMixedLanguage = new LanguageSupport(mixedParser, []);