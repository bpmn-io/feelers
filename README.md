# feelers

[![CI](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml)

A templating solution built on top of [DMN](https://www.omg.org/spec/DMN/) FEEL.
Like [mustache](https://mustache.github.io/) / [handlebars](https://handlebarsjs.com/) but with FEEL.

![feelers editor - light theme](./packages/feelers-editor/docs/editor-light.png)
![feelers editor - dark theme](./packages/feelers-editor/docs/editor-dark.png)

## Packages

| Package | Description |
|---------|-------------|
| [feelers](packages/feelers) | FEELers interpreter — evaluate templates against a data context |
| [@bpmn-io/lezer-feelers](packages/lezer-feelers) | Lezer parser and grammar for the FEELers templating language |
| [@bpmn-io/lang-feelers](packages/lang-feelers) | CodeMirror 6 language support for FEELers |
| [@bpmn-io/feelers-lint](packages/feelers-lint) | CodeMirror 6 linting for FEELers |
| [@bpmn-io/feelers-editor](packages/feelers-editor) | CodeMirror 6 editor component for FEELers |

## Usage

Evaluate FEELers templates using the interpreter:

```js
import { evaluate } from 'feelers';

evaluate("Hello {{name}}!", { name: "Dave" });
// "Hello Dave!"
```

Embed the editor into your application:

```js
import { FeelersEditor } from '@bpmn-io/feelers-editor';

const editor = new FeelersEditor({
  container: document.querySelector('#editor'),
  value: 'Hello {{name}}!',
  onChange: (value) => console.log(value)
});
```

## Language features

An overview of the features supported by feelers - inspect the [language documentation](./docs/LANGUAGE.md) to dive deeper.

### [Inserts](./docs/LANGUAGE.md#inserts)

Add FEEL evaluations using `{{ }}` within your text.

```js
const context = { user: "Dave", age: 24 };

evaluate(`Hey there {{user}}, welcome. {{if age >= 18 then "Have a beer!" else "Here's some apple juice."}}`, context);
// Hey there Dave. Have a beer!
```

### [Conditional sections](./docs/LANGUAGE.md#conditional-sections)

```js
const context = { users: [ "Bob", "Dave" ] };

evaluate(`{{#if count(users) > 1}}There are multiple users{{/if}}`, context);
// There are multiple users
```

### [Loops](./docs/LANGUAGE.md#loops)

```js
const context = { user: "Dave", hobbies: [ "surfing", "coding" ] };

evaluate(`{{user}}'s hobbies:\n{{#loop hobbies}}\n- {{this}}\n{{/loop}}`, context);
// Dave's hobbies:
// - surfing
// - coding
```

## Build and run

Prepare the project by installing all dependencies:

```sh
npm install
```

Then, depending on your use-case you may run any of the following commands:

```sh
# spin up simple playground
npm start

# build and run all packages
npm run all

# build / test / run a single repository (i.e. @bpmn-io/lezer-feelers)
npm run all -w @bpmn-io/lezer-feelers

# publish the packages
npm run publish
```

## Related

* [lezer-feel](https://github.com/nikku/lezer-feel) - FEEL language definition for the [Lezer](https://lezer.codemirror.net/) parser system
* [feel-playground](https://github.com/nikku/feel-playground) - Interactive playground to learn the FEEL language

## License

MIT
