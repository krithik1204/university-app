import { createApiInstance, createApiService, executeApiCall, setAuthToken } from './baseApi';

/**
 * Example API Service
 * Demonstrates how to create a new API service using the reusable base utilities
 * This is a template that can be copied and modified for new resources
 */

// Create axios instance for the resource
const exampleApi = createApiInstance();

// Create base service for the resource (provides CRUD operations)
const exampleService = createApiService('examples', exampleApi);

/**
 * Get all examples
 * @param {string} token - Access token
 * @returns {Promise<Array>} Array of examples
 */
export const getExamples = async (token) => {
  return exampleService.getAll(token);
};

/**
 * Get example by ID
 * @param {string} token - Access token
 * @param {string|number} exampleId - Example ID
 * @returns {Promise<Object>} Example data
 */
export const getExampleById = async (token, exampleId) => {
  return exampleService.getById(token, exampleId);
};

/**
 * Create new example
 * @param {string} token - Access token
 * @param {Object} exampleData - Example data
 * @returns {Promise<Object>} Created example
 */
export const createExample = async (token, exampleData) => {
  return exampleService.create(token, exampleData);
};

/**
 * Update example
 * @param {string} token - Access token
 * @param {string|number} exampleId - Example ID
 * @param {Object} exampleData - Updated example data
 * @returns {Promise<Object>} Updated example
 */
export const updateExample = async (token, exampleId, exampleData) => {
  return exampleService.update(token, exampleId, exampleData);
};

/**
 * Delete example
 * @param {string} token - Access token
 * @param {string|number} exampleId - Example ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteExample = async (token, exampleId) => {
  return exampleService.delete(token, exampleId);
};

/**
 * Custom method example - resource-specific business logic
 * Search examples by category
 * @param {string} token - Access token
 * @param {string} category - Category to search for
 * @returns {Promise<Array>} Filtered examples
 */
export const searchExamplesByCategory = async (token, category) => {
  try {
    setAuthToken(exampleApi, token);
    return executeApiCall(
      () => exampleApi.get(`/examples/search?category=${encodeURIComponent(category)}`),
      'search examples by category'
    );
  } catch (error) {
    console.error('Error searching examples:', error);
    throw error;
  }
};

/**
 * Custom method example - bulk operations
 * Bulk update examples
 * @param {string} token - Access token
 * @param {Array} updates - Array of update operations
 * @returns {Promise<Object>} Bulk update results
 */
export const bulkUpdateExamples = async (token, updates) => {
  try {
    setAuthToken(exampleApi, token);
    return executeApiCall(
      () => exampleApi.put('/examples/bulk', { updates }),
      'bulk update examples'
    );
  } catch (error) {
    console.error('Error bulk updating examples:', error);
    throw error;
  }
};

// Export the base service for advanced usage or direct access to CRUD methods
export { exampleService };

// Export the API instance for custom configurations if needed
export { exampleApi };