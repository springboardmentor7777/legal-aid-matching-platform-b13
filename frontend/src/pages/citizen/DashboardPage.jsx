import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { FileText, Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/cases/my');
      const data = Array.isArray(response.data) ? response.data : [];
      setCases(data);
      setStats({
        total: data.length,
        pending: data.filter((c) => c.status === 'PENDING').length,
        active: data.filter((c) => c.status === 'ACTIVE' || c.status === 'IN_PROGRESS').length,
        resolved: data.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length,
      });
    } catch (err) {
      setError('Failed to load cases.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Cases', value: stats.total, icon: FileText, color: 'bg-primary-100 text-primary-600' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: 'Active', value: stats.active, icon: AlertTriangle, color: 'bg-blue-100 text-blue-600' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
  ];

  const statusBadge = (status) => {
    const styles = {
      PENDING: 'bg-amber-100 text-amber-700',
      ACTIVE: 'bg-blue-100 text-blue-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      RESOLVED: 'bg-emerald-100 text-emerald-700',
      CLOSED: 'bg-slate-100 text-slate-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-slate-500 mt-1">Here's an overview of your legal cases.</p>
        </div>
        <Link
          to="/case-submission"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Case
        </Link>
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

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Your Cases</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">{error}</div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No cases submitted yet.</p>
            <Link to="/case-submission" className="text-primary-600 font-medium text-sm hover:underline mt-2 inline-block">
              Submit your first case
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Case Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{c.caseType || c.type || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{c.description || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4">{statusBadge(c.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
