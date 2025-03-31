import React, { useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

interface QueryResultDialogProps {
  open: boolean;
  onClose: () => void;
  queryResult: { headers: string[]; rows: string[][] } | null;
}

const QueryResultDialog: React.FC<QueryResultDialogProps> = ({ open, onClose, queryResult }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableHead = useMemo(() => (
    <TableHead>
      <TableRow>
        {queryResult?.headers.map((header, index) => (
          <TableCell 
            key={index}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  ), [queryResult?.headers]);

  const tableBody = useMemo(() => (
    <TableBody>
      {queryResult?.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
        <TableRow 
          key={rowIndex}
          hover
          sx={{
            '&:nth-of-type(odd)': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          {row.map((cell, cellIndex) => (
            <TableCell 
              key={cellIndex}
              sx={{
                whiteSpace: 'nowrap',
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {cell}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  ), [queryResult?.rows, page, rowsPerPage]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: '95vw',
          maxHeight: '95vh',
          width: '95vw',
          height: '95vh',
          m: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        backgroundColor: 'primary.main',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Query Result
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={queryResult?.rows.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      <DialogContent dividers sx={{ p: 0 }}>
        {queryResult && (
          <TableContainer 
            component={Paper} 
            sx={{ 
              height: 'calc(95vh - 112px)', 
              overflow: 'auto'
            }}
          >
            <Table stickyHeader size="medium">
              {tableHead}
              {tableBody}
            </Table>
          </TableContainer>
        )}
        
      </DialogContent>
    </Dialog>
  );
};

export default QueryResultDialog;