import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const headingColor = '#fffce1',
      templatingColor = '#ec9e6f';

export const customSyntaxHighlighting = syntaxHighlighting(HighlightStyle.define([
  { tag: t.heading1, color: headingColor },
  { tag: t.heading2, color: headingColor },
  { tag: t.heading3, color: headingColor },
  { tag: t.heading4, color: headingColor },
  { tag: t.heading5, color: headingColor },
  { tag: t.heading6, color: headingColor },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.special(t.bracket), color: templatingColor, fontWeight: 'bold' },
]));