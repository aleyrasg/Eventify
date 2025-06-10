import React from 'react'
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const EventCard = ({ id, title, description, date, location, onDelete }) => {
  const handleDelete = () => {
    if (confirm('¿Seguro que quieres eliminar este evento?')) {
      onDelete(id)
    }
  }

  return (
    <Card sx={{ mb: 2, boxShadow: 3, position: 'relative' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2"><strong>Fecha:</strong> {date}</Typography>
          <Typography variant="body2"><strong>Ubicación:</strong> {location}</Typography>
        </Box>
      </CardContent>
      <IconButton
        aria-label="eliminar"
        onClick={handleDelete}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  )
}

export default EventCard
