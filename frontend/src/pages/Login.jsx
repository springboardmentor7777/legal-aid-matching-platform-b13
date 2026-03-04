import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await login(form);

      if (user.role === "ADMIN") navigate("/dashboard/admin");
      else if (user.role === "LAWYER") navigate("/dashboard/lawyer");
      else if (user.role === "NGO") navigate("/dashboard/ngo");
      else navigate("/dashboard/citizen");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="hidden md:flex w-1/2 bg-slate-800"></div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-900 p-4 rounded-xl mb-4">
              <Scale className="text-white w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 text-center">
              Welcome to LegalMatch Pro
            </h1>
            <p className="text-sm text-gray-500 text-center mt-1">
              Connect, collaborate, and access pro bono legal assistance.
            </p>
          </div>

          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <Link
              to="/login"
              className="w-1/2 text-center py-2 rounded-full bg-white shadow text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="w-1/2 text-center py-2 rounded-full text-sm font-medium text-gray-500"
            >
              Register
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="emailOrUsername"
                placeholder="Email or Username"
                required
                value={form.emailOrUsername}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              <div
                className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm text-blue-900 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          <div className="flex gap-4">
            <button className="w-1/2 border rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </button>

            <button className="w-1/2 border rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/303128/apple-logo.svg"
                alt="Apple"
                className="w-5 h-5"
              />
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}