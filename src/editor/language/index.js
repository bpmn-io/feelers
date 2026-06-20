import { LanguageSupport } from '@codemirror/language';
import { createMixedLanguage } from './mixedParser';

/**
 * @param { import('@lezer/lr').LRParser } [hostParser=null]
 *
 * @return { LanguageSupport }
 */
export const createFeelersLanguageSupport = (hostParser) => new LanguageSupport(createMixedLanguage(hostParser), []);