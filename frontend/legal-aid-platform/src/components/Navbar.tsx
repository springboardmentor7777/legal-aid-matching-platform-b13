import React from "react";
import type { Role } from "../pages/Dashboard";
import Dropdown from "./Dropdown";
// import { MoreHorizontal } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import {FaSignOutAlt} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  name: string;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ name, toggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-blue-100 shadow-md flex items-center p-4 sticky top-0 z-50">
      {/* Left: Legal Aid */}
      <div className="flex items-center space-x-4">
        {/* Hamburger for mobile */}
        <button
          onClick={toggleSidebar}
          className="text-blue-900 focus:outline-none lg:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <span className="text-l font-bold text-blue-900">LEGAL AID MATCHING PLATFORM</span>
      </div>

      {/* Right: Profile */}
      <div className="ml-auto flex items-center space-x-3">
        {/* <span className="text-blue-900 font-medium">{name}</span> */}
        {/* <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-900 font-bold">
          {name.charAt(0)}
        </div> */}
        {/* <button className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-900 font-bold" onClick={()=>{}}>
          {name.charAt(0)}
        </button> */}
        <Dropdown items={[
          {label:<p className="flex items-center gap-[50px]">Profile <span className="">{<FaUserCircle></FaUserCircle>}</span> </p>, onClick:()=>{navigate("/profile")}},
          {label:<p className="flex items-center gap-[50px]">Logout <span className="">{<FaSignOutAlt></FaSignOutAlt>}</span> </p>, onClick: ()=>{localStorage.clear(); navigate("/")}}
          ]}>
          <button className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-900 font-bold" onClick={()=>{}}>
          {name.charAt(0)}
          {/* <MoreHorizontal size={20} /> */}
        </button>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
