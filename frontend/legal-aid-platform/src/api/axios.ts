import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/", // example: http://localhost:8000/api
  withCredentials: true, // important if using cookies
});

export default api;
