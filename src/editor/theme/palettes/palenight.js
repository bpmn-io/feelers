import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const ivory = '#abb2bf',
      peach = '#f07178',
      stone = '#7d8799',
      invalid = '#ffffff',
      pastelYellow = '#fffce1',
      pastelOrange = '#ec9e6f',
      raisinBlack = '#21252b',
      highlightBackground = 'rgba(0, 0, 0, 0.5)',
      background = '#292d3e',
      tooltipBackground = '#353a42',
      selection = 'rgba(128, 203, 196, 0.2)',
      cursor = '#ffcc00';

const urlHash = '%23';
const warningColorHex = 'fff890';
const errorColor = 'red';
const warningBackgroundColor = '#281e16';
const errorBackgroundColor = '#281616';

export const palenightEditorTheme = EditorView.theme(
  {
    '&': {
      color: '#ffffff',
      backgroundColor: background
    },
    '.cm-content': {
      caretColor: cursor
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: cursor
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: selection },
    '.cm-panels': { backgroundColor: raisinBlack, color: '#ffffff' },
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
      border: 'none',
      padding: '0 5px'
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
      backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'><path d='m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0' stroke='${errorColor}' fill='none' stroke-width='1.2'/></svg>")`,
    },
    '& .cm-diagnostic-warning': {
      borderLeft: `5px solid #${warningColorHex}`,
      background: warningBackgroundColor
    },
    '& .cm-diagnostic-error': {
      borderLeft: `5px solid ${errorColor}`,
      background: errorBackgroundColor
    },
    '& .cm-diagnostic': {
      borderRadius: '2px',
      padding: '3px 8px'
    }
  },
  { dark: true }
);

export const palenightSyntaxHighlighting = syntaxHighlighting(HighlightStyle.define([

  // Markdown headings
  { tag: t.heading1, color: pastelYellow },
  { tag: t.heading2, color: pastelYellow },
  { tag: t.heading3, color: pastelYellow },
  { tag: t.heading4, color: pastelYellow },
  { tag: t.heading5, color: pastelYellow },
  { tag: t.heading6, color: pastelYellow },

  // Feelers
  { tag: t.special(t.bracket), color: pastelOrange, fontWeight: 'bold' },

  // Everything else
  { tag: t.keyword, color: '#c792ea' },
  { tag: t.operator, color: '#89ddff' },
  { tag: t.special(t.variableName), color: '#eeffff' },
  { tag: t.typeName, color: '#f07178' },
  { tag: t.atom, color: '#f78c6c' },
  { tag: t.number, color: '#ff5370' },
  { tag: t.bool, color: '#ff5370' },
  { tag: t.definition(t.variableName), color: '#82aaff' },
  { tag: t.string, color: '#c3e88d' },
  { tag: t.comment, color: stone },
  { tag: t.tagName, color: '#ff5370' },
  { tag: t.bracket, color: '#a2a1a4' },
  { tag: t.meta, color: '#ffcb6b' },
  { tag: t.special(t.string), color: peach },
  { tag: t.propertyName, color: pastelOrange },
  { tag: t.variableName, color: pastelOrange },
  { tag: t.attributeName, color: peach },
  { tag: t.className, color: peach },
  { tag: t.invalid, color: invalid }
]));
