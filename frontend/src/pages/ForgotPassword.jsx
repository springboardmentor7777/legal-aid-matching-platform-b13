import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "./auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      if (!err.response) {
        setError("Network error. Please check your connection.");
      } else if (err.response.status === 404) {
        // Don't reveal whether the email exists — show the same success screen
        setSent(true);
      } else {
        setError("Something went wrong. Please try again shortly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-card auth-card--standalone">

        {/* Brand */}
        <div className="auth-brand auth-brand--centered">
          <span className="auth-brand-icon">⚖️</span>
          <span className="auth-brand-name">LegalAid</span>
        </div>

        {!sent ? (
          <>
            <div className="fp-icon" aria-hidden="true">🔑</div>
            <h1 className="auth-card-title fp-title">Forgot your password?</h1>
            <p className="auth-card-subtitle">
              Enter the email address linked to your account and we'll send you a reset link.
            </p>

            {error && (
              <div className="auth-error" role="alert">
                <span className="auth-error-icon" aria-hidden="true">⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="fp-email" className="auth-label">Email Address</label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="auth-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className={`auth-btn${loading ? " auth-btn--loading" : ""}`}
              >
                {loading ? (
                  <>
                    <span className="auth-spinner" aria-hidden="true" />
                    Sending reset link…
                  </>
                ) : (
                  "Send Reset Link →"
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="fp-success">
            <div className="fp-success-icon" aria-hidden="true">📬</div>
            <h2 className="fp-success-title">Check your inbox</h2>
            <p className="fp-success-text">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent. It may take a minute to arrive — check your spam folder too.
            </p>
            <button
              type="button"
              className="fp-resend-btn"
              onClick={() => { setSent(false); setEmail(""); }}
            >
              Try a different email
            </button>
          </div>
        )}

        <p className="auth-footer" style={{ marginTop: "24px" }}>
          Remembered it?{" "}
          <Link to="/login" className="auth-link">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;