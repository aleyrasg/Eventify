import React from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Button } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import AddIcon from '@mui/icons-material/Add'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

const drawerWidth = 240

const handleLogout = async () => {
  await supabase.auth.signOut()
  window.location.href = '/login'
}

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon><EventIcon /></ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/crear">
            <ListItemIcon><AddIcon /></ListItemIcon>
            <ListItemText primary="Crear evento" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}

export default Sidebar
