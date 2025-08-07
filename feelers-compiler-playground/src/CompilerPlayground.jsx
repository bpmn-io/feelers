import './style.css';
import { useMemo, useState, useRef, useEffect } from 'preact/hooks';
import FeelersEditor from '../../src/editor';
import { compile } from '../../src/compiler';
import FeelEditor from '@bpmn-io/feel-editor';
import * as feelin from 'feelin';
import { initialTemplate, initialContext } from '../../test/testData';

export default function CompilerPlayground() {

  const [ feelersTemplate, setFeelersTemplate ] = useState('');
  const [ compiledFeel, setCompiledFeel ] = useState('');
  const [ feelContext, setFeelContext ] = useState('{}');
  const [ evaluationResult, setEvaluationResult ] = useState('');
  const [ compileError, setCompileError ] = useState('');
  const [ evalError, setEvalError ] = useState('');

  const feelersEditorRef = useRef();
  const feelEditorRef = useRef();
  const feelersContainerRef = useRef();
  const feelContainerRef = useRef();

  useEffect(() => {
    // Prevent double initialization
    if (feelersEditorRef.current || feelEditorRef.current) {
      return;
    }

    // Initialize Feelers editor
    feelersEditorRef.current = new FeelersEditor({
      container: feelersContainerRef.current,
      hostLanguage: 'markdown',
      darkMode: false,
      value: initialTemplate,
      onChange: (value) => setFeelersTemplate(value)
    });

    // Initialize FEEL editor - use default configuration like the tests show
    feelEditorRef.current = new FeelEditor({
      container: feelContainerRef.current,
      value: '',
      readOnly: true
    });

    setFeelersTemplate(initialTemplate);
    setFeelContext(JSON.stringify(initialContext, null, 2));

    return () => {
      if (feelersEditorRef.current && typeof feelersEditorRef.current.destroy === 'function') {
        feelersEditorRef.current.destroy();
        feelersEditorRef.current = null;
      }
      if (feelEditorRef.current && typeof feelEditorRef.current.destroy === 'function') {
        feelEditorRef.current.destroy();
        feelEditorRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compile Feelers template to FEEL
  const compiledFeelExpression = useMemo(() => {
    if (!feelersTemplate.trim()) {
      setCompileError('');
      return '';
    }

    try {
      const result = compile(feelersTemplate);
      setCompileError('');
      return result;
    } catch (error) {
      setCompileError(error.message);
      return '';
    }
  }, [ feelersTemplate ]);

  // Update FEEL editor when compiled expression changes
  useEffect(() => {
    if (feelEditorRef.current && compiledFeelExpression !== compiledFeel) {
      // Format the FEEL expression for better readability across multiple lines
      let formattedFeel = compiledFeelExpression;

      if (formattedFeel) {
        formattedFeel = formattedFeel
          // Add line breaks after string concatenations
          .replace(/\s*\+\s*/g, ' +\n')
          // Add line breaks after commas in function calls
          .replace(/,\s*/g, ',\n  ')
          // Add line breaks after control keywords
          .replace(/\s+(then|else|return)\s+/g, '\n$1\n  ')
          // Add line breaks after 'for' and 'in' keywords
          .replace(/\s+(for|in)\s+/g, '\n$1 ')
          // Add line breaks after 'if' keyword
          .replace(/\s+if\s+/g, '\nif ')
          // Clean up excessive line breaks
          .replace(/\n\s*\n/g, '\n')
          // Indent nested expressions
          .replace(/^(.+)$/gm, (match, line) => {
            const depth = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
            return '  '.repeat(Math.max(0, depth)) + line.trim();
          });
      }

      feelEditorRef.current.setValue(formattedFeel);
      setCompiledFeel(compiledFeelExpression);
    }
  }, [ compiledFeelExpression, compiledFeel ]);

  // Parse context JSON
  const contextJSON = useMemo(() => {
    try {
      return JSON.parse(feelContext);
    } catch (e) {
      return null;
    }
  }, [ feelContext ]);

  // Evaluate FEEL expression
  const evaluatedResult = useMemo(() => {
    if (!compiledFeelExpression || !contextJSON) {
      setEvalError('');
      return '';
    }

    try {
      const result = feelin.evaluate(compiledFeelExpression, contextJSON);
      setEvalError('');
      return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    } catch (error) {
      setEvalError(error.message);
      return '';
    }
  }, [ compiledFeelExpression, contextJSON ]);

  useEffect(() => {
    setEvaluationResult(evaluatedResult);
  }, [ evaluatedResult ]);

  const handleContextChange = (e) => {
    setFeelContext(e.target.value);
  };

  return (
    <div className="playground">
      <header className="playground-header">
        <h1>Feelers Compiler Playground</h1>
        <p>Test the Feelers template compiler and see the generated FEEL expressions</p>
      </header>

      <div className="playground-content">
        <div className="panel">
          <h3>Feelers Template</h3>
          <div ref={feelersContainerRef} className="editor-container" />
          {compileError && (
            <div className="error-message">
              <strong>Compilation Error:</strong> {compileError}
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Context Data (JSON)</h3>
          <textarea
            value={feelContext}
            onChange={handleContextChange}
            className={`context-editor ${!contextJSON ? 'invalid' : ''}`}
            placeholder="Enter JSON context data..."
          />
          {!contextJSON && feelContext.trim() && (
            <div className="error-message">
              <strong>Invalid JSON:</strong> Please check your context data format
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Compiled FEEL Expression</h3>
          <div ref={feelContainerRef} className="editor-container" />
          <div className="info-message">
            This FEEL expression is automatically generated from your Feelers template
          </div>
        </div>

        <div className="panel">
          <h3>Evaluation Result</h3>
          <textarea
            value={evaluationResult}
            readOnly
            className={`result-output ${evalError ? 'invalid' : ''}`}
            placeholder="Result will appear here..."
          />
          {evalError && (
            <div className="error-message">
              <strong>Evaluation Error:</strong> {evalError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
