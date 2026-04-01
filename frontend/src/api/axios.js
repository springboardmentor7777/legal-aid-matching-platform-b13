import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT — reads from sessionStorage first (tab-specific), then localStorage.
// This ensures each browser tab sends its own token when multiple roles are tested.
API.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses.
// IMPORTANT: Do NOT redirect when the failing URL is the login endpoint itself —
// that would cause an infinite redirect loop when the user enters wrong credentials.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/admin/login");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;