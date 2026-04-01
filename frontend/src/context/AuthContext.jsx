import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // sessionStorage is tab-specific — each tab keeps its own logged-in user.
    // Falls back to localStorage so the session survives a page refresh.
    try {
      const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // Corrupted storage — start fresh
      localStorage.clear();
      sessionStorage.clear();
    }
  }, []);

  const login = (data) => {
    // Guard: both tokens must be present in the API response
    if (!data?.accessToken) {
      console.error("AuthContext.login: accessToken missing in response");
      return;
    }

    const userData = {
      role:   data.role,
      userId: data.userId,
    };

    // Persist tokens — sessionStorage for tab isolation, localStorage for refresh survival
    localStorage.setItem("accessToken",  data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken ?? "");
    localStorage.setItem("user", JSON.stringify(userData));

    sessionStorage.setItem("accessToken",  data.accessToken);
    sessionStorage.setItem("refreshToken", data.refreshToken ?? "");
    sessionStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);