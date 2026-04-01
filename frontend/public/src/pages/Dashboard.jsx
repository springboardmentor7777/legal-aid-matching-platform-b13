import { useEffect, useState } from "react";
import API from "../api/axios";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats,setStats] = useState({});
  const [recentUsers,setRecentUsers] = useState([]);

  useEffect(()=>{

    const fetchDashboard = async () => {

      const statsRes = await API.get("/admin/dashboard/stats");
      const usersRes = await API.get("/admin/dashboard/recent-users");

      setStats(statsRes.data);
      setRecentUsers(usersRes.data);
    };

    if(user?.role === "ADMIN"){
      fetchDashboard();
    }

  },[user]);

  return (
    <Layout>

      {user?.role === "ADMIN" && (

        <section>

          <h1 className="text-2xl font-bold mb-6">
            Admin Dashboard
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">

            <div className="bg-white p-6 rounded-xl shadow">
              <h2>Total Users</h2>
              <p className="text-2xl font-bold">
                {stats.totalUsers}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2>Lawyers</h2>
              <p className="text-2xl font-bold">
                {stats.totalLawyers}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2>NGOs</h2>
              <p className="text-2xl font-bold">
                {stats.totalNgos}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2>Cases</h2>
              <p className="text-2xl font-bold">
                {stats.totalCases}
              </p>
            </div>

          </div>

          {/* Recent Users */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold mb-4">
              Recent Users
            </h2>

            <table className="w-full text-left">

              <thead>
                <tr className="border-b">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>

                {recentUsers.map((u)=>(
                  <tr key={u.id} className="border-b">

                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

      )}

    </Layout>
  );
};

export default Dashboard;