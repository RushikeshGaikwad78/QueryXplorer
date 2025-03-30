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
import RightDrawer from './components/RightDrawer'

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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQueryResult, setSelectedQueryResult] = useState<{ headers: string[]; rows: string[][] } | null>(null);

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

  const handleQueryClick = (query: string) => {
    // Dummy query result for testing
    const dummyResult = {
      headers: ["Column1", "Column2", "Column3"],
      rows: [
        ["Row1-Col1", "Row1-Col2", "Row1-Col3"],
        ["Row2-Col1", "Row2-Col2", "Row2-Col3"],
      ],
    };
  
    setSelectedQueryResult(dummyResult);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQueryResult(null);
  };

  const rightDrawerContent = useMemo(() => (
    <Suspense fallback={<Box sx={{ p: 2 }}>Loading...</Box>}>
      <RightDrawer
        queryHistory={state.queryHistory}
        onQueryClick={handleQueryClick}
        openDialog={openDialog}
        onCloseDialog={handleCloseDialog}
        selectedQueryResult={selectedQueryResult}
      />
    </Suspense>
  ), [state.queryHistory, handleQueryClick, openDialog, selectedQueryResult]);


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
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileRightOpen}
          onClose={() => setMobileRightOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth.right,
              boxSizing: 'border-box',
            },
          }}
        >
          {rightDrawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: drawerWidth.right,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth.right,
              boxSizing: 'border-box',
              top: '64px',
              height: 'calc(100% - 64px)',
              position: 'fixed',
              right: 0,
              border: 'none',
              borderLeft: '1px solid',
              borderColor: 'divider'
            },
          }}
        >
          {rightDrawerContent}
        </Drawer>

    </>
  )
}

export default App
