import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}