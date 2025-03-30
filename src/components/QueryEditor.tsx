import React from 'react';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="query-editor">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Enter your SQL query here..."
      />
    </div>
  );
};

export default QueryEditor; 