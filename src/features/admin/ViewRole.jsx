import { useState, useEffect, useCallback } from "react";
import { getRolesData } from "../resource/rolesApi";
import "./ViewRole.css";

/**
 * ViewRole Component
 * Displays all roles in the system
 */
export const ViewRole = () => {
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const accessToken = sessionStorage.getItem("accessToken");

  const fetchRoles = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getRolesData(accessToken);
      setRolesData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(err.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  if (loading) {
    return (
      <section className="view-role-section">
        <p>Loading roles...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="view-role-section">
        <h3 className="error-title">Error Loading Roles</h3>
        <p className="error-text">{error}</p>

        <button onClick={fetchRoles} className="retry-btn">
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="view-role-section">
      {/* Header */}
      <div className="view-role-header">
        <h2 className="view-role-title">All Roles</h2>
        <p className="view-role-subtitle">
          Total Roles: {rolesData.length}
        </p>
      </div>

      {/* Empty state */}
      {rolesData.length === 0 ? (
        <p className="no-roles-message">No roles found.</p>
      ) : (
        <div className="roles-table">
          {/* Table Header */}
          <div className="roles-row roles-header">
            <span>ID</span>
            <span>Role Name</span>
            <span>Description</span>
          </div>

          {/* Rows */}
          {rolesData.map((role) => (
            <div
              key={`${role.id}-${role.name}`}
              className="roles-row"
            >
              <span className="role-id">{role.id || "-"}</span>
              <span className="role-name">
                {role.label || role.name}
              </span>
              <span className="role-desc">
                {role.description || "No description"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};