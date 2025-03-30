import './App.css'
import { useState } from 'react'  
import { AppBar,Toolbar,IconButton,Typography } from '@mui/material'
import {
  Menu as MenuIcon,
  History as HistoryIcon     
} from '@mui/icons-material'
function App() {
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false)
  const [mobileRightOpen, setMobileRightOpen] = useState(false)
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
    </>
  )
}

export default App
