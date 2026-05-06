import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../features/auth/authSlice";
import { getUserProfile } from "../features/profile/profileApi";
import './Dashboard.css';
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

  const { fullName, roles, isAuthenticated } = useSelector(
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
  const sidebarHighlight = isAdminArea
    ? "from-emerald-500 to-slate-900"
    : isTeacher
    ? "from-sky-500 to-slate-900"
    : "from-indigo-500 to-slate-900";

  const sidebarSections = isAdminArea
    ? [{ title: "Admin Menu", items: adminLinks }]
    : [{ title: "Student Menu", items: roleLinks }];

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <aside className="dashboard-sidebar h-screen">
          <div className="dashboard-sidebar-header">
            University App
          </div>
          <div className="dashboard-sidebar-quote-box">
            <p className="dashboard-sidebar-quote-text">"Arise, awake, and stop not till the goal is reached."</p>
            <p className="dashboard-sidebar-quote-author">— Swami Vivekananda</p>
          </div>
          <div className="dashboard-nav-header">
            <h2 className="dashboard-nav-title">{isAdminArea ? "Admin Panel" : `${roleLabel} Navigation`}</h2>
            {!isAdminArea && <p className="dashboard-nav-subtitle">Quick access for {roleLabel.toLowerCase()} workflows.</p>}
          </div>
          <nav className="dashboard-nav">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                {!isAdminArea && <div className="dashboard-nav-section-title">{section.title}</div>}
                <ul className="dashboard-nav-list">
                  {section.items.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          isActive ? 'dashboard-nav-link dashboard-nav-link-active' : 'dashboard-nav-link dashboard-nav-link-inactive'
                        }
                      >
                        <span className="dashboard-nav-icon">{link.icon}</span>
                        <span>{link.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
      </aside>

        <main className="dashboard-main">
          <header className="dashboard-main-header">
            <div className="dashboard-main-header-top">
              <div>
                <p className="dashboard-main-welcome">Welcome back</p>
                <h1 className="dashboard-main-title">
                  {isAdminArea ? "Admin Dashboard" : `${roleLabel} Dashboard`}
                </h1>
              </div>
              <div className="dashboard-main-user">
                {fullName || "User"}
              </div>
            </div>
          </header>

          <section className="dashboard-main-content">
            {isAdminArea ? (
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Admin section: {currentAdminSection}</h2>
                <p className="dashboard-card-text">
                  Use the left navigation links to explore admin pages like overview, users, reports and settings.
                </p>
              </div>
            ) : (
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Welcome back, {roleLabel}</h2>
                <p className="dashboard-card-text">Your dashboard gives you quick access to assignments, schedules, and progress tracking.</p>
              </div>
            )}

            <div className="dashboard-card">
              <h3 className="dashboard-card-title">Recent Activity</h3>
              <p className="dashboard-card-text">No activity yet. Start by selecting a section from the sidebar above.</p>
            </div>
          </section>
        </main>
    </div>
  );
};