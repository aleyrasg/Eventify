import React, { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { supabase } from '../services/supabaseClient'

const EventForm = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  })

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('events').insert([eventData])
    if (error) {
      console.error('Error insertando evento:', error)
    } else {
      alert('Evento creado correctamente')
      setEventData({ title: '', description: '', date: '', location: '' })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Crear nuevo evento</Typography>
      <TextField
        fullWidth label="Título" name="title" value={eventData.title}
        onChange={handleChange} margin="normal" required
      />
      <TextField
        fullWidth label="Descripción" name="description" value={eventData.description}
        onChange={handleChange} margin="normal" multiline rows={3}
      />
      <TextField
        fullWidth label="Fecha" name="date" type="date" value={eventData.date}
        onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} required
      />
      <TextField
        fullWidth label="Ubicación" name="location" value={eventData.location}
        onChange={handleChange} margin="normal" required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Crear evento
      </Button>
    </Box>
  )
}

export default EventForm
