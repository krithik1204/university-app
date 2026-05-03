import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "./AuthSlice";
import { getUserProfile } from "./profileApi";

/**
 * Dashboard component - main authenticated user interface
 * Displays user information and provides logout functionality
 */
export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get authentication state from Redux store (excluding accessToken)
  const { fullName, roles, userId, isAuthenticated } = useSelector(state => state.auth);

  // Get access token from sessionStorage
  const accessToken = sessionStorage.getItem('accessToken');

  // Local state for profile data
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  /**
   * Fetches user profile data on component mount
   */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return;

      setProfileLoading(true);
      setProfileError(null);

      try {
        const profile = await getUserProfile(accessToken);
        setProfileData(profile);
      } catch (error) {
        setProfileError(error.message);
      } finally {
        setProfileLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [accessToken, isAuthenticated]);

  /**
   * Handles user logout
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to the Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="user-info">
          <h2>User Information</h2>
          <div className="info-item">
            <strong>Full Name:</strong> {fullName || 'Not provided'}
          </div>
          <div className="info-item">
            <strong>User ID:</strong> {userId || 'Not available'}
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
          {profileError && <p className="error-message">Error: {profileError}</p>}
          {profileData && (
            <div className="profile-data">
              <pre>{JSON.stringify(profileData, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="dashboard-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button onClick={() => navigate('/profile')}>
              View Profile
            </button>
            <button onClick={() => navigate('/settings')}>
              Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};