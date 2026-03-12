import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { FileText, MapPin, AlertCircle, Upload, ChevronDown } from 'lucide-react';

const CaseSubmissionPage = () => {
  const [formData, setFormData] = useState({
    caseType: '',
    description: '',
    urgency: 'MEDIUM',
    location: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const caseTypes = [
    'Family Law',
    'Property Disputes',
    'Human Rights',
    'Environmental Law',
    'Corporate Law',
    'Criminal Defense',
    'Litigation',
    'Victim Support',
    'Intellectual Property',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        caseType: formData.caseType,
        description: formData.description,
        urgency: formData.urgency,
        location: formData.location,
      };

      await API.post('/api/cases', payload);
      setSuccess('Case submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Submit a New Case</h1>
        <p className="text-slate-500 mt-1">Provide details about your legal issue to get matched with a lawyer or NGO.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
        {/* Case Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Case Type</label>
          <div className="relative">
            <select
              name="caseType"
              value={formData.caseType}
              onChange={handleChange}
              required
              className="w-full appearance-none px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
            >
              <option value="">Select case type</option>
              {caseTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your legal issue in detail..."
            required
            rows={5}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urgency Level</label>
          <div className="flex gap-3">
            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, urgency: level }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.urgency === level
                    ? level === 'CRITICAL'
                      ? 'bg-red-600 text-white'
                      : level === 'HIGH'
                      ? 'bg-orange-500 text-white'
                      : level === 'MEDIUM'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your city or area"
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Supporting Documents (Optional)</label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 mb-2">Drag and drop files here, or click to browse</p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Choose Files
            </label>
            {files.length > 0 && (
              <div className="mt-3 space-y-1">
                {files.map((f, i) => (
                  <p key={i} className="text-sm text-slate-600">{f.name}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit Case'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseSubmissionPage;
