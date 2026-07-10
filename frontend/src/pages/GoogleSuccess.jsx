import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import axiosInstance from "../utils/axiosInstance";
import { setUserInfoCookie, setAuthTokenCookie } from "../utils/cookies";

const GoogleSuccess = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        const userData = res.data;
        if (userData) {
          setUser(userData);
          setUserInfoCookie(userData);
          if (userData?.token) {
            setAuthTokenCookie(userData.token);
          }
          toast.success("Welcome back! You're logged in with Google.");
          navigate("/");
        } else {
          toast.error("Google authentication failed. Please try again.");
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    };

    fetchUser();
  }, [setUser, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
        color: "#fff",
        fontSize: "1.2rem",
      }}
    >
      <div>Completing sign in...</div>
    </div>
  );
};

export default GoogleSuccess;
