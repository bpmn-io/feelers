import { parser, buildSimpleTree } from '../grammar/';
import { evaluate as evaluateFeel } from 'feelin';

const evaluate = (templateString, context = {}, debug = true, strict = false) => {

  const parseTree = parser.parse(templateString);

  const simpleTreeRoot = buildSimpleTree(parseTree, templateString);

  const evaluateNode = buildNodeEvaluator(debug, strict);

  return evaluateNode(simpleTreeRoot, context);

};

const buildNodeEvaluator = (debug, strict) => {

  const errorHandler = (error) => {

    if (debug) {
      return `{{ ${error.message.toLowerCase()} }}`;
    }

    throw error;
  };

  const evaluateNodeValue = (node, context = {}) => {

    switch (node.name) {

    case 'SimpleTextBlock':
      return node.content;

    case 'Insert': {
      const feel = node.children[0].content;

      try {
        return evaluateFeel(feel, context);
      }
      catch {
        return errorHandler(new Error(`FEEL expression ${feel} couldn't be evaluated`));
      }
    }

    case 'EmptyInsert':
      return '';

    case 'FeelBlock':
      return evaluateFeel(node.content, context);

    case 'Feelers':
      return node.children.map(child => evaluateNode(child, context)).join('');

    case 'ConditionalSpanner': {
      const feel = node.children[0].content;
      let shouldRender;

      try {
        shouldRender = evaluateFeel(feel, context);
      }
      catch {
        return errorHandler(new Error(`FEEL expression ${feel} couldn't be evaluated`));
      }

      if (strict && typeof(shouldRender) !== 'boolean') {
        return errorHandler(new Error(`FEEL expression ${feel} expected to evaluate to a boolean`));
      }

      if (shouldRender) {
        return node.children.slice(1).map(child => evaluateNode(child, context)).join('');
      }

      return '';
    }

    case 'LoopSpanner': {
      const feel = node.children[0].content;
      let iteratorArray;

      try {
        iteratorArray = evaluateFeel(feel, context);
      }
      catch {
        return errorHandler(new Error(`FEEL expression ${feel} couldn't be evaluated`));
      }

      if (!Array.isArray(iteratorArray)) {

        if (strict) {
          return errorHandler(new Error(`FEEL expression ${feel} expected to evaluate to an array`));
        }
        else if (iteratorArray === undefined || iteratorArray === null) {
          iteratorArray = [];
        }
        else {
          iteratorArray = [ iteratorArray ];
        }

      }

      const childrenToLoop = node.children.slice(1);

      const evaluateChild = (item, parentContext) => {
        const subContext = typeof (item) === 'object' ? { this: item, parent: parentContext, ...item, _this_: item, _parent_: parentContext } : { this: item, parent: parentContext, _this_: item, _parent_: parentContext };
        return childrenToLoop.map(child => evaluateNode(child, subContext)).join('');
      };

      return iteratorArray.map(item => evaluateChild(item, context)).join('');
    }}

  };

  const evaluateNode = (node, context = {}) => {

    if (!(typeof (context) === 'object')) {
      return errorHandler(new Error('Context must be an object'));
    }

    context.this = context.this || context;

    try {
      return evaluateNodeValue(node, context);
    } catch (error) {
      return errorHandler(error);
    }

  };

  return evaluateNode;

};

export default evaluate;