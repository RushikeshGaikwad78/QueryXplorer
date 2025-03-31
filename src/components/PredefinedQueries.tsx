import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Collapse,
} from '@mui/material';
import {
  QueryStats as QueryStatsIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Query } from '../types';

interface PredefinedQueriesProps {
  queries: Query[];
  onQuerySelect: (query: Query) => void;
}

const PredefinedQueries: React.FC<PredefinedQueriesProps> = ({ queries, onQuerySelect }) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with Clickable Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QueryStatsIcon />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Test Queries
          </Typography>
        </Box>
        
        {/* Clickable ExpandMore Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={handleClick}
          role="button"
          aria-label="Toggle Test Queries"
        >
          <ExpandMoreIcon 
            sx={{ 
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)', 
              transition: '0.3s' 
            }} 
          />
        </Box>
      </Box>

      {/* Collapsible Query List */}
      <Collapse in={open}>
        <List disablePadding>
          {queries.map((query) => (
            <ListItem key={query.id} disablePadding>
              <ListItemButton
                onClick={() => onQuerySelect(query)}
                sx={{ pl: 4 }}
              >
                <ListItemText
                  primary={query.name}
                  secondary={query.description}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>

      <Divider />
    </Box>
  );
};

export default PredefinedQueries;
