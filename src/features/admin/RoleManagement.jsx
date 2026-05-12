import { useState } from "react";
import "./RoleManagement.css";
import { CreateRole } from "./CreateRole";
import { AssignRole } from "./AssignRole";

/**
 * RoleManagement Component
 * Provides interface for administrators to manage roles with hierarchical menu
 */
export const RoleManagement = () => {
  const [activeSection, setActiveSection] = useState("create");
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="role-management-container">
      {/* Left Navigation Sidebar */}
      <aside className="role-management-sidebar">
        <nav className="role-nav">
          {/* Parent Menu Item */}
          <button
            className="role-nav-parent"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="parent-icon">🔐</span>
            <span className="parent-label">Role Management</span>
            <span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>▼</span>
          </button>

          {/* Child Menu Items */}
          {isExpanded && (
            <div className="child-menu">
              <button
                className={`role-nav-item child ${activeSection === "create" ? "active" : ""}`}
                onClick={() => setActiveSection("create")}
              >
                <span className="nav-icon">➕</span>
                <span className="nav-label">Create Role</span>
              </button>

              <button
                className={`role-nav-item child ${activeSection === "assign" ? "active" : ""}`}
                onClick={() => setActiveSection("assign")}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-label">Assign Role</span>
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="role-management-content">
        {activeSection === "create" && <CreateRole />}
        {activeSection === "assign" && <AssignRole />}
      </main>
    </div>
  );
};
