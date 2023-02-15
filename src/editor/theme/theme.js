import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

export const theme = EditorView.theme({
  '& .cm-content': {
    padding: '0px',
  },
  '& .cm-line': {
    padding: '0px',
  },
  '&.cm-editor.cm-focused': {
    outline: 'none',
  },
  '& .cm-completionInfo ul': {
    margin: 0,
    paddingLeft: '15px'
  },
  '& .cm-completionInfo pre': {
    marginBottom: 0,
    whiteSpace: 'pre-wrap'
  },
  '& .cm-completionInfo p': {
    marginTop: 0,
  },
  '& .cm-completionInfo p:not(:last-of-type)': {
    marginBottom: 0,
  },
  '& .cm-strong' : {
    fontWeight: 'bold'
  }
});

const feelTagMappings = [
  { tag: t.variableName, class: 'variableName' },
  { tag: t.name, class: 'variableName' },
  { tag: t.number, class: 'number' },
  { tag: t.string, class: 'string' },
  { tag: t.bool, class: 'bool' },
  { tag: t.function(t.variableName), class: 'function' },
  { tag: t.function(t.special(t.variableName)), class: 'function' },
  { tag: t.controlKeyword, class: 'control' },
  { tag: t.operatorKeyword, class: 'control' }
];

// Some of the tags are unmapped, but they're here for reference / quick modification
const markdownTagMappings = [

  // { tag: t.quote, class: 'quote' },
  // { tag: t.contentSeparator, class: 'contentSeparator' },
  { tag: t.heading1, class: 'heading' },
  { tag: t.heading2, class: 'heading' },
  { tag: t.heading3, class: 'heading' },
  { tag: t.heading4, class: 'heading' },
  { tag: t.heading5, class: 'heading' },
  { tag: t.heading6, class: 'heading' },

  // { tag: t.comment, class: 'comment' },
  // { tag: t.escape, class: 'escape' },
  // { tag: t.character, class: 'character' },
  { tag: t.emphasis, class: 'emphasis' },
  { tag: t.strong, class: 'strong' },

  // { tag: t.link, class: 'link' },
  // { tag: t.list, class: 'list' },
  { tag: t.monospace, class: 'monospace' },
  { tag: t.url, class: 'url' },

  // { tag: t.processingInstruction, class: 'processingInstruction' },
  // { tag: t.labelName, class: 'labelName' },
  // { tag: t.content, class: 'content' },

  // only shared tag between feel and markdown lezer definitions
  // { tag: t.string, class: 'string' },
];

const feelersTagMapping = [
  { tag: t.special(t.bracket), class: 'feelers' },
];


export const syntaxClasses = syntaxHighlighting(
  HighlightStyle.define([ ...feelTagMappings, ...markdownTagMappings, ...feelersTagMapping ])
);

export const baseTheme = EditorView.baseTheme({
  '& .variableName': {
    color: '#10f'
  },
  '& .number': {
    color: '#164'
  },
  '& .string': {
    color: '#a11'
  },
  '& .bool': {
    color: '#219'
  },
  '& .function': {
    color: '#aa3731',
    fontWeight: 'bold'
  },
  '& .control': {
    color: '#708'
  },
  '& .heading': {
    color: '#009',
    fontWeight: 'bold'
  },
  '& .strong': {
    fontWeight: 'bold'
  },
  '& .emphasis': {
    fontStyle: 'italic',
  },
  '& .monospace': {
    fontStyle: 'italic',
    letterSpacing: '0.05em',
  },
  '& .feelers': {
    color: '#ff6c00'
  },
});
