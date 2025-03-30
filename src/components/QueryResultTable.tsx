import { memo, useCallback } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


// Component props with explicit types
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

// Table headers component to optimize rendering
const TableHeaders = memo(({ 
  headers, 
  sortColumn, 
  sortOrder, 
  onSort 
}: {
  headers: string[];
  sortColumn: string;
  sortOrder: string;
  onSort: (column: string) => void;
}) => (
  <tr>
    {headers.map((header, index) => (
      <th 
        key={index} 
        style={{ 
          padding: '12px', 
          textAlign: 'left', 
          borderBottom: '1px solid #ddd',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          position: 'sticky',
          top: 0,
          background: 'inherit',
          fontWeight: 600
        }}
        onClick={() => onSort(header)}
      >
        {header} {sortColumn === header ? (sortOrder === "asc" ? "↑" : "↓") : ""}
      </th>
    ))}
  </tr>
));

TableHeaders.displayName = 'TableHeaders';

// Table body component to optimize rendering
const TableRows = memo(({ 
  rows, 
  headers 
}: {
  rows: any[][];
  headers: string[];
}) => (
  <>
    {rows.length === 0 ? (
      <tr>
        <td 
          colSpan={headers.length}
          style={{ 
            padding: '16px', 
            textAlign: 'center' 
          }}
        >
          No results found
        </td>
      </tr>
    ) : (
      rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td 
              key={cellIndex} 
              style={{ 
                padding: '8px 12px', 
                borderBottom: '1px solid #ddd',
                whiteSpace: 'nowrap'
              }}
            >
              {cell}
            </td>
          ))}
        </tr>
      ))
    )}
  </>
));

TableRows.displayName = 'TableRows';

// Filter controls component to optimize rendering
const FilterControls = memo(({
  headers,
  filterColumn,
  filterOperator,
  filterValue,
  onFilterColumnChange,
  onFilterOperatorChange,
  onFilterValueChange,
  onFilter
}: {
  headers: string[];
  filterColumn: string;
  filterOperator: string;
  filterValue: string;
  onFilterColumnChange: (value: string) => void;
  onFilterOperatorChange: (value: string) => void;
  onFilterValueChange: (value: string) => void;
  onFilter: () => void;
}) => (
  <Box sx={{ 
    display: 'flex', 
    gap: 2, 
    mb: 2, 
    flexWrap: 'wrap',
    alignItems: 'flex-end' 
  }}>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="filter-column-label">Column</InputLabel>
      <Select
        labelId="filter-column-label"
        value={filterColumn}
        onChange={(e) => onFilterColumnChange(e.target.value as string)}
        label="Column"
      >
        {headers.map((header, index) => (
          <MenuItem key={index} value={header}>{header}</MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl size="small" sx={{ minWidth: 100 }}>
      <InputLabel id="filter-operator-label">Operator</InputLabel>
      <Select 
        labelId="filter-operator-label"
        value={filterOperator} 
        onChange={(e) => onFilterOperatorChange(e.target.value as string)}
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
      size="small"
      label="Value"
      value={filterValue}
      onChange={(e) => onFilterValueChange(e.target.value)}
    />

    <Button 
      variant="contained" 
      onClick={onFilter}
      size="medium"
    >
      Apply Filter
    </Button>
  </Box>
));

FilterControls.displayName = 'FilterControls';

// Main component with extensive memoization
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
  // Memoized handler for sorting
  const handleSort = useCallback((column: string) => {
    onSort(column);
  }, [onSort]);

  return (
    <Box 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        backgroundColor: 'background.paper',
        boxShadow: 1,
        borderRadius: 1
      }}
    >
      <Typography variant="h6" gutterBottom>
        Query Results
      </Typography>

      <FilterControls 
        headers={headers}
        filterColumn={filterColumn}
        filterOperator={filterOperator}
        filterValue={filterValue}
        onFilterColumnChange={onFilterColumnChange}
        onFilterOperatorChange={onFilterOperatorChange}
        onFilterValueChange={onFilterValueChange}
        onFilter={onFilter}
      />

      <Box 
        sx={{ 
          overflowX: 'auto',
          maxHeight: '50vh',
          overflowY: 'auto'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <TableHeaders 
              headers={headers} 
              sortColumn={sortColumn} 
              sortOrder={sortOrder} 
              onSort={handleSort}
            />
          </thead>
          <tbody>
            <TableRows rows={rows} headers={headers} />
          </tbody>
        </table>
      </Box>
    </Box>
  );
});

QueryResultTable.displayName = 'QueryResultTable';

export default QueryResultTable;