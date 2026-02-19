import { useState } from "react";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

export default function Signup() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CITIZEN"
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f')"
        }}
      ></div>

      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-bold mb-6">Create Account</h2>

          <input
            name="name"
            placeholder="Full Name"
            className="w-full mb-4 p-3 border rounded"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border rounded"
            onChange={handleChange}
          />

          <select
            name="role"
            className="w-full mb-4 p-3 border rounded"
            onChange={handleChange}
          >
            <option value="CITIZEN">Citizen</option>
            <option value="LAWYER">Lawyer</option>
            <option value="NGO">NGO</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            onClick={() => register(form)}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Register
          </button>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
