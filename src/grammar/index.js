export * from './parser';

/**
 * @typedef { {
 *   name: string,
 *   children: SimpleNode[],
 *   content?: string,
 *   parent?: SimpleNode
 * } } SimpleNode
 */

/**
 * @param { import('@lezer/common').Tree } parseTree
 * @param { string } sourceText
 *
 * @return {SimpleNode}
 */
export function buildSimpleTree(parseTree, sourceText) {

  const stack = /** @type { SimpleNode[] } */ ([ {
    name: 'Root',
    children: []
  } ]);

  const isLeafNode = (node) => [
    'SimpleTextBlock',
    'Feel',
    'FeelBlock'
  ].includes(node.type.name);

  parseTree.iterate({
    enter: (node) => {

      const nodeRepresentation = /** @type { SimpleNode } */ ({
        name: node.type.name,
        children: []
      });

      if (isLeafNode(node)) {
        nodeRepresentation.content = sourceText.slice(node.from, node.to);
      }

      stack.push(nodeRepresentation);
    },
    leave: (_node) => {
      const result = stack.pop();
      const parent = stack[stack.length - 1];
      result.parent = parent;
      parent.children.push(result);
    }
  });

  return stack[0].children[0];
}