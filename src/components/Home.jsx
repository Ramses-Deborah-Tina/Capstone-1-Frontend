import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Home.css";
import logo from "./assets/logo.png";
import illustrationDark from "./assets/illustration-dark.png";
import illustrationLight from "./assets/illustration-light.png";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.body.classList.contains("light") ? "light" : "dark";
      setTheme(currentTheme);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const handleCreate = () => {
    if (user) navigate("/create");
    else navigate("/login");
  };

  const handleBrowse = () => {
    if (user) navigate("/polls");
    else navigate("/signup");
  };

  const illustration = theme === "dark" ? illustrationDark : illustrationLight;

  return (
    <div className="home-section">
      <main className="home-content">
        <div className="home-left">
          <h2 className="headline">Create and share polls easily</h2>
          <p className="subtext">
            Get instant feedback from your audience by creating polls in just a few clicks.
          </p>
          <div className="home-buttons">
            <button className="create-btn" onClick={handleCreate}>Create Poll</button>
            <button className="browse-btn" onClick={handleBrowse}>Browse Polls</button>
          </div>
        </div>
        <div className="home-right">
          <img src={illustration} alt="Poll Illustration" className="home-img" />
        </div>
      </main>
    </div>
  );
};

export default Home;
