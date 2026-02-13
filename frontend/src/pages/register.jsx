import React, { useState } from "react";
import InputField from "../components/inputfield";
import Button from "../components/button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);

    // after success → go to login
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-5">

        {/* Brand */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-800">LegalMatch</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create your account to continue
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <div className="mt-1">
            <InputField
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Confirm Password
          </label>
          <div className="mt-1">
            <InputField
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Register button */}
        <Button text="Sign Up" onClick={handleRegister} />

        {/* Login hint */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-700 font-semibold cursor-pointer"
          >
            Sign In
          </span>
        </p>

        {/* Terms */}
        <p className="text-xs text-center text-gray-400">
          By continuing, you agree to LegalMatch's Terms of Service and
          Privacy Policy.
        </p>

      </div>
    </div>
  );
};

export default Register;