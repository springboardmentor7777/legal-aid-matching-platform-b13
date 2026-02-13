// import { useState } from 'react'

import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Signup from "./pages/Signup";
// import DashBoard from "./pages/LandingPage";
import LandingPage from "./pages/LandingPage";
import Admin from "./pages/Admin";
import Describe from "./pages/Describe";
// import Citizen from "./pages/Login";
import Login from "./pages/Login";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/describe" element={<Describe/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;
