import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import { apiUrl, unwrapApiResponse } from "../utils/api";

const GoogleSuccess = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(apiUrl("/auth/me"), {
          method: "GET",
          credentials: "include",
        });
        const payload = await res.json();
        const data = unwrapApiResponse(payload);
        if (res.ok && data) {
          login(data);
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
  }, [login, navigate]);

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
