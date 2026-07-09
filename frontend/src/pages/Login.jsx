import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import "../styles/auth.css";
import { apiUrl, getApiMessage, unwrapApiResponse } from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/v1/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await res.json();
      const data = unwrapApiResponse(payload);
      if (res.ok) {
        login(data);
        toast.success("Welcome back! You’re signed in.");
        navigate("/");
      } else {
        toast.error(getApiMessage(payload, "Login failed. Please try again."));
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to sign in right now. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          Login
        </button>
        <div className="divider">or</div>
        <button type="button" onClick={handleGoogleLogin} className="btn-google">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.102C18.232 1.814 15.422 1 12.24 1 6.05 1 1.05 5.95 1.05 12s5 11 11.19 11c6.46 0 10.77-4.52 10.77-10.96 0-.74-.08-1.3-.18-1.755H12.24z"
            />
          </svg>
          Sign in with Google
        </button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
