import axios from "axios";

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

    if (token ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && window.location.pathname !== '/login') {
      console.log("Token expired → logging out");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    // 🔥 Handle 403 (optional but useful)
    if (status === 403) {
      console.log("Access denied (403)");
      alert("You are not allowed to perform this action");
    }

    return Promise.reject(error);
  }
);

export default API;