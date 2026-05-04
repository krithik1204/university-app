import { Route, Routes } from "react-router-dom";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";

/**
 * Application routing configuration
 * Defines all available routes and their corresponding components
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Default route - redirects to login */}
      <Route path="/" element={<Login />} />

      {/* Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Catch-all route - redirects to login for unknown paths */}
      <Route path="/*" element={<Login />} />
    </Routes>
  );
};