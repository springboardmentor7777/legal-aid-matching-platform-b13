import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080", // backend URL
});

export default API;