import { createApiInstance, createApiService, executeApiCall, setAuthToken } from './baseApi';

/**
 * Users API Service
 * Handles user-related API operations
 */

// Create axios instance for users
const usersApi = createApiInstance();

// Create base service for users
const usersService = createApiService('users', usersApi);

/**
 * Fetches user profile data
 * @param {string} token - Access token
 * @returns {Promise<Array>} Array of users
 * @throws {Error} If users fetch fails
 */
export const getUserData = async (token) => {
  try {
    return await usersService.getAll(token);
  } catch (error) {
    console.error("Error fetching users data:", error);
    throw error; // Re-throw the formatted error from baseApi
  }
};

/**
 * Fetches a specific user by ID
 * @param {string} token - Access token
 * @param {string|number} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (token, userId) => {
  return usersService.getById(token, userId);
};

/**
 * Creates a new user
 * @param {string} token - Access token
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (token, userData) => {
  return usersService.create(token, userData);
};

/**
 * Updates an existing user
 * @param {string} token - Access token
 * @param {string|number} userId - User ID to update
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (token, userId, userData) => {
  return usersService.update(token, userId, userData);
};

/**
 * Updates a user's role
 * @param {string} token - Access token
 * @param {string|number} userId - User ID to update
 * @param {string} role - New role to assign
 * @returns {Promise<Object>} Updated user data
 * @throws {Error} If role update fails
 */
export const updateUserRole = async (token, userId, role) => {
  try {
    setAuthToken(usersApi, token);
    return executeApiCall(
      () => usersApi.put(`/users/${userId}/role`, { role }),
      'update user role'
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error; // Re-throw the formatted error from baseApi
  }
};

/**
 * Deletes a user
 * @param {string} token - Access token
 * @param {string|number} userId - User ID to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteUser = async (token, userId) => {
  return usersService.delete(token, userId);
};

// Export the base service for advanced usage
export { usersService };