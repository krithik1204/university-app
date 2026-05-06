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
    <div className="login-layout">
      <section className="login-hero">
        <div className="login-hero-content">
          <p className="login-eyebrow">Student access</p>
          <h2>Login to your campus workspace</h2>
          <p>
            Enter your email and password to continue to your personalized dashboard,
            courses, and announcements.
          </p>
        </div>
      </section>

      <section className="login-form-panel">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label" htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="login-input"
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
};