import { useSelector } from "react-redux";

export const ProtectedPage = () => {
  const { fullName } = useSelector((state) => state.auth);

  return (
    <section className="mx-auto max-w-4xl rounded-[1.75rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <h1 className="text-3xl font-semibold text-slate-900">Protected Route</h1>
      <p>This page is visible to any authenticated user.</p>
      <p>Welcome back, <strong>{fullName || "User"}</strong>!</p>
    </section>
  );
};