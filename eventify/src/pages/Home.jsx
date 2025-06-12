import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import EventCard from "../components/EventCard";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este evento?");
    if (!confirm) return;

    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar el evento.");
    } else {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    }
  };

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No se pudo obtener el usuario", userError);
        setEvents([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("events")
        .select("*, event_types(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error al cargar eventos:", error);
        setEvents([]);
      } else {
        setEvents(data);
      }

      setLoading(false);
    };

    fetchUserAndEvents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Mis eventos
      </Typography>

      {events.length === 0 ? (
        <Typography>No tienes eventos creados.</Typography>
      ) : (
        <Grid container spacing={2}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard
                event={event}
                onDelete={handleDelete}
                onEdit={(id) => navigate(`/editar/${id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Home;
