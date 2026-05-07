import { createApiInstance, createApiService, executeApiCall, setAuthToken } from './baseApi';

/**
 * Roles API Service
 * Handles role-related API operations
 */

// Create axios instance for roles
const rolesApi = createApiInstance();

// Create base service for roles
const rolesService = createApiService('roles', rolesApi);

/**
 * Fetches all roles data
 * @param {string} token - Access token
 * @returns {Promise<Array>} Array of roles
 * @throws {Error} If roles fetch fails
 */
export const getRolesData = async (token) => {
  try {
    const data = await rolesService.getAll(token);
    console.log("Roles data:", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching roles data:", error);
    throw error; // Re-throw the formatted error from baseApi
  }
};

/**
 * Fetches a specific role by ID
 * @param {string} token - Access token
 * @param {string|number} roleId - Role ID
 * @returns {Promise<Object>} Role data
 */
export const getRoleById = async (token, roleId) => {
  return rolesService.getById(token, roleId);
};

/**
 * Creates a new role
 * @param {string} token - Access token
 * @param {Object} roleData - Role data to create
 * @returns {Promise<Object>} Created role
 */
export const createRole = async (token, roleData) => {
  return rolesService.create(token, roleData);
};

/**
 * Updates an existing role
 * @param {string} token - Access token
 * @param {string|number} roleId - Role ID to update
 * @param {Object} roleData - Updated role data
 * @returns {Promise<Object>} Updated role
 */
export const updateRole = async (token, roleId, roleData) => {
  return rolesService.update(token, roleId, roleData);
};

/**
 * Deletes a role
 * @param {string} token - Access token
 * @param {string|number} roleId - Role ID to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteRole = async (token, roleId) => {
  return rolesService.delete(token, roleId);
};

// Export the base service for advanced usage
export { rolesService };