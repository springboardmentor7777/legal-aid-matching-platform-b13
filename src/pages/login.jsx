import React, { useState } from "react";
import InputField from "../components/inputfield";
import Button from "../components/button";
import { Mail, Lock, Chrome, Github } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-5">

        {/* Brand */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-800">LegalMatch</h1>
          <p className="text-sm text-gray-500 mt-1">
            Access pro bono legal assistance
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
        <Button text="Sign In" onClick={handleLogin} />

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
          <span className="text-blue-700 font-semibold cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
