import "./FacultyManagement.css";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

/**
 * FacultyManagement Component
 * Provides interface for administrators to manage faculty members
 */
export const FacultyManagement = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // State management
  const [facultyData, setFacultyData] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    faculty: false
  });
  const [errors, setErrors] = useState({
    faculty: null
  });

  const accessToken = sessionStorage.getItem("accessToken");

  /**
   * Fetches faculty data (placeholder for API call)
   */
  const fetchFaculty = useCallback(async () => {
    if (!accessToken) return;

    setLoadingStates(prev => ({ ...prev, faculty: true }));
    setErrors(prev => ({ ...prev, faculty: null }));

    try {
      // TODO: Replace with actual API call to fetch faculty data
      // const data = await getFacultyData(accessToken);
      // For now, set empty array
      setFacultyData([]);
    } catch (error) {
      console.error("Error fetching faculty:", error);
      setErrors(prev => ({ ...prev, faculty: error.message }));
    } finally {
      setLoadingStates(prev => ({ ...prev, faculty: false }));
    }
  }, [accessToken]);

  // Initialize data on component mount
  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  // Loading state
  if (loadingStates.faculty) {
    return (
      <section className="faculty-management-section">
        <div className="loading-container">
          <p>Loading faculty data...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (errors.faculty) {
    return (
      <section className="faculty-management-section">
        <div className="error-container">
          <h3>Error Loading Faculty Data</h3>
          <p>{errors.faculty}</p>
          <button onClick={() => fetchFaculty()} className="retry-btn">
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="faculty-management-section">
      <h2 className="faculty-management-title">Faculty Management</h2>

      {facultyData.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-icon">🎓</p>
          <p className="empty-state-message">No faculty members found.</p>
          <p className="empty-state-subtitle">Faculty management feature coming soon</p>
        </div>
      ) : (
        <div className="faculty-grid">
          {facultyData.map((faculty) => (
            <div key={faculty.id} className="faculty-card">
              <div className="faculty-info">
                <h3>{faculty.name || "Unknown Faculty"}</h3>
                <p>ID: {faculty.id}</p>
                <p>Department: {faculty.department || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
