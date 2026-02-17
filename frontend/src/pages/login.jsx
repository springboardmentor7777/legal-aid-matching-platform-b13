import React, { useState } from "react";
import InputField from "../components/inputfield";
import Button from "../components/button";
import { Mail, Lock, Chrome, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-5">

        {/* Brand */}
<div className="text-center">
  <h1
    className="text-3xl font-bold"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
    <span style={{ color: "#99272d" }}>⚖</span>{" "}
    <span style={{ color: "#36454f" }}>Legal</span>
    <span style={{ color: "#99272d" }}>Match</span>
  </h1>

  <p className="text-sm text-gray-500 mt-2">
    Create your account to continue
  </p>
</div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Email or Username
          </label>
          <div className="mt-1">
            <InputField
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <InputField
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-1">
            <button className="text-sm text-blue-700 hover:underline">
              Forgot password?
            </button>
          </div>
        </div>

        {/* Login button */}
        <Button text="Sign In" className="w-full text-white py-2 rounded-lg"
style={{ backgroundColor: "#36454f" }} onClick={handleLogin} />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 border-t"></div>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="border rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <Chrome size={18} />
            Google
          </button>

          <button className="border rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <Github size={18} />
            GitHub
          </button>
        </div>

        {/* Register hint */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
          onClick={() => navigate("/register")}
          className="font-semibold cursor-pointer hover:underline"
  style={{ color: "#36454f" }}
          >
          Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
