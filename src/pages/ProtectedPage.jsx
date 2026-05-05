import { useSelector } from "react-redux";

export const ProtectedPage = () => {
  const { fullName } = useSelector((state) => state.auth);

  return (
    <section className="page-section">
      <h1>Protected Route</h1>
      <p>This page is visible to any authenticated user.</p>
      <p>Welcome back, <strong>{fullName || "User"}</strong>!</p>
    </section>
  );
};