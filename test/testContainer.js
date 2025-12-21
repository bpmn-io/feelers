/**
 * Simple test container helper for Vitest
 * Provides DOM container for tests similar to mocha-test-container-support
 */

let currentContainer = null;

export function get() {
  if (!currentContainer) {
    currentContainer = document.createElement('div');
    currentContainer.className = 'test-container';
    currentContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%;';
    document.body.appendChild(currentContainer);
  }
  return currentContainer;
}

export function cleanup() {
  if (currentContainer && currentContainer.parentNode) {
    currentContainer.parentNode.removeChild(currentContainer);
    currentContainer = null;
  }
}

export default {
  get,
  cleanup
};
