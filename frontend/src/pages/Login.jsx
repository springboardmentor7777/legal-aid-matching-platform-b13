import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Scale } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = await login({
        email: formData.email,
        password: formData.password,
      });

      const role = userData?.role?.toUpperCase();
      const onboardingDone = userData?.onboardingComplete;

      if (role === "ADMIN") navigate("/admin");
      else if ((role === "LAWYER" || role === "NGO") && !onboardingDone) navigate("/onboarding");
      else navigate("/dashboard");

    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT IMAGE */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80')",
        }}
      ></div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-900 p-4 rounded-xl mb-4">
              <Scale className="text-white w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="text-gray-500 text-sm mt-2 text-center">
              Sign in to access your LegalMatch Pro dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />

              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          {/* SOCIAL LOGIN (UI ONLY) */}
          <div className="flex gap-4">
            <button type="button" className="w-1/2 border py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </button>

            <button type="button" className="w-1/2 border py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/303128/apple-logo.svg"
                alt="Apple"
                className="w-5 h-5"
              />
              Apple
            </button>
          </div>

          {/* REGISTER LINK */}
          <p className="text-sm text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-900 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
