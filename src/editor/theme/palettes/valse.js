import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const sky = '#1586d2',
      velvetRed = '#e30016',
      blackcurrant = '#1d277b',
      black = '#000',
      ashgreen = '#567973',
      pastelBlue = '#6166c1',
      lilac = '#80529e',
      purple = '#341473',
      stone = '#7d8799',
      ivory = '#abb2bf',
      offwhite = '#fdfdfd',
      mistyRose = '#f8f8f2';

const urlHash = '%23';
const warningColorHex = 'b05b00';
const errorColorHex = 'bc0000';

const invalid = '#ffffff',
      highlightBackground = 'rgba(0, 0, 0, 0.5)',
      tooltipBackground = '#353a42',
      selection = 'rgba(128, 203, 196, 0.2)';

export const summerfruitEditorTheme = EditorView.theme(
  {
    '&': {
      color: black,
      backgroundColor: offwhite
    },
    '.cm-content': {
      caretColor: blackcurrant
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: blackcurrant
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: selection },
    '.cm-panels': { backgroundColor: mistyRose, color: '#ffffff' },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff'
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: '#6199ff2f'
    },
    '.cm-activeLine': { backgroundColor: highlightBackground },
    '.cm-selectionMatch': { backgroundColor: '#aafe661a' },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: '#bad0f847',
      outline: '1px solid #515a6b'
    },
    '.cm-gutters': {
      background: '#292d3e',
      color: '#676e95',
      border: 'none'
    },
    '.cm-activeLineGutter': {
      backgroundColor: highlightBackground
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd'
    },
    '.cm-tooltip': {
      border: 'none',
      backgroundColor: tooltipBackground
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: highlightBackground,
        color: ivory
      }
    },
    '& .cm-lintRange.cm-lintRange-warning::after': {
      backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'><path d='m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0' stroke='${urlHash + warningColorHex}' fill='none' stroke-width='1.2'/></svg>")`,
    },
    '& .cm-lintRange.cm-lintRange-error::after': {
      backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'><path d='m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0' stroke='${urlHash + errorColorHex}' fill='none' stroke-width='1.2'/></svg>")`,
    },
    '& .cm-diagnostic-warning': {
      border: `1px solid #${warningColorHex}`,
      borderLeft: `5px solid #${warningColorHex}`,
      background: offwhite,
    },
    '& .cm-diagnostic-error': {
      border: `1px solid #${errorColorHex}`,
      borderLeft: `5px solid #${errorColorHex}`,
      background: offwhite
    } ,
    '& .cm-diagnostic': {
      padding: '3px 8px'
    }
  },
  { dark: false }
);

export const summerfruitSyntaxHighlighting = syntaxHighlighting(HighlightStyle.define([

  // Markdown headings
  { tag: t.heading1, color: black },
  { tag: t.heading2, color: black },
  { tag: t.heading3, color: black },
  { tag: t.heading4, color: black },
  { tag: t.heading5, color: black },
  { tag: t.heading6, color: black },

  // Feelers
  { tag: t.special(t.bracket), color: velvetRed },

  // Everything else
  { tag: t.keyword, color: lilac },
  { tag: t.operator, color: purple },
  { tag: t.special(t.variableName), color: '#eeffff' },
  { tag: t.typeName, color: lilac },
  { tag: t.atom, color: '#f78c6c' },
  { tag: t.number, color: ashgreen },
  { tag: t.bool, color: ashgreen },
  { tag: t.definition(t.variableName), color: '#82aaff' },
  { tag: t.string, color: sky },
  { tag: t.special(t.string), color: lilac },
  { tag: t.comment, color: stone },
  { tag: t.variableName, color: lilac },
  { tag: t.tagName, color: '#ff5370' },
  { tag: t.bracket, color: purple },
  { tag: t.meta, color: pastelBlue },
  { tag: t.attributeName, color: lilac },
  { tag: t.propertyName, color: lilac },
  { tag: t.className, color: '#decb6b' },
  { tag: t.invalid, color: invalid }
]));
