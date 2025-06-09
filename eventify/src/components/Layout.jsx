import React from 'react'
import Sidebar from './Sidebar'
import { Box, Toolbar } from '@mui/material'

const drawerWidth = 240

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

export default Layout
