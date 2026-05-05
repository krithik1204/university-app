import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../pages/styles/Dashboard.css";

const normalizeRole = (role) => String(role || "").toUpperCase().replace(/^ROLE_/, "");

export const DashboardShell = ({ children }) => {
  const location = useLocation();
  const { fullName, roles } = useSelector((state) => state.auth);
  const normalizedRoles = Array.isArray(roles) ? roles.map(normalizeRole) : [normalizeRole(roles)];
  const availableRoles = new Set(normalizedRoles.filter(Boolean));
  const hasAuthorizedRole = availableRoles.size > 0;
  const currentSection = location.pathname.split("/").pop();
  const selectedRole = currentSection === "teacher" ? "TEACHER" : "STUDENT";
  const currentSectionAuthorized =
    currentSection === "teacher"
      ? availableRoles.has("TEACHER")
      : currentSection === "student"
      ? availableRoles.has("STUDENT")
      : hasAuthorizedRole;

  const navLinks = [];
  if (availableRoles.has("STUDENT")) {
    navLinks.push({ to: "student", label: "Student", icon: "📚" });
  }
  if (availableRoles.has("TEACHER")) {
    navLinks.push({ to: "teacher", label: "Teacher", icon: "🏫" });
  }

  const roleLabel = currentSectionAuthorized
    ? selectedRole === "TEACHER"
      ? "Teacher"
      : "Student"
    : "Dashboard";
  const sidebarClass = currentSectionAuthorized
    ? selectedRole === "TEACHER"
      ? "teacher-sidebar"
      : "student-sidebar"
    : "";

  return (
    <div className="dashboard-container">
      {currentSectionAuthorized && (
        <aside className={`dashboard-sidebar ${sidebarClass}`}>
          <div className="sidebar-header">
            <h2>{`${roleLabel} Dashboard`}</h2>
            <p className="sidebar-subtitle">Quick access for your role.</p>
          </div>
          <nav className="sidebar-nav">
            <ul>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      isActive ? "nav-item active" : "nav-item"
                    }
                  >
                    <span className="nav-icon">{link.icon}</span>
                    <span className="nav-label">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      <main className={`dashboard-main ${hasAuthorizedRole ? "" : "no-sidebar"}`}>
        <header className="dashboard-header">
          <h1>{`${roleLabel} Workspace`}</h1>
          <p>
            Welcome back, {fullName || "User"}. {hasAuthorizedRole ? "Access your role-specific features from the left menu." : "You don't have authorization to access any functionality."}
          </p>
        </header>
        <div className="dashboard-content">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};