import { useState } from "react";
import { AuthContext } from "./authContext";
import { apiUrl } from "../utils/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  );

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  const logout = () => {
    fetch(apiUrl("/auth/logout"), {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
