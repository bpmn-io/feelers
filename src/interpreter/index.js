import { parser, buildSimpleTree } from '../grammar/';
import { evaluate as evaluateFeel } from 'feelin';

/**
 * @typedef {object} EvaluationOptions
 * @property {boolean} [debug=false] - whether to enable debug mode, which displays errors inline instead of throwing them
 * @property {function} [buildDebugString=(e) => `{{ ${e.message.toLowerCase()} }}`] - function that takes an error and returns the string to display in debug mode
 * @property {boolean} [strict=false] - whether to expect strict data types out of our FEEL expression, e.g. boolean for conditionals
 */

/**
 * @param {string} templateString - the template string to evaluate
 * @param {object} [context={}] - the context object to evaluate the template string against
 * @param {EvaluationOptions} [options={}] - options to configure the evaluation
 * @return {string} the evaluated template string
 */
const evaluate = (templateString, context = {}, options = {}) => {

  const {
    debug = false,
    buildDebugString = (e) => `{{ ${e.message.toLowerCase()} }}`,
    strict = false
  } = options;

  const parseTree = parser.parse(templateString);

  const simpleTreeRoot = buildSimpleTree(parseTree, templateString);

  const evaluateNode = buildNodeEvaluator(debug, buildDebugString, strict);

  return evaluateNode(simpleTreeRoot, enhanceContext(context, null));

};

const buildNodeEvaluator = (debug, buildDebugString, strict) => {

  const errorHandler = (error) => {

    if (debug) {
      return buildDebugString(error);
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
        return evaluateFeel(`string(${feel})`, context);
      }
      catch {
        return errorHandler(new Error(`FEEL expression ${feel} couldn't be evaluated`));
      }
    }

    case 'EmptyInsert':
      return '';

    case 'Feel':
    case 'FeelBlock': {
      const feel = node.content;

      try {
        return evaluateFeel(`string(${feel})`, context);
      }
      catch (e) {
        return errorHandler(new Error(`FEEL expression ${feel} couldn't be evaluated`));
      }
    }

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
        const children = node.children.slice(1, node.children.length - 1);
        const innerRender = children.map(child => evaluateNode(child, context)).join('');

        const closeNode = node.children[node.children.length - 1];
        const shouldAddNewline = closeNode.name.endsWith('Nl') && !innerRender.endsWith('\n');

        return innerRender + (shouldAddNewline ? '\n' : '');
      }

      return '';
    }

    case 'LoopSpanner': {
      const feel = node.children[0].content;
      let loopArray;

      try {
        loopArray = evaluateFeel(feel, context);
      }
      catch {
        return errorHandler(new Error(`FEEL expression ${feel} couldn't be evaluated`));
      }

      if (!Array.isArray(loopArray)) {

        if (strict) {
          return errorHandler(new Error(`FEEL expression ${feel} expected to evaluate to an array`));
        }

        // if not strict, we treat undefined/null as an empty array
        else if (loopArray === undefined || loopArray === null) {
          loopArray = [];
        }

        // if not strict, we treat a single item as an array with one item
        else {
          loopArray = [ loopArray ];
        }

      }

      const childrenToLoop = node.children.slice(1, node.children.length - 1);

      const evaluateChildren = (arrayElement, parentContext) => {
        const childContext = enhanceContext(arrayElement, parentContext);
        return childrenToLoop.map(child => evaluateNode(child, childContext)).join('');
      };

      const innerRender = loopArray.map(arrayElement => evaluateChildren(arrayElement, context)).join('');
      const closeNode = node.children[node.children.length - 1];
      const shouldAddNewline = closeNode.name.endsWith('Nl') && !innerRender.endsWith('\n');

      return innerRender + (shouldAddNewline ? '\n' : '');
    }}

  };

  const evaluateNode = (node, context = {}) => {
    try {
      return evaluateNodeValue(node, context);
    } catch (error) {
      return errorHandler(error);
    }
  };

  return evaluateNode;

};

const enhanceContext = (context, parentContext) => {

  if (typeof(context) === 'object') {
    return { this: context, parent: parentContext, ...context, _this_: context, _parent_: parentContext };
  }

  return { this: context, parent: parentContext, _this_: context, _parent_: parentContext };

};


export default evaluate;