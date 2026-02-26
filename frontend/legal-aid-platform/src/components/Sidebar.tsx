import React from "react";
import type { Role } from "../pages/Dashboard";

interface SidebarProps {
  role: Role;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, toggleSidebar }) => {
  const menuItems: string[] = ["Home", "Notifications", "Reports", "Support"];

  return (
    <aside
      className={`bg-slate-800 text-white h-full ${
        isOpen ? "block" : "hidden"
      } lg:block lg:bg-white lg:text-blue-900 lg:border-r lg:border-blue-100`}
    >
      <div className="p-5 text-xl font-bold border-b border-slate-700 lg:border-b-0">
        Dashboard
      </div>
      {/* <hr className="bg-gray-200 border-sm" /> */}
      <hr className="border-t border-blue-200 my-4" />
      <ul className="p-4 space-y-3 lg:space-y-0 lg:flex lg:flex-col lg:space-x-0">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2"
          >
            {item}
          </li>
        ))}
      </ul>
      {/* <hr className="bg-gray-200 border-sm" /> */}
      <hr className="border-t border-blue-200 my-4" />
      <ul className="p-4 space-y-3 lg:space-y-0 lg:flex lg:flex-col lg:space-x-0">
        {role === "CITIZEN" && (
          <>
            <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2">File a Case</li>
            <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2">View Cases</li>
            <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2"><a href="/directories">Directories</a></li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
