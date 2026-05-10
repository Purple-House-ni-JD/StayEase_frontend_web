import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/auth";
import { tokens } from "../api/tokens";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (tokens.getAccess()) {
        try {
          const userData = await authService.me();
          setUser(userData);
        } catch (err) {
          tokens.clear();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    tokens.set(res.access, res.refresh);
    setUser(res.user);
    return res.user;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    tokens.set(res.access, res.refresh);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    const refresh = tokens.getRefresh();
    if (refresh) {
      try {
        await authService.logout(refresh);
      } catch (e) {
        console.error(e);
      }
    }
    tokens.clear();
    setUser(null);
  };

  // Pure JavaScript rendering to bypass Vite's JSX restrictions
  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, register, logout, loading } },
    !loading ? children : null,
  );
};

export const useAuth = () => useContext(AuthContext);
