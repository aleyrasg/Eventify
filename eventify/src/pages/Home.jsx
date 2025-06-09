import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import EventCard from '../components/EventCard'
import { Container, Typography, CircularProgress } from '@mui/material'

const Home = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        console.error('Error al obtener eventos:', error)
      } else {
        setEvents(data)
      }

      setLoading(false)
    }

    fetchEvents()
  }, [])

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Eventos próximos
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : events.length > 0 ? (
        events.map(event => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            date={event.date}
            location={event.location}
          />
        ))
      ) : (
        <Typography variant="body1">No hay eventos registrados.</Typography>
      )}
    </Container>
  )
}

export default Home
