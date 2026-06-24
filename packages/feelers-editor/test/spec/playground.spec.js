import TestContainer from 'mocha-test-container-support';
import { marked } from 'marked';

import { initialContext, initialTemplate } from '../testData.js';

import { FeelersEditor } from '@bpmn-io/feelers-editor';
import { evaluate } from 'feelers';


const singleStart = window.__env__ && window.__env__.SINGLE_START;


describe('Playground', function() {

  (singleStart ? it.only : it.skip)('should render', async function() {

    const container = TestContainer.get(this);

    Object.assign(container.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: '1000',
      backgroundColor: '#fff'
    });

    let feelers = initialTemplate;
    let context = JSON.stringify(initialContext, null, 2);
    let hostLanguage = null;

    container.innerHTML = `
      <div class="pg-toolbar" style="
        display: flex; align-items: center; gap: 8px;
        padding: 6px 12px; border-bottom: 1px solid #ccc;
        font-size: 13px; font-family: sans-serif; flex-shrink: 0;
      ">
        Host language:
        <button data-lang="" style="padding: 2px 10px; cursor: pointer; font-weight: bold;">None</button>
        <button data-lang="markdown" style="padding: 2px 10px; cursor: pointer;">Markdown</button>
      </div>
      <div style="display: flex; flex: 1; overflow: hidden;">

        <div style="flex: 1; display: flex; flex-direction: column; border-right: 1px solid #ccc;">
          <div style="padding: 4px 8px; font-size: 11px; font-family: monospace; color: #888; border-bottom: 1px solid #eee; flex-shrink: 0;">JSON CONTEXT</div>
          <textarea class="pg-context" style="flex: 1; font-family: monospace; font-size: 13px; resize: none; border: none; outline: none; padding: 8px;"></textarea>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; border-right: 1px solid #ccc;">
          <div style="padding: 4px 8px; font-size: 11px; font-family: monospace; color: #888; border-bottom: 1px solid #eee; flex-shrink: 0;">FEELERS</div>
          <div class="pg-editor" style="flex: 1; overflow: auto;"></div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
          <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; border-bottom: 1px solid #eee;">
            <div style="padding: 4px 8px; font-size: 11px; font-family: monospace; color: #888; border-bottom: 1px solid #eee; flex-shrink: 0;">OUTPUT</div>
            <textarea class="pg-output" style="flex: 1; min-height: 0; font-family: monospace; font-size: 13px; resize: none; border: none; outline: none; padding: 8px; background: #f9f9f9;" readonly></textarea>
          </div>
          <div class="pg-html-wrap" style="flex: 1; min-height: 0; display: none; flex-direction: column;">
            <div style="padding: 4px 8px; font-size: 11px; font-family: monospace; color: #888; border-bottom: 1px solid #eee; flex-shrink: 0;">OUTPUT (HTML)</div>
            <div class="pg-html-output" style="flex: 1; min-height: 0; overflow: auto; padding: 8px; font-size: 14px;"></div>
          </div>
        </div>

      </div>
    `;

    const contextEl = container.querySelector('.pg-context');
    const outputEl = container.querySelector('.pg-output');
    const editorContainer = container.querySelector('.pg-editor');
    const htmlWrap = container.querySelector('.pg-html-wrap');
    const htmlOutputEl = container.querySelector('.pg-html-output');

    contextEl.value = context;

    createEditor(editorContainer, feelers, hostLanguage);

    container.querySelector('.pg-toolbar').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lang]');
      if (!btn) return;

      hostLanguage = btn.dataset.lang || null;

      updateToolbar(container, hostLanguage);

      editorContainer.innerHTML = '';
      createEditor(editorContainer, feelers, hostLanguage);

      htmlWrap.style.display = hostLanguage === 'markdown' ? 'flex' : 'none';

      updateOutput();
    });

    contextEl.addEventListener('input', (e) => {
      context = e.target.value;
      updateOutput();
    });

    function createEditor(editorEl, value, lang) {
      return new FeelersEditor({
        container: editorEl,
        value,
        hostLanguage: lang || undefined,
        onChange: (value) => {
          feelers = value;
          updateOutput();
        }
      });
    }

    function updateOutput() {
      try {
        const ctx = JSON.parse(context);
        const text = evaluate(feelers, ctx, {
          debug: true,
          buildDebugString: (e) => `[ERROR: ${e.message}]`
        }) ?? '';

        outputEl.value = text;
        outputEl.style.color = '';

        if (hostLanguage === 'markdown') {
          htmlOutputEl.innerHTML = marked.parse(text);
        }
      } catch (e) {
        outputEl.value = e.message;
        outputEl.style.color = 'red';
        htmlOutputEl.innerHTML = '';
      }
    }

    function updateToolbar(el, lang) {
      el.querySelectorAll('[data-lang]').forEach(btn => {
        btn.style.fontWeight = (btn.dataset.lang || null) === lang ? 'bold' : 'normal';
      });
    }

    updateOutput();
  });

});
