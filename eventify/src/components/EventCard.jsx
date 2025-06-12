import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EventCard = ({ event, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const [openReminderModal, setOpenReminderModal] = useState(false);
  const [reminder, setReminder] = useState({ message: "", notify_at: "" });
  const [reminderCount, setReminderCount] = useState(0);

  // Cargar número de recordatorios
  const fetchReminders = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("id")
      .eq("event_id", event.id);

    if (!error && data) setReminderCount(data.length);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // Agregar recordatorio
  const handleAddReminder = async () => {
    if (!reminder.message || !reminder.notify_at) {
      Swal.fire("Completa los campos", "", "warning");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("notifications").insert([
      {
        user_id: user.id,
        event_id: event.id,
        message: reminder.message,
        notify_at: reminder.notify_at,
        is_sent: false,
      },
    ]);

    if (error) {
      Swal.fire("Error", "No se pudo guardar el recordatorio", "error");
    } else {
      Swal.fire("Listo", "Recordatorio agregado", "success");
      setOpenReminderModal(false);
      setReminder({ message: "", notify_at: "" });
      fetchReminders();
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "#dbb6ee",
        color: "#2b2b2b",
        mb: 2,
        position: "relative",
        borderRadius: 3,
        boxShadow: 3,
        p: 1,
      }}
    >
      <CardContent>
        {/* ENCABEZADO */}
        <Box mb={1}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {event.title || "(Sin título)"}
          </Typography>

          {event.event_types?.name && (
            <Typography
              variant="body2"
              sx={{ color: "#714ca5", fontWeight: 500 }}
            >
              {event.event_types.name}
            </Typography>
          )}
        </Box>

        {/* DESCRIPCIÓN */}
        {event.description && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {event.description}
          </Typography>
        )}

        {/* FECHA Y UBICACIÓN */}
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="body2">
            <strong>📅 Fecha:</strong> {event.date || "Sin fecha"}
          </Typography>
          <Typography variant="body2">
            <strong>📍 Ubicación:</strong> {event.location || "No definida"}
          </Typography>
        </Box>

        {/* ACCIONES */}
        <Box display="flex" flexWrap="wrap" gap={1} justifyContent="space-between">
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/evento/${event.id}/invitados`)}
            >
              Invitados
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/evento/${event.id}/tareas`)}
            >
              Tareas
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/evento/${event.id}/recordatorios`)}
            >
              Recordatorios ({reminderCount})
            </Button>
          </Box>

          <Box display="flex" gap={1}>
            <Tooltip title="Agregar recordatorio">
              <IconButton onClick={() => setOpenReminderModal(true)}>
                <AddAlertIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar evento">
              <IconButton onClick={() => onEdit?.(event.id)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar evento">
              <IconButton onClick={() => onDelete?.(event.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>

      {/* MODAL RECORDATORIO */}
      <Dialog
        open={openReminderModal}
        onClose={() => setOpenReminderModal(false)}
      >
        <DialogTitle>Nuevo recordatorio</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Mensaje"
            value={reminder.message}
            onChange={(e) =>
              setReminder({ ...reminder, message: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Fecha y hora"
            type="datetime-local"
            value={reminder.notify_at}
            onChange={(e) =>
              setReminder({ ...reminder, notify_at: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReminderModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddReminder}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EventCard;
