import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

const RecordatoriosEvento = () => {
  const { id } = useParams(); // event_id
  const [notifications, setNotifications] = useState([]);
  const [evento, setEvento] = useState(null);

  const [open, setOpen] = useState(false);
  const [nuevoRecordatorio, setNuevoRecordatorio] = useState({
    message: "",
    notify_at: "",
  });

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("event_id", id)
      .order("notify_at", { ascending: true });

    if (!error) setNotifications(data);
  };

  const fetchEvento = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("title")
      .eq("id", id)
      .single();

    if (!error) setEvento(data);
  };

  const handleDelete = async (notificationId) => {
    const result = await Swal.fire({
      title: "¿Eliminar recordatorio?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (!error) fetchNotifications();
  };

  const guardarRecordatorio = async () => {
    if (!nuevoRecordatorio.message || !nuevoRecordatorio.notify_at) {
      Swal.fire("Completa todos los campos", "", "warning");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("notifications").insert([
      {
        event_id: id,
        user_id: user.id,
        message: nuevoRecordatorio.message,
        notify_at: nuevoRecordatorio.notify_at,
        is_sent: false,
      },
    ]);

    if (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
    } else {
      Swal.fire("Guardado", "Recordatorio creado", "success");
      setOpen(false);
      setNuevoRecordatorio({ message: "", notify_at: "" });
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchEvento();
  }, [id]);

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {evento?.title && `${evento.title}`}
      </Typography>

      <Button
        variant="contained"
        sx={{ my: 2 }}
        onClick={() => setOpen(true)}
      >
        Agregar recordatorio
      </Button>

      {notifications.length === 0 ? (
        <Typography>No hay recordatorios programados.</Typography>
      ) : (
        <List>
          {notifications.map((n) => (
            <React.Fragment key={n.id}>
              <ListItem
                secondaryAction={
                  <IconButton onClick={() => handleDelete(n.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={n.message}
                  secondary={`📅 ${new Date(n.notify_at).toLocaleString()} - ${
                    n.is_sent ? "✅ Enviado" : "⏳ Pendiente"
                  }`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo recordatorio</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Mensaje"
            value={nuevoRecordatorio.message}
            onChange={(e) =>
              setNuevoRecordatorio({
                ...nuevoRecordatorio,
                message: e.target.value,
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Fecha y hora"
            type="datetime-local"
            value={nuevoRecordatorio.notify_at}
            onChange={(e) =>
              setNuevoRecordatorio({
                ...nuevoRecordatorio,
                notify_at: e.target.value,
              })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarRecordatorio}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecordatoriosEvento;
// This code defines a React component for managing event reminders in an application.