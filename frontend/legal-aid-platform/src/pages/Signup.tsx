import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth.api";
import { type Role } from "../types/auth.type";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PageTitle from "../components/PageTitle";

const roles: Role[] = ["CITIZEN", "LAWYER", "NGO"];

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CITIZEN" as Role,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    // if (!form.name) return "Name is required";
    if (
      !form.email.includes("@gmail.com") &&
      !form.email.includes("@") &&
      !form.email.includes("@yahoo.com") &&
      !form.email.includes("") &&
      !form.email.includes("/^[\s@]+@[^\s@]+\.[^\s@]+$/")
    )
      return "Invalid email";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await signup(form);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <><PageTitle title="Signup - Legal Aid Matching Platform" />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl text-blue-900 font-sans font-bold text-center mb-6">
          Welcome to Legal Aid Matching platform!
        </h2>
        <p className="text-center mb-6 text-mono text-m text-gray-700">
          We serve what you deserve
        </p>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center font-mono">
            {error}!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.name}
            onChange={handleChange}
          /> */}

          {/* <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.email}
            onChange={handleChange}
          /> */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Please enter your name"
                className="mt-1 block w-full rounded-full border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Please enter your email"
                className="mt-1 block w-full rounded-full border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.password}
            onChange={handleChange}
          /> */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="mt-1 block w-full rounded-full border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600"
                placeholder="Please enter your password"
                value={form.password}
                onChange={handleChange}
              />

              {/* Eye Icon */}
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>

            {/* {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                  )} */}
          </div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700">
            Select your Role
            </label>
          <select
            name="role"
            // className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={form.role}
            onChange={handleChange}
            defaultValue={"name"}
          >
            {/* <option value="" selected>Select a category</option> */}
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div></>
  );
}
