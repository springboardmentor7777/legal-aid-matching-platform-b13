import { useNavigate } from "react-router-dom";

export default function MatchCard({ profile }) {

  const navigate = useNavigate();

  return (
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        className="w-16 h-16 rounded-full"
      />

      <h3 className="font-semibold mt-2">{profile.organization_name}</h3>

      <p className="text-gray-500 text-sm">
        {profile.expertise}
      </p>

      <p className="text-gray-400 text-sm">
        📍 {profile.location}
      </p>

      <div className="mt-2 text-purple-600 text-sm">
        Match Score: {Math.floor(Math.random() * 100)}%
      </div>

      <button
        onClick={() => navigate(`/profile/${profile.id}`)}
className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition">
        View Profile
      </button>

    </div>
  );
}