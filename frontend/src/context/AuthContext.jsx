import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    const { accessToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    return user;
  };

  const register = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {}

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);