import { memo, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// Component props with explicit types
interface QueryResultTableProps {
  headers: string[];
  rows: any[][];
  onSort?: (column: string) => void;
  sortColumn?: string;
  sortOrder?: string;
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
  sortColumn?: string;
  sortOrder?: string;
  onSort?: (column: string) => void;
}) => (
  <TableRow>
    {headers.map((header, index) => (
      <TableCell
        key={index}
        onClick={() => onSort?.(header)}
        sx={{ 
          cursor: onSort ? 'pointer' : 'default',
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}
      >
        {header}
        {sortColumn === header && (
          <span style={{ marginLeft: '4px' }}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </span>
        )}
      </TableCell>
    ))}
  </TableRow>
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
      <TableRow>
        <TableCell 
          colSpan={headers.length}
          align="center"
        >
          No results found
        </TableCell>
      </TableRow>
    ) : (
      rows.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <TableCell 
              key={cellIndex}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {cell}
            </TableCell>
          ))}
        </TableRow>
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
  <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
      <TableContainer 
        sx={{ 
          maxHeight: '50vh',
          overflow: 'auto'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableHeaders 
              headers={headers} 
              sortColumn={sortColumn} 
              sortOrder={sortOrder} 
              onSort={onSort}
            />
          </TableHead>
          <TableBody>
            <TableRows rows={paginatedRows} headers={headers} />
          </TableBody>
        </Table>
      </TableContainer>

      
    </Box>
  );
});

QueryResultTable.displayName = 'QueryResultTable';

export default QueryResultTable;