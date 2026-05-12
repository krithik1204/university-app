import "./AddFaculty.css";
import { useState, useCallback } from "react";

/**
 * AddFaculty Component
 * Form component for adding new faculty members
 */
export const AddFaculty = () => {
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

    if (!formData.name || !formData.email || !formData.department) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields (Name, Email, Department)"
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // TODO: Replace with actual API call to add faculty
      // const result = await addFaculty(accessToken, formData);
      
      console.log("Faculty data:", formData);
      
      setMessage({
        type: "success",
        text: "Faculty member added successfully!"
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        department: "",
        specialization: "",
        phone: ""
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
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter faculty member's full name"
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
            placeholder="Enter email address"
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
            placeholder="Enter department name"
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
            placeholder="Enter area of specialization"
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
            placeholder="Enter phone number"
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
          {loading ? "Adding Faculty..." : "Add Faculty Member"}
        </button>
      </form>
    </section>
  );
};
