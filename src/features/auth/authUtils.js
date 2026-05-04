/**
 * Authentication utility functions for managing session storage
 * Provides reusable methods for storing and retrieving authentication data
 */

/**
 * Keys used for storing authentication data in sessionStorage
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  FULL_NAME: 'fullName',
  ROLES: 'roles',
  USER_ID: 'userId',
  REFRESH_TOKEN: 'refreshToken'
};

/**
 * Safely parses JSON from sessionStorage, returns default value on error
 * @param {string} key - The sessionStorage key
 * @param {*} defaultValue - Default value to return if parsing fails
 * @returns {*} Parsed value or default value
 */
const safeJsonParse = (key, defaultValue = null) => {
  const raw = sessionStorage.getItem(key);
  if (!raw) return defaultValue;

  try {
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
};

/**
 * Retrieves authentication data from sessionStorage
 * @returns {Object} Authentication state object
 */
export const getStoredAuthData = () => ({
  accessToken: sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  fullName: sessionStorage.getItem(STORAGE_KEYS.FULL_NAME) || '',
  roles: safeJsonParse(STORAGE_KEYS.ROLES, []),
  userId: sessionStorage.getItem(STORAGE_KEYS.USER_ID) || null,
  refreshToken: sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
});

/**
 * Stores authentication data in sessionStorage
 * @param {Object} authData - Authentication data to store
 * @param {string} authData.accessToken - Access token
 * @param {string} authData.fullName - User's full name
 * @param {Array} authData.roles - User's roles
 * @param {string} authData.userId - User ID
 * @param {string} [authData.refreshToken] - Refresh token (optional)
 */
export const storeAuthData = ({ accessToken, fullName, roles, userId, refreshToken }) => {
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  sessionStorage.setItem(STORAGE_KEYS.FULL_NAME, fullName);
  sessionStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
  sessionStorage.setItem(STORAGE_KEYS.USER_ID, userId || '');

  if (refreshToken) {
    sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
};

/**
 * Clears all authentication data from sessionStorage
 */
export const clearAuthData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });
};