import { compile } from '../../src/compiler';
import { expect } from 'chai';

describe('compiler', () => {

  describe('complex template compilation', () => {

    it('should compile complex template with loops and conditionals', () => {

      // given
      const complexTemplate = `# Employees

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

`;

      // when
      const result = compile(complexTemplate);

      // then
      expect(result).to.be.a('string');
      expect(result).to.include('string join(for item in users return');
      expect(result).to.include('string join(for item in item.skills return');
      expect(result).to.include('if count(users) > 1 then');
      expect(result).to.include('if false then');
      expect(result).to.include('if true then');
      expect(result).to.include('string join(for item in prices return');
      expect(result).to.include('currencySymbol');
    });

    it('should handle nested loop variable scoping', () => {

      // given
      const nestedLoopTemplate = `{{#loop users}}
User: {{name}}
{{#loop skills}}
- Skill: {{this}} for {{name}}
{{/loop}}
{{/loop}}`;

      // when
      const result = compile(nestedLoopTemplate);

      // then
      expect(result).to.include('string join(for item in users return');
      expect(result).to.include('string join(for item in item.skills return');
      expect(result).to.include('item.name'); // outer loop variable should be scoped
    });

    it('should handle parent context access', () => {

      // given
      const parentContextTemplate = `{{#loop prices}}
| {{name}} | {{parent.currencySymbol}}{{price}} |
{{/loop}}`;

      // when
      const result = compile(parentContextTemplate);

      // then
      expect(result).to.include('currencySymbol'); // parent. should be stripped
      expect(result).to.include('item.name');
      expect(result).to.include('item.price');
    });

    it('should compile full complex template with all features', () => {

      // given
      const fullComplexTemplate = `# Employees

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

`;

      // when
      const result = compile(fullComplexTemplate);

      // then
      expect(result).to.be.a('string');
      expect(result).to.include('# Employees');
      expect(result).to.include('string join');
      expect(result).to.include('users');
      expect(result).to.include('skills');
      expect(result).to.include('prices');
      expect(result).to.include('if count(users) > 1 then');
      expect(result).to.include('currencySymbol');
    });

  });

  describe('basic compilation cases', () => {

    it('should compile empty template', () => {

      // given
      const emptyTemplate = '';

      // when
      const result = compile(emptyTemplate);

      // then
      expect(result).to.equal('""');
    });

    it('should compile plain text', () => {

      // given
      const plainText = 'Hello World';

      // when
      const result = compile(plainText);

      // then
      expect(result).to.equal('"Hello World"');
    });

    it('should compile pure FEEL expression', () => {

      // given
      const pureFeelTemplate = '= 1 + 1';

      // when
      const result = compile(pureFeelTemplate);

      // then
      expect(result).to.equal('1 + 1');
    });

    it('should compile simple insert', () => {

      // given
      const simpleInsertTemplate = 'Hello {{name}} World';

      // when
      const result = compile(simpleInsertTemplate);

      // then
      expect(result).to.equal('"Hello " + string(name) + " World"');
    });

    it('should throw error for invalid template', () => {

      // when/then
      expect(() => compile(null)).to.throw('Template must be a string');
      expect(() => compile(123)).to.throw('Template must be a string');
    });

    it('should throw error for empty pure FEEL expression', () => {

      // given
      const emptyFeelTemplate = '=';

      // when/then
      expect(() => compile(emptyFeelTemplate)).to.throw('Pure FEEL expression cannot be empty');
    });

  });

});
