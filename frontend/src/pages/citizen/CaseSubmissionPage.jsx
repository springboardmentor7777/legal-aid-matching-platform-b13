import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { MapPin, AlertCircle, Upload, ChevronDown } from 'lucide-react';

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
    'Family Law','Property Disputes','Human Rights','Environmental Law',
    'Corporate Law','Criminal','Litigation','Victim Support',
    'Intellectual Property','Other',
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
        location: formData.location
      };

      await API.post('/api/cases', payload);

      setSuccess('Case submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit case.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Submit a New Case</h1>
        <p className="text-slate-500">Describe your issue to get matched with a lawyer/NGO</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-5">

        {/* Case Type */}
        <div>
          <label className="block font-medium mb-1">Case Type</label>
          <div className="relative">
            <select
              name="caseType"
              value={formData.caseType}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 appearance-none"
            >
              <option value="">Select case type</option>
              {caseTypes.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border rounded-lg p-3"
            placeholder="Explain your issue..."
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-lg pl-10 p-3"
              placeholder="Enter city"
            />
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block font-medium mb-1">Urgency</label>
          <div className="flex gap-2">
            {['LOW','MEDIUM','HIGH','CRITICAL'].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData(prev => ({...prev, urgency: level}))}
                className={`px-4 py-2 rounded-lg ${
                  formData.urgency === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block font-medium mb-1">Documents</label>
          <div className="border-dashed border-2 rounded-lg p-4 text-center">
            <Upload className="mx-auto mb-2 text-gray-400" />
            <input type="file" multiple onChange={(e)=>setFiles([...e.target.files])}/>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Submitting..." : "Submit Case"}
        </button>

      </form>
    </div>
  );
};

export default CaseSubmissionPage;