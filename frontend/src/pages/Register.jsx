import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import "./auth.css";

const CATEGORIES = [
  "Property", "Criminal", "Family", "Civil",
  "Labour", "Consumer", "Human Rights", "Other",
];

const ROLES = [
  { value: "USER",   label: "Citizen",  desc: "I need legal help",       icon: "👤" },
  { value: "LAWYER", label: "Lawyer",   desc: "I provide legal services", icon: "⚖️" },
  { value: "NGO",    label: "NGO",      desc: "We support legal aid",     icon: "🤝" },
];

const Register = () => {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "",
    role: "USER", experienceYears: "", specialization: "", location: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordError(value.length > 0 && value.length < 6 ? "Password must be at least 6 characters." : "");
    }
  };

  const setRole = (role) => setForm((prev) => ({ ...prev, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms & Conditions to continue.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("An account with this email already exists.");
      } else if (!err.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isLawyer = form.role === "LAWYER";
  const isNgo    = form.role === "NGO";

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <span className="auth-brand-icon">⚖️</span>
            <span className="auth-brand-name">LegalAid</span>
          </div>
          <h2 className="auth-tagline">
            Start your journey<br />to justice today.
          </h2>
          <p className="auth-subtagline">
            Join thousands of citizens, lawyers, and NGOs on India's leading legal aid platform.
          </p>
          <ul className="auth-features" aria-label="Platform features">
            {["Free to join", "Verified professionals", "Secure & confidential", "24/7 access"].map((f) => (
              <li key={f} className="auth-feature">
                <span className="auth-feature-check" aria-hidden="true">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="auth-left-decor" aria-hidden="true">
          <div className="decor-ring decor-ring-1" />
          <div className="decor-ring decor-ring-2" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card auth-card--scroll">
          <h1 className="auth-card-title">Create your account</h1>
          <p className="auth-card-subtitle">Join the LegalAid platform — it's free</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="auth-field">
              <label htmlFor="reg-name" className="auth-label">
                {isNgo ? "Organisation Name" : "Full Name"}
              </label>
              <input
                id="reg-name"
                name="fullName"
                type="text"
                value={form.fullName}
                placeholder={isNgo ? "Legal Aid Foundation" : "Rahul Sharma"}
                required
                disabled={loading}
                autoComplete="name"
                onChange={handleChange}
                className="auth-input"
              />
            </div>

            {/* Email */}
            <div className="auth-field">
              <label htmlFor="reg-email" className="auth-label">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={form.email}
                placeholder="you@example.com"
                required
                disabled={loading}
                autoComplete="email"
                onChange={handleChange}
                className="auth-input"
              />
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="reg-password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete="new-password"
                  onChange={handleChange}
                  className={`auth-input auth-input--password${passwordError ? " auth-input--error" : ""}`}
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <span className="auth-field-error" role="alert">{passwordError}</span>
              )}
            </div>

            {/* Role selector */}
            <div className="auth-field">
              <span className="auth-label" id="role-label">I am a…</span>
              <div
                className="auth-role-grid"
                role="radiogroup"
                aria-labelledby="role-label"
              >
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    role="radio"
                    aria-checked={form.role === r.value}
                    disabled={loading}
                    onClick={() => setRole(r.value)}
                    className={`auth-role-card${form.role === r.value ? " auth-role-card--active" : ""}`}
                  >
                    <span className="auth-role-icon" aria-hidden="true">{r.icon}</span>
                    <span className="auth-role-label">{r.label}</span>
                    <span className="auth-role-desc">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lawyer extra fields */}
            {isLawyer && (
              <fieldset className="auth-extra-section" disabled={loading}>
                <legend className="auth-extra-title">
                  <span aria-hidden="true">⚖️</span> Lawyer Details
                </legend>
                <div className="auth-row">
                  <div className="auth-field auth-field--flex">
                    <label htmlFor="reg-exp" className="auth-label">
                      Years of Experience <span className="auth-req" aria-label="required">*</span>
                    </label>
                    <input
                      id="reg-exp"
                      name="experienceYears"
                      type="number"
                      min="0"
                      max="60"
                      value={form.experienceYears}
                      placeholder="e.g. 5"
                      required
                      onChange={handleChange}
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-field auth-field--flex">
                    <label htmlFor="reg-loc" className="auth-label">
                      Location <span className="auth-req" aria-label="required">*</span>
                    </label>
                    <input
                      id="reg-loc"
                      name="location"
                      type="text"
                      value={form.location}
                      placeholder="e.g. Hyderabad"
                      required
                      onChange={handleChange}
                      className="auth-input"
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="reg-spec" className="auth-label">
                    Specialization <span className="auth-req" aria-label="required">*</span>
                  </label>
                  <select
                    id="reg-spec"
                    name="specialization"
                    value={form.specialization}
                    required
                    onChange={handleChange}
                    className="auth-input auth-select"
                  >
                    <option value="">Select your area of expertise…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c} Law</option>
                    ))}
                  </select>
                </div>
              </fieldset>
            )}

            {/* NGO extra fields */}
            {isNgo && (
              <fieldset className="auth-extra-section auth-extra-section--ngo" disabled={loading}>
                <legend className="auth-extra-title auth-extra-title--ngo">
                  <span aria-hidden="true">🤝</span> NGO Details
                </legend>
                <div className="auth-row">
                  <div className="auth-field auth-field--flex">
                    <label htmlFor="reg-ngo-loc" className="auth-label">
                      Location <span className="auth-req" aria-label="required">*</span>
                    </label>
                    <input
                      id="reg-ngo-loc"
                      name="location"
                      type="text"
                      value={form.location}
                      placeholder="e.g. Hyderabad"
                      required
                      onChange={handleChange}
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-field auth-field--flex">
                    <label htmlFor="reg-ngo-spec" className="auth-label">
                      Area of Expertise <span className="auth-req" aria-label="required">*</span>
                    </label>
                    <select
                      id="reg-ngo-spec"
                      name="specialization"
                      value={form.specialization}
                      required
                      onChange={handleChange}
                      className="auth-input auth-select"
                    >
                      <option value="">Select expertise…</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>
            )}

            {/* Terms & Conditions */}
            <div className="auth-terms-row">
              <input
                id="reg-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={loading}
                className="auth-terms-checkbox"
              />
              <label htmlFor="reg-terms" className="auth-terms-label">
                I have read and agree to the{" "}
                <button type="button" className="auth-terms-link" onClick={() => setShowTermsModal(true)}>
                  Terms &amp; Conditions
                </button>{" "}
                and{" "}
                <button type="button" className="auth-terms-link" onClick={() => setShowTermsModal(true)}>
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !!passwordError || !agreedToTerms}
              className={`auth-btn${loading ? " auth-btn--loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" aria-hidden="true" />
                  Creating account…
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div
          className="terms-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
          onClick={(e) => e.target === e.currentTarget && setShowTermsModal(false)}
        >
          <div className="terms-modal">
            <div className="terms-modal-header">
              <h2 id="terms-title" className="terms-modal-title">Terms &amp; Conditions &amp; Privacy Policy</h2>
              <button
                type="button"
                className="terms-close"
                onClick={() => setShowTermsModal(false)}
                aria-label="Close"
              >✕</button>
            </div>

            <div className="terms-modal-body">
              <h3>1. Acceptance of Terms</h3>
              <p>By registering on LegalAid, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.</p>

              <h3>2. Eligibility</h3>
              <p>You must be at least 18 years old to register. By creating an account, you confirm that the information you provide is accurate and truthful.</p>

              <h3>3. User Roles</h3>
              <p><strong>Citizens</strong> may submit legal cases and seek assistance. <strong>Lawyers</strong> must hold a valid Bar Council registration. <strong>NGOs</strong> must be a registered organisation under applicable Indian law.</p>

              <h3>4. Confidentiality</h3>
              <p>All case information shared on LegalAid is treated as confidential. We do not share your personal case details with third parties without your explicit consent, except as required by law.</p>

              <h3>5. Prohibited Conduct</h3>
              <p>You agree not to misuse the platform, submit false information, impersonate others, or use LegalAid for any unlawful purpose.</p>

              <h3>6. Disclaimer</h3>
              <p>LegalAid is a facilitation platform. We do not provide legal advice directly. Any advice or guidance you receive is from independent lawyers and NGOs on the platform.</p>

              <h3>7. Privacy Policy</h3>
              <p>We collect your name, email, and role-specific details (location, specialization) solely to operate the platform. Your data is stored securely and is never sold to advertisers. You may request deletion of your account at any time by contacting support.</p>

              <h3>8. Governing Law</h3>
              <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Hyderabad, Telangana.</p>

              <h3>9. Changes to Terms</h3>
              <p>We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes your acceptance.</p>
            </div>

            <div className="terms-modal-footer">
              <button
                type="button"
                className="terms-agree-btn"
                onClick={() => { setAgreedToTerms(true); setShowTermsModal(false); }}
              >
                I Agree &amp; Close
              </button>
              <button
                type="button"
                className="terms-decline-btn"
                onClick={() => setShowTermsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;