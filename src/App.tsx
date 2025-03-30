import './App.css'
import { useState, Suspense, useMemo , useCallback } from 'react'  
import { AppBar,Toolbar,IconButton,Typography,Drawer,Box,useMediaQuery, Paper, Container, Button, ThemeProvider, createTheme , CssBaseline} from '@mui/material'
import {
  Menu as MenuIcon,
  History as HistoryIcon,
  ContentCopy as ContentCopyIcon,
  PlayArrow as PlayArrowIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material'

import { QueryHistoryItem, QueryState} from './types'
import { mockDatabases } from './data/mockdata'
import LeftDrawer from './components/LeftDrawer'
import RightDrawer from './components/RightDrawer'
import QueryResultTable from './components/QueryResultTable'
import QueryEditor from './components/QueryEditor'

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
  const [filterColumn, setFilterColumn] = useState("")
  const [filterOperator, setFilterOperator] = useState("=")
  const [filterValue, setFilterValue] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  const theme = useMemo(() => createTheme({
    palette: {
      mode: state.theme,
      primary: {
        main: '#646cff',
      },
      secondary: {
        main: '#535bf2',
      },
    },
  }), [state.theme]);

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
  const toggleTheme = () => {
      setState(prev => ({
        ...prev,
        theme: prev.theme === 'light' ? 'dark' : 'light'
      }))
    }
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

  const handleSort = useCallback((column: string) => {
    if (!state.tableData) return;
    
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newSortOrder);
  
    const columnIndex = state.tableData.headers.indexOf(column);
    const sortedRows = [...state.tableData.rows].sort((a, b) => {
      const aValue = a[columnIndex];
      const bValue = b[columnIndex];
  
      // Handle numeric values
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return newSortOrder === 'asc' 
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
  
      // Handle string values
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      return newSortOrder === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  
    setState(prev => ({
      ...prev,
      tableData: {
        ...prev.tableData!,
        headers: prev.tableData!.headers,
        rows: sortedRows
      }
    }));
  }, [sortColumn, sortOrder, state.tableData]);
  
  const handleFilter = useCallback(() => {
    if (!filterColumn || !filterOperator || !filterValue || !state.tableData) return;
    
    const filteredRows = state.tableData.rows.filter(row => {
      const columnIndex = state.tableData!.headers.indexOf(filterColumn);
      const cellValue = row[columnIndex];
      
      switch (filterOperator) {
        case '=':
          return cellValue === filterValue;
        case '!=':
          return cellValue !== filterValue;
        case '>':
          return cellValue > filterValue;
        case '<':
          return cellValue < filterValue;
        case '>=':
          return cellValue >= filterValue;
        case '<=':
          return cellValue <= filterValue;
        default:
          return true;
      }
    });
    
    setState(prev => ({
      ...prev,
      tableData: {
        ...prev.tableData!,
        headers: prev.tableData!.headers,
        rows: filteredRows
      }
    }));
  }, [filterColumn, filterOperator, filterValue, state.tableData]);
  

  const handlePasteQuery = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      setState(prev => ({ ...prev, query: text }))
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }, []);

  const handleRunQuery = useCallback(() => {
    if (!state.query.trim()) return;

    const timestamp = new Date().toLocaleString()
    const newHistoryItem: QueryHistoryItem = {
      id: Date.now().toString(),
      query: state.query,
      timestamp
    }

    let result
    if (state.query.toLowerCase().includes("select * from users")) {
      result = {
        headers: ["ID", "Name", "Age"],
        rows: [
          [1, "Alice", 25],
          [2, "Bob", 30],
          [3, "Charlie", 22],
        ],
      }
    } else if (state.query.toLowerCase().includes("select * from orders")) {
      result = {
        headers: ["Order ID", "User", "Total"],
        rows: [
          [101, "Alice", "$120"],
          [102, "Bob", "$250"],
        ],
      }
    } else {
      result = {
        headers: ["Message"],
        rows: [["No matching data found"]],
      }
    }

    setState(prev => ({
      ...prev,
      tableData: result,
      queryHistory: [newHistoryItem, ...prev.queryHistory]
    }))
  }, [state.query]);


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
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
              <IconButton color="inherit" onClick={toggleTheme}>
              {state.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
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
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth.left + drawerWidth.right}px)` },
            marginLeft: { md: `${drawerWidth.left - 10 }px` },
            marginRight: { md: `${drawerWidth.right - 8}px` },
            marginTop: '64px',
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <Container 
            maxWidth={false}
            disableGutters
            sx={{ 
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 3, 
              backgroundColor: 'background.paper',
              minHeight: '200px',
              width: '100%'
            }}>
              <Typography variant="h6" gutterBottom>
                SQL Query Editor
              </Typography>
              <QueryEditor
                value={state.query}
                onChange={(value) => setState(prev => ({ ...prev, query: value }))}
                disabled={false}
              />
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                mt: 2
              }}>
                <Button
                  fullWidth={false}
                  variant="contained"
                  startIcon={<ContentCopyIcon />}
                  onClick={handlePasteQuery}
                  sx={{ flex: { sm: 1 } }}
                >
                  Paste Query
                </Button>
                <Button
                  fullWidth={false}
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleRunQuery}
                  sx={{ flex: { sm: 1 } }}
                >
                  Run Query
                </Button>
              </Box>
            </Paper>

            {state.tableData && (
              <Paper sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.paper' }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <Suspense fallback={<Typography>Loading results...</Typography>}>
                    <QueryResultTable
                      headers={state.tableData.headers}
                      rows={state.tableData.rows}
                      onSort={handleSort}
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      onFilter={handleFilter}
                      filterColumn={filterColumn}
                      filterOperator={filterOperator}
                      filterValue={filterValue}
                      onFilterColumnChange={setFilterColumn}
                      onFilterOperatorChange={setFilterOperator}
                      onFilterValueChange={setFilterValue}
                    />
                  </Suspense>
                </Box>
              </Paper>  
            )}

          </Container>
        </Box>
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

    
    </ThemeProvider>
  )
}

export default App
