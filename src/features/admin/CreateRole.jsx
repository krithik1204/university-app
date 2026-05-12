import { useState, useCallback } from "react";
import "./CreateRole.css";

/**
 * CreateRole Component
 * Allows administrators to create new roles
 */
export const CreateRole = () => {
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permissions: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const availablePermissions = [
    "READ_USERS",
    "CREATE_USERS",
    "UPDATE_USERS",
    "DELETE_USERS",
    "READ_ROLES",
    "CREATE_ROLES",
    "UPDATE_ROLES",
    "DELETE_ROLES",
    "MANAGE_COURSES",
    "VIEW_REPORTS"
  ];

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePermissionToggle = useCallback((permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.roleName.trim()) {
      setMessage({ type: "error", text: "Role name is required" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const accessToken = sessionStorage.getItem("accessToken");
      
      // TODO: Replace with actual API call
      // const response = await createRole(accessToken, formData);

      // Simulated API call - replace with actual endpoint
      console.log("Creating role:", formData);

      setMessage({ 
        type: "success", 
        text: `Role "${formData.roleName}" created successfully!` 
      });

      // Reset form
      setFormData({
        roleName: "",
        description: "",
        permissions: []
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

    } catch (error) {
      console.error("Error creating role:", error);
      setMessage({ type: "error", text: error.message || "Failed to create role" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-role-section">
      <div className="create-role-header">
        <h2 className="create-role-title">Create New Role</h2>
        <p className="create-role-subtitle">Add a new role to the system with custom permissions</p>
      </div>

      <form onSubmit={handleSubmit} className="create-role-form">
        {/* Role Name Input */}
        <div className="form-group">
          <label htmlFor="roleName" className="form-label">Role Name *</label>
          <input
            type="text"
            id="roleName"
            name="roleName"
            value={formData.roleName}
            onChange={handleInputChange}
            placeholder="e.g., Content Manager"
            className="form-input"
            required
          />
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter role description"
            className="form-textarea"
            rows="4"
          />
        </div>

        {/* Permissions Checkboxes */}
        <div className="form-group">
          <label className="form-label">Permissions</label>
          <div className="permissions-grid">
            {availablePermissions.map((permission) => (
              <div key={permission} className="permission-item">
                <input
                  type="checkbox"
                  id={permission}
                  checked={formData.permissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                  className="permission-checkbox"
                />
                <label htmlFor={permission} className="permission-label">
                  {permission.replace(/_/g, " ")}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.type === "success" ? "✓" : "✗"} {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Role"}
        </button>
      </form>
    </section>
  );
};
