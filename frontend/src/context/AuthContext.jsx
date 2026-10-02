import { createContext, useContext, useState, useEffect } from "react";
import authService from "../api/authService.js";
import apiClient from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check initial authentication status
  useEffect(() => {
    async function loadUser() {
      const token = apiClient.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (err) {
        console.warn("Session check failed, clearing invalid token:", err.message);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    return res.user;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const addSkill = async (type, skill) => {
    const updated = await authService.addSkill(type, skill);
    setUser(updated);
    return updated;
  };

  const removeSkill = async (type, skill) => {
    const updated = await authService.removeSkill(type, skill);
    setUser(updated);
    return updated;
  };

  const updateProfile = async (data) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        addSkill,
        removeSkill,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
