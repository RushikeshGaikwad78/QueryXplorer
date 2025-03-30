import React, { Suspense } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { QueryHistoryItem } from '../types';

interface RightDrawerProps {
  queryHistory: QueryHistoryItem[];
  onQueryClick: (query: string) => void;
  openDialog: boolean;
  onCloseDialog: () => void;
  selectedQueryResult: { headers: string[]; rows: string[][] } | null;
}

const RightDrawer: React.FC<RightDrawerProps> = ({
  queryHistory,
  onQueryClick,
  openDialog,
  onCloseDialog,
  selectedQueryResult
}) => {
  // Lazy load the dialog component
  const QueryResultDialog = React.lazy(() => import('./QueryResultDialog'));

  return (
    <Box sx={{ width: 300 }}>
      <Typography variant="h6" sx={{ p: 2 }}>Query History</Typography>
      <Divider />
      <List sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
        {queryHistory.length === 0 ? (
          <ListItem>
            <ListItemText 
              primary="No queries yet"
              secondary="Run a query to see it here"
            />
          </ListItem>
        ) : (
          queryHistory.map((item) => (
            <ListItem 
              key={item.id} 
              component="div"
              onClick={() => onQueryClick(item.query)}
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: 1
              }}
            >
              <ListItemText 
                primary={item.query}
                secondary={
                  <>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Database: MyDatabase
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {item.timestamp}
                    </Typography>
                  </>
                }
                primaryTypographyProps={{ 
                  noWrap: true, 
                  sx: { fontSize: '0.875rem', fontFamily: 'monospace' } 
                }}
              />
            </ListItem>
          ))
        )}
      </List>

      <Suspense fallback={<div>Loading...</div>}>
        {openDialog && (
          <QueryResultDialog
            open={openDialog}
            onClose={onCloseDialog}
            queryResult={selectedQueryResult}
          />
        )}
      </Suspense>
    </Box>
  );
};

export default RightDrawer; 