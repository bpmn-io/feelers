import { parser as feelersParser, buildSimpleTree } from '@bpmn-io/lezer-feelers';

/**
 * @typedef { import('@bpmn-io/lezer-feelers').SimpleNode } SimpleNode
 * @typedef { import('@lezer/common').Tree } Tree
 */


/**
 * @param {string} templateString
 *
 * @return {Tree}
 */
export function parse(templateString) {
  return feelersParser.parse(templateString);
}

/**
 * @param {string} templateString
 *
 * @return {SimpleNode}
 */
export function parseToSimpleTree(templateString) {
  const parseTree = feelersParser.parse(templateString);

  return buildSimpleTree(parseTree, templateString);
}