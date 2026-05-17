import "./ViewDepartment.css";
import { useState, useEffect, useCallback } from "react";
import { getDepartments } from "../resource/departmentApi";

/**
 * ViewDepartment Component
 * Displays all departments in the system
 */
export const ViewDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="view-department-section">
      <div className="view-department-header">
        <h2 className="view-department-title">All Departments</h2>
        <p className="view-department-subtitle">
          View all departments in your institution
        </p>
      </div>

      {!loading && departments.length > 0 && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {error && <div className="form-message form-message-error">✗ {error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading departments...</div>
      ) : filteredDepartments.length === 0 ? (
        <div className="empty-state">
          <p>
            {searchTerm
              ? "No departments match your search."
              : "No departments found."}
          </p>
        </div>
      ) : (
        <div className="department-cards">
          {filteredDepartments.map((dept) => (
            <div key={dept.id} className="department-card">
              <div className="card-header">
                <h3 className="card-title">{dept.name}</h3>
                <span className="card-code">{dept.code}</span>
              </div>
              <div className="card-body">
                {dept.description && (
                  <p className="card-description">{dept.description}</p>
                )}
                <div className="card-details">
                  {dept.head && (
                    <div className="detail-item">
                      <span className="detail-label">Head:</span>
                      <span className="detail-value">{dept.head}</span>
                    </div>
                  )}
                  {dept.location && (
                    <div className="detail-item">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{dept.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
