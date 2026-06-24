# @bpmn-io/lang-feelers

[![CI](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml)

[CodeMirror 6](https://codemirror.net/) language support for the [FEELers](https://github.com/bpmn-io/feelers) templating language.

## Usage

```js
import { feelersLanguage } from '@bpmn-io/lang-feelers';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

const view = new EditorView({
  state: EditorState.create({
    extensions: [
      feelersLanguage()
    ]
  })
});
```

Optionally pass a host language parser for mixed-language support (e.g., markdown):

```js
import { parser as markdownParser } from '@lezer/markdown';

feelersLanguage(markdownParser);
```

## Build and run

Prepare the project by installing all dependencies:

```sh
npm install
```

Then, depending on your use-case you may run any of the following commands:

```sh
# build the library and run all tests
npm run all

# run the development setup
npm run dev
```

## Related

* [feelers](https://github.com/bpmn-io/feelers) - FEELers monorepo
* [@bpmn-io/lezer-feelers](https://github.com/bpmn-io/feelers/tree/main/packages/lezer-feelers) - FEELers parser definition
* [@bpmn-io/feelers-lint](https://github.com/bpmn-io/feelers/tree/main/packages/feelers-lint) - FEELers linting support for CodeMirror 6
* [@bpmn-io/feelers-editor](https://github.com/bpmn-io/feelers/tree/main/packages/feelers-editor) - FEELers editor component
* [feelers](https://github.com/bpmn-io/feelers/tree/main/packages/feelers) - FEELers interpreter
* [lezer-feel](https://github.com/nikku/lezer-feel) - FEEL language definition for the Lezer parser system

## License

MIT
