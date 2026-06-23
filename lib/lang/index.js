import { LanguageSupport } from '@codemirror/language';
import { createMixedLanguage } from './mixedParser.js';

/**
 * @param { import('@lezer/common').Parser } [hostParser=null]
 *
 * @return { LanguageSupport }
 */
export function feelersLanguage(hostParser) {
  return new LanguageSupport(createMixedLanguage(hostParser), []);
}