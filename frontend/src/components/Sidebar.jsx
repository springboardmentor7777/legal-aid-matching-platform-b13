import { X, LayoutDashboard, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Sidebar({ open, setOpen }) {
  const { logout } = useAuth();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      <aside
        className={`fixed md:static z-50 w-64 bg-white shadow h-full transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <div className="p-4 flex justify-between md:hidden">
          <h2 className="font-bold">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <Link to="/profile" className="flex items-center gap-2 hover:text-blue-600">
            <User size={18} /> Profile
          </Link>

          <button
            onClick={logout}
            className="text-red-500 mt-6"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
