import { expect } from 'chai';

import { parse, parseToSimpleTree } from 'feelers';


describe('parser', function() {

  describe('parse', function() {

    it('should return a parse tree', function() {

      // given
      const input = 'hello world';

      // when
      const tree = parse(input);

      // then
      expect(tree).to.exist;
      expect(tree.topNode).to.exist;
      expect(tree.topNode.type.name).to.equal('Feelers');
    });

  });


  describe('parseToSimpleTree', function() {

    it('should parse simple text block', function() {

      // given
      const input = 'hello world';

      // when
      const simpleTree = parseToSimpleTree(input);

      // then
      expectTree(simpleTree,
        [ 'Feelers', [
          [ 'SimpleTextBlock', 'hello world' ]
        ] ]
      );
    });


    it('should parse pure FEEL expression', function() {

      // given
      const input = '=1 + 2';

      // when
      const simpleTree = parseToSimpleTree(input);

      // then
      expectTree(simpleTree,
        [ 'Feelers', [
          [ 'Feel', '1 + 2' ]
        ] ]
      );
    });


    it('should parse text with insert', function() {

      // given
      const input = 'hello {{1 + 2}} world';

      // when
      const simpleTree = parseToSimpleTree(input);

      // then
      expectTree(simpleTree,
        [ 'Feelers', [
          [ 'SimpleTextBlock', 'hello ' ],
          [ 'Insert', [
            [ 'FeelBlock', '1 + 2' ]
          ] ],
          [ 'SimpleTextBlock', ' world' ]
        ] ]
      );
    });


    it('should parse text with empty insert', function() {

      // given
      const input = 'hello {{}} world';

      // when
      const simpleTree = parseToSimpleTree(input);

      // then
      expectTree(simpleTree,
        [ 'Feelers', [
          [ 'SimpleTextBlock', 'hello ' ],
          [ 'EmptyInsert' ],
          [ 'SimpleTextBlock', ' world' ]
        ] ]
      );
    });


    it('should parse conditional spanner', function() {

      // given
      const input = 'hello {{#if true}}world{{/if}}';

      // when
      const simpleTree = parseToSimpleTree(input);

      // then
      expectTree(simpleTree,
        [ 'Feelers', [
          [ 'SimpleTextBlock', 'hello ' ],
          [ 'ConditionalSpanner', [
            [ 'FeelBlock', 'true' ],
            [ 'SimpleTextBlock', 'world' ],
            [ 'ConditionalSpannerClose' ]
          ] ]
        ] ]
      );
    });


    it('should parse loop spanner', function() {

      // given
      const input = 'hello {{#loop [1, 2, 3]}}world{{/loop}}';

      // when
      const simpleTree = parseToSimpleTree(input);

      // then
      expectTree(simpleTree,
        [ 'Feelers', [
          [ 'SimpleTextBlock', 'hello ' ],
          [ 'LoopSpanner', [
            [ 'FeelBlock', '[1, 2, 3]' ],
            [ 'SimpleTextBlock', 'world' ],
            [ 'LoopSpannerClose' ]
          ] ]
        ] ]
      );
    });

  });

});


const expectTree = (node, structure) => {

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
      expectTree(node.children[idx], child);
    });
  }
  else if (!childrenOrContent) { /* empty node, no content or children */ }
  else {
    throw new Error('invalid test structure');
  }

};
