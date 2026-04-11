import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Profile() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/directory/profile/${id}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setError("Profile not available yet.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }


  if (!profile) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p>No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto">

      {/* Avatar */}
      <img
        src={`https://i.pravatar.cc/150?img=${id}`}
        alt="profile"
        className="w-20 h-20 rounded-full"
      />

      {/* Name */}
      <h2 className="text-xl font-bold mt-4">
        {profile.organization_name || profile.name || "Unnamed"}
      </h2>

      {/* Expertise */}
      <p className="text-gray-500">
        {profile.expertise || "No expertise info"}
      </p>

      {/* Location */}
      <p className="text-gray-400">
        📍 {profile.location || "Location not provided"}
      </p>

      {/* Bio */}
      <p className="mt-4">
        {profile.bio || "No description available"}
      </p>

      {/* Chat Button */}
      <button
        onClick={() => navigate(`/chat/${id}`)}
        className="mt-6 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Start Chat
      </button>

    </div>
  );
}