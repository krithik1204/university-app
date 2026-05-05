import { useSelector } from "react-redux";

export const RoleProtectedPage = () => {
  const { fullName, roles } = useSelector((state) => state.auth);
  const roleText = Array.isArray(roles) ? roles.join(", ") : roles || "None";

  return (
    <section className="page-section">
      <h1>Role-based Protected Route</h1>
      <p>This page is only accessible to users with allowed roles.</p>
      <p>
        Welcome, <strong>{fullName || "User"}</strong>. Your roles are:
        <strong> {roleText}</strong>
      </p>
    </section>
  );
};