// useDataStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // http://localhost:5000/api/auth
const API_BASE = API_URL.replace("/auth", ""); // http://localhost:5000/api
axios.defaults.withCredentials = true;

// Ensure each state-changing request includes the XSRF token header (double-submit)
const getCsrfFromCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

axios.interceptors.request.use((config) => {
  const token = getCsrfFromCookie();
  if (token) {
    config.headers = config.headers || {};
    // common header name used by our backend middleware
    config.headers["x-xsrf-token"] = token;
  }
  return config;
});

export const useDataStore = create((set) => ({
  isLoading: false,
  home: null,
  projects: [],
  about: null,
  error: false, // <-- selalu boolean
  message: "",
  homeData: async (email) => {
    set({ isLoading: true, error: false, message: "" });
    try {
      const res = await axios.get(`${API_BASE}/home`, {
        params: { email },
      });
      // kalau 2xx tapi success=false (jarang, tapi amankan)
      if (res.data?.success === false) {
        return set({
          isLoading: false,
          home: null,
          error: true, // bukan error, data kosong saja
          message: res.data?.message || "No data found",
        });
      }
      // success
      set({
        home: res.data?.data ?? null,
        error: false,
        message: res.data?.message || "OK",
      });
    } catch (err) {
      // Jika 404, treat sebagai no data, bukan error
      if (err.response?.status === 404) {
        set({
          home: null,
          error: false, // debug
          message: err.response.data?.message || "No home data found",
        });
      } else {
        // Error lain (500, network, dll)
        set({
          home: null,
          error: true,
          message:
            err?.response?.data?.message ||
            err.message ||
            "Failed to fetch data",
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  projectsData: async (email) => {
    set({ isLoading: true, error: false, message: "" });
    try {
      const res = await axios.get(`${API_BASE}/projects`, {
        params: { email },
      });
      if (res.data?.success === false) {
        return set({
          isLoading: false,
          projects: [],
          error: true,
          message: res.data?.message || "No projects found",
        });
      }
      // success
      set({
        projects: res.data?.data ?? [],
        error: false,
        message: res.data?.message || "OK",
      });
    } catch (err) {
      // Jika 404, treat sebagai no data, bukan error
      if (err.response?.status === 404) {
        set({
          projects: [],
          error: false,
          message: err.response.data?.message || "No projects found",
        });
      } else {
        // Error lain (500, network, dll)
        set({
          projects: [],
          error: true,
          message:
            err?.response?.data?.message ||
            err.message ||
            "Failed to fetch projects",
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  aboutData: async (email) => {
    set({ isLoading: true, error: false, message: "" });
    try {
      const res = await axios.get(`${API_BASE}/about`, {
        params: { email },
      });
      if (res.data?.success === false) {
        return set({
          isLoading: false,
          about: null,
          error: true,
          message: res.data?.message || "No about data found",
        });
      }
      // success
      set({
        about: res.data?.data ?? null,
        error: false,
        message: res.data?.message || "OK",
      });
    } catch (err) {
      // Jika 404, treat sebagai no data, bukan error
      if (err.response?.status === 404) {
        set({
          about: null,
          error: false,
          message: err.response.data?.message || "No about data found",
        });
      } else {
        // Error lain (500, network, dll)
        set({
          about: null,
          error: true,
          message:
            err?.response?.data?.message ||
            err.message ||
            "Failed to fetch about data",
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  updateHome: async (formData) => {
    set({ isLoading: true, error: false, message: "" });
    try {
      const res = await axios.put(`${API_BASE}/home`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        set({ home: res.data.data });
        set({ error: false, message: res.data.message });
      } else {
        set({ error: true, message: res.data.message || "Failed to update" });
      }
    } catch (err) {
      set({
        error: true,
        message: err.response?.data?.message || "Failed to update home",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  updateAbout: async (formData) => {
    set({ isLoading: true, error: false, message: "" });
    try {
      const res = await axios.post(`${API_BASE}/about`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        set({ about: res.data.data });
        set({ error: false, message: res.data.message });
      } else {
        set({
          error: true,
          message: res.data.message || "Failed to update about",
        });
      }
    } catch (err) {
      set({
        error: true,
        message: err.response?.data?.message || "Failed to update about",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  createProject: async (formData) => {
    set({ isLoading: true, error: false, message: "" });
    try {
      const res = await axios.post(`${API_BASE}/projects`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        // Add the new project to the projects array
        set((state) => ({
          projects: [...state.projects, res.data.data],
          error: false,
          message: res.data.message,
        }));
      } else {
        set({
          error: true,
          message: res.data.message || "Failed to create project",
        });
      }
    } catch (err) {
      set({
        error: true,
        message: err.response?.data?.message || "Failed to create project",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
