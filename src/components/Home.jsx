import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import logo from "./assets/logo.png"; // adjust the path as needed

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo-container">
          <img src={logo} alt="InstaPoll Logo" className="logo-img" />
          <h1 className="logo-text">InstaPoll</h1>
        </div>
        <Link to="/login" className="login-link">Login</Link>
      </header>

      <div className="home-content">
        <h2 className="headline">Create and share polls easily</h2>
        <p className="subtext">
          Get instant feedback from your audience by creating polls in just a few clicks.
        </p>

        <div className="home-buttons">
          <Link to="/create" className="create-btn">Create Poll</Link>
          <Link to="/polls" className="browse-btn">Browse Polls</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
