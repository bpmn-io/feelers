export const complexLoopsAndConditionalsFixture = {
  name: 'complexLoopsAndConditionals',
  template: `
    # Employees
    
    {{#loop users}}
    ## {{name}}
    *Currently {{age}} years old, contact* [@{{twitter}}]({{"https://twitter.com/" + twitter}})

    {{#loop skills}}
    - {{this}}
    {{/loop}}
  
    {{/loop}}
    
    # Some conditions
    
    {{#if count(users) > 1}}There are multiple users{{/if}}
    {{#if false}}This should not display{{/if}}
    {{#if true}}This should display{{/if}}

    *Some italic text*
    **Some bold text**
    
    # Prices
    
    | Item | Category | Price | Stock |
    | -- | --:| --:| --:|
    {{#loop prices}}
    | {{name}} | {{category}} | {{parent.currencySymbol}}{{price}} | {{stock}} |
    {{/loop}}
`,
  context: {
    users: [
      {
        name: 'Alice',
        age: 30,
        twitter: 'alice30',
        skills: [ 'JavaScript', 'React', 'Node.js' ],
      },
      {
        name: 'Bob',
        age: 22,
        twitter: 'bobby22',
        skills: [ 'Python', 'Django' ],
      },
    ],
    prices: [
      { name: 'Laptop', category: 'Electronics', price: 1249.99, stock: 4 },
      { name: 'Coffee Beans', category: 'Grocery', price: 11.5, stock: 42 },
    ],
    currencySymbol: '$',
  },
  expected: `
    # Employees
    
    ## Alice
    *Currently 30 years old, contact* [@alice30](https://twitter.com/alice30)
    
    ### Skills
    - JavaScript
    - React
    - Node.js
    
    ## Bob
    *Currently 22 years old, contact* [@bobby22](https://twitter.com/bobby22)
    
    ### Skills
    - Python
    - Django
    
    # Some conditions
    
    There are multiple users
    This should display
    
    *Some italic text*
    **Some bold text**
    
    # Prices
    
    | Item | Category | Price | Stock |
    | -- | --:| --:| --:|
    | Laptop | Electronics | $1249.99 | 4 |
    | Coffee Beans | Grocery | $11.5 | 42 |`,
};

export const plainStringFixture = {
  name: 'plainString',
  template: 'Nothing special here.',
  context: {},
  expected: 'Nothing special here.',
};

export const insertFixture = {
  name: 'insert',
  template: 'Hello {{user}}, you’re {{age}} years old.',
  context: { user: 'John', age: 28 },
  expected: 'Hello John, you’re 28 years old.',
};

export const inlineFeelExpressionFixture = {
  name: 'inlineFeelExpression',
  template: '= 100 / divisor',
  context: { divisor: 4 },
  expected: '25',
};

export const inlineIfThenElseFixture = {
  name: 'inlineIfThenElse',
  template: 'You are {{ if age >= 18 then "an adult" else "a minor" }}.',
  context: { age: 17 },
  expected: 'You are a minor.',
};

export const conditionalSectionsFixture = {
  name: 'conditionalSections',
  template: `{{#if isAdmin}}🛡️  Welcome, admin {{user}}!{{/if}}
{{#if not(isAdmin)}}⛔️  Access denied for {{user}}.{{/if}}`,
  context: { user: 'Eve', isAdmin: false },
  expected: '⛔️  Access denied for Eve.',
};

export const simpleLoopFixture = {
  name: 'simpleLoop',
  template: `
Shopping list:
{{#loop items}}
- {{this}}
{{/loop}}`,
  context: { items: [ 'Apples', 'Bananas', 'Carrots' ] },
  expected: `
Shopping list:
- Apples
- Bananas
- Carrots
`,
};

