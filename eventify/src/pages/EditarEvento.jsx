import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import Swal from "sweetalert2";

const EditarEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type_id: ""
  });

  const [eventTypes, setEventTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Swal.fire("Error", "No se pudo cargar el evento.", "error");
        navigate("/");
      } else {
        setEventData(data);
      }

      setLoading(false);
    };

    fetchEvent();
  }, [id, navigate]);

  useEffect(() => {
    const fetchAuxData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const [typesResult, locationsResult] = await Promise.all([
        supabase.from("event_types").select("*"),
        supabase.from("locations").select("*").eq("user_id", user.id),
      ]);

      if (!typesResult.error) setEventTypes(typesResult.data);
      if (!locationsResult.error) setLocations(locationsResult.data);
    };

    fetchAuxData();
  }, []);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !eventData.title ||
      !eventData.date ||
      !eventData.location ||
      !eventData.type_id
    ) {
      Swal.fire("Campos requeridos", "Completa todos los campos obligatorios.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Guardar cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase
      .from("events")
      .update({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        type_id: eventData.type_id,
      })
      .eq("id", id);

    if (error) {
      Swal.fire("Error", "No se pudo actualizar el evento.", "error");
    } else {
      Swal.fire("Actualizado", "El evento fue actualizado con éxito.", "success")
        .then(() => navigate("/"));
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

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="location-label">Ubicación</InputLabel>
        <Select
          labelId="location-label"
          name="location"
          value={eventData.location}
          label="Ubicación"
          onChange={handleChange}
        >
          {locations.map((loc) => (
            <MenuItem key={loc.id} value={loc.name}>
              {loc.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        onClick={() => setOpenDialog(true)}
        sx={{ mt: 1 }}
      >
        + Nueva ubicación
      </Button>

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

      {/* Diálogo para nueva ubicación */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nueva ubicación</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la ubicación"
            fullWidth
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={async () => {
              if (!newLocation.trim()) {
                Swal.fire("Campo vacío", "Ingresa un nombre válido.", "warning");
                return;
              }

              const { data: { user } } = await supabase.auth.getUser();

              const { data, error } = await supabase
                .from("locations")
                .insert([{ name: newLocation.trim(), user_id: user.id }])
                .select();

              if (error) {
                Swal.fire("Error", "No se pudo guardar la ubicación.", "error");
              } else {
                setLocations((prev) => [...prev, ...data]);
                setEventData((prev) => ({
                  ...prev,
                  location: data[0].name,
                }));
                setNewLocation("");
                setOpenDialog(false);
                Swal.fire("¡Ubicación añadida!", "", "success");
              }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditarEvento;
