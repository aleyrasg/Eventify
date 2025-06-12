import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

const TareasEvento = () => {
  const { id } = useParams(); // event_id
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [evento, setEvento] = useState(null);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("event_id", id)
      .order("created_at", { ascending: true });

    if (!error) setNotes(data);
  };

  const fetchEvento = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("title")
      .eq("id", id)
      .single();

    if (!error) setEvento(data);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const { error } = await supabase.from("notes").insert([
      {
        event_id: id,
        content: newNote.trim(),
        is_completed: false,
      },
    ]);

    if (!error) {
      setNewNote("");
      fetchNotes();
    }
  };

  const handleToggleComplete = async (note) => {
    const { error } = await supabase
      .from("notes")
      .update({ is_completed: !note.is_completed })
      .eq("id", note.id);

    if (!error) fetchNotes();
  };

  const handleDelete = async (noteId) => {
    const result = await Swal.fire({
      title: "¿Eliminar tarea?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("notes").delete().eq("id", noteId);
    if (!error) fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
    fetchEvento();
  }, [id]);

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Tareas del evento {evento?.title && `"${evento.title}"`}
      </Typography>

      <Box display="flex" gap={2} my={2}>
        <TextField
          fullWidth
          label="Nueva tarea"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddNote}>
          Agregar
        </Button>
      </Box>

      {notes.length === 0 ? (
        <Typography>No hay tareas.</Typography>
      ) : (
        <List>
          {notes.map((note) => (
            <React.Fragment key={note.id}>
              <ListItem
                secondaryAction={
                  <IconButton onClick={() => handleDelete(note.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <Checkbox
                  edge="start"
                  checked={note.is_completed}
                  onChange={() => handleToggleComplete(note)}
                />
                <ListItemText
                  primary={note.content}
                  sx={{
                    textDecoration: note.is_completed ? "line-through" : "none",
                    color: note.is_completed ? "gray" : "inherit",
                  }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TareasEvento;
