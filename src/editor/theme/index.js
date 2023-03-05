import { customTheme, customSyntaxHighlighting } from './theme';
import { palenightEditorTheme, palenightSyntaxHighlighting } from './palettes/palenight.js';
import { basicLightTheme, basicLightHighlightStyle } from './palettes/basiclight';

const lightTheme = [ customTheme, basicLightTheme, basicLightHighlightStyle ];
const darkTheme = [ customTheme, palenightEditorTheme, customSyntaxHighlighting, palenightSyntaxHighlighting ];

export { lightTheme, darkTheme };