export * from './parser';

export function buildSimpleTree(parseTree, templateString) {

  const stack = [ { children: [] } ];
  const isLeafNode = (node) => [ 'SimpleTextBlock', 'Feel', 'FeelBlock' ].includes(node.type.name);

  parseTree.iterate({
    enter: (node, pos, type) => {

      const nodeRepresentation = {
        name: node.type.name,
        children: []
      };

      if (isLeafNode(node)) {
        nodeRepresentation.content = templateString.slice(node.from, node.to);
      }

      stack.push(nodeRepresentation);
    },
    leave: (node, pos, type) => {
      const result = stack.pop();
      const parent = stack[stack.length - 1];
      result.parent = parent;
      parent.children.push(result);
    }
  });

  return stack[0].children[0];
}