import { expect } from 'chai';

import { FeelersEditor, evaluate, parser } from 'feelers';


describe('feelers', function() {

  it('should export <FeelersEditor>', function() {
    expect(FeelersEditor).to.exist;
  });


  it('should export <evaluate>', function() {
    expect(evaluate).to.exist;
  });


  it('should export <parser>', function() {
    expect(parser).to.exist;
  });

});