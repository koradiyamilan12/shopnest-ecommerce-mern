import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  getUserInfoCookie,
  setUserInfoCookie,
  removeUserInfoCookie,
  setAuthTokenCookie,
  removeAuthTokenCookie,
} from "../utils/cookies";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserInfoCookie());
  const [loading, setLoading] = useState(true);

  // Sync user status on reload with /auth/me
  useEffect(() => {
    const syncUser = async () => {
      try {
        if (getUserInfoCookie()) {
          const res = await axiosInstance.get("/auth/me");
          const userData = res.data;
          setUser(userData);
          setUserInfoCookie(userData);
          if (userData?.token) {
            setAuthTokenCookie(userData.token);
          }
        }
      } catch {
        // Token expired/invalid
        setUser(null);
        removeUserInfoCookie();
        removeAuthTokenCookie();
      } finally {
        setLoading(false);
      }
    };
    syncUser();
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    const userData = res.data;
    setUser(userData);
    setUserInfoCookie(userData);
    if (userData?.token) {
      setAuthTokenCookie(userData.token);
    }
    toast.success("Successfully logged in!");
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await axiosInstance.post("/auth/register", { name, email, password });
    toast.success("Successfully registered account! Please log in.");
    return res.data;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      removeUserInfoCookie();
      removeAuthTokenCookie();
      toast.success("Logged out successfully");
    }
  };

  const refreshProfile = async () => {
    const res = await axiosInstance.get("/auth/me");
    const userData = res.data;
    setUser(userData);
    setUserInfoCookie(userData);
    if (userData?.token) {
      setAuthTokenCookie(userData.token);
    }
    return userData;
  };

  const updateProfile = async (name, email, password) => {
    const res = await axiosInstance.put("/auth/me", { name, email, password });
    const userData = res.data;
    setUser(userData);
    setUserInfoCookie(userData);
    if (userData?.token) {
      setAuthTokenCookie(userData.token);
    }
    toast.success("Profile updated successfully");
    return userData;
  };

  const deleteProfile = async () => {
    await axiosInstance.delete("/auth/me");
    setUser(null);
    removeUserInfoCookie();
    removeAuthTokenCookie();
    toast.success("Account deleted successfully");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, updateProfile, deleteProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
