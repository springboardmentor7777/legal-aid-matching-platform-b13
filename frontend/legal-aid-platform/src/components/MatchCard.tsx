import React from "react";

export default function MatchCard({ profile, onAccept, onReject }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">

      <img
        src="https://i.pravatar.cc/100"
        className="w-20 h-20 rounded-full mx-auto mb-3"
      />

      <h3 className="font-semibold text-lg">{profile.name}</h3>
      <p className="text-gray-500">{profile.role}</p>

      <div className="mt-2 text-sm bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded-full">
        Match Score: {profile.score}%
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {profile.expertise.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-gray-400 mt-2 text-sm">📍 {profile.distance}</p>

      <div className="flex justify-center gap-2 mt-4">

        <button
          onClick={() => onAccept(profile.id)}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Accept
        </button>

        <button
          onClick={() => onReject(profile.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Reject
        </button>
        <br/>
        <button
          className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-3 py-1 rounded w-full sm:w-auto"
          onClick={() => navigate(`/pages/AppointmentScheduler/${profile.id}`)} 
        >
          Schedule Call
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-3 py-1 rounded w-full sm:w-auto"
          onClick={() => navigate(`/chatpage/${profile.id}`)} 
        >
          Secure Chat
        </button>
      </div>
    </div>
  );
}
