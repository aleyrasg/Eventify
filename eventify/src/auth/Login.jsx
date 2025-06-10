import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Swal.fire("Error", "Correo o contraseña incorrectos.", "error");
    } else {
      Swal.fire("Bienvenido", "Inicio de sesión exitoso.", "success").then(() =>
        navigate("/")
      );
    }
  };
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Iniciar sesión
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Correo"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Entrar
        </Button>

        <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/register")}>
          ¿No tienes cuenta? Regístrate
        </Button>

        <Typography variant="body2" sx={{ mt: 1 }}>
          <a href="/recuperar">¿Olvidaste tu contraseña?</a>
        </Typography>
      </form>
    </Box>
  );
};

export default Login;
