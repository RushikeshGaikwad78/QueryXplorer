import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

interface QueryResultDialogProps {
  open: boolean;
  onClose: () => void;
  queryResult: { headers: string[]; rows: string[][] } | null;
}

const QueryResultDialog: React.FC<QueryResultDialogProps> = ({ open, onClose, queryResult }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "90%", maxWidth: "600px" } }}
    >
      <DialogTitle>Query Result</DialogTitle>
      <DialogContent>
        {queryResult ? (
          <TableContainer component={Paper} sx={{ maxHeight: "60vh", overflow: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {queryResult.headers.map((header, index) => (
                    <TableCell key={index} sx={{ fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {queryResult.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No Data Available</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QueryResultDialog; 