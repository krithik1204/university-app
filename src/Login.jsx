import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./AuthSlice";
import { loginUser, parseAuthResponse } from "./authApi";

/**
 * Login component - handles user authentication
 * Provides a form for users to log in with email and password
 */
export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({ email: '', password: '' });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handles form submission for user login
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate form
      if (!form.email || !form.password) {
        throw new Error('Please fill in all fields');
      }

      // Call login API
      const responseData = await loginUser(form.email, form.password);

      // Parse response data
      const authData = parseAuthResponse(responseData);

      // Update Redux store
      dispatch(login(authData));

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles form input changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="login-container">
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
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};