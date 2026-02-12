import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Configure axios to send cookies with all requests (for httpOnly token)
axios.defaults.withCredentials = true;

// Add error interceptor to handle auth failures globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized (401), let the store handle it
    if (error.response?.status === 401) {
      console.warn("Auth: Unauthorized - token may have expired");
    }
    return Promise.reject(error);
  },
);

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  /**
   * Clears error state
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Login with email and password
   * Uses httpOnly cookies for token storage (handled by backend)
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      // Backend sets httpOnly cookie automatically
      // No need to store token in localStorage for security
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Login failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Logout user and clear auth state
   */
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`, {}, { timeout: 5000 });
    } catch (error) {
      console.error("Logout error:", error.message);
      // Continue with logout even if request fails
    } finally {
      // Always clear state and let backend clear cookies
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        message: null,
      });
    }
  },

  /**
   * Check if user is authenticated by verifying token with backend
   * This should only be called once on app initialization
   */
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await axios.get(`${API_URL}/check-auth`);

      set({
        isAuthenticated: true,
        user: response.data.user,
        isCheckingAuth: false,
      });
    } catch (error) {
      // Unauthorized or no valid token - this is expected for new users
      // Don't treat as error, just clear auth state
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        error: null,
      });

      if (error.response?.status !== 401) {
        console.error("Auth check error:", error.message);
      }
    }
  },

  /**
   * Signup new user
   */
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });

      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Signup failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Verify email with code
   */
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });

      set({
        user: response.data.user,
        error: null,
        isLoading: false,
        message: response.data?.message || "Email verified successfully",
      });

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Verification failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });

      set({
        message: response.data?.message || "Reset email sent",
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Request failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });

      set({
        message: response.data?.message || "Password reset successful",
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Reset failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
