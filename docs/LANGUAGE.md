# Language

FEELers is a templating language built on top of [DMN](https://www.omg.org/spec/DMN/) FEEL.
Like [mustache](https://mustache.github.io/) / [handlebars](https://handlebarsjs.com/) but with FEEL.

## Features

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

To handle dealing with arrays of data graciously, you can make use of loop tags. A special variable `this` is created granting you access to the current loop's element.

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
