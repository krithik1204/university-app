import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

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
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-100 px-4 py-20">
        <div className="w-full max-w-xl rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-semibold text-slate-900">Access Denied</h1>
          <p className="mt-4 text-slate-600">You don&apos;t have authorization to access any functionality.</p>
          <p className="mt-4 text-slate-600">If you believe this is a mistake, please contact your administrator.</p>
        </div>
      </section>
    );
  }

  return children;
};