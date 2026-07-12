import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/authContext";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import "../styles/auth.css";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/v1/auth/google`;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email address is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await register(values.name, values.email, values.password);
        navigate("/login");
      } catch (err) {
        // Handled automatically by axiosInstance interceptors
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
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Join us and access premium tech products.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="auth-input-container">
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Enter Your Full Name"
                {...formik.getFieldProps("name")}
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <div className="form-error">{formik.errors.name}</div>
            )}
          </div>

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
            <label className="form-label" htmlFor="password">Password</label>
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

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-input-container">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter Your Password"
                {...formik.getFieldProps("confirmPassword")}
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="form-error">{formik.errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={formik.isSubmitting}
            style={{ width: "100%", marginTop: "var(--spacing-xs)" }}
          >
            {formik.isSubmitting ? <span className="spinner"></span> : "Sign Up"}
          </button>

          <div className="auth-divider">or</div>

          <button type="button" onClick={handleGoogleLogin} className="btn-google">
            <FcGoogle size={18} /> Sign up with Google
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
