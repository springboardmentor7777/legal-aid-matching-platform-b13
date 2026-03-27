import React from "react";
import type { Role }  from "../pages/Dashboard";
import { useNavigate } from "react-router";

interface SidebarProps {
  role: Role;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    // <aside
    //   className={`bg-slate-800 text-white h-full ${
    //     isOpen ? "block" : "hidden"
    //   } lg:block lg:bg-white lg:text-blue-900 lg:border-r lg:border-blue-100`}
    // >
    //     <aside
    //   className={`fixed inset-y-0 left-0 z-50
    //     w-64 transform transition-transform duration-300
    //     bg-white text-blue-900 border-r border-blue-100
    //     ${isOpen ? "translate-x-0" : "-translate-x-full"}
    //     lg:translate-x-0 lg:w-64 lg:block`}
    // >
    <aside
      className={`fixed inset-y-0 left-0 z-50
    w-64 transform transition-transform duration-300
    bg-white/95 backdrop-blur-md text-blue-900 border-r border-blue-100 shadow-2xl
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:w-64 lg:block lg:static lg:shadow-none lg:bg-white h-full`}
    >
      <div className="p-5 text-xl font-bold border-b border-slate-700 lg:border-b-0">
        Dashboard
      </div>
      {/* <hr className="bg-gray-200 border-sm" /> */}
      <hr className="border-t border-blue-200 my-4" />
      <ul className="p-4 space-y-3 lg:space-y-0 lg:flex lg:flex-col lg:space-x-0">
        <li
              className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2"
              onClick={() => navigate("/dashboard")}
            >
              Home
            </li>
        <li
              className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2"
              onClick={() => navigate("/pages/SupportPage")}
            >
              Support
            </li>
      </ul>
      {/* <hr className="bg-gray-200 border-sm" /> */}
      <hr className="border-t border-blue-200 my-4" />
      <ul className="p-4 space-y-3 lg:space-y-0 lg:flex lg:flex-col lg:space-x-0">
        {role === "CITIZEN" && (
          <>
            <li
              className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2"
              onClick={() => navigate("/submitcase")}
            >
              File a Case
            </li>
            <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2" onClick={()=> navigate("/mycases")}>
              View Filed Cases
            </li>
            <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2" onClick={()=> navigate("/pages/MatchingResult")}>
              Matching Result
              </li>
            <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2">
              <a href="/directories/lawyers">Lawyers Directory</a>
            </li>
            <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2">
              <a href="/directories/ngos">NGOs Directory</a>
            </li>
            <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2">
              <a href="/directories/external">External Directory</a>
            </li>
          </>
        )}
      </ul>
      <ul className="p-4 space-y-3 lg:space-y-0 lg:flex lg:flex-col lg:space-x-0">
        <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2" onClick={() => {
          //localStorage.clear();
          navigate("/chatpage");
        }}>
          Secure Chat
        </li>
       {/* <li className="p-2 rounded-md hover:bg-slate-700 cursor-pointer lg:hover:bg-blue-100 lg:px-3 lg:py-2" onClick={() => {
          //localStorage.clear();

          navigate("/pages/AppointmentScheduler/4");
        }}>
          Appointment Scheduler
        </li>*/}
      </ul>
      
    </aside>
  );
};

export default Sidebar;

