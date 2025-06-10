import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import EventCard from "../components/EventCard";
import { Container, Typography, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      Swal.fire("Error", "No se pudo obtener el usuario actual.", "error");
      return navigate("/login");
    }

    const userId = authData.user.id;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error al obtener eventos:", error.message);
    } else {
      setEvents(data);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Eliminar evento?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("events").delete().eq("id", id);

        if (error) {
          Swal.fire("Error", "No se pudo eliminar el evento.", "error");
        } else {
          setEvents(events.filter((event) => event.id !== id));
          Swal.fire(
            "Eliminado",
            "El evento fue eliminado correctamente.",
            "success"
          );
        }
      }
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis eventos
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : events.length > 0 ? (
        events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            description={event.description}
            date={event.date}
            location={event.location}
            onDelete={handleDelete}
            onEdit={(id) => navigate(`/editar/${id}`)}
          />
        ))
      ) : (
        <Typography variant="body1">No hay eventos registrados.</Typography>
      )}
    </Container>
  );
};

export default Home;
