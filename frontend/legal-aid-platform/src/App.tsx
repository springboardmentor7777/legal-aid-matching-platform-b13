// import { useState } from 'react'

import { Outlet } from "react-router-dom"

import { Route } from "react-router-dom"
import { Routes } from "react-router-dom"
import Signup from "./pages/Signup"

function App() {
  // const [count, setCount] = useState(0)

  return (
      <Routes>
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
