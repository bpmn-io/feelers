import { closeBrackets } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { setDiagnosticsEffect } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, tooltips, lineNumbers } from '@codemirror/view';

import { parser as markdownParser } from '@lezer/markdown';
import { createFeelersLanguageSupport } from './language';

import lint from './lint';
import { lightTheme, darkTheme } from '@bpmn-io/cm-theme';

/**
 * Creates a Feelers editor in the supplied container.
 *
 * @param {Object} config Configuration options for the Feelers editor.
 * @param {DOMNode} [config.container] The DOM node that will contain the editor.
 * @param {DOMNode|String} [config.tooltipContainer] The DOM node or CSS selector string for the tooltip container.
 * @param {String} [config.hostLanguage] The host language for the editor (e.g., 'markdown').
 * @param {Object} [config.hostLanguageParser] A custom parser for the host language.
 * @param {Function} [config.onChange] Callback function that is called when the editor's content changes.
 * @param {Function} [config.onKeyDown] Callback function that is called when a key is pressed within the editor.
 * @param {Function} [config.onLint] Callback function that is called when linting messages are available.
 * @param {Object} [config.contentAttributes] Additional attributes to set on the editor's content element.
 * @param {Boolean} [config.readOnly] Set to true to make the editor read-only.
 * @param {String} [config.value] Initial value of the editor.
 * @param {Boolean} [config.enableGutters] Set to true to enable gutter decorations (e.g., line numbers).
 * @param {Boolean} [config.darkMode] Set to true to use the dark theme for the editor.
 *
 * @returns {Object} editor An instance of the FeelersEditor class.
 */
export default function FeelersEditor({
  container,
  tooltipContainer,
  hostLanguage,
  hostLanguageParser,
  onChange = () => { },
  onKeyDown = () => { },
  onLint = () => { },
  contentAttributes = { },
  readOnly = false,
  value = '',
  enableGutters = false,
  singleLine = false,
  darkMode = false
}) {

  const changeHandler = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      onChange(update.state.doc.toString());
    }
  });

  const lintHandler = EditorView.updateListener.of((update) => {
    const diagnosticEffects = update.transactions
      .flatMap(t => t.effects)
      .filter(effect => effect.is(setDiagnosticsEffect));

    if (!diagnosticEffects.length) {
      return;
    }

    const messages = diagnosticEffects.flatMap(effect => effect.value);

    onLint(messages);
  });

  const contentAttributesExtension = EditorView.contentAttributes.of(contentAttributes);

  const keyHandler = EditorView.domEventHandlers(
    {
      keydown: onKeyDown
    }
  );

  if (typeof tooltipContainer === 'string') {
    // eslint-disable-next-line no-undef
    tooltipContainer = document.querySelector(tooltipContainer);
  }

  const tooltipLayout = tooltipContainer ? tooltips({
    tooltipSpace: function() {
      return tooltipContainer.getBoundingClientRect();
    }
  }) : [];

  const _getHostLanguageParser = (hostLanguage) => {
    switch (hostLanguage) {
    case 'markdown':
      return markdownParser;
    default:
      return null;
    }
  };

  const feelersLanguageSupport = createFeelersLanguageSupport(hostLanguageParser || hostLanguage && _getHostLanguageParser(hostLanguage));

  const extensions = [
    bracketMatching(),
    changeHandler,
    contentAttributesExtension,
    closeBrackets(),
    indentOnInput(),
    keyHandler,
    keymap.of([
      ...defaultKeymap,
    ]),
    feelersLanguageSupport,
    lint,
    lintHandler,
    tooltipLayout,
    darkMode ? darkTheme : lightTheme,
    ...(enableGutters ? [

      // todo: adjust folding boundaries first foldGutter(),
      lineNumbers()
    ] : []),
    ...(singleLine ? [
      EditorState.transactionFilter.of(tr => tr.newDoc.lines > 1 ? [] : tr)
    ] : [])
  ];

  if (readOnly) {
    extensions.push(EditorView.editable.of(false));
  }

  if (singleLine && value) {
    value = value.toString().split('\n')[0];
  }

  this._cmEditor = new EditorView({
    state: EditorState.create({
      doc: value,
      extensions: extensions
    }),
    parent: container
  });

  return this;
}

/**
 * Replaces the content of the Editor
 *
 * @param {String} value
 */
FeelersEditor.prototype.setValue = function(value) {
  this._cmEditor.dispatch({
    changes: {
      from: 0,
      to: this._cmEditor.state.doc.length,
      insert: value,
    }
  });
};

/**
 * Sets the focus in the editor.
 */
FeelersEditor.prototype.focus = function(position) {
  const cmEditor = this._cmEditor;

  // the Codemirror `focus` method always calls `focus` with `preventScroll`,
  // so we have to focus + scroll manually
  cmEditor.contentDOM.focus();
  cmEditor.focus();

  if (typeof position === 'number') {
    const end = cmEditor.state.doc.length;
    cmEditor.dispatch({ selection: { anchor: position <= end ? position : end } });
  }
};

/**
 * Returns the current selection ranges. If no text is selected, a single
 * range with the start and end index at the cursor position will be returned.
 *
 * @returns {Object} selection
 * @returns {Array} selection.ranges
 */
FeelersEditor.prototype.getSelection = function() {
  return this._cmEditor.state.selection;
};
