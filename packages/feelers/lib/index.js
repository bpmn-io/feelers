import { parser, buildSimpleTree } from '@bpmn-io/lezer-feelers';

import { evaluate as evaluateFeel } from '@bpmn-io/feelin';

/**
 * @typedef {import('@bpmn-io/lezer-feelers').SimpleNode} SimpleNode
 */

/**
 * @typedef {object} EvaluationOptions
 * @property {boolean} [debug=false] - whether to enable debug mode, which displays errors inline instead of throwing them
 * @property {function(Error): string} [buildDebugString=(e) => `{{ ${e.message.toLowerCase()} }}`] - function that takes an error and returns the string to display in debug mode
 * @property {boolean} [strict=false] - whether to expect strict data types out of our FEEL expression, e.g. boolean for conditionals
 * @property {function} [sanitizer] - function to sanitize individual FEEL evaluation results
 */

/**
 * @param {string} templateString - the template string to evaluate
 * @param {Record<string, unknown>} [context={}] - the context object to evaluate the template string against
 * @param {EvaluationOptions} [options={}] - options to configure the evaluation
 * @return {string} the evaluated template string
 */
export const evaluate = (templateString, context = {}, options = {}) => {

  const {
    debug = false,
    strict = false,
    buildDebugString = (e) => `{{ ${e.message.toLowerCase()} }}`,
    sanitizer
  } = options;

  const parseTree = parser.parse(templateString);

  const simpleTreeRoot = buildSimpleTree(parseTree, templateString);

  const evaluateNode = buildNodeEvaluator({ debug, strict, buildDebugString, sanitizer });

  return evaluateNode(simpleTreeRoot, enhanceContext(context, null));

};

/**
 * @param {EvaluationOptions} options - options to configure the evaluation
 * @return {function} a function that takes a node and context and evaluates it
 */
const buildNodeEvaluator = (options) => {

  const {
    debug,
    strict,
    buildDebugString,
    sanitizer
  } = options;

  const errorHandler = (/** @type {Error} */ error) => {

    if (debug && buildDebugString) {
      return buildDebugString(error);
    }

    throw error;
  };

  /**
   * @param {SimpleNode} node
   * @param {Record<string, unknown>} [context]
   * @returns {string | undefined}
   */
  const evaluateNodeValue = (node, context = {}) => {

    switch (node.name) {

    case 'SimpleTextBlock':
      return node.content;

    case 'Insert': {
      const feel = /** @type {string} */ (node.children[0].content);

      try {
        const { value } = evaluateFeel(`string(${feel})`, context);
        return /** @type {string} */ (sanitizer ? sanitizer(value) : value);
      }
      catch {
        return errorHandler(new Error(`FEEL expression ${feel} couldn't be evaluated`));
      }
    }

    case 'EmptyInsert':
      return '';

    case 'Feel':
    case 'FeelBlock': {
      const feel = /** @type {string} */ (node.content);

      try {
        const { value } = evaluateFeel(`string(${feel})`, context);
        return /** @type {string} */ (sanitizer ? sanitizer(value) : value);
      }
      catch {
        return errorHandler(new Error(`FEEL expression ${feel} couldn't be evaluated`));
      }
    }

    case 'Feelers':
      return node.children.map(child => evaluateNode(child, context)).join('');

    case 'ConditionalSpanner': {
      const feel = /** @type {string} */ (node.children[0].content);
      let shouldRender;

      try {
        const { value } = evaluateFeel(feel, context);
        shouldRender = value;
      }
      catch {
        return errorHandler(new Error(`FEEL expression ${feel} couldn't be evaluated`));
      }

      if (strict && typeof(shouldRender) !== 'boolean') {
        return errorHandler(new Error(`FEEL expression ${feel} expected to evaluate to a boolean`));
      }

      if (shouldRender) {
        const children = node.children.slice(1, node.children.length - 1);
        const innerRender = /** @type {string} */ (children.map(child => evaluateNode(child, context)).join(''));

        const closeNode = node.children[node.children.length - 1];
        const shouldAddNewline = closeNode.name.endsWith('Nl') && !innerRender.endsWith('\n');

        return innerRender + (shouldAddNewline ? '\n' : '');
      }

      return '';
    }

    case 'LoopSpanner': {
      const feel = /** @type {string} */ (node.children[0].content);
      let loopArray;

      try {
        const { value } = evaluateFeel(feel, context);
        loopArray = value;
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

      /**
       * @param {any} arrayElement
       * @param {Record<string, unknown> | null} parentContext
       * @returns {string}
       */
      const evaluateChildren = (arrayElement, parentContext) => {
        const childContext = /** @type {Record<string, unknown>} */ (enhanceContext(arrayElement, parentContext));
        return /** @type {string} */ (childrenToLoop.map(child => evaluateNode(child, childContext)).join(''));
      };

      const innerRender = /** @type {string} */ (
        loopArray.map(arrayElement => evaluateChildren(arrayElement, context)).join('')
      );
      const closeNode = node.children[node.children.length - 1];
      const shouldAddNewline = closeNode.name.endsWith('Nl') && !innerRender.endsWith('\n');

      return innerRender + (shouldAddNewline ? '\n' : '');
    }}

  };

  /**
   * @param {SimpleNode} node
   * @param {Record<string, unknown>} [context]
   * @returns {string | undefined}
   */
  const evaluateNode = (node, context = {}) => {
    try {
      return evaluateNodeValue(node, context);
    } catch (error) {
      return errorHandler(/** @type {Error} */ (error));
    }
  };

  return evaluateNode;

};

const enhanceContext = (/** @type {any} */ context, /** @type {Record<string, unknown> | null} */ parentContext) => {

  if (typeof(context) === 'object') {
    return { this: context, parent: parentContext, ...context, _this_: context, _parent_: parentContext };
  }

  return { this: context, parent: parentContext, _this_: context, _parent_: parentContext };

};
