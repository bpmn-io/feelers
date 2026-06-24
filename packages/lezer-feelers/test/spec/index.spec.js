import { expect } from 'chai';

import { buildSimpleTree, parser } from '@bpmn-io/lezer-feelers';


describe('@bpmn-io/lezer-feelers', function() {

  it('should export <parser>', function() {
    expect(parser).to.exist;
  });


  it('should export <buildSimpleTree>', function() {
    expect(buildSimpleTree).to.exist;
  });

});
