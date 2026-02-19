import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="h-screen bg-gray-100">
      <div>
        <nav className="bg-white p-5 shadow-lg flex items-center justify-between">
          <div className="text-blue-900 font-bold text-2xl">Profile</div>
          <div className="flex gap-5">
            <a
              href="/dashboard"
              className="bg-blue-900 p-2 text-white rounded-lg shadow-xl hover:bg-blue-500"
            >
              Dashboard
            </a>
            <a
              href="/"
              className="bg-red-500 p-2 text-white rounded-lg"
              onClick={() => {
                localStorage.clear;
              }}
            >
              Logout
            </a>
          </div>
        </nav>
      </div>
      <section className="">
        <div>
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Welcome, {user?.username}!
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                Profile Information
              </h3>
              <p className="text-gray-700">Name: {user?.username} (<span>{user?.role?.toLowerCase()}</span>)</p>
              <p className="text-gray-700">
                Email: {user?.email || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
