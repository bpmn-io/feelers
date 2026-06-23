/**
 * Create warnings for empty inserts in the given tree.
 *
 * @param {import('@lezer/common').Tree} syntaxTree
 * @returns {import('@codemirror/lint').Diagnostic[]} array of syntax errors
 */
export function lintEmptyInserts(syntaxTree) {

  const lintMessages = [];

  syntaxTree.iterate({
    enter: node => {
      if (node.type.name === 'EmptyInsert') {
        lintMessages.push(
          {
            from: node.from,
            to: node.to,
            severity: 'warning',
            message: 'this insert is empty and will be ignored',
            type: 'emptyInsert'
          }
        );
      }
    }
  });

  return lintMessages;
}