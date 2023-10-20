import evaluate from '../../src/interpreter';
import { expect } from 'chai';

const ERROR_CHAR = '⚠';

describe('interpreter', () => {

  describe('simple inputs', () => {

    it('should return empty strings unchanged', () => {

      // given
      const stringInput = '';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal(stringInput);

    });


    it('should return simple text unmodified', () => {

      // given
      const stringInput = 'Hello World';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal(stringInput);

    });


    it('should return simple text with newlines unmodified', () => {

      // given
      const stringInput = 'Hello World\nasdasdasd\nasdasdasdasdasd';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal(stringInput);

    });


    it('should return number strings unmodified', () => {

      // given
      const stringInput = '123';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal(stringInput);

    });


    it('should return addition strings unmodified', () => {

      // given
      const stringInput = '123 + 123';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal(stringInput);

    });


    it('should return objects unmodified', () => {

      // given
      const stringInput = '{ "a": 1, "b": 2 }';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal(stringInput);

    });


    it('should return function keywords unmodified', () => {

      // given
      const stringInput = 'date';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal(stringInput);

    });

  });


  describe('pure FEEL', () => {

    it('should interpret simple math expressions', () => {

      // given
      const stringInput = '= 1 + 1';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('2');

    });


    it('should interpret more complex feel', () => {

      // given
      const stringInput = '= if (1 + 1 = 2) then "Hello World" else "Goodbye World"';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('Hello World');

    });


    it('should interpret feel with context', () => {

      // given
      const stringInput = '= if (a + 1 = 2) then "Hello World" else "Goodbye World"';
      const context = { a: 1 };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello World');

    });


    it('should interpret feel with nested context', () => {

      // given
      const stringInput = '= if (a.b + 1 = 2) then "Hello World" else "Goodbye World"';
      const context = { a: { b: 1 } };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello World');

    });


    it('should error on invalid feel', () => {

      // given
      const stringInput = '= iff (a + 1 = 2) then "Hello World" else "Goodbye World"';
      const context = { a: 1 };

      // when
      const result = evaluate(stringInput, context, {
        debug: true,
        buildDebugString: (e) => ERROR_CHAR
      });

      // then
      expect(result).to.equal(ERROR_CHAR);

    });


    it('should evaluate even when missing contextual information', () => {

      // given
      const stringInput = '= if (a + 1 = 2) then "Hello World" else "Goodbye World"';
      const context = { b: 1 };

      // when
      const result = evaluate(stringInput, context, {
        debug: true,
        buildDebugString: (e) => ERROR_CHAR
      });

      // then
      expect(result).to.equal('Goodbye World');
    });


    it('should stringify objects', () => {

      // given
      const stringInput = '= { "a": 1, "b": 2 }';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('{a: 1, b: 2}');

    });


    it('should stringify arrays', () => {

      // given
      const stringInput = '= [ 1, 2, 3 ]';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('[1, 2, 3]');

    });


    it('should stringify nested objects', () => {

      // given
      const stringInput = '= { "a": { "b": 2 } }';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('{a: {b: 2}}');

    });


    it('should error on function keywords', () => {

      // given
      const stringInput = '= date';

      // when
      const result = evaluate(stringInput, {}, {
        debug: true,
        buildDebugString: (e) => ERROR_CHAR
      });

      // then
      expect(result).to.equal(ERROR_CHAR);

    });

  });


  describe('inserts', () => {

    it('should evaluate simple inserts', () => {

      // given
      const stringInput = 'Hello {{= 1 + 1}} World';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('Hello 2 World');

    });


    it('should evaluate simple inserts without equal sign', () => {

      // given
      const stringInput = 'Hello {{1+1}} World';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('Hello 2 World');

    });


    it('should evaluate simple inserts with context', () => {

      // given
      const stringInput = 'Hello {{= a + 1}} World';
      const context = { a: 1 };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello 2 World');

    });


    it('should evaluate simple inserts with nested context', () => {

      // given
      const stringInput = 'Hello {{= a.b + 1}} World';
      const context = { a: { b: 1 } };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello 2 World');

    });


    it('should evaluate multiple inserts', () => {

      // given
      const stringInput = 'Hello {{= a + 1}} World {{= a + 2}}';

      // when
      const result = evaluate(stringInput, { a: 1 });

      // then
      expect(result).to.equal('Hello 2 World 3');

    });


    it('should evaluate complex inserts', () => {

      // given
      const stringInput = 'Hello {{= if (a + 1 = 2) then "Lovely" else "Cruel"}} World';

      // when
      const result = evaluate(stringInput, { a: 1 });

      // then
      expect(result).to.equal('Hello Lovely World');

    });


    it('should evaluate even more complex inserts', () => {

      // given
      const stringInput = 'Hello {{user_info.name}}, you are currently {{ if user_role.isAdmin then "" else "not " }}authorized to access this page.';
      const context = { user_info: { name: 'John Doe' }, user_role: { isAdmin: false } };

      // when
      const result = evaluate(stringInput, context);

      // then`
      expect(result).to.equal('Hello John Doe, you are currently not authorized to access this page.');

    });


    it('should stringify objects', () => {

      // given
      const stringInput = 'Hello {{= { "a": 1, "b": 2 } }} World';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('Hello {a: 1, b: 2} World');

    });


    it('should stringify arrays', () => {

      // given
      const stringInput = 'Hello {{= [ 1, 2, 3 ] }} World';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('Hello [1, 2, 3] World');

    });


    it('should error on invalid feel', () => {

      // given
      const stringInput = 'Hello {{= iff (a + 1 = 2) then "Hello World" else "Goodbye World"}} World {{iff () then "Hello World" else "Goodbye World"}}';
      const context = { a: 1 };

      // when
      const result = evaluate(stringInput, context, {
        debug: true,
        buildDebugString: (e) => ERROR_CHAR
      });

      // then
      expect(result).to.equal(`Hello ${ERROR_CHAR} World ${ERROR_CHAR}`);

    });


    it('should error on function keywords', () => {

      // given
      const stringInput = 'Hello {{= date}} World';

      // when
      const result = evaluate(stringInput, {}, {
        debug: true,
        buildDebugString: (e) => ERROR_CHAR
      });

      // then
      expect(result).to.equal(`Hello ${ERROR_CHAR} World`);

    });

  });


  describe('conditional inserts', () => {

    it('should evaluate true conditional inserts', () => {

      // given
      const stringInput = 'Hello {{#if true}}World{{/if}}';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('Hello World');
    });


    it('should evaluate false conditional inserts', () => {

      // given
      const stringInput = 'Hello {{#if false}}World{{/if}}';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('Hello ');
    });


    it('should evaluate simple inline conditional inserts with context', () => {

      // given
      const stringInput = 'Hello {{#if pho_exists}}Delicious {{/if}}World';
      const context = { pho_exists: true };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello Delicious World');

    });


    it('should evaluate multiple inline conditional inserts', () => {

      // given
      const stringInput = 'Hello {{#if pho_exists}}Delicious {{/if}}{{#if ramen_exists}}Umami {{/if}}World';
      const context = { pho_exists: true, ramen_exists: true };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello Delicious Umami World');

    });

    it('should not swallow newlines when evaluating two initial inline conditional inserts', () => {

      // given
      const stringInput = '{{#if true}}Hello{{/if}}\n{{#if true}}Newline{{/if}}';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('Hello\nNewline');

    });


    it('should evaluate simple multiline conditional inserts without creating extra lines', () => {

      // given
      const stringInput = 'Hello\n{{#if pho_exists}}\nDelicious\n{{/if}}\nWorld';
      const context = { pho_exists: true };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello\nDelicious\nWorld');

    });


    it('should evaluate multiple multiline conditional inserts without creating extra lines', () => {

      // given
      const stringInput = 'Hello\n{{#if pho_exists}}\nDelicious\n{{/if}}\n{{#if ramen_exists}}\nUmami\n{{/if}}\nWorld';
      const context = { pho_exists: true, ramen_exists: true };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello\nDelicious\nUmami\nWorld');

    });


    it('should type coerce to boolean in non-strict mode', () => {

      // given
      const stringInput = 'Hello {{#if 1}}World{{/if}}';

      // when
      const result = evaluate(stringInput, {}, { strict: false });

      // then
      expect(result).to.equal('Hello World');

    });


    it('should not type coerce to boolean in strict mode', () => {

      // given
      const stringInput = 'Hello {{#if 1}}World{{/if}}';

      // when
      const result = evaluate(stringInput, {}, { debug: true, strict: true, buildDebugString: (e) => ERROR_CHAR });

      // then
      expect(result).to.equal('Hello ' + ERROR_CHAR);

    });


    it('should evaluate nested conditional inserts', () => {

      // given
      const stringInput = 'Hello {{#if pho_exists}}{{#if ramen_exists}}Delicious & Umami {{/if}}{{/if}}World';
      const context = { pho_exists: true, ramen_exists: true };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello Delicious & Umami World');

    });

  });


  describe('loop inserts', () => {

    it('should evaluate simple loop inserts', () => {

      // given
      const stringInput = 'Hello {{#loop ["a", "b", "c"]}}{{this}}{{/loop}} World';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('Hello abc World');

    });


    it('should evaluate simple loop inserts with primitive array context', () => {

      // given
      const stringInput = 'Hello {{#loop items}}{{this}}{{/loop}} World';
      const context = { items: [ 'a', 'b', 'c' ] };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello abc World');

    });


    it('should evaluate simple loop inserts with object array context', () => {

      // given
      const stringInput = 'Hello {{#loop items}}{{name}}{{/loop}} World';
      const context = { items: [ { name: 'a' }, { name: 'b' }, { name: 'c' } ] };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello abc World');

    });


    it('should evaluate nested loop inserts', () => {

      // given
      const stringInput = 'Hello {{#loop items}}{{#loop sub_items}}{{this}}{{/loop}}{{/loop}} World';
      const context = { items: [ { sub_items: [ '1', '2', '3' ] }, { sub_items: [ '4', '5', '6' ] } ] };


      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello 123456 World');

    });


    it('should evaluate two inline loops without swallowing newline', () => {

      // given
      const stringInput = '{{#loop ["a", "b", "c"]}}{{this}}{{/loop}}\n{{#loop ["a", "b", "c"]}}{{this}}{{/loop}}';

      // when
      const result = evaluate(stringInput);

      // then
      expect(result).to.equal('abc\nabc');

    });


    it('should evaluate multidimentional array loops', () => {

      // given
      const stringInput = 'Hello {{#loop items}}{{#loop this}}{{this}}{{/loop}}{{/loop}} World';
      const context = { items: [ [ '1', '2', '3' ], [ '4', '5', '6' ] ] };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello 123456 World');

    });


    it('should evaluate multiline loop inserts', () => {

      // given
      const stringInput = 'Hello\n{{#loop ["a", "b", "c"]}}\n{{this}}\n{{/loop}}\nWorld';
      const context = { items: [ 'a', 'b', 'c' ] };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Hello\na\nb\nc\nWorld');

    });


    it('should allow non-array in non-strict mode (string)', () => {

      // given
      const stringInput = 'Hello {{#loop "abc"}}{{this}}{{/loop}} World';

      // when
      const result = evaluate(stringInput, {}, { strict: false });

      // then
      expect(result).to.equal('Hello abc World');

    });


    it('should allow non-array in non-strict mode (number)', () => {

      // given
      const stringInput = 'Hello {{#loop 2}}{{this}}{{/loop}} World';

      // when
      const result = evaluate(stringInput, {}, { strict: false });

      // then
      expect(result).to.equal('Hello 2 World');

    });


    it('should not allow non-array in strict mode', () => {

      // given
      const stringInput = 'Hello {{#loop "abc"}}{{this}}{{/loop}} World';

      // when
      const result = evaluate(stringInput, {}, { debug: true, strict: true, buildDebugString: (e) => ERROR_CHAR });

      // then
      expect(result).to.equal(`Hello ${ERROR_CHAR} World`);

    });

  });


  describe('special accessors', () => {

    it('should evaluate `this` accessor', () => {

      // given
      const stringInput = '{{this}}';
      const context = 'This is this!';

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('This is this!');

    });


    it('should evaluate property through `this` accessor', () => {

      // given
      const stringInput = '{{this.prop}}';
      const context = { prop: 'Weee!' };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Weee!');

    });


    it('should let `this` accessor be overwritten if literally defined', () => {

      // given
      const stringInput = '{{this.prop}}';
      const context = { this: { prop: 'Nested prop' }, prop: 'Root prop' };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Nested prop');

    });


    it('should evaluate `_this_` accessor', () => {

      // given
      const stringInput = '{{_this_}}';
      const context = 'This is this!';

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('This is this!');

    });


    it('should evaluate property through `_this_` accessor', () => {

      // given
      const stringInput = '{{_this_.prop}}';
      const context = { prop: 'Weee!' };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Weee!');

    });


    it('should not let `_this_` accessor be overwritten if literally defined', () => {

      // given
      const stringInput = '{{_this_.prop}}';
      const context = { _this_: { prop: 'Nested prop' }, prop: 'Root prop' };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('Root prop');

    });


    it('should evaluate `parent` accessor', () => {

      // given
      const stringInput = '{{#loop items}}\n{{parent.prefix + this}}\n{{/loop}}';
      const context = { items: [ '1', '2', '3' ], prefix: '$' };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('$1\n$2\n$3\n');

    });


    it('should let `parent` accessor be overwritten if literally defined', () => {

      // given
      const stringInput = '{{#loop items}}\n{{parent.prefix + item}}\n{{/loop}}';
      const context = { items: [ { item: '1', parent: { prefix: '£' } }, { item: '2' }, { item: '3' } ], prefix: '$' };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('£1\n$2\n$3\n');

    });


    it('should evaluate `_parent_` accessor', () => {

      // given
      const stringInput = '{{#loop items}}\n{{_parent_.prefix + this}}\n{{/loop}}';

      const context = { items: [ '1', '2', '3' ], prefix: '$' };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('$1\n$2\n$3\n');

    });


    it('should not let `_parent_` accessor be overwritten if literally defined', () => {

      // given
      const stringInput = '{{#loop items}}\n{{_parent_.prefix + item}}\n{{/loop}}';
      const context = { items: [ { item: '1', _parent_: { prefix: '£' } }, { item: '2' }, { item: '3' } ], prefix: '$' };

      // when
      const result = evaluate(stringInput, context);

      // then
      expect(result).to.equal('$1\n$2\n$3\n');

    });

  });


  describe('errors', () => {

    it('should output custom debug error inserts', () => {

      // given
      const stringInput = 'Hello {{#if ?!~}}World{{/if}}';
      const context = { items: [ 'a', 'b', 'c' ] };
      const errorHandler = (e) => `<span class="error">⚠<span class="message">${e.message}</span></span>`;

      // when
      const result = evaluate(stringInput, context, { debug: true, buildDebugString: errorHandler });

      // then
      expect(result).to.equal('Hello <span class="error">⚠<span class="message">FEEL expression ?!~ couldn\'t be evaluated</span></span>');

    });


    it('should throw in non-debug mode', () => {

      // given
      const stringInput = 'Hello {{#if ?!~}}World{{/if}}';
      const context = { items: [ 'a', 'b', 'c' ] };

      // when
      const fn = () => evaluate(stringInput, context);

      // then
      expect(fn).to.throw('FEEL expression ?!~ couldn\'t be evaluated');

    });

  });

});
