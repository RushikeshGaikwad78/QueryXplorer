import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { Database } from '../types';

interface LeftDrawerProps {
  databases: Database;
  expandedDB: { [key: string]: boolean };
  expandedTables: { [key: string]: boolean };
  toggleDatabase: (dbName: string) => void;
  toggleTable: (dbName: string, tableName: string) => void;
}

const LeftDrawer: React.FC<LeftDrawerProps> = ({
  databases,
  expandedDB,
  expandedTables,
  toggleDatabase,
  toggleTable
}) => {
  return (
    <Box sx={{ width: 250 }}>
      <Typography variant="h6" sx={{ p: 1, fontWeight: 'bold' }}>
        Databases & Tables
      </Typography>
      <Divider />
      <List>
        {Object.keys(databases).map((dbName) => (
          <Box key={dbName}>
            <ListItem component="div" onClick={() => toggleDatabase(dbName)}>
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
                    <ListItem component="div" onClick={() => toggleTable(dbName, tableName)} sx={{ pl: 2 }}>
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
};

export default LeftDrawer; 