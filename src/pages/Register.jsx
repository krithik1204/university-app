import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authApi";
import "./styles/Register.css";

export const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phoneNumber ||
      !form.password ||
      !form.confirmPassword
    ) {
      return "Please fill in all required fields";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(form.password)) {
      return "Password must contain at least one letter and one number";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Please enter a valid email address";
    }

    if (form.phoneNumber.replace(/[^0-9]/g, "").length < 8) {
      return "Please enter a valid phone number";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });

      setSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(message);
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

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => navigate("/login"), 2000);
    }
    return () => clearTimeout(timer);
  }, [success, navigate]);

  if (success) {
    return (
      <div className="auth-page-layout">
        <section className="auth-hero auth-hero-register">
          <div className="auth-hero-copy">
            <p className="eyebrow">Join the campus</p>
            <h2>Registration complete</h2>
            <p>Your account is ready. Redirecting to login...</p>
          </div>
        </section>
        <section className="auth-form-panel register-container">
          <div className="success-message">
            <h2>Registration Successful!</h2>
            <p>Redirecting to login...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="auth-page-layout">
      <section className="auth-hero auth-hero-register">
        <div className="auth-hero-copy">
          <p className="eyebrow">New student</p>
          <h2>Register and join the learning community</h2>
          <p>Create your account to access courses and announcements.</p>
        </div>
      </section>

      <section className="auth-form-panel register-container">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={form.firstName}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={form.lastName}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

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
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              placeholder="e.g. +1234567890"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>
      </section>
    </div>
  );
};