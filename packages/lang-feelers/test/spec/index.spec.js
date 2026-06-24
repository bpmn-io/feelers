import { expect } from 'chai';

import { feelersLanguage } from '@bpmn-io/lang-feelers';


describe('@bpmn-io/lang-feelers', function() {

  it('should export <feelersLanguage>', function() {
    expect(feelersLanguage).to.exist;
  });


  it('should create language support', function() {

    // when
    const lang = feelersLanguage();

    // then
    expect(lang).to.exist;
  });

});
