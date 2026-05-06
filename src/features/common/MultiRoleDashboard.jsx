import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MultiRoleDashboard.css";

export const MultiRoleDashboard = () => {
  const { name, roles } = useSelector((state) => state.auth);

  const normalizeRole = (role) => String(role || "").toUpperCase().replace(/^ROLE_/, "");
  const normalizedRoles = Array.isArray(roles) ? roles.map(normalizeRole) : [normalizeRole(roles)];

  const roleOptions = normalizedRoles.map((role) => {
    const configs = {
      STUDENT: { to: "/dashboard/student", label: "Student Dashboard", icon: "📚", desc: "Access courses and assignments" },
      TEACHER: { to: "/dashboard/teacher", label: "Teacher Dashboard", icon: "🏫", desc: "Manage classes and students" },
    };
    return configs[role];
  }).filter(Boolean);

  return (
    <div className="multi-role-dashboard">
      <header className="multi-role-header">
        <h1 className="multi-role-title">Welcome, {name || "User"}</h1>
        <p className="multi-role-subtitle">You have multiple roles. Select which dashboard to access:</p>
      </header>

      <div className="multi-role-grid">
        {roleOptions.map((option) => (
          <NavLink
            key={option.to}
            to={option.to}
            className="multi-role-card"
          >
            <div className="multi-role-icon">{option.icon}</div>
            <h3 className="multi-role-card-title">{option.label}</h3>
            <p className="multi-role-card-desc">{option.desc}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};