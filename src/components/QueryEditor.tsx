import React from 'react';
import { TextField } from '@mui/material';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ value, onChange, disabled = false }) => {
  return (
    <TextField
      fullWidth
      multiline
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter SQL query..."
      disabled={disabled}
      sx={{ 
        mb: 2,
        width: '100%',
        '& .MuiInputBase-root': {
          fontFamily: 'monospace',
          backgroundColor: 'background.paper',
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }
      }}
    />
  );
};

export default QueryEditor; 