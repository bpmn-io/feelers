import { closeBrackets } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { setDiagnosticsEffect } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, tooltips, lineNumbers } from '@codemirror/view';

import { feelersMixedLanguage } from './language';
import lint from './lint';
import { lightTheme, darkTheme } from './theme';


/**
 * Creates a Feelers editor in the supplied container
 *
 * @param {Object} config
 * @param {DOMNode} config.container
 * @param {DOMNode|String} [config.tooltipContainer]
 * @param {Function} [config.onChange]
 * @param {Function} [config.onKeyDown]
 * @param {Function} [config.onLint]
 * @param {Boolean} [config.readOnly]
 * @param {String} [config.value]
 * @param {Boolean} [config.enableGutters]
 * @param {Boolean} [config.darkMode]
 *
 * @returns {Object} editor
 */
export default function FeelersEditor({
  container,
  tooltipContainer,
  onChange = () => { },
  onKeyDown = () => { },
  onLint = () => { },
  contentAttributes = { },
  readOnly = false,
  value = '',
  enableGutters = false,
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
    feelersMixedLanguage,
    lint,
    lintHandler,
    tooltipLayout,
    darkMode ? darkTheme : lightTheme,
    ...(enableGutters ? [

      // todo: adjust folding boundaries first foldGutter(),
      lineNumbers()
    ] : [])
  ];

  if (readOnly) {
    extensions.push(EditorView.editable.of(false));
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
