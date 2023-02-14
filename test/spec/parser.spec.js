import { parser } from '../../src/grammar/feelers/parser';
import { expect } from 'chai';

describe('parser should parse', () => {

  it('should have Feelers root', () => {

    // given
    const stringInput = '';

    // when
    const result = parser.parse(stringInput);

    // then
    expect(result.type.name).to.equal('Feelers');
  });


  it ('should parse pure feel expression', () => {

    // given
    const stringInput = '=Hello World';

    // when
    const result = parser.parse(stringInput);

    // then
    expect(result.children.length).to.equal(1);
    expect(result.children[0].type.name).to.equal('Feel');
    expect(result.children[0].children.length).to.equal(0);
  });


  it('should parse more complex pure feel expression', () => {

    // given
    const stringInput = '=   Hello World\n asdsadsadsadsa \n asdsadsadsadsad test.access.member = 2';

    // when
    const result = parser.parse(stringInput);

    // then
    expect(result.children.length).to.equal(1);
    expect(result.children[0].type.name).to.equal('Feel');
    expect(result.children[0].children.length).to.equal(0);

  });


  it('should parse pure FEEL insert', () => {

    // given
    const stringInput = '{{=Hello World}}';

    // when
    const result = parser.parse(stringInput);

    // then
    expect(result.children.length).to.equal(1);
    expect(result.children[0].type.name).to.equal('Insert');
    expect(result.children[0].children.length).to.equal(1);
    expect(result.children[0].children[0].type.name).to.equal('Feelblock');
    expect(result.children[0].children[0].children.length).to.equal(0);
  });

  it('should parse complex template', () => {

    // given
    const stringInput =
    `{{=feel1}} And somewhewre over the rainbow {{feel2}}
    {{#loop feel3}}
      Hello
    {{/loop}}

    {{#if feel4}}
      Hello
    {{/if}}`;


    // when
    const result = parser.parse(stringInput);

    throw new Error('Not implemented');

  });

});
