import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen }) {
  const { user } = useAuth();

  const menus = {
    ADMIN: [
      { name: "Admin Panel", path: "/dashboard/admin" },
      { name: "Profile", path: "/profile" }
    ],
    LAWYER: [
      { name: "Matches", path: "/dashboard/lawyer" },
      { name: "Profile", path: "/profile" }
    ],
    NGO: [
      { name: "Impact", path: "/dashboard/ngo" },
      { name: "Profile", path: "/profile" }
    ],
    CITIZEN: [
      { name: "Case Submission", path: "/dashboard/citizen" },
      { name: "Profile", path: "/profile" }
    ]
  };

  return (
    <aside className={`
      ${isOpen ? "block" : "hidden"}
      md:block
      w-64 bg-white border-r border-gray-200 min-h-screen p-6
    `}>

      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-900 rounded-md"></div>
        <span className="font-bold text-blue-900">
          LegalMatch Pro
        </span>
      </div>

      <nav className="space-y-2">
        {menus[user.role].map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${
                isActive
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
