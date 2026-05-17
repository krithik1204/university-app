import axios from "axios";

/**
 * Base API Configuration and Utilities
 * Provides reusable axios instance and common API patterns
 */

// Configuration
const API_BASE_URL = "http://localhost:8081/api";
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

/**
 * Creates a configured axios instance
 * @param {Object} config - Additional axios configuration
 * @returns {Object} Configured axios instance
 */
export const createApiInstance = (config = {}) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: DEFAULT_HEADERS,
    ...config
  });
};

/**
 * Sets the authorization token for an axios instance
 * @param {Object} apiInstance - Axios instance to configure
 * @param {string} token - Access token
 */
export const setAuthToken = (apiInstance, token) => {
  if (token) {
    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiInstance.defaults.headers.common['Authorization'];
  }
};

/**
 * Handles API errors consistently across all services
 * @param {Error} error - The error object from axios
 * @param {string} operation - Description of the operation that failed
 * @returns {Error} Formatted error with user-friendly message
 */
export const handleApiError = (error, operation = 'API operation') => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || `Failed to ${operation}`;
    return new Error(message, { cause: error });
  } else if (error.request) {
    // Network error
    return new Error('Network error - please check your connection', { cause: error });
  } else {
    // Other error
    return new Error(error.message || `An unexpected error occurred during ${operation}`, { cause: error });
  }
};

/**
 * Validates API response data
 * @param {Object} response - Axios response object
 * @param {string} operation - Description of the operation
 * @returns {Object} Response data
 * @throws {Error} If response is invalid
 */
export const validateResponse = (response, operation = 'API operation') => {
  if (!response.data) {
    throw new Error(`Invalid response from server during ${operation}`);
  }
  return response.data;
};

/**
 * Generic API request wrapper with error handling
 * @param {Function} apiCall - The API call function to execute
 * @param {string} operation - Description of the operation for error messages
 * @returns {Promise<Object>} API response data
 */
export const executeApiCall = async (apiCall, operation = 'API operation') => {
  try {
    const response = await apiCall();
    return validateResponse(response, operation);
  } catch (error) {
    throw handleApiError(error, operation);
  }
};

/**
 * Creates a standardized API service with common CRUD operations
 * @param {string} resourceName - The resource name (e.g., 'users', 'roles')
 * @param {Object} apiInstance - Axios instance to use
 * @returns {Object} API service methods
 */
export const createApiService = (resourceName, apiInstance) => {
  const baseUrl = `/${resourceName}`;

  return {
    /**
     * Get all resources
     * @param {string} token - Access token
     * @returns {Promise<Array>} Array of resources
     */
    getAll: async (token) => {
      setAuthToken(apiInstance, token);
      return executeApiCall(
        () => apiInstance.get(baseUrl),
        `fetch ${resourceName}`
      );
    },

    /**
     * Get resource by ID
     * @param {string} token - Access token
     * @param {string|number} id - Resource ID
     * @returns {Promise<Object>} Resource data
     */
    getById: async (token, id) => {
      setAuthToken(apiInstance, token);
      return executeApiCall(
        () => apiInstance.get(`${baseUrl}/${id}`),
        `fetch ${resourceName} by ID`
      );
    },

    /**
     * Create new resource
     * @param {string} token - Access token
     * @param {Object} data - Resource data
     * @returns {Promise<Object>} Created resource
     */
    create: async (token, data) => {
      setAuthToken(apiInstance, token);
      return executeApiCall(
        () => apiInstance.post(baseUrl, data),
        `create ${resourceName}`
      );
    },

    /**
     * Update resource
     * @param {string} token - Access token
     * @param {string|number} id - Resource ID
     * @param {Object} data - Updated resource data
     * @returns {Promise<Object>} Updated resource
     */
    update: async (token, id, data) => {
      setAuthToken(apiInstance, token);
      return executeApiCall(
        () => apiInstance.put(`${baseUrl}/${id}`, data),
        `update ${resourceName}`
      );
    },

    /**
     * Delete resource
     * @param {string} token - Access token
     * @param {string|number} id - Resource ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    delete: async (token, id) => {
      setAuthToken(apiInstance, token);
      return executeApiCall(
        () => apiInstance.delete(`${baseUrl}/${id}`),
        `delete ${resourceName}`
      );
    },
    getUsersByRole: async (token, role) => {
      setAuthToken(apiInstance, token);

      return executeApiCall(
        () => apiInstance.get(`${baseUrl}?role=${role}`),
        `fetch users by role`
      );
    },
  };
};