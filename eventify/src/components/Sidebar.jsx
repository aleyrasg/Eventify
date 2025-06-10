import React from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'
import { supabase } from '../services/supabaseClient'
import Swal from 'sweetalert2'

const drawerWidth = 240

const Sidebar = () => {
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    Swal.fire('Sesión cerrada', '', 'info').then(() => {
      window.location.href = '/login'
    })
  }

  const menuItems = [
    { text: 'Inicio', path: '/', icon: <EventIcon /> },
    { text: 'Crear evento', path: '/crear', icon: <AddIcon /> }
  ]

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#4b1c71',
          color: '#fff0ff'
        }
      }}
    >
      <Toolbar />
      <Box sx={{ mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  color: '#fff0ff',
                  '&.Mui-selected': {
                    backgroundColor: '#714ca5'
                  },
                  '&:hover': {
                    backgroundColor: '#714ca5'
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#fff0ff' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#714ca5' } }}>
              <ListItemIcon sx={{ color: '#fff0ff' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar
