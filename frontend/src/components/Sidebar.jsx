import { Link, useLocation } from "react-router-dom";
import {
  Scale,
  User,
  Folder,
  Search,
  Handshake,
  BarChart2,
  Settings,
  MessageCircle
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItem = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
        location.pathname === to
          ? "bg-gray-100 font-medium"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-900 p-2 rounded-lg">
          <Scale className="text-white w-5 h-5" />
        </div>
        <span className="font-semibold text-gray-900">
          LegalMatch Pro
        </span>
      </div>

      <div className="space-y-2">
        {navItem("/dashboard/admin", "Profile Management", User)}
        {navItem("/case-submission", "Case Submission", Folder)}
        {navItem("/directory", "Directory", Search)}

        {navItem("/matches", "Matches", Handshake)}
        {navItem("/chat", "Secure Chat", MessageCircle)}

        {navItem("/impact-dashboard", "Impact Dashboard", BarChart2)}
        {navItem("/dashboard/admin", "Admin Panel", Settings)}
      </div>
    </div>
  );
}