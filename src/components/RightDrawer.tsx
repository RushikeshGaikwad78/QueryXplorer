import React, { memo, lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Divider from '@mui/material/Divider';

import { QueryHistoryItem } from '../types';

// Lazy load dialog component
const QueryResultDialog = lazy(() => import('./QueryResultDialog'));

interface RightDrawerProps {
  queryHistory: QueryHistoryItem[];
  onQueryClick: (query: string) => void;
  openDialog: boolean;
  onCloseDialog: () => void;
  selectedQueryResult: { headers: string[]; rows: string[][] } | null;
}

const RightDrawer = memo(({
  queryHistory,
  onQueryClick,
  openDialog,
  onCloseDialog,
  selectedQueryResult
}: RightDrawerProps) => {
  return (
    <Box sx={{ width: 270 }}>
      <Typography variant="h6" sx={{ p: 1 }}>Query History</Typography>
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
                secondary={item.timestamp}
                primaryTypographyProps={{ 
                  noWrap: true, 
                  sx: { fontSize: '0.875rem', fontFamily: 'monospace' } 
                }}
              />
            </ListItem>
          ))
        )}
      </List>

      {openDialog && (
        <Suspense fallback={<div>Loading...</div>}>
          <QueryResultDialog
            open={openDialog}
            onClose={onCloseDialog}
            queryResult={selectedQueryResult}
          />
        </Suspense>
      )}
    </Box>
  );
});

RightDrawer.displayName = 'RightDrawer';

export default RightDrawer;