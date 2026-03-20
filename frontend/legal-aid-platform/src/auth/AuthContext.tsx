import { createContext, useContext, useEffect, useState } from "react";
import type { LoginResponse } from "../types/auth.type";

//  Added the 'id' field so React remembers who you are!
type User = {
  id: number | string; 
  username: string;
  email: string;
  role: string;
  status: boolean;
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setInitializing(false);
  }, []);

  const login = (data: LoginResponse, email: string) => {
    
    //  Safely grab the ID. (Check data.id, data.userId, or data.user?.id)
    const userId = (data as any).id || (data as any).userId || ((data as any).user && (data as any).user.id) || 0;

    const mappedUser: User = {
      id: userId, // <-- Save the ID!
      email,
      username: data.username,
      role: data.role,
      status: data.isVerified,
    };

    setUser(mappedUser);
    setAccessToken(data.accessToken);

    localStorage.setItem('user', JSON.stringify(mappedUser));
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
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