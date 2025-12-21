import TestContainer from '../testContainer';
import { FeelersEditor } from '../../src';
import { evaluate } from '../../src/interpreter';
import { initialContext, initialTemplate } from '../testData';

it('should render', async function() {
  TestContainer.cleanup();
  const container  = TestContainer.get();

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