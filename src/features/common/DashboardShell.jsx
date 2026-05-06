import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./DashboardShell.css";

const normalizeRole = (role) => String(role || "").toUpperCase().replace(/^ROLE_/, "");

export const DashboardShell = ({ children }) => {
  const location = useLocation();
  const { name, roles } = useSelector((state) => state.auth);
  const normalizedRoles = Array.isArray(roles) ? roles.map(normalizeRole) : [normalizeRole(roles)];
  const availableRoles = new Set(normalizedRoles.filter(Boolean));
  const currentSection = location.pathname.split("/").pop();
  
  const selectedRole = currentSection
  ? currentSection.toUpperCase()
  : normalizedRoles[0] || "";
  const currentSectionAuthorized =
    currentSection === "teacher"
      ? availableRoles.has("TEACHER")
      : currentSection === "student"
      ? availableRoles.has("STUDENT")
      : (currentSection === "admin-dashboard" || currentSection === "admin-management")
      ? availableRoles.has("ADMIN")
      : availableRoles.size > 0;

  const navLinks = [];
  if (availableRoles.has("STUDENT")) {
    navLinks.push({ to: "student", label: "Student", icon: "📚" });
  }
  if (availableRoles.has("TEACHER")) {
    navLinks.push({ to: "teacher", label: "Teacher", icon: "🏫" });
  }
    if (availableRoles.has("ADMIN")) {
    navLinks.push({ to: "admin-dashboard", label: "Admin Dashboard", icon: "⚙️" });
    navLinks.push({ to: "admin-management", label: "Admin Management", icon: "🔧" });
  }

  const roleLabel = currentSectionAuthorized
    ? currentSection === "teacher"
      ? "Teacher"
      : currentSection === "student"
      ? "Student"
      : (currentSection === "admin-dashboard" || currentSection === "admin-management")
      ? "Admin"
      : "Dashboard"
    : "Dashboard";

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-top">
          <h2 className="dashboard-sidebar-title">{`${roleLabel} Dashboard`}</h2>
          <p className="dashboard-sidebar-text">Quick access for your role.</p>
        </div>

        <nav className="dashboard-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? "dashboard-nav-link dashboard-nav-link-active" : "dashboard-nav-link"
                  }
                >
                  <span className="dashboard-nav-icon">{link.icon}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">


        <section className="dashboard-content">
          {children || <Outlet />}
        </section>
      </main>
    </div>
  );
};