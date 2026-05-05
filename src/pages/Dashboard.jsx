import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../features/auth/authSlice";
import { getUserProfile } from "../features/profile/profileApi";
import "./styles/Dashboard.css";

/**
 * Dashboard component - main authenticated user interface
 * Displays user information and provides logout functionality
 */
export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/dashboard/admin");
  const currentAdminSection = location.pathname.replace("/dashboard/admin/", "") || "overview";

  const { fullName, roles, userId, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const accessToken = sessionStorage.getItem("accessToken");
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return;

      setProfileLoading(true);
      setProfileError(null);

      try {
        const profile = await getUserProfile(accessToken);
        setProfileData(profile);
      } catch (error) {
        setProfileError(error.message || "Unable to load profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [accessToken, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const studentLinks = [
    { to: "/dashboard", label: "My Courses", icon: "📚" },
    { to: "/dashboard/assignments", label: "Assignments", icon: "📝" },
    { to: "/dashboard/grades", label: "Grades", icon: "📊" },
    { to: "/dashboard/schedule", label: "Schedule", icon: "🗓️" },
  ];

  const teacherLinks = [
    { to: "/dashboard", label: "My Classes", icon: "🏫" },
    { to: "/dashboard/assignments", label: "Assignments", icon: "📝" },
    { to: "/dashboard/students", label: "Students", icon: "👥" },
    { to: "/dashboard/reports", label: "Reports", icon: "📈" },
  ];

  const adminLinks = [
    { to: "/dashboard/admin/overview", label: "Overview", icon: "🧭" },
    { to: "/dashboard/admin/users", label: "Manage Users", icon: "👥" },
    { to: "/dashboard/admin/reports", label: "Reports", icon: "📈" },
    { to: "/dashboard/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  const normalizeRole = (value) => String(value || "").toUpperCase().replace(/^ROLE_/, "");
  const normalizedRole = normalizeRole(Array.isArray(roles) ? roles[0] : roles);

  const isTeacher = normalizedRole === "TEACHER";
  const roleLinks = isTeacher ? teacherLinks : studentLinks;
  const roleLabel = isTeacher ? "Teacher" : "Student";
  const sidebarClass = isAdminArea
    ? "admin-sidebar"
    : isTeacher
    ? "teacher-sidebar"
    : "student-sidebar";

  const sidebarSections = isAdminArea
    ? [{ title: "Admin Menu", items: adminLinks }]
    : [{ title: "Student Menu", items: roleLinks }];

  return (
    <div className="dashboard-container">
      <aside className={`dashboard-sidebar ${sidebarClass}`}>
        <div className="sidebar-header">
          <h2>{isAdminArea ? "Admin Panel" : `${roleLabel} Navigation`}</h2>
          {!isAdminArea && <p className="sidebar-subtitle">Quick access for {roleLabel.toLowerCase()} workflows.</p>}
        </div>
        <nav className="sidebar-nav">
          {sidebarSections.map((section) => (
            <div key={section.title} className="nav-group">
              {!isAdminArea && <div className="nav-group-title">{section.title}</div>}
              <ul>
                {section.items.map((link) => (
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
            </div>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>
            {isAdminArea
              ? "Admin Dashboard"
              : `${roleLabel} Dashboard`}
          </h1>

        </header>

        <div className="dashboard-content">
          {isAdminArea && (
            <section className="admin-summary">
              <h2>Admin section: {currentAdminSection}</h2>
              <p>
                Use the left navigation links to explore admin pages like overview,
                users, reports and settings.
              </p>
            </section>
          )}

          
            <div className="scroll-test-content">
            <h3>Recent Activity</h3>
            
          </div>
        </div>
      </main>
    </div>
  );
};