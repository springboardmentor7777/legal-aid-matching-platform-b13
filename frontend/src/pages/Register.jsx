import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Left */}
      <div className="hidden md:flex w-1/2 bg-slate-800 items-center justify-center">
        <div className="text-white text-3xl font-bold">
          LegalMatch Pro
        </div>
      </div>

      {/* Right */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">

        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-200">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-blue-900 rounded-md flex items-center justify-center text-white text-xl">
              ⚖
            </div>
            <h2 className="mt-4 text-2xl font-bold text-blue-900">
              Register
            </h2>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <Link
              to="/login"
              className="flex-1 text-center py-2 text-sm text-gray-500"
            >
              Login
            </Link>
            <button className="flex-1 bg-white rounded-full py-2 text-sm shadow-sm">
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                ✉
              </span>
              <input
                type="email"
                required
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                🔒
              </span>
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition"
            >
              Create Account
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}
