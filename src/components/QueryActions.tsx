import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface QueryActionsProps {
  onPasteQuery: () => void;
  onRunQuery: () => void;
}

const QueryActions = memo(({ onPasteQuery, onRunQuery }: QueryActionsProps) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: { xs: 1, sm: 2 },
      flexDirection: { xs: 'column', sm: 'row' },
      mt: 2
    }}>
      <Button
        variant="contained"
        startIcon={<ContentCopyIcon />}
        onClick={onPasteQuery}
        sx={{ flex: { sm: 1 } }}
      >
        Paste Query
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PlayArrowIcon />}
        onClick={onRunQuery}
        sx={{ flex: { sm: 1 } }}
      >
        Run Query
      </Button>
    </Box>
  );
});

QueryActions.displayName = 'QueryActions';

export default QueryActions;