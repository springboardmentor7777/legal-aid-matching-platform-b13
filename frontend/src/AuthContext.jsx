import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = (email, password) => {
    const dummyUser = {
      name: "John Doe",
      email,
      role: email.includes("admin")
        ? "ADMIN"
        : email.includes("lawyer")
        ? "LAWYER"
        : email.includes("ngo")
        ? "NGO"
        : "CITIZEN"
    };

    localStorage.setItem("user", JSON.stringify(dummyUser));
    setUser(dummyUser);

    navigate(`/dashboard/${dummyUser.role.toLowerCase()}`);
  };

  const register = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    navigate(`/dashboard/${data.role.toLowerCase()}`);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
