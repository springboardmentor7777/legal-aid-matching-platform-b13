import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);

      const { accessToken } = response.data;

      localStorage.setItem("token", accessToken);

      setUser({ email: credentials.email });

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (data) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);