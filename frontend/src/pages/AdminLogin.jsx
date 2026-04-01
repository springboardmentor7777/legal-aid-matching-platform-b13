import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/admin/login", { username, password });
      login({
        accessToken:  res.data.accessToken,
        refreshToken: res.data.refreshToken, // use the actual refresh token from backend
        role:   "ADMIN",
        userId: "admin",
      });
      navigate("/dashboard");
    } catch (err) {
      if (!err.response) {
        setError("Network error. Please check your connection.");
      } else if (err.response.status === 401) {
        setError("Invalid admin credentials. Please try again.");
      } else {
        setError("Something went wrong. Please try again shortly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-top">
          <div className="admin-shield" aria-hidden="true">🛡️</div>
          <h1 className="admin-title">Admin Portal</h1>
          <p className="admin-subtitle">Restricted access — authorised personnel only</p>
        </div>

        {error && (
          <div className="admin-error" role="alert">
            <span aria-hidden="true">⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-field">
            <label htmlFor="admin-username" className="admin-label">Username</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin username"
              required
              disabled={loading}
              autoComplete="username"
              className="admin-input"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password" className="admin-label">Password</label>
            <div className="admin-input-wrap">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                autoComplete="current-password"
                className="admin-input admin-input--password"
              />
              <button
                type="button"
                className="admin-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`admin-btn${loading ? " admin-btn--loading" : ""}`}
          >
            {loading ? (
              <>
                <span className="admin-spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Access Admin Panel →"
            )}
          </button>
        </form>

        <p className="admin-back">
          Not an admin?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="admin-back-link"
          >
            Go to regular login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;