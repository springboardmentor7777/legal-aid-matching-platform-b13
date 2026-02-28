// import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Describe() {
  const navigate = useNavigate();
  const roles = ["CITIZEN", "LAWYER", "NGO"];
  //   const [loading, setLoading] = useState(false);
  const handleClick = (action: any) => {
    if (action === "CITIZEN") navigate("/citizen");
    if (action === "LAWYER") navigate("/lawyer");
    if (action === "NGO") navigate("/ngo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl text-blue-950 font-sans font-bold text-center mb-6">
          What describes you the best?
        </h2>
        <div className="flex flex-col font-mono justify-center items-center text-center">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleClick(role)}
              className="flex justify-center bg-gray-500 text-white m-5 rounded-full p-2 hover:bg-blue-950 text-center w-[300px] shadow-xl"
            >
              {role}
            </button>
          ))}
        </div>
        {/* <button onClick={()=>{handleClick("CITIZEN")}}>citizen</button>
        <button onClick={()=>{handleClick("LAWYER")}}>lawyer</button>
        <button onClick={()=>{handleClick("NGO")}}>ngo</button> */}
      </div>
    </div>
  );
}
