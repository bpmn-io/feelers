import { LanguageSupport } from '@codemirror/language';
import language from '../../grammar/feelersLang';

export const feelersMixedLanguage = new LanguageSupport(language, []);