import "./AdminDashboard.css";
import { getUserData, createUserRole } from "../resource/usersApi";
import { getRolesData } from "../resource/rolesApi";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

/**
 * AdminDashboard Component
 * Provides interface for administrators to manage user roles
 */
export const AdminDashboard = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // State management
  const [userData, setUserData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [loadingStates, setLoadingStates] = useState({
    users: false,
    roles: false,
    updates: {}
  });
  const [errors, setErrors] = useState({
    users: null,
    roles: null,
    updates: {}
  });

  const accessToken = sessionStorage.getItem("accessToken");

  /**
   * Fetches all users data
   */
  const fetchUsers = useCallback(async () => {
    if (!accessToken) return;

    setLoadingStates(prev => ({ ...prev, users: true }));
    setErrors(prev => ({ ...prev, users: null }));

    try {
      const data = await getUserData(accessToken);
      setUserData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrors(prev => ({ ...prev, users: error.message }));
    } finally {
      setLoadingStates(prev => ({ ...prev, users: false }));
    }
  }, [accessToken]);

  /**
   * Fetches all available roles
   */
  const fetchRoles = useCallback(async () => {
    if (!accessToken) return;

    setLoadingStates(prev => ({ ...prev, roles: true }));
    setErrors(prev => ({ ...prev, roles: null }));

    try {
      const data = await getRolesData(accessToken);
      setRolesData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setErrors(prev => ({ ...prev, roles: error.message }));
    } finally {
      setLoadingStates(prev => ({ ...prev, roles: false }));
    }
  }, [accessToken]);

  /**
   * Updates a user's role
   */
  const handleRoleUpdate = useCallback(async (userId, roleId) => {

    

    if (!userId || !roleId || !accessToken) {
      setErrors(prev => ({
        ...prev,
        updates: { ...prev.updates, [userId]: "Invalid user ID or role" }
      }));
      return;
    }

    setLoadingStates(prev => ({
      ...prev,
      updates: { ...prev.updates, [userId]: true }
    }));
    setErrors(prev => ({
      ...prev,
      updates: { ...prev.updates, [userId]: null }
    }));

    try {
      await createUserRole(accessToken, userId, roleId);
           
      // Clear success message after 3 seconds
      setTimeout(() => {
        setLoadingStates(prev => ({
          ...prev,
          updates: { ...prev.updates, [userId]: false }
        }));
      }, 3000);

      // Refresh user data
      await fetchUsers();

      // Clear selected role after successful update
      setSelectedRoles(prev => ({ ...prev, [userId]: "" }));

    } catch (error) {
      console.error("Error updating role:", error);
      setErrors(prev => ({
        ...prev,
        updates: { ...prev.updates, [userId]: error.message }
      }));
      setLoadingStates(prev => ({
        ...prev,
        updates: { ...prev.updates, [userId]: false }
      }));
    }
  }, [accessToken, fetchUsers]);

  /**
   * Handles role selection change
   */
  const handleRoleChange = useCallback((userId, roleId) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: roleId }));
    // Clear any previous errors for this user
    setErrors(prev => ({
      ...prev,
      updates: { ...prev.updates, [userId]: null }
    }));
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchRoles();
    }
  }, [isAuthenticated, fetchUsers, fetchRoles]);

  // Loading state for initial data
  if (loadingStates.users && loadingStates.roles) {
    return (
      <section className="admin-dashboard-section">
        <div className="loading-container">
          <p>Loading dashboard data...</p>
        </div>
      </section>
    );
  }

  // Error state for critical data
  if (errors.users || errors.roles) {
    return (
      <section className="admin-dashboard-section">
        <div className="error-container">
          <h3>Error Loading Dashboard</h3>
          {errors.users && <p>Users: {errors.users}</p>}
          {errors.roles && <p>Roles: {errors.roles}</p>}
          <button onClick={() => { fetchUsers(); fetchRoles(); }} className="retry-btn">
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-dashboard-section">
      <h2 className="admin-dashboard-title">User Role Management</h2>

      {userData.length === 0 ? (
        <p className="no-users-message">No users found.</p>
      ) : (
        <div className="users-grid">
          {userData.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h3>{user.name || "Unknown User"}</h3>
                <p>User ID: {user.id}</p>
                <p>Current Role: <strong>{user.roles || "Not assigned"}</strong></p>
              </div>

              <div className="role-assignment-container">
                <label htmlFor={`role-select-${user.id}`}>Assign Role:</label>
                <select
                  id={`role-select-${user.id}`}
                  value={selectedRoles[user.id] || ""}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="role-select"
                  disabled={loadingStates.updates[user.id]}
                >
                  <option value="">-- Select a role --</option>
                  {rolesData.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label || role.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleRoleUpdate(user.id, selectedRoles[user.id])}
                  disabled={!selectedRoles[user.id] || loadingStates.updates[user.id]}
                  className="update-role-btn"
                >
                  {loadingStates.updates[user.id] ? "Updating..." : "Update Role"}
                </button>

                {loadingStates.updates[user.id] && !errors.updates[user.id] && (
                  <span className="status-message success">✓ Role updated successfully</span>
                )}
                {errors.updates[user.id] && (
                  <span className="status-message error">✗ {errors.updates[user.id]}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};