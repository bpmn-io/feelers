import { FeelersEditor } from '../../src';
import evaluate from '../../src/interpreter';
import TestContainer from 'mocha-test-container-support';
import { initialContext, initialTemplate } from '../testData';


// eslint-disable-next-line no-undef
const singleStart = window.__env__ && window.__env__.SINGLE_START;

describe('CodeEditor', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  (singleStart ? it.only : it.skip)('should render', async function() {

    // when
    const editor = new FeelersEditor({
      container: container,
      value: initialTemplate,
      lineWrap: true,
    });

    // then
    expect(editor).to.exist;
    console.log('evaluate():\n\n' + evaluate(initialTemplate, initialContext));

  });

});