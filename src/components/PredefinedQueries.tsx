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
      {/* Header with Clickable Area */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          cursor: 'pointer',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        onClick={handleClick}
        role="button"
        aria-label="Toggle Test Queries"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QueryStatsIcon color="primary" />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: 'text.primary'
            }}
          >
            Test Queries
          </Typography>
        </Box>

        {/* Clickable Expand Icon */}
        <ExpandMoreIcon 
          sx={{ 
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: '0.3s',
            color: 'primary.main'
          }} 
        />
      </Box>

      {/* Collapsible Query List */}
      <Collapse in={open} timeout="auto">
        <List disablePadding>
          {queries.map((query) => (
            <ListItem key={query.id} disablePadding>
              <ListItemButton
                onClick={() => onQuerySelect(query)}
                sx={{ 
                  pl: 4,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <ListItemText
                  primary={query.name}
                  secondary={query.description}
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: 'medium',
                    color: 'text.primary'
                  }}
                  secondaryTypographyProps={{ 
                    variant: 'caption',
                    color: 'text.secondary'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>

      <Divider sx={{ my: 1 }} />
    </Box>
  );
};

export default PredefinedQueries;
