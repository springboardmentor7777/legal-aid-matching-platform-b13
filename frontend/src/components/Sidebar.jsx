import { Link } from "react-router-dom";

export default function Sidebar({ children }) {

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5">

        <h2 className="text-lg font-bold mb-6">
          LegalMatch Pro
        </h2>

        <nav className="flex flex-col gap-3 text-sm">

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/case-submission">Submit Case</Link>
          <Link to="/directory">Directory</Link>
          <Link to="/matches">Matches</Link>
          <Link to="/profile">Profile</Link>

        </nav>

      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}