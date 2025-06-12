import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import EditarEvento from "./pages/EditarEvento.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import Layout from "./components/Layout.jsx";
import theme from "./theme.jsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import InvitadosEvento from "./pages/InvitadosEvento.jsx";
import RecordatoriosEvento from "./pages/RecordatoriosEvento";
import TareasEvento from "./pages/TareasEvento";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas bajo layout */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout>
                  <Home />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/crear"
            element={
              <RequireAuth>
                <Layout>
                  <CreateEvent />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/editar/:id"
            element={
              <RequireAuth>
                <Layout>
                  <EditarEvento />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/evento/:id/invitados"
            element={
              <RequireAuth>
                <Layout>
                  <InvitadosEvento />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/evento/:id/recordatorios"
            element={
              <RequireAuth>
                <Layout>
                  <RecordatoriosEvento />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/evento/:id/tareas"
            element={
              <RequireAuth>
                <Layout>
                  <TareasEvento />
                </Layout>
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
