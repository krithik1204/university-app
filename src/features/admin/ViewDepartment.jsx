import "./ViewDepartment.css";

/**
 * ViewDepartment Component
 * Displays all departments in the system
 */
export const ViewDepartment = () => {
  return (
    <section className="view-department-section">
      <h2 className="view-department-title">All Departments</h2>
      <p className="view-department-subtitle">
        View all departments in your institution
      </p>

      <div className="department-placeholder">
        <p>Department list coming soon...</p>
      </div>
    </section>
  );
};
