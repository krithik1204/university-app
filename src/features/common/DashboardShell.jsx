import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import "./DashboardShell.css";

const normalizeRole = (role) =>
  String(role || "")
    .toUpperCase()
    .replace(/^ROLE_/, "");

const roleRouteMap = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin-dashboard",
};

export const DashboardShell = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { roles } = useSelector((state) => state.auth);

  const normalizedRoles = Array.isArray(roles)
    ? roles.map(normalizeRole)
    : [normalizeRole(roles)];

  const availableRoles = normalizedRoles.filter(Boolean);

  const currentSection =
    location.pathname.split("/").pop();

  const adminRoutes = [
    "admin-dashboard",
    "admin-user-role",
    "admin-faculty",
    "admin-add-faculty",
    "admin-update-faculty",
    "admin-create-role",
    "admin-assign-role",
  ];

  const isAdminRoute =
    adminRoutes.includes(currentSection);

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

  let roleLabel = "Dashboard";

  if (currentSection === "teacher") {
    roleLabel = "Teacher";
  } else if (currentSection === "student") {
    roleLabel = "Student";
  } else if (isAdminRoute) {
    roleLabel = "Admin";
  }

  const [selectedRole, setSelectedRole] =
    useState("");



  const navLinkClass = ({ isActive }) =>
    isActive
      ? "dashboard-nav-link dashboard-nav-link-active"
      : "dashboard-nav-link";

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-top">
          <h2 className="dashboard-sidebar-title">
            {roleLabel} Dashboard
          </h2>

          <p className="dashboard-sidebar-text">
            Quick access for your role.
          </p>
        </div>



        {/* Admin Navigation */}
        {availableRoles.includes("ADMIN") && (
          <nav className="dashboard-nav">
            <ul>
              <li>
                <NavLink
                  to="admin-user-role"
                  className={navLinkClass}
                >
                  <span className="dashboard-nav-icon">
                    👥
                  </span>

                  User Role Management
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="admin-faculty"
                  className={navLinkClass}
                >
                  <span className="dashboard-nav-icon">
                    🎓
                  </span>

                  Faculty Management
                </NavLink>
              </li>
            </ul>
          </nav>
        )}
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {/* User Role Buttons */}
        {availableRoles.includes("ADMIN") &&
          isUserRolePage && (
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
                to="admin-user-role"
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
        {availableRoles.includes("ADMIN") &&
          isFacultyPage && (
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

        {/* Content */}
        <section className="dashboard-content">
          {children || <Outlet />}
        </section>
      </main>
    </div>
  );
};