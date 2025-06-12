import React from "react";
import { Card, CardContent, Typography, IconButton, Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, onDelete, onEdit }) => {
  const navigate = useNavigate();
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
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {event.title || "(Sin título)"}
        </Typography>

        {event.event_types?.name && (
          <Typography
            variant="body2"
            sx={{ color: "#714ca5", fontWeight: 500, mb: 1 }}
          >
            {event.event_types.name}
          </Typography>
        )}

        {event.description && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            {event.description}
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2">
            <strong>Fecha:</strong> {event.date || "Sin fecha"}
          </Typography>
          <Typography variant="body2">
            <strong>Ubicación:</strong> {event.location || "No definida"}
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          sx={{ mt: 1, borderColor: "#6a1b9a", color: "#6a1b9a" }}
          onClick={() => navigate(`/evento/${event.id}/invitados`)}
        >
          Ver invitados
        </Button>
      </CardContent>

      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <IconButton
          onClick={() => onEdit?.(event.id)}
          size="small"
          sx={{ color: "#4b1c71", mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => onDelete?.(event.id)}
          size="small"
          sx={{ color: "#4b1c71" }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default EventCard;
