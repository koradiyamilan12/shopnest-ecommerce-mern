import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/authContext";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import "../styles/auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/v1/auth/google`;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email address is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values.email, values.password);
        navigate("/");
      } catch (err) {
        // Errors are automatically toasted by axiosInstance interceptors,
        // but we catch here to stop form submitting states.
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <img
            src="/favicon.png"
            alt="ShopNest Logo"
            className="auth-logo-img"
          />
          <h2 className="auth-title">Sign in to ShopNest</h2>
          <p className="auth-subtitle">Welcome back! Sign in to access your dashboard.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="auth-input-container">
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter Your Email"
                {...formik.getFieldProps("email")}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="form-error">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <div className="flex-between" style={{ marginBottom: "var(--spacing-xs)" }}>
              <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: "var(--text-xs)", color: "var(--brand)" }}>
                Forgot password?
              </Link>
            </div>
            <div className="auth-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter Your Password"
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                className="auth-input-icon"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="form-error">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={formik.isSubmitting}
            style={{ width: "100%", marginTop: "var(--spacing-xs)" }}
          >
            {formik.isSubmitting ? <span className="spinner"></span> : "Sign In"}
          </button>

          <div className="auth-divider">or</div>

          <button type="button" onClick={handleGoogleLogin} className="btn-google">
            <FcGoogle size={18} /> Sign in with Google
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
