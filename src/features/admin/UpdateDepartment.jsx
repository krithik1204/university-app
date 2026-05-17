import "./UpdateDepartment.css";
import { useState, useEffect, useCallback } from "react";
import { getDepartmentById, updateDepartment } from "../resource/departmentApi";

/**
 * UpdateDepartment Component
 * Form to update department details
 */
export const UpdateDepartment = ({ departmentId, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    head: "",
    location: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      try {
        const data = await getDepartmentById(accessToken, departmentId);
        setFormData({
          name: data.name || "",
          code: data.code || "",
          description: data.description || "",
          head: data.head || "",
          location: data.location || ""
        });
      } catch (error) {
        console.error("Error fetching department:", error);
        setMessage({
          type: "error",
          text: error.message || "Failed to load department."
        });
      } finally {
        setLoading(false);
      }
    };

    if (departmentId && accessToken) {
      fetchDepartment();
    }
  }, [departmentId, accessToken]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.name || !formData.code) {
        setMessage({
          type: "error",
          text: "Please provide both department name and code."
        });
        return;
      }

      setSubmitting(true);
      setMessage({ type: "", text: "" });

      try {
        await updateDepartment(accessToken, departmentId, formData);
        setMessage({
          type: "success",
          text: "Department updated successfully."
        });
        if (onClose) {
          setTimeout(onClose, 1500);
        }
      } catch (error) {
        console.error("Error updating department:", error);
        setMessage({
          type: "error",
          text: error.message || "Failed to update department."
        });
      } finally {
        setSubmitting(false);
      }
    },
    [formData, departmentId, accessToken, onClose]
  );

  if (loading) {
    return <div className="loading-spinner">Loading department...</div>;
  }

  return (
    <section className="update-department-section">
      <div className="update-department-header">
        <h2 className="update-department-title">Edit Department</h2>
        <p className="update-department-subtitle">Update department details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="update-department-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Department Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter department name"
            className="form-input"
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="code" className="form-label">
            Department Code *
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Enter department code"
            className="form-input"
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter department description"
            className="form-input"
            rows="4"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="head" className="form-label">
            Department Head
          </label>
          <input
            type="text"
            id="head"
            name="head"
            value={formData.head}
            onChange={handleInputChange}
            placeholder="Enter head of department"
            className="form-input"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter department location"
            className="form-input"
            disabled={submitting}
          />
        </div>

        {message.text && (
          <div className={`form-message form-message-${message.type}`}>
            {message.type === "success" ? "✓" : "✗"} {message.text}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Updating..." : "Update Department"}
          </button>
          {onClose && (
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
};
