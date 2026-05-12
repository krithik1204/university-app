import "./UpdateFaculty.css";
import { useState, useEffect, useCallback } from "react";

/**
 * UpdateFaculty Component
 * Interface for updating existing faculty members
 */
export const UpdateFaculty = () => {
  const [facultyData, setFacultyData] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    specialization: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const accessToken = sessionStorage.getItem("accessToken");

  /**
   * Fetches faculty data (placeholder)
   */
  const fetchFaculty = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call to fetch faculty
      // const data = await getFacultyData(accessToken);
      setFacultyData([]);
    } catch (error) {
      console.error("Error fetching faculty:", error);
      setMessage({
        type: "error",
        text: "Failed to load faculty data"
      });
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  /**
   * Handles faculty selection
   */
  const handleFacultySelect = useCallback((facultyId) => {
    const selected = facultyData.find(f => f.id === facultyId);
    if (selected) {
      setSelectedFacultyId(facultyId);
      setFormData({
        name: selected.name || "",
        email: selected.email || "",
        department: selected.department || "",
        specialization: selected.specialization || "",
        phone: selected.phone || ""
      });
      setMessage({ type: "", text: "" });
    }
  }, [facultyData]);

  /**
   * Handles input field changes
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!selectedFacultyId) {
      setMessage({
        type: "error",
        text: "Please select a faculty member first"
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.department) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields"
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // TODO: Replace with actual API call to update faculty
      // const result = await updateFaculty(accessToken, selectedFacultyId, formData);
      
      console.log("Updated faculty data:", formData);
      
      setMessage({
        type: "success",
        text: "Faculty member updated successfully!"
      });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);

    } catch (error) {
      console.error("Error updating faculty:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update faculty member"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedFacultyId, formData, accessToken]);

  return (
    <section className="update-faculty-section">
      <div className="update-faculty-header">
        <h2 className="update-faculty-title">Update Faculty Member</h2>
        <p className="update-faculty-subtitle">Select and modify faculty member details</p>
      </div>

      {facultyData.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-icon">🎓</p>
          <p className="empty-state-message">No faculty members available to update.</p>
        </div>
      ) : (
        <div className="update-faculty-container">
          {/* Faculty Selection List */}
          <div className="faculty-selection">
            <h3 className="faculty-selection-title">Select Faculty</h3>
            <div className="faculty-list">
              {facultyData.map((faculty) => (
                <button
                  key={faculty.id}
                  onClick={() => handleFacultySelect(faculty.id)}
                  className={`faculty-list-item ${selectedFacultyId === faculty.id ? "active" : ""}`}
                >
                  <span className="faculty-name">{faculty.name || "Unknown"}</span>
                  <span className="faculty-dept">{faculty.department || "N/A"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Update Form */}
          {selectedFacultyId && (
            <form onSubmit={handleSubmit} className="update-faculty-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="department" className="form-label">Department *</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="specialization" className="form-label">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              {message.text && (
                <div className={`form-message form-message-${message.type}`}>
                  {message.type === "success" ? "✓" : "✗"} {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? "Updating..." : "Update Faculty Member"}
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
};
