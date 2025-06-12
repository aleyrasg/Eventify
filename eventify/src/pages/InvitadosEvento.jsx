import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const InvitadosEvento = () => {
  const { id } = useParams(); // event_id
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "" });
  const [editGuest, setEditGuest] = useState(null);
  const [rsvpSummary, setRsvpSummary] = useState({
    yes: 0,
    no: 0,
    maybe: 0,
    none: 0,
  });

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("*, rsvps(response)")
      .eq("event_id", id);

    if (!error && data) {
      setGuests(data);

      // Calcular resumen de asistencia
      const summary = { yes: 0, no: 0, maybe: 0, none: 0 };
      data.forEach((g) => {
        const r = g.rsvps?.response;
        if (r === "yes") summary.yes++;
        else if (r === "no") summary.no++;
        else if (r === "maybe") summary.maybe++;
        else summary.none++;
      });
      setRsvpSummary(summary);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [id]);

  const handleAddGuest = async () => {
    if (!newGuest.name.trim()) {
      Swal.fire("Nombre requerido", "", "warning");
      return;
    }

    const { error } = await supabase.from("guests").insert([
      {
        event_id: id,
        name: newGuest.name.trim(),
        email: newGuest.email.trim(),
        phone: newGuest.phone.trim(),
      },
    ]);

    if (error) {
      Swal.fire("Error", "No se pudo agregar el invitado.", "error");
    } else {
      setNewGuest({ name: "", email: "", phone: "" });
      fetchGuests();
    }
  };

  const handleDeleteGuest = async (guestId) => {
    const result = await Swal.fire({
      title: "¿Eliminar invitado?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("guests").delete().eq("id", guestId);

    if (error) {
      Swal.fire("Error", "No se pudo eliminar el invitado.", "error");
    } else {
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      fetchGuests();
    }
  };

  const handleUpdateGuest = async () => {
    if (!editGuest.name.trim()) {
      Swal.fire("Nombre requerido", "", "warning");
      return;
    }

    const { error } = await supabase
      .from("guests")
      .update({
        name: editGuest.name.trim(),
        email: editGuest.email.trim(),
        phone: editGuest.phone.trim(),
      })
      .eq("id", editGuest.id);

    if (error) {
      Swal.fire("Error", "No se pudo actualizar el invitado.", "error");
    } else {
      Swal.fire("Actualizado", "El invitado fue actualizado.", "success");
      setEditGuest(null);
      fetchGuests();
    }
  };

  const updateRSVP = async (guestId, newResponse) => {
    const { data: existing } = await supabase
      .from("rsvps")
      .select("*")
      .eq("guest_id", guestId)
      .single();

    if (existing) {
      await supabase
        .from("rsvps")
        .update({
          response: newResponse,
          responded_at: new Date().toISOString(),
        })
        .eq("guest_id", guestId);
    } else {
      await supabase.from("rsvps").insert([
        {
          guest_id: guestId,
          event_id: id,
          response: newResponse,
          responded_at: new Date().toISOString(),
        },
      ]);
    }

    fetchGuests();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Invitados del evento
      </Typography>

      {/* Resumen de asistencia */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Resumen de asistencia:
        </Typography>
        <Typography>✅ Asistirán: {rsvpSummary.yes}</Typography>
        <Typography>❌ No asistirán: {rsvpSummary.no}</Typography>
        <Typography>❓ Tal vez: {rsvpSummary.maybe}</Typography>
        <Typography>🕓 Sin respuesta: {rsvpSummary.none}</Typography>
      </Box>

      {/* Formulario para agregar */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField
          label="Nombre"
          value={newGuest.name}
          onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
        />
        <TextField
          label="Correo"
          value={newGuest.email}
          onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
        />
        <TextField
          label="Teléfono"
          value={newGuest.phone}
          onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
        />
        <Button variant="contained" onClick={handleAddGuest}>
          Agregar
        </Button>
      </Box>

      {/* Lista de invitados */}
      <List>
        {guests.map((guest) => (
          <ListItem key={guest.id} divider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography fontWeight="bold">{guest.name}</Typography>
                <Typography variant="body2">
                  {guest.email || "sin correo"} -{" "}
                  {guest.phone || "sin teléfono"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Select
                  size="small"
                  value={guest.rsvps?.response || ""}
                  onChange={(e) => updateRSVP(guest.id, e.target.value)}
                  sx={{ minWidth: 140 }}
                >
                  <MenuItem value="">Sin respuesta</MenuItem>
                  <MenuItem value="yes">✅ Asistirá</MenuItem>
                  <MenuItem value="no">❌ No asistirá</MenuItem>
                  <MenuItem value="maybe">❓ Tal vez</MenuItem>
                </Select>

                <IconButton onClick={() => setEditGuest(guest)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteGuest(guest.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Modal para editar */}
      <Dialog open={!!editGuest} onClose={() => setEditGuest(null)}>
        <DialogTitle>Editar invitado</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            value={editGuest?.name || ""}
            onChange={(e) =>
              setEditGuest({ ...editGuest, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Correo"
            value={editGuest?.email || ""}
            onChange={(e) =>
              setEditGuest({ ...editGuest, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Teléfono"
            value={editGuest?.phone || ""}
            onChange={(e) =>
              setEditGuest({ ...editGuest, phone: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditGuest(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdateGuest}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvitadosEvento;
