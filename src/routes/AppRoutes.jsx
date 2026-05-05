import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedProtectedRoute } from "./RoleBasedProtectedRoute";
import { DashboardShell } from "../features/common/DashboardShell";
import { StudentDashboard } from "../features/student/StudentDashboard";
import { TeacherDashboard } from "../features/teacher/TeacherDashboard";

const normalizeRole = (role) =>
  String(role || "").toUpperCase().replace(/^ROLE_/, "");

export const AppRoutes = () => {
  const { isAuthenticated, roles } = useSelector((state) => state.auth);

  const normalizedRoles = Array.isArray(roles)
    ? roles.map(normalizeRole)
    : [normalizeRole(roles)];

  const isMultiRole = normalizedRoles.length > 1;

  const defaultSubRoute = isMultiRole
    ? "student"
    : normalizedRoles.includes("TEACHER")
    ? "teacher"
    : "student";

  const defaultDashboard = `/dashboard/${defaultSubRoute}`;

  return (
    <Routes>
      {/* Root */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? defaultDashboard : "/login"}
            replace
          />
        }
      />

      {/* Auth Routes */}
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <Register />
          ) : (
            <Navigate to={defaultDashboard} replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to={defaultDashboard} replace />
          )
        }
      />

      {/* Dashboard (Nested) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardShell />
          </ProtectedRoute>
        }
      >
        {/* Default dashboard route */}
        <Route
          index
          element={<Navigate to={defaultSubRoute} replace />}
        />

        {/* Student */}
        <Route
          path="student"
          element={
            <RoleBasedProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
              <StudentDashboard />
            </RoleBasedProtectedRoute>
          }
        />

        {/* Teacher */}
        <Route
          path="teacher"
          element={
            <RoleBasedProtectedRoute allowedRoles={["ROLE_TEACHER"]}>
              <TeacherDashboard />
            </RoleBasedProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};