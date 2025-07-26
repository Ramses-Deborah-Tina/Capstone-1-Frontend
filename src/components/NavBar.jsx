import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  const { isAuthenticated, user: auth0User, logout: auth0Logout, isLoading } = useAuth0();
  const [isHovered, setIsHovered] = useState(false); // State to track hover

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
    <nav
      className={`navbar ${isHovered ? "hovered" : "idle"}`} // Apply class based on hover state
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="nav-brand">
        {/* Always show "Instapoll" text and its logo, do not replace or change */}
        <Link to="/">
          <span className="instapoll-logo">📊</span>Instapoll
        </Link>
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
            <span className="username">
              Welcome, {displayName}!
            </span>
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