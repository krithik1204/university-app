import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Navigation</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <span className="nav-icon">🏠</span>
              <span className="nav-label">Dashboard</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">📚</span>
              <span className="nav-label">Courses</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">📝</span>
              <span className="nav-label">Assignments</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">📊</span>
              <span className="nav-label">Grades</span>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome to the Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>

        <div className="dashboard-content">
          <div className="user-info">
            <h2>User Information</h2>
            <div className="info-item">
              <strong>Full Name:</strong> {fullName || "Not provided"}
            </div>
            <div className="info-item">
              <strong>User ID:</strong> {userId || "Not available"}
            </div>
            <div className="info-item">
              <strong>Roles:</strong>
              {roles && roles.length > 0 ? (
                <ul>
                  {roles.map((role, index) => (
                    <li key={index}>{role}</li>
                  ))}
                </ul>
              ) : (
                <span>No roles assigned</span>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>Profile Details</h2>
            {profileLoading && <p>Loading profile...</p>}
            {profileError && (
              <p className="error-message">Error: {profileError}</p>
            )}
            {profileData && (
              <div className="profile-data">
                <pre>{JSON.stringify(profileData, null, 2)}</pre>
              </div>
            )}
          </div>

          <div className="dashboard-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button onClick={() => navigate("/profile")}>View Profile</button>
              <button onClick={() => navigate("/settings")}>Settings</button>
            </div>
          </div>

          <div className="scroll-test-content">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-icon">📄</span>
                  <div className="activity-details">
                    <p>Activity {i + 1}</p>
                    <small>2 hours ago</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};