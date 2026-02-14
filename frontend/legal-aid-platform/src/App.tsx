// import { useState } from 'react'

import { Navigate, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Signup from "./pages/Signup";
// import DashBoard from "./pages/LandingPage";
import LandingPage from "./pages/LandingPage";
import Admin from "./pages/Admin";
// import Describe from "./pages/Describe";
// import Citizen from "./pages/Login";
import Login from "./pages/Login";
import Dashboard ,  { type User }from "./pages/Dashboard"; 
import type { JSX } from "react";


function App() {
  // const [count, setCount] = useState(0)
  
// Example user (replace with real auth logic)
const user: User = {
  name: "John Doe",
  role: "NGO", // Must match Role type: "CITIZEN" | "LAWYER" | "NGO" | "ADMIN"
  token: "12345", // Simulated token
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return user && user.token ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/admin" element={<Admin/>}/>
      {/* <Route path="/describe" element={<Describe/>}/> */}
      <Route path="/login" element={<Login/>}/>

       <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard user={user} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
