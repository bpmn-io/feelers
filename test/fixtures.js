export const complexLoopsAndConditionalsFixture = {
  name: 'complexLoopsAndConditionals',
  template: `# Employees
  
    {{#loop users}}
    ## {{name}}
    *Currently {{age}} years old, contact* [@{{twitter}}]({{"https://twitter.com/" + twitter}})
  
    ### Skills
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
};

export const plainStringFixture = {
  name: 'plainString',
  template: 'Nothing special here.',
  context: {},
};

export const insertFixture = {
  name: 'insert',
  template: 'Hello {{user}}, you’re {{age}} years old.',
  context: { user: 'John', age: 28 },
};

export const inlineFeelExpressionFixture = {
  name: 'inlineFeelExpression',
  template: '= 100 / divisor',
  context: { divisor: 4 }, // → “25”
};

export const inlineIfThenElseFixture = {
  name: 'inlineIfThenElse',
  template: 'You are {{ if age >= 18 then "an adult" else "a minor" }}.',
  context: { age: 17 },
};

export const conditionalSectionsFixture = {
  name: 'conditionalSections',
  template: `
    {{#if isAdmin}}🛡️  Welcome, admin {{user}}!{{/if}}
    {{#if not isAdmin}}⛔️  Access denied for {{user}}.{{/if}}
    `,
  context: { user: 'Eve', isAdmin: false },
};

export const simpleLoopFixture = {
  name: 'simpleLoop',
  template: `
    Shopping list:
    {{#loop items}}
    - {{this}}
    {{/loop}}
    `,
  context: { items: [ 'Apples', 'Bananas', 'Carrots' ] },
};

export const nestedLoopsFixture = {
  name: 'nestedLoops',
  template: `
    # Project Teams
  
    {{#loop teams}}
    ## {{name}}
  
    Members ({{count(members)}} total):
    {{#loop members}}
    - {{this}}  (team: {{parent.name}})
    {{/loop}}
  
    {{/loop}}
    `,
  context: {
    teams: [
      { name: 'Alpha', members: [ 'Alice', 'Bob' ] },
      { name: 'Beta', members: [ 'Charlie' ] },
    ],
  },
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
    `,
  context: {
    company: 'Globex',
    users: [
      { name: 'Dave', hobbies: [ 'Chess', 'Running' ] },
      { name: 'Eva', hobbies: [ 'Reading' ] },
    ],
  },
};

export const inlineLoopUsersFixture = {
  name: 'inlineLoopUsers',
  template: 'Users: {{#loop users}}{{name}}, {{/loop}}end.',
  context: { users: [ { name: 'Sam' }, { name: 'Max' } ] },
};

export const multiInlineLoopsFixture = {
  name: 'multiInlineLoops',
  template:
    'Names: {{#loop users}}{{name}}, {{/loop}} ' +
    '| Ages: {{#loop users}}{{age}}, {{/loop}}',
  context: {
    users: [
      { name: 'Sam', age: 30 },
      { name: 'Max', age: 22 },
    ],
  },
};

export const nestedInlineLoopsFixture = {
  name: 'nestedInlineLoops',
  template:
    'Skill matrix: {{#loop users}}{{name}} → ' +
    '{{#loop skills}}{{this}}, {{/loop}}; {{/loop}}done.',
  context: {
    users: [
      { name: 'Sam', skills: [ 'JS', 'Node' ] },
      { name: 'Anna', skills: [ 'Python' ] },
    ],
  },
};

export const inlineLoopWithParentFixture = {
  name: 'inlineLoopWithParent',
  template:
    'Prices: {{#loop prices}}{{parent.currencySymbol}}{{price}}, {{/loop}}done.',
  context: {
    currencySymbol: '€',
    prices: [ { price: 10 }, { price: 20 } ],
  },
};

export const emptyInsertFixture = {
  name: 'emptyInsert',
  template: 'Nothing to see here: {{}}, moving on.',
  context: {},
};

export const loopWithInlineConditionalsFixture = {
  name: 'loopWithInlineConditionals',
  template: `
    {{#loop users}}
    - {{name}}
      {{#if age >= 18}}(adult){{/if}}
      {{#if age < 18}}(minor){{/if}}
    {{/loop}}
    `,
  context: {
    users: [
      { name: 'Tom', age: 18 },
      { name: 'Lily', age: 15 },
    ],
  },
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
