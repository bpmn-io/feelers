import './style';
import { initialContext, initialTemplate } from '../../test/testData';
import { useMemo, useState, useRef, useEffect } from 'preact/hooks';
import FeelersEditor from '../../src/editor';
import evaluate from '../../src/interpreter';

export default function Playground() {

  const [ templateEditorState, setTemplateEditorState ] = useState(initialTemplate);
  const [ templateContext, setTemplateContext ] = useState(JSON.stringify(initialContext, null, 3));
  const [ outputIsInvalid, setOutputIsInvalid ] = useState(false);

  const editorRef = useRef();
  const containerRef = useRef();

  useEffect(() => {

    editorRef.current = new FeelersEditor({
      container: containerRef.current,
      value: initialTemplate,
      onChange: (value) => setTemplateEditorState(value)
    });

  }, [])

  const autoclose = {
    '[': ']',
    '{': '}',
    '(': ')',
    '"': '"',
  }

  const contextJSON = useMemo(() => {
    try {
      return JSON.parse(templateContext);
    } catch (e) {
      return null;
    }
  }, [templateContext]);

  const computedOutput = useMemo(() => {
    if (!contextJSON) {
      setOutputIsInvalid(true);
      return 'invalid JSON';
    }
    else {
      try {
        const evaluation = evaluate(templateEditorState, contextJSON);
        setOutputIsInvalid(false);
        return evaluation;
      } catch (e) {
        setOutputIsInvalid(true);
        return e.message;
      }
    }
  }, [templateEditorState, contextJSON]);

  const onContextKeyDown = (e) => {
    
    if (e.key == 'Tab') {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      target.setRangeText("   ", start, end, "end");

    }

    if (autoclose[e.key]) {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      target.setRangeText(e.key + autoclose[e.key], start, end, "end");
    }

  }

  return (
    <div className="root">
      <div className="col">
        <div ref={containerRef} id="template" style="flex: 1; background-color: #fff; overflow: auto" ></div>
        <textarea
          id="context"
          value={templateContext}
          class={contextJSON ? "" : "invalid"}
          onKeyDown={ (e) => onContextKeyDown(e) }
          onInput={e => setTemplateContext(e.target.value)} />
      </div>
      <div className="col">
        <textarea
          id="output"
          class={!outputIsInvalid ? "" : "invalid"}
          value={computedOutput}
          readonly />
      </div>
    </div>
  );
}
