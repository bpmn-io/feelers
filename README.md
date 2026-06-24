# feelers

[![CI](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml)

A templating solution built on top of [DMN](https://www.omg.org/spec/DMN/) FEEL. 
Like [mustache](https://mustache.github.io/) / [handlebars](https://handlebarsjs.com/) but with FEEL.

![image](https://user-images.githubusercontent.com/17801113/222329383-c3e63077-e288-41e0-832d-7e71e331d76a.png)

## What is inside

* A [lezer](https://lezer.codemirror.net/) grammar and consequently parser for the templating language
* A parseMixed language definition which brings `feelers` templating, `feel` parsing and an optional host language together
* An editor for feelers, build on top of [codemirror](https://codemirror.net/)
* An interpreter to fill your templates with data, powered by [feelin](https://github.com/nikku/feelin)

## Usage 

Feelers is a string templating tool, and will return string text or error.

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
# build the library and run all tests
npm run all

# run the development setup
npm run dev

# spin up a simple playground for local development
npm start
```

## Related

* [lezer-feel](https://github.com/nikku/lezer-feel) - FEEL language definition for the [Lezer](https://lezer.codemirror.net/) parser system
* [feel-playground](https://github.com/nikku/feel-playground) - Interactive playground to learn the FEEL language

## License

MIT
