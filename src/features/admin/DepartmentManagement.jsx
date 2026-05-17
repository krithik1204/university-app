import "./DepartmentManagement.css";
import { useState, useEffect, useCallback } from "react";
import { getDepartments, deleteDepartment } from "../resource/departmentApi";

/**
 * DepartmentManagement Component
 * Manages departments in the system
 */
export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState({ type: "", text: "" });

  const accessToken = sessionStorage.getItem("accessToken");

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDepartments(accessToken);
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err.message || "Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDelete = useCallback(
    async (departmentId) => {
      if (!window.confirm("Are you sure you want to delete this department?")) {
        return;
      }

      setDeleteMessage({ type: "", text: "" });
      try {
        await deleteDepartment(accessToken, departmentId);
        setDeleteMessage({
          type: "success",
          text: "Department deleted successfully."
        });
        setDepartments((prev) =>
          prev.filter((dept) => dept.id !== departmentId)
        );
      } catch (err) {
        console.error("Error deleting department:", err);
        setDeleteMessage({
          type: "error",
          text: err.message || "Failed to delete department."
        });
      }
    },
    [accessToken]
  );

  return (
    <section className="department-management-section">
      <div className="department-management-header">
        <h2 className="department-management-title">Department Management</h2>
        <p className="department-management-subtitle">
          Manage all departments in your institution
        </p>
      </div>

      {deleteMessage.text && (
        <div className={`form-message form-message-${deleteMessage.type}`}>
          {deleteMessage.type === "success" ? "✓" : "✗"} {deleteMessage.text}
        </div>
      )}

      {error && <div className="form-message form-message-error">✗ {error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="empty-state">
          <p>No departments found. Create one to get started.</p>
        </div>
      ) : (
        <div className="department-list">
          <table className="department-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Head</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} className="department-row">
                  <td>{dept.name}</td>
                  <td>{dept.code}</td>
                  <td>{dept.head || "—"}</td>
                  <td>{dept.location || "—"}</td>
                  <td className="actions-cell">
                    <button className="edit-btn">Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(dept.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
