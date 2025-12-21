import TestContainer from '../testContainer';
import { FeelersEditor } from '../../src';
import { evaluate } from '../../src/interpreter';
import { initialContext, initialTemplate } from '../testData';

// For interactive development, use `npm start` (vitest --ui)
// or `npm run dev` (vitest watch) instead of this single-start mode
const singleStart = false;

describe('CodeEditor', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get();
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