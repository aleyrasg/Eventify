import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { supabase } from "../services/supabaseClient";
import Swal from "sweetalert2";

const EventForm = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error obteniendo usuario:", error.message);
      } else {
        setUserId(user?.id);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("No se pudo identificar al usuario");
      return;
    }

    const newEvent = {
      ...eventData,
      user_id: userId,
    };

    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) {
      Swal.fire("Error", "No se pudo crear el evento.", "error");
    } else {
      Swal.fire(
        "Evento creado",
        "El evento ha sido registrado con éxito.",
        "success"
      );
      setEventData({ title: "", description: "", date: "", location: "" });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" gutterBottom>
        Crear nuevo evento
      </Typography>
      <TextField
        fullWidth
        label="Título"
        name="title"
        value={eventData.title}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Descripción"
        name="description"
        value={eventData.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        fullWidth
        label="Fecha"
        name="date"
        type="date"
        value={eventData.date}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        fullWidth
        label="Ubicación"
        name="location"
        value={eventData.location}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Crear evento
      </Button>
    </Box>
  );
};

export default EventForm;
