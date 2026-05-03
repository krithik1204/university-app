import { createSlice } from "@reduxjs/toolkit";
import { getStoredAuthData, storeAuthData, clearAuthData } from './authUtils';

/**
 * Authentication slice for Redux store
 * Manages user authentication state including login, logout, and session persistence
 */

// Load initial authentication state from sessionStorage
const storedAuthData = getStoredAuthData();

const initialState = {
  isAuthenticated: Boolean(storedAuthData.accessToken),
  fullName: storedAuthData.fullName,
  roles: storedAuthData.roles,
  accessToken: storedAuthData.accessToken,
  refreshToken: storedAuthData.refreshToken,
  userId: storedAuthData.userId,
};

/**
 * Redux slice for authentication
 * Handles login and logout actions with automatic sessionStorage persistence
 */
const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Login reducer - updates authentication state and persists to sessionStorage
     * @param {Object} state - Current authentication state
     * @param {Object} action - Action payload containing user authentication data
     */
    login: (state, action) => {
      const { fullName, roles, accessToken, refreshToken, userId } = action.payload;

      // Update state
      state.isAuthenticated = true;
      state.fullName = fullName;
      state.roles = roles;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken ?? null;
      state.userId = userId;

      // Persist to sessionStorage
      storeAuthData({ accessToken, fullName, roles, userId, refreshToken });
    },

    /**
     * Logout reducer - clears authentication state and removes session data
     * @param {Object} state - Current authentication state
     */
    logout: (state) => {
      // Reset state to initial values
      state.isAuthenticated = false;
      state.fullName = '';
      state.roles = [];
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;

      // Clear sessionStorage
      clearAuthData();
    }
  }
});

export const { login, logout } = AuthSlice.actions;
export default AuthSlice.reducer;