import { useState, useCallback, useMemo, lazy, Suspense } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

import MenuIcon from '@mui/icons-material/Menu'
import HistoryIcon from '@mui/icons-material/History'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'


import { QueryHistoryItem, QueryState } from './types'
import { mockDatabases } from './data/mockdata'

// Lazy load components with explicit loading boundaries
const LeftDrawer = lazy(() => import('./components/LeftDrawer'))
const RightDrawer = lazy(() => import('./components/RightDrawer'))
const QueryResultTable = lazy(() => import('./components/QueryResultTable'))
const QueryEditor = lazy(() => import('./components/QueryEditor'))
const QueryActions = lazy(() => import('./components/QueryActions'))

// Drawer width constants
const DRAWER_WIDTH = {
  left: 250,
  right: 300
}

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
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedQueryResult, setSelectedQueryResult] = useState<{ headers: string[]; rows: string[][] } | null>(null)
  const [filterColumn, setFilterColumn] = useState("")
  const [filterOperator, setFilterOperator] = useState("=")
  const [filterValue, setFilterValue] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  // Memoize theme to prevent unnecessary recalculations
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
  }), [state.theme])

  const toggleDatabase = useCallback((dbName: string) => {
    setState(prev => ({
      ...prev,
      expandedDB: {
        ...prev.expandedDB,
        [dbName]: !prev.expandedDB[dbName]
      }
    }))
  }, [])

  const toggleTable = useCallback((dbName: string, tableName: string) => {
    setState(prev => ({
      ...prev,
      expandedTables: {
        ...prev.expandedTables,
        [`${dbName}-${tableName}`]: !prev.expandedTables[`${dbName}-${tableName}`]
      },
      activeTable: tableName
    }))
  }, [])

  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }))
  }, [])

  const handleQueryClick = useCallback((query: string) => {
    // Simplified dummy result for testing
    const dummyResult = {
      headers: ["Column1", "Column2", "Column3"],
      rows: [
        ["Row1-Col1", "Row1-Col2", "Row1-Col3"],
        ["Row2-Col1", "Row2-Col2", "Row2-Col3"],
      ],
    }
  
    setSelectedQueryResult(dummyResult)
    setOpenDialog(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false)
    setSelectedQueryResult(null)
  }, [])

  const handleSort = useCallback((column: string) => {
    if (!state.tableData) return
    
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortOrder(newSortOrder)
  
    const columnIndex = state.tableData.headers.indexOf(column)
    const sortedRows = [...state.tableData.rows].sort((a, b) => {
      const aValue = a[columnIndex]
      const bValue = b[columnIndex]
  
      // Handle numeric values
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return newSortOrder === 'asc' 
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue)
      }
  
      // Handle string values
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      return newSortOrder === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr)
    })
  
    setState(prev => ({
      ...prev,
      tableData: {
        ...prev.tableData!,
        rows: sortedRows
      }
    }))
  }, [sortColumn, sortOrder, state.tableData])
  
  const handleFilter = useCallback(() => {
    if (!filterColumn || !filterOperator || !filterValue || !state.tableData) return
    
    const columnIndex = state.tableData.headers.indexOf(filterColumn)
    
    const filteredRows = state.tableData.rows.filter(row => {
      const cellValue = row[columnIndex]
      
      switch (filterOperator) {
        case '=':
          return cellValue === filterValue
        case '!=':
          return cellValue !== filterValue
        case '>':
          return cellValue > filterValue
        case '<':
          return cellValue < filterValue
        case '>=':
          return cellValue >= filterValue
        case '<=':
          return cellValue <= filterValue
        default:
          return true
      }
    })
    
    setState(prev => ({
      ...prev,
      tableData: {
        ...prev.tableData!,
        rows: filteredRows
      }
    }))
  }, [filterColumn, filterOperator, filterValue, state.tableData])
  
  const handlePasteQuery = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      setState(prev => ({ ...prev, query: text }))
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }, [])

  const handleRunQuery = useCallback(() => {
    if (!state.query.trim()) return

    const timestamp = new Date().toLocaleString()
    const newHistoryItem: QueryHistoryItem = {
      id: Date.now().toString(),
      query: state.query,
      timestamp
    }

    // Simplified results logic
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
      queryHistory: [newHistoryItem, ...prev.queryHistory.slice(0, 9)] // Limit history to 10 items
    }))
  }, [state.query])

  const handleQueryChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, query: value }))
  }, [])

  // Memoize left drawer content to prevent unnecessary rerenders
  const leftDrawerContent = useMemo(() => (
    <Suspense fallback={<Box sx={{ p: 2 }}>Loading databases...</Box>}>
      <LeftDrawer
        databases={state.databases}
        expandedDB={state.expandedDB}
        expandedTables={state.expandedTables}
        toggleDatabase={toggleDatabase}
        toggleTable={toggleTable}
      />
    </Suspense>
  ), [state.databases, state.expandedDB, state.expandedTables, toggleDatabase, toggleTable])

  // Memoize right drawer content to prevent unnecessary rerenders
  const rightDrawerContent = useMemo(() => (
    <Suspense fallback={<Box sx={{ p: 2 }}>Loading history...</Box>}>
      <RightDrawer
        queryHistory={state.queryHistory}
        onQueryClick={handleQueryClick}
        openDialog={openDialog}
        onCloseDialog={handleCloseDialog}
        selectedQueryResult={selectedQueryResult}
      />
    </Suspense>
  ), [state.queryHistory, handleQueryClick, openDialog, handleCloseDialog, selectedQueryResult])

  // Memoize app bar to prevent unnecessary rerenders
  const appBar = useMemo(() => (
    <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setMobileLeftOpen(!mobileLeftOpen)}
          sx={{ mr: 1, display: { md: 'none' } }}
          aria-label="Toggle Database Drawer"
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
        <IconButton color="inherit" onClick={toggleTheme} aria-label="Toggle Theme">
          {state.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  ), [mobileLeftOpen, mobileRightOpen, toggleTheme])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {appBar}
      
      {/* Left Drawer - Mobile */}
      <Drawer
        variant="temporary"
        open={mobileLeftOpen}
        onClose={() => setMobileLeftOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH.left,
            boxSizing: 'border-box',
          },
        }}
      >
        {leftDrawerContent}
      </Drawer>

      {/* Left Drawer - Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH.left,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH.left,
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
        {leftDrawerContent}
      </Drawer>
      
      {/* Main content */}
      <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${DRAWER_WIDTH.left + DRAWER_WIDTH.right + 140}px)` },
            marginLeft: { md: `${DRAWER_WIDTH.left}px` },
            marginRight: { md: `${DRAWER_WIDTH.right}px` },
            marginTop: '64px',
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            {/* SQL Query Editor Section */}
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                backgroundColor: 'background.paper',
                minHeight: '200px',
                width: '100%',
                boxShadow: 1,
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                SQL Query Editor
              </Typography>

              <Suspense fallback={<Box>Loading editor...</Box>}>
                <QueryEditor value={state.query} onChange={handleQueryChange} disabled={false} />
              </Suspense>

              <Suspense fallback={<Box>Loading actions...</Box>}>
                <QueryActions onPasteQuery={handlePasteQuery} onRunQuery={handleRunQuery} />
              </Suspense>
            </Box>

            {/* Query Results Table */}
            {state.tableData && (
              <Suspense fallback={<Box p={2}>Loading results...</Box>}>
                <QueryResultTable
                  {...state.tableData}
                  filterColumn={filterColumn}
                  filterOperator={filterOperator}
                  filterValue={filterValue}
                  onSort={handleSort}
                  sortColumn={sortColumn}
                  sortOrder={sortOrder}
                  onFilter={handleFilter}
                  onFilterColumnChange={setFilterColumn}
                  onFilterOperatorChange={setFilterOperator}
                  onFilterValueChange={setFilterValue}
                />
              </Suspense>
            )}
          </Box>
      </Box>


      {/* Right Drawer - Mobile */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileRightOpen}
        onClose={() => setMobileRightOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH.right,
            boxSizing: 'border-box',
          },
        }}
      >
        {rightDrawerContent}
      </Drawer>

      {/* Right Drawer - Desktop */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: DRAWER_WIDTH.right,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH.right,
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