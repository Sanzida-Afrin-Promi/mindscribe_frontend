/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode"; // Install: npm install jwt-decode
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define User Data Type
interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  // ✅ Fix: Initialize `user` state directly from localStorage
  const getUserFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return {
          id: decoded.id,
          username: decoded.username,
          name: decoded.name,
          role: decoded.role,
        };
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    }
    return null;
  };

  const [user, setUser] = useState<User | null>(getUserFromLocalStorage);

  // ✅ Fix: Update `user` state when token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.id,
          username: decoded.username,
          name: decoded.name,
          role: decoded.role,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, []);

  // ✅ Function to handle login
  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decoded: any = jwtDecode(token);
      const userData = {
        id: decoded.id,
        username: decoded.username,
        name: decoded.name,
        role: decoded.role,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/home");
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  };

  // ✅ Function to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signIn");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
