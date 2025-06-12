import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const InvitadosEvento = () => {
  const { id } = useParams(); // event_id
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "" });

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
    }
  };

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("event_id", id);

    if (!error) setGuests(data);
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

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Invitados del evento
      </Typography>

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

      <List>
        {guests.map((guest) => (
          <ListItem
            key={guest.id}
            divider
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => handleDeleteGuest(guest.id)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            }
          >
            <ListItemText
              primary={guest.name}
              secondary={`${guest.email || "sin correo"} - ${
                guest.phone || "sin teléfono"
              }`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default InvitadosEvento;
