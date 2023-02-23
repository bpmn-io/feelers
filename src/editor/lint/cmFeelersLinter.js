
import { syntaxTree } from '@codemirror/language';
import { lintEmptyInserts } from './rules/lintEmptyInserts.js';

import { cmFeelLinter } from '@bpmn-io/feel-lint';


/**
 * Generates lint messages for the given syntax tree.
 *
 * @param {Tree} syntaxTree
 * @returns {LintMessage[]} array of all lint messages
 */
function lintAll(syntaxTree) {

  const lintMessages = [

    ...lintEmptyInserts(syntaxTree)
  ];

  return lintMessages;
}


/**
 * CodeMirror extension that provides linting for FEEL expressions.
 *
 * @param {EditorView} editorView
 * @returns {Source} CodeMirror linting source
 */
export function cmFeelersLinter() {
  const lintFeel = cmFeelLinter();
  return editorView => {

    const feelMessages = lintFeel(editorView);

    // don't lint if the Editor is empty
    if (editorView.state.doc.length === 0) {
      return [];
    }

    const tree = syntaxTree(editorView.state);

    const feelersMessages = lintAll(tree);

    return [
      ...feelMessages,
      ...feelersMessages.map(message => ({
        ...message,
        source: 'feelers'
      }))
    ];
  };
}
