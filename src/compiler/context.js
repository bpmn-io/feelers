/**
 * Compilation context for tracking loop variables and scoping
 */
export class CompilerContext {
  constructor() {
    this.loopStack = [];
    this.contextVariables = new Set([ 'parent' ]);
  }

  /**
   * Enters a new loop context
   * @param {string} variable - Loop variable name
   * @param {string} iterable - Expression being iterated over
   */
  enterLoop(variable, iterable) {
    this.loopStack.push({ variable, iterable });
  }

  /**
   * Exits the current loop context
   */
  exitLoop() {
    this.loopStack.pop();
  }

  /**
   * Gets the current loop variable name
   * @returns {string|null} Current loop variable or null if not in a loop
   */
  getCurrentLoopVariable() {
    return this.loopStack.length > 0 ? this.loopStack[this.loopStack.length - 1].variable : null;
  }

  /**
   * Gets all context variables available in current scope
   * @returns {Set<string>} Set of available context variable names
   */
  getContextVariables() {
    const vars = new Set(this.contextVariables);

    for (let i = 0; i < this.loopStack.length - 1; i++) {
      vars.add(this.loopStack[i].variable);
    }
    return vars;
  }
}
