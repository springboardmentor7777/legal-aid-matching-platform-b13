import React from "react";
import { useNavigate } from "react-router-dom";

export default function MatchCard({ profile, onAccept, onReject }) {
  const navigate = useNavigate();

  const isMatched = profile.status === "MATCHED";

  return (
    <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">

      <img
        src="https://i.pravatar.cc/100"
        className="w-20 h-20 rounded-full mx-auto mb-3"
        alt="profile"
      />

      <h3 className="font-semibold text-lg">{profile.name}</h3>
      <p className="text-gray-500">{profile.role}</p>

      <div className="mt-2 text-sm bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded-full">
        Match Score: {profile.score}%
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {profile.expertise?.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-gray-400 mt-2 text-sm">📍 {profile.distance}</p>

      {/* Status */}
      <div className="mt-2 text-xs font-medium">
        Status:
        <span className="ml-1 px-2 py-1 rounded bg-gray-100">
          {profile.status}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-4">

        <button
          onClick={() => onAccept(profile.id)}
          disabled={isMatched}
          className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Accept
        </button>

        <button
          onClick={() => onReject(profile.id)}
          disabled={isMatched}
          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Reject
        </button>

        <button
          disabled={!isMatched}
          className={`px-3 py-1 rounded ${
            isMatched
              ? "bg-purple-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() =>
            isMatched && navigate(`/pages/AppointmentScheduler/${profile.id}`)
          }
        >
          Schedule Call
        </button>

        <button
          disabled={!isMatched}
          className={`px-3 py-1 rounded ${
            isMatched
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() =>
            isMatched && navigate(`/chatpage/${profile.id}`)
          }
        >
          Secure Chat
        </button>

      </div>
    </div>
  );
}
