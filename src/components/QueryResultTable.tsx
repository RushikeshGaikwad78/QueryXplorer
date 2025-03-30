import React, { memo } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button,
  Typography,
  Paper
} from '@mui/material';

interface QueryResultTableProps {
  headers: string[];
  rows: any[][];
  onSort: (column: string) => void;
  sortColumn: string;
  sortOrder: string;
  onFilter: () => void;
  filterColumn: string;
  filterOperator: string;
  filterValue: string;
  onFilterColumnChange: (value: string) => void;
  onFilterOperatorChange: (value: string) => void;
  onFilterValueChange: (value: string) => void;
}

const QueryResultTable = memo(({
  headers,
  rows,
  onSort,
  sortColumn,
  sortOrder,
  onFilter,
  filterColumn,
  filterOperator,
  filterValue,
  onFilterColumnChange,
  onFilterOperatorChange,
  onFilterValueChange
}: QueryResultTableProps) => {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Query Results
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel shrink={!!filterColumn}>Column</InputLabel>
          <Select
            value={filterColumn}
            onChange={(e) => onFilterColumnChange(e.target.value)}
            label="Column"
          >
            {headers.map((header, index) => (
              <MenuItem key={index} value={header}>
                {header}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel shrink={!!filterOperator}>Operator</InputLabel>
          <Select 
            value={filterOperator} 
            onChange={(e) => onFilterOperatorChange(e.target.value)} 
            label="Operator"
          >
            <MenuItem value="=">=</MenuItem>
            <MenuItem value="!=">≠</MenuItem>
            <MenuItem value=">">&gt;</MenuItem>
            <MenuItem value="<">&lt;</MenuItem>
            <MenuItem value=">=">≥</MenuItem>
            <MenuItem value="<=">≤</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Value"
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
        />

        <Button variant="contained" onClick={onFilter}>
          Apply Filter
        </Button>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSort(header)}
                >
                  {header} {sortColumn === header ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #ddd',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Paper>
  );
});

QueryResultTable.displayName = 'QueryResultTable';

export default QueryResultTable; 