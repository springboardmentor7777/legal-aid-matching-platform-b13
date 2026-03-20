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

    if (token && token !== "undefined") {
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

    // Only logout if token is invalid
    if (status === 401) {
      console.log("Token expired → logging out");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;