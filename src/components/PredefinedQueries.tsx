import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  QueryStats as QueryStatsIcon,
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
        <QueryStatsIcon />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Test Queries
        </Typography>
      </Box>
      
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
       
      <Divider />
    </Box>
  );
};

export default PredefinedQueries; 