import { buildSimpleTree, parser } from '../../src/grammar';
import { expect } from 'chai';

describe('parser', () => {

  it('should parse simple text block', () => {

    // given
    const input = 'hello world';

    // when
    const parseTree = _getSimpleTree(input);

    // then
    _expectTreeStructure(parseTree,
      ['Feelers', [
        ['SimpleTextBlock', 'hello world']
      ]]
    );
  });


  // todo: support this case
  it.skip('should parse simple text block with unclosed braces', () => {

    // given
    const input = 'hello {{ world';

    // when
    const simpleTree = _getSimpleTree(input);

    // then
    _expectTreeStructure(simpleTree,
      ['Feelers', [
        ['SimpleTextBlock', 'hello {{ world']
      ]]
    );

  });


  it('should parse pure FEEL expression', () => {

    // given
    const input = '=1 + 2';

    // when
    const simpleTree = _getSimpleTree(input);

    // then
    _expectTreeStructure(simpleTree,
      ['Feelers', [
        ['Feel', '1 + 2']
      ]]
    );

  });


  it('should parse text with insert', () => {

    // given
    const input = 'hello {{1 + 2}} world';

    // when
    const simpleTree = _getSimpleTree(input);

    // then
    _expectTreeStructure(simpleTree,
      ['Feelers', [
        ['SimpleTextBlock', 'hello '],
        ['Insert', [
          ['FeelBlock', '1 + 2']
        ]],
        ['SimpleTextBlock', ' world']
      ]]
    );

  });


  it('should parse text with empty insert', () => {

    // given
    const input = 'hello {{}} world';

    // when
    const simpleTree = _getSimpleTree(input);

    // then
    _expectTreeStructure(simpleTree,
      ['Feelers', [
        ['SimpleTextBlock', 'hello '],
        ['EmptyInsert'],
        ['SimpleTextBlock', ' world']
      ]]
    );

  });


  it('should parse text with multiple inserts', () => {

    // given
    const input = 'hello {{1 + 2}} world {{3 + 4}}';

    // when
    const simpleTree = _getSimpleTree(input);

    // then
    _expectTreeStructure(simpleTree,
      ['Feelers', [
        ['SimpleTextBlock', 'hello '],
        ['Insert', [
          ['FeelBlock', '1 + 2']
        ]],
        ['SimpleTextBlock', ' world '],
        ['Insert', [
          ['FeelBlock', '3 + 4']
        ]]
      ]]
    );

  });


  it('should parse conditional insert', () => {

    // given
    const input = 'hello {{#if true}}world{{/if}}';

    // when
    const simpleTree = _getSimpleTree(input);

    // then
    _expectTreeStructure(simpleTree,
      ['Feelers', [
        ['SimpleTextBlock', 'hello '],
        ['ConditionalSpanner', [
          ['FeelBlock', 'true'],
          ['SimpleTextBlock', 'world']
        ]]
      ]]
    );

  });


  it('should parse loop spanners', () => {

    // given
    const input = 'hello {{#loop [1, 2, 3]}}world{{/loop}}';

    // when
    const simpleTree = _getSimpleTree(input);

    // then
    _expectTreeStructure(simpleTree,
      ['Feelers', [
        ['SimpleTextBlock', 'hello '],
        ['LoopSpanner', [
          ['FeelBlock', '[1, 2, 3]'],
          ['SimpleTextBlock', 'world']
        ]]
      ]]
    );

  });


  it('should parse nested loop spanners', () => {

    // given
    const input = 'hello {{#loop [1, 2, 3]}}world {{#loop [4, 5, 6]}}!{{/loop}}{{/loop}}';

    // when
    const simpleTree = _getSimpleTree(input);

    // then
    _expectTreeStructure(simpleTree,
      ['Feelers', [
        ['SimpleTextBlock', 'hello '],
        ['LoopSpanner', [
          ['FeelBlock', '[1, 2, 3]'],
          ['SimpleTextBlock', 'world '],
          ['LoopSpanner', [
            ['FeelBlock', '[4, 5, 6]'],
            ['SimpleTextBlock', '!']
          ]]
        ]]
      ]]
    );

  });

});

const _expectTreeStructure = (node, structure) => {

  const [ name, childrenOrContent ] = structure;
  expect(node.name, `expected node '${node.name}' to have name '${name}'`).to.equal(name);

  if (typeof childrenOrContent === 'string') {

    // check leaf node content
    expect(node.content, `expected node '${node.name}' to be a leaf node`).to.exist;
    expect(node.content, `expected node '${node.name}' content '${node.content}' to equal '${childrenOrContent}'`).to.equal(childrenOrContent);
  }
  else if (Array.isArray(childrenOrContent)) {

    // iterate recursively over children
    childrenOrContent.forEach((child, idx) => {
      _expectTreeStructure(node.children[idx], child);
    });
  }
  else if (!childrenOrContent) { /* if there is no content or children, then we have an empty node */ }
  else {
    throw new Error('invalid test structure');
  }

};

const _getSimpleTree = (input) => {
  return buildSimpleTree(parser.parse(input), input);
};