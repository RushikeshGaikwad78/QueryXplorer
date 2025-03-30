import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Database } from '../types';

interface LeftDrawerProps {
  databases: Database;
  expandedDB: { [key: string]: boolean };
  expandedTables: { [key: string]: boolean };
  toggleDatabase: (dbName: string) => void;
  toggleTable: (dbName: string, tableName: string) => void;
}

// Use memo to prevent unnecessary re-renders
const LeftDrawer = memo(({
  databases,
  expandedDB,
  expandedTables,
  toggleDatabase,
  toggleTable
}: LeftDrawerProps) => {
  return (
    <Box sx={{ width: 250 }}>
      <Typography variant="h6" sx={{ p: 1, fontWeight: 'bold' }}>
        Databases & Tables
      </Typography>
      <Divider />
      <List>
        {Object.keys(databases).map((dbName) => (
          <Box key={dbName}>
            <ListItem 
            component="div" 
              onClick={() => toggleDatabase(dbName)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText
                primary={dbName}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              />
              {expandedDB[dbName] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={expandedDB[dbName]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 1 }}>
                {Object.keys(databases[dbName]).map((tableName) => (
                  <Box key={tableName}>
                    <ListItem 
                      component="div" 
                      onClick={() => toggleTable(dbName, tableName)} 
                      sx={{ pl: 2, cursor: 'pointer' }}
                    >
                      <ListItemText
                        primary={tableName}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: 'medium',
                        }}
                      />
                      {expandedTables[`${dbName}-${tableName}`] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={expandedTables[`${dbName}-${tableName}`]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 2 }}>
                        {databases[dbName][tableName].map((col, index) => (
                          <ListItem key={index} sx={{ pl: 1 }}>
                            <ListItemText
                              primary={`${col.column} - ${col.type}`}
                              primaryTypographyProps={{ fontSize: '0.8rem', color: 'text.secondary' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );
});

LeftDrawer.displayName = 'LeftDrawer';

export default LeftDrawer;