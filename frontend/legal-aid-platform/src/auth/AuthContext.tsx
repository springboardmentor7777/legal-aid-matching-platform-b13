import { createContext, useContext, useEffect, useState } from "react";
import type { LoginResponse } from "../types/auth.type";

type User = {
  username: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  initializing: boolean;
  login: (data: LoginResponse, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // restore auth on refresh
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   const storedToken = localStorage.getItem("accessToken");

  //   if (storedUser && storedToken) {
  //     setUser(JSON.parse(storedUser));
  //     setAccessToken(storedToken);
  //   }
  // }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      } catch {
        // corrupted data → clear
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setInitializing(false);
  }, []);


  const login = (data: LoginResponse, email: string) => {
    const mappedUser: User = {
      email,
      username: data.username,
      role: data.role,
    };

    setUser(mappedUser);
    setAccessToken(data.accessToken);

    // setUser(data.user);
    // setAccessToken(data.access_token);
    localStorage.setItem('user', JSON.stringify(mappedUser));
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    // localStorage.setItem("user", JSON.stringify(data.user));
    // localStorage.setItem("accessToken", data.access_token);
    // localStorage.setItem("refreshToken", data.refresh_token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
