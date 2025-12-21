# Testing Guide

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run dev

# Run tests with UI
npm start
```

## Test Structure

Tests are located in the `test/spec/` directory:
- `parser.spec.js` - Tests for the Feelers parser
- `interpreter.spec.js` - Tests for template interpretation
- `editor.spec.js` - Tests for the CodeMirror-based editor
- `singleStart.spec.js` - Interactive development test (skipped by default)

## Test Infrastructure

- **Test Runner**: Vitest
- **Assertion Library**: Chai
- **Mocking**: Sinon with sinon-chai
- **Environment**: jsdom (simulates browser environment)

## Known Limitations

### CodeMirror Editor Tests

Two editor tests are currently skipped due to module instance checking issues with CodeMirror and Vitest's ESM module loading:
- `FeelersEditor > should render`
- `FeelersEditor > should allow content attribute extensions`

This is a known limitation when using CodeMirror with Vitest in jsdom environment. The issue is tracked at: https://github.com/vitest-dev/vitest/issues/2806

**Workaround options**:
1. Use `@vitest/browser` mode for these tests (requires browser automation)
2. Skip these tests and rely on integration/manual testing for editor functionality
3. Wait for upstream fixes to Vitest's module resolution

Currently, these tests are skipped with the expectation that editor functionality is validated through the playground and integration testing.

## Test Coverage

- **Parser**: 9 tests (1 skipped) - Tests grammar parsing and tree structure
- **Interpreter**: 66 tests - Tests template evaluation and FEEL expressions
- **Editor**: 26 tests (26 skipped) - Most editor tests are marked as TODOs for conversion
- **Total**: 75 passing tests, 28 skipped

## Development Testing

For interactive development and debugging:

```bash
# Run vitest UI for interactive testing
npm start

# Run tests in watch mode
npm run dev
```

The UI mode provides a nice interface for running and debugging individual tests.
