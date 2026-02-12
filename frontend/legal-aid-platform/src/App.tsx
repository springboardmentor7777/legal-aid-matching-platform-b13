// import { useState } from 'react'

import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Signup from "./pages/Signup";
// import DashBoard from "./pages/LandingPage";
import LandingPage from "./pages/LandingPage";
import Admin from "./pages/Admin";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/admin" element={<Admin/>}/>
    </Routes>
  );
}

export default App;
