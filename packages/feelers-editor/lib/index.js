import { closeBrackets } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { setDiagnosticsEffect } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, tooltips, lineNumbers } from '@codemirror/view';

import { parser as markdownParser } from '@lezer/markdown';

import { feelersLinter } from '@bpmn-io/feelers-lint';
import { feelersLanguage } from '@bpmn-io/lang-feelers';
import { feelLight, feelDark } from '@bpmn-io/cm-theme';

import mitt from 'mitt';

/**
 * @typedef { import('@codemirror/lint').Diagnostic } Diagnostic
 */

/**
 * @template { Record<import('mitt').EventType, unknown> } E
 *
 * @typedef { import('mitt').Emitter<E> } Emitter
 */

/**
 * @typedef { {
 *   'lint': { diagnostics: Diagnostic[] }
 * } } EventMap
 */

/**
 * Creates a Feelers editor in the supplied container.
 *
 * @param {Object} config Configuration options for the Feelers editor.
 * @param {Element} [config.container] The DOM node that will contain the editor.
 * @param {Element|String} [config.tooltipContainer] The DOM node or CSS selector string for the tooltip container.
 * @param {String} [config.hostLanguage] The host language for the editor (e.g., 'markdown').
 * @param {import('@lezer/common').Parser} [config.hostLanguageParser] A custom parser for the host language.
 * @param {Function} [config.onChange] Callback function that is called when the editor's content changes.
 * @param {(event: KeyboardEvent, view: import('@codemirror/view').EditorView) => boolean | void} [config.onKeyDown] Callback function that is called when a key is pressed within the editor.
 * @param {(diagnostics: Diagnostic[]) => void} [config.onLint] Callback function that is called when linting messages are available.
 * @param {Record<string, string>} [config.contentAttributes] Additional attributes to set on the editor's content element.
 * @param {Boolean} [config.readOnly] Set to true to make the editor read-only.
 * @param {String} [config.value] Initial value of the editor.
 * @param {Boolean} [config.enableGutters] Set to true to enable gutter decorations (e.g., line numbers).
 * @param {Boolean} [config.singleLine] Set to true to limit the editor to a single line.
 * @param {Boolean} [config.lineWrap] Set to true to enable line wrapping.
 * @param {Boolean} [config.darkMode] Set to true to use the dark theme for the editor.
 *
 * @returns {Object} editor An instance of the FeelersEditor class.
 */
export function FeelersEditor({
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
  lineWrap = false,
  darkMode = false
}) {

  /**
   * @type { Emitter<EventMap> }
   */
  this._events = mitt();

  this.on('lint', ({ diagnostics }) => onLint(diagnostics));

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

    const diagnostics = diagnosticEffects.flatMap(effect => effect.value);

    this._events.emit('lint', { diagnostics });
  });

  const contentAttributesExtension = EditorView.contentAttributes.of(contentAttributes);

  const keyHandler = EditorView.domEventHandlers(
    {
      keydown: onKeyDown
    }
  );

  if (typeof tooltipContainer === 'string') {
    tooltipContainer = document.querySelector(tooltipContainer) || undefined;
  }

  const _tooltipEl = /** @type {Element | undefined} */ (tooltipContainer);
  const tooltipLayout = _tooltipEl ? tooltips({
    tooltipSpace: function() {
      return _tooltipEl.getBoundingClientRect();
    }
  }) : [];

  const _getHostLanguageParser = (/** @type {string} */ hostLanguage) => {
    switch (hostLanguage) {
    case 'markdown':
      return markdownParser;
    default:
      return undefined;
    }
  };

  const feelersLanguageSupport = feelersLanguage(
    hostLanguageParser || (hostLanguage && _getHostLanguageParser(hostLanguage)) || undefined
  );

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
    feelersLinter,
    lintHandler,
    tooltipLayout,
    darkMode ? feelDark : feelLight,
    ...(enableGutters ? [

      // todo: adjust folding boundaries first foldGutter(),
      lineNumbers()
    ] : []),
    ...(singleLine ? [
      EditorState.transactionFilter.of(tr => tr.newDoc.lines > 1 ? [] : tr)
    ] : []),
    ...(lineWrap ? [
      EditorView.lineWrapping
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
 *
 * @param {number} [position]
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
 * @returns {import('@codemirror/state').EditorSelection} selection
 */
FeelersEditor.prototype.getSelection = function() {
  return this._cmEditor.state.selection;
};

/**
 * @param {string} eventName
 * @param {Function} callback
 */
FeelersEditor.prototype.on = function(eventName, callback) {
  this._events.on(eventName, callback);
};

/**
 * @param {string} eventName
 * @param {Function} [callback]
 */
FeelersEditor.prototype.off = function(eventName, callback) {
  this._events.off(eventName, callback);
};
