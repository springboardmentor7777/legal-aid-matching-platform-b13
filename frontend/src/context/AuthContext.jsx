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
    const response = await API.post("/api/auth/login", credentials);
    const data = response.data;

    localStorage.setItem("token", data.accessToken);

    // Normalize role: strip "ROLE_" prefix if present (backend may send "ROLE_ADMIN")
    const rawRole = (data.role || "CITIZEN").toUpperCase();
    const normalizedRole = rawRole.startsWith("ROLE_") ? rawRole.substring(5) : rawRole;

    const userData = {
      email: data.email || credentials.email,
      username: data.username || data.email,
      role: normalizedRole,
      onboardingComplete: data.onboardingComplete ?? false,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (data) => {
    const response = await API.post("/api/auth/register", data);
    const resData = response.data;

    localStorage.setItem("token", resData.accessToken);

    const userData = {
      email: resData.email || data.email,
      username: resData.username || data.username,
      role: resData.role || data.role,
      onboardingComplete: resData.onboardingComplete ?? false,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return resData;
  };

  const completeOnboarding = () => {
    const updated = { ...user, onboardingComplete: true };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, completeOnboarding, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);