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
    
    <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
      {queryHistory.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">No queries yet</Typography>
          <Typography variant="caption">Run a query to see it here</Typography>
        </Box>
      ) : (
        queryHistory.map((item) => (
          <Box 
            key={item.id}
            onClick={() => onQueryClick(item.query)}
            sx={{
              cursor: 'pointer',
              p: 1,
              '&:hover': { backgroundColor: 'action.hover' },
              borderBottom: '1px solid',
              borderColor: 'divider',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            role="button"
            tabIndex={0} // Makes it keyboard accessible
          >
            <Typography 
              variant="body2" 
              sx={{ fontFamily: 'monospace' }}
            >
              {item.query}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.timestamp}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  
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