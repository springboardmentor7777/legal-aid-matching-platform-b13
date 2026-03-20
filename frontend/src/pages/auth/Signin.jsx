import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function Signin() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Runs when user clicks Sign In
  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      console.log("Login API Response:", result);

      if (!response.ok) {
        alert(result.message || "Invalid email or password");
        return;
      }

      // Save user info using AuthContext
      login(result.accessToken, result.name, result.role);
      
      localStorage.setItem("refreshToken", result.refreshToken);

      alert("Login successful!");

      // Redirect based on role
      if (result.role === "ADMIN") {
        navigate("/admin");
      } else if (result.role === "LAWYER") {
        navigate("/lawyer");
      } else if (result.role === "NGO") {
        navigate("/ngo");
      } else {
        navigate("/citizen");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Email
            </label>

            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.email?.message}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Password
            </label>

            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signin;
