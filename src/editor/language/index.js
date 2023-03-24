import { LanguageSupport } from '@codemirror/language';
import { createMixedLanguage } from './mixedParser';

export const createFeelersLanguageSupport = (hostLanguageParser) => new LanguageSupport(createMixedLanguage(hostLanguageParser), []);