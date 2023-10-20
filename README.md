# feelers

[![CI](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/feelers/actions/workflows/CI.yml)

A templating solution built on top of [DMN](https://www.omg.org/spec/DMN/) FEEL. 
Like moustache / handlebars but with FEEL.

![image](https://user-images.githubusercontent.com/17801113/222329383-c3e63077-e288-41e0-832d-7e71e331d76a.png)


## What is inside

* A [lezer](https://lezer.codemirror.net/) grammar and consequently parser for the templating language
* A parseMixed language definition which brings `feelers` templating, `feel` parsing and an optional host language together
* An editor for feelers, build on top of [codemirror](https://codemirror.net/)
* An interpreter to fill your templates with data, powered by [feelin](https://github.com/nikku/feelin)
* A simple playground to showcase the language 


## Usage 

Feelers is a string templating tool, and will return string text or error.

```js
import { evaluate } from 'feelers'`
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

## Feelers templating language features

### Inserts

The simplest feature of feelers is inserting FEEL evaluations within your text. You may provide a variable context for the underlying FEEL engine to reference. Within these scopes, you have access to all features of the FEEL engine.

```js
const context = { user: "Dave", age: 24, hobbies: [ "surfing", "coding" ] };

evaluate(`Hey there {{user}}, welcome. {{if age >= 18 then "Have a beer!" else "Here's some apple juice."}}`, context);
// Hey there Dave. Have a beer!

evaluate(`Hobbies: {{hobbies}}`, context);
// Hobbies: ["surfing", "coding"]

evaluate(`{{user}}-{{user}}-{{user}}`, context);
// Dave-Dave-Dave
```

### Conditional sections

To simply display a section of the template, you may use a conditional section. While this can already be achieved via feel itself using `if then else`, this syntax is a lot easier to manage for large sections.

```js
const conditionExample = `{{#if count(users) > 1}}There are multiple users{{/if}}
{{#if false}}This should not display{{/if}}
{{#if true}}This should display{{/if}}`;

const context = { users: [ "Bob", "Dave" ] };

evaluate(conditionExample, context);
// There are multiple users
// This should display
```

### Loops

To handle dealing with arrays of data graciously, you can make use of loop tags. A special variable `this` is create granting you access to the current loop's element.

```js
const context = { user: "Dave", age: 24, hobbies: [ "surfing", "coding" ] };
const hobbyExpression = `{{user}}'s hobbies are:
{{#loop hobbies}}
- {{this}}
{{/loop}}`;

evaluate(hobbyExpression, context);
/// Dave's hobbies are:
/// - surfing
/// - coding
```

Loops may be nested when dealing with more complex data. When `this` is an object, you may access its variables directly within the loop. Although `this.name` would also work in the below example

```js
const context = {
  users: [
    {
      name: "Bob",
      hobbies: [ "building", "wearing hardhats" ]
    },
    {
      name: "Dave",
      hobbies: [ "surfing", "coding" ]
    }
  ]
}

const complexLoops = `{{#loop users}}
{{name}}'s hobbies:
{{#loop hobbies}}
- {{this}}
{{/loop}}
{{/loop}}
`

evaluate(complexLoops, context);
// Bobs's hobbies:
// - building
// - wearing hardhats
// Dave's hobbies:
// - surfing
// - coding
```

> Loops actually create 4 helper variables: `this`, `parent`, `_this_` and `_parent_`. Parent refers to the context just outside of your loop, in case you need to refer to it. The underscored variants are fallbacks in case your context include variables named `this` and `parent`.

## Build and run

Build the project in a Posix environment. On Windows, that is [Git Bash](https://gitforwindows.org/) or WSL. 

Note we currently support development environments with Node.js version 16 (and npm version 8). We encourage you to use a Node.js version manager (e.g., [`nvm`](https://github.com/nvm-sh/nvm) or [`n`](https://github.com/tj/n)) to set up the needed versions.

Prepare the project by installing all dependencies:

```sh
npm install
```

Then, depending on your use-case you may run any of the following commands:

```sh
# run all tests
npm run test

# runs single-start test case for development
npm start
npm run start

# generate the lezer parser from its grammar definition
npm run generate:parser

# build all dependencies locally and spool up playground
npm run start:playground

# build all dependencies locally and build playground
npm run build:playground
```

## Related

* [lezer-feel](https://github.com/nikku/lezer-feel) - FEEL language definition for the [Lezer](https://lezer.codemirror.net/) parser system
* [feel-playground](https://github.com/nikku/feel-playground) - Interactive playground to learn the FEEL language

## License

MIT
