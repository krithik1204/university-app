import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./common.css";

export const MultiRoleDashboard = () => {
  const { fullName, roles } = useSelector((state) => state.auth);

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
      <header className="mr-header">
        <h1>Welcome, {fullName || "User"}</h1>
        <p>You have multiple roles. Select which dashboard to access:</p>
      </header>

      <div className="role-selector">
        {roleOptions.map((option) => (
          <NavLink key={option.to} to={option.to} className="role-card">
            <div className="role-icon">{option.icon}</div>
            <h3>{option.label}</h3>
            <p>{option.desc}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};