/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Install: npm install jwt-decode
import { useNavigate } from "react-router-dom";

// Define User Data Type
interface User {
  [x: string]: any;
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate(); // ✅ useNavigate is fine here since BrowserRouter is in main.tsx

  // Load user from token
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
        logout(); // Remove invalid token
      }
    }
  }, []);

  // Logout functionz
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/signin"); // ✅ Redirect using navigate
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
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
