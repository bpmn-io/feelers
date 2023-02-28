const initialTemplate = `# Employees

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


# Prices

| Item | Category | Price | Stock |
| -- | --:| --:|
{{#loop prices}}
| {{name}} | {{category}} | {{parent.currencySymbol}}{{price}} | {{stock}} |
{{/loop}}

`;

const prices20 = [
  {
    name: 'Apple',
    category: 'Fruit',
    price: 1.99,
    stock: 10
  },
  {
    name: 'Orange',
    category: 'Fruit',
    price: 2.99,
    stock: 5
  },
  {
    name: 'Banana',
    category: 'Fruit',
    price: 3.99,
    stock: 0
  },
  {
    name: 'Carrot',
    category: 'Vegetable',
    price: 4.99,
    stock: 12
  },
  {
    name: 'Potato',
    category: 'Vegetable',
    price: 5.99,
    stock: 20
  },
  {
    name: 'Tomato',
    category: 'Vegetable',
    price: 6.99,
    stock: 30
  },
  {
    name: 'Cucumber',
    category: 'Vegetable',
    price: 7.99,
    stock: 40
  },
  {
    name: 'Avocado',
    category: 'Fruit',
    price: 8.99,
    stock: 50
  },
  {
    name: 'Lemon',
    category: 'Fruit',
    price: 9.99,
    stock: 60
  },
  {
    name: 'Lime',
    category: 'Fruit',
    price: 10.99,
    stock: 70
  },
  {
    name: 'Cherry',
    category: 'Fruit',
    price: 11.99,
    stock: 80
  },
  {
    name: 'Peach',
    category: 'Fruit',
    price: 12.99,
    stock: 90
  },
  {
    name: 'Pear',
    category: 'Fruit',
    price: 13.99,
    stock: 100
  },
  {
    name: 'Pineapple',
    category: 'Fruit',
    price: 14.99,
    stock: 110
  },
  {
    name: 'Grapes',
    category: 'Fruit',
    price: 15.99,
    stock: 120
  },
  {
    name: 'Strawberry',
    category: 'Fruit',
    price: 2.40,
    stock: 130
  }
];

const initialContext = {
  users: [
    {
      name: 'John',
      age: 25,
      twitter: 'JohnCena',
      skills: [
        'JavaScript',
        'HTML',
        'CSS'
      ]
    },
    {
      name: 'Jane',
      age: 30,
      twitter: 'KermitTheFrog',
      skills: [
        'C#',
        'Kotlin',
        'Java'
      ]
    },
    {
      name: 'Bob',
      age: 35,
      twitter: 'bobdylan',
      skills: [
        'Rust',
        'F#',
        'Fortran'
      ]
    }
  ],
  prices: prices20,
  currencySymbol: '$'
};

export { initialTemplate, initialContext };