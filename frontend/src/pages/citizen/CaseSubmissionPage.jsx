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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
        caseType: formData.caseType,     // ✅ FIXED
        description: formData.description,
        urgency: formData.urgency,
        location: formData.location
      };

      console.log("Sending payload:", payload);

      await API.post('/api/cases', payload);

      setSuccess('Case submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit case.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit a New Case</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          name="caseType"
          value={formData.caseType}
          onChange={handleChange}
          required
          className="w-full border p-2"
        >
          <option value="">Select case type</option>
          {caseTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe your issue"
          className="w-full border p-2"
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2"
        />

        <div>
          {['LOW','MEDIUM','HIGH','CRITICAL'].map(level => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData(prev => ({...prev, urgency: level}))}
              className={`mr-2 p-2 ${formData.urgency === level ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {level}
            </button>
          ))}
        </div>

        <input type="file" multiple onChange={handleFileChange} />

        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2">
          {loading ? "Submitting..." : "Submit Case"}
        </button>

      </form>
    </div>
  );
};

export default CaseSubmissionPage;