/**
 * @typedef {Object} ASTNode
 * @property {string} name - Node type name
 * @property {string} [content] - Text content for leaf nodes
 * @property {ASTNode[]} [children] - Child nodes
 */

/**
 * @typedef {Object} FeelersNode
 * @property {'Feelers'} name - Node type
 * @property {ASTNode[]} children - Child AST nodes
 */

/**
 * @typedef {Object} SimpleTextBlockNode
 * @property {'SimpleTextBlock'} name - Node type
 * @property {string} content - Text content
 */

/**
 * @typedef {Object} InsertNode
 * @property {'Insert'} name - Node type
 * @property {Array<{content: string}>} children - Expression nodes
 */

/**
 * @typedef {Object} FeelBlockNode
 * @property {'Feel' | 'FeelBlock'} name - Node type
 * @property {string} content - FEEL expression
 */

/**
 * @typedef {Object} LoopSpannerNode
 * @property {'LoopSpanner'} name - Node type
 * @property {ASTNode[]} children - Loop body nodes
 */

/**
 * @typedef {Object} ConditionalSpannerNode
 * @property {'ConditionalSpanner'} name - Node type
 * @property {Array<{content: string}>} children - Condition and body nodes
 */

// This file only contains type definitions and doesn't export anything
// The types are imported via JSDoc @typedef imports
