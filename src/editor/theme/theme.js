import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
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

const urlHash = '%23';
const warningColorHex = 'fff890';
const errorColor = 'red';
const warningBackgroundColor = '#281e16';
const errorBackgroundColor = '#281616';

export const customTheme = EditorView.theme({
  '& .cm-lintRange': {
    position: 'relative',
  },
  '& .cm-lintRange::after': {
    content: '""',
    width: '100%',
    position: 'absolute',
    left: '0px',
    bottom: '-2px',
    height: '3px',
    backgroundRepeat: 'repeat-x',
  },
  '& .cm-lintRange.cm-lintRange-warning, & .cm-lintRange.cm-lintRange-error': {
    backgroundImage: 'none',
  },
  '& .cm-lintRange.cm-lintRange-warning::after': {
    backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'><path d='m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0' stroke='${urlHash + warningColorHex}' fill='none' stroke-width='1.2'/></svg>")`,
  },
  '& .cm-lintRange.cm-lintRange-error::after': {
    backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'><path d='m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0' stroke='${errorColor}' fill='none' stroke-width='1.2'/></svg>")`,
  },
  '& .cm-lintPoint::after': {
    bottom: '-2px'
  },
  '& .cm-diagnostic': {
    borderRadius: '2px',
    padding: '3px 8px'
  },
  '& .cm-diagnostic-warning': {
    borderLeft: `5px solid #${warningColorHex}`,
    background: warningBackgroundColor
  },
  '& .cm-diagnostic-error': {
    borderLeft: `5px solid ${errorColor}`,
    background: errorBackgroundColor
  }
});