export const nestedLoopsFixture = {
  name: 'nestedLoops',
  template: `
# Project Teams

{{#loop teams}}
## {{name}}

Members ({{count(members)}} total):
{{#loop members}}
- {{this}} (team: {{parent.name}})
{{/loop}}

{{/loop}}
That's it!`,
  context: {
    teams: [
      { name: 'Alpha', members: [ 'Alice', 'Bob' ] },
      { name: 'Beta', members: [ 'Charlie' ] },
    ],
  },
  expected: `
# Project Teams

## Alpha

Members (2 total):
- Alice (team: Alpha)
- Bob (team: Alpha)

## Beta

Members (1 total):
- Charlie (team: Beta)

That's it!`,
};

export const loopWithParentContextFixture = {
  name: 'loopWithParentContext',
  template: `
{{#loop users}}
{{name}} works at {{parent.company}} and likes:
{{#loop hobbies}}
• {{this}}
{{/loop}}

{{/loop}}
That's it!`,
  context: {
    company: 'Globex',
    users: [
      { name: 'Dave', hobbies: [ 'Chess', 'Running' ] },
      { name: 'Eva', hobbies: [ 'Reading' ] },
    ],
  },
  expected: `
Dave works at Globex and likes:
• Chess
• Running

Eva works at Globex and likes:
• Reading

That's it!`,
};

export const inlineLoopUsersFixture = {
  name: 'inlineLoopUsers',
  template: 'Users: {{#loop users}}{{name}}, {{/loop}}end.',
  context: { users: [ { name: 'Sam' }, { name: 'Max' } ] },
  expected: 'Users: Sam, Max, end.',
};

export const multiInlineLoopsFixture = {
  name: 'multiInlineLoops',
  template: 'Names: {{#loop users}}{{name}}, {{/loop}} | Ages: {{#loop users}}{{age}}, {{/loop}}',
  context: {
    users: [
      { name: 'Sam', age: 30 },
      { name: 'Max', age: 22 },
    ],
  },
  expected: 'Names: Sam, Max,  | Ages: 30, 22, ',
};

export const nestedInlineLoopsFixture = {
  name: 'nestedInlineLoops',
  template: 'Skill matrix: {{#loop users}}{{name}} → {{#loop skills}}{{this}}, {{/loop}}; {{/loop}}done.',
  context: {
    users: [
      { name: 'Sam', skills: [ 'JS', 'Node' ] },
      { name: 'Anna', skills: [ 'Python' ] },
    ],
  },
  expected: 'Skill matrix: Sam → JS, Node, ; Anna → Python, ; done.',
};

export const inlineLoopWithParentFixture = {
  name: 'inlineLoopWithParent',
  template: 'Prices: {{#loop prices}}{{parent.currencySymbol}}{{price}}, {{/loop}}done.',
  context: {
    currencySymbol: '€',
    prices: [ { price: 10 }, { price: 20 } ],
  },
  expected: 'Prices: €10, €20, done.',
};

export const emptyInsertFixture = {
  name: 'emptyInsert',
  template: 'Nothing to see here: {{}}, moving on.',
  context: {},
  expected: 'Nothing to see here: , moving on.',
};

export const loopWithInlineConditionalsFixture = {
  name: 'loopWithInlineConditionals',
  template: `
{{#loop users}}
- {{name}}
{{#if age >= 18}}(adult){{/if}}
{{#if age < 18}}(minor){{/if}}
{{/loop}}`,
  context: {
    users: [
      { name: 'Tom', age: 18 },
      { name: 'Lily', age: 15 },
    ],
  },
  expected: `
- Tom
(adult)
- Lily
(minor)
`,
};

export const allFixtures = [
  complexLoopsAndConditionalsFixture,
  plainStringFixture,
  insertFixture,
  inlineFeelExpressionFixture,
  inlineIfThenElseFixture,
  conditionalSectionsFixture,
  simpleLoopFixture,
  nestedLoopsFixture,
  loopWithParentContextFixture,
  inlineLoopUsersFixture,
  multiInlineLoopsFixture,
  nestedInlineLoopsFixture,
  inlineLoopWithParentFixture,
  emptyInsertFixture,
  loopWithInlineConditionalsFixture,
];
