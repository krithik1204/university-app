import "./AddDepartment.css";
import { useState, useCallback } from "react";
import { createDepartment } from "../resource/departmentApi";

/**
 * AddDepartment Component
 * Form to add new departments
 */
export const AddDepartment = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    head: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const accessToken = sessionStorage.getItem("accessToken");

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.code) {
      setMessage({
        type: "error",
        text: "Please provide both department name and code."
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await createDepartment(accessToken, formData);
      setMessage({ type: "success", text: "Department created successfully." });
      setFormData({ name: "", code: "", description: "", head: "", location: "" });
    } catch (error) {
      console.error("Error adding department:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to create department."
      });
    } finally {
      setLoading(false);
    }
  }, [formData, accessToken]);

  return (
    <section className="add-department-section">
      <div className="add-department-header">
        <h2 className="add-department-title">Add New Department</h2>
        <p className="add-department-subtitle">Fill in department details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="add-department-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Department Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter department name"
            className="form-input"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="code" className="form-label">Department Code *</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Enter department code"
            className="form-input"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter department description"
            className="form-input"
            rows="4"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="head" className="form-label">Department Head</label>
          <input
            type="text"
            id="head"
            name="head"
            value={formData.head}
            onChange={handleInputChange}
            placeholder="Enter head of department"
            className="form-input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter department location"
            className="form-input"
            disabled={loading}
          />
        </div>

        {message.text && (
          <div className={`form-message form-message-${message.type}`}>
            {message.type === "success" ? "✓" : "✗"} {message.text}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating Department..." : "Create Department"}
        </button>
      </form>
    </section>
  );
};
