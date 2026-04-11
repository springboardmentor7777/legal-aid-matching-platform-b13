import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global Error Handler with Toast Notifications
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error || error.message;

    if ((status === 401 || status === 403) && window.location.pathname !== "/login") {
      toast.error("Session expired. Please log in again.", { id: "session-expired" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else if (status === 500) {
      toast.error("Server error — please try again later.", { id: "server-error" });
    } else if (status === 404) {
      // 404 is often expected, don't toast globally
      console.warn("Resource not found:", message);
    } else if (!error.response) {
      toast.error("Network error — check your connection.", { id: "network-error" });
    }

    return Promise.reject(error);
  }
);

export default API;