import { useState, useEffect } from 'react';
import API from '../../api/axios';
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  Database,
  FileText,
  Settings,
  ChevronDown,
  Upload,
  Trash2,
  Plus,
  BarChart3,
} from 'lucide-react';

const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState('verification');

  const tabs = [
    { id: 'verification', label: 'User Verification', icon: Users },
    { id: 'ingestion', label: 'Directory Ingestion', icon: Database },
    { id: 'logs', label: 'System Logs', icon: FileText },
    { id: 'settings', label: 'App Settings', icon: Settings },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-slate-500 mt-1">
          Manage platform users, data ingestion, system health, and application settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'verification' && <UserVerificationTab />}
      {activeTab === 'ingestion' && <DirectoryIngestionTab />}
      {activeTab === 'logs' && <SystemLogsTab />}
      {activeTab === 'settings' && <AppSettingsTab />}

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-slate-400">
        © 2025 LegalMatch Pro. All rights reserved.
      </div>
    </div>
  );
};

/* ======================== USER VERIFICATION TAB ======================== */
const UserVerificationTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/admin/verifications');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load verification queue.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      setActionLoading(userId);
      await API.put(`/api/admin/verify/${userId}`, { status: action });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: action === 'APPROVE' ? 'Approved' : 'Rejected' } : u))
      );
    } catch (err) {
      alert('Failed to update user status.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadge = (status) => {
    const s = status?.toLowerCase();
    const styles =
      s === 'pending'
        ? 'bg-amber-100 text-amber-700 border-amber-200'
        : s === 'approved'
        ? 'bg-slate-100 text-slate-700 border-slate-200'
        : 'bg-red-100 text-red-700 border-red-200';
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">User Verification Queue</h2>
          <p className="text-sm text-slate-500">Review and approve/reject profiles for Lawyers and NGOs.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No users in the verification queue.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.submittedDate || user.createdAt
                      ? new Date(user.submittedDate || user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">{statusBadge(user.status || 'Pending')}</td>
                  <td className="px-6 py-4 text-right">
                    {(user.status?.toLowerCase() === 'pending' || !user.status) ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(user.id, 'APPROVE')}
                          disabled={actionLoading === user.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(user.id, 'REJECT')}
                          disabled={actionLoading === user.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button className="text-sm text-slate-500 hover:text-slate-700 font-medium">
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ======================== DIRECTORY INGESTION TAB ======================== */
const DirectoryIngestionTab = () => {
  const [sourceType, setSourceType] = useState('csv');
  const [sourceName, setSourceName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [useOAuth, setUseOAuth] = useState(false);
  const [mappings, setMappings] = useState([
    { external: 'NGO Name', internal: 'Organization Name' },
    { external: 'Contact Person', internal: 'Primary Contact Name' },
    { external: 'Email', internal: 'Contact Email' },
  ]);
  const [runMode, setRunMode] = useState('manual');
  const [conflictResolution, setConflictResolution] = useState('skip');
  const [previewData, setPreviewData] = useState([]);
  const [lastRunSummary, setLastRunSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIngestionStatus();
  }, []);

  const fetchIngestionStatus = async () => {
    try {
      const response = await API.get('/api/admin/ingestion/status');
      const data = response.data || {};
      if (data.lastRun) setLastRunSummary(data.lastRun);
      if (Array.isArray(data.preview)) setPreviewData(data.preview);
    } catch (err) {
      // Ingestion status not available yet
    }
  };

  const addMapping = () => {
    setMappings([...mappings, { external: '', internal: '' }]);
  };

  const removeMapping = (index) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const updateMapping = (index, field, value) => {
    setMappings(mappings.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const handleRunImport = async () => {
    setLoading(true);
    try {
      await API.post('/api/admin/ingestion/run', {
        sourceType, sourceName, apiUrl, apiKey, useOAuth, mappings, runMode, conflictResolution,
      });
      alert('Import started successfully!');
      fetchIngestionStatus();
    } catch (err) {
      alert('Failed to start import.');
    } finally {
      setLoading(false);
    }
  };

  const externalFields = ['NGO Name', 'Contact Person', 'Email', 'Phone', 'Address', 'City', 'State', 'Type', 'Services'];
  const internalFields = ['Organization Name', 'Primary Contact Name', 'Contact Email', 'Contact Phone', 'Address', 'City', 'State', 'Type', 'Services Offered'];

  return (
    <div className="space-y-6">
      {/* 1. Source Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary-600" />
          1. Source Configuration
        </h3>
        <p className="text-sm text-slate-500 mb-4">Choose the type of data source and provide connection details.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Source Name</label>
            <input
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g., National NGO Registry"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data Source Type</label>
            <div className="relative">
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="csv">CSV Upload</option>
                <option value="api">REST API</option>
                <option value="database">External Database</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {sourceType === 'csv' && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Drag & drop CSV file or click to browse</p>
            <input type="file" accept=".csv" className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload" className="inline-block mt-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium hover:bg-slate-200 cursor-pointer">
              Choose File
            </label>
          </div>
        )}

        {sourceType === 'api' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API Endpoint URL</label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/data"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Use OAuth 2.0</label>
              <button
                onClick={() => setUseOAuth(!useOAuth)}
                className={`relative w-11 h-6 rounded-full transition-colors ${useOAuth ? 'bg-primary-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${useOAuth ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API Key"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-slate-400 mt-1">This key will be securely stored and encrypted.</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Map Data Fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary-600" />
          3. Map Data Fields
        </h3>
        <p className="text-sm text-slate-500 mb-4">Align external data fields to LegalMatch Pro's internal schema.</p>

        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-3 items-center text-sm font-semibold text-slate-600">
            <span>External Field</span>
            <span />
            <span>Internal Field</span>
            <span />
          </div>
          {mappings.map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_1fr_auto] gap-3 items-center">
              <div className="relative">
                <select
                  value={m.external}
                  onChange={(e) => updateMapping(i, 'external', e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">Select field</option>
                  {externalFields.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <span className="text-slate-400">→</span>
              <div className="relative">
                <select
                  value={m.internal}
                  onChange={(e) => updateMapping(i, 'internal', e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">Select field</option>
                  {internalFields.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <button onClick={() => removeMapping(i)} className="p-2 text-slate-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addMapping}
          className="mt-3 w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 font-medium hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Another Mapping
        </button>
      </div>

      {/* 4. Data Preview & Validation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          4. Data Preview & Validation
        </h3>
        <p className="text-sm text-slate-500 mb-4">Review sample rows and check for data validity after mapping.</p>

        {previewData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-2 font-semibold text-slate-600">ID</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-600">Type</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-600">Status</th>
                  <th className="text-right px-4 py-2 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">{row.id}</td>
                    <td className="px-4 py-3 text-slate-900">{row.name}</td>
                    <td className="px-4 py-3 text-slate-600">{row.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.status === 'Matched' ? 'bg-slate-100 text-slate-700' : 'bg-primary-100 text-primary-700 border border-primary-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-6">No preview data available. Configure source and run import.</p>
        )}
      </div>

      {/* 5. Conflict Resolution */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">5. Conflict Resolution</h3>
        <p className="text-sm text-slate-500 mb-4">Define how to handle records that match existing entries.</p>
        <div className="space-y-3">
          {[
            { value: 'skip', label: 'Skip duplicate records' },
            { value: 'update', label: 'Update existing records with new data' },
            { value: 'create', label: 'Create new record (even if a potential duplicate is found)' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="conflict"
                value={opt.value}
                checked={conflictResolution === opt.value}
                onChange={() => setConflictResolution(opt.value)}
                className="w-4 h-4 accent-primary-600"
              />
              <span className="text-sm text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 6. Schedule & Run */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">6. Schedule & Run</h3>
        <p className="text-sm text-slate-500 mb-4">Define when and how often this ingestion job should run.</p>
        <div className="space-y-3 mb-6">
          {[
            { value: 'manual', label: 'Run Manually (run once now)' },
            { value: 'scheduled', label: 'Schedule Import (automatic, recurring)' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="runMode"
                value={opt.value}
                checked={runMode === opt.value}
                onChange={() => setRunMode(opt.value)}
                className="w-4 h-4 accent-primary-600"
              />
              <span className="text-sm text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Last Run Summary */}
        {lastRunSummary && (
          <div className="border border-slate-200 rounded-xl p-6 mb-4">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              Last Run Summary
            </h4>
            <p className="text-sm text-slate-500 mb-4">Overview of the most recent directory import.</p>
            <div className="grid grid-cols-3 gap-6 text-center mb-3">
              <div>
                <p className="text-2xl font-bold text-slate-900">{lastRunSummary.imported || 0}</p>
                <p className="text-sm text-slate-500">Imported</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{lastRunSummary.updated || 0}</p>
                <p className="text-sm text-slate-500">Updated</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{lastRunSummary.failed || 0}</p>
                <p className="text-sm text-slate-500">Failed</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-right">Last run completed on: {lastRunSummary.completedAt || 'N/A'}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button className="px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
            Save Job
          </button>
          <button
            onClick={handleRunImport}
            disabled={loading}
            className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? 'Running...' : 'Run Import Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ======================== SYSTEM LOGS TAB ======================== */
const SystemLogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await API.get('/api/admin/logs');
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      // Logs endpoint may not exist yet
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">System Logs</h3>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : logs.length === 0 ? (
        <p className="text-center text-slate-500 py-12">No system logs available.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
          {logs.map((log, i) => (
            <div key={i} className="px-3 py-2 bg-slate-50 rounded text-slate-700">
              <span className="text-slate-400 mr-2">[{log.timestamp || log.date}]</span>
              <span className={log.level === 'ERROR' ? 'text-red-600' : log.level === 'WARN' ? 'text-amber-600' : 'text-slate-700'}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ======================== APP SETTINGS TAB ======================== */
const AppSettingsTab = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await API.get('/api/admin/settings');
      setSettings(response.data || {});
    } catch (err) {
      // Settings endpoint may not exist yet
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Application Settings</h3>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application Name</label>
            <input
              type="text"
              defaultValue={settings.appName || 'LegalMatch Pro'}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
            <input
              type="email"
              defaultValue={settings.supportEmail || ''}
              placeholder="support@legalmatchpro.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">Maintenance Mode</label>
              <p className="text-xs text-slate-500">Temporarily disable the application for maintenance.</p>
            </div>
            <button className="relative w-11 h-6 rounded-full bg-slate-200">
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow" />
            </button>
          </div>
          <div className="flex justify-end">
            <button className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
