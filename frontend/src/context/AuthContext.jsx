import { createContext, useContext, useEffect, useState } from "react";


import API from "../api/axios";


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
    const response = await API.post("/auth/login", credentials);

    const { accessToken } = response.data;

    localStorage.setItem("token", accessToken);

const userData = response.data.user || { email: credentials.email };
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    return response.data;
  };

  const register = async (data) => {
    const response = await API.post("/auth/register", data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);