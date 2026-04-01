import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-28 px-6">

        <h1 className="text-5xl font-bold text-gray-800">
          Know your rights
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Connect with lawyers, NGOs, and legal resources.  
          File cases, track progress, and get the help you deserve — all in one platform.
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Started →
          </Link>

          <Link
            to="/login"
            className="border px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Sign In
          </Link>

        </div>

      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-16 pb-20">

        <div className="bg-white p-8 rounded-xl shadow text-center">

          <div className="text-3xl mb-4">🔒</div>

          <h3 className="text-lg font-semibold mb-2">
            Secure & Private
          </h3>

          <p className="text-gray-600">
            Your legal matters stay confidential with enterprise-grade security.
          </p>

        </div>

        <div className="bg-white p-8 rounded-xl shadow text-center">

          <div className="text-3xl mb-4">👥</div>

          <h3 className="text-lg font-semibold mb-2">
            Expert Network
          </h3>

          <p className="text-gray-600">
            Connect with verified lawyers and NGOs ready to assist your case.
          </p>

        </div>

        <div className="bg-white p-8 rounded-xl shadow text-center">

          <div className="text-3xl mb-4">📁</div>

          <h3 className="text-lg font-semibold mb-2">
            Case Management
          </h3>

          <p className="text-gray-600">
            Track your cases from filing to resolution with real-time updates.
          </p>

        </div>

      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 pb-8 border-t pt-6">

        © 2026 LegalAid Platform. All rights reserved.

      </footer>

    </div>
  );
};

export default Home;