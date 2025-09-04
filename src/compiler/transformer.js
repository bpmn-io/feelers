import { analyzeFeelVariables, isCamundaBuiltin } from './analyzer.js';
import { escapeRegex } from './utils.js';

/**
 * Transforms FEEL expression for proper variable scoping in loop contexts
 * @param {string} expression - FEEL expression to transform
 * @param {import('./context.js').CompilerContext} context - Current compilation context
 * @returns {string} Transformed FEEL expression
 */
/**
 * Transforms 'this' references to current loop variable
 * @param {string} expression - FEEL expression
 * @param {string} currentLoop - Current loop variable name
 * @returns {string} Transformed expression
 */
const transformThis = (expression, currentLoop) => {
  return expression.includes('this')
    ? expression.replace(/\bthis\b/g, currentLoop)
    : expression;
};

/**
 * Transforms 'parent.' references by removing prefix
 * @param {string} expression - FEEL expression
 * @returns {string} Transformed expression
 */
const transformParent = (expression) => {
  return expression.includes('parent.')
    ? expression.replace(/\bparent\.(\w+)/g, '$1')
    : expression;
};

/**
 * Checks if variable should be excluded from transformation
 * @param {string} varName - Variable name
 * @param {string} currentLoop - Current loop variable
 * @param {Set<string>} contextVars - Context variables
 * @param {Set<string>} functions - Function names
 * @param {Set<string>} pathExpressions - Path expressions
 * @returns {boolean} True if should exclude
 */
const shouldExcludeVariable = (varName, currentLoop, contextVars, functions, pathExpressions) => {
  if (varName === currentLoop) return true;
  if (varName === 'this') return true;
  if (contextVars.has(varName)) return true;
  if (functions.has(varName)) return true;
  if (isCamundaBuiltin(varName)) return true;
  if (pathExpressions.has(varName)) return true;

  return false;
};

/**
 * Transforms variables to be scoped to loop variable
 * @param {string} expression - FEEL expression
 * @param {string} currentLoop - Current loop variable
 * @param {Set<string>} variables - Variables in expression
 * @param {Set<string>} contextVars - Context variables
 * @param {Set<string>} functions - Function names
 * @param {Set<string>} pathExpressions - Path expressions
 * @returns {string} Transformed expression
 */
const transformVariables = (expression, currentLoop, variables, contextVars, functions, pathExpressions) => {
  const variablesToTransform = Array.from(variables).filter(varName =>
    !shouldExcludeVariable(varName, currentLoop, contextVars, functions, pathExpressions)
  );

  return variablesToTransform.reduce((expr, varName) => {
    const regex = new RegExp(`\\b${escapeRegex(varName)}\\b`, 'g');
    return expr.replace(regex, `${currentLoop}.${varName}`);
  }, expression);
};

export const transformFeelExpression = (expression, context) => {
  const currentLoop = context.getCurrentLoopVariable();
  if (!currentLoop) return expression;

  try {
    const { variables, functions, pathExpressions } = analyzeFeelVariables(expression);
    const contextVars = context.getContextVariables();

    const step1 = transformThis(expression, currentLoop);
    const step2 = transformParent(step1);
    return transformVariables(step2, currentLoop, variables, contextVars, functions, pathExpressions);
  } catch (error) {
    return expression;
  }
};
