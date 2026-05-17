import "./AddFaculty.css";
import { useState, useCallback, useEffect } from "react";
import { getDepartments } from "../resource/departmentApi";
import { createFaculty } from "../resource/facultyApi";
import { getUsersByRole } from "../resource/usersApi"
/**
 * AddFaculty Component
 * Form component for adding new faculty members
 */
export const AddFaculty = () => {
  const [formData, setFormData] = useState({
    facultyId: "",
    departmentId: "",
    designation: ""
  });

  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [initError, setInitError] = useState(null);

  const accessToken = sessionStorage.getItem("accessToken");

  const fetchInitialData = useCallback(async () => {
    if (!accessToken) {
      setInitError("Not authenticated. Please log in to load faculty and department data.");
      return;
    }

    setInitLoading(true);
    setInitError(null);

    try {
      const [deps, facs] = await Promise.all([
        getDepartments(accessToken),
        getUsersByRole(accessToken, "TEACHER")
      ]);

      setDepartments(Array.isArray(deps) ? deps : []);
      setFaculties(Array.isArray(facs) ? facs : []);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setInitError(error.message || "Failed to load faculty and department data");
    } finally {
      setInitLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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

    if (!formData.facultyId || !formData.departmentId || !formData.designation) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields (Faculty User, Department, Designation)"
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        userId: formData.facultyId,
        departmentId: formData.departmentId,
        designation: formData.designation
      };

      await createFaculty(accessToken, payload);

      setMessage({
        type: "success",
        text: "Faculty member added successfully!"
      });

      // Reset form
      setFormData({
        facultyId: "",
        departmentId: "",
        designation: ""
      });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);

    } catch (error) {
      console.error("Error adding faculty:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to add faculty member"
      });
    } finally {
      setLoading(false);
    }
  }, [formData, accessToken]);

  return (
    <section className="add-faculty-section">
      <div className="add-faculty-header">
        <h2 className="add-faculty-title">Add New Faculty Member</h2>
        <p className="add-faculty-subtitle">Fill in the details to add a new faculty member</p>
      </div>

      <form onSubmit={handleSubmit} className="add-faculty-form">
        {initError && (
          <div className="init-error">
            <p>{initError}</p>
            <button
              type="button"
              onClick={fetchInitialData}
              className="retry-btn"
              disabled={initLoading}
            >
              {initLoading ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="facultyId" className="form-label">Faculty User *</label>
          <select
            id="facultyId"
            name="facultyId"
            value={formData.facultyId}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={loading || initLoading}
          >
            <option value="">-- Select Faculty --</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name || `Faculty ${faculty.id}`}
              </option>
            ))}
          </select>
        </div>



        <div className="form-group">
          <label htmlFor="departmentId" className="form-label">Department *</label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={loading || initLoading}
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id || dept.code || dept.name} value={dept.id}>
                {dept.name || dept.departmentName || dept.code}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="designation" className="form-label">Designation *</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="Enter designation (e.g. Professor)"
            className="form-input"
            required
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
          disabled={loading || initLoading}
          className="submit-btn"
        >
          {loading ? "Adding Faculty..." : "Add Faculty Member"}
        </button>
      </form>
    </section>
  );
};
