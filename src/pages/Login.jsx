import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { loginUser, parseAuthResponse } from "../features/auth/authApi";
import "./styles/Login.css";

/**
 * Login component - handles user authentication
 * Provides a form for users to log in with email and password
 */
export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!form.email || !form.password) {
        throw new Error("Please fill in all fields");
      }

      const responseData = await loginUser(form.email, form.password);
      const authData = parseAuthResponse(responseData);
      dispatch(login(authData));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  return (
    <div className="auth-page-layout">
      <section className="auth-hero">
        <div className="auth-hero-copy">
          <p className="eyebrow">Student access</p>
          <h2>Login to your campus workspace</h2>
          <p>
            Enter your email and password to continue to your personalized dashboard,
            courses, and announcements.
          </p>
        </div>
      </section>

      <section className="auth-form-panel login-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
};