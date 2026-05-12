import { useState, useEffect, useCallback } from "react";
import { getUserData, createUserRole } from "../resource/usersApi";
import { getRolesData } from "../resource/rolesApi";
import "./AssignRole.css";

/**
 * AssignRole Component
 * Allows administrators to assign roles to users
 */
export const AssignRole = () => {
  const [userData, setUserData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
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

      // Refresh user data
      await fetchUsers();

    } catch (error) {
      console.error("Error updating role:", error);
      setErrors(prev => ({
        ...prev,
        updates: { ...prev.updates, [userId]: error.message }
      }));
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        updates: { ...prev.updates, [userId]: false }
      }));
    }
  }, [accessToken, fetchUsers]);

  // Initialize data on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  // Loading state for initial data
  if (loadingStates.users && loadingStates.roles) {
    return (
      <section className="assign-role-section">
        <div className="loading-container">
          <p>Loading data...</p>
        </div>
      </section>
    );
  }

  // Error state for critical data
  if (errors.users || errors.roles) {
    return (
      <section className="assign-role-section">
        <div className="error-container">
          <h3>Error Loading Data</h3>
          {errors.users && <p>Users: {errors.users}</p>}
          {errors.roles && <p>Roles: {errors.roles}</p>}
          <button 
            onClick={() => { fetchUsers(); fetchRoles(); }} 
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="assign-role-section">
      <div className="assign-role-header">
        <h2 className="assign-role-title">Assign Roles to Users</h2>
        <p className="assign-role-subtitle">View roles and assign to users who don't have them</p>
      </div>

      {rolesData.length === 0 ? (
        <p className="no-roles-message">No roles found.</p>
      ) : (
        <div className="roles-list">
          {rolesData.map((role) => {
            // Filter users who don't have this role
            const unassignedUsers = userData.filter(
              user => !user.roles || !user.roles.includes(role.label || role.name)
            );

            return (
              <div key={role.id} className="role-card">
                <div className="role-header">
                  <h3 className="role-name">{role.label || role.name}</h3>
                  <span className="unassigned-count">{unassignedUsers.length} users to assign</span>
                </div>

                {unassignedUsers.length === 0 ? (
                  <p className="all-assigned-message">All users have this role assigned.</p>
                ) : (
                  <div className="unassigned-users-list">
                    {unassignedUsers.map((user) => (
                      <div key={user.id} className="user-assignment-item">
                        <div className="user-assignment-info">
                          <p className="user-assignment-name">{user.name || "Unknown User"}</p>
                          <p className="user-assignment-id">ID: {user.id}</p>
                        </div>

                        <button
                          onClick={() => handleRoleUpdate(user.id, role.id)}
                          disabled={loadingStates.updates[user.id]}
                          className="assign-btn"
                        >
                          {loadingStates.updates[user.id] ? "Assigning..." : "Assign"}
                        </button>

                        {loadingStates.updates[user.id] && !errors.updates[user.id] && (
                          <span className="status-message success">✓ Assigned!</span>
                        )}
                        {errors.updates[user.id] && (
                          <span className="status-message error">✗ {errors.updates[user.id]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
