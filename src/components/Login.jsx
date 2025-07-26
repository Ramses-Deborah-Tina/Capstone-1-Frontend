import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import { useAuth0 } from "@auth0/auth0-react";
import "./AuthStyles.css";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    loginWithRedirect,
    isLoading: auth0Loading,
    error: auth0Error,
  } = useAuth0();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        withCredentials: true,
      });

      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth0Login = () => {
    loginWithRedirect();
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
              autoComplete="username"
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <hr className="divider" />

        <div className="auth0-login">
          <p>Or log in with:</p>
          {auth0Error && (
            <div className="error-message">Auth0 Error: {auth0Error.message}</div>
          )}
          <button
            onClick={handleAuth0Login}
            className="auth0-button"
            disabled={auth0Loading}
          >
            {auth0Loading ? "Redirecting..." : "Login with Auth0"}
          </button>
        </div>

        <p className="auth-link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

