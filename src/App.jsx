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
  //useLocation,
} from "react-router-dom";
import AuthForm from "./components/AuthForm";
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
import { Auth0Provider } from "@auth0/auth0-react";
import Reviews from "./components/Reviews";
import { ThemeProvider } from "./components/ThemeContext";

// Background pattern URL (you can move this somewhere common if you want)
const backgroundPatternUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='100' viewBox='0 0 600 100'%3E%3Crect fill='%23ffffff' width='600' height='100'/%3E%3Cg stroke='%23FFF' stroke-width='0' stroke-miterlimit='10'%3E%3Ccircle fill='%23037B79' cx='0' cy='0' r='50'/%3E%3Ccircle fill='%2392DEBA' cx='100' cy='0' r='50'/%3E%3Ccircle fill='%23FFFFD8' cx='200' cy='0' r='50'/%3E%3Ccircle fill='%23CAF2FF' cx='300' cy='0' r='50'/%3E%3Ccircle fill='%236FCCFF' cx='400' cy='0' r='50'/%3E%3Ccircle fill='%23006EB4' cx='500' cy='0' r='50'/%3E%3Ccircle fill='%23037B79' cx='600' cy='0' r='50'/%3E%3Ccircle fill='%2392DEBA' cx='-50' cy='50' r='50'/%3E%3Ccircle fill='%2353AC9A' cx='50' cy='50' r='50'/%3E%3Ccircle fill='%23CEEDC1' cx='150' cy='50' r='50'/%3E%3Ccircle fill='%23FFFFFF' cx='250' cy='50' r='50'/%3E%3Ccircle fill='%239DE0FE' cx='350' cy='50' r='50'/%3E%3Ccircle fill='%233E9CDA' cx='450' cy='50' r='50'/%3E%3Ccircle fill='%2300789C' cx='550' cy='50' r='50'/%3E%3Ccircle fill='%2392DEBA' cx='650' cy='50' r='50'/%3E%3Ccircle fill='%23037B79' cx='0' cy='100' r='50'/%3E%3Ccircle fill='%2392DEBA' cx='100' cy='100' r='50'/%3E%3Ccircle fill='%23FFFFD8' cx='200' cy='100' r='50'/%3E%3Ccircle fill='%23CAF2FF' cx='300' cy='100' r='50'/%3E%3Ccircle fill='%236FCCFF' cx='400' cy='100' r='50'/%3E%3Ccircle fill='%23006EB4' cx='500' cy='100' r='50'/%3E%3Ccircle fill='%23037B79' cx='600' cy='100' r='50'/%3E%3Ccircle fill='%23CAF2FF' cx='50' cy='150' r='50'/%3E%3Ccircle fill='%236FCCFF' cx='150' cy='150' r='50'/%3E%3Ccircle fill='%239DE0FE' cx='250' cy='150' r='50'/%3E%3Ccircle fill='%2353AC9A' cx='350' cy='150' r='50'/%3E%3Ccircle fill='%23CEEDC1' cx='450' cy='150' r='50'/%3E%3Ccircle fill='%23FFFFD8' cx='550' cy='150' r='50'/%3E%3C/g%3E%3C/svg%3E`;

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

    // Set the background pattern once when App mounts
    document.body.style.setProperty("--bg-pattern", `url("${backgroundPatternUrl}")`);

    return () => {
      document.body.style.removeProperty("--bg-pattern");
    };
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
    <ThemeProvider>
      <div>
        <NavBar user={user} onLogout={handleLogout} />
        <div className="app">
          <Routes>
            <Route
              path="/login"
              element={<AuthForm setUser={setUser} mode="login" />}
            />
            <Route
              path="/signup"
              element={<AuthForm setUser={setUser} mode="signup" />}
            />
            <Route path="/create" element={<Create setUser={setUser} />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />
            <Route path="/result" element={<Result />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Reviews />
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
};

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
