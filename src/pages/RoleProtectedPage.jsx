import { useSelector } from "react-redux";
import "./RoleProtectedPage.css";

export const RoleProtectedPage = () => {
  const { name, roles } = useSelector((state) => state.auth);
  const roleText = Array.isArray(roles) ? roles.join(", ") : roles || "None";

  return (
    <section className="role-protected-page">
      <h1 className="role-protected-title">Role-based Protected Route</h1>
      <p className="role-protected-text">This page is only accessible to users with allowed roles.</p>
      <p className="role-protected-text">
        Welcome, <strong>{name || "User"}</strong>. Your roles are:
        <strong> {roleText}</strong>
      </p>
    </section>
  );
};