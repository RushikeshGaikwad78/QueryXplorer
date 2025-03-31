import React, { memo, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const QueryEditor = memo(({ value, onChange, disabled = false }: QueryEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setAttribute('role', 'textbox');
      editorRef.current.setAttribute('aria-label', 'SQL Editor');
      editorRef.current.setAttribute('aria-multiline', 'true');
      editorRef.current.setAttribute('aria-describedby', 'sql-editor-desc');
      editorRef.current.setAttribute('aria-placeholder', 'Write your SQL query here...');
    }
  }, []);

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <div>
      {/* Hidden label for screen readers */}
      <label id="sql-editor-label" style={{ position: 'absolute', left: '-9999px' }}>
        SQL Query Editor
      </label>

      {/* Description for screen readers */}
      <p id="sql-editor-desc" style={{ position: 'absolute', left: '-9999px' }}>
        This is a SQL query editor where you can write and edit your SQL queries.
      </p>

      {/* CodeMirror Editor */}
      <div ref={editorRef}>
        <CodeMirror
          value={value}
          height="200px"
          extensions={[
            sql(),
            EditorState.readOnly.of(disabled),
            EditorView.lineWrapping,
          ]}
          theme={oneDark}
          onChange={handleChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
        />
      </div>
    </div>
  );
});

QueryEditor.displayName = 'QueryEditor';

export default QueryEditor;
