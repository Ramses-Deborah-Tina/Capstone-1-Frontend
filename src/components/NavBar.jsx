import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  const { isAuthenticated, user: auth0User, logout: auth0Logout, isLoading } = useAuth0();

  const handleLogout = () => {
    if (isAuthenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      onLogout(); // This is your backend logout
    }
  };

  const displayName = isAuthenticated
    ? auth0User?.name || auth0User?.email
    : user?.username;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Instapoll</Link>
      </div>

      <div className="nav-links">
        {/* Always show Home and Create */}
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/create" className="nav-link">
          Create a Poll
        </Link>

        {/* Show Dashboard only if authenticated */}
        {(user || isAuthenticated) && (
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        )}

        {/* Show Login/Signup if not authenticated */}
        {!user && !isAuthenticated && !isLoading ? (
          <div className="auth-links">
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </div>
        ) : (
          <div className="user-section">
            <span className="username">Welcome, {displayName}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
