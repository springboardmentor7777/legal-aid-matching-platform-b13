import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import {
  Scale, MapPin, Briefcase, FileText, Upload, CheckCircle,
  ChevronDown, Building2, Shield, Award
} from 'lucide-react';

const OnboardingPage = () => {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [jurisdictions, setJurisdictions] = useState([]);
  const [cities, setCities] = useState([]);

  const isLawyer = user?.role === 'LAWYER';
  const isNGO = user?.role === 'NGO';

  const [formData, setFormData] = useState({
    state: '',
    city: '',
    officeAddress: '',
    // Lawyer
    practiceAreas: '',
    barCouncilLicense: '',
    licenseDocumentName: '',
    // NGO
    focusAreas: '',
    ngoDarpanId: '',
    registrationCertName: '',
  });

  useEffect(() => {
    fetchJurisdictions();
  }, []);

  useEffect(() => {
    if (formData.state) {
      const j = jurisdictions.find(j => j.state === formData.state);
      setCities(j?.cities || []);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.state]);

  const fetchJurisdictions = async () => {
    try {
      const res = await API.get('/api/jurisdictions');
      setJurisdictions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch jurisdictions', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (fieldName) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file.name }));
    }
  };

  const practiceAreaOptions = [
    'Family Law', 'Criminal', 'Property Disputes', 'Human Rights',
    'Environmental Law', 'Corporate Law', 'Litigation', 'Intellectual Property',
    'Labour & Employment', 'Consumer Protection', 'Cyber Crime',
    'Tax Law', 'Constitutional Law', 'Victim Support',
  ];

  const toggleArea = (area, field) => {
    const current = formData[field] ? formData[field].split(',').map(a => a.trim()).filter(Boolean) : [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    setFormData(prev => ({ ...prev, [field]: updated.join(',') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    if (!formData.state || !formData.city) {
      setError('State and City are required.');
      setLoading(false);
      return;
    }

    if (isLawyer && !formData.barCouncilLicense) {
      setError('Bar Council License Number is required.');
      setLoading(false);
      return;
    }

    if (isNGO && !formData.ngoDarpanId) {
      setError('NGO Darpan ID is required.');
      setLoading(false);
      return;
    }

    try {
      await API.put('/api/profiles/onboarding', formData);
      setSuccess('Onboarding completed! Redirecting to dashboard...');
      completeOnboarding();
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete onboarding.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white placeholder-slate-400";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="text-slate-500 mt-2">
            {isLawyer ? 'Set up your lawyer profile to start receiving case matches' :
             'Set up your NGO profile to connect with citizens seeking help'}
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 space-y-6">

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
            </div>
          )}

          {/* ── Location Section ── */}
          <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 space-y-4">
            <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Office Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>State *</label>
                <div className="relative">
                  <select name="state" value={formData.state} onChange={handleChange} required className={inputClass}>
                    <option value="">Select state</option>
                    {jurisdictions.map(j => (
                      <option key={j.state} value={j.state}>{j.state}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <div className="relative">
                  <select name="city" value={formData.city} onChange={handleChange} required className={inputClass} disabled={!formData.state}>
                    <option value="">Select city</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Office Address</label>
              <textarea name="officeAddress" value={formData.officeAddress} onChange={handleChange}
                rows={2} className={inputClass} placeholder="Complete office address" />
            </div>
          </div>

          {/* ── Lawyer-Specific Fields ── */}
          {isLawyer && (
            <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 space-y-4">
              <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-wide flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Practice Details
              </h3>

              <div>
                <label className={labelClass}>Practice Areas *</label>
                <div className="flex flex-wrap gap-2">
                  {practiceAreaOptions.map(area => {
                    const selected = formData.practiceAreas.split(',').map(a => a.trim()).includes(area);
                    return (
                      <button key={area} type="button" onClick={() => toggleArea(area, 'practiceAreas')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          selected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'
                        }`}>
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={labelClass}>Bar Council License Number *</label>
                <div className="relative">
                  <Award className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                  <input type="text" name="barCouncilLicense" value={formData.barCouncilLicense}
                    onChange={handleChange} required className={`${inputClass} pl-10`}
                    placeholder="e.g., MAH/1234/2020" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Bar License Document</label>
                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 text-center bg-indigo-50/30 hover:bg-indigo-50 transition-colors cursor-pointer relative">
                  <Upload className="mx-auto mb-2 text-indigo-400 w-6 h-6" />
                  {formData.licenseDocumentName ? (
                    <p className="text-sm text-indigo-700 font-medium">{formData.licenseDocumentName}</p>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 font-medium">Click to upload Bar License</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                    </>
                  )}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect('licenseDocumentName')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {/* ── NGO-Specific Fields ── */}
          {isNGO && (
            <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 space-y-4">
              <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Organization Details
              </h3>

              <div>
                <label className={labelClass}>Focus Areas *</label>
                <div className="flex flex-wrap gap-2">
                  {practiceAreaOptions.map(area => {
                    const selected = formData.focusAreas.split(',').map(a => a.trim()).includes(area);
                    return (
                      <button key={area} type="button" onClick={() => toggleArea(area, 'focusAreas')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          selected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400'
                        }`}>
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={labelClass}>NGO Darpan ID *</label>
                <div className="relative">
                  <Award className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                  <input type="text" name="ngoDarpanId" value={formData.ngoDarpanId}
                    onChange={handleChange} required className={`${inputClass} pl-10`}
                    placeholder="e.g., MH/2017/0123456" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Registration Certificate</label>
                <div className="border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center bg-emerald-50/30 hover:bg-emerald-50 transition-colors cursor-pointer relative">
                  <Upload className="mx-auto mb-2 text-emerald-400 w-6 h-6" />
                  {formData.registrationCertName ? (
                    <p className="text-sm text-emerald-700 font-medium">{formData.registrationCertName}</p>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 font-medium">Click to upload Registration Certificate</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                    </>
                  )}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect('registrationCertName')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" /> Complete Onboarding
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
