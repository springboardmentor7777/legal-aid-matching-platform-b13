import React from "react";
import type { Role } from "../pages/Dashboard";

interface NavbarProps {
  name: string;
  role: Role;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ name, role, toggleSidebar }) => {
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

        <span className="text-xl font-bold text-blue-900">LEGAL AID MATCHING PLATFORM</span>
      </div>

      {/* Right: Profile */}
      <div className="ml-auto flex items-center space-x-4">
        <span className="text-blue-900 font-medium">{name}</span>
        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-900 font-bold">
          {name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
