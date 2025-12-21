import { describe, it, beforeEach, expect, vi } from 'vitest';
import { FeelersEditor } from '../../src';
import TestContainer from '../testContainer';
import { EditorSelection } from '@codemirror/state';
import { diagnosticCount, forceLinting } from '@codemirror/lint';
import { currentCompletions, startCompletion } from '@codemirror/autocomplete';
import { domify } from 'min-dom';

describe('FeelersEditor', function() {

  let container;

  beforeEach(function() {
    TestContainer.cleanup();
    container = TestContainer.get();
  });

  it('should render', async function() {

    // when
    const initialValue = 'There are {{= 2 + 2}} apples in the basket.';

    const editor = new FeelersEditor({
      container,
      value: initialValue
    });

    // then
    expect(editor).toBeDefined();
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
  expect(editor).toBeDefined();

  const content = container.querySelector('.cm-content');
  expect(content).not.toBeNull();
  expect(content.getAttribute('data-foo')).toBe('bar');
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
    expect(editor).toBeDefined();
    expect(editor._cmEditor.state.doc.toString()).toBe('Hello World!');
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
      expect(selection).toBeDefined();
      expect(selection.ranges).toHaveLength(1);
      expect(selection.ranges[0].from).toBe(0);
      expect(selection.ranges[0].to).toBe(5);

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
      expect(editor._cmEditor.state.doc.toString()).toBe('Changed');
    });
  });


  describe('#focus', function() {

    it('should focus', async function() {

      // given
      const editor = new FeelEditor({
        container
      });

      // assume
      expect(editor._cmEditor.hasFocus).toBe(false);

      // when
      editor.focus();

  // then
  expect(editor._cmEditor.hasFocus).toBe(true);
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
      expect(editor._cmEditor.hasFocus).toBe(false);
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
      expect(scrollContainer.scrollTop).toBe(0);
      expect(editor._cmEditor.hasFocus).toBe(false);

      // when
      editor.focus();

      // then
      expect(scrollContainer.scrollTop).toBeGreaterThan(0);
      expect(editor._cmEditor.hasFocus).toBe(true);
    });


    it('should set caret position', async function() {

      // given
      const editor = new FeelEditor({
        container,
        value: 'Foobar'
      });

      // assume
      expect(editor._cmEditor.hasFocus).toBe(false);

      // when
      editor.focus(2);

      // then
      expect(editor._cmEditor.hasFocus).toBe(true);

      const selection = editor._cmEditor.state.selection;
      const range = selection.ranges[selection.mainIndex];
      expect(range.from).toBe(2);
      expect(range.to).toBe(2);
    });


    it('should set caret to end', async function() {

      // given
      const editor = new FeelEditor({
        container,
        value: 'Foo'
      });

      // assume
      expect(editor._cmEditor.hasFocus).toBe(false);

      // when
      editor.focus(Infinity);

      // then
      expect(editor._cmEditor.hasFocus).toBe(true);

      const selection = editor._cmEditor.state.selection;
      const range = selection.ranges[selection.mainIndex];
      expect(range.from).toBe(3);
      expect(range.to).toBe(3);
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
      }).not.toThrow();
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
        expect(completions).toHaveLength(1);
        expect(completions[0].label).toBe('foobar');
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
        expect(completions).toHaveLength(1);
        expect(completions[0].label).toBe('foobar');
      });

      // when
      editor.setVariables([
        { name: 'foobaz' }
      ]);
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).toHaveLength(1);
        expect(completions[0].label).toBe('foobaz');
      });
    });
  });


  describe('callbacks', function() {

    it('should call onChange', async function() {

      // given
      const onChange = vi.fn();
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
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('a');
    });


    it('should call onKeyDown', async function() {

      // given
      const onKeyDown = vi.fn();
      const editor = new FeelEditor({
        container,
        onKeyDown
      });

      // when
      const event = new KeyboardEvent('keydown');
      editor._cmEditor.contentDOM.dispatchEvent(event);

      // then
      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(onKeyDown).toHaveBeenCalledWith(event);
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
      expect(diagnosticCount(cm.state)).toBe(0);
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
      expect(diagnosticCount(cm.state)).toBe(1);
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
      expect(diagnosticCount(cm.state)).toBe(1);
        done();
      }, 0);

    });


    it('should call onLint with errors', function(done) {
      const initalValue = '= 15';
      const onLint = vi.fn();

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

        expect(onLint).toHaveBeenCalledTimes(1);
        expect(onLint).toHaveBeenCalledWith(expect.any(Array));
        expect(onLint.mock.calls[0][0]).toHaveLength(1);

        done();
      }, 0);

    });


    it('should call onLint without errors', function(done) {
      const initalValue = '15';
      const onLint = vi.fn();

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

        expect(onLint).toHaveBeenCalledTimes(1);
        expect(onLint).toHaveBeenCalledWith(expect.any(Array));
        expect(onLint.mock.calls[0][0]).toHaveLength(0);

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
        expect(completions).toHaveLength(1);
        expect(completions[0].label).toBe('foobar');
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
        expect(completions).toHaveLength(90);
        expect(completions[0].label).toBe('abs()');
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
        expect(completions[0].label).toBe('for');
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

          expect(tooltip).not.toBeNull();
          expect(tooltipBB.bottom).toBeLessThan(containerBB.bottom);

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

          expect(tooltip).not.toBeNull();
          expect(tooltipBB.bottom).toBeLessThan(containerBB.bottom);

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

          expect(tooltip).not.toBeNull();
          expect(tooltipBB.bottom).toBeGreaterThan(containerBB.bottom);

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