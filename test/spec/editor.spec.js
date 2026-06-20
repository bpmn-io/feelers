import { expect } from 'chai';
import { spy } from 'sinon';

import { FeelersEditor } from '../../src';
import TestContainer from 'mocha-test-container-support';
import { EditorSelection } from '@codemirror/state';
import { forceLinting, forEachDiagnostic } from '@codemirror/lint';
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


  it('should use supplied document', async function() {

    // when
    const initialValue = 'Hello {{= name}}!';

    const editor = new FeelersEditor({
      container,
      value: initialValue
    });

    // then
    expect(editor).to.exist;
    expect(editor._cmEditor.state.doc.toString()).to.equal('Hello {{= name}}!');
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


  describe('#getSelection', function() {

    it('should return selection state', function() {

      // given
      const initialValue = 'Hello {{= name}}!';
      const editor = new FeelersEditor({
        container,
        value: initialValue
      });

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
      const initialValue = 'Hello {{= name}}!';
      const editor = new FeelersEditor({
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
      const editor = new FeelersEditor({
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

      // given
      const editor = new FeelersEditor({
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

      const editor = new FeelersEditor({
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
      const editor = new FeelersEditor({
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
      const editor = new FeelersEditor({
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


  describe('callbacks', function() {

    it('should call onChange', async function() {

      // given
      const onChange = spy();
      const editor = new FeelersEditor({
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
      const onKeyDown = spy();
      const editor = new FeelersEditor({
        container,
        onKeyDown
      });

      // when
      const event = new KeyboardEvent('keydown');
      editor._cmEditor.contentDOM.dispatchEvent(event);

      // then
      expect(onKeyDown).to.have.been.calledOnce;
      expect(onKeyDown).to.have.been.calledWith(event);
    });

  });


  describe('lint', function() {

    it('should not highlight empty document', async function() {

      // given
      const editor = new FeelersEditor({
        container,
        value: ''
      });

      // when
      const diagnostics = await forceLint(editor);

      // then
      expect(diagnostics).to.be.empty;
    });


    it('should highlight empty inserts', async function() {

      // given
      const editor = new FeelersEditor({
        container,
        value: '{{}}'
      });

      // when
      const diagnostics = await forceLint(editor);

      // then
      expect(diagnostics).to.have.length(1);
    });


    describe('should call onLint', function() {

      it('with errors', async function() {

        // given
        const onLint = spy();
        const editor = new FeelersEditor({
          container,
          value: '{{}}',
          onLint
        });

        // when
        await forceLint(editor);

        // then
        expect(onLint).to.have.been.calledOnce;
        expect(onLint.args[0][0]).to.have.length(1);
      });


      it('without errors', async function() {

        // given
        const onLint = spy();
        const editor = new FeelersEditor({
          container,
          value: 'Hello World',
          onLint
        });

        // when
        await forceLint(editor);

        // then
        expect(onLint).to.have.been.calledOnce;
        expect(onLint.args[0][0]).to.be.empty;
      });

    });


    it('should emit as <lint> event', async function() {

      // given
      const lintSpy = spy(({ diagnostics }) => {
        expect(diagnostics).to.have.length(1);
      });

      const editor = new FeelersEditor({
        container,
        value: '{{}}'
      });

      editor.on('lint', lintSpy);

      // when
      await forceLint(editor);

      // then
      expect(lintSpy).to.have.been.calledOnce;

      // and when
      editor.off('lint', lintSpy);

      // when
      await forceLint(editor);

      // then
      // no additional call to <lint>
      expect(lintSpy).to.have.been.calledOnce;
    });

  });

});


// helper //////////////////////

function getCm(editor) {
  return editor._cmEditor || editor;
}

function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function forceLint(editor) {
  const cm = getCm(editor);

  forceLinting(cm);

  await wait();

  const diagnostics = [];
  forEachDiagnostic(cm.state, d => diagnostics.push(d));

  return diagnostics;
}
