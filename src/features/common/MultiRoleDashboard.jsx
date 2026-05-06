import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export const MultiRoleDashboard = () => {
  const { fullName, roles } = useSelector((state) => state.auth);

  const normalizeRole = (role) => String(role || "").toUpperCase().replace(/^ROLE_/, "");
  const normalizedRoles = Array.isArray(roles) ? roles.map(normalizeRole) : [normalizeRole(roles)];

  const roleOptions = normalizedRoles.map((role) => {
    const configs = {
      STUDENT: { to: "/dashboard/student", label: "Student Dashboard", icon: "📚", desc: "Access courses and assignments" },
      TEACHER: { to: "/dashboard/teacher", label: "Teacher Dashboard", icon: "🏫", desc: "Manage classes and students" },
    };
    return configs[role];
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-100 to-slate-200 px-4 py-12">
      <header className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">Welcome, {fullName || "User"}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">You have multiple roles. Select which dashboard to access:</p>
      </header>

      <div className="mx-auto mt-10 grid max-w-6xl gap-8 sm:grid-cols-2">
        {roleOptions.map((option) => (
          <NavLink
            key={option.to}
            to={option.to}
            className="group block rounded-[1.5rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="mb-6 text-5xl">{option.icon}</div>
            <h3 className="text-2xl font-semibold">{option.label}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{option.desc}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};