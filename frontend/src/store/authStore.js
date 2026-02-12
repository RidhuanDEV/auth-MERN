import { create } from "zustand";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data.user;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Error Signing up";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Error verifying email";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        error: null,
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (e) {
      set({ error: e.message, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Error logging in";
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });

    // Respect server config exposed to frontend via Vite env
    if (import.meta.env.VITE_EMAIL_VERIFICATION_ENABLED === "false") {
      const msg = "Password reset is disabled by server configuration";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Error sending password reset email";
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });

    if (import.meta.env.VITE_EMAIL_VERIFICATION_ENABLED === "false") {
      const msg = "Password reset is disabled by server configuration";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }

    try {
      // ✅ Encode token supaya aman di URL
      const encodedToken = encodeURIComponent(token);

      const response = await axios.post(
        `${API_URL}/reset-password/${encodedToken}`,
        { password },
      );
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Error resetting password";
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
