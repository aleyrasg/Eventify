import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { TextField, Button, Box, Typography } from "@mui/material";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

import Swal from "sweetalert2";

const EditarEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type_id: "",
  });

  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase.from("event_types").select("*");
      if (!error) setEventTypes(data);
    };
    fetchTypes();
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log("Fetching event with ID:", id);

        // Obtener usuario actual
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authData?.user) {
          Swal.fire(
            "Error",
            "No se pudo obtener el usuario autenticado.",
            "error"
          );
          return navigate("/login");
        }

        const user = authData.user;

        // Obtener el evento
        const { data: event, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();

        if (eventError) {
          Swal.fire("Error", "No se pudo cargar el evento.", "error");
          return navigate("/");
        }

        // Verificar propiedad del evento
        if (event.user_id !== user.id) {
          Swal.fire(
            "Acceso denegado",
            "No puedes editar un evento que no es tuyo.",
            "error"
          );
          return navigate("/");
        }

        console.log("Evento autorizado:", event);
        setEventData(event);
      } catch (err) {
        console.error("Unexpected error:", err);
        Swal.fire("Error", "Error inesperado al cargar el evento.", "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
    else navigate("/");
  }, [id, navigate]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (eventData.title.trim() === "" || eventData.location.trim() === "") {
      Swal.fire(
        "Campos requeridos",
        "El título y la ubicación son obligatorios.",
        "warning"
      );
      return;
    }

    if (!eventData.date) {
      Swal.fire(
        "Fecha requerida",
        "Por favor, elige una fecha válida.",
        "warning"
      );
      return;
    }

    const result = await Swal.fire({
      title: "¿Guardar cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      console.log("Updating event with ID:", id); // Debug log
      console.log("Update data:", eventData); // Debug log

      const { data, error } = await supabase
        .from("events")
        .update({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          location: eventData.location,
        })
        .eq("id", id)
        .select(); // Add .select() to return updated data

      if (error) {
        console.error("Update error:", error); // Debug log
        Swal.fire(
          "Error",
          `No se pudo actualizar el evento: ${error.message}`,
          "error"
        );
      } else {
        console.log("Event updated successfully:", data); // Debug log
        Swal.fire(
          "Actualizado",
          "El evento fue actualizado con éxito.",
          "success"
        ).then(() => navigate("/"));
      }
    } catch (err) {
      console.error("Unexpected error during update:", err);
      Swal.fire("Error", "Error inesperado al actualizar el evento.", "error");
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" gutterBottom>
        Editar evento
      </Typography>
      <TextField
        label="Título"
        name="title"
        value={eventData.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Descripción"
        name="description"
        value={eventData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        label="Fecha"
        name="date"
        type="date"
        value={eventData.date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        label="Ubicación"
        name="location"
        value={eventData.location}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel id="type-label">Tipo de evento</InputLabel>
        <Select
          labelId="type-label"
          name="type_id"
          value={eventData.type_id || ""}
          label="Tipo de evento"
          onChange={handleChange}
        >
          {eventTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Guardar cambios
      </Button>
    </Box>
  );
};

export default EditarEvento;
