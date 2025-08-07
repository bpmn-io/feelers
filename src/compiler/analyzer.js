import { syntaxTree } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { feel } from 'lang-feel';
import { camundaBuiltins } from '@camunda/feel-builtins';

/**
 * Creates FEEL language state for AST analysis
 * @param {string} expression - FEEL expression to analyze
 * @returns {EditorState} CodeMirror state with FEEL language support
 */
const createFeelState = (expression) => {
  return EditorState.create({
    doc: expression,
    extensions: [ feel() ]
  });
};

/**
 * Analyzes FEEL expression using syntaxTree for variable detection
 * @param {string} expression - FEEL expression to analyze
 * @returns {{ variables: Set<string>, functions: Set<string>, pathExpressions: Set<string> }} Analysis results
 */
export const analyzeFeelVariables = (expression) => {
  const state = createFeelState(expression);
  const tree = syntaxTree(state);

  const variables = new Set();
  const functions = new Set();
  const pathExpressions = new Set();

  tree.iterate({
    enter: (node) => {
      const nodeText = state.sliceDoc(node.from, node.to);

      if (node.type.name === 'VariableName') {
        if (node.node.parent && node.node.parent.type.name === 'PathExpression') {
          const pathCursor = node.node.parent.cursor();
          if (pathCursor.firstChild() && pathCursor.from === node.from) {
            pathExpressions.add(nodeText);
          }
        } else {
          variables.add(nodeText);
        }
      }

      if (node.type.name === 'FunctionInvocation') {
        const functionCursor = node.node.cursor();
        if (functionCursor.firstChild() && functionCursor.type.name === 'VariableName') {
          functions.add(state.sliceDoc(functionCursor.from, functionCursor.to));
        }
      }
    }
  });

  return { variables, functions, pathExpressions };
};

/**
 * Checks if a variable is a Camunda builtin function
 * @param {string} varName - Variable name to check
 * @returns {boolean} True if variable is a Camunda builtin
 */
export const isCamundaBuiltin = (varName) => {
  return camundaBuiltins.some(builtin => builtin.name === varName);
};
