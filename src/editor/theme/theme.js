import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

export const customSyntaxHighlighting = syntaxHighlighting(HighlightStyle.define([
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
]));

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
  '& .cm-lintPoint::after': {
    bottom: '-2px'
  }
});