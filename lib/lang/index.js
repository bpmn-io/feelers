import { LanguageSupport } from '@codemirror/language';
import { createMixedLanguage } from './mixedParser.js';

/**
 * @param { import('@lezer/lr').LRParser } [hostParser=null]
 *
 * @return { LanguageSupport }
 */
export function feelersLanguage(hostParser) {
  return new LanguageSupport(createMixedLanguage(hostParser), []);
}