import { useState, Fragment } from "react";
import "./StudentDashboard.css";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Student",
    course: "Biology 101",
    grade: "A",
    attendance: "95%",
    advisor: "Dr. Mehta",
    status: "Active",
    enrolled: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Student",
    course: "Chemistry 102",
    grade: "B+",
    attendance: "92%",
    advisor: "Prof. Rao",
    status: "Active",
    enrolled: "2024-02-10",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Student",
    course: "Physics 201",
    grade: "A-",
    attendance: "89%",
    advisor: "Dr. Patel",
    status: "Active",
    enrolled: "2023-09-05",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Student",
    course: "Mathematics 202",
    grade: "A",
    attendance: "97%",
    advisor: "Prof. Singh",
    status: "Active",
    enrolled: "2023-08-25",
  },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "course", label: "Course" },
  { key: "grade", label: "Grade" },
  { key: "attendance", label: "Attendance" },
  { key: "advisor", label: "Advisor" },
  { key: "status", label: "Status" },
  { key: "enrolled", label: "Enrollment" },
];

export const StudentDashboard = () => {
  const [users, setUsers] = useState(mockUsers);
  const [activeView, setActiveView] = useState("view");
  const [expandedRows, setExpandedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [showSortIcons, setShowSortIcons] = useState(true);
  const [filters, setFilters] = useState({
    id: { operator: "equal", value: "" },
    name: { operator: "contains", value: "" },
    email: { operator: "contains", value: "" },
    role: { operator: "equal", value: "" },
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student", course: "", grade: "", attendance: "", advisor: "", status: "Active", enrolled: "" });

  const handleToggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: Date.now(),
        ...newUser,
      };
      setUsers([...users, user]);
      setNewUser({ name: "", email: "", role: "Student", course: "", grade: "", attendance: "", advisor: "", status: "Active", enrolled: "" });
      setShowAddForm(false);
      setActiveView("view");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ ...user });
    setActiveView("modify");
  };

  const handleUpdateUser = () => {
    if (editingUser && newUser.name && newUser.email) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...newUser } : u)));
      setEditingUser(null);
      setNewUser({ name: "", email: "", role: "Student", course: "", grade: "", attendance: "", advisor: "", status: "Active", enrolled: "" });
      setActiveView("view");
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const visibleColumns = columns.slice(0, 4);
  const hiddenColumns = columns.slice(4);
  const sortableColumns = ["id", "name", "email", "role"];

  const sortedUsers = [...users].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (valueA === valueB) return 0;
    if (valueA === undefined || valueA === null) return 1;
    if (valueB === undefined || valueB === null) return -1;

    const isNumberA = typeof valueA === "number";
    const isNumberB = typeof valueB === "number";

    let comparison = 0;
    if (isNumberA && isNumberB) {
      comparison = valueA - valueB;
    } else {
      comparison = String(valueA).localeCompare(String(valueB), undefined, { numeric: true, sensitivity: "base" });
    }

    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  const handleSort = (key) => {
    if (!sortableColumns.includes(key)) return;
    setShowSortIcons(false);
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return { key, direction: "asc" };
    });
  };

  const applyFilter = (value, filterValue, operator) => {
    const isNumeric = typeof value === "number";
    const val = isNumeric ? value : String(value).toLowerCase();
    const fVal = String(filterValue).toLowerCase();

    switch (operator) {
      case "equal":
        return isNumeric ? value === Number(filterValue) : val === fVal;
      case "unequal":
        return isNumeric ? value !== Number(filterValue) : val !== fVal;
      case "contains":
        return val.includes(fVal);
      case "startswith":
        return val.startsWith(fVal);
      case "endswith":
        return val.endsWith(fVal);
      case "lessthan":
        return isNumeric && value < Number(filterValue);
      case "greaterthan":
        return isNumeric && value > Number(filterValue);
      case "lessthanequal":
        return isNumeric && value <= Number(filterValue);
      case "greaterthanequal":
        return isNumeric && value >= Number(filterValue);
      default:
        return true;
    }
  };

  const filteredAndSortedUsers = sortedUsers.filter((user) => {
    return Object.keys(filters).every((key) => {
      const filter = filters[key];
      if (!filter.value) return true;
      return applyFilter(user[key], filter.value, filter.operator);
    });
  });

  return (
    <div className="dashboard-container">


      <section className="dashboard-section">
        <h2 className="section-title">User Management</h2>

        <div className="button-group">
          <button
            onClick={() => {
              setShowAddForm(true);
              setActiveView("add");
            }}
            className={`btn-base btn-add ${activeView === "add" ? "active" : ""}`}
          >
            Add User
          </button>
          <button
            onClick={() => setActiveView("modify")}
            className={`btn-base btn-modify ${activeView === "modify" ? "active" : ""}`}
          >
            Modify User
          </button>
          <button
            onClick={() => {
              setActiveView("view");
              setShowAddForm(false);
              setEditingUser(null);
            }}
            className={`btn-base btn-view ${activeView === "view" ? "active" : ""}`}
          >
            View Users
          </button>
          <button
            onClick={() => setActiveView("delete")}
            className={`btn-base btn-delete ${activeView === "delete" ? "active" : ""}`}
          >
            Delete User
          </button>
        </div>

        {activeView === "add" && (
          <div className="form-section">
            <h3 className="form-title">Add New User</h3>
            <div className="form-grid col-3">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="form-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="form-input"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="form-select"
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="form-grid col-3">
              <input
                type="text"
                placeholder="Course"
                value={newUser.course}
                onChange={(e) => setNewUser({ ...newUser, course: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Grade"
                value={newUser.grade}
                onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Attendance"
                value={newUser.attendance}
                onChange={(e) => setNewUser({ ...newUser, attendance: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-grid col-3">
              <input
                type="text"
                placeholder="Advisor"
                value={newUser.advisor}
                onChange={(e) => setNewUser({ ...newUser, advisor: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Status"
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                className="form-input"
              />
              <input
                type="date"
                value={newUser.enrolled}
                onChange={(e) => setNewUser({ ...newUser, enrolled: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-button-group">
              <button
                onClick={handleAddUser}
                className="btn-action"
              >
                Add User
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setActiveView("view");
                  setNewUser({ name: "", email: "", role: "Student", course: "", grade: "", attendance: "", advisor: "", status: "Active", enrolled: "" });
                }}
                className="btn-action secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeView === "modify" && (
          <div className="form-section">
            <h3 className="form-title">Modify Users</h3>
            {editingUser ? (
              <>
                <p className="form-info">Editing: {editingUser.name}</p>
                <div className="form-grid col-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="form-input"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="form-select"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-grid col-3">
                  <input
                    type="text"
                    placeholder="Course"
                    value={newUser.course}
                    onChange={(e) => setNewUser({ ...newUser, course: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Grade"
                    value={newUser.grade}
                    onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Attendance"
                    value={newUser.attendance}
                    onChange={(e) => setNewUser({ ...newUser, attendance: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-grid col-3">
                  <input
                    type="text"
                    placeholder="Advisor"
                    value={newUser.advisor}
                    onChange={(e) => setNewUser({ ...newUser, advisor: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Status"
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="date"
                    value={newUser.enrolled}
                    onChange={(e) => setNewUser({ ...newUser, enrolled: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-button-group">
                  <button
                    onClick={handleUpdateUser}
                    className="btn-action update"
                  >
                    Update User
                  </button>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setNewUser({ name: "", email: "", role: "Student", course: "", grade: "", attendance: "", advisor: "", status: "Active", enrolled: "" });
                    }}
                    className="btn-action secondary"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p className="form-info">Click any row below to load data into the edit form.</p>
            )}
          </div>
        )}

        {activeView === "delete" && (
          <div className="form-section">
            <h3 className="form-title">Delete Users</h3>
            <p className="form-info">Use the delete button on a row to remove a user.</p>
          </div>
        )}

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell action-col"> </th>
                {visibleColumns.map((column) => {
                  const isSortable = sortableColumns.includes(column.key);
                  const isActiveSort = sortConfig.key === column.key;
                  const directionArrow = isSortable
                    ? showSortIcons
                      ? "↕"
                      : isActiveSort
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""
                    : "";
                  return (
                    <th key={column.key} className="table-header-cell">
                      {isSortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(column.key)}
                          className="sort-header-button"
                        >
                          {column.label}
                          <span className="sort-arrow">{directionArrow}</span>
                        </button>
                      ) : (
                        <span className="sort-header-static">{column.label}</span>
                      )}
                    </th>
                  );
                })}
                {activeView === "delete" && <th className="table-header-cell action-col">Action</th>}
              </tr>
              <tr className="filter-row">
                <th className="filter-cell empty-cell" />
                {visibleColumns.map((column) => {
                  const isNumeric = column.key === "id";
                  const textOperators = ["startswith", "equal", "unequal", "endswith", "contains"];
                  const numericOperators = ["equal", "unequal", "lessthan", "greaterthan", "lessthanequal", "greaterthanequal"];
                  const operators = isNumeric ? numericOperators : textOperators;

                  return (
                    <th key={`filter-${column.key}`} className="filter-cell">
                      <div className="filter-wrapper">
                        <select
                          value={filters[column.key].operator}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              [column.key]: { ...filters[column.key], operator: e.target.value },
                            })
                          }
                          className="filter-select"
                        >
                          {operators.map((op) => (
                            <option key={op} value={op}>
                              {op}
                            </option>
                          ))}
                        </select>
                        <input
                          type={isNumeric ? "number" : "text"}
                          placeholder="Filter..."
                          value={filters[column.key].value}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              [column.key]: { ...filters[column.key], value: e.target.value },
                            })
                          }
                          className="filter-input"
                        />
                      </div>
                    </th>
                  );
                })}
                {activeView === "delete" && <th className="filter-cell empty-cell" />}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((user) => {
                const isExpanded = expandedRows.includes(user.id);
                return (
                  <Fragment key={user.id}>
                    <tr className="table-row" onClick={() => activeView === "modify" && handleEditUser(user)}>
                      <td className="table-cell action-cell">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRow(user.id);
                          }}
                          className="expand-button"
                        >
                          {isExpanded ? "-" : "+"}
                        </button>
                      </td>
                      {visibleColumns.map((column) => (
                        <td key={column.key} className="table-cell">
                          {user[column.key]}
                        </td>
                      ))}
                      {activeView === "delete" && (
                        <td className="table-cell action-cell">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                    {isExpanded && (
                      <tr className="expanded-row">
                        <td className="table-cell" />
                        <td className="table-cell" colSpan={visibleColumns.length + (activeView === "delete" ? 1 : 0)}>
                          <div className="expanded-content">
                            {hiddenColumns.map((column) => {
                              const isActiveSort = sortConfig.key === column.key;
                              const directionArrow = sortableColumns.includes(column.key)
                                ? showSortIcons
                                  ? "↕"
                                  : isActiveSort
                                  ? sortConfig.direction === "asc"
                                    ? "▲"
                                    : "▼"
                                  : ""
                                : "";
                              return (
                                <div key={column.key} className="expanded-card">
                                  <button
                                    type="button"
                                    onClick={() => handleSort(column.key)}
                                    className="expanded-card-label"
                                  >
                                    {column.label}
                                    <span className="sort-arrow">{directionArrow}</span>
                                  </button>
                                  <div className="expanded-card-value">{user[column.key]}</div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};