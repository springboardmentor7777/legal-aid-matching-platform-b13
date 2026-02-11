import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth.api";
import { type Role } from "../types/auth.type";

const roles: Role[] = ["CITIZEN", "LAWYER", "NGO", "ADMIN"];

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CITIZEN" as Role,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name) return "Name is required";
    if (!form.email.includes("@")) return "Invalid email";
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
      navigate("/signin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl text-blue-700 font-sans font-bold text-center mb-6">
          Legal Aid Matching Platform
        </h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center font-mono">{error}!</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.password}
            onChange={handleChange}
          />

          <select
            name="role"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.role}
            onChange={handleChange}
          >
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
            onClick={() => navigate("/signin")}
            className="text-blue-500 cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
