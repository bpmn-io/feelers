import { parser, buildSimpleTree } from '../grammar/';
import { evaluate as evaluateFeel } from 'feelin';

const evaluate = (templateString, context = {}) => {

  const parseTree = parser.parse(templateString);

  const simpleTreeRoot = buildSimpleTree(parseTree, templateString);

  return evaluateNode(simpleTreeRoot, context);

};

const evaluateNode = (node, context = {}) => {

  if (!(typeof(context) === 'object')) {
    throw new Error('Context must be an object');
  }

  context.this = context.this || context;

  switch (node.name) {

  case 'SimpleTextBlock':
    return node.content;

  case 'Insert':
    return evaluateFeel(node.children[0].content, context);

  case 'FeelBlock':
    return evaluateFeel(node.content, context);

  case 'Feelers':
    return node.children.map(child => evaluateNode(child, context)).join('');

  case 'ConditionalSpanner': {
    const shouldRender = evaluateFeel(node.children[0].content, context);

    if (shouldRender) {
      return node.children.slice(1).map(child => evaluateNode(child, context)).join('');
    }

    return '';
  }

  case 'LoopSpanner': {

    const iteratorArray = evaluateFeel(node.children[0].content, context);
    const childrenToLoop = node.children.slice(1);

    return iteratorArray.map(item => {
      const subContext = typeof(item) === 'object' ? { ...item, this: item, parent: context } : { this: item, parent: context };
      return childrenToLoop.map(child => evaluateNode(child, subContext)).join('');
    }).join('');

  }}

};


export default evaluate;