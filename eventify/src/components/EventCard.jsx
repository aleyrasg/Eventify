import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'

const EventCard = ({ title, description, date, location }) => {
  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2"><strong>Fecha:</strong> {date}</Typography>
          <Typography variant="body2"><strong>Ubicación:</strong> {location}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default EventCard
