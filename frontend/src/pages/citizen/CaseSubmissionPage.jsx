import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import {
  MapPin, AlertCircle, Upload, ChevronDown, ChevronRight, ChevronLeft,
  User, Scale, FileText, Shield, IndianRupee, CheckCircle, Calendar,
  Globe, Clock, AlertTriangle
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Case Details', icon: Scale },
  { id: 2, title: 'Parties & Jurisdiction', icon: Shield },
  { id: 3, title: 'Additional Info', icon: FileText },
  { id: 4, title: 'Evidence & Submit', icon: CheckCircle },
];

const caseTypes = [
  'Family Law', 'Property Disputes', 'Human Rights', 'Environmental Law',
  'Corporate Law', 'Criminal', 'Litigation', 'Victim Support',
  'Intellectual Property', 'Labour & Employment', 'Consumer Protection',
  'Cyber Crime', 'Tax Law', 'Constitutional Law', 'Other',
];

const languages = [
  'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada',
  'Bengali', 'Gujarati', 'Malayalam', 'Punjabi', 'Urdu', 'Odia',
];

const CaseSubmissionPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [jurisdictions, setJurisdictions] = useState([]);
  const [cities, setCities] = useState([]);
  const [courts, setCourts] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1 - Case Details (mandatory)
    caseType: '',
    whatHappened: '',
    whenDidItHappen: '',
    incidentDate: '',
    desiredOutcome: '',
    preferredLanguage: 'English',
    urgency: 'MEDIUM',
    location: '',

    // Step 2 - Parties & Jurisdiction
    petitionerName: '',
    petitionerContact: '',
    petitionerAddress: '',
    opposingPartyName: '',
    jurisdictionState: '',
    jurisdictionCity: '',
    courtName: '',

    // Step 3 - Conditionals
    hasUpcomingCourtDate: false,
    upcomingCourtDate: '',
    hasPreviousLegalAction: false,
    previousLegalActionDetails: '',
    caseFiledAgainstYou: false,
    firDocumentName: '',

    // Step 4 - Evidence & Financial
    financialEligibility: false,
    annualIncome: '',
    firNumber: '',
    firDate: '',
    policeStation: '',
    evidenceSummary: '',
    documentsDescription: '',
    description: '',
    reliefSought: '',
  });

  useEffect(() => {
    fetchJurisdictions();
  }, []);

  useEffect(() => {
    if (formData.jurisdictionState) {
      const j = jurisdictions.find(j => j.state === formData.jurisdictionState);
      setCities(j?.cities || []);
      setCourts(j?.courts || []);
      setFormData(prev => ({ ...prev, jurisdictionCity: '', courtName: '' }));
    }
  }, [formData.jurisdictionState]);

  useEffect(() => {
    if (formData.jurisdictionState && formData.jurisdictionCity) {
      fetchCourtsForCity(formData.jurisdictionState, formData.jurisdictionCity);
    }
  }, [formData.jurisdictionCity]);

  const fetchJurisdictions = async () => {
    try {
      const res = await API.get('/api/jurisdictions');
      setJurisdictions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch jurisdictions', err);
    }
  };

  const fetchCourtsForCity = async (state, city) => {
    try {
      const res = await API.get(`/api/jurisdictions/${encodeURIComponent(state)}/${encodeURIComponent(city)}`);
      setCourts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch courts', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileSelect = (fieldName) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file.name }));
    }
  };

  // Step 1 validation
  const validateStep1 = () => {
    if (!formData.caseType) { setError('Case Type is required.'); return false; }
    if (!formData.whatHappened || formData.whatHappened.trim().length < 10) {
      setError('Please describe what happened (at least 10 characters).'); return false;
    }
    if (!formData.desiredOutcome || formData.desiredOutcome.trim().length < 5) {
      setError('Please describe your desired outcome.'); return false;
    }
    return true;
  };

  const nextStep = () => {
    setError('');
    if (step === 1 && !validateStep1()) return;
    if (step < 4) setStep(step + 1);
  };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const payload = {
        ...formData,
        description: formData.whatHappened || formData.description || 'See case details',
        annualIncome: formData.annualIncome ? parseFloat(formData.annualIncome) : null,
        firDate: formData.firDate || null,
        incidentDate: formData.incidentDate || null,
        upcomingCourtDate: formData.hasUpcomingCourtDate ? (formData.upcomingCourtDate || null) : null,
        previousLegalActionDetails: formData.hasPreviousLegalAction ? formData.previousLegalActionDetails : null,
        firDocumentName: formData.caseFiledAgainstYou ? formData.firDocumentName : null,
        location: formData.jurisdictionCity
          ? `${formData.jurisdictionCity}, ${formData.jurisdictionState}`
          : formData.location,
      };
      await API.post('/api/cases', payload);
      setSuccess('Case submitted successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit case.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white placeholder-slate-400";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const sectionCard = "space-y-5";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Submit a New Case</h1>
        <p className="text-slate-500 mt-1">Complete all mandatory fields in Step 1 before proceeding</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => {
                  if (s.id <= step || (s.id === step + 1 && (step !== 1 || validateStep1()))) {
                    setError('');
                    setStep(s.id);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  step === s.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : step > s.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{s.title}</span>
                <span className="lg:hidden">{s.id}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${step > s.id ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl border border-slate-200 p-6 md:p-8">

        {/* ═══ STEP 1: Case Details (ALL MANDATORY) ═══ */}
        {step === 1 && (
          <div className={sectionCard}>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-blue-600" /> Case Information
            </h2>
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              All fields marked with * are mandatory. You must complete this step before proceeding.
            </p>

            <div>
              <label className={labelClass}>Case Type *</label>
              <div className="relative">
                <select name="caseType" value={formData.caseType} onChange={handleChange} required className={inputClass}>
                  <option value="">Select case type</option>
                  {caseTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className={labelClass}>What Happened? *</label>
              <textarea name="whatHappened" value={formData.whatHappened} onChange={handleChange}
                required rows={4} className={inputClass}
                placeholder="Describe what happened in detail. Be as specific as possible..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>When Did It Happen?</label>
                <input type="text" name="whenDidItHappen" value={formData.whenDidItHappen}
                  onChange={handleChange} className={inputClass}
                  placeholder="e.g., Last month, 3 years ago, ongoing" />
              </div>
              <div>
                <label className={labelClass}>Incident Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                  <input type="date" name="incidentDate" value={formData.incidentDate}
                    onChange={handleChange} className={`${inputClass} pl-10`} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Desired Outcome *</label>
              <textarea name="desiredOutcome" value={formData.desiredOutcome} onChange={handleChange}
                required rows={3} className={inputClass}
                placeholder="What specific legal outcome or resolution are you seeking?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Preferred Language</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                  <select name="preferredLanguage" value={formData.preferredLanguage}
                    onChange={handleChange} className={`${inputClass} pl-10`}>
                    {languages.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Urgency Level</label>
                <div className="flex gap-2">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(level => (
                    <button key={level} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        formData.urgency === level
                          ? level === 'CRITICAL' ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                            : level === 'HIGH' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                            : level === 'MEDIUM' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Parties & Jurisdiction ═══ */}
        {step === 2 && (
          <div className={sectionCard}>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" /> Parties & Jurisdiction
            </h2>

            {/* Petitioner */}
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 space-y-4">
              <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide">Your Details (Petitioner)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="petitionerName" value={formData.petitionerName}
                    onChange={handleChange} className={inputClass} placeholder="Your full legal name" />
                </div>
                <div>
                  <label className={labelClass}>Contact Number</label>
                  <input type="text" name="petitionerContact" value={formData.petitionerContact}
                    maxLength={10}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData(prev => ({ ...prev, petitionerContact: digits }));
                    }}
                    className={inputClass} placeholder="10-digit mobile number" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <textarea name="petitionerAddress" value={formData.petitionerAddress}
                  onChange={handleChange} rows={2} className={inputClass} placeholder="Complete address" />
              </div>
            </div>

            {/* Opposing Party */}
            <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100 space-y-4">
              <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wide">Opposing Party</h3>
              <p className="text-xs text-amber-700 -mt-2">This is strictly OPTIONAL. Leave blank or write "Unknown" if not applicable.</p>
              <div>
                <label className={labelClass}>Opposing Party Name</label>
                <input type="text" name="opposingPartyName" value={formData.opposingPartyName}
                  onChange={handleChange} className={inputClass}
                  placeholder="Leave blank or write 'Unknown'" />
              </div>
            </div>

            {/* Jurisdiction - Cascading */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Jurisdiction & Court
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>State</label>
                  <div className="relative">
                    <select name="jurisdictionState" value={formData.jurisdictionState}
                      onChange={handleChange} className={inputClass}>
                      <option value="">Select state</option>
                      {jurisdictions.map(j => (
                        <option key={j.state} value={j.state}>{j.state}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <div className="relative">
                    <select name="jurisdictionCity" value={formData.jurisdictionCity}
                      onChange={handleChange} className={inputClass}
                      disabled={!formData.jurisdictionState}>
                      <option value="">Select city</option>
                      {cities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Court</label>
                  <div className="relative">
                    <select name="courtName" value={formData.courtName}
                      onChange={handleChange} className={inputClass}
                      disabled={!formData.jurisdictionCity}>
                      <option value="">Select court</option>
                      {courts.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Conditional / Additional Info ═══ */}
        {step === 3 && (
          <div className={sectionCard}>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" /> Additional Information
            </h2>

            {/* Upcoming Court Date */}
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="hasUpcomingCourtDate" checked={formData.hasUpcomingCourtDate}
                    onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                <span className="text-sm text-slate-700 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Do you have an upcoming court date?
                </span>
              </div>
              {formData.hasUpcomingCourtDate && (
                <div className="animate-in slide-in-from-top-2">
                  <label className={labelClass}>Court Date</label>
                  <input type="date" name="upcomingCourtDate" value={formData.upcomingCourtDate}
                    onChange={handleChange} className={inputClass} />
                </div>
              )}
            </div>

            {/* Previous Legal Action */}
            <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="hasPreviousLegalAction" checked={formData.hasPreviousLegalAction}
                    onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                <span className="text-sm text-slate-700 font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  Have you taken any previous legal action?
                </span>
              </div>
              {formData.hasPreviousLegalAction && (
                <div className="animate-in slide-in-from-top-2">
                  <label className={labelClass}>Previous Legal Action Details</label>
                  <textarea name="previousLegalActionDetails" value={formData.previousLegalActionDetails}
                    onChange={handleChange} rows={3} className={inputClass}
                    placeholder="Describe previous complaints, cases, mediations, or any legal steps you have taken..." />
                </div>
              )}
            </div>

            {/* Case Filed Against You */}
            <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100 space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="caseFiledAgainstYou" checked={formData.caseFiledAgainstYou}
                    onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                <span className="text-sm text-slate-700 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Has a case/FIR been filed or registered against you?
                </span>
              </div>
              {formData.caseFiledAgainstYou && (
                <div className="animate-in slide-in-from-top-2 space-y-3">
                  <label className={labelClass}>Upload FIR / Legal Notice</label>
                  <div className="border-2 border-dashed border-amber-200 rounded-xl p-4 text-center bg-amber-50/30 hover:bg-amber-50 transition-colors cursor-pointer relative">
                    <Upload className="mx-auto mb-2 text-amber-400 w-6 h-6" />
                    {formData.firDocumentName ? (
                      <p className="text-sm text-amber-700 font-medium">{formData.firDocumentName}</p>
                    ) : (
                      <>
                        <p className="text-sm text-slate-600 font-medium">Click to upload FIR or Legal Notice</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                      </>
                    )}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect('firDocumentName')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>
              )}
            </div>

            {/* Financial Eligibility */}
            <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 space-y-4">
              <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide flex items-center gap-2">
                <IndianRupee className="w-4 h-4" /> Financial Eligibility (Pro Bono)
              </h3>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="financialEligibility" checked={formData.financialEligibility}
                    onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                <span className="text-sm text-slate-700 font-medium">I am eligible for free legal aid (Pro Bono)</span>
              </div>
              <div>
                <label className={labelClass}>Annual Household Income (₹)</label>
                <input type="number" name="annualIncome" value={formData.annualIncome}
                  onChange={handleChange} className={inputClass} placeholder="e.g., 300000" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: Evidence & Submit ═══ */}
        {step === 4 && (
          <div className={sectionCard}>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" /> Evidence & Final Details
            </h2>

            {/* FIR Details */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">FIR / Police Report (if applicable)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>FIR Number</label>
                  <input type="text" name="firNumber" value={formData.firNumber}
                    onChange={handleChange} className={inputClass} placeholder="e.g., 0123/2024" />
                </div>
                <div>
                  <label className={labelClass}>FIR Date</label>
                  <input type="date" name="firDate" value={formData.firDate}
                    onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Police Station</label>
                  <input type="text" name="policeStation" value={formData.policeStation}
                    onChange={handleChange} className={inputClass} placeholder="Police station name" />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Evidence Summary</label>
              <textarea name="evidenceSummary" value={formData.evidenceSummary}
                onChange={handleChange} rows={3} className={inputClass}
                placeholder="Summarize key evidence: witness statements, photographs, documents..." />
            </div>

            <div>
              <label className={labelClass}>Documents Description</label>
              <textarea name="documentsDescription" value={formData.documentsDescription}
                onChange={handleChange} rows={3} className={inputClass}
                placeholder="List documents you have: affidavits, legal notices, contracts, property deeds..." />
            </div>

            <div>
              <label className={labelClass}>Relief Sought</label>
              <textarea name="reliefSought" value={formData.reliefSought}
                onChange={handleChange} rows={3} className={inputClass}
                placeholder="What specific legal relief or outcome are you seeking?" />
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <Upload className="mx-auto mb-2 text-slate-400 w-8 h-8" />
              <p className="text-sm text-slate-600 font-medium">Drag & drop supporting files or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB each</p>
              <input type="file" multiple className="hidden" />
            </div>

            {/* Case Summary Preview */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-3">Case Summary Preview</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500">Type:</span> <span className="font-medium text-slate-900">{formData.caseType || '—'}</span></div>
                <div><span className="text-slate-500">Urgency:</span> <span className="font-medium text-slate-900">{formData.urgency}</span></div>
                <div><span className="text-slate-500">State:</span> <span className="font-medium text-slate-900">{formData.jurisdictionState || '—'}</span></div>
                <div><span className="text-slate-500">Court:</span> <span className="font-medium text-slate-900">{formData.courtName || '—'}</span></div>
                <div><span className="text-slate-500">Language:</span> <span className="font-medium text-slate-900">{formData.preferredLanguage}</span></div>
                <div><span className="text-slate-500">Opposing Party:</span> <span className="font-medium text-slate-900">{formData.opposingPartyName || 'Unknown'}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button type="button" onClick={prevStep} disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              step === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'
            }`}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-sm text-slate-400 font-medium">Step {step} of 4</span>

          {step < 4 ? (
            <button type="button" onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Submit Case
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CaseSubmissionPage;