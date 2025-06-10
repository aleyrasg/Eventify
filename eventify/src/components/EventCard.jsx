import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const EventCard = ({ id, title, description, date, location, onDelete, onEdit }) => {
  return (
    <Card
      sx={{
        backgroundColor: '#dbb6ee',
        color: '#2b2b2b',
        mb: 2,
        position: 'relative',
        borderRadius: 3,
        boxShadow: 3,
        p: 1
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>

        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {description}
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2"><strong>Fecha:</strong> {date}</Typography>
          <Typography variant="body2"><strong>Ubicación:</strong> {location}</Typography>
        </Box>
      </CardContent>

      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton onClick={() => onEdit(id)} size="small" sx={{ color: '#4b1c71', mr: 1 }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(id)} size="small" sx={{ color: '#4b1c71' }}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  )
}

export default EventCard
