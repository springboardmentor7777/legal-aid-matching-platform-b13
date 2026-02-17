// NOTE: Admin registration is disabled by design
// Admin users will be created manually in DB
import React, { useState } from "react";
import InputField from "../components/inputfield";
import Button from "../components/button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("CITIZEN");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Optional fields
  const [licenseNumber, setLicenseNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (role === "LAWYER" && !licenseNumber) {
      alert("Please enter license number");
      return;
    }

    if (role === "NGO" && !organizationName) {
      alert("Please enter organization name");
      return;
    }

    const registerData = {
      name,
      email,
      password,
      role,
      licenseNumber: role === "LAWYER" ? licenseNumber : null,
      organizationName: role === "NGO" ? organizationName : null,
    };

    console.log("Register Data:", registerData);

    // TODO: Replace with real API call when backend is ready

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

        {/* Role Selection */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Register As
          </label>

          <div className="mt-2 flex justify-between gap-2">
            {["CITIZEN", "LAWYER", "NGO"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition 
                  ${
                    role === item
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Full Name */}
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
            Email
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

        {/* Conditional Fields */}
        {role === "LAWYER" && (
          <div>
            <label className="text-sm font-semibold text-gray-700">
              License Number
            </label>
            <div className="mt-1">
              <InputField
                placeholder="Enter license number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>
          </div>
        )}

        {role === "NGO" && (
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Organization Name
            </label>
            <div className="mt-1">
              <InputField
                placeholder="Enter organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Register Button */}
        <Button text="Sign Up" onClick={handleRegister} />

        {/* Login Link */}
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
          By continuing, you agree to LegalMatch's Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  );
};

export default Register;