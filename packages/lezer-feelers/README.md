# @bpmn-io/lezer-feelers

[![CI](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml)

[Lezer](https://lezer.codemirror.net/) grammar and parser for the [FEELers](https://github.com/bpmn-io/feelers) templating language.

## Usage

```js
import { parser, buildSimpleTree } from '@bpmn-io/lezer-feelers';

const tree = parser.parse('Hello {{name}}!');
const simpleTree = buildSimpleTree(tree, 'Hello {{name}}!');
```

## Build and run

Prepare the project by installing all dependencies:

```sh
npm install
```

Then, depending on your use-case you may run any of the following commands:

```sh
# build + lint the library, run all tests
npm run all

# execute tests only
npm test
```

## Related

* [feelers](https://github.com/bpmn-io/feelers) - FEELers monorepo
* [@bpmn-io/lang-feelers](https://github.com/bpmn-io/feelers/tree/main/packages/lang-feelers) - FEELers language support for CodeMirror 6
* [@bpmn-io/feelers-lint](https://github.com/bpmn-io/feelers/tree/main/packages/feelers-lint) - FEELers linting support for CodeMirror 6
* [@bpmn-io/feelers-editor](https://github.com/bpmn-io/feelers/tree/main/packages/feelers-editor) - FEELers editor component
* [feelers](https://github.com/bpmn-io/feelers/tree/main/packages/feelers) - FEELers interpreter
* [lezer-feel](https://github.com/nikku/lezer-feel) - FEEL language definition for the Lezer parser system

## License

MIT
