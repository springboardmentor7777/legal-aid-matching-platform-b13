import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { signin } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import PageTitle from "../components/PageTitle";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // simulate login
    // localStorage.setItem("token", "12345");
    // navigate("/dashboard");
    try{
      const data = await signin({email: form.email, password: form.password});
      login(data, form.email);
      // console.log(data.role);
      // navigate("/dashboard");
      if(data.role !=="ADMIN" ){
        window.location.replace("/dashboard");
        // navigate("/dashboard");
      }else{
        navigate("/admin");
      }

    }catch(err:any){
      setError(err.response?.data?.message || "Login failed, please check your credentials");
    }finally{
      setLoading(false);
    }
  };

  return (
    <><PageTitle title="Login - Legal Aid Matching Platform" />
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">
            Login
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to continue to Legal Aid Matching Platform
          </p>
        </div>
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center font-mono">
            {error}!
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-sm" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400 text-sm" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="text-right text-sm">
            <button type="button" className="text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white bg-blue-900 hover:bg-blue-800 transition"
          >
            Sign In
          </button>
        </form>

        {/* Link to Register */}
        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            SignUp
          </span>
        </p>
      </div>
    </div></>
  );
}
