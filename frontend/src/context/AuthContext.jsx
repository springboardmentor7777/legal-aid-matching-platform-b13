import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (email) => {
    let role = "CITIZEN";
    if (email.includes("admin")) role = "ADMIN";
    if (email.includes("lawyer")) role = "LAWYER";
    if (email.includes("ngo")) role = "NGO";

    const fakeToken = "jwt_token_" + Date.now();

    const fakeUser = {
      name: "John Doe",
      email,
      role
    };

    localStorage.setItem("user", JSON.stringify(fakeUser));
    localStorage.setItem("token", fakeToken);

    setUser(fakeUser);
    setToken(fakeToken);

    navigate(`/dashboard/${role.toLowerCase()}`);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
