import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Create from "./components/Create";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { API_URL } from "./shared";
import { AuthProvider } from "./components/AuthContext";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Result from "./components/ResultPage/Results.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import { Auth0Provider } from "@auth0/auth0-react"; //  Auth0 Import do not remove or touch, lets not even breathe on it please 🙏
import Reviews from "./components/Reviews";

// Main App component with routing and logic
const App = ({ user, setUser }) => {
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch {
      console.log("Not authenticated");
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/create" element={<Create setUser={setUser} />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ✅ Protected route for Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* ✅ Public route for Result page */}
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Reviews inserted just above Footer */}
        <Reviews />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

// Root component with providers (Auth0, Router, Auth Context)
const Root = () => {
  const [user, setUser] = useState(null);

  const domain = process.env.VITE_AUTH0_DOMAIN;
  const clientId = process.env.VITE_AUTH0_CLIENT_ID;
  const audience = process.env.VITE_AUTH0_AUDIENCE;
  const redirectUri = process.env.VITE_AUTH0_CALLBACK_URL;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
      }}
    >
      <AuthProvider user={user} setUser={setUser}>
        <Router>
          <App user={user} setUser={setUser} />
        </Router>
      </AuthProvider>
    </Auth0Provider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
