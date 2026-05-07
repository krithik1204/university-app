import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authApi";
import "./styles/Register.css";

export const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    password: "",
    
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (
      !form.name ||
      
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
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        dateOfBirth: form.dateOfBirth
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
      <div className="register-layout">
        <section className="register-hero">
          <div className="register-hero-content">
            <p className="register-eyebrow">Join the campus</p>
            <h2 className="register-hero-title">Registration complete</h2>
            <p className="register-hero-subtitle">Your account is ready. Redirecting to login...</p>
          </div>
        </section>
        <section className="register-form-panel">
          <div className="register-success-section">
            <h2 className="register-success-title">Registration Successful!</h2>
            <p className="register-success-text">Redirecting to login...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="register-layout">
      <section className="register-hero">
        <div className="register-hero-content">
          <p className="register-eyebrow">New student</p>
          <h2>Register and join the learning community</h2>
          <p>Create your account to access courses and announcements.</p>
        </div>
      </section>

      <section className="register-form-panel">
        <h2 className="register-title">Register</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-grid">
            <label className="register-label" htmlFor="name">
              <span>Name</span>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                autoFocus
                className="register-input"
              />
            </label>
            <label className="register-label" htmlFor="dateOfBirth">
              <span>Date Of Birth</span>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                autoFocus
                className="register-input"
              />
            </label>
          </div>

          <label className="register-label" htmlFor="email">
            <span>Email</span>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="register-input"
            />
          </label>

          <label className="register-label" htmlFor="phoneNumber">
            <span>Phone Number</span>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              placeholder="e.g. +1234567890"
              className="register-input"
            />
          </label>

          <div className="register-grid">
            <label className="register-label" htmlFor="password">
              <span>Password</span>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="register-input"
              />
            </label>
            <label className="register-label" htmlFor="confirmPassword">
              <span>Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="register-input"
              />
            </label>
          </div>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="register-button"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>
      </section>
    </div>
  );
};