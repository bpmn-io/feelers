/**
 * @typedef {import('./types.js').LoopSpannerNode} LoopSpannerNode
 */

/**
 * Escapes regex special characters for safe use in RegExp constructor
 * @param {string} string - String to escape
 * @returns {string} Escaped string safe for regex
 */
export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Escapes string for use in FEEL string literals
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for FEEL literals
 */
export const escapeFeelString = (str) => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
};

/**
 * Wraps expression in parentheses when needed for operator precedence
 * @param {string} expression - FEEL expression to potentially wrap
 * @returns {string} Expression wrapped in parentheses if needed
 */
export const wrapIfNeeded = (expression) => {
  if (expression.trim().startsWith('if ') && expression.includes(' then ')) {
    return `(${expression})`;
  }
  return expression;
};

/**
 * Extracts loop variable and iterable from LoopSpanner AST node
 * @param {LoopSpannerNode} loopNode - LoopSpanner AST node
 * @returns {{ variable: string, iterable: string }} Loop information
 */
export const extractLoopInfo = (loopNode) => {
  if (!loopNode || !loopNode.children || !loopNode.children[0] || !loopNode.children[0].content) {
    return { variable: 'item', iterable: 'items' };
  }

  const expression = loopNode.children[0].content.trim();

  const asMatch = expression.match(/^(.+?)\s+as\s+(\w+)$/);
  if (asMatch) {
    return { iterable: asMatch[1].trim(), variable: asMatch[2] };
  }

  return { iterable: expression, variable: 'item' };
};
