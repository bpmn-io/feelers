import { FeelersEditor } from '../../src';
import TestContainer from 'mocha-test-container-support';
import { EditorSelection } from '@codemirror/state';
import { diagnosticCount, forceLinting } from '@codemirror/lint';
import { currentCompletions, startCompletion } from '@codemirror/autocomplete';
import { domify } from 'min-dom';

describe('FeelersEditor', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  it('should render', async function() {

    // when
    const initialValue = 'There are {{= 2 + 2}} apples in the basket.';

    const editor = new FeelersEditor({
      container,
      value: initialValue
    });

    // then
    expect(editor).to.exist;
  });


  it('should allow content attribute extensions', async function() {

    // when
    const initialValue = 'There are {{= 2 + 2}} apples in the basket.';

    const editor = new FeelersEditor({
      container,
      value: initialValue,
      contentAttributes: { 'data-foo': 'bar' }
    });

    // then
    expect(editor).to.exist;

    const content = container.querySelector('.cm-content');
    expect(content).to.exist;
    expect(content.getAttribute('data-foo')).to.equal('bar');
  });

});


// todo: convert those ripped tests
describe.skip('CodeEditor', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  it('should use supplied document', async function() {

    // when
    const initialValue = 'Hello World!';
    const editor = new FeelEditor({
      container,
      value: initialValue
    });

    // then
    expect(editor).to.exist;
    expect(editor._cmEditor.state.doc.toString()).to.equal('Hello World!');
  });


  describe('getter', function() {

    it('should return selection state', function() {

      // given
      const initialValue = '[variable1, variable2]';
      const editor = new FeelEditor({
        container,
        value: initialValue
      });

      // editor._cmEditor.focus();
      editor._cmEditor.dispatch({
        selection: EditorSelection.single(0, 5)
      });

      // when

      const selection = editor.getSelection();

      // then
      expect(selection).to.exist;
      expect(selection.ranges).to.have.length(1);
      expect(selection.ranges[0].from).to.equal(0);
      expect(selection.ranges[0].to).to.equal(5);

    });

  });


  describe('#setValue', function() {

    it('should accept external change', async function() {

      // given
      const initialValue = 'Hello World!';
      const editor = new FeelEditor({
        container,
        value: initialValue
      });

      // when
      editor.setValue('Changed');

      // then
      expect(editor._cmEditor.state.doc.toString()).to.equal('Changed');
    });
  });


  describe('#focus', function() {

    it('should focus', async function() {

      // given
      const editor = new FeelEditor({
        container
      });

      // assume
      expect(editor._cmEditor.hasFocus).to.be.false;

      // when
      editor.focus();

      // then
      expect(editor._cmEditor.hasFocus).to.be.true;
    });


    it('should not focus for read-only', function() {

      // when
      const editor = new FeelEditor({
        container,
        readOnly: true
      });

      // when
      editor.focus();

      // then
      expect(editor._cmEditor.hasFocus).to.be.false;
    });


    it('should scroll into view', function() {

      // given
      const scrollContainer = domify(`
        <div style="height: 100px; overflow: auto;">
          <div style="height: 1000px"></div>
          <div id="editor-container"></div>
        </div>`);
      const editorContainer = scrollContainer.querySelector('#editor-container');
      container.appendChild(scrollContainer);

      const editor = new FeelEditor({
        container: editorContainer
      });

      // assume
      expect(scrollContainer.scrollTop).to.be.eql(0);
      expect(editor._cmEditor.hasFocus).to.be.false;

      // when
      editor.focus();

      // then
      expect(scrollContainer.scrollTop).to.be.greaterThan(0);
      expect(editor._cmEditor.hasFocus).to.be.true;
    });


    it('should set caret position', async function() {

      // given
      const editor = new FeelEditor({
        container,
        value: 'Foobar'
      });

      // assume
      expect(editor._cmEditor.hasFocus).to.be.false;

      // when
      editor.focus(2);

      // then
      expect(editor._cmEditor.hasFocus).to.be.true;

      const selection = editor._cmEditor.state.selection;
      const range = selection.ranges[selection.mainIndex];
      expect(range.from).to.eql(2);
      expect(range.to).to.eql(2);
    });


    it('should set caret to end', async function() {

      // given
      const editor = new FeelEditor({
        container,
        value: 'Foo'
      });

      // assume
      expect(editor._cmEditor.hasFocus).to.be.false;

      // when
      editor.focus(Infinity);

      // then
      expect(editor._cmEditor.hasFocus).to.be.true;

      const selection = editor._cmEditor.state.selection;
      const range = selection.ranges[selection.mainIndex];
      expect(range.from).to.eql(3);
      expect(range.to).to.eql(3);
    });

  });


  describe('#setVariables', function() {

    it('should set variables', async function() {

      // given
      const editor = new FeelEditor({
        container
      });

      // then
      expect(() => {
        editor.setVariables([
          {
            name: 'Variable1',
            info: 'Written in Service Task',
            detail: 'Process_1'
          },
          {
            name: 'Variable2',
            info: 'Written in Service Task',
            detail: 'Process_1'
          }
        ]);
      }).not.to.throw();
    });


    it('should suggest updated variables', async function() {

      const initalValue = 'fooba';

      const editor = new FeelEditor({
        container,
        value: initalValue
      });

      const cm = getCm(editor);

      // move cursor to the end
      select(cm, 5);

      // when
      editor.setVariables([
        { name: 'foobar' },
        { name: 'baz' }
      ]);
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.have.eql('foobar');
      });
    });


    it('should change suggestion when variables are updated', async function() {

      const initalValue = 'fooba';

      const editor = new FeelEditor({
        container,
        value: initalValue,
        variables: [
          { name: 'foobar' },
          { name: 'baz' }
        ]
      });

      const cm = getCm(editor);

      // move cursor to the end
      select(cm, 5);

      // assume
      startCompletion(cm);
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.eql('foobar');
      });

      // when
      editor.setVariables([
        { name: 'foobaz' }
      ]);
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.eql('foobaz');
      });
    });
  });


  describe('callbacks', function() {

    it('should call onChange', async function() {

      // given
      const onChange = sinon.spy();
      const editor = new FeelEditor({
        container,
        onChange
      });

      // when
      editor._cmEditor.dispatch({
        changes: {
          from: 0,
          to: 0,
          insert: 'a',
        }
      });

      // then
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.have.been.calledWith('a');
    });


    it('should call onKeyDown', async function() {

      // given
      const onKeyDown = sinon.spy();
      const editor = new FeelEditor({
        container,
        onKeyDown
      });

      // when
      // eslint-disable-next-line no-undef
      const event = new KeyboardEvent('keydown');
      editor._cmEditor.contentDOM.dispatchEvent(event);

      // then
      expect(onKeyDown).to.have.been.calledOnce;
      expect(onKeyDown).to.have.been.calledWith(event);
    });

  });


  describe('lint', function() {

    it('should not highlight empty document', function(done) {
      const initalValue = '';

      const editor = new FeelEditor({
        container,
        value: initalValue
      });

      const cm = getCm(editor);

      // when
      forceLinting(cm);

      // then
      // update done async
      setTimeout(() => {
        expect(diagnosticCount(cm.state)).to.eql(0);
        done();
      }, 0);

    });


    it('should highlight unexpected operations', function(done) {
      const initalValue = '= 15';

      const editor = new FeelEditor({
        container,
        value: initalValue
      });

      const cm = getCm(editor);

      // when
      forceLinting(cm);

      // then
      // update done async
      setTimeout(() => {
        expect(diagnosticCount(cm.state)).to.eql(1);
        done();
      }, 0);

    });


    it('should highlight missing operations', function(done) {
      const initalValue = '15 == 15';

      const editor = new FeelEditor({
        container,
        value: initalValue
      });

      const cm = getCm(editor);

      // when
      forceLinting(cm);

      // then
      // update done async
      setTimeout(() => {
        expect(diagnosticCount(cm.state)).to.eql(1);
        done();
      }, 0);

    });


    it('should call onLint with errors', function(done) {
      const initalValue = '= 15';
      const onLint = sinon.spy();

      const editor = new FeelEditor({
        container,
        value: initalValue,
        onLint
      });

      const cm = getCm(editor);

      // when
      forceLinting(cm);

      // then
      // update done async
      setTimeout(() => {

        expect(onLint).to.have.been.calledOnce;
        expect(onLint).to.have.been.calledWith(sinon.match.array);
        expect(onLint.args[0][0]).to.have.length(1);

        done();
      }, 0);

    });


    it('should call onLint without errors', function(done) {
      const initalValue = '15';
      const onLint = sinon.spy();

      const editor = new FeelEditor({
        container,
        value: initalValue,
        onLint
      });

      const cm = getCm(editor);

      // when
      forceLinting(cm);

      // then
      // update done async
      setTimeout(() => {

        expect(onLint).to.have.been.calledOnce;
        expect(onLint).to.have.been.calledWith(sinon.match.array);
        expect(onLint.args[0][0]).to.have.length(0);

        done();
      }, 0);

    });

  });


  describe('autocompletion', function() {

    it('should suggest applicable variables', function(done) {
      const initalValue = 'fooba';
      const variables = [
        { name: 'foobar' },
        { name: 'baz' }
      ];

      const editor = new FeelEditor({
        container,
        value: initalValue,
        variables
      });

      const cm = getCm(editor);

      // move cursor to the end
      select(cm, 5);

      // when
      startCompletion(cm);

      // then
      // update done async
      expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.have.eql('foobar');
        done();
      });

    });


    it('should suggest built-ins', function(done) {
      const initalValue = '';
      const variables = [];

      const editor = new FeelEditor({
        container,
        value: initalValue,
        variables
      });

      const cm = getCm(editor);

      // when
      startCompletion(cm);

      // then
      // update done async
      expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(90);
        expect(completions[0].label).to.have.eql('abs()');
        done();
      });

    });


    it('should suggest snippets', function(done) {
      const initalValue = 'fo';
      const variables = [];

      const editor = new FeelEditor({
        container,
        value: initalValue,
        variables
      });

      const cm = getCm(editor);

      // move cursor to the end
      select(cm, 2);

      // when
      startCompletion(cm);

      // then
      // update done async
      expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions[0].label).to.have.eql('for');
        done();
      });

    });


    describe('position tooltips inside container', function() {

      const initalValue = 'fooba';
      const variables = [
        { name: 'foobar',
          info: () => {
            const html = domify('<div id="oversizedDescription" style="width: 100px; height: 100px"><div>');
            return html;
          }
        }
      ];

      let tooltipContainer;
      let feelContainer;


      beforeEach(() => {
        tooltipContainer = domify(`<div id="tooltipContainer" style="width: 500px; height: 500px; position: relative;">
                                    <div id="feelEditor" style="width: 50px; height: 20px; position: absolute; bottom: 0; right: 0;"></div>
                                  </div>`);
        feelContainer = tooltipContainer.querySelector('#feelEditor');
        container.appendChild(tooltipContainer);

        tooltipContainer.scrollIntoView();
      });


      it('should position tooltips inside container', function(done) {
        const editor = new FeelEditor({
          container: feelContainer,

          tooltipContainer: tooltipContainer,
          value: initalValue,
          variables
        });

        const cm = editor._cmEditor;

        // move cursor to the end
        cm.dispatch({ selection: { anchor: 5, head: 5 } });

        // when
        startCompletion(cm);

        // then
        // update done async
        setTimeout(() => {
          const tooltip = container.querySelector('#oversizedDescription');

          const tooltipBB = tooltip.getBoundingClientRect();
          const containerBB = tooltipContainer.getBoundingClientRect();

          expect(tooltip).to.exist;
          expect(tooltipBB.bottom).to.be.below(containerBB.bottom);

          done();
        }, 100);

      });


      it('should position tooltips inside container defined by CSS selector', function(done) {
        const editor = new FeelEditor({
          container: feelContainer,

          tooltipContainer: '#tooltipContainer',
          value: initalValue,
          variables
        });

        const cm = editor._cmEditor;

        // move cursor to the end
        cm.dispatch({ selection: { anchor: 5, head: 5 } });

        // when
        startCompletion(cm);

        // then
        // update done async
        setTimeout(() => {
          const tooltip = container.querySelector('#oversizedDescription');

          const tooltipBB = tooltip.getBoundingClientRect();
          const containerBB = tooltipContainer.getBoundingClientRect();

          expect(tooltip).to.exist;
          expect(tooltipBB.bottom).to.be.below(containerBB.bottom);

          done();
        }, 100);

      });


      it('should use window by default', function(done) {
        const editor = new FeelEditor({
          container: feelContainer,
          value: initalValue,
          variables
        });

        const cm = editor._cmEditor;

        // move cursor to the end
        cm.dispatch({ selection: { anchor: 5, head: 5 } });

        // when
        startCompletion(cm);

        // then
        // update done async
        setTimeout(() => {
          const tooltip = container.querySelector('#oversizedDescription');

          const tooltipBB = tooltip.getBoundingClientRect();
          const containerBB = tooltipContainer.getBoundingClientRect();

          expect(tooltip).to.exist;
          expect(tooltipBB.bottom).to.be.above(containerBB.bottom);

          done();
        }, 100);

      });

    });

  });

});


// helper //////////////////////

function select(editor, anchor, head = anchor) {
  const cm = getCm(editor);

  cm.dispatch({
    selection: {
      anchor,
      head
    }
  });
}

function getCm(editor) {
  return editor._cmEditor || editor;
}

async function expectEventually(fn) {
  const nextFrame = () => new Promise(resolve => {
    // eslint-disable-next-line no-undef
    requestAnimationFrame(resolve);
  });

  let e, i = 10;
  do {
    try {
      await nextFrame();
      await fn();
      return;
    } catch (error) {
      e = error;
    }
  } while (i--);

  throw e;
}