const initialTemplate = `There are {{= 2 + 2}} apples in the basket.

{{#if true}}
This should render
{{/if}}

{{#if false}}
This should not render
{{/if}}

{{#loop ["an apple", "a mystery to solve", "working iteration"]}}
I have {{this}}
{{/loop}}

But I also have {{if true then "string literal" else variable}}

# Markdown highlighting
## Should work
### For many cases
#### But sadly
##### It
###### Cannot {{ "be" }} perfect

It was a **bold** move to put so much *emphasis* on style

Let's test how robust loops are:

{{#loop users}}
{{name}} is {{age}} years old and knows {{#loop skills}}{{this}} {{/loop}}
{{ if this.age >= 30 then "This user is old" else "This user is less old" }}
{{/loop}}

\`form-js\` is about to get weird :eyes:

\`\`\`
while (workIsLeft) {
  type++;
}
\`\`\``;


const initialContext = {
  users: [
    { name: 'John', age: 25, skills: [ 'JavaScript', 'HTML', 'CSS' ] },
    { name: 'Jane', age: 30, skills: [ 'C#', 'Kotlin', 'Java' ] },
    { name: 'Bob', age: 35, skills: [ 'Rust', 'F#', 'Fortran' ] }
  ]
};

export { initialTemplate, initialContext };