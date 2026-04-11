import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Star, MapPin, Briefcase, CheckCircle, XCircle, MessageCircle,
  Calendar, Zap, Eye, X, FileText, Clock, Globe, AlertTriangle, Shield
} from "lucide-react";

export default function MatchingResults() {
  const [matches, setMatches] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [viewCase, setViewCase] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const userRole = user?.role || "CITIZEN";
  const isProvider = userRole === "LAWYER" || userRole === "NGO";

  useEffect(() => {
    fetchMatches();
    if (!isProvider) fetchCases();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/matches/my");
      setMatches(res.data?.content || res.data || []);
    } catch (error) {
      console.error("Failed to fetch matches", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await API.get("/api/cases/my");
      setCases(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch cases", error);
    }
  };

  const generateMatches = async (caseId) => {
    try {
      setGenerating(caseId);
      await API.post(`/api/matches/generate/${caseId}`);
      await fetchMatches();
    } catch (error) {
      console.error("Failed to generate matches", error);
    } finally {
      setGenerating(null);
    }
  };

  const acceptMatch = async (matchId) => {
    try {
      await API.put(`/api/matches/${matchId}/accept`);
      await fetchMatches();
    } catch (error) {
      console.error("Failed to accept match", error);
    }
  };

  const rejectMatch = async (matchId) => {
    try {
      await API.put(`/api/matches/${matchId}/reject`);
      await fetchMatches();
    } catch (error) {
      console.error("Failed to reject match", error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-amber-600 bg-amber-50 border-amber-200";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return "Excellent";
    if (score >= 50) return "Good";
    return "Fair";
  };

  const statusStyles = {
    PENDING: "bg-amber-100 text-amber-800 border border-amber-200",
    ACCEPTED: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    REJECTED: "bg-red-100 text-red-800 border border-red-200",
  };

  const unmatchedCases = cases.filter(c =>
    c.status === 'SUBMITTED' || c.status === 'OPEN' || c.status === 'PENDING'
  );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Matching Results</h1>
        <p className="text-slate-500 mt-1">
          {isProvider
            ? "Cases matched to your expertise and location"
            : "Matches between your cases and legal professionals"}
        </p>
      </div>

      {/* Generate Matches for Unmatched Cases (Citizens only) */}
      {!isProvider && unmatchedCases.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6" />
            <h2 className="text-lg font-bold">Generate Matches</h2>
          </div>
          <p className="text-blue-100 text-sm mb-4">These cases haven't been matched yet. Click to find suitable lawyers and NGOs.</p>
          <div className="flex flex-wrap gap-3">
            {unmatchedCases.map(c => (
              <button key={c.id} onClick={() => generateMatches(c.id)} disabled={generating === c.id}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl text-sm font-semibold hover:bg-white/30 transition-all disabled:opacity-50">
                {generating === c.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {c.caseType} — {c.location || "No Location"}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">No matches found yet</p>
          <p className="text-slate-400 text-sm mt-1">
            {isProvider
              ? "New cases will appear here when they match your expertise"
              : "Submit a case and generate matches to find legal professionals"}
          </p>
        </div>
      )}

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
            {/* Header with Score */}
            <div className="p-5 pb-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    {isProvider ? m.citizenName : m.providerName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyles[m.status] || ''}`}>
                      {m.status}
                    </span>
                  </div>
                </div>
                <div className={`text-center px-3 py-2 rounded-xl border ${getScoreColor(m.matchScore)}`}>
                  <div className="text-xl font-black">{Math.round(m.matchScore)}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">{getScoreLabel(m.matchScore)}</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{m.providerExpertise || m.caseType}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{m.providerLocation || m.caseLocation || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Star className="w-4 h-4 text-slate-400" />
                  <span>Case: {m.caseType}</span>
                </div>
                {m.urgency && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                    <span>Urgency: {m.urgency}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-2">
              {m.status === "PENDING" && (
                <div className="flex gap-2">
                  <button onClick={() => acceptMatch(m.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm">
                    <CheckCircle className="w-4 h-4" /> Accept
                  </button>
                  <button onClick={() => rejectMatch(m.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-200">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}

              {m.status === "ACCEPTED" && (
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/chat/${m.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
                    <MessageCircle className="w-4 h-4" /> Chat
                  </button>
                  <button onClick={() => navigate(`/appointments?matchId=${m.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-200">
                    <Calendar className="w-4 h-4" /> Book
                  </button>
                </div>
              )}

              {m.status === "REJECTED" && (
                <p className="text-center text-sm text-slate-400 py-2">Match declined</p>
              )}

              {/* View Full Case — ONLY for LAWYER/NGO */}
              {isProvider && (
                <button onClick={() => setViewCase(m)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all border border-slate-200">
                  <Eye className="w-4 h-4" /> View Full Case
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View Full Case Modal */}
      {viewCase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewCase(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Full Case Details
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">Case #{viewCase.caseId} — {viewCase.caseType}</p>
              </div>
              <button onClick={() => setViewCase(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">

              {/* Score & Status */}
              <div className="flex items-center gap-4">
                <div className={`text-center px-4 py-2 rounded-xl border ${getScoreColor(viewCase.matchScore)}`}>
                  <div className="text-2xl font-black">{Math.round(viewCase.matchScore)}%</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">{getScoreLabel(viewCase.matchScore)}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{viewCase.caseType}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyles[viewCase.status] || ''}`}>
                      {viewCase.status}
                    </span>
                    {viewCase.urgency && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        viewCase.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        viewCase.urgency === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        viewCase.urgency === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {viewCase.urgency}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* What Happened */}
              {viewCase.whatHappened && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> What Happened
                  </h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{viewCase.whatHappened}</p>
                </div>
              )}

              {/* Desired Outcome */}
              {viewCase.desiredOutcome && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wide mb-2">Desired Outcome</h3>
                  <p className="text-sm text-slate-700">{viewCase.desiredOutcome}</p>
                </div>
              )}

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {viewCase.opposingPartyName && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Opposing Party</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{viewCase.opposingPartyName}</p>
                  </div>
                )}
                {viewCase.courtName && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Court</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{viewCase.courtName}</p>
                  </div>
                )}
                {viewCase.preferredLanguage && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><Globe className="w-3 h-3" /> Language</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{viewCase.preferredLanguage}</p>
                  </div>
                )}
                {viewCase.incidentDate && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><Calendar className="w-3 h-3" /> Incident Date</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{new Date(viewCase.incidentDate).toLocaleDateString('en-IN')}</p>
                  </div>
                )}
                {viewCase.caseLocation && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{viewCase.caseLocation}</p>
                  </div>
                )}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Citizen</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{viewCase.citizenName}</p>
                </div>
              </div>

              {/* Upcoming Court Date */}
              {viewCase.hasUpcomingCourtDate && viewCase.upcomingCourtDate && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">Upcoming Court Date</p>
                    <p className="text-sm text-amber-700">{new Date(viewCase.upcomingCourtDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              )}

              {/* Evidence */}
              {viewCase.evidenceSummary && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Evidence Summary
                  </h3>
                  <p className="text-sm text-slate-600">{viewCase.evidenceSummary}</p>
                </div>
              )}

              {/* FIR Document */}
              {viewCase.firDocumentName && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">Attached Document</p>
                    <p className="text-sm text-amber-700">{viewCase.firDocumentName}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setViewCase(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all">
                Close
              </button>
              {viewCase.status === "PENDING" && (
                <>
                  <button onClick={() => { acceptMatch(viewCase.id); setViewCase(null); }}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Accept Match
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}