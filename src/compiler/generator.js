import { CompilerContext } from './context.js';
import { transformFeelExpression } from './transformer.js';
import { escapeFeelString, wrapIfNeeded, extractLoopInfo } from './utils.js';

/**
 * @typedef {import('./types.js').ASTNode} ASTNode
 * @typedef {import('./types.js').FeelersNode} FeelersNode
 * @typedef {import('./types.js').SimpleTextBlockNode} SimpleTextBlockNode
 * @typedef {import('./types.js').InsertNode} InsertNode
 * @typedef {import('./types.js').FeelBlockNode} FeelBlockNode
 * @typedef {import('./types.js').LoopSpannerNode} LoopSpannerNode
 * @typedef {import('./types.js').ConditionalSpannerNode} ConditionalSpannerNode
 */

/**
 * Compiles Feelers root node
 * @param {FeelersNode} node - Feelers AST node with children array
 * @param {import('./context.js').CompilerContext} context - Compilation context
 * @returns {string} Generated FEEL expression
 */
const compileFeelers = (node, context) => {
  if (node.children.length === 0) return '""';
  if (node.children.length === 1) return compileNode(node.children[0], context);
  const parts = node.children.map(child => compileNode(child, context));
  return parts.map(wrapIfNeeded).join(' + ');
};

/**
 * Compiles simple text block
 * @param {SimpleTextBlockNode} node - SimpleTextBlock AST node with content string
 * @returns {string} Generated FEEL expression
 */
const compileSimpleTextBlock = (node) => {
  return `"${escapeFeelString(node.content)}"`;
};

/**
 * Compiles insert expression
 * @param {InsertNode} node - Insert AST node with children array containing expression
 * @param {import('./context.js').CompilerContext} context - Compilation context
 * @returns {string} Generated FEEL expression
 */
const compileInsert = (node, context) => {
  if (!node.children || !node.children[0] || !node.children[0].content) return '""';
  const expression = transformFeelExpression(node.children[0].content, context);
  return `string(${expression})`;
};

/**
 * Compiles FEEL expression block
 * @param {FeelBlockNode} node - Feel/FeelBlock AST node with content string
 * @param {import('./context.js').CompilerContext} context - Compilation context
 * @returns {string} Generated FEEL expression
 */
const compileFeelBlock = (node, context) => {
  const feelExpr = transformFeelExpression(node.content, context);
  return `string(${feelExpr})`;
};

/**
 * Determines the correct iterable expression for a loop
 * @param {string} iterable - Original iterable expression
 * @param {string} currentLoop - Current loop variable
 * @param {import('./context.js').CompilerContext} context - Compilation context
 * @returns {string} Correctly scoped iterable expression
 */
const getIterableExpression = (iterable, currentLoop, context) => {
  if (currentLoop && !iterable.includes('.') && !context.getContextVariables().has(iterable)) {
    return `${currentLoop}.${iterable}`;
  }
  return iterable;
};

/**
 * Compiles loop spanner
 * @param {LoopSpannerNode} node - LoopSpanner AST node with children array
 * @param {import('./context.js').CompilerContext} context - Compilation context
 * @returns {string} Generated FEEL expression
 */
const compileLoopSpanner = (node, context) => {
  const loopInfo = extractLoopInfo(node);
  const bodyNodes = node.children.slice(1, -1);

  const iterable = getIterableExpression(
    loopInfo.iterable,
    context.getCurrentLoopVariable(),
    context
  );

  context.enterLoop(loopInfo.variable, iterable);
  const body = bodyNodes.length === 1
    ? compileNode(bodyNodes[0], context)
    : bodyNodes.map(child => compileNode(child, context)).map(wrapIfNeeded).join(' + ');
  context.exitLoop();

  return `string join(for ${loopInfo.variable} in ${iterable} return ${body}, "")`;
};

/**
 * Compiles conditional spanner
 * @param {ConditionalSpannerNode} node - ConditionalSpanner AST node with children array
 * @param {import('./context.js').CompilerContext} context - Compilation context
 * @returns {string} Generated FEEL expression
 */
const compileConditionalSpanner = (node, context) => {
  const condition = node.children[0].content;
  const bodyNodes = node.children.slice(1, -1);

  const body = bodyNodes.length === 1
    ? compileNode(bodyNodes[0], context)
    : bodyNodes.map(child => compileNode(child, context)).map(wrapIfNeeded).join(' + ');

  const transformedCondition = transformFeelExpression(condition, context);
  return `if ${transformedCondition} then ${body} else ""`;
};

/**
 * Compiles default node with children
 * @param {ASTNode} node - AST node with optional children array
 * @param {import('./context.js').CompilerContext} context - Compilation context
 * @returns {string} Generated FEEL expression
 */
const compileDefaultNode = (node, context) => {
  if (node.children) {
    return node.children.map(child => compileNode(child, context)).map(wrapIfNeeded).join(' + ');
  }
  return '""';
};

/**
 * Compiles Feelers AST node to FEEL expression
 * @param {ASTNode} node - AST node to compile with name and optional children/content
 * @param {import('./context.js').CompilerContext} context - Compilation context
 * @returns {string} Generated FEEL expression
 */
export const compileNode = (node, context = new CompilerContext()) => {
  if (!node) return '""';

  switch (node.name) {
  case 'Feelers':
    return compileFeelers(node, context);
  case 'SimpleTextBlock':
    return compileSimpleTextBlock(node);
  case 'Insert':
    return compileInsert(node, context);
  case 'EmptyInsert':
    return '""';
  case 'Feel':
  case 'FeelBlock':
    return compileFeelBlock(node, context);
  case 'LoopSpanner':
    return compileLoopSpanner(node, context);
  case 'ConditionalSpanner':
    return compileConditionalSpanner(node, context);
  default:
    return compileDefaultNode(node, context);
  }
};
