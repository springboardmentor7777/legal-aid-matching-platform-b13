import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data);

      // role-based redirect
      if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      }
      if (res.data.user.role === "CITIZEN") {
        navigate("/citizen/dashboard");
      }
      if (res.data.user.role === "LAWYER") {
        navigate("/lawyer/dashboard");
      }
      if (res.data.user.role === "NGO") {
        navigate("/ngo/dashboard");
      }
    } catch (e:any) {
      setError(e.response.data?.detail || "login failed!");
      // navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  //   const [form, setForm] = useState({
  //     email: "",
  //     password: "",
  //     role: "",
  //   });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //   const handleChange = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  //   ) => {
  //     setForm({ ...form, [e.target.name]: e.target.value });
  //   };

  //   const validate = () => {
  //     if (!form.email.includes("@")) return "invalid email";
  //     if (!form.password) return "invalid password";
  //     return null;
  //   };

  const [showPassword, setShowPassword] = useState(false);
  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     const validator = validate();
  //     if (validator) {
  //       setError(validator);
  //       return;
  //     }
  //     try {
  //       setLoading(true);
  //       // await citizensignin(form);
  //       navigate("/auth/dashboard");
  //     } catch (e: any) {
  //       setError(e.response?.data?.message || "login failed");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-center text-black font-mono mb-5">
            Login
          </h1>
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center font-mono">
              {error}!
            </div>
          )}
          <form
            action=""
            className="flex flex-col items-center space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
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
                  className="mt-1 block w-[300px] rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="mt-1 block w-[300px] rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 w-[100px] p-1 rounded-md text-center text-white hover:bg-blue-900 cursor-pointer"
            >
              {loading? "loading...":"Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
