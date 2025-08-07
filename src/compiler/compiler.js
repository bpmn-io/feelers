import { parser, buildSimpleTree } from '../grammar/index.js';
import { compileNode } from './generator.js';
import { escapeFeelString } from './utils.js';

/**
 * @typedef {import('./types.js').ASTNode} ASTNode
 */

/**
 * Compiles Feelers template to FEEL expression
 * @param {string} templateString - Feelers template to compile
 * @returns {string} Generated FEEL expression
 * @throws {Error} When template is invalid or compilation fails
 */
export const compile = (templateString) => {
  if (templateString === null || templateString === undefined || typeof templateString !== 'string') {
    throw new Error('Template must be a string');
  }

  if (!templateString.trim()) {
    return '""';
  }

  if (templateString.startsWith('=')) {
    const feelExpr = templateString.substring(1).trim();
    if (!feelExpr) throw new Error('Pure FEEL expression cannot be empty');
    return feelExpr;
  }

  if (!templateString.includes('{{')) {
    return `"${escapeFeelString(templateString)}"`;
  }

  try {
    const parseTree = parser.parse(templateString);

    /** @type {ASTNode} */
    const ast = buildSimpleTree(parseTree, templateString);

    return compileNode(ast);
  } catch (error) {
    throw new Error(`Template compilation failed: ${error.message}`);
  }
};
