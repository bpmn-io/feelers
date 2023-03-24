import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// Colors from https://www.nordtheme.com/docs/colors-and-palettes
// Polar Night
const base00 = '#1f2b36', // black
      base01 = '#2f3d58', // dark grey
      base02 = '#364056',
      base03 = '#404a5c'; // grey

// Snow Storm
const base04 = '#c5d1e5', // grey
      base05 = '#d9e0f5', // off white
      base06 = '#eaf1ff'; // white

// Frost
const base07 = '#7ab6aa', // moss green
      base08 = '#6cbfd8', // ice blue
      base09 = '#699bca', // water blue
      base0A = '#4d6e9d'; // deep blue

// Aurora
const base0B = '#ad4d5a', // red
      base0C = '#c2765d', // orange
      base0D = '#debd71', // yellow
      base0E = '#93b57e', // green
      base0F = '#a36b9c'; // purple

const base0BUrl = '%23ad4d5a',
      base0DUrl = '%23debd71';

const invalid = '#b40000',
      darkBackground = base06,
      highlightBackground = darkBackground,
      background = '#ffffff',
      tooltipBackground = base05,
      selection = darkBackground,
      cursor = base01;

// / The editor theme styles for Basic Light.
export const basicLightTheme = EditorView.theme(
  {
    '&': {
      color: base00,
      backgroundColor: background
    },

    '.cm-content': {
      caretColor: cursor
    },

    '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: selection },

    '.cm-panels': { backgroundColor: darkBackground, color: base03 },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: `1px solid ${base03}`
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: base05
    },

    '.cm-activeLine': { backgroundColor: highlightBackground },
    '.cm-selectionMatch': { backgroundColor: base05 },

    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      outline: `1px solid ${base04}`
    },

    '&.cm-focused .cm-matchingBracket': {
      backgroundColor: base06
    },

    '.cm-gutters': {
      backgroundColor: '#f3f7fe',
      color: '#52668d',
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
        color: base03
      }
    },
    '& .cm-lintRange.cm-lintRange-warning::after': {
      backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'><path d='m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0' stroke='${base0DUrl}' fill='none' stroke-width='1.2'/></svg>")`,
    },
    '& .cm-lintRange.cm-lintRange-error::after': {
      backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'><path d='m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0' stroke='${base0BUrl}' fill='none' stroke-width='1.2'/></svg>")`,
    },
    '& .cm-diagnostic-warning': {
      border: `1px solid ${base0D}`,
      borderLeft: `5px solid ${base0D}`,
      background: base06,
    },
    '& .cm-diagnostic-error': {
      border: `1px solid ${base0B}`,
      borderLeft: `5px solid ${base0B}`,
      background: base06
    },
    '& .cm-diagnostic': {
      padding: '3px 8px'
    }
  },
  { dark: false }
);

// / The highlighting style for code in the Basic Light theme.
export const basicLightHighlightStyle = syntaxHighlighting(HighlightStyle.define([
  { tag: t.special(t.bracket), color: base0B, fontWeight: 'bold' },
  { tag: t.keyword, color: base0A },
  {
    tag: [ t.name, t.deleted, t.character, t.propertyName, t.macroName, t.variableName ],
    color: base0B
  },
  { tag: [ t.function(t.variableName) ], color: base0A },
  { tag: [ t.labelName ], color: base09 },
  {
    tag: [ t.color, t.constant(t.name), t.standard(t.name) ],
    color: base0A
  },
  { tag: [ t.definition(t.name), t.separator ], color: base0E },
  { tag: [ t.brace ], color: base07 },
  {
    tag: [ t.annotation ],
    color: invalid
  },
  {
    tag: [ t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace ],
    color: base08
  },
  {
    tag: [ t.typeName, t.className, t.attributeName ],
    color: base0D
  },
  {
    tag: [ t.operator, t.operatorKeyword ],
    color: base0E
  },
  {
    tag: [ t.tagName ],
    color: base0F
  },
  {
    tag: [ t.angleBracket, t.squareBracket ],
    color: base0C
  },
  {
    tag: [ t.regexp ],
    color: base0A
  },
  {
    tag: [ t.quote ],
    color: base01
  },
  { tag: [ t.string ], color: base0C },
  {
    tag: t.link,
    color: base07,
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
  {
    tag: [ t.url, t.escape, t.special(t.string) ],
    color: base0C
  },
  { tag: [ t.meta ], color: base08 },
  { tag: [ t.comment ], color: base02, fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold', color: base0A },
  { tag: t.emphasis, fontStyle: 'italic', color: base0A },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.heading, fontWeight: 'bold', color: base03 },
  { tag: t.special(t.heading1), fontWeight: 'bold', color: base01 },
  {
    tag: [ t.heading1, t.heading2, t.heading3, t.heading4 ],
    fontWeight: 'bold',
    color: base03
  },
  {
    tag: [ t.heading5, t.heading6 ],
    color: base03
  },
  { tag: [ t.atom, t.bool, t.special(t.variableName) ], color: base0C },
  {
    tag: [ t.processingInstruction, t.inserted ],
    color: base03
  },
  {
    tag: [ t.contentSeparator ],
    color: base0D
  },
  { tag: t.invalid, color: base02, borderBottom: `1px dotted ${invalid}` }
]));

export const basicLight = [
  basicLightTheme,
  basicLightHighlightStyle
];