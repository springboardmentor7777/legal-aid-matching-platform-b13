import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { Building2, Users, Clock, CheckCircle } from 'lucide-react';

const NgoDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalBeneficiaries: 0, activeCases: 0, pendingRequests: 0, resolved: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/ngo/dashboard');
      const data = response.data || {};
      setStats({
        totalBeneficiaries: data.totalBeneficiaries || 0,
        activeCases: data.activeCases || 0,
        pendingRequests: data.pendingRequests || 0,
        resolved: data.resolved || 0,
      });
      setRecentActivity(Array.isArray(data.recentActivity) ? data.recentActivity : []);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Beneficiaries', value: stats.totalBeneficiaries, icon: Users, color: 'bg-primary-100 text-primary-600' },
    { label: 'Active Cases', value: stats.activeCases, icon: Building2, color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">NGO Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {user?.name || 'Organization'}. Here's your impact overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">{error}</div>
        ) : recentActivity.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No recent activity yet. Your updates will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-900 font-medium">{item.title || item.message}</p>
                <p className="text-xs text-slate-500 mt-1">{item.date || item.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoDashboardPage;
