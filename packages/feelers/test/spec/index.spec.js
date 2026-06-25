import { expect } from 'chai';

import { evaluate, parse, parseToSimpleTree } from 'feelers';


describe('feelers', function() {

  it('should export <evaluate>', function() {
    expect(evaluate).to.exist;
  });


  it('should export <parse>', function() {
    expect(parse).to.exist;
  });


  it('should export <parseToSimpleTree>', function() {
    expect(parseToSimpleTree).to.exist;
  });

});
