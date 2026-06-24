# feelers

[![CI](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml)

A templating solution built on top of [DMN](https://www.omg.org/spec/DMN/) FEEL.
Like [mustache](https://mustache.github.io/) / [handlebars](https://handlebarsjs.com/) but with FEEL.

## Usage

```js
import { evaluate } from 'feelers';
```

A simple string will always be returned as-is.

```js
evaluate("My simple string");
// "My simple string"
```

If your string is prefixed with an =, it will be evaluated as a single FEEL expression wrapped in a string conversion function.

```js
const context = { secondNumber: 12 };
evaluate("= 2 + secondNumber", context);
// "14"
```

Finally, if your string features feelers language features, the templating engine takes over.

```js
const context = { user: "Dave" };
evaluate("I'm sorry {{user}}, I'm afraid I can't do that.", context);
// I'm sorry Dave, I'm afraid I can't do that.
```

## Language features

### Inserts

The simplest feature of feelers is inserting FEEL evaluations within your text.

```js
const context = { user: "Dave", age: 24, hobbies: [ "surfing", "coding" ] };

evaluate(`Hey there {{user}}, welcome. {{if age >= 18 then "Have a beer!" else "Here's some apple juice."}}`, context);
// Hey there Dave. Have a beer!
```

### Conditional sections

```js
const context = { users: [ "Bob", "Dave" ] };
evaluate(`{{#if count(users) > 1}}There are multiple users{{/if}}`, context);
// There are multiple users
```

### Loops

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
# build the library and run all tests
npm run all

# run the development setup
npm run dev
```

## Related

* [feelers](https://github.com/bpmn-io/feelers) - FEELers monorepo
* [@bpmn-io/lezer-feelers](https://github.com/bpmn-io/feelers/tree/main/packages/lezer-feelers) - FEELers parser definition
* [@bpmn-io/lang-feelers](https://github.com/bpmn-io/feelers/tree/main/packages/lang-feelers) - FEELers language support for CodeMirror 6
* [@bpmn-io/feelers-lint](https://github.com/bpmn-io/feelers/tree/main/packages/feelers-lint) - FEELers linting support for CodeMirror 6
* [@bpmn-io/feelers-editor](https://github.com/bpmn-io/feelers/tree/main/packages/feelers-editor) - FEELers editor component
* [lezer-feel](https://github.com/nikku/lezer-feel) - FEEL language definition for the Lezer parser system

## License

MIT
