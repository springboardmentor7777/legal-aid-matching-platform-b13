import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError]= useState(null);
  const navigate = useNavigate();

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
    }
  };

  if (!profile) {
    if (error) {
      return (
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">

      <img
        src={`https://i.pravatar.cc/150?img=${id}`}
        className="w-20 h-20 rounded-full"
      />

      <h2 className="text-xl font-bold mt-4">
        {profile.organization_name}
      </h2>

      <p className="text-gray-500">
        {profile.expertise}
      </p>

      <p className="text-gray-400">
        📍 {profile.location}
      </p>

      <p className="mt-4">
        {profile.bio}
      </p>

      <button
        onClick={() => navigate(`/chat/${id}`)}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        Start Chat
      </button>

    </div>
  );
}