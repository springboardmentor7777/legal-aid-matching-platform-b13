import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "CITIZEN",
  });

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
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
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
              Create Your Account
            </h1>
          </div>

          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <Link
              to="/login"
              className="w-1/2 text-center py-2 rounded-full text-sm font-medium text-gray-500"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="w-1/2 text-center py-2 rounded-full bg-white shadow text-sm font-medium"
            >
              Register
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                value={form.fullName}
                onChange={handleChange}
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
            >
              <option value="CITIZEN">Citizen</option>
              <option value="LAWYER">Lawyer</option>
              <option value="NGO">NGO</option>
            </select>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition"
            >
              {isLoading ? "Registering..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}