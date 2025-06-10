import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import Layout from "./components/Layout.jsx";
import RequireAuth from "./auth/RequireAuth";
import Login from "./auth/Login";
import Register from "./auth/Register.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/crear"
            element={
              <RequireAuth>
                <CreateEvent />
              </RequireAuth>
            }
          />

          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
  </React.StrictMode>
);
