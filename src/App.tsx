import './App.css'
import { useState, Suspense, useMemo , useCallback } from 'react'  
import { AppBar,Toolbar,IconButton,Typography,Drawer,Box,useMediaQuery  } from '@mui/material'
import {
  Menu as MenuIcon,
  History as HistoryIcon     
} from '@mui/icons-material'

import { QueryState} from './types'
import { mockDatabases } from './data/mockdata'
import LeftDrawer from './components/LeftDrawer'

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false)
  const [mobileRightOpen, setMobileRightOpen] = useState(false)
  const [state, setState] = useState<QueryState>({
    query: '',
    tableData: null,
    activeTable: null,
    expandedDB: {},
    expandedTables: {},
    databases: mockDatabases,
    theme: prefersDarkMode ? 'dark' : 'light',
    queryHistory: []
  })
  
  const toggleDatabase = useCallback((dbName: string) => {
    setState(prev => ({
      ...prev,
      expandedDB: {
        ...prev.expandedDB,
        [dbName]: !prev.expandedDB[dbName]
      }
    }))
  }, []);

  const toggleTable = useCallback((dbName: string, tableName: string) => {
    setState(prev => ({
      ...prev,
      expandedTables: {
        ...prev.expandedTables,
        [`${dbName}-${tableName}`]: !prev.expandedTables[`${dbName}-${tableName}`]
      },
      activeTable: tableName
    }))
  }, []);

  const drawerWidth = {
    left: 250,
    right: 300
  };

  const drawer = useMemo(() => (
    <Suspense fallback={<Box sx={{ p: 2 }}>Loading...</Box>}>
      <LeftDrawer
        databases={state.databases}
        expandedDB={state.expandedDB}
        expandedTables={state.expandedTables}
        toggleDatabase={toggleDatabase}
        toggleTable={toggleTable}
      />
    </Suspense>
  ), [state.databases, state.expandedDB, state.expandedTables, toggleDatabase, toggleTable]);

  return (
    <>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileLeftOpen(!mobileLeftOpen)}
              sx={{ mr: 1, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              SQL Query Interface
            </Typography>
            <IconButton
                color="inherit"
                onClick={() => setMobileRightOpen(!mobileRightOpen)}
                sx={{ mr: 1, display: { md: 'none' } }}
                aria-label="Toggle History Drawer"
              >
                <HistoryIcon />
              </IconButton>
          </Toolbar>
        </AppBar>
        {/* Left Drawer */}
        <Drawer
          variant="temporary"
          open={mobileLeftOpen}
          onClose={() => setMobileLeftOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth.left,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth.left,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth.left,
              boxSizing: 'border-box',
              top: '64px',
              height: 'calc(100% - 64px)',
              position: 'fixed',
              left: 0,
              border: 'none',
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* main content */}

        {/* Right Drawer */}


    </>
  )
}

export default App
