import { useSelector } from "react-redux";
import "./ProtectedPage.css";

export const ProtectedPage = () => {
  const { name } = useSelector((state) => state.auth);

  return (
    <section className="protected-page">
      <h1 className="protected-title">Protected Route</h1>
      <p className="protected-text">This page is visible to any authenticated user.</p>
      <p className="protected-text">Welcome back, <strong>{name || "User"}</strong>!</p>
    </section>
  );
};