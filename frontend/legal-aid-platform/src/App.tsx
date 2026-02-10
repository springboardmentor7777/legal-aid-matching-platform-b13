// import { useState } from 'react'

import { Outlet } from "react-router-dom"



function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </>
  )
}

export default App
