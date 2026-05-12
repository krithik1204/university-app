import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./DashboardShell.css";

const normalizeRole = (role) =>
  String(role || "")
    .toUpperCase()
    .replace(/^ROLE_/, "");

export const DashboardShell = ({ children }) => {
  const location = useLocation();
  const { roles } = useSelector((state) => state.auth);

  const normalizedRoles = Array.isArray(roles)
    ? roles.map(normalizeRole)
    : [normalizeRole(roles)];

  const availableRoles = new Set(normalizedRoles.filter(Boolean));

  const currentSection = location.pathname.split("/").pop();

  const adminRoutes = [
    "admin-dashboard",
    "admin-user-role",
    "admin-faculty",
    "admin-add-faculty",
    "admin-update-faculty",
    "admin-create-role",
    "admin-assign-role",
  ];

  const isAdminRoute = adminRoutes.includes(currentSection);

  const isUserRolePage = [
    "admin-user-role",
    "admin-create-role",
    "admin-assign-role",
  ].includes(currentSection);

  const isFacultyPage = [
    "admin-faculty",
    "admin-add-faculty",
    "admin-update-faculty",
  ].includes(currentSection);

  const currentSectionAuthorized =
    currentSection === "teacher"
      ? availableRoles.has("TEACHER")
      : currentSection === "student"
      ? availableRoles.has("STUDENT")
      : isAdminRoute
      ? availableRoles.has("ADMIN")
      : availableRoles.size > 0;

  let roleLabel = "Dashboard";

  if (currentSectionAuthorized) {
    if (currentSection === "teacher") {
      roleLabel = "Teacher";
    } else if (currentSection === "student") {
      roleLabel = "Student";
    } else if (isAdminRoute) {
      roleLabel = "Admin";
    }
  }

  const navLinks = [];

  if (availableRoles.has("STUDENT")) {
    navLinks.push({
      to: "student",
      label: "Student",
      icon: "📚",
    });
  }

  if (availableRoles.has("TEACHER")) {
    navLinks.push({
      to: "teacher",
      label: "Teacher",
      icon: "🏫",
    });
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "dashboard-nav-link dashboard-nav-link-active"
      : "dashboard-nav-link";

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-top">
          <h2 className="dashboard-sidebar-title">
            {`${roleLabel} Dashboard`}
          </h2>

          <p className="dashboard-sidebar-text">
            Quick access for your role.
          </p>
        </div>

        <nav className="dashboard-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClass}>
                  <span className="dashboard-nav-icon">{link.icon}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}

            {availableRoles.has("ADMIN") && (
              <>
                <li>
                  <NavLink
                    to="admin-user-role"
                    className={navLinkClass}
                  >
                    <span className="dashboard-nav-icon">👥</span>
                    User Role Management
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="admin-faculty"
                    className={navLinkClass}
                  >
                    <span className="dashboard-nav-icon">🎓</span>
                    Faculty Management
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        {/* User Role Buttons */}
        {availableRoles.has("ADMIN") && isUserRolePage && (
          <div className="admin-quick-bar">
            <NavLink
              to="admin-create-role"
              className={({ isActive }) =>
                isActive
                  ? "admin-quick-btn admin-quick-btn-active"
                  : "admin-quick-btn"
              }
            >
              <span>➕</span> Add Role
            </NavLink>

            <NavLink
              to="admin-assign-role"
              className={({ isActive }) =>
                isActive
                  ? "admin-quick-btn admin-quick-btn-active"
                  : "admin-quick-btn"
              }
            >
              <span>👤</span> Assign Role
            </NavLink>
          </div>
        )}

        {/* Faculty Buttons */}
        {availableRoles.has("ADMIN") && isFacultyPage && (
          <div className="admin-quick-bar">
            <NavLink
              to="admin-add-faculty"
              className={({ isActive }) =>
                isActive
                  ? "admin-quick-btn admin-quick-btn-active"
                  : "admin-quick-btn"
              }
            >
              <span>➕</span> Add Faculty
            </NavLink>

            <NavLink
              to="admin-update-faculty"
              className={({ isActive }) =>
                isActive
                  ? "admin-quick-btn admin-quick-btn-active"
                  : "admin-quick-btn"
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