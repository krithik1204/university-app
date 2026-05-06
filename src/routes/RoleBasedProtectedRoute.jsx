import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import "./RoleBasedProtectedRoute.css";

const normalizeRole = (role) => String(role || "").toUpperCase().replace(/^ROLE_/, "");

export const RoleBasedProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const roles = useSelector((state) => state.auth.roles) || [];
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const normalizedRoles = (Array.isArray(roles) ? roles : [roles]).map(normalizeRole);
  const normalizedAllowedRoles = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map(normalizeRole);
  const hasRequiredRole =
    normalizedAllowedRoles.length === 0 ||
    normalizedAllowedRoles.some((role) => normalizedRoles.includes(role));

  if (!hasRequiredRole) {
    return (
      <section className="access-denied-section">
        <div className="access-denied-card">
          <h1 className="access-denied-title">Access Denied</h1>
          <p className="access-denied-text">You don&apos;t have authorization to access any functionality.</p>
          <p className="access-denied-text">If you believe this is a mistake, please contact your administrator.</p>
        </div>
      </section>
    );
  }

  return children;
};