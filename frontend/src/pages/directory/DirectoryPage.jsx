import { useState, useEffect } from 'react';
import API from '../../api/axios';
import {
  Search,
  MapPin,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
  CheckCircle,
  X,
} from 'lucide-react';

const PRACTICE_AREAS = [
  'Family Law', 'Property Disputes', 'Human Rights', 'Environmental Law',
  'Corporate Law', 'Litigation', 'Criminal Defense', 'Victim Support', 'Intellectual Property',
];

const LANGUAGES = [
  'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati',
];

const DirectoryPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  // Filters
  const [roleFilter, setRoleFilter] = useState('Lawyer');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [availability, setAvailability] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(100);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortBy, setSortBy] = useState('Relevance');

  useEffect(() => {
    fetchProfiles();
  }, [roleFilter, currentPage, selectedAreas, verifiedOnly, maxDistance, selectedLanguages, sortBy]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);

      const endpoint =
        roleFilter === 'Lawyer'
          ? '/api/directory/lawyers'
          : '/api/directory/ngos';

      const params = {
        page: currentPage - 1,
        size: 12,
        search: searchQuery || undefined,
        location: location || undefined,
        verified: verifiedOnly || undefined,
        maxDistance: maxDistance !== 100 ? maxDistance : undefined,
        practiceAreas: selectedAreas.length > 0 ? selectedAreas.join(',') : undefined,
        languages: selectedLanguages.length > 0 ? selectedLanguages.join(',') : undefined,
        sort: sortBy !== 'Relevance' ? sortBy : undefined,
      };

      const response = await API.get(endpoint, { params });

      const data = response.data;

      if (Array.isArray(data)) {
        setProfiles(data);
        setTotalPages(1);
      } else if (data?.content) {
        setProfiles(data.content);
        setTotalPages(data.totalPages || 1);
      } else {
        setProfiles([]);
      }
    } catch (err) {
      setError('Failed to load directory.');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProfiles();
  };

  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      {showFilters && (
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
              <div className="flex gap-2">
                {['Lawyer', 'NGO'].map((role) => (
                  <button
                    key={role}
                    onClick={() => { setRoleFilter(role); setCurrentPage(1); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      roleFilter === role
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Practice Areas */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Practice Areas</label>
              <div className="flex flex-wrap gap-2">
                {PRACTICE_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      selectedAreas.includes(area)
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Availability</label>
              <div className="relative">
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">Select availability</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Busy</option>
                  <option value="AWAY">Away</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Verified Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Verified Status</label>
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    verifiedOnly ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      verifiedOnly ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Max Distance */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Max Distance: {maxDistance} km
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-primary-600"
              />
            </div>

            {/* Languages */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Languages</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      selectedLanguages.includes(lang)
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option>Relevance</option>
                  <option>Distance</option>
                  <option>Rating</option>
                  <option>Name</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-6">
          {!showFilters && (
            <button
              onClick={() => setShowFilters(true)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <form onSubmit={handleSearch} className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or specialization..."
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
              />
            </div>
            <div className="relative w-52">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
            >
              Search
            </button>
          </form>

          {/* View Toggle */}
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Matching Profiles ({profiles.length})
          </h2>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="m-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">{error}</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No profiles found. Try adjusting your filters.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                    {profile.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{profile.name}</h3>
                    <p className="text-sm text-slate-500">{profile.role || profile.type}</p>
                  </div>
                  {profile.verified && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                </div>
                {profile.practiceAreas && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(Array.isArray(profile.practiceAreas) ? profile.practiceAreas : [profile.practiceAreas]).slice(0, 3).map((area) => (
                      <span key={area} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location || 'Location not specified'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold flex-shrink-0">
                  {profile.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{profile.name}</h3>
                    {profile.verified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <p className="text-sm text-slate-500">{profile.role || profile.type}</p>
                </div>
                {profile.practiceAreas && (
                  <div className="flex-shrink-0 flex flex-wrap gap-1 max-w-xs">
                    {(Array.isArray(profile.practiceAreas) ? profile.practiceAreas : [profile.practiceAreas]).slice(0, 2).map((area) => (
                      <span key={area} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-slate-500 flex items-center gap-1 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                  {profile.location || 'N/A'}
                </p>
                <button className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors flex-shrink-0">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  currentPage === page ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryPage;
