import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

const LeftDrawer = memo(({ databases, expandedDB, expandedTables, toggleDatabase, toggleTable }: LeftDrawerProps) => {
  return (
    <Box sx={{ width: 250, p: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        Databases & Tables
      </Typography>
      <Divider />

      {Object.keys(databases).map((dbName) => (
        <Box key={dbName} sx={{ mt: 1 }}>
          {/* Database Toggle */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              p: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
            onClick={() => toggleDatabase(dbName)}
          >
            <Typography variant="body1" fontWeight="bold" color="primary">
              {dbName}
            </Typography>
            {expandedDB[dbName] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          {/* Tables List */}
          {expandedDB[dbName] && (
            <Box sx={{ pl: 2, mt: 1 }}>
              {Object.keys(databases[dbName]).map((tableName) => (
                <Box key={tableName} sx={{ mt: 1 }}>
                  {/* Table Toggle */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      p: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                    }}
                    onClick={() => toggleTable(dbName, tableName)}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      {tableName}
                    </Typography>
                    {expandedTables[`${dbName}-${tableName}`] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Box>

                  {/* Columns List */}
                  {expandedTables[`${dbName}-${tableName}`] && (
                    <Box sx={{ pl: 3, mt: 1 }}>
                      {databases[dbName][tableName].map((col, index) => (
                        <Typography key={index} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {col.column} - {col.type}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
});

LeftDrawer.displayName = 'LeftDrawer';

export default LeftDrawer;
