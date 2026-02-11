import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // example: http://localhost:8000/api
  withCredentials: true, // important if using cookies
});

export default api;
