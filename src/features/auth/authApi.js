import axios from "axios";

/**
 * Authentication API service
 * Handles all authentication-related API calls
 */

const API_BASE_URL = "http://localhost:9000/api/auth";

/**
 * Creates an axios instance configured for authentication requests
 */
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication response data
 * @throws {Error} If login fails
 */
export const loginUser = async (email, password) => {
  try {
    const response = await authApi.post('/login', { email, password });

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Login failed';
      throw new Error(message, { cause: error });
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check your connection', { cause: error });
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred', { cause: error });
    }
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @returns {Promise<Object>} Registration response data
 * @throws {Error} If registration fails
 */
export const registerUser = async (userData) => {
  try {
    const response = await authApi.post('/register', userData);

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Registration failed', { cause: error });
    } else if (error.request) {
      throw new Error('Network error - please check your connection', { cause: error });
    } else {
      throw new Error(error.message || 'An unexpected error occurred', { cause: error });
    }
  }
};

/**
 * Parses authentication response data into a standardized format
 * @param {Object} responseData - Raw API response data
 * @returns {Object} Parsed authentication data
 */
export const parseAuthResponse = (responseData) => {
  const { accessToken, refreshToken, user } = responseData;

  if (!accessToken || !user) {
    throw new Error('Invalid authentication response');
  }

  const userFirstName = user.firstName || '';
  const userLastName = user.lastName || '';
  const fullName = `${userFirstName} ${userLastName}`.trim();
  const userId = user.id ? String(user.id) : null;
  const roles = user.roles || [];

  return {
    accessToken,
    refreshToken: refreshToken || null,
    userId,
    fullName,
    roles
  };
};