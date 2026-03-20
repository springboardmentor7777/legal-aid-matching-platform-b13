import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");

    if (token) {
      setUser({ token, name, role });
    }

  }, []);

  const login = (token, name, role) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
    setUser({ token, name, role });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};