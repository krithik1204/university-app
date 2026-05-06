import { useSelector } from "react-redux";

export const RoleProtectedPage = () => {
  const { fullName, roles } = useSelector((state) => state.auth);
  const roleText = Array.isArray(roles) ? roles.join(", ") : roles || "None";

  return (
    <section className="mx-auto max-w-4xl rounded-[1.75rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <h1 className="text-3xl font-semibold text-slate-900">Role-based Protected Route</h1>
      <p>This page is only accessible to users with allowed roles.</p>
      <p>
        Welcome, <strong>{fullName || "User"}</strong>. Your roles are:
        <strong> {roleText}</strong>
      </p>
    </section>
  );
};