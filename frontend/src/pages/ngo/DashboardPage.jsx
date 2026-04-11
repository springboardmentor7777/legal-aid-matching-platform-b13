import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import {
  Building2, Users, Clock, CheckCircle, Settings,
  X, ChevronDown, FileText, AlertTriangle, Save
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'Reviewing', label: 'Reviewing', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { value: 'Notice Sent', label: 'Notice Sent', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { value: 'Hearing Scheduled', label: 'Hearing Scheduled', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  { value: 'Resolved', label: 'Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
];

const NgoDashboardPage = () => {
  const { user } = useAuth();
  const [activeCases, setActiveCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [manageModal, setManageModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [formStatus, setFormStatus] = useState('Reviewing');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchActiveCases();
  }, []);

  const fetchActiveCases = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/api/matches/my-active');
      setActiveCases(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch active cases:', err);
      setError('Failed to load active cases.');
    } finally {
      setLoading(false);
    }
  };

  const openManageModal = (match) => {
    setSelectedMatch(match);
    setFormStatus(match.internalStatus || 'Reviewing');
    setFormNotes(match.providerNotes || '');
    setSaveSuccess(false);
    setManageModal(true);
  };

  const closeModal = () => {
    setManageModal(false);
    setSelectedMatch(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!selectedMatch) return;
    try {
      setSaving(true);
      setSaveSuccess(false);
      await API.put(`/api/matches/${selectedMatch.id}/manage`, {
        internalStatus: formStatus,
        providerNotes: formNotes,
      });
      // Update local state
      setActiveCases((prev) =>
        prev.map((m) =>
          m.id === selectedMatch.id
            ? { ...m, internalStatus: formStatus, providerNotes: formNotes }
            : m
        )
      );
      setSaveSuccess(true);
      setTimeout(() => closeModal(), 1200);
    } catch (err) {
      console.error('Failed to update case:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusOption = (value) =>
    STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];

  // Stats computed from active cases
  const stats = {
    activeCases: activeCases.length,
    reviewing: activeCases.filter((c) => c.internalStatus === 'Reviewing').length,
    hearingScheduled: activeCases.filter((c) => c.internalStatus === 'Hearing Scheduled').length,
    resolved: activeCases.filter((c) => c.internalStatus === 'Resolved').length,
  };

  const statCards = [
    { label: 'Active Cases', value: stats.activeCases, icon: Building2, color: 'bg-blue-100 text-blue-600' },
    { label: 'Under Review', value: stats.reviewing, icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: 'Hearings Scheduled', value: stats.hearingScheduled, icon: AlertTriangle, color: 'bg-violet-100 text-violet-600' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div>
      {/* Header — NO "+ New Case" button for providers */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">NGO Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {user?.name || user?.username || 'Organization'}. Here's your impact overview.
        </p>
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

      {/* Active Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Active Cases</h2>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {activeCases.length} case{activeCases.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">{error}</div>
        ) : activeCases.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No active cases yet.</p>
            <p className="text-slate-400 text-sm mt-1">
              Accepted case matches will appear here for tracking.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Case Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Beneficiary</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Match Score</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeCases.map((match) => {
                  const statusOpt = getStatusOption(match.internalStatus);
                  return (
                    <tr key={match.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">{match.caseType || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{match.citizenName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{match.caseLocation || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${match.matchScore}%`,
                                backgroundColor: match.matchScore >= 80 ? '#10b981' : match.matchScore >= 60 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{Math.round(match.matchScore)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ color: statusOpt.color, backgroundColor: statusOpt.bg }}
                        >
                          {statusOpt.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {match.createdAt ? new Date(match.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openManageModal(match)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-200"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manage Case Modal */}
      {manageModal && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Manage Case</h3>
                <p className="text-sm text-slate-500 mt-0.5">{selectedMatch.caseType} — {selectedMatch.citizenName}</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Case Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Case Summary</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedMatch.caseDescription || selectedMatch.whatHappened || 'No description available.'}
                </p>
              </div>

              {/* Internal Status Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Internal Status</label>
                <div className="relative">
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all pr-10"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Provider Notes Textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Provider Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Add internal notes, action items, or observations..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDashboardPage;
