// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeStyles.css"; // Ensure this CSS file is linked

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        {/* Icon for visual appeal */}
        <div className="poll-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-bar-chart-2"
          >
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </div>
        <h1>Welcome to InstaPoll!</h1>
        <p className="home-subtitle">
          Create, share, and vote on engaging polls in an instant.
        </p>
        <div className="home-buttons">
          <button onClick={() => navigate("/create")}>
            Create a New Poll
          </button>
          <button onClick={() => navigate("/login")}>
            Log In to Your Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;