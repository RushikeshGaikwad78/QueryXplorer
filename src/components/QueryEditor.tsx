import React, { memo } from 'react';
import TextField from '@mui/material/TextField';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const QueryEditor = memo(({ value, onChange, disabled = false }: QueryEditorProps) => {
  // Use direct handler to avoid closure creation on each render
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <TextField
      fullWidth
      multiline
      rows={4}
      value={value}
      onChange={handleChange}
      placeholder="Enter SQL query..."
      disabled={disabled}
      variant="outlined"
      sx={{ 
        mb: 2,
        '& .MuiInputBase-root': {
          fontFamily: 'monospace',
          backgroundColor: 'background.paper',
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }
      }}
    />
  );
});

QueryEditor.displayName = 'QueryEditor';

export default QueryEditor;