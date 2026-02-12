// import { useState } from 'react'

import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Signup from "./pages/Signup";
// import DashBoard from "./pages/LandingPage";
import LandingPage from "./pages/LandingPage";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<LandingPage/>}/>
    </Routes>
  );
}

export default App;
