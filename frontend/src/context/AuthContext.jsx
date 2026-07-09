import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  );
  const [loading, setLoading] = useState(true);

  // Sync user status on reload with /auth/me
  useEffect(() => {
    const syncUser = async () => {
      try {
        if (localStorage.getItem("userInfo")) {
          const res = await axiosInstance.get("/auth/me");
          const userData = res.data;
          setUser(userData);
          localStorage.setItem("userInfo", JSON.stringify(userData));
        }
      } catch (err) {
        // Token expired/invalid
        setUser(null);
        localStorage.removeItem("userInfo");
      } finally {
        setLoading(false);
      }
    };
    syncUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));
      toast.success("Successfully logged in!");
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axiosInstance.post("/auth/register", { name, email, password });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));
      toast.success("Successfully registered account!");
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      // Ignore logout errors
    } finally {
      setUser(null);
      localStorage.removeItem("userInfo");
      toast.success("Logged out successfully");
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      const userData = res.data;
      setUser(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));
      return userData;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
