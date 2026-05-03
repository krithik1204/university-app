import axios from "axios";

/**
 * Profile API service
 * Handles profile-related API calls
 */

const API_BASE_URL = "http://localhost:8081/api";

/**
 * Creates an axios instance configured for profile requests
 */
const profileApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Sets the authorization token for API requests
 * @param {string} token - Access token
 */
export const setAuthToken = (token) => {
  if (token) {
    profileApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete profileApi.defaults.headers.common['Authorization'];
  }
};

/**
 * Fetches user profile data
 * @param {string} token - Access token
 * @returns {Promise<Object>} Profile data
 * @throws {Error} If profile fetch fails
 */
export const getUserProfile = async (token) => {
  try {
    setAuthToken(token);

    const response = await profileApi.get('/profile');

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || 'Failed to fetch profile', { cause: error });
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check your connection', { cause: error });
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred', { cause: error });
    }
  }
};