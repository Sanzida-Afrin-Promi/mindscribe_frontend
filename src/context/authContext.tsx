import { jwtDecode } from "jwt-decode"; 
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface DecodedToken {
  id: string;
  username: string;
  name: string;
  role: string;
  exp: number; 
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}


export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const getUserFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);

        const expiryTime = decoded.exp * 1000;
        if (Date.now() >= expiryTime) {
          console.warn("Token expired");
          logout();
        } else {
          setUser({
            id: decoded.id,
            username: decoded.username,
            name: decoded.name,
            role: decoded.role,
          });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    } else {
      logout();
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userData = {
        id: decoded.id,
        username: decoded.username,
        name: decoded.name,
        role: decoded.role,
      };

      setUser(userData);
      navigate("/stories");
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
