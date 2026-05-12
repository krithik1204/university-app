import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import "./DashboardShell.css";

const normalizeRole = (role) => String(role || "").toUpperCase().replace(/^ROLE_/, "");

export const DashboardShell = ({ children }) => {
  const location = useLocation();
  const { name, roles } = useSelector((state) => state.auth);
  const normalizedRoles = Array.isArray(roles) ? roles.map(normalizeRole) : [normalizeRole(roles)];
  const availableRoles = new Set(normalizedRoles.filter(Boolean));
  const currentSection = location.pathname.split("/").pop();
  const [isAdminExpanded, setIsAdminExpanded] = useState(true);
  
  const selectedRole = currentSection
  ? currentSection.toUpperCase()
  : normalizedRoles[0] || "";
  const currentSectionAuthorized =
    currentSection === "teacher"
      ? availableRoles.has("TEACHER")
      : currentSection === "student"
      ? availableRoles.has("STUDENT")
      : (currentSection === "admin-dashboard" || currentSection === "admin-user-role" || currentSection === "admin-faculty" || currentSection === "admin-add-faculty" || currentSection === "admin-update-faculty" || currentSection === "admin-create-role" || currentSection === "admin-assign-role")
      ? availableRoles.has("ADMIN")
      : availableRoles.size > 0;

  const navLinks = [];
  if (availableRoles.has("STUDENT")) {
    navLinks.push({ to: "student", label: "Student", icon: "📚" });
  }
  if (availableRoles.has("TEACHER")) {
    navLinks.push({ to: "teacher", label: "Teacher", icon: "🏫" });
  }

  const roleLabel = currentSectionAuthorized
    ? currentSection === "teacher"
      ? "Teacher"
      : currentSection === "student"
      ? "Student"
      : (currentSection === "admin-dashboard" || currentSection === "admin-user-role" || currentSection === "admin-faculty" || currentSection === "admin-add-faculty" || currentSection === "admin-update-faculty" || currentSection === "admin-create-role" || currentSection === "admin-assign-role")
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

            {/* Admin Management Section */}
            {availableRoles.has("ADMIN") && (
              <li className="admin-menu-parent">
                <button
                  className="admin-menu-toggle"
                  onClick={() => setIsAdminExpanded(!isAdminExpanded)}
                >
                  <span className="dashboard-nav-icon">⚙️</span>
                  <span>Admin Management</span>
                  <span className={`toggle-icon ${isAdminExpanded ? "expanded" : ""}`}>▼</span>
                </button>

                {isAdminExpanded && (
                  <ul className="admin-submenu">
                    <li>
                      <NavLink
                        to="admin-user-role"
                        className={({ isActive }) =>
                          isActive ? "dashboard-nav-link dashboard-nav-link-active admin-submenu-link" : "dashboard-nav-link admin-submenu-link"
                        }
                      >
                        <span className="dashboard-nav-icon">👥</span>
                        User Role Management
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="admin-faculty"
                        className={({ isActive }) =>
                          isActive ? "dashboard-nav-link dashboard-nav-link-active admin-submenu-link" : "dashboard-nav-link admin-submenu-link"
                        }
                      >
                        <span className="dashboard-nav-icon">🎓</span>
                        Faculty Management
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        {/* Admin Quick Access Bar */}
        {availableRoles.has("ADMIN") && currentSection === "admin-user-role" && (
          <div className="admin-quick-bar">
            <NavLink
              to="admin-create-role"
              className={({ isActive }) =>
                isActive ? "admin-quick-btn admin-quick-btn-active" : "admin-quick-btn"
              }
            >
              <span>➕</span> Add Role
            </NavLink>
            <NavLink
              to="admin-assign-role"
              className={({ isActive }) =>
                isActive ? "admin-quick-btn admin-quick-btn-active" : "admin-quick-btn"
              }
            >
              <span>👤</span> Assign Role
            </NavLink>
          </div>
        )}

        {availableRoles.has("ADMIN") && currentSection === "admin-faculty" && (
          <div className="admin-quick-bar">
            <NavLink
              to="admin-add-faculty"
              className={({ isActive }) =>
                isActive ? "admin-quick-btn admin-quick-btn-active" : "admin-quick-btn"
              }
            >
              <span>➕</span> Add Faculty
            </NavLink>
            <NavLink
              to="admin-update-faculty"
              className={({ isActive }) =>
                isActive ? "admin-quick-btn admin-quick-btn-active" : "admin-quick-btn"
              }
            >
              <span>✏️</span> Update Faculty
            </NavLink>
          </div>
        )}

        <section className="dashboard-content">
          {children || <Outlet />}
        </section>
      </main>
    </div>
  );
};