import { expect } from 'chai';

import { feelersLinter } from '@bpmn-io/feelers-lint';


describe('@bpmn-io/feelers-lint', function() {

  it('should export <feelersLinter>', function() {
    expect(feelersLinter).to.exist;
  });

});